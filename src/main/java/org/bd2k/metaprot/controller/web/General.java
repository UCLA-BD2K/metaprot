package org.bd2k.metaprot.controller.web;

import com.google.api.services.analytics.Analytics;
import com.google.api.services.analytics.model.GaData;
import org.bd2k.metaprot.data.GoogleAnalytics;
import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Web controller that handles general URLs.
 *
 * An example is the / endpoint (homepage).
 *
 * Created by allengong on 10/6/16.
 */
@Controller
public class General {

    @Autowired
    private DAOImpl dao;

    /**
     * Home page
     * @return
     */
    @RequestMapping("/")
    public String getHomePage(Model model) {

        GaData results = null;
        GaData dailyVisitCounts = null;
        GaData monthlyVisitCounts = null;
        GaData countryData = null;
        int numCountries = 0;

        try {
            Analytics analytics = GoogleAnalytics.initializeAnalytics();
            String profile = GoogleAnalytics.getFirstProfileId(analytics);
            results = (GoogleAnalytics.getVisitSummary(analytics, profile));
            dailyVisitCounts = GoogleAnalytics.getDailyVisitCounts(analytics, profile);
            monthlyVisitCounts = GoogleAnalytics.getMonthlyVisitCounts(analytics, profile);
            countryData = GoogleAnalytics.getCountryData(analytics, profile);
            System.out.println(results);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (results != null) {
            model.addAttribute("month", "As of " + new SimpleDateFormat("MMMM yyyy").format(new Date()) + ", Google Analytics reports the following data on MetaProt:");
            model.addAttribute("pageviews", String.format("%s", results.getRows().get(0).get(0)));
            model.addAttribute("pageviewsPerVisit", String.format("%.02f", Float.valueOf(results.getRows().get(0).get(1))));
            model.addAttribute("uniqueVisitors", results.getRows().get(0).get(2));
        } else {
            model.addAttribute("month", "As of " + new SimpleDateFormat("MMMM yyyy").format(new Date()) + ", Google Analytics reports the following data on MetaProt:");
            model.addAttribute("pageviews", "n/a");
            model.addAttribute("pageviewsPerVisit", "n/a");
            model.addAttribute("uniqueVisitors", "n/a");
            model.addAttribute("numCountries", "n/a");
        }

        if (countryData != null) {
            model.addAttribute("numCountries", countryData.getRows().size());
            model.addAttribute("mapData", countryData.getRows());
        }

        if (dailyVisitCounts != null) {
            System.out.print(dailyVisitCounts.getRows());
            model.addAttribute("dailyVisitsData", dailyVisitCounts.getRows());
        }

        if (monthlyVisitCounts != null) {
            System.out.print(monthlyVisitCounts.getRows());
            model.addAttribute("monthlyVisitsData", monthlyVisitCounts.getRows());
        }


        return "index";
    }

    /**
     * Invoked when user wants to upload a file for analysis.
     * @return
     */
    @RequestMapping("/upload/{token}")
    public String getTokenUploadPage(Model model, @PathVariable("token") String token) {
        System.out.println(token);

        model.addAttribute("token", token);     // pass token to view as model variable
        model.addAttribute("sessionData", dao.getSessionData(token));

        return "upload";
    }

    /**
     * Invoked when user wants to upload a file for analysis.
     * @return
     */
    @RequestMapping("/upload")
    public String getUploadPage(Model model) {

        model.addAttribute("sessionData", "INVALID");

        return "upload";
    }

    /**
     * Invoked when an upload + integrity check was successful, and a
     * corresponding view page needs to be returned for the next steps.
     * @param token
     * @return
     */
    @RequestMapping("/upload-pass/{token}")
    public String getUploadPassPage(Model model, @PathVariable("token") String token) {
        System.out.println(token);

        model.addAttribute("token", token);     // pass token to view as model variable
        model.addAttribute("sessionData", dao.getSessionData(token));

        return "upload_pass";
    }

    /**
     * Invoked when an upload + integrity check was successful, and a
     * corresponding view page needs to be returned for the next steps.
     * @return
     */
    @RequestMapping("/upload-pass")
    public String getUploadPassPage() {
        //System.out.println(token);

        //model.addAttribute("token", token);     // pass token to view as model variable

        return "upload_pass";
    }

    @RequestMapping("/analysis")
    public String getAnalysisPage() {
        return "analysis";
    }

    @RequestMapping("/about")
    public String getAboutPage() {
        return "about";
    }

    @RequestMapping("/contact")
    public String getContactPage() {
        return "contact";
    }

}
