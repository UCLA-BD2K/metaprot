package org.bd2k.metaprot.data;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.util.EntityUtils;
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

    private SimpleDateFormat fmt = new SimpleDateFormat("dd-MMM-yyyy", Locale.US);
    private HashSet<String> currentDayIPAddresses;
    private int totalSiteVisitors;
    private LinkedList<dateMapper> dailyCounter;
    private HashMap<String, Integer> countryCounter;
    private static final HttpClient HTTP_CLIENT = new DefaultHttpClient();

    /**
     * Constructs new instance and initializes data structures
     */
    public siteTrafficData() {
        currentDayIPAddresses = new HashSet<>();
        totalSiteVisitors = 0;
        dailyCounter = new LinkedList<>();
        countryCounter = new HashMap<>();
        Date currentDate = new Date();
        //System.out.printf("CurrentDate: %s\n", fmt.format(currentDate));
        for (int i = 365; i >= 0; i--) {
            long milliseconds = (long) i * 24 * 60 * 60 * 1000;
            Date current = new Date(currentDate.getTime() - milliseconds);
            //System.out.println(fmt.format(current));
            dailyCounter.addFirst(new dateMapper(fmt.format(current), 0));
        }


    }

    /**
     * Update counter if given ip address hasn't visited today.
     * @param ip - IP address of user querying website
     * @param country - country of incoming IP
     */
    public void updateTrafficData(String ip, String country){
        dateMapper current = dailyCounter.getFirst();
        Date today = new Date();
        if(current.date != fmt.format(today)){
            dailyCounter.pollLast();
            dailyCounter.addFirst(new dateMapper(fmt.format(today), 0));
            current = dailyCounter.getFirst();
        }
        if(!currentDayIPAddresses.contains(ip)) {
            current.visitCounter += 1;
            totalSiteVisitors++;
            currentDayIPAddresses.add(ip);

            if(!countryCounter.containsKey(country))
                countryCounter.put(country, 0);
            int i = countryCounter.get(country);
            i += 1;
            countryCounter.put(country,i);
        }
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

        JSONArray countryCountMap = new JSONArray();
        Iterator it = countryCounter.entrySet().iterator();
        while(it.hasNext()){
            JSONObject countryDetails = new JSONObject();
            Map.Entry pair = (Map.Entry)it.next();
            countryDetails.put("country", pair.getKey());
            countryDetails.put("count", pair.getValue());
            countryCountMap.add(countryDetails);
            it.remove();
        }
        JSONToReturn.put("countryCountMap", countryCountMap);

        JSONToReturn.put("totalVisitors", totalSiteVisitors);
        return JSONToReturn.toJSONString();
    }

    public static void getIPInfo(String ip) {
        String url = "http://freegeoip.net/" + ip; // Using the API
        try {
            HttpGet httpGet = new HttpGet(url);
            HttpResponse httpResponse = HTTP_CLIENT.execute(httpGet, new BasicHttpContext());
            String responseString;
            if (httpResponse.getStatusLine().getStatusCode() != HttpStatus.SC_OK) {
                throw new RuntimeException("Sorry! Response Error. Status Code: " + httpResponse.getStatusLine().getStatusCode());
            }
            responseString = EntityUtils.toString(httpResponse.getEntity());
        } catch (Exception ex) {
            System.out.println(ex.toString());
        } finally {
            HTTP_CLIENT.getConnectionManager().shutdown();
        }
    }
}

