package org.bd2k.metaprot.dbaccess.converter;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.sun.tools.classfile.TypeAnnotation;
import com.sun.tools.javac.code.TargetType;

/**
 * Interface with inner static classes to be used for DynamoDB marshalling.
 *
 * Created by allengong on 10/6/16.
 */
public interface Converters {


    /**
     * Converts an array of doubles to some String representation and back.
     */
    public static class DoubleArrayConverter implements DynamoDBTypeConverter<String, double[]> {

        @Override
        public String convert(double[] doubles) {
            String result = "";

            for (double val : doubles) {
                result += (val + "," );
            }

            return result.substring(0, result.length()-1);  // removes trailing comma
        }

        @Override
        public double[] unconvert(String s) {

            String[] arr = s.split(",");
            double[] result = new double[arr.length];

            for (int i = 0; i < result.length; i++) {
                result[i] = Double.parseDouble(arr[i]);
            }

            return result;
        }
    }
}
