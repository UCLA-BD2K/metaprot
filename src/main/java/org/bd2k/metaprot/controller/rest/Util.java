package org.bd2k.metaprot.controller.rest;

import org.bd2k.metaprot.data.GoogleAnalytics;
import org.bd2k.metaprot.data.GoogleAnalyticsReport;
import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.SessionData;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * REST controller for misc. endpoints for utility functions
 *
 * Created by Nate Sookwongse on 8/3/17.
 */
@RestController
@RequestMapping("/util")
public class Util {

    @Autowired
    private DAOImpl dao;


    @RequestMapping(value = "/token", method = RequestMethod.GET)
    public String getToken() {
        return UUID.randomUUID().toString();
    }

    @RequestMapping(value= "/checkToken", method = RequestMethod.POST)
    public boolean checkToken(@RequestParam("token") String token){
        if (dao.getSessionData(token) == null)
            return false;
        return true;
    }

    @RequestMapping(value= "/getSessionData", method = RequestMethod.POST)
    public String getSessionData(@RequestParam("token") String token){
        SessionData sessionData = dao.getSessionData(token);
        if (sessionData != null)
            return sessionData.getData();
        else
            return new JSONObject().put("Error", "Token does not exist").toString();

    }

    @RequestMapping(value= "/googleAnalyticsReport", method = RequestMethod.GET)
    public GoogleAnalyticsReport getGoogleAnalyticsReport(){
        return GoogleAnalytics.getReport();
    }


}
