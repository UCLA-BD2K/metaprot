package org.bd2k.metaprot.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Nate Sookwongse on 7/11/17.
 */
public class TimeSeriesResults {

    private List<TimeSeriesValue> values;
    private List<TimeSeriesSignificance> significances;
    private Set<String> metabolites;

    public TimeSeriesResults() {
        values = new ArrayList<>();
        significances = new ArrayList<>();
        metabolites = new HashSet<>();
    }

    public TimeSeriesResults(List<TimeSeriesValue> values, List<TimeSeriesSignificance> significances) {
        this.values = values;
        this.significances = significances;
        metabolites = new HashSet<>();
        for (int i = 1; i < values.size(); i++) {
            metabolites.add(values.get(i).getMetaboliteName());
        }
    }

    public List<TimeSeriesValue> getValues() {
        return values;
    }

    public void setValues(List<TimeSeriesValue> values) {
        this.values = values;
    }

    public List<TimeSeriesSignificance> getSignificances() {
        return significances;
    }

    public void setSignificances(List<TimeSeriesSignificance> significances) {
        this.significances = significances;
    }

    public Set<String> getMetabolites() {
        return metabolites;
    }

    public void setMetabolites(Set<String> metabolites) {
        this.metabolites = metabolites;
    }

    @Override
    public String toString() {
        return "TimeSeriesResults{" +
                "values=" + values +
                ", significances=" + significances +
                ", metabolites=" + metabolites +
                '}';
    }
}
