package org.bd2k.metaprot.controller.rest;

import org.bd2k.metaprot.aws.CopakbS3;
import org.bd2k.metaprot.exception.BadRequestException;
import org.bd2k.metaprot.exception.ServerException;
import org.bd2k.metaprot.util.RManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.UUID;

/**
 * REST controller that exposes endpoints
 * related to analyzing files.
 *
 * Created by allengong on 8/12/16.
 */
@RestController
@RequestMapping("/analyze")
public class analyze {

    @Autowired
    private CopakbS3 copakbS3;

    private final String LOCAL_FILE_DOWNLOAD_PATH = "/ssd2/metaprot";
    private final String METABOLITES_R_SCRIPT_LOC = "src/main/resources/R/scripts/r_sample_code.R";

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

        int status = copakbS3.pullAndStoreObject(key, LOCAL_FILE_DOWNLOAD_PATH + "/" + token);

        // error
        if (status == -1) {
            throw new ServerException("There was an error with your request, please try again later.");
        } else if (status > 0) {
            throw new BadRequestException(copakbS3.getAWSStatusMessage(status));
        }

        // everything is OK on the server end, attempt to analyze the file
        File rScript = null;
        try {
            manager = RManager.getInstance();
            rScript = new File(METABOLITES_R_SCRIPT_LOC);
            manager.runRScript(rScript.getAbsolutePath());        // (re) initializes R environment
            manager.runRCommand("analyze.file('" + LOCAL_FILE_DOWNLOAD_PATH + "/" + token
                    + "/" + keyArr[keyArr.length-1] + "', '" + LOCAL_FILE_DOWNLOAD_PATH + "/" +
                    token + "/data.csv', '" + LOCAL_FILE_DOWNLOAD_PATH + "/" + token + "/volcano.png', " +
                    pThreshold + ", " + fcThreshold + ")");
        } catch (Exception e) {
            // handle exception so that we can return appropriate error messages
            e.printStackTrace();
            throw new ServerException("There was an error with our R Engine. Please try again later.");
        }

        String successMessage = "Your file has been successfully analyzed! Head over to the %s page" +
                " to see the report.";

        // analysis complete, safe to delete the uploaded csv file locally
        File uploadedFile = new File(LOCAL_FILE_DOWNLOAD_PATH + "/" + token + "/" + keyArr[keyArr.length-1]);
        if (uploadedFile.exists()) {
            uploadedFile.delete();      // attempt to delete the uploaded file
        }

        return String.format(successMessage, "<a href='/metabolite-analysis/results/" + token + "'>results</a>");

    }

    @RequestMapping(value = "/token", method = RequestMethod.GET)
    public String getToken() {
        return UUID.randomUUID().toString();
    }
}
