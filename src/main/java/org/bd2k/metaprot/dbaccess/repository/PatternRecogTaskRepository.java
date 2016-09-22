package org.bd2k.metaprot.dbaccess.repository;

import org.bd2k.metaprot.model.PatternRecogStat;
import org.bd2k.metaprot.model.PatternRecogTask;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Abineet on 9/1/2016.
 */
@EnableScan
public interface PatternRecogTaskRepository extends CrudRepository<PatternRecogTask, String> {

    PatternRecogTask findByToken(String token);
}
