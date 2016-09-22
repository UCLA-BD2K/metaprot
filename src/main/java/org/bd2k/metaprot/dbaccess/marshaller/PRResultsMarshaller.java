package org.bd2k.metaprot.dbaccess.marshaller;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMarshaller;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bd2k.metaprot.model.MetaboliteStat;
import org.bd2k.metaprot.model.PatternRecogStat;

import java.io.IOException;
import java.util.List;

/**
 * Marshaller for Pattern Recognition Stat. @see org.bd2k.metaprot.dbaccess.marshaller.MAResultsMarshaller
 * for more details.
 *
 * Created by allengong on 9/22/16.
 */
public class PRResultsMarshaller implements DynamoDBMarshaller<List<List<PatternRecogStat>>> {

    @Override
    public String marshall(List<List<PatternRecogStat>> results) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonStr = null;

        try {
            jsonStr = mapper.writeValueAsString(results);
        } catch (IOException e) {
            System.err.println("Error in mapping PR result object to JSON string.");
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error in marshalling PR result object.");
            e.printStackTrace();
        }

        return jsonStr;
    }

    @Override
    public List<List<PatternRecogStat>> unmarshall(Class<List<List<PatternRecogStat>>> aClass, String s) {
        ObjectMapper mapper = new ObjectMapper();
        List<List<PatternRecogStat>> list = null;

        try {
            list = mapper.readValue(s, new TypeReference<List<List<PatternRecogStat>>>(){});
        } catch (IOException e) {
            System.err.println("Error in reading PR result string back to object.");
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error in unmarshalling PR result object");
            e.printStackTrace();
        }

        return list;
    }
}
