package org.bd2k.metaprot.model;

import com.amazonaws.util.StringUtils;

import java.util.ArrayList;

/**
 * Created by Nate Sookwongse on 7/7/17.
 */
public class PatternRecognitionSignificance {
    String metaboliteName;
    ArrayList<String> significanceValues;

    public PatternRecognitionSignificance() {
    }

    public PatternRecognitionSignificance(String metaboliteName, ArrayList<String> significanceValues) {
        this.metaboliteName = metaboliteName;
        this.significanceValues = significanceValues;
    }

    public String getMetaboliteName() {
        return metaboliteName;
    }

    public void setMetaboliteName(String metaboliteName) {
        this.metaboliteName = metaboliteName;
    }

    public ArrayList<String> getSignificanceValues() {
        return significanceValues;
    }

    public void setSignificanceValues(ArrayList<String> significanceValues) {
        this.significanceValues = significanceValues;
    }

    @Override
    public String toString() {
        return "PatternRecognitionSignificance{" +
                "metaboliteName='" + metaboliteName + "'" +
                ", significanceValues=" + significanceValues +
                '}';
    }
}
