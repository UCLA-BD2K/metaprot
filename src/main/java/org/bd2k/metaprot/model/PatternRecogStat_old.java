package org.bd2k.metaprot.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Abineet on 9/1/2016.
 */
public class PatternRecogStat_old {
    private String metaboliteName;

    private List<PatternRecogDataPoint_old> dataPoints = new ArrayList<PatternRecogDataPoint_old>();

    public PatternRecogStat_old() {}

    public PatternRecogStat_old(String metaboliteName) {
        this.metaboliteName = metaboliteName;
    }

    public void setData(ArrayList<Integer> timePoints, ArrayList<Double> abundancePoints){
        for(int i = 0; i < timePoints.size(); i++){
            dataPoints.add(new PatternRecogDataPoint_old(timePoints.get(i), abundancePoints.get(i)));
        }
    }
    public String getMetaboliteName() {
        return metaboliteName;
    }

    public void setMetaboliteName(String metaboliteName) {
        this.metaboliteName = metaboliteName;
    }

    public List<PatternRecogDataPoint_old> getDataPoints() {
        return dataPoints;
    }

    @Override
    public String toString() {
        return "PatternRecogStat_old{" +
                "metaboliteName='" + metaboliteName + '\'' +
                ", dataPoints=" + dataPoints +
                '}';
    }

    public void setDataPoints(List<PatternRecogDataPoint_old> dataPoints) {
        this.dataPoints = dataPoints;
    }
}
