package org.bd2k.metaprot.aws;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

import org.bd2k.metaprot.util.Globals;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

/**
 * Provides access to AWS S3 resources. Configured as a component to allow
 * autowiring.
 *
 * Created by allengong on 8/8/16.
 */
@Component
@PropertySource("classpath:application.properties")
@DependsOn({"Globals"})
public class CopakbS3 {

    private final int BUFFER_SIZE = 1024 * 16;   // 16 bytes

    // for path construction
    //private String root = Globals.getPathRoot();
    private String sep = Globals.getPathSeparator();

    // .properties
    @Value("${aws.access.key}")
    String accessKey;

    @Value("${aws.secret.access.key}")
    String secretAccessKey;

    @Value("${aws.s3.bucketName}")
    String bucketName;

    AWSCredentials credentials;
    AmazonS3Client s3Client;

    public CopakbS3() {
        // intentionally empty, allowing for bean instantiation
    }

    @PostConstruct
    private void initializeInstance() {
        // after bean instantiation + property injection, initialize these values
        credentials = new BasicAWSCredentials(accessKey, secretAccessKey);
        s3Client = new AmazonS3Client(credentials);
    }

    /**
     * Given a S3 object key and a destination write path, pull object from s3
     * and store locally. This is a blocking call (i.e. NOT ASYNCHRONOUS).
     * @param objectKey s3 object key, e.g. tokenValue/abc.txt
     * @param destinationPath where to store the local file, NOT including the file name (which is
     *                        inferred from the objectKey)
     * @return S3Status instance with status code, -1 means local error, 0 means success, and everything else is an
     * AWS related error. For the latter, use getAWSStatusMessage() to return a human readable message.
     */
    public S3Status pullAndStoreObject(String objectKey, String destinationPath) {
        S3Object object;
        int sc = 0;         // status code
        long totalBytesRead = 0;

        // get filename from objectKey
        String[] arr = objectKey.split("/");
        String fileName = arr[arr.length-1];

        try {
            object = s3Client.getObject(new GetObjectRequest(bucketName, objectKey));
        } catch (AmazonS3Exception ae) {
            ae.printStackTrace();
            return new S3Status(fileName, -1, ae.getStatusCode());
        }


        InputStream is = null;
        FileOutputStream fos = null;

        try {
            // file creation
            File file = new File(destinationPath);
            file.mkdirs();  // create any intermediate directories if they do not exist

            // initialize streams
            is = object.getObjectContent();
            fos = new FileOutputStream(destinationPath + sep + fileName);

            int bytesRead;
            byte[] buff = new byte[BUFFER_SIZE];
            while ((bytesRead = is.read(buff)) != -1) {
                totalBytesRead+=bytesRead;

                // write and flush
                fos.write(buff, 0, bytesRead);
                fos.flush();

                // zero out buffer
                buff = new byte[BUFFER_SIZE];
            }
            System.out.println("Read " + totalBytesRead + " bytes from S3 for file: " + objectKey +".");
        } catch (Exception e) {
            e.printStackTrace();
            sc = -1;
        } finally {
            try {
                if (is != null) {
                    is.close();
                }

                if (fos != null) {
                    fos.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
                sc = -1;
            }
        }

        return new S3Status(fileName, totalBytesRead, sc);
    }

    /**
     * Given a httpStatus code, return a user friendly error message.
     *
     * @param httpStatusCode the status code
     * @return a user friendly string detailing the error.
     */
    public String getAWSStatusMessage(int httpStatusCode) {
        String message;

        switch(httpStatusCode) {
            case 403:       // access denied
                message = "Access denied, please contact abc@xyz.com";
                break;
            case 404:
                message = "Invalid file request, please try again at a later time.";
                break;
            default:
                message = "Something went wrong with your request, please contact abc@xya.com";
        }

        return message;
    }

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
