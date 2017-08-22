package org.bd2k.metaprot.controller.rest;

import org.bd2k.metaprot.aws.S3Client;
import org.bd2k.metaprot.data.GoogleAnalytics;
import org.bd2k.metaprot.data.GoogleAnalyticsReport;
import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.exception.ServerException;
import org.bd2k.metaprot.util.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
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

    @Autowired
    private EmailService emailService;

    @Autowired
    private S3Client s3Client;

    @RequestMapping(value = "/token", method = RequestMethod.GET)
    public String getToken() {
        return UUID.randomUUID().toString();
    }

    @RequestMapping(value= "/checkToken", method = RequestMethod.POST)
    public boolean checkToken(@RequestParam("token") String token){
        return s3Client.validToken(token);
    }

    /**
     * Given a session token, retrieve a list of filenames from S3 that are
     * associated with this token. The expiration time for these files will
     * also be reset. For example, if the S3 lifecycle is specified for
     * automatic deletion after 7 days, then the file(s) will be set to be
     * deleted 7 days from this most recent request for session data.
     * @param token
     * @return a list of String filenames associated with this session token
     */
    @RequestMapping(value= "/getSessionData", method = RequestMethod.POST)
    public List<String> getSessionData(@RequestParam("token") String token){
        List<String> files = s3Client.getSessionData(token);
        String s3BaseKey = S3Client.S3_FILE_PREFIX + token + "/";

        // Reset file expiration time for each file associated with this session token
        for (String file : files) {
            String s3ObjectKey = s3BaseKey + file;
            s3Client.resetFileExpiration(s3ObjectKey);
        }

        return files;

    }


    @RequestMapping(value= "/googleAnalyticsReport", method = RequestMethod.GET)
    public GoogleAnalyticsReport getGoogleAnalyticsReport(){
        return GoogleAnalytics.getReport();
    }

    /**
     * Forwards a user's site feedback to MetProt's feedback email.
     * @param fromEmail optional field in feedback form, specifying user's email
     * @param subject optional field in feedback form, specifying subject of feedback
     * @param text main body of feedback
     * @return a String message indicating the feedback has been sent successfully
     */
    @RequestMapping(value = "/sendFeedback", method = RequestMethod.POST)
    public String sendFeedback(@RequestParam("email") String fromEmail,
                               @RequestParam("subject") String subject,
                               @RequestParam("text") String text) {

        // Optional fields. Handle blank fields appropriately
        fromEmail = fromEmail.isEmpty() ? "anon." : fromEmail;
        subject = subject.isEmpty() ? "N/A" : subject;
        String content = "From: " + fromEmail + "\n\n" + "Feedback: " + text;
        try {
            emailService.sendFeedback(subject, content);
        } catch (MailException e) {
            e.printStackTrace();
            throw new ServerException("An error has occurred. Please try again later.");
        }
        return "Thank you for your feedback!";
    }

    /**
     * Sends an email to share a user's MetProt session token. A user can input
     * his/her own email to keep a record of the session token and possibly come back
     * to it later, or someone else's email to share the session token.
     *
     * @param toEmail
     * @param nameFrom
     * @param nameTo
     * @param token
     * @param request
     * @return
     */
    @RequestMapping(value = "/shareToken", method = RequestMethod.POST)
    public String shareToken(@RequestParam("email") String toEmail,
                             @RequestParam("nameFrom") String nameFrom,
                             @RequestParam("nameTo") String nameTo,
                             @RequestParam("token") String token,
                             HttpServletRequest request) {

        // generate url link for user to click and load token and session data
        String url = request.getRequestURL().toString().replace("util/shareToken", "upload/"+token);

        // content of email that will be sent
        String content = String.format(
                "Hello %s,\n\n" +
                "You have been sent a MetProt session token from %s. " +
                "Please click on this link (or copy and paste in your browser) to access this session: %s\n\n" +
                "MetProt is a cloud-based platform to Analyze, Annotate, and Integrate Metabolomics Datasets with Proteomics Information.",
                nameTo, nameFrom, url);

        try {
            emailService.sendSimpleMessage(toEmail, "MetProt Shared Session Token", content);
        } catch (MailException e) {
            e.printStackTrace();
            throw new ServerException("An error has occurred. Please try again later.");
        }
        return "Your session token has been successfully sent!";

    }

}
