package org.bd2k.metaprot.model;

/**
 * Created by Nate Sookwongse on 10/20/17.
 */
public class Node {
    private String id;
    private int degree;
    private boolean leftCol;
    //private HashSet<String> nodes;

    public Node() {
        this.id = "";
        this.degree = 0;
        this.leftCol = true;
        //this.nodes = new HashSet<>();
    }

    public Node(String id, boolean leftCol) {
        this.id = id;
        this.leftCol = leftCol;
       /* this.nodes = new HashSet<>();
        if (nodes == null) {
            this.degree = 0;
        }
        else {
            this.degree = this.nodes.size();
        }
        */
       this.degree = 0;
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



    public boolean isLeftCol() {
        return leftCol;
    }

    public void setLeftCol(boolean leftCol) {
        this.leftCol = leftCol;
    }

    public void setDegree(int degree) {
        this.degree = degree;
    }

    /*
        public HashSet<String> getNodes() {
            return nodes;
        }


        public void setNodes(HashSet<String> nodes) {
            this.nodes = nodes;
        }

        public boolean addNode(String node) {
            if (node == null)
                return false;

            // don't add edge to self
            if (!id.equals(node) && nodes.add(node)) {
                degree++;
                return true;
            }
            return false;
        }
    */
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
