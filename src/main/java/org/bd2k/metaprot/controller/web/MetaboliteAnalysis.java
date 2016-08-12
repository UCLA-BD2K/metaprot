package org.bd2k.metaprot.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Web controller for all Metabolite analysis-related
 * presentation logic.
 *
 * Created by allengong on 8/12/16.
 */
@Controller
@RequestMapping("/metabolite-analysis")
public class MetaboliteAnalysis {

    @RequestMapping
    public String getMetaAnalysisIndex() {  // home page
        return "meta_analysis_index";
    }

}
