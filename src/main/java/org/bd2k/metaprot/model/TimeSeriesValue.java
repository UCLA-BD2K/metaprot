package org.bd2k.metaprot.model;

import java.util.ArrayList;

/**
 * Created by Nate Sookwongse on 7/6/17.
 */

public class TimeSeriesValue {
    String metaboliteName;
    String strain;
    ArrayList<String> values;

    public TimeSeriesValue() {
        metaboliteName = "";
        strain = "";
        values = new ArrayList<>();
    }

    public TimeSeriesValue(String metaboliteName, String strain, ArrayList<String> values) {
        this.metaboliteName = metaboliteName;
        this.strain = strain;
        this.values = values;
    }

    public String getMetaboliteName() {
        return metaboliteName;
    }

    public void setMetaboliteName(String metaboliteName) {
        this.metaboliteName = metaboliteName;
    }

    public String getStrain() {
        return strain;
    }

    public void setStrain(String strain) {
        this.strain = strain;
    }

    public ArrayList<String> getValues() {
        return values;
    }

    public void setDataValue(ArrayList<String> values) {
        this.values = values;

    }

    @Override
    public String toString() {
        return "TimeSeriesValue{" +
                "metaboliteName='" + metaboliteName + "'" +
                ", strain='" + strain + "'" +
                ", values=" + values +
                "}";

    }
}
