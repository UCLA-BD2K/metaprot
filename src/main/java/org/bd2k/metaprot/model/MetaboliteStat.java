package org.bd2k.metaprot.model;

/**
 * Represents the statistical results for a metabolite
 * (p value, FDR, and Fold change) after analysis.
 *
 * Created by allengong on 8/15/16.
 */
public class MetaboliteStat {

    private int index;          // auto-generated (by R) index of the data point
    private String name;        // name of the metabolite/gene/etc.
    private double pValue;
    private double fdr;
    private double foldChange;
    private String significance;      // insignificant, upregulated, downregulated

    public MetaboliteStat() {}  // required for Jackson databind methods

    public MetaboliteStat(int index, String name, double pValue, double fdr, double foldChange, String significance) {
        this.index = index;
        this.name = name;
        this.pValue = pValue;
        this.fdr = fdr;
        this.foldChange = foldChange;
        this.significance = significance;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public double getpValue() {
        return pValue;
    }

    public void setpValue(double pValue) {
        this.pValue = pValue;
    }

    public double getFdr() {
        return fdr;
    }

    public void setFdr(double fdr) {
        this.fdr = fdr;
    }

    public double getFoldChange() {
        return foldChange;
    }

    public void setFoldChange(double foldChange) {
        this.foldChange = foldChange;
    }

    public String getSignificance() {
        return significance;
    }

    public void setSignificance(String result) {
        this.significance = result;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "MetaboliteStat{" +
                "index=" + index +
                ", name='" + name + '\'' +
                ", pValue=" + pValue +
                ", fdr=" + fdr +
                ", foldChange=" + foldChange +
                ", significance='" + significance + '\'' +
                '}';
    }
}
