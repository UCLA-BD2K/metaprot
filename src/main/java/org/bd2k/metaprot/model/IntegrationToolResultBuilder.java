package org.bd2k.metaprot.model;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by davidmeng on 11/13/17.
 */
public class IntegrationToolResultBuilder {

    private ArrayList<DataRow> tableRows;
    private HashMap<String, Node> nodes;
    private ArrayList<Edge> edges;

    public IntegrationToolResultBuilder() {
        this.tableRows = new ArrayList<>();
        this.nodes = new HashMap<>();
        this.edges = new ArrayList<>();
    }

    public IntegrationToolResultBuilder(ArrayList<DataRow> tableRows, HashMap<String, Node> nodes, ArrayList<Edge> edges) {
        this.tableRows = tableRows;
        this.nodes = nodes;
        this.edges = edges;
    }

    public ArrayList<DataRow> getTableRows() {
        return tableRows;
    }

    public void setTableRows(ArrayList<DataRow> tableRows) {
        this.tableRows = tableRows;
    }

    public HashMap<String, Node> getNodes() {
        return nodes;
    }

    public void setNodes(HashMap<String, Node> nodes) {
        this.nodes = nodes;
    }

    public ArrayList<Edge> getEdges() {
        return edges;
    }

    public void setEdges(ArrayList<Edge> edges) {
        this.edges = edges;
    }

    public void parseCSVLine(String csv) {
        String[] arr = csv.split(",");
        System.out.println(csv);
        tableRows.add(new DataRow(
                arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]
        ));
        String a = arr[0];
        String b = arr[1];
        Node nodeA = nodes.get(a);
        Node nodeB = nodes.get(b);

        // create new Node if there was no mapping before
        nodeA = nodeA == null ? new Node(a, 0) : nodeA;
        nodeB = nodeB == null ? new Node(b, 0) : nodeB;

        nodeA.addDegree();
        nodeB.addDegree();

        // insert/update mapping
        nodes.put(a, nodeA);
        nodes.put(b, nodeB);

        edges.add(new Edge(
                a + "-" + b,
                a,
                b,
                Math.pow(Double.parseDouble(arr[7])+1,3)
        ));
    }

    public void parseTabLine(String tab) {
        String[] arr = tab.split("\t");
        tableRows.add(new DataRow(
                arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]
        ));
        String a = arr[0];
        String b = arr[1];
        Node nodeA = nodes.get(a);
        Node nodeB = nodes.get(b);

        // create new Node if there was no mapping before
        nodeA = nodeA == null ? new Node(a, 0) : nodeA;
        nodeB = nodeB == null ? new Node(b, 0) : nodeB;

        nodeA.addDegree();
        nodeB.addDegree();

        // insert/update mapping
        nodes.put(a, nodeA);
        nodes.put(b, nodeB);

        edges.add(new Edge(
                arr[0] + "-" + arr[1],
                arr[0],
                arr[1],
                1
        ));
    }

    public IntegrationToolResults build() {
        return new IntegrationToolResults(tableRows, new ArrayList<>(nodes.values()), edges);
    }

    @Override
    public String toString() {
        return "IntegrationToolResultBuilder{" +
                "tableRows=" + tableRows +
                ", nodes=" + nodes +
                ", edges=" + edges +
                '}';
    }
}
