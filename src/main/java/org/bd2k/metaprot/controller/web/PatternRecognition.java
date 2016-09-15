package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.PatternRecogStat;
import org.bd2k.metaprot.model.PatternRecogTask;
import org.bd2k.metaprot.util.FileAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

/**
 * Web controller for temporal pattern recognition.
 *
 * Created by Abineet on 8/31/2016.
 */
@Controller
@RequestMapping("/temporal-pattern-recognition")
public class PatternRecognition {

    @Autowired
    private DAOImpl dao;

    @RequestMapping(method = RequestMethod.GET)
    public String getPatternRecognitionIndex(){
        return "pattern_recognition_index";
    }

    @RequestMapping(value = "/results/{token}", method = RequestMethod.GET)
    public String getPatternRecognitionResults(Model model, @PathVariable("token") String token){

        // retrieve the task information from the database; pass back to view
        PatternRecogTask task = dao.getPatternRecogTask(token);
        model.addAttribute("results", task.getResults());
        model.addAttribute("token", token);
        model.addAttribute("numClusters", task.getNumClusters());
        model.addAttribute("minMembersPerCluster", task.getMinMembersPerCluster());
        
        return "pattern_recognition_results";
    }

}
