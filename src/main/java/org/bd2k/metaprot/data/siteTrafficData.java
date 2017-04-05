package org.bd2k.metaprot.data;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Abineet on 4/1/2017.
 */
public class siteTrafficData {

    class dateMapper {
        String date;
        int visitCounter;
        public dateMapper(String dateToSave, int visitCounterToSave){
            date = dateToSave;
            visitCounter = visitCounterToSave;
        }
    }

    //private SimpleDateFormat fmt = new SimpleDateFormat("MMMM dd, yyyy", Locale.US);
    private SimpleDateFormat fmt = new SimpleDateFormat("dd-MMM-yyyy", Locale.US);
    private HashSet<String> currentDayIPAddresses;
    private int totalSiteVisitors;
    private LinkedList<dateMapper> dailyCounter;
    private HashMap<String, Integer> countryCounter;

    public siteTrafficData() {
        currentDayIPAddresses = new HashSet<>();
        totalSiteVisitors = 0;
        dailyCounter = new LinkedList<>();
        countryCounter = new HashMap<>();
        Date currentDate = new Date();
        System.out.printf("CurrentDate: %s\n", fmt.format(currentDate));
        for (int i = 365; i >= 0; i--) {
            long milliseconds = (long) i * 24 * 60 * 60 * 1000;
            Date current = new Date(currentDate.getTime() - milliseconds);
            //System.out.println(fmt.format(current));
            dailyCounter.addFirst(new dateMapper(fmt.format(current), 0));
        }
    }

    public void updateTrafficData(String ip, String country){
        dateMapper current = dailyCounter.getFirst();
        current.visitCounter += 1;
    }

    public String getFormattedTrafficData(){
        JSONObject JSONToReturn = new JSONObject();
        JSONArray dateCountMap = new JSONArray();
        for(int i = 0; i < dailyCounter.size(); i++){
            dateMapper curr = dailyCounter.get(i);
            JSONObject dateCounterDetails = new JSONObject();
            dateCounterDetails.put("date", curr.date);
            dateCounterDetails.put("count", curr.visitCounter);
            dateCountMap.add(dateCounterDetails);
        }
        JSONToReturn.put("dateCountMap", dateCountMap);
        return JSONToReturn.toJSONString();
    }

    /**
     * For testing purposes only.
     * @return
     */
    public static void main(String[] args){
        siteTrafficData test = new siteTrafficData();
        System.out.println(test.getFormattedTrafficData());
    }

}

