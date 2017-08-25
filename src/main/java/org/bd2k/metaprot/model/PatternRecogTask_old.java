package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted;
import org.bd2k.metaprot.dbaccess.converter.Converters;

import java.util.Arrays;
import java.util.Date;

/**
 * Represents a Pattern Recognition task result in the Task collection
 *
 * Created by Abineet on 9/1/2016.
 */
@DynamoDBTable(tableName = "Metaprot-PRTask")
public class PatternRecogTask_old extends Task{

    private int numClusters;
    private int minMembersPerCluster;
    private double[][] regressionLines;

    public PatternRecogTask_old() {}

    public PatternRecogTask_old(String token, Date timeStamp, String filename, long fileSize, int numClusters,
                                int minMembersPerCluster, int numChunks, double[][] regressionLines) {
        super(token, timeStamp, filename, fileSize, numChunks);
        this.numClusters = numClusters;
        this.minMembersPerCluster = minMembersPerCluster;
        this.regressionLines = regressionLines;
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
    @DynamoDBTypeConverted(converter = Converters.DoubleArrayArrayConverter.class)
    public double[][] getRegressionLines() {
        return regressionLines;
    }

    public void setRegressionLines(double[][] regressionLines) {
        this.regressionLines = regressionLines;
    }

    @Override
    public String toString() {
        // call and build upon base class's toString
        String str = super.toString();
        int start = str.indexOf("{");
        int end = str.indexOf("}");

        return "PatternRecogTask_old{" + str.substring(start, end) +
                ", numClusters=" + numClusters +
                ", minMembersPerCluster=" + minMembersPerCluster +
                ", regressionLine=" + Arrays.toString(regressionLines) +
                '}';
    }

}
