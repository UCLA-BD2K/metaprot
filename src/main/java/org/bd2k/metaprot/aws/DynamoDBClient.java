package org.bd2k.metaprot.aws;

import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.KeysAndAttributes;
import com.amazonaws.services.dynamodbv2.model.WriteRequest;
import org.bd2k.metaprot.util.Globals;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Exposes more specific functionality for interfacing with
 * DynamoDB, other than vanilla CRUD operations. Note that this class
 * should be used internally within the DAO class(es).
 *
 * Created by allengong on 9/22/16.
 */
@Component
@PropertySource("classpath:application.properties")
@DependsOn({"Globals"})
public class DynamoDBClient {

    @Value("${aws.dynamo.endpoint}")
    private String dynamoEndpoint;

    @Value("${aws.access.key}")
    private String accessKey;

    @Value("${aws.secret.access.key}")
    private String secretAccessKey;

    // initialized via post construct
    private static BasicAWSCredentials credentials;
    private static DynamoDB dynamoDB;

    // non-autowired members
    private final int MAX_DYNAMODB_ITEM_SIZE = Globals.getMaxDynamoDBItemSize();
    private final int ATTRIBUTE_LENGTH = 16 + 11;    // length of attribute names, 16 for chunkKeycontentchunkNumber

    @PostConstruct
    private void initializeInstance() {
        // after bean instantiation + property injection, initialize these values
        credentials = new BasicAWSCredentials(accessKey, secretAccessKey);
        dynamoDB = new DynamoDB(new AmazonDynamoDBClient(credentials).withEndpoint(dynamoEndpoint));
    }

    public DynamoDBClient() {}

    /**
     * Uploads 'content' in max 400KB chunks to the specified table. Chunks have
     * [keyPrefix] as their partition keys and [chunkNumber] as their sort keys,
     * where chunkNumber is 0-based. In addition, chunk content is encoded as binary,
     * so in order to "reverse" the chunking process, utilize the other get() methods in
     * this class.
     *
     * Chunks have the following representation in Dynamo:
     *
     * {
     *     chunkKey: "...",         // partition key
     *     chunkNumber: #,          // sort key
     *     content: "..."           // binary content
     * }
     *
     * This method may throw an Exception if uploading fails (most commonly due to
     * exceeding provisioned Dynamo capacity) It is advised to catch and react appropriately.
     *
     * @param tableName the name of the table to upload to, e.g. Metaprot-Task-Chunk
     * @param keyPrefix the partition key (sort key is automcatically generated), e.g. task token
     * @param content the content to chunk and upload
     * @return int the number of chunks uploaded
     */
    public int uploadAsChunks(String tableName, String keyPrefix, String content) throws Exception {
        // handler for writing items to table
        TableWriteItems tableWriteItems = new TableWriteItems(tableName);

        // get number of needed chunks
        byte[] contentBytes = content.getBytes("UTF-8");
        int numChunksNeeded = new Double(Math.ceil((contentBytes.length)/(MAX_DYNAMODB_ITEM_SIZE*1.0))).intValue();

        System.out.println("num chunks needed: " + numChunksNeeded);

        // upload each chunk
        int bytesRemaining = contentBytes.length;
        List<Item> chunks = new ArrayList<>();
        byte[] currByteArr;
        int fromIndex = 0;
        int toIndex;

        System.out.println("Total bytes: " + bytesRemaining);

        int i = 0;
        while(bytesRemaining > 0) {
            // create the chunk key to use, and get its length; key is composite so it's the partition+sort key
            String chunkKey = keyPrefix;
            String chunkNumber = i+"";
            int chunkKeySize = chunkNumber.getBytes().length + chunkKey.getBytes().length; // keys are composite

            // compute amount of bytes in byte[] for current chunk
            int delta = MAX_DYNAMODB_ITEM_SIZE - chunkKeySize - ATTRIBUTE_LENGTH; // amount of available space for the current chunk

            // only use as much space as needed!!
            if (bytesRemaining < delta) {
                delta = bytesRemaining;
            }

            toIndex = fromIndex + delta;

            System.out.println("From: " + fromIndex + " to: " + toIndex );
            currByteArr = Arrays.copyOfRange(contentBytes, fromIndex, toIndex);

            Item currChunk = new Item()
                    .withPrimaryKey("chunkKey", chunkKey, "chunkNumber", i)
                    .withBinary("content", currByteArr);

            chunks.add(currChunk);

            bytesRemaining -= delta;
            fromIndex += delta;

            i++;
        }

        if (bytesRemaining > 0) {
            throw new Exception("Something went wrong with uploading chunk: " + bytesRemaining);
        }

        // register chunks
        tableWriteItems.withItemsToPut(chunks);

        // write to Dynamo
        System.out.println("PUTing items to Dynamo...");

        try {
            int exponentialBackoffFactor = 1500;    // time to sleep before next dynamo request

            // get results, note that this may NOT contain ALL results!
            BatchWriteItemOutcome outcome = dynamoDB.batchWriteItem(tableWriteItems);

            // per AWS documentation
            do {
                // Check for unprocessed keys which could happen if you exceed provisioned throughput

                Map<String, List<WriteRequest>> unprocessedItems = outcome.getUnprocessedItems();

                if (outcome.getUnprocessedItems().size() == 0) {
                    System.out.println("No unprocessed items found");
                } else {
                    // sleep for x seconds to avoid exceeding provisioned capacity
                    System.out.println("Sleeping for" + exponentialBackoffFactor + "seconds...");
                    Thread.sleep(exponentialBackoffFactor);

                    System.out.println("Retrieving the unprocessed items...");
                    System.out.println("Attempting to write unprocessed items...");
                    outcome = dynamoDB.batchWriteItemUnprocessed(unprocessedItems);
                }

                exponentialBackoffFactor *= 2;  // wait 2^(x+1) more time, exponential back off
            } while (outcome.getUnprocessedItems().size() > 0);

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }

        System.out.println("Uploaded " + i + " items to Dynamo.");
        return i;
    }

    /**
     * Given the table name and prefix (partition key) for chunks, return a String representation
     * of the original object. The return should be identical to the input in uploadAsChunks().
     *
     * @param tableName the name of the table to GET from
     * @param prefix the prefix of the chunks, AKA the partition key, as input for uploadAsChunks()
     * @return a string representation equal to the content specified in uploadChunks()
     */
    public String getChunksAsWhole(String tableName, String prefix, int numChunks) throws Exception {

        TableKeysAndAttributes tableKeysAndAttributes = new TableKeysAndAttributes(tableName);

        // add paramters to select all chunks
        for (int i = 0; i < numChunks; i++) {
            tableKeysAndAttributes.addHashAndRangePrimaryKey("chunkKey", prefix, "chunkNumber", i);
        }

        // get the items in batch
        BatchGetItemOutcome outcome;
        List<Map<String, AttributeValue>> response;         // really, a list of chunks

        try {
            int exponentialBackoffFactor = 1500;
            outcome = dynamoDB.batchGetItem(tableKeysAndAttributes);

            // get results, note that tableName is used as the top level Key in the response from Dynamo
            // also note that response at this point may not contain ALL items
            response = outcome.getBatchGetItemResult().getResponses().get(tableName);

            // per AWS documentation, on event that not all items returned
            Map<String, KeysAndAttributes> unprocessed = null;
            do {
                // Check for unprocessed keys which could happen if you exceed provisioned
                // throughput or reach the limit on response size.
                unprocessed = outcome.getUnprocessedKeys();

                if (unprocessed.isEmpty()) {
                    System.out.println("No unprocessed keys found");
                } else {

                    // sleep for 1.5 seconds to avoid exceeding provisioned capacity
                    System.out.println("Sleeping for" + exponentialBackoffFactor + "seconds...");
                    Thread.sleep(exponentialBackoffFactor);

                    // TODO NEED TO TEST THIS!!!
                    System.out.println("Retrieving the unprocessed items");
                    BatchGetItemOutcome unprocessedOutcome = dynamoDB.batchGetItemUnprocessed(unprocessed);
                    for (Map<String, AttributeValue> chunk : unprocessedOutcome.getBatchGetItemResult().getResponses().get(tableName)) {
                        response.add(chunk);
                    }
                }

                exponentialBackoffFactor *= 2;

            } while (!unprocessed.isEmpty());

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("There was an error retrieving all chunks");
        }

        // now reconstruct the original string, knowing that all chunks are present
        String[] chunksAsStrArray = new String[numChunks];
        String chunksAsWhole = "";

        for (Map<String, AttributeValue> chunk : response) {    // for each chunk in response, put in correct position in array
            // each 'chunk' has a chunkNumber, chunkKey, and content
            chunksAsStrArray[Integer.parseInt(chunk.get("chunkNumber").getN())] = new String(chunk.get("content").getB().array());
        }

        for (int i = 0; i < chunksAsStrArray.length; i++) {     // concatenate each chunk into one whole string
            chunksAsWhole += chunksAsStrArray[i];
        }

        return chunksAsWhole;
    }

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
