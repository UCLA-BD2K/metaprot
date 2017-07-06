package org.bd2k.metaprot.model;

/**
 * Created by Nate Sookwongse on 6/30/17.
 */
public class DataPoint {
    String x;
    String y;
    public DataPoint() {
        x = "";
        y = "";
    }

    public DataPoint(String x, String y) {
        this.x = x;
        this.y = y;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }
}
