package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Date;

/**
 * Represents a Pattern Recognition task result in the Task collection
 *
 * Created by Nate Sookwongse on 7/10/2017.
 */
@DynamoDBTable(tableName = "Metaprot-PRTask")
public class PatternRecognitionTask extends Task{

    public PatternRecognitionTask() {}

    public PatternRecognitionTask(String token, Date timeStamp, String filename,
                                  long fileSize, int numChunks) {
        super(token, timeStamp, filename, fileSize, numChunks);
    }


}
