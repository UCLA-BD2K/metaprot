package org.bd2k.metaprot.aws;

/**
 * Represents the result of an AWS S3 operation (put or pull).
 *
 * Created by allengong on 9/1/16.
 */
public class S3Status {

    // class variables
    private static final int METHOD_PUT = 0;
    private static final int METHOD_PULL = 1;

    // members
    private String fileName;    // name of file uploaded, downloaded, etc.
    private long fileSize;      // in bytes
    private int statusCode;     // status of the operation, -1 = internal error, 0 = success, else network error

    public S3Status(String fileName, long fileSize, int statusCode) {
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.statusCode = statusCode;
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

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    @Override
    public String toString() {
        return "S3Status{" +
                "fileName='" + fileName + '\'' +
                ", fileSize=" + fileSize +
                ", statusCode=" + statusCode +
                '}';
    }
}
