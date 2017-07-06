package org.bd2k.metaprot.dbaccess;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bd2k.metaprot.aws.DynamoDBClient;
import org.bd2k.metaprot.dbaccess.repository.PatternRecogTaskRepository;
import org.bd2k.metaprot.dbaccess.repository.SessionDataRepository;
import org.bd2k.metaprot.dbaccess.repository.TaskRepository;
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
    private TaskRepository taskRepository;

    @Autowired
    private PatternRecogTaskRepository PRTaskRepository;

    @Autowired
    private SessionDataRepository sessionDataRepository;

    @Autowired
    private DynamoDBClient dynamoDBClient;

    private final String TASK_TABLENAME = "Metaprot-Task";
    private final String TASK_CHUNK_TABLENAME = "Metaprot-Task-Chunk";

    private ObjectMapper mapper = new ObjectMapper();

    public DAOImpl() {}


    /* Metabolite Analysis */

    @Override
    public Task getTask(String token) {
        return taskRepository.findByToken(token);
    }

    @Override
    public boolean saveTask(Task task) {

        if (getTask(task.getToken()) != null) {
            return false;   // someone is trying to save a task whos UUID already exists!
        }

        taskRepository.save(task);
        return true;
    }

    @Override
    public void saveOrUpdateTask(Task task) {
        taskRepository.save(task);
    }

    @Override
    public List<List<MetaboliteStat>> getTaskResults(Task task) {

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
    public int saveTaskResults(Task task, List<List<MetaboliteStat>> results) {

        // quick validation
        if (task.getToken() == null) {
            return -1;
        }

        int numChunks;
        try {
            numChunks = dynamoDBClient.uploadAsChunks(TASK_CHUNK_TABLENAME,
                    task.getToken(), mapper.writeValueAsString(results));
        } catch (Exception e) {
            e.printStackTrace();
            return -1;              // return -1, let caller handle error
        }

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
    public int saveTaskResults(PatternRecogTask task, List<List<PatternRecogStat>> results) {

        // quick validation
        if (task.getToken() == null) {
            return -1;
        }

        int numChunks;
        try {
            numChunks = dynamoDBClient.uploadAsChunks(TASK_CHUNK_TABLENAME,
                    task.getToken(), mapper.writeValueAsString(results));
        } catch (Exception e) {
            e.printStackTrace();
            return -1;              // return -1, let caller handle error
        }

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
