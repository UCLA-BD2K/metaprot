package org.bd2k.metaprot.dbaccess.repository;

import org.bd2k.metaprot.model.SessionData;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Nate Sookwongse on 6/26/17.
 */
@EnableScan
public interface SessionDataRepository extends CrudRepository<SessionData, String> {
    SessionData findByToken(String token);
}
