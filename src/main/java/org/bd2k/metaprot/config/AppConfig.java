package org.bd2k.metaprot.config;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;

/**
 * Application configuration; specifically for MongoDB.
 * Note that instantiating a Mongo instance is deprecated, and instead,
 * MongoClient is used. MongoClient is a misleading name, as an instance
 * represents a POOL of connections to the database.
 *
 * Created by allengong on 8/30/16.
 */
@Configuration
public class AppConfig extends AbstractMongoConfiguration {

    @Value("${db.mongo.dbname}")
    private String databaseName;

    // singleton, a MongoClient represents a POOL of connections, not just one client
    private static MongoClient mongo = null;

    private Mongo getMongoInstance() {
        if (mongo ==  null) {
            mongo = new MongoClient();
        }

        return mongo;
    }

    @Override
    protected String getDatabaseName() {
        return databaseName;
    }

    @Override
    public Mongo mongo() throws Exception {
        return getMongoInstance();
    }

}
