package org.bd2k.metaprot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * Represents a Pattern Recognition task result in the Task collection
 *
 * Created by Abineet on 9/1/2016.
 */
@Document(collection = "Task")
public class PatternRecogTask {

    @Id
    private String token;

    private Date timeStamp;
    private String fileName;
    private long fileSize;
    private int numClusters;
    private int minMembersPerCluster;

    private List<List<PatternRecogStat>> results;

    public PatternRecogTask(String token, Date timeStamp, String fileName, long fileSize, int numClusters,
                            int minMembersPerCluster, List<List<PatternRecogStat>> results) {
        this.token = token;
        this.timeStamp = timeStamp;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.numClusters = numClusters;
        this.minMembersPerCluster = minMembersPerCluster;
        this.results = results;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public int getNumClusters() {
        return numClusters;
    }

    public void setNumClusters(int numClusters) {
        this.numClusters = numClusters;
    }

    public int getMinMembersPerCluster() {
        return minMembersPerCluster;
    }

    public void setMinMembersPerCluster(int minMembersPerCluster) {
        this.minMembersPerCluster = minMembersPerCluster;
    }

    public List<List<PatternRecogStat>> getResults() {
        return results;
    }

    public void setResults(List<List<PatternRecogStat>> results) {
        this.results = results;
    }

    @Override
    public String toString() {
        return "PatternRecogTask{" +
                "token='" + token + '\'' +
                ", timeStamp=" + timeStamp +
                ", fileName='" + fileName + '\'' +
                ", fileSize=" + fileSize +
                ", numClusters=" + numClusters +
                ", minMembersPerCluster=" + minMembersPerCluster +
                ", results=" + results +
                '}';
    }
}
