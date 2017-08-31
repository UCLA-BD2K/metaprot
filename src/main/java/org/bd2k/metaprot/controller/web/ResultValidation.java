package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.model.ResultValidationResults;
import org.bd2k.metaprot.model.Task;
import org.bd2k.metaprot.util.Globals;
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
 * Created by Nate Sookwongse on 8/29/17.
 */
@Controller
@RequestMapping("/result-validation")
public class ResultValidation {

    @Autowired
    private DAOImpl dao;


    // for path construction
    private String root = Globals.getPathRoot();
    private String sep = Globals.getPathSeparator();

    @RequestMapping(method = RequestMethod.GET)
    public String getResultValidationIndex() {  // home page
        return "index";
    }

    @RequestMapping(value = "/results/{token}", method = RequestMethod.GET)
    public String getResultValidationResults(Model model, @PathVariable("token") String token) {

        // get task information from database
        Task task = dao.getTask(token);

        try {
            ResultValidationResults results = dao.getResultValidationResults(task);
            System.out.println(results);
            model.addAttribute("plot", "data:image/jpeg;base64, " + results.getBase64EncodedStaticPlot());
            model.addAttribute("results", results.getValues());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "result_validation_results";
    }

}
