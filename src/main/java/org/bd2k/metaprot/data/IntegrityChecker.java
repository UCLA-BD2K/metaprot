package org.bd2k.metaprot.data;

import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 * Checks and corrects data input received from the user.
 * Created by Abineet on 11/4/2016.
 */
public class IntegrityChecker {

    private static final Logger log = Logger.getLogger(IntegrityChecker.class);

    private String separator = ",";
    private boolean separatorIsSet = false;

    private int columnCount = -1;

    private boolean setSeparator(String line){
        String[] toks = line.split(",");
        if(toks.length > 1){
            separatorIsSet = true;
            separator = ",";
            columnCount = toks.length;
        }
        else{
            toks = line.split("\t");
            if(toks.length > 1){
                separatorIsSet = true;
                separator= "\t";
                columnCount = toks.length;
            }
            else{
                return false;
            }
        }
        return true;
    }

    public FeedBackType checkIntegrity(String inputFile){
        int lineCount = 0;
        int nonNumericInputs = 0;
        int totalInputs = 0;
        try(BufferedReader br = new BufferedReader(new FileReader(inputFile))) {
            for(String line; (line = br.readLine()) != null; ) {
                lineCount++;
                if(!separatorIsSet){
                    if(!setSeparator(line)){
                        log.info("Invalid file separators, line: " + lineCount);
                        return new FeedBackType(false, "Invalid file separators");
                    }
                }
                String[] toks = line.split(separator);
                if(toks.length != columnCount){
                    String err = "Invalid column size, Line : " + lineCount;
                    log.info(err);
                    return new FeedBackType(false, err);
                }

                if(lineCount > 5){
                    for(int i = 1; i < toks.length; i++){
                        toks[i] = toks[i].replaceAll("\\.", "");
                        if(!toks[i].matches("^[0-9]+$")){
                            nonNumericInputs++;
                        }
                        totalInputs++;
                    }
                }
            }

            log.info("Successfully parsed file");
            log.info("Total Lines: " + lineCount);
            log.info("Total non-numeric values: " + nonNumericInputs);
        }
        catch (IOException e){
            e.printStackTrace();
        }

        if(lineCount == 0){
            return new FeedBackType(false, "Input file is empty");
        }

        // only way to return success
        return new FeedBackType(true, "Success!", totalInputs, nonNumericInputs);
    }

    /**
     * Testing purposes only
     * @return
     */
    public static void main(){
        IntegrityChecker i = new IntegrityChecker();
        i.checkIntegrity("C:\\Users\\Abineet\\Downloads\\metaprot_input.csv");
    }
}
