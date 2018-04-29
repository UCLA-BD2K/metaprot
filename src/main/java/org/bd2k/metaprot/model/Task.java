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

    public static final String DEA = "DEA";
    public static final String PATTERN = "PATTERN";
    public static final String RESULT_VALIDATION = "RESULT_VALDIATION";
    public static final String INTEGRATION_TOOL = "INTEGRATION_TOOL";
    public static final String DTW_ELBOW = "DTW_ELBOW";
    public static final String DTW_CLUSTER = "DTW_CLUSTER";

    private String token;
    private String sessionToken;
    private long fileSize;
    private Date timestamp;
    private String filename;
    private int numChunks;
    private String type;

    public Task() {}

    public Task(String token, String sessionToken, Date timestamp, String filename, long fileSize, int numChunks, String type) {
        this.token = token;
        this.sessionToken = sessionToken;
        this.timestamp = timestamp;
        this.filename = filename;
        this.fileSize = fileSize;
        this.numChunks = numChunks;
        this.type = type;
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
    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String token) {
        this.sessionToken = token;
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

    @DynamoDBAttribute
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Task{" +
                "token='" + token + '\'' +
                ", fileSize=" + fileSize +
                ", timestamp=" + timestamp +
                ", filename='" + filename + '\'' +
                ", numChunks=" + numChunks +
                ", type='" + type + '\'' +
                '}';
    }

    // per example on git
    @Override
    public int hashCode() {
        return token.hashCode();
    }
}
