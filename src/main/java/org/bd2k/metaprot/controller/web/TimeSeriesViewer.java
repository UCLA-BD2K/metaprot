package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.TimeSeriesStat;
import org.bd2k.metaprot.util.FileAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Web controller for all Metabolite analysis-related
 * presentation logic.
 *
 * Created by Nate Sookwongse on 7/6/17.
 */
@Controller
@RequestMapping("/time-series-viewer")
public class TimeSeriesViewer {

    @Autowired
    private DAOImpl dao;

    @RequestMapping(method = RequestMethod.GET)
    public String getTimeSeriesIndex() {  // home page
        return "time_series_index";
    }

    @RequestMapping(value = "/results/{token}", method = RequestMethod.GET)
    public String getTimeSeriesViewer(Model model, @PathVariable("token") String token) {

        // get task information from database
       // MetaboliteTask currentMetaboliteTask = dao.getMetaboliteTask(token);
        System.out.print(new FileAccess().getTimeSeriesAnalysisResults(token));
        // no longer  needed, but here for demo table
        FileAccess fa = new FileAccess();
        List<TimeSeriesStat> stats = fa.getTimeSeriesAnalysisResults(token);
        Set<String> metabolites = new HashSet<>();

        for (int i = 1; i < stats.size(); i++) {
            metabolites.add(stats.get(i).getMetaboliteName());
        }


        model.addAttribute("results", stats);
        model.addAttribute("metabolites", metabolites);
        model.addAttribute("significance_values", fa.getTimeSeriesSignificanceResults(token));

        // data to pass back
       // model.addAttribute("multipleResults", dao.getMetaboliteTaskResults(currentMetaboliteTask));
        //model.addAttribute("token", token);
        //model.addAttribute("pThreshold", currentMetaboliteTask.getpValueThreshold());
        //model.addAttribute("fcThreshold", currentMetaboliteTask.getFcThreshold());

        return "time_series_viewer";
    }

}
