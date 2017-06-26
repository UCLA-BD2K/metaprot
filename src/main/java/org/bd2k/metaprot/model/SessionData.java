package org.bd2k.metaprot.model;

import org.json.simple.JSONObject;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;


import java.util.HashMap;

/**
 * Created by Nate Sookwongse on 6/26/2017.
 */


@DynamoDBTable(tableName = "Metaprot-SessionData")
public class SessionData {
    String token;
    String data;

    public SessionData(String token, String data) {
        this.token = token;
        this.data = data;
    }

    // getters and setters

    @DynamoDBHashKey(attributeName = "token")
    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @DynamoDBAttribute
    public String getData() {
        return this.data;
    }

    public void setData(String data) {
        this.data = data;
    }

    @Override
    public String toString() {

        return "SessionData{" +
                "token='" + this.token + '\'' +
                ", data=" + this.data +
                "}";
    }

    // per example on git
    @Override
    public int hashCode() {
        return token.hashCode();
    }


    //Session Information Data Store
    private static HashMap<String, String> sessionInfoMap = new HashMap<>();

    public static String getData(String token){
        if(sessionInfoMap.containsKey(token)){
            return sessionInfoMap.get(token);
        }
        JSONObject notFoundJSON = new JSONObject();
        notFoundJSON.put("Error", "Token does not exist");
        return  notFoundJSON.toJSONString();
    }

    public static String setData(String token, String data){
        sessionInfoMap.put(token, data);
        return "Success";
    }

    public static boolean checkToken(String token){
        if(sessionInfoMap.containsKey(token)){
            return true;
        }
        return false;
    }
}
