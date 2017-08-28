package org.bd2k.metaprot.data;

/**
 * Created by Nate Sookwongse on 6/27/17.
 */

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.analytics.Analytics;
import com.google.api.services.analytics.AnalyticsScopes;
import com.google.api.services.analytics.model.Accounts;
import com.google.api.services.analytics.model.GaData;
import com.google.api.services.analytics.model.Profiles;
import com.google.api.services.analytics.model.Webproperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;


@PropertySource("classpath:application.properties")
public class GoogleAnalytics {

    // Credentials for ClientLogin Authorization.

    private static final String APPLICATION_NAME = "MetaProtGoogleAnalytics";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String KEY_FILENAME ="secret.p12";
    private static final String SERVICE_ACCOUNT_EMAIL = "metaprot@metaprot-172022.iam.gserviceaccount.com";

    public static Analytics initializeAnalytics() throws Exception {
        // Initializes an authorized analytics service object.

        File file = ResourceUtils.getFile("classpath:"+KEY_FILENAME);

        // Construct a GoogleCredential object with the service account email
        // and p12 file downloaded from the developer console.
        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleCredential credential = new GoogleCredential.Builder()
                .setTransport(httpTransport)
                .setJsonFactory(JSON_FACTORY)
                .setServiceAccountId(SERVICE_ACCOUNT_EMAIL)
                .setServiceAccountPrivateKeyFromP12File(file)
                .setServiceAccountScopes(AnalyticsScopes.all())
                .build();

        // Construct the Analytics service object.
        return new Analytics.Builder(httpTransport, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME).build();
    }

    public static String getFirstProfileId(Analytics analytics) throws IOException {
        // Get the first view (profile) ID for the authorized user.
        String profileId = null;

        // Query for the list of all accounts associated with the service account.
        Accounts accounts = analytics.management().accounts().list().execute();

        if (accounts.getItems().isEmpty()) {
            System.err.println("No accounts found");
        } else {
            String firstAccountId = accounts.getItems().get(0).getId();

            // Query for the list of properties associated with the first account.
            Webproperties properties = analytics.management().webproperties()
                    .list(firstAccountId).execute();

            if (properties.getItems().isEmpty()) {
                System.err.println("No Webproperties found");
            } else {
                String firstWebpropertyId = properties.getItems().get(0).getId();

                // Query for the list views (profiles) associated with the property.
                Profiles profiles = analytics.management().profiles()
                        .list(firstAccountId, firstWebpropertyId).execute();

                if (profiles.getItems().isEmpty()) {
                    System.err.println("No views (profiles) found");
                } else {
                    // Return the first (view) profile associated with the property.
                    profileId = profiles.getItems().get(0).getId();
                }
            }
        }
        return profileId;
    }

    public static GaData getVisitSummary(Analytics analytics, String profileId) throws IOException {
        // Query the Core Reporting API for the number of sessions
        // in the past seven days.
        return analytics.data().ga()
                .get("ga:" + profileId, "2017-06-01", "today", "ga:sessions,ga:pageviewsPerSession,ga:users")
                .execute();
    }

    public static GaData getDailySessionCounts(Analytics analytics, String profileId) throws IOException {
        return analytics.data().ga()
                .get("ga:" + profileId, "2017-07-10", "today", "ga:sessions")
                .setDimensions("ga:year, ga:month, ga:day")
                .execute();
    }

    public static GaData getMonthlySessionCounts(Analytics analytics, String profileId) throws IOException {
        return analytics.data().ga()
                .get("ga:" + profileId, "2017-06-01", "today", "ga:sessions")
                .setDimensions("ga:year, ga:month")
                .execute();
    }

    public static GaData getCountryData(Analytics analytics, String profileId) throws IOException {
        return analytics.data().ga()
                .get("ga:" + profileId, "2017-07-01", "today", "ga:sessions")
                .setDimensions("ga:country")
                .execute();
    }

    public static GaData getToolUsage(Analytics analytics, String profileId) throws IOException {
        return analytics.data().ga()
                .get("ga:" + profileId, "2017-07-01", "today", "ga:pageviews")
                .setFilters("ga:pagePath=@usage")
                .setDimensions("ga:pagePath")
                .execute();
    }
    public static void printResults(GaData results) {
        // Parse the response from the Core Reporting API for
        // the profile name and number of sessions.
        if (results != null && !results.getRows().isEmpty()) {
            System.out.println("View (Profile) Name: "
                    + results.getProfileInfo().getProfileName());
            System.out.println("Total Sessions: " + results.getRows().get(0).get(0));
            System.out.println("Pageviews per sessions: " + results.getRows().get(0).get(1));
            System.out.println("Unique Visitors: " + results.getRows().get(0).get(2));
        } else {
            System.out.println("No results found");
        }
    }

    public static GoogleAnalyticsReport getReport() {

        GoogleAnalyticsReport report = new GoogleAnalyticsReport();

        GaData results = null;
        GaData dailySessionCounts = null;
        GaData monthlySessionCounts = null;
        GaData countryData = null;
        GaData toolUsage = null;

        try {
            Analytics analytics = initializeAnalytics();
            String profile = getFirstProfileId(analytics);
            results = getVisitSummary(analytics, profile);
            dailySessionCounts = getDailySessionCounts(analytics, profile);
            monthlySessionCounts = getMonthlySessionCounts(analytics, profile);
            countryData = getCountryData(analytics, profile);
            toolUsage = getToolUsage(analytics, profile);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (results != null) {
            report.setMonth(new SimpleDateFormat("MMMM yyyy").format(new Date()));
            report.setSessions(Integer.parseInt(results.getRows().get(0).get(0)));
            report.setPageviewsPerSession(Double.parseDouble(results.getRows().get(0).get(1)));
            report.setUniqueVisitors(Integer.parseInt(results.getRows().get(0).get(2)));
        }

        if (countryData != null) {
            report.setNumCountries(countryData.getRows().size());
            report.setMapData(countryData.getRows());
        }

        if (dailySessionCounts != null) {
            report.setDailySessionData(dailySessionCounts.getRows());
        }

        if (monthlySessionCounts != null) {
            report.setMonthlySessionData(monthlySessionCounts.getRows());
        }

        if (toolUsage != null) {
            report.setToolUsage(toolUsage.getRows());
        }

        return report;
    }

}

