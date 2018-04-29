package org.bd2k.metaprot.model;


import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nate Sookwongse on 8/30/17.
 */
public class DTWClusterResults {
    private String base64EncodedStaticPlot;
    private List<List<String>> values;

    public DTWClusterResults() {
        this.base64EncodedStaticPlot = "";
        this.values = new ArrayList<>();
    }

    public DTWClusterResults(String base64EncodedStaticPlot, List<List<String>> values) {
        this.base64EncodedStaticPlot = base64EncodedStaticPlot;
        this.values = values;
    }

    public String getBase64EncodedStaticPlot() {
        return base64EncodedStaticPlot;
    }

    public void setBase64EncodedStaticPlot(String base64EncodedStaticPlot) {
        this.base64EncodedStaticPlot = base64EncodedStaticPlot;
    }

    public List<List<String>> getValues() {
        return values;
    }

    public void setValues(List<List<String>> values) {
        this.values = values;
    }

    @Override
    public String toString() {
        return "DTWClusterResults{" +
                "base64EncodedStaticPlot='" + base64EncodedStaticPlot + '\'' +
                ", values=" + values +
                '}';
    }
}
