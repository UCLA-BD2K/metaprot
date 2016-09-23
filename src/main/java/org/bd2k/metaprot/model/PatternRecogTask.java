package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Date;

/**
 * Represents a Pattern Recognition task result in the Task collection
 *
 * Created by Abineet on 9/1/2016.
 */
@DynamoDBTable(tableName = "Metaprot-Task")
public class PatternRecogTask {

    private String token;
    private Date timestamp;
    private String filename;
    private long fileSize;
    private int numClusters;
    private int minMembersPerCluster;
    private int numChunks;              // number of chunks used to store file in DB

    public PatternRecogTask() {}

    public PatternRecogTask(String token, Date timeStamp, String filename, long fileSize, int numClusters,
                            int minMembersPerCluster,
                            int numChunks) {
        this.token = token;
        this.timestamp = timeStamp;
        this.filename = filename;
        this.fileSize = fileSize;
        this.numClusters = numClusters;
        this.minMembersPerCluster = minMembersPerCluster;
        this.numChunks = numChunks;
    }

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
    public int getNumClusters() {
        return numClusters;
    }

    public void setNumClusters(int numClusters) {
        this.numClusters = numClusters;
    }

    @DynamoDBAttribute
    public int getMinMembersPerCluster() {
        return minMembersPerCluster;
    }

    public void setMinMembersPerCluster(int minMembersPerCluster) {
        this.minMembersPerCluster = minMembersPerCluster;
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
        return "PatternRecogTask{" +
                "token='" + token + '\'' +
                ", timestamp=" + timestamp +
                ", filename='" + filename + '\'' +
                ", fileSize=" + fileSize +
                ", numClusters=" + numClusters +
                ", minMembersPerCluster=" + minMembersPerCluster +
                ", numChunks=" + numChunks +
                '}';
    }

    // per example on git
    @Override
    public int hashCode() {
        return token.hashCode();
    }
}
