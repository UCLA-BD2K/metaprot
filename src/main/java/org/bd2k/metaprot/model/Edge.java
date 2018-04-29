package org.bd2k.metaprot.model;

/**
 * Created by davidmeng on 10/20/17.
 */
public class Edge {
    private String id, source, target;
    private double width;

    public Edge() {
        id = "";
        source = "";
        target = "";
        width = 1;
    }

    public Edge(String id, String source, String target, double width) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.width = width;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    @Override
    public String toString() {
        return "data{" +
                "id:'" + id + '\'' +
                ", source:'" + source + '\'' +
                ", target:'" + target + '\'' +
                ", width:" + width +
                '}';
    }
}
