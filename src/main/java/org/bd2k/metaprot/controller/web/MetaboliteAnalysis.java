package org.bd2k.metaprot.controller.web;

import com.amazonaws.util.IOUtils;
import org.bd2k.metaprot.exception.ResourceNotFoundException;
import org.bd2k.metaprot.model.MetaboliteStat;
import org.bd2k.metaprot.util.FileAccess;
import org.bd2k.metaprot.util.Globals;
import org.bd2k.metaprot.util.RManager;
import org.rosuda.JRI.REXP;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


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

    @Value("${local.path.downloadPath}")    // no longer used
    private String LOCAL_DOWNLOAD_PATH;

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

        return "meta_analysis_index";
    }

    @RequestMapping(value = "/results/{token}", method = RequestMethod.GET)
    public String getMetaAnalysisResults(Model model,
                                         @PathVariable("token") String token,
                                         @RequestParam(value = "pthresh", required = false) Double pThreshold,
                                         @RequestParam(value = "fcthresh", required = false) Double fcThreshold) {

        // defaults
        model.addAttribute("pThreshold", 0.1);
        model.addAttribute("fcThreshold", 1.5);

        if (pThreshold != null) {
            model.addAttribute("pThreshold", pThreshold);
        }

        if (fcThreshold != null) {
            model.addAttribute("fcThreshold", fcThreshold);
        }

        // no longer  needed, but here for demo table
        model.addAttribute("results", new FileAccess().getMetaboliteAnalysisResults(token));

        model.addAttribute("token", token);

        List<MetaboliteStat> temp = new FileAccess().getMetaboliteAnalysisResults(token);
        List<List<MetaboliteStat>> multipleResults = new ArrayList<>();
        multipleResults.add(temp);

        model.addAttribute("multipleResults", multipleResults); // test with multiple results

        return "meta_analysis_results";
    }

    @Deprecated
    @ResponseBody
    @RequestMapping(value="/results/image/{token}/{filename:.+}", method = RequestMethod.GET,
        produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getReportImage(@PathVariable("token") String token,
                                 @PathVariable("filename") String filename) {

        File file =  new File(LOCAL_DOWNLOAD_PATH + "/" + token + "/" + filename);
        if (file.exists() && filename.endsWith(".png")) {
            try {
                InputStream is = new FileInputStream(file);
                return IOUtils.toByteArray(is);
            } catch (Exception e) {
                e.printStackTrace();
                throw new ResourceNotFoundException("The requested image was not found");
            }
        }

        return null;
    }

}
