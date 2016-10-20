package org.bd2k.metaprot.dbaccess.converter;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    class DoubleArrayConverter implements DynamoDBTypeConverter<String, double[]> {

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

    class DoubleArrayArrayConverter implements DynamoDBTypeConverter<String, double[][]> {

        @Override
        public String convert(double[][] doubles) {
            ObjectMapper mapper = new ObjectMapper();
            String result = null;

            try {
                result = mapper.writeValueAsString(doubles);
            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("issue with mapping array of arrays of doubles...");
            }

            return result;
        }

        @Override
        public double[][] unconvert(String s) {
            ObjectMapper mapper = new ObjectMapper();
            double[][] result = null;

            try {
                result = mapper.readValue(s, double[][].class);
            } catch(Exception e) {
                e.printStackTrace();
                System.err.println("issue with unmapping array of arrays of doubles string");
            }

            return result;
        }
    }

    /**
     * Future note: if we need to marshall a collection of OBJECTS, you can add a constructor:
     *
     *  public Converter(final Class<Currency> targetType) {
            this.separator = annotation.separator();
        }
     * to get the object type (targetType.getClass.getComponentType()) and go from there.
     *
     * See: http://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/services/dynamodbv2/datamodeling/DynamoDBTypeConverted.html
     */
}
