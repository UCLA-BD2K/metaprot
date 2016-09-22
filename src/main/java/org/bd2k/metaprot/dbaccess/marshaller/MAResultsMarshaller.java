package org.bd2k.metaprot.dbaccess.marshaller;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMarshaller;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bd2k.metaprot.model.MetaboliteStat;

import java.io.IOException;
import java.util.List;

/**
 * Marshaller to marshall the results of a Metabolite Analysis
 * task into a DynamoDB-friendly representation (a string). Internally uses the
 * Jackson databind package to marshal objects into a decently compact representation.
 *
 * Currently, the MA results are stored in memory as a List<List<MetaboliteStat>>.
 *
 * Note that DynamoDBMarshaller is deprecated, and DynamoTypeConverter
 * is suggested instead. However, there doesn't seem to be any reason to change unless
 * we need more complex/flexible marshalling.
 *
 * Created by allengong on 9/22/16.
 */
public class MAResultsMarshaller implements DynamoDBMarshaller<List<List<MetaboliteStat>>> {

    @Override
    public String marshall(List<List<MetaboliteStat>> results) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonStr = null;

        try {
            jsonStr = mapper.writeValueAsString(results);
        } catch (IOException e) {
            System.err.println("Error in mapping MA result object to JSON string.");
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error in marshalling MA result object.");
            e.printStackTrace();
        }

        return jsonStr;
    }

    @Override
    public List<List<MetaboliteStat>> unmarshall(Class<List<List<MetaboliteStat>>> aClass, String s) {
        ObjectMapper mapper = new ObjectMapper();
        List<List<MetaboliteStat>> list = null;

        try {
            list = mapper.readValue(s, new TypeReference<List<List<MetaboliteStat>>>(){});
        } catch (IOException e) {
            System.err.println("Error in reading MA result string back to object.");
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error in unmarshalling MA result object");
            e.printStackTrace();
        }

        return list;
    }
}
