package org.bd2k.metaprot.dbaccess;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bd2k.metaprot.aws.DynamoDBClient;
import org.bd2k.metaprot.dbaccess.repository.MetaboliteTaskRepository;
import org.bd2k.metaprot.dbaccess.repository.PatternRecognitionTaskRepository;
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
    private PatternRecognitionTaskRepository PRTaskRepository;

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
/*
    @Override
    public PatternRecogTask_old getPatternRecogTask(String token){
        return PRTaskRepository.findByToken(token);
    }

    @Override
    public boolean saveTask(PatternRecogTask_old task){

        if(getPatternRecogTask(task.getToken()) != null){
            return false;
        }

        PRTaskRepository.save(task);
        return true;
    }

    @Override
    public void saveOrUpdateTask(PatternRecogTask_old task) {
        PRTaskRepository.save(task);
    }

    @Override
    public List<List<PatternRecogStat_old>> getPRTaskResults(PatternRecogTask_old task) {

        if (task.getToken() == null) {
            return null;
        }

        List<List<PatternRecogStat_old>> results = null;

        try {
            String resultsAsString = dynamoDBClient.getChunksAsWhole(TASK_CHUNK_TABLENAME, task.getToken(),
                    task.getNumChunks());

            results = mapper.readValue(resultsAsString, new TypeReference<List<List<PatternRecogStat_old>>>(){});

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }*/

    @Override
    public PatternRecognitionTask getPatternRecognitionTask(String token) {
        return PRTaskRepository.findByToken(token);
    }

    @Override
    public boolean saveTask(PatternRecognitionTask task) {
        if (getPatternRecognitionTask(task.getToken()) != null) {
            return false;
        }
        PRTaskRepository.save(task);
        return true;
    }

    @Override
    public void saveOrUpdateTask(PatternRecognitionTask task) {
        PRTaskRepository.save(task);
    }

    @Override
    public PatternRecognitionResults getPatternRecognitionResults(Task task) {
        if (task.getToken() == null) {
            return null;
        }

        PatternRecognitionResults results = null;

        try {
            String resultsAsString = dynamoDBClient.getChunksAsWhole(TASK_CHUNK_TABLENAME, task.getToken(),
                    task.getNumChunks());

            results = mapper.readValue(resultsAsString, new TypeReference<PatternRecognitionResults>(){});

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }

    @Override
    public int saveTaskResults(PatternRecognitionTask task, PatternRecognitionResults results) {

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


}
