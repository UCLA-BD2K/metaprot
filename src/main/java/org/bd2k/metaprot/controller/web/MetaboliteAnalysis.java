package org.bd2k.metaprot.controller.web;

import com.amazonaws.util.IOUtils;
import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.exception.ResourceNotFoundException;
import org.bd2k.metaprot.model.MetaboliteTask;
import org.bd2k.metaprot.util.FileAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;


/**
 * Web controller for all Metabolite analysis-related
 * presentation logic.
 *
 * Created by allengong on 8/12/16.
 */
@Controller
@RequestMapping("/metabolite-analysis")
public class MetaboliteAnalysis {

    @Autowired
    private DAOImpl dao;

    @Deprecated
    private String LOCAL_DOWNLOAD_PATH = "";

    @RequestMapping(method = RequestMethod.GET)
    public String getMetaAnalysisIndex() {  // home page
        return "index";
    }

    @RequestMapping(value = "/results/{token}", method = RequestMethod.GET)
    public String getMetaAnalysisResults(Model model, @PathVariable("token") String token) {

        // get task information from database
        MetaboliteTask currentMetaboliteTask = dao.getMetaboliteTask(token);

        // no longer  needed, but here for demo table
        model.addAttribute("results", new FileAccess().getMetaboliteAnalysisResults(token));

        // data to pass back
        model.addAttribute("multipleResults", dao.getMetaboliteTaskResults(currentMetaboliteTask));
        model.addAttribute("token", token);
        model.addAttribute("pThreshold", currentMetaboliteTask.getpValueThreshold());
        model.addAttribute("fcThreshold", currentMetaboliteTask.getFcThreshold());

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
