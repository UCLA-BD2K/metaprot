package org.bd2k.metaprot.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

/**
 * Created by davidmeng on 11/13/17.
 */
public class IntegrationToolResultBuilder {

    private ArrayList<DataRow> tableRows;
    private HashMap<Node, HashSet<Node>> nodes;

    public IntegrationToolResultBuilder() {
        this.tableRows = new ArrayList<>();
        this.nodes = new HashMap<>();
    }

    public ArrayList<DataRow> getTableRows() {
        return tableRows;
    }

    public void setTableRows(ArrayList<DataRow> tableRows) {
        this.tableRows = tableRows;
    }

    public void parseCSVLine(String csv) {
        String[] arr = csv.split(",");
        tableRows.add(new DataRow(
                arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]
        ));
        String a = arr[0];
        String b = arr[1];
        Node nodeA = new Node(a, true);
        Node nodeB = new Node(b, false);

        HashSet<Node> aNodes = nodes.get(nodeA);
        HashSet<Node> bNodes = nodes.get(nodeB);

        aNodes = aNodes == null ? new HashSet<>() : aNodes;
        bNodes = bNodes == null ? new HashSet<>() : bNodes;

        aNodes.add(nodeB);
        bNodes.add(nodeA);

        // insert/update mapping
        nodes.put(nodeA, aNodes);
        nodes.put(nodeB, bNodes);

    }

    public void parseTabLine(String tab) {
        String[] arr = tab.split("\t");
        tableRows.add(new DataRow(
                arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]
        ));
        String a = arr[0];
        String b = arr[1];
        Node nodeA = new Node(a, true);
        Node nodeB = new Node(b, false);

        HashSet<Node> aNodes = nodes.get(nodeA);
        HashSet<Node> bNodes = nodes.get(nodeB);

        aNodes = aNodes == null ? new HashSet<>() : aNodes;
        bNodes = bNodes == null ? new HashSet<>() : bNodes;

        aNodes.add(nodeB);
        bNodes.add(nodeA);

        // insert/update mapping
        nodes.put(nodeA, aNodes);
        nodes.put(nodeB, bNodes);
    }

    public IntegrationToolResults build() {
        HashSet<Edge> edges = new HashSet<>();
        ArrayList<Node> nodeSet = new ArrayList<>();
        for (Node a: nodes.keySet()) {
            a.setDegree(nodes.get(a).size());
            nodeSet.add(a);
            for (Node b: nodes.get(a)) {
                Edge edge = new Edge(a.getId() + "-" + b.getId(), a.getId(), b.getId(), 1);
                edges.add(edge);
            }
        }
        return new IntegrationToolResults(tableRows, new ArrayList<>(nodes.keySet()), new ArrayList<>(edges));
    }

    @Override
    public String toString() {
        return "IntegrationToolResultBuilder{" +
                "tableRows=" + tableRows +
                ", nodes=" + nodes +
                '}';
    }
}
