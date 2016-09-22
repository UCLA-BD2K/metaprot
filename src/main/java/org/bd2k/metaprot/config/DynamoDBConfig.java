package org.bd2k.metaprot.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;

import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for DynamoDB.
 *
 * Created by allengong on 9/22/16.
 */
@Configuration
@EnableDynamoDBRepositories(basePackages = "org.bd2k.metaprot.dbaccess.repository")
public class DynamoDBConfig {

    @Value("${aws.dynamo.endpoint}")
    private String dynamoEndpoint;

    @Value("${aws.access.key}")
    private String accessKey;

    @Value("${aws.secret.access.key}")
    private String secretAccessKey;

    @Bean
    public AmazonDynamoDB amazonDynamoDB(AWSCredentials credentials) {

        if (dynamoEndpoint.isEmpty()) {
            return null;
        }

        AmazonDynamoDB amazonDynamoDB = new AmazonDynamoDBClient(credentials);
        amazonDynamoDB.setEndpoint(dynamoEndpoint);

        return amazonDynamoDB;
    }

    // for use in autowiring above
    @Bean
    public AWSCredentials amazonAWSCredentials() {
        return new BasicAWSCredentials(accessKey, secretAccessKey);
    }
}
