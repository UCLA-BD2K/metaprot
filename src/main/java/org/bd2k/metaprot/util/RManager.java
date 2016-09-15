package org.bd2k.metaprot.util;

import org.rosuda.REngine.REXP;
import org.rosuda.REngine.Rserve.RConnection;
import org.rosuda.REngine.Rserve.RserveException;

/**
 * Factory class for interacting with R via Rserve (client/server architecture).
 * Each RManager instance created by this factory is connected to one
 * running Rserve server, bound to a port returned by the task scheduler.
 *
 * Assumes Rserve to be running beforehand.
 *
 * Created by allengong on 8/31/16.
 */
public class RManager {

    private static final String HOST = "localhost";

    // { <port> : {"src/.../script1.R", "src/.../script2.R"} }
    //private static Map<Integer, Set<String>> scriptsReadInByPort = new HashMap<Integer, Set<String>>();

    // member variables
    private RConnection connection = null;
    private int port;

    // private cstr only for internal factory use
    private RManager(int portToUse) throws RserveException {
        port = portToUse;
        //initScriptMap(port);                            // ensure map contains reference to port
        connection = new RConnection(HOST, port);       // attempt to connect to localhost:(6311)
    }

    /**
     * Returns a RManager instance bound to the input port. Be sure that an instance
     * of Rserve is running on the specified port.
     *
     * @param port the port to use
     * @return a RManager instance
     * @throws RserveException if there was an issue with connecting to the Rserve process
     */
    public static RManager getInstance(int port) throws RserveException {
        return new RManager(port);
    }

    // internal initialization method to ensure that scriptsReadInByPort
    // contains a key-value pair for this port
//    private void initScriptMap(int port) {
//        if (!scriptsReadInByPort.containsKey(port)) {
//            scriptsReadInByPort.put(port, new HashSet<String>());
//        }
//    }

    /**
      * Run arbitrary R script with no input arguments. End effect is sourcing the
      * file. **The file must exist locally. As an optimization, scripts that
      * were already loaded will not be loaded again.
      *
      * @param sourceFilePath absolute path of the R file to execute (e.g. "/drive/script.R")
      */
    public void runRScript(String sourceFilePath) {
        //if (!scriptsReadInByPort.get(this.port).contains(sourceFilePath)) {
            runRCommand("source('" + sourceFilePath + "')");
        //    scriptsReadInByPort.get(this.port).add(sourceFilePath);
        //}
    }

    /**
     * Run arbitrary R statement(s). Make sure to sanitize input before
     * calling this function.
     *
     * @param statement the statement to run (e.g. "1+2")
     * @return an REXP instance with the result of the specified statement,
     * or null if an error occurred
     */
    public REXP runRCommand(String statement) {
        System.out.println("running R command: " + statement);
        REXP exp;
        try {
            exp = connection.eval(statement);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        return exp;
    }

    /**
     * Closes the connection to the Rserve instance.
     */
    public void closeConnection() {
        if (connection != null) {
            connection.close();
            connection = null;
        }
    }
}
