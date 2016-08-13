package org.bd2k.metaprot.controller.web;

import org.bd2k.metaprot.util.RManager;
import org.rosuda.JRI.REXP;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


/**
 * Web controller for all Metabolite analysis-related
 * presentation logic.
 *
 * Created by allengong on 8/12/16.
 */
@Controller
@RequestMapping("/metabolite-analysis")
public class MetaboliteAnalysis {

    private RManager manager = null;

    // returns a RManager that can be used to execute R scripts and commands
    private RManager getRManager() {
        if (manager != null) {
            return manager;
        } else {
            try {
                manager = RManager.getInstance();
                return manager;
            } catch (Exception e) {
                System.out.println("Exception!");
                e.printStackTrace();
            }
        }

        return null;
    }

    @RequestMapping(method = RequestMethod.GET)
    public String getMetaAnalysisIndex() {  // home page

        manager = getRManager();
        if (manager == null) {
            System.out.println("null manager");
            return "error";     // something is wrong with the R engine
        }

        REXP expression = manager.runRCommand("1+ 10");
        System.out.println(expression.asDouble());
        //manager.runRCommand("analyze.file('/Users/allengong/IdeaProjects/JavaTestProject/src/main/resources/R/MetaProt_Sample.csv', '/Users/allengong/IdeaProjects/JavaTestProject/src/main/resources/R/output/2.csv', '/Users/allengong/IdeaProjects/JavaTestProject/src/main/resources/R/output/2.png')");


        return "meta_analysis_index";
    }

}
