package org.bd2k.metaprot.model;

import java.util.ArrayList;
import java.util.HashSet;

/**
 * Created by Nate Sookwongse on 10/13/17.
 */
class DataRow {
    private String idA, idB, aliasA, aliasB, detectMethod, taxonA, taxonB, score;

    public DataRow() {
        idA = "";
        idB = "";
        aliasA = "";
        aliasB = "";
        detectMethod = "";
        taxonA = "";
        taxonB = "";
        score = "";
    }

    public DataRow(String idA, String idB, String aliasA, String aliasB, String detectMethod, String taxonA, String taxonB, String score) {
        this.idA = idA;
        this.idB = idB;
        this.aliasA = aliasA;
        this.aliasB = aliasB;
        this.detectMethod = detectMethod;
        this.taxonA = taxonA;
        this.taxonB = taxonB;
        this.score = score;
    }

    public String getIdA() {
        return idA;
    }

    public void setIdA(String idA) {
        this.idA = idA;
    }

    public String getIdB() {
        return idB;
    }

    public void setIdB(String idB) {
        this.idB = idB;
    }

    public String getAliasA() {
        return aliasA;
    }

    public void setAliasA(String aliasA) {
        this.aliasA = aliasA;
    }

    public String getAliasB() {
        return aliasB;
    }

    public void setAliasB(String aliasB) {
        this.aliasB = aliasB;
    }

    public String getDetectMethod() {
        return detectMethod;
    }

    public void setDetectMethod(String detectMethod) {
        this.detectMethod = detectMethod;
    }

    public String getTaxonA() {
        return taxonA;
    }

    public void setTaxonA(String taxonA) {
        this.taxonA = taxonA;
    }

    public String getTaxonB() {
        return taxonB;
    }

    public void setTaxonB(String taxonB) {
        this.taxonB = taxonB;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "DataRow{" +
                "idA='" + idA + '\'' +
                ", idB='" + idB + '\'' +
                ", aliasA='" + aliasA + '\'' +
                ", aliasB='" + aliasB + '\'' +
                ", detectMethod='" + detectMethod + '\'' +
                ", taxonA='" + taxonA + '\'' +
                ", taxonB='" + taxonB + '\'' +
                ", score='" + score + '\'' +
                '}';
    }
}




public class IntegrationToolResults {
    private ArrayList<DataRow> tableRows;
    private HashSet<Node> nodes;
    private ArrayList<Edge> edges;

    public IntegrationToolResults() {
        this.tableRows = new ArrayList<>();
        this.nodes = new HashSet<>();
        this.edges = new ArrayList<>();
    }

    public IntegrationToolResults(ArrayList<DataRow> tableRows, HashSet<Node> nodes, ArrayList<Edge> edges) {
        this.tableRows = tableRows;
        this.nodes = nodes;
        this.edges = edges;
    }

    public void parseCSVLine(String csv) {
        String[] arr = csv.split(",");
        System.out.println(csv);
        tableRows.add(new DataRow(
                arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7]
        ));
        nodes.add(new Node(arr[0]));
        nodes.add(new Node(arr[1]));

        edges.add(new Edge(
                arr[0] + "-" + arr[1],
                arr[0],
                arr[1],
                Math.pow(Double.parseDouble(arr[7])+1,3)
        ));
    }

    public ArrayList<DataRow> getTableRows() {
        return tableRows;
    }

    public void setTableRows(ArrayList<DataRow> tableRows) {
        this.tableRows = tableRows;
    }

    public HashSet<Node> getNodes() {
        return nodes;
    }

    public void setNodes(HashSet<Node> nodes) {
        this.nodes = nodes;
    }

    public ArrayList<Edge> getEdges() {
        return edges;
    }

    public void setEdges(ArrayList<Edge> edges) {
        this.edges = edges;
    }

    @Override
    public String toString() {
        return "IntegrationToolResults{" +
                "tableRows=" + tableRows +
                '}';
    }
}
