package org.bd2k.metaprot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * Created by Abineet on 9/1/2016.
 */
@Document(collection = "Task")
public class PatternRecogTask {

    @Id
    private String token;

    private Date timeStamp;
    private String fileName;

    private List<List<PatternRecogStat>> results;

    public PatternRecogTask(String token, Date timeStamp, String fileName, List<List<PatternRecogStat>> results) {
        this.token = token;
        this.timeStamp = timeStamp;
        this.fileName = fileName;
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
                ", results=" + results +
                '}';
    }
}
