package org.bd2k.metaprot;

/**
 * Created by Nate Sookwongse on 8/8/17.
 */

import org.apache.commons.io.FileUtils;
import org.bd2k.metaprot.aws.S3Client;
import org.bd2k.metaprot.aws.S3Status;
import org.bd2k.metaprot.util.Globals;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.bd2k.metaprot.TestConstants.S3_BASE_KEY;
import static org.bd2k.metaprot.TestConstants.TEST_TOKEN;
import static org.junit.Assert.*;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = MetaprotApplication.class, loader = AnnotationConfigContextLoader.class)
public class S3ClientTest {


    // for path construction
    private String root = Globals.getPathRoot();
    private String sep = Globals.getPathSeparator();

    @Autowired
    private S3Client s3Client;

    private String TEST_FILE = "TEST_DEA_FILE";
    @Test
    public void testResetFileExpiration() {
        String s3Key = S3_BASE_KEY + TEST_FILE;
        assertTrue("Failure - Reset file expiration was not successful.",
                s3Client.resetFileExpiration(s3Key));
    }

    @Test
    public void testPullAndStoreFile_WithValidKey() {

        String s3Key = S3_BASE_KEY + TEST_FILE;
        String outputPath = root + "TEST_LOCATION" + sep;
        S3Status status = s3Client.pullAndStoreObject(s3Key, outputPath);
        assertEquals("Failure - filenames do not match.", TEST_FILE, status.getFileName());
        assertEquals("Failure - S3 status incorrect.", 0, status.getStatusCode());

        File testFile = new File(outputPath  + TEST_FILE);
        File checkFile = new File(outputPath + "CHECK_DEA_FILE");

        if (!checkFile.exists()) {
            System.out.println("Missing necessary test file: " + checkFile);
            return;
        }
        try {
            assertTrue("Failure - contents of downloaded file does not match.",
                    FileUtils.contentEquals(testFile, checkFile));
        } catch (IOException e){
            e.printStackTrace();
            fail();
        }
    }

    @Test
    public void testPullAndStoreFile_WithInvalidKey() {
        S3Status status = s3Client.pullAndStoreObject(S3_BASE_KEY + "FAKE_OBJECT_KEY", "FAKE_PATH");
        assertEquals("Failure - request for invalid S3 key should return status code 404",
                status.getStatusCode(), 404);
    }

    @Test
    public void testValidToken_WithValidToken() {
        assertTrue("Failure - TEST_TOKEN should be evaluated as a valid token.",
                s3Client.validToken(TEST_TOKEN));
    }

    @Test
    public void testValidToken_WithInvalidToken() {
        assertFalse("Failure - \"FAKE_TOKEN\" should NOT be evaluated as a valid token.",
                s3Client.validToken("FAKE_TOKEN"));
    }

    @Test
    public void testGetSessionData_WithValidToken() {
        List<String> sessionData = s3Client.getSessionData(TEST_TOKEN);
        assertTrue(sessionData.equals(Arrays.asList("TEST_DEA_FILE", "TEST_R_DATA")));
    }

    @Test
    public void testGetSessionData_WithInvalidToken() {
        List<String> sessionData = s3Client.getSessionData("FAKE_TOKEN");
        assertEquals(sessionData.size(), 0);
    }


}

