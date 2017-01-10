package org.bd2k.metaprot.data;

/**
 * Created by Abineet on 12/14/2016.
 */
public class FeedBackType {
    boolean result;         // true means success, false means error
    String errorMessage;    // associated message

    public FeedBackType(boolean result, String errorMessage) {
        this.result = result;
        this.errorMessage = errorMessage;
    }

    public boolean getResult() { return result; }
    public String getErrorMessage() { return errorMessage; }
}
