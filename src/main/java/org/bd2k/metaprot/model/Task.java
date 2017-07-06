package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Date;

/**
 * Base model class to represent a typical Task object
 *
 * Created by Nate Sookwongse on 7/6/17.
 */
@DynamoDBTable(tableName = "Metaprot-Task")
public class Task {

    private String token;
    private long fileSize;
    private Date timestamp;
    private String filename;
    private int numChunks;

    public Task() {}

    public Task(String token, Date timestamp, String filename, long fileSize, int numChunks) {
        this.token = token;
        this.timestamp = timestamp;
        this.filename = filename;
        this.fileSize = fileSize;
        this.numChunks = numChunks;
    }

    // getters and setters

    @DynamoDBHashKey(attributeName = "token")
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @DynamoDBAttribute
    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    @DynamoDBAttribute
    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    @DynamoDBAttribute
    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    @DynamoDBAttribute
    public int getNumChunks() {
        return numChunks;
    }

    public void setNumChunks(int numChunks) {
        this.numChunks = numChunks;
    }



    @Override
    public String toString() {

        long secondsSinceEpoch = System.currentTimeMillis() / 1000L;
        long ttl = secondsSinceEpoch + 604800;
        return "Task{" +
                "token='" + token + '\'' +
                ", timestamp=" + timestamp +
                ", filename='" + filename + '\'' +
                ", fileSize=" + fileSize +
                ", numChunks=" + numChunks +
                ", ttl=" + ttl +
                '}';
    }

    // per example on git
    @Override
    public int hashCode() {
        return token.hashCode();
    }
}
