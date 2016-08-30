package org.bd2k.metaprot.dbaccess;

import org.bd2k.metaprot.dbaccess.repository.TaskRepository;
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

    public DAOImpl() {}

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

}
