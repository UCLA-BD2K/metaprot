package org.bd2k.metaprot.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import org.json.simple.JSONObject;

import java.util.HashMap;

/**
 * Created by Nate Sookwongse on 6/26/2017.
 */


@DynamoDBTable(tableName = "Metaprot-SessionData")
public class SessionData {
    private final long EXPIRATION_TIME_SECONDS = 60*60*24*7; // 7 days
    private String token;
    private String data;
    private long timestampMillis;
    private long timestampSeconds;
    private long ttl;

    public SessionData() {}

    public SessionData(String token, String data, long timestampMillis) {
        this.token = token;
        this.data = data;
        this.timestampMillis = timestampMillis;
        this.timestampSeconds = timestampMillis/1000L;
        this.ttl = this.timestampSeconds + EXPIRATION_TIME_SECONDS;
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

    public long getTimestampMillis() {
        return this.timestampMillis;
    }

    public void setTimestampMillis(long timestampMillis) {
        this.timestampMillis = timestampMillis;
    }

    @DynamoDBAttribute
    public long getTimestampSeconds() {
        return timestampSeconds;
    }

    public void setTimestampSeconds(long timestampSeconds) {
        this.timestampSeconds = timestampSeconds;
    }

    @DynamoDBAttribute
    public long getTtl() {
        return ttl;
    }

    public void setTtl(long ttl) {
        this.ttl = ttl;
    }

    @Override
    public String toString() {

        return "SessionData{" +
                "token='" + this.token + '\'' +
                ", data=" + this.data +
                ", time=" + this.timestampMillis +
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
