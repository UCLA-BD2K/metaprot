package org.bd2k.metaprot.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by Nate Sookwongse on 7/11/17.
 */
public class PatternRecognitionResults {

    private List<PatternRecognitionValue> values;
    private List<PatternRecognitionSignificance> significances;
    private Set<String> metabolites;

    public PatternRecognitionResults() {
        values = new ArrayList<>();
        significances = new ArrayList<>();
        metabolites = new HashSet<>();
    }

    public PatternRecognitionResults(List<PatternRecognitionValue> values, List<PatternRecognitionSignificance> significances) {
        this.values = values;
        this.significances = significances;
        metabolites = new HashSet<>();
        for (int i = 1; i < values.size(); i++) {
            metabolites.add(values.get(i).getMetaboliteName());
        }
    }

    public List<PatternRecognitionValue> getValues() {
        return values;
    }

    public void setValues(List<PatternRecognitionValue> values) {
        this.values = values;
    }

    public List<PatternRecognitionSignificance> getSignificances() {
        return significances;
    }

    public void setSignificances(List<PatternRecognitionSignificance> significances) {
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
        return "PatternRecognitionResults{" +
                "values=" + values +
                ", significances=" + significances +
                ", metabolites=" + metabolites +
                '}';
    }
}
