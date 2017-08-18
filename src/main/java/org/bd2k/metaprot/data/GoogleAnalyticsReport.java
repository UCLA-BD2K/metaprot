package org.bd2k.metaprot.data;

/**
 * Created by Nate Sookwongse 8/3/17.
 */

import java.util.ArrayList;
import java.util.List;

public class GoogleAnalyticsReport {
    private String month;
    private int sessions;
    private double pageviewsPerSession;
    private int uniqueVisitors;
    private int numCountries;
    private List<List<String>> mapData;
    private List<List<String>> dailySessionData;
    private List<List<String>> monthlySessionData;

    GoogleAnalyticsReport() {
        month = null;
        sessions = 0;
        pageviewsPerSession = 0;
        uniqueVisitors = 0;
        numCountries = 0;
        mapData = new ArrayList<>();
        dailySessionData = new ArrayList<>();
        monthlySessionData = new ArrayList<>();
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getSessions() {
        return sessions;
    }

    public void setSessions(int sessions) {
        this.sessions = sessions;
    }

    public double getPageviewsPerSession() {
        return pageviewsPerSession;
    }

    public void setPageviewsPerSession(double pageviewsPerSession) {
        this.pageviewsPerSession = pageviewsPerSession;
    }

    public int getUniqueVisitors() {
        return uniqueVisitors;
    }

    public void setUniqueVisitors(int uniqueVisitors) {
        this.uniqueVisitors = uniqueVisitors;
    }

    public int getNumCountries() {
        return numCountries;
    }

    public void setNumCountries(int numCountries) {
        this.numCountries = numCountries;
    }

    public List<List<String>> getMapData() {
        return mapData;
    }

    public void setMapData(List<List<String>> mapData) {
        this.mapData = mapData;
    }

    public List<List<String>> getDailySessionData() {
        return dailySessionData;
    }

    public void setDailySessionData(List<List<String>> dailySessionData) {
        this.dailySessionData = dailySessionData;
    }

    public List<List<String>> getMonthlySessionData() {
        return monthlySessionData;
    }

    public void setMonthlySessionData(List<List<String>> monthlySessionData) {
        this.monthlySessionData = monthlySessionData;
    }
}