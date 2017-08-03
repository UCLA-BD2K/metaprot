package org.bd2k.metaprot.data;

/**
 * Created by Nate Sookwongse 8/3/17.
 */

import java.util.ArrayList;
import java.util.List;

public class GoogleAnalyticsReport {
    private String month;
    private int pageviews;
    private double pageviewsPerVisit;
    private int uniqueVisitors;
    private int numCountries;
    private List<List<String>> mapData;
    private List<List<String>> dailyVisitsData;
    private List<List<String>> monthlyVisitsData;

    GoogleAnalyticsReport() {
        month = null;
        pageviews = 0;
        pageviewsPerVisit = 0;
        uniqueVisitors = 0;
        numCountries = 0;
        mapData = new ArrayList<>();
        dailyVisitsData = new ArrayList<>();
        monthlyVisitsData = new ArrayList<>();
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getPageviews() {
        return pageviews;
    }

    public void setPageviews(int pageviews) {
        this.pageviews = pageviews;
    }

    public double getPageviewsPerVisit() {
        return pageviewsPerVisit;
    }

    public void setPageviewsPerVisit(double pageviewsPerVisit) {
        this.pageviewsPerVisit = pageviewsPerVisit;
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

    public List<List<String>> getDailyVisitsData() {
        return dailyVisitsData;
    }

    public void setDailyVisitsData(List<List<String>> dailyVisitsData) {
        this.dailyVisitsData = dailyVisitsData;
    }

    public List<List<String>> getMonthlyVisitsData() {
        return monthlyVisitsData;
    }

    public void setMonthlyVisitsData(List<List<String>> monthlyVisitsData) {
        this.monthlyVisitsData = monthlyVisitsData;
    }
}