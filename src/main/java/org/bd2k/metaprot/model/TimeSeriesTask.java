package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Date;

/**
 * Represents a Time Series task result in the Task collection
 *
 * Created by Nate Sookwongse on 7/10/2017.
 */
@DynamoDBTable(tableName = "Metaprot-TimeSeriesTask")
public class TimeSeriesTask extends Task{

    public TimeSeriesTask() {}

    public TimeSeriesTask(String token, Date timeStamp, String filename,
                          long fileSize, int numChunks) {
        super(token, timeStamp, filename, fileSize, numChunks);
    }


}
