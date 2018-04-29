package org.bd2k.metaprot.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Nate Sookwongse on 8/30/17.
 */
public class ResultValidationResults {
    private String base64EncodedStaticPlot;
    private List<ResultValidationValue> values;

    public ResultValidationResults() {
        this.base64EncodedStaticPlot = "";
        this.values = new ArrayList<>();
    }

    public ResultValidationResults(String base64EncodedStaticPlot, List<ResultValidationValue> values) {
        this.base64EncodedStaticPlot = base64EncodedStaticPlot;
        this.values = values;
    }

    public String getBase64EncodedStaticPlot() {
        return base64EncodedStaticPlot;
    }

    public void setBase64EncodedStaticPlot(String base64EncodedStaticPlot) {
        this.base64EncodedStaticPlot = base64EncodedStaticPlot;
    }

    public List<ResultValidationValue> getValues() {
        return values;
    }

    public void setValues(List<ResultValidationValue> values) {
        this.values = values;
    }

    @Override
    public String toString() {
        return "ResultValidationResults{" +
                "base64EncodedStaticPlot='" + base64EncodedStaticPlot + '\'' +
                ", values=" + values +
                '}';
    }
}
