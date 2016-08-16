package org.bd2k.metaprot.model;

/**
 * Represents the statistical results for a metabolite
 * (p value, FDR, and Fold change) after analysis.
 *
 * Created by allengong on 8/15/16.
 */
public class MetaboliteStat {

    private int index;          // auto-generated (by R) index of the data point
    private double pValue;
    private double fdr;
    private double foldChange;
    private String result;      // insignificant, upregulated, downregulated

    public MetaboliteStat(int index, double pValue, double fdr, double foldChange, String result) {
        this.index = index;
        this.pValue = pValue;
        this.fdr = fdr;
        this.foldChange = foldChange;
        this.result = result;
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

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    @Override
    public String toString() {
        return "MetaboliteStat{" +
                "pValue=" + pValue +
                ", fdr=" + fdr +
                ", foldChange=" + foldChange +
                ", result='" + result + '\'' +
                '}';
    }
}
