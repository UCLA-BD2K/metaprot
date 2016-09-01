package org.bd2k.metaprot.model;

/**
 * Holds key information for task scheduling and management
 *
 * Created by Abineet on 8/31/2016.
 */
public class TaskInfo {
    private String taskID;
    private String fileName;
    private double fileSize;

    public TaskInfo(String taskID, String fileName, double fileSize) {
        this.taskID = taskID;
        this.fileName = fileName;
        this.fileSize = fileSize;
    }

    public String getTaskID() {
        return taskID;
    }

    public void setTaskID(String taskID) {
        this.taskID = taskID;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public double getFileSize() {
        return fileSize;
    }

    public void setFileSize(double fileSize) {
        this.fileSize = fileSize;
    }
}

