package org.bd2k.metaprot.dbaccess;

import org.bd2k.metaprot.model.PatternRecogTask;
import org.bd2k.metaprot.model.Task;

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

    /**
     * Given a UUID token, return the associated task.
     *
     * @param token the UUID token
     * @return an initialized Task instance, or null if UUID is invalid (DNE in database)
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

    /**
     * Retrieves a pattern recognition task given the associated token.
     *
     * @param token the uuid
     * @return an initialized PatternRecogTask, or null if the token is invalid
     */
    PatternRecogTask getPatternRecogTask(String token);


    /**
     * Saces the given task to the database as a new entry.
     *
     * @param task the task to save
     * @return true if the task was added to the database, false otherwise
     */
    boolean saveTask(PatternRecogTask task);

    /**
     * Saves the given task to the database if it does not exist, or updates it.
     *
     * @param task the task to save
     */
    void saveOrUpdateTask(PatternRecogTask task);

}
