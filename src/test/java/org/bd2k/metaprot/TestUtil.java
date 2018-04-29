package org.bd2k.metaprot;

import org.bd2k.metaprot.aws.S3Client;
import org.bd2k.metaprot.util.Globals;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * Created by Nate Sookwongse on 10/6/17.
 */

@Component
public class TestUtil {

    public static final String TEST_TOKEN = "TEST-v90aj2309j-dsafnnvalkj1-zcvd13nvzkl";
    public static final String S3_BASE_KEY = "user-input/" + TEST_TOKEN + "/";

    // for path construction
    private String root = Globals.getPathRoot();
    private String sep = Globals.getPathSeparator();

    @Autowired
    private S3Client s3Client;

    private String[] testFiles = { "TEST_DEA_FILE", "TEST_R_DATA" };

    public void setupTestFiles() {
        for (String filename : testFiles) {
            //File file = new File("/Users/davidmeng/Desktop/Projects/metaprot/src/test/resources/" + filename);
            File file = new File(this.getClass().getResource("/" + filename).getFile());
            s3Client.uploadToS3(S3_BASE_KEY + filename, file);
        }

    }
}
