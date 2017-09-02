package org.bd2k.metaprot.model;

/**
 * Created by Nate Sookwongse on 8/30/17.
 */
public class ResultValidationValue {
    private double x;
    private double y;
    private double z;
    private String treatment;
    private String strain;

    public ResultValidationValue() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.treatment = "";
        this.strain = "";
    }

    public ResultValidationValue(double x, double y, double z, String treatment, String strain) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.treatment = treatment;
        this.strain = strain;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getZ() {
        return z;
    }

    public void setZ(double z) {
        this.z = z;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getStrain() {
        return strain;
    }

    public void setStrain(String strain) {
        this.strain = strain;
    }

    @Override
    public String toString() {
        return "ResultValidationValue{" +
                "x=" + x +
                ", y=" + y +
                ", z=" + z +
                ", treatment='" + treatment + '\'' +
                '}';
    }
}
