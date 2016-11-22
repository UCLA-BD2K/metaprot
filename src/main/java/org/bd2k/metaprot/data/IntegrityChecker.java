package org.bd2k.metaprot.data;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 * Checks and corrects data input received from the user.
 * Created by Abineet on 11/4/2016.
 */
public class IntegrityChecker {

    String separator = ",";
    boolean separatorIsSet = false;

    int columnCount = -1;

    private class feedBackType{
        boolean result;
        String errorMessage;

        public feedBackType(boolean result, String errorMessage) {
            this.result = result;
            this.errorMessage = errorMessage;
        }
    }

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

    public feedBackType checkIntegrity(String inputFile){
        int lineCount = 0;
        int nonNumericInputs = 0;
        try(BufferedReader br = new BufferedReader(new FileReader(inputFile))) {
            for(String line; (line = br.readLine()) != null; ) {
                lineCount++;
                if(!separatorIsSet){
                    if(!setSeparator(line)){
                        System.out.println("Invalid file separators, line: " + lineCount);
                        return new feedBackType(false, "Invalid file separators");
                    }
                }
                String[] toks = line.split(separator);
                if(toks.length != columnCount){
                    String err = "Invalid column size, Line : " + lineCount;
                    System.out.println(err);
                    return new feedBackType(false, err);
                }

                if(lineCount > 5){
                    for(int i = 1; i < toks.length; i++){
                        toks[i] = toks[i].replaceAll("\\.", "");
                        if(!toks[i].matches("^[0-9]+$")){
                            nonNumericInputs++;
                        }
                    }
                }
            }
            System.out.println("");
            System.out.printf("Successfully parsed file");
            System.out.println("Total Lines: " + lineCount);
            System.out.println("Total non-numeric values: " + nonNumericInputs);
        }
        catch (IOException e){
            e.printStackTrace();
        }

        if(lineCount == 0){
            return new feedBackType(false, "Input file is empty");
        }
        return new feedBackType(true, "Success!");
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
