package org.bd2k.metaprot.dbaccess;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bd2k.metaprot.aws.DynamoDBClient;
import org.bd2k.metaprot.dbaccess.repository.MetaboliteTaskRepository;
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
    private MetaboliteTaskRepository metaboliteTaskRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private DynamoDBClient dynamoDBClient;

    private final String TASK_CHUNK_TABLENAME = "Metaprot-Task-Chunk";

    private ObjectMapper mapper = new ObjectMapper();

    public DAOImpl() {}


    /* General */

    @Override
    public int saveTaskResults(Task task, Object results) {

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


    @Override
    public Task getTask(String token) {
        return taskRepository.findByToken(token);
    }

    @Override
    public boolean saveTask(Task task) {
        if (getTask(task.getToken()) != null) {
            return false;
        }
        taskRepository.save(task);
        return true;
    }

    @Override
    public void saveOrUpdateTask(Task task) {
        taskRepository.save(task);
    }


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


    /* Pattern Recognition */


    @Override
    public PatternRecognitionResults getPatternRecognitionResults(Task task) {
        if (!task.getType().equals(Task.PATTERN) || task.getToken() == null) {
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


    /* Result Validation */

    @Override
    public ResultValidationResults getResultValidationResults(Task task) {
        if (!task.getType().equals(Task.RESULT_VALIDATION) || task.getToken() == null) {
            return null;
        }

        ResultValidationResults results = null;

        try {
            String dbEntry = dynamoDBClient.getChunksAsWhole(TASK_CHUNK_TABLENAME, task.getToken(),
                    task.getNumChunks());
            results = mapper.readValue(dbEntry, new TypeReference<ResultValidationResults>(){});

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }


    /* Integration Tool */

    @Override
    public IntegrationToolResults getIntegrationToolResults(Task task) {
        if (!task.getType().equals(Task.INTEGRATION_TOOL) || task.getToken() == null) {
            return null;
        }

        IntegrationToolResults results = null;

        try {
            String dbEntry = dynamoDBClient.getChunksAsWhole(TASK_CHUNK_TABLENAME, task.getToken(),
                    task.getNumChunks());
            results = mapper.readValue(dbEntry, new TypeReference<IntegrationToolResults>(){});

        } catch (Exception e) {
            e.printStackTrace();
        }

        return results;
    }
}
