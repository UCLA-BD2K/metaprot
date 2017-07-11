package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.TimeSeriesResults;
import org.bd2k.metaprot.model.TimeSeriesTask;
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

        // grab task given by token passed
        TimeSeriesTask task = dao.getTimeSeriesTask(token);
        // grab results from DB
        TimeSeriesResults results = dao.getTimeSeriesTaskResults(task);

        // data to pass back
        model.addAttribute("results", results.getValues());
        model.addAttribute("metabolites", results.getMetabolites());
        model.addAttribute("significance_values", results.getSignificances());

        return "time_series_viewer";
    }

}
