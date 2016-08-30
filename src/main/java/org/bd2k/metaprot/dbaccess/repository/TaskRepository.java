package org.bd2k.metaprot.dbaccess.repository;

import org.bd2k.metaprot.model.Task;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Poorly named repository for accessing collections and
 * documents related to metabolite + protein analysis.
 *
 * Note the use of Mongo Query methods -
 * see: http://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/reference/html/repositories.html
 *
 * No implementation of this interface is necessary since Spring-mongo will automatically
 * construct the simple queries, as noted above.
 *
 * Created by allengong on 8/30/16.
 */
@Repository
public interface TaskRepository extends CrudRepository<Task, String> {

    /**
     * Given a token (UUID), return the information related
     * to the archived task.
     *
     * @param token The UUID referencing the particular task
     * @return an intitialized Task instance, or null if UUID is invalid
     */
    Task findByToken(String token);
}
