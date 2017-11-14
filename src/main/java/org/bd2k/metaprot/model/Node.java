package org.bd2k.metaprot.model;

/**
 * Created by Nate Sookwongse on 10/20/17.
 */
public class Node {
    private String id;
    private int degree;

    public Node() {
        this.id = "";
        this.degree = 0;
    }

    public Node(String id, int degree) {
        this.id = id;
        this.degree = degree;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getDegree() {
        return degree;
    }

    public void setDegree(int degree) {
        this.degree = degree;
    }

    public void addDegree() {
        this.degree++;
    }

    @Override
    public String toString() {
        return "data: {" +
                "id:'" + id + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Node node = (Node) o;

        return id != null ? id.equals(node.id) : node.id == null;

    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
