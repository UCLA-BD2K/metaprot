package org.bd2k.metaprot.model;

/**
 * Created by Abineet on 9/6/2016.
 */
public class PatternRecogDataPoint {
    private int timePoint;
    private double abundanceRatio;

    public PatternRecogDataPoint() {}

    public PatternRecogDataPoint(int timePoint, double abundanceRatio) {
        this.timePoint = timePoint;
        this.abundanceRatio = abundanceRatio;
    }

    public int getTimePoint() {
        return timePoint;
    }

    public void setTimePoint(int timePoint) {
        this.timePoint = timePoint;
    }

    public double getAbundanceRatio() {
        return abundanceRatio;
    }

    public void setAbundanceRatio(double abundanceRatio) {
        this.abundanceRatio = abundanceRatio;
    }
}
