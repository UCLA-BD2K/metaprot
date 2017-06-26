package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

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
    public String getHomePage() {
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
