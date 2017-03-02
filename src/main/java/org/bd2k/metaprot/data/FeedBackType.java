package org.bd2k.metaprot.data;

import java.util.ArrayList;

/**
 * Created by Abineet on 12/14/2016.
 */
public class FeedBackType {
    boolean result;         // true means success, false means error
    String errorMessage;    // associated message
    int totalInputs = 0;
    int missingInputs = 0;

    public FeedBackType(boolean result, String errorMessage) {
        this.result = result;
        this.errorMessage = errorMessage;
    }
    public FeedBackType(boolean result, String errorMessage, int total, int missing) {
        this.result = result;
        this.errorMessage = errorMessage;
        totalInputs = total;
        missingInputs = missing;
    }

    public boolean getResult() { return result; }
    public String getErrorMessage() { return errorMessage; }
    public int getTotalInputs(){ return totalInputs; }
    public int getMissingInputs(){ return missingInputs; }
}
