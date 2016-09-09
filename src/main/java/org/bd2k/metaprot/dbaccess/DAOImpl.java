package org.bd2k.metaprot.dbaccess;

import org.bd2k.metaprot.dbaccess.repository.PatternRecogTaskRepository;
import org.bd2k.metaprot.dbaccess.repository.TaskRepository;
import org.bd2k.metaprot.model.PatternRecogTask;
import org.bd2k.metaprot.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Implementation of DAO interface.
 *
 * Created by allengong on 8/30/16.
 */
@Component
public class DAOImpl implements DAO {

    // repositories
    @Autowired
    TaskRepository taskRepository;

    @Autowired
    PatternRecogTaskRepository PRTaskRepository;

    public DAOImpl() {}


    /* Metabolite Analysis */

    public Task getTask(String token) {
        return taskRepository.findByToken(token);
    }

    public boolean saveTask(Task task) {

        if (getTask(task.getToken()) != null) {
            return false;   // someone is trying to save a task whos UUID already exists!
        }

        taskRepository.save(task);
        return true;
    }

    public void saveOrUpdateTask(Task task) {
        taskRepository.save(task);
    }


    /* Pattern Recognition */

    public PatternRecogTask getPatternRecogTask(String token){
        return PRTaskRepository.findByToken(token);
    }

    public boolean saveTask(PatternRecogTask task){

        if(getPatternRecogTask(task.getToken()) != null){
            return false;
        }

        PRTaskRepository.save(task);
        return true;
    }

    public void saveOrUpdateTask(PatternRecogTask task) {
        PRTaskRepository.save(task);
    }

}
