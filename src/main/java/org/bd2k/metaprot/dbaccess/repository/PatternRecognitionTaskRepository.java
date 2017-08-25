package org.bd2k.metaprot.dbaccess.repository;

import org.bd2k.metaprot.model.PatternRecognitionTask;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Abineet on 9/1/2016.
 */
@EnableScan
public interface PatternRecognitionTaskRepository extends CrudRepository<PatternRecognitionTask, String> {

    PatternRecognitionTask findByToken(String token);
}
