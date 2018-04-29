package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Date;

/**
 * Poorly named model class representing a document in the
 * MetaboliteTask collection. Each metabolite-analysis result is stored
 * to the database in this form.
 *
 * Created by allengong on 8/30/16.
 */
@DynamoDBTable(tableName = "Metaprot-MetaboliteTask")
public class MetaboliteTask extends Task{

    private double pValueThreshold;
    private double fcThreshold;

    public MetaboliteTask() {}

    public MetaboliteTask(String token, String sessionToken, Date timestamp, String filename, long fileSize,
                          double pValueThreshold, double fcThreshold, int numChunks) {
        super(token, sessionToken, timestamp, filename, fileSize, numChunks, Task.DEA);
        this.pValueThreshold = pValueThreshold;
        this.fcThreshold = fcThreshold;
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
        // call and build upon base class's toString
        String str = super.toString();
        int start = str.indexOf("{");
        int end = str.indexOf("}");

        return "MetaboliteTask{" + str.substring(start, end) +
                ", pValueThreshold=" + pValueThreshold +
                ", fcThreshold=" + fcThreshold +
                '}';
    }

}
