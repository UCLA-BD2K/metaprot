package org.bd2k.metaprot.dbaccess.repository;

import org.bd2k.metaprot.model.Task;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Nate Sookwongse on 8/29/17.
 */
@EnableScan
public interface TaskRepository extends CrudRepository<Task, String> {

    Task findByToken(String token);
}
