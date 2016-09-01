package org.bd2k.metaprot.controller.rest;

import org.bd2k.metaprot.aws.CopakbS3;
import org.bd2k.metaprot.aws.S3Status;
import org.bd2k.metaprot.dbaccess.DAOImpl;
import org.bd2k.metaprot.exception.BadRequestException;
import org.bd2k.metaprot.exception.ServerException;
import org.bd2k.metaprot.model.MetaboliteStat;
import org.bd2k.metaprot.model.Task;
import org.bd2k.metaprot.util.FileAccess;
import org.bd2k.metaprot.util.Globals;
import org.bd2k.metaprot.util.RManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * REST controller that exposes endpoints
 * related to analyzing files.
 *
 * Created by allengong on 8/12/16.
 */
@RestController
@RequestMapping("/analyze")
@DependsOn({"Globals"})
public class analyze {

    @Autowired
    private CopakbS3 copakbS3;

    @Autowired
    private DAOImpl dao;

    // for path construction
    private String root = Globals.getPathRoot();
    private String sep = Globals.getPathSeparator();

    // "/ssd2/metaprot"
    private final String LOCAL_FILE_DOWNLOAD_PATH = root + "ssd2" + sep + "metaprot";

    // "src/main/resources/R/scripts/r_sample_code.R"
    private final String METABOLITES_R_SCRIPT_LOC = "src" + sep + "main" + sep + "resources" + sep + "R" +
            sep + "scripts" + sep + "r_sample_code.R";

    private RManager manager = null;

    /* Analyzes CSV files  */
    @RequestMapping(value = "/metabolites/{token}", method = RequestMethod.POST)
    public String analyzeMetabolites(@PathVariable("token") String token,
                                     @RequestParam("objectKey") String key,
                                     @RequestParam("pThreshold") double pThreshold,
                                     @RequestParam("fcThreshold") double fcThreshold) {

        // validation
        String[] keyArr = key.split("/");
        if (!(key.startsWith("user-input/" + token)) ||
                pThreshold < 0 ||
                fcThreshold < 0 ||
                !(keyArr[keyArr.length-2].equals(token)) ||
                keyArr.length != 3) {

            // should return error message
            throw new BadRequestException("Invalid request, please try again later.");
        }

        S3Status s3Status = copakbS3.pullAndStoreObject(key, LOCAL_FILE_DOWNLOAD_PATH + sep + token);
        int status = s3Status.getStatusCode();
        System.out.println("new status s3: " + s3Status.toString());

        // error
        if (status == -1) {
            throw new ServerException("There was an error with your request, please try again later.");
        } else if (status > 0) {
            throw new BadRequestException(copakbS3.getAWSStatusMessage(status));
        }

        // everything is OK on the server end, attempt to analyze the file
        File rScript;
        try {
            manager = RManager.getInstance();
            rScript = new File(METABOLITES_R_SCRIPT_LOC);
            String str = rScript.getAbsolutePath().replace("\\","\\\\");
            manager.runRScript(str);        // (re) initializes R environment
            manager.runRCommand("analyze.file('" + LOCAL_FILE_DOWNLOAD_PATH + sep + token
                    + sep + keyArr[keyArr.length-1] + "', '" + LOCAL_FILE_DOWNLOAD_PATH + sep +
                    token + sep + "data.csv', '" + LOCAL_FILE_DOWNLOAD_PATH + sep + token + sep + "volcano.png', " +
                    pThreshold + ", " + fcThreshold + ")");
        } catch (Exception e) {
            // handle exception so that we can return appropriate error messages
            e.printStackTrace();
            throw new ServerException("There was an error with our R Engine. Please try again at a later time.");
        }

        // store results to database, TODO any new logic to read in all result files, for now just one, maybe just need to modify the file access function to return a list of lists
        List<List<MetaboliteStat>> totalResults = new ArrayList<>();
        List<MetaboliteStat> results = new FileAccess().getMetaboliteAnalysisResults(token);
        totalResults.add(results);

        Task currentTask = new Task(token, new Date(), keyArr[keyArr.length-1], pThreshold, fcThreshold, totalResults);
        boolean taskSaved = dao.saveTask(currentTask);

        if (!taskSaved) {
            throw new BadRequestException("There was an issue with your task token. Please try again at a later time.");
        }

        // everything went well, success message
        String successMessage = "Your file has been successfully analyzed! Head over to the %s page" +
                " to see the report.";

        // analysis complete and results recorded, safe to delete all temporary files
        new FileAccess().deleteTemporaryAnalysisFiles(token);

        return String.format(successMessage, "<a href='/metabolite-analysis/results/" + token + "'>results</a>");

    }

    @RequestMapping(value = "/token", method = RequestMethod.GET)
    public String getToken() {
        return UUID.randomUUID().toString();
    }
}
