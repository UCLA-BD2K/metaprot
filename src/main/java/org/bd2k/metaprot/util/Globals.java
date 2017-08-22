package org.bd2k.metaprot.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Properties;

/**
 * This class contains definitions of global values that
 * can be assumed to be universally correct. Universally
 * here refers to: across operating systems, databases, etc.
 *
 * For the safety of the developer, there are no setter functions,
 * and all interaction is through static getter methods.
 *
 * Because this is a bean, make sure to add this as a dependency via
 * the DependsOn({}) Spring annotation. This will ensure that the global
 * values are instantiated before the requiring bean is.
 *
 * Created by allengong on 8/30/16.
 */
@Component("Globals")
public class Globals {

    private static String pathRoot;         // C:\ in windows, and / for everything else
    private static String pathSeparator;    // \ in windows, and / for everything else
    private static String rScriptLocation;
    private static Integer[] ports;
    private static int maxDynamoDBItemSize;

    private Globals() {}                    // no instantiation

    /**
     * After bean instantiation, call this function which sets up values based on
     * System properties.
     */
    @PostConstruct
    public void init() {
        String osName = System.getProperty("os.name").toLowerCase();

        // set values
        if (osName.contains("windows")) {
            pathRoot = "C:\\\\";
            pathSeparator = "\\\\";
        } else {
            pathRoot = "/";
            pathSeparator = "/";
        }

        pathRoot += "ssd2" + pathSeparator + "metprot" + pathSeparator;

        // load any resources that cannot be autowired (if the variables are static, etc.)
        Resource resource = new ClassPathResource("application.properties");

        try {
            Properties props = PropertiesLoaderUtils.loadProperties(resource);

            // load port numbers to use for scheduling R tasks
            String portsAsString = (String) props.get("task.scheduler.rserve.ports");
            String[] portsStringArr = portsAsString.split(",");
            ports = new Integer[portsStringArr.length];
            for(int i = 0; i < ports.length; i++) {
                ports[i] = Integer.parseInt(portsStringArr[i]);
            }

            // get the location of R scripts
            rScriptLocation = (String) props.get("app.r.script.location");


        } catch (Exception e) {
            e.printStackTrace();
        }

        // for AWS
        maxDynamoDBItemSize = 400000;       // 400KB
    }

    // getters

    public static String getPathRoot() {
        return pathRoot;
    }

    public static String getPathSeparator() {
        return pathSeparator;
    }

    public static String getrScriptLocation() { return rScriptLocation; }

    public static Integer[] getPorts(){ return ports; }

    public static int getMaxDynamoDBItemSize() { return maxDynamoDBItemSize; }

}
