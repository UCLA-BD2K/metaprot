package org.bd2k.metaprot.model;

/**
 * Represents the statistical results for a metabolite
 * (p value, FDR, and Fold change) after analysis.
 *
 * Created by allengong on 8/15/16.
 */
public class MetaboliteStat {

    private double pValue;
    private double fdr;
    private double foldChange;
    private String result;      // insignificant, upregulated, downregulated

    public MetaboliteStat(double pValue, double fdr, double foldChange, String result) {
        this.pValue = pValue;
        this.fdr = fdr;
        this.foldChange = foldChange;
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
