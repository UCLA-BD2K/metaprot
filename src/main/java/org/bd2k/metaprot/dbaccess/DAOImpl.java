package org.bd2k.metaprot.dbaccess;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bd2k.metaprot.aws.DynamoDBClient;
import org.bd2k.metaprot.dbaccess.repository.PatternRecogTaskRepository;
import org.bd2k.metaprot.dbaccess.repository.SessionDataRepository;
import org.bd2k.metaprot.dbaccess.repository.MetaboliteTaskRepository;
import org.bd2k.metaprot.dbaccess.repository.TimeSeriesTaskRepository;
import org.bd2k.metaprot.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Implementation of DAO interface.
 *
 * Created by allengong on 8/30/16.
 */
@Component
public class DAOImpl implements DAO {

    // repositories
    @Autowired
    private MetaboliteTaskRepository metaboliteTaskRepository;

    @Autowired
    private PatternRecogTaskRepository PRTaskRepository;

    @Autowired
    private TimeSeriesTaskRepository timeSeriesTaskRepository;

    @Autowired
    private SessionDataRepository sessionDataRepository;

    @Autowired
    private DynamoDBClient dynamoDBClient;

    private final String TASK_CHUNK_TABLENAME = "Metaprot-Task-Chunk";

    private ObjectMapper mapper = new ObjectMapper();

    public DAOImpl() {}


    /* Metabolite Analysis */

    @Override
    public MetaboliteTask getMetaboliteTask(String token) {
        return metaboliteTaskRepository.findByToken(token);
    }

    @Override
    public boolean saveTask(MetaboliteTask task) {

        if (getMetaboliteTask(task.getToken()) != null) {
            return false;   // someone is trying to save a metaboliteTask whos UUID already exists!
        }

        metaboliteTaskRepository.save(task);
        return true;
    }

    @Override
    public void saveOrUpdateTask(MetaboliteTask metaboliteTask) {
        metaboliteTaskRepository.save(metaboliteTask);
    }

    @Override
    public List<List<MetaboliteStat>> getMetaboliteTaskResults(MetaboliteTask task) {

        if (task.getToken() == null) {
            return null;
        }

        List<List<MetaboliteStat>> results = null;

        try {
            String resultsAsString = dynamoDBClient.getChunksAsWhole(TASK_CHUNK_TABLENAME, task.getToken(),
                    task.getNumChunks());

            results = mapper.readValue(resultsAsString, new TypeReference<List<List<MetaboliteStat>>>(){});
        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }

    @Override
    public <T> int saveTaskResults(Task task, List<List<T>> results) {

        // quick validation
        if (task.getToken() == null) {
            return -1;
        }

        // upload results to DynamoDB as chunks
        int numChunks;
        try {
            numChunks = dynamoDBClient.uploadAsChunks(TASK_CHUNK_TABLENAME,
                    task.getToken(), mapper.writeValueAsString(results));
        } catch (Exception e) {
            e.printStackTrace();
            return -1;              // return -1, let caller handle error
        }

        // upload successful, return number of chunks used
        return numChunks;
    }


    /* Pattern Recognition */

    @Override
    public PatternRecogTask getPatternRecogTask(String token){
        return PRTaskRepository.findByToken(token);
    }

    @Override
    public boolean saveTask(PatternRecogTask task){

        if(getPatternRecogTask(task.getToken()) != null){
            return false;
        }

        PRTaskRepository.save(task);
        return true;
    }

    @Override
    public void saveOrUpdateTask(PatternRecogTask task) {
        PRTaskRepository.save(task);
    }

    @Override
    public List<List<PatternRecogStat>> getPRTaskResults(PatternRecogTask task) {

        if (task.getToken() == null) {
            return null;
        }

        List<List<PatternRecogStat>> results = null;

        try {
            String resultsAsString = dynamoDBClient.getChunksAsWhole(TASK_CHUNK_TABLENAME, task.getToken(),
                    task.getNumChunks());

            results = mapper.readValue(resultsAsString, new TypeReference<List<List<PatternRecogStat>>>(){});

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }

    @Override
    public TimeSeriesTask getTimeSeriesTask(String token) {
        return timeSeriesTaskRepository.findByToken(token);
    }

    @Override
    public boolean saveTask(TimeSeriesTask task) {
        if (getTimeSeriesTask(task.getToken()) != null) {
            return false;
        }
        timeSeriesTaskRepository.save(task);
        return true;
    }

    @Override
    public void saveOrUpdateTask(TimeSeriesTask task) {
        timeSeriesTaskRepository.save(task);
    }

    @Override
    public TimeSeriesResults getTimeSeriesTaskResults(Task task) {
        if (task.getToken() == null) {
            return null;
        }

        TimeSeriesResults results = null;

        try {
            String resultsAsString = dynamoDBClient.getChunksAsWhole(TASK_CHUNK_TABLENAME, task.getToken(),
                    task.getNumChunks());

            results = mapper.readValue(resultsAsString, new TypeReference<TimeSeriesResults>(){});

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }

    @Override
    public int saveTaskResults(TimeSeriesTask task, TimeSeriesResults results) {

        // quick validation
        if (task.getToken() == null) {
            return -1;
        }

        // upload results to DynamoDB as chunks
        int numChunks;
        try {
            numChunks = dynamoDBClient.uploadAsChunks(TASK_CHUNK_TABLENAME,
                    task.getToken(), mapper.writeValueAsString(results));
        } catch (Exception e) {
            e.printStackTrace();
            return -1;              // return -1, let caller handle error
        }

        // upload successful, return number of chunks used
        return numChunks;
    }


    /* Session Data */

    @Override
    public SessionData getSessionData(String token) {
        return sessionDataRepository.findByToken(token);
    }

    @Override
    public boolean saveSessionData(SessionData sessionData) {

        if (getSessionData(sessionData.getToken()) != null) {
            return false;   // someone is trying to save a task whos UUID already exists!
        }

        sessionDataRepository.save(sessionData);
        return true;
    }

    @Override
    public void saveOrUpdateSessionData(SessionData sessionData) {
        sessionDataRepository.save(sessionData);
    }

}
