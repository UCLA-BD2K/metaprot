package org.bd2k.metaprot.util;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

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

    private static Integer[] ports = {9001, 9002, 9003};

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
    }

    // getters

    public static String getPathRoot() {
        return pathRoot;
    }

    public static String getPathSeparator() {
        return pathSeparator;
    }

    public static Integer[] getPorts(){ return ports; }

}
