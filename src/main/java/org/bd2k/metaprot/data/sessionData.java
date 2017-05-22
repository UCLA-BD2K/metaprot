package org.bd2k.metaprot.data;

import org.json.simple.JSONObject;

import java.util.HashMap;

/**
 * Created by Abineet on 5/21/2017.
 */
public class sessionData {
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
