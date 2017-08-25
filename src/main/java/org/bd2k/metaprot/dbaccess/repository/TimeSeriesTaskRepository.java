package org.bd2k.metaprot.dbaccess.repository;

import org.bd2k.metaprot.model.PatternRecognitionTask;
import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Nate Sookwongse on 7/10/2017.
 */
@EnableScan
public interface TimeSeriesTaskRepository extends CrudRepository<PatternRecognitionTask, String> {

    PatternRecognitionTask findByToken(String token);
}
