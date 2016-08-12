package org.bd2k.metaprot.util;

import org.rosuda.JRI.REXP;
import org.rosuda.JRI.Rengine;

import java.io.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Class for interacting with JRI/R. All logic
 * pertaining to R should go here. Exposes a singleton
 * instance since only one R Engine (interpreter) should
 * be active at any time.
 *
 * An R Engine is essentially the environment in which R commands will run.
 * Take care in evaluating global declarations as it can pollute the namespace.
 * Thus, the "environment" can be refreshed by calling the startUp() method
 * again.
 *
 * Created by allengong on 8/11/16.
 */
public class RManager {

    private static RManager manager = new RManager();   // singleton
    private static Rengine re;
    private static Set<String> scriptsReadIn;           // scripts already read in, avoid reading in again

    private RManager() {
        scriptsReadIn = new HashSet<String>();
    }

    public static RManager getInstance() throws Exception {
        if (re == null) {
            startUp();
        }

        return manager;
    }

    /**
     * Gracefully shuts down R Engine.
     */
    public static void shutDown() {
        if (re != null) {
            re.end();
        }
    }

    /**
     * Starts R Engine and waits for intiialization to complete.
     * Can also be used to "refresh" the R Engine.
     */
    public static void startUp() throws Exception {

        if (re != null) {
            shutDown();
        }

        re = new Rengine(new String[] {"--no-save"}, false, null);

        if (!re.waitForR()) {
            throw new Exception("Error loading R!");
        }
    }

    /**
     * Returns string representation of the specified R file.
     * For performance concerns, try to call this function once
     * per file and keep popular scripts in memory. needs testing...
     *
     * @param pathToRScript location of R script
     * @return R script as a string, ready to be passed to runRCommand()
     */
    public String getRScriptAsString(String pathToRScript) {
        StringWriter sw = new StringWriter();
        InputStreamReader reader = null;
        FileInputStream fis = null;
        BufferedReader br = null;

        try {

            File file = new File(pathToRScript);

            fis = new FileInputStream(file);
            reader = new InputStreamReader(fis);
            br = new BufferedReader(reader);

            String line;
            while ((line = br.readLine()) != null) {
                sw.write(line + "\n");  // preserves new line that is stripped by readLine()
            }

            sw.close();

        } catch (Exception e) {
            System.err.println("Exception in reading input R file in getRScriptAsString()!");
            e.printStackTrace();
        } finally {
            try {
                sw.close();

                if (br != null) {
                    br.close();
                }

                if (reader != null) {
                    reader.close();
                }

                if (fis != null) {
                    fis.close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return sw.toString();
    }

    /**
     * Run arbitrary R script with no input arguments. End effect is sourcing the
     * file. **The file must exist locally. As an optimization, scripts that
     * were already loaded will not be loaded again.
     *
     * @param sourceFilePath path of the R file to execute
     */
    public void runRScript(String sourceFilePath) {
        if (!scriptsReadIn.contains(sourceFilePath)) {
            runRCommand("source('" + sourceFilePath + "')");
            scriptsReadIn.add(sourceFilePath);
        }
    }

    /**
     * Run arbitrary R statement(s). Make sure to sanitize input before
     * calling this function.
     *
     * @param statement the statement to run (e.g. "1+2")
     * @return an REXP instance with the result of the specified statement
     */
    public REXP runRCommand(String statement) {
        REXP exp = re.eval(statement);
        return exp;
    }
}
