package org.bd2k.metaprot.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

/**
 * Poorly named model class representing a document in the
 * Task collection. Each metabolite-analysis result is stored
 * to the database in this form.
 *
 * Created by allengong on 8/30/16.
 */
@Document(collection = "Task")
public class Task {

    @Id
    private String token;

    private Date timestamp;
    private String filename;

    private double pValueThreshold;
    private double fcThreshold;

    /* each task can have multiple results depending on # comparison groups, hence list of lists */
    private List<List<MetaboliteStat>> results;

    public Task() {}

    public Task(String token, Date timestamp, String filename, double pValueThreshold, double fcThreshold, List<List<MetaboliteStat>> results) {
        this.token = token;
        this.timestamp = timestamp;
        this.filename = filename;
        this.pValueThreshold = pValueThreshold;
        this.fcThreshold = fcThreshold;
        this.results = results;
    }

    // getters and setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public List<List<MetaboliteStat>> getResults() {
        return results;
    }

    public void setResults(List<List<MetaboliteStat>> results) {
        this.results = results;
    }

    public double getpValueThreshold() {
        return pValueThreshold;
    }

    public void setpValueThreshold(double pValueThreshold) {
        this.pValueThreshold = pValueThreshold;
    }

    public double getFcThreshold() {
        return fcThreshold;
    }

    public void setFcThreshold(double fcThreshold) {
        this.fcThreshold = fcThreshold;
    }

    @Override
    public String toString() {
        return "Task{" +
                "token='" + token + '\'' +
                ", timestamp=" + timestamp +
                ", filename='" + filename + '\'' +
                ", pValueThreshold=" + pValueThreshold +
                ", fcThreshold=" + fcThreshold +
                ", results=" + results +
                '}';
    }
}
