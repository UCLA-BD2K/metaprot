package org.bd2k.metaprot.data;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;

/**
 * Created by Abineet on 4/1/2017.
 */
public class siteTrafficData {

    class dateMapper{
        SimpleDateFormat date;
        int visitCounter = 0;
    }
    private HashSet<String> currentDayIPAddresses;
    private int totalSiteVisitors;
    private Queue<dateMapper> dailyCounter;
    private HashMap<String, Integer> countryCounter;

    public siteTrafficData() {
        currentDayIPAddresses = new HashSet<>();
        totalSiteVisitors = 0;
        dailyCounter = new LinkedList<>();
        countryCounter = new HashMap<>();
    }

}
