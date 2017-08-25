package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.PatternRecognitionResults;
import org.bd2k.metaprot.model.PatternRecognitionTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Web controller for all Time Series analysis-related
 * presentation logic.
 *
 * Created by Nate Sookwongse on 7/6/17.
 */
@Controller
@RequestMapping("/pattern")
public class PatternRecognition {

    @Autowired
    private DAOImpl dao;

    @RequestMapping(method = RequestMethod.GET)
    public String getPatternRecognitionIndex() {  // home page
        return "index";
    }

    @RequestMapping(value = "/results/{token}", method = RequestMethod.GET)
    public String getPatternRecognitionResults(Model model, @PathVariable("token") String token) {

        // grab task given by token passed
        PatternRecognitionTask task = dao.getPatternRecognitionTask(token);
        // grab results from DB
        PatternRecognitionResults results = dao.getPatternRecognitionResults(task);

        // data to pass back
        model.addAttribute("results", results.getValues());
        model.addAttribute("metabolites", results.getMetabolites());
        model.addAttribute("significance_values", results.getSignificances());

        return "pattern_recognition_results";
    }

}
