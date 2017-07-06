package org.bd2k.metaprot.model;

import java.util.ArrayList;

/**
 * Created by Nate Sookwongse on 6/30/17.
 */
public class DataRow {
    String id;
    ArrayList<String> dataValue;

    public DataRow() {
        id = "";
        dataValue = new ArrayList<>();
    }

    public DataRow(String id, ArrayList<String> dataValue) {
        this.id = id;
        this.dataValue = dataValue;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ArrayList<String> getDataValue() {
        return dataValue;
    }

    public void setDataValue(ArrayList<String> dataValue) {
        this.dataValue = dataValue;
    }
}
