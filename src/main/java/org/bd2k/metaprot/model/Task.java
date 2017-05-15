package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * Poorly named model class representing a document in the
 * Task collection. Each metabolite-analysis result is stored
 * to the database in this form.
 *
 * Created by allengong on 8/30/16.
 */
@DynamoDBTable(tableName = "Metaprot-Task")
public class Task {

    private String token;

    private Date timestamp;
    private String filename;

    private double pValueThreshold;
    private double fcThreshold;

    /* each task can have multiple results depending on # comparison groups (time points), hence list of lists */
    //private List<List<MetaboliteStat>> results;

    private int numChunks;

    public Task() {}

    public Task(String token, Date timestamp, String filename, double pValueThreshold, double fcThreshold, int numChunks) {
        this.token = token;
        this.timestamp = timestamp;
        this.filename = filename;
        this.pValueThreshold = pValueThreshold;
        this.fcThreshold = fcThreshold;
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
    public int getNumChunks() {
        return numChunks;
    }

    public void setNumChunks(int numChunks) {
        this.numChunks = numChunks;
    }

    @DynamoDBAttribute
    public double getpValueThreshold() {
        return pValueThreshold;
    }

    public void setpValueThreshold(double pValueThreshold) {
        this.pValueThreshold = pValueThreshold;
    }

    @DynamoDBAttribute
    public double getFcThreshold() {
        return fcThreshold;
    }

    public void setFcThreshold(double fcThreshold) {
        this.fcThreshold = fcThreshold;
    }

    @Override
    public String toString() {

        long secondsSinceEpoch = System.currentTimeMillis() / 1000L;
        long ttl = secondsSinceEpoch + 604800;
        return "Task{" +
                "token='" + token + '\'' +
                ", timestamp=" + timestamp +
                ", filename='" + filename + '\'' +
                ", pValueThreshold=" + pValueThreshold +
                ", fcThreshold=" + fcThreshold +
                ", numChunks=" + numChunks + ", ttl=" + ttl +
                '}';
    }

    // per example on git
    @Override
    public int hashCode() {
        return token.hashCode();
    }
}
