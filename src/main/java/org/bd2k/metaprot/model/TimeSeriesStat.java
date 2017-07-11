package org.bd2k.metaprot.model;

import java.util.ArrayList;

/**
 * Created by Nate Sookwongse on 7/6/17.
 */

public class TimeSeriesStat {
    String metaboliteName;
    String strain;
    ArrayList<String> values;

    public TimeSeriesStat() {
        metaboliteName = "";
        strain = "";
        values = new ArrayList<>();
    }

    public TimeSeriesStat(String metaboliteName, String strain, ArrayList<String> values) {
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
        return "TimeSeriesStat{" +
                "metaboliteName='" + metaboliteName + "'" +
                ", strain='" + strain + "'" +
                ", values=" + values +
                "}";

    }
}
