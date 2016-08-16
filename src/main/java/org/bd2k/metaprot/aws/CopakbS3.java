package org.copakb.server.util;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

/**
 * Provides access to AWS S3 resources. Create an instance of this class, and
 * call initializeInstance().
 * Created by allengong on 8/8/16.
 */
@Component
@PropertySource("classpath:application.properties")
public class CopakbS3 {

    private final int BUFFER_SIZE = 1024 * 16;   // 16 bytes

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
     * @param objectKey s3 object key
     * @param destinationPath destination of local file (without the filename as it is in objectKey)
     */
    public void pullAndStoreObject(String objectKey, String destinationPath) {
        S3Object object = s3Client.getObject(new GetObjectRequest(bucketName, objectKey));

        InputStream is = null;
        FileOutputStream fos = null;

        try {
            // file creation
            File file = new File(destinationPath);
            file.mkdirs();  // create any intermediate directories if they do not exist
            String[] arr = objectKey.split("/");
            String fileName = arr[arr.length-1];

            // initialize streams
            is = object.getObjectContent();
            fos = new FileOutputStream(destinationPath + "/" + fileName);

            int bytesRead;
            long totalBytesRead = 0;
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
            }
        }
    }

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
