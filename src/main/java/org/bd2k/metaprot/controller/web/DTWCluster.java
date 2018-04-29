package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.DTWClusterResults;
import org.bd2k.metaprot.model.PatternRecognitionResults;
import org.bd2k.metaprot.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * Web controller for all Pattern Recognition Analysis related
 * presentation logic.
 *
 * Created by Nate Sookwongse on 7/6/17.
 */
@Controller
@RequestMapping("/dtw-cluster")
public class DTWCluster {

    @Autowired
    private DAOImpl dao;

    @RequestMapping(method = RequestMethod.GET)
    public String getDTWClusterIndex() {  // home page
        return "index";
    }

    @RequestMapping(value = "/elbow-plot-results/{token}", method = RequestMethod.GET)
    public String getElbowPlotResults(Model model, @PathVariable("token") String token) {

        // grab task given by token passed
        Task task = dao.getTask(token);
        // grab results from DB
        String results = dao.getElbowPlotResults(task);

        // data to pass back
        model.addAttribute("plot", "data:image/jpeg;base64, " + results);
        model.addAttribute("token", task.getSessionToken());
        model.addAttribute("filename", task.getFilename());

        return "elbow_plot_results";
    }

    @RequestMapping(value = "/cluster-results/{token}", method = RequestMethod.GET)
    public String getClusterResults(Model model, @PathVariable("token") String token) {

        // grab task given by token passed
        Task task = dao.getTask(token);
        // grab results from DB
        DTWClusterResults results = dao.getDTWClusterResults(task);

        // data to pass back
        model.addAttribute("plot", "data:image/jpeg;base64, " + results.getBase64EncodedStaticPlot());
        model.addAttribute("clusters", results.getValues());

        return "dtw_cluster_results";
    }

}
