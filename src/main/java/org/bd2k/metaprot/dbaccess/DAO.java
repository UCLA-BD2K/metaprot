package org.bd2k.metaprot.dbaccess;

import org.bd2k.metaprot.model.*;

import java.util.List;

/**
 * Data Access Object. All controllers, etc., should interact with
 * an autowired instance of this interface (see DAOImpl.java)
 * when accessing database resources.
 *
 * DO NOT directly use any of the defined repository classes.
 *
 *
 * Created by allengong on 8/30/16.
 */
public interface DAO {


    /* General */

    /**
     * Saves the results of the metaboliteTask to the database. Internally,
     * chunking is used so this method returns the number of chunks
     * required to store the results.
     *
     * @param task the Task, with (at the very least) token defined
     * @param results the results of the Task
     * @return number of chunks used to store the results, or -1 if error; use as needed
     */
    int saveTaskResults(Task task, Object results);

    /**
     * Retrieves a task given the associated token.
     *
     * @param token the uuid
     * @return an initialized Task, or null if the token is invalid
     */
    Task getTask(String token);

    /**
     * Saves the given task to the database as a new entry.
     *
     * @param task the task to save
     * @return true if the task was added to the database, false otherwise
     */
    boolean saveTask(Task task);

    /**
     * Saves the given task to the database if it does not exist, or updates it.
     *
     * @param task the task to save
     */
    void saveOrUpdateTask(Task task);


    /* Metabolite Analysis */

    /**
     * Given a UUID token, return the associated task.
     *
     * @param token the UUID token
     * @return an initialized MetaboliteTask instance, or null if UUID is invalid (DNE in database)
     */
    MetaboliteTask getMetaboliteTask(String token);

    /**
     * Saves the given metaboliteTask to the database as a new entry.
     *
     * @param metaboliteTask the metaboliteTask to save
     * @return true if the metaboliteTask was added to the database, false otherwise
     */
    boolean saveTask(MetaboliteTask metaboliteTask);

    /**
     * Saves the given metaboliteTask to the database if it does not exist, or updates it.
     *
     * @param metaboliteTask the metaboliteTask to save
     */
    void saveOrUpdateTask(MetaboliteTask metaboliteTask);

    /**
     * Retrieves the results of the metaboliteTask, with return type matching that of
     * saveTaskResults() for this metaboliteTask type.
     *
     * @param metaboliteTask the metaboliteTask that the results are for
     * @return the results in the same form as they were inputted in saveTaskResults()
     */
    List<List<MetaboliteStat>> getMetaboliteTaskResults(MetaboliteTask metaboliteTask);


    /* Pattern Recognition */

    /**
     * Retrieves the results of the task, with return type matching that of
     * saveTaskResults() for this task type.
     *
     * @param task the task that the results are for
     * @return results in the same form that they were inputted in saveTaskResults()
     */
    PatternRecognitionResults getPatternRecognitionResults(Task task);


    /* Result Validation */

    /**
     * Retrieves the results of the task, with return type matching that of
     * saveTaskResults() for this task type.
     *
     * @param task the task that the results are for
     * @return results in the same form that they were inputted in saveTaskResults()
     */
    ResultValidationResults getResultValidationResults(Task task);


    /* Integration Tool */

    /**
     * Retrieves the results of the task, with return type matching that of
     * saveTaskResults() for this task type.
     *
     * @param task the task that the results are for
     * @return results in the same form that they were inputted in saveTaskResults()
     */
     IntegrationToolResults getIntegrationToolResults(Task task);

    /* DTW Cluster - Elbow Plot */

    /**
     * Retrieves the results of the task, with return type matching that of
     * saveTaskResults() for this task type.
     *
     * @param task the task that the results are for
     * @return results in the same form that they were inputted in saveTaskResults()
     */
    String getElbowPlotResults(Task task);

    DTWClusterResults getDTWClusterResults(Task task);



}
