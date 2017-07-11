package org.bd2k.metaprot.util;

import org.bd2k.metaprot.model.MetaboliteStat;
import org.bd2k.metaprot.model.PatternRecogStat;
import org.bd2k.metaprot.model.TimeSeriesSignificance;
import org.bd2k.metaprot.model.TimeSeriesValue;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Provides access to filesystem files.
 *
 * Created by allengong on 8/15/16.
 */
public class FileAccess {

    /* default location for the analysis csv results is /ssd2/metaprot/{token}/data.csv */

    private String root = Globals.getPathRoot();
    private String sep = Globals.getPathSeparator();

    // "/ssd2/metaprot"
    private final String LOCAL_FILE_DOWNLOAD_PATH = root + "ssd2" + sep + "metaprot";

    /**
     * Returns a list of stats that represent each row in the resultant data.csv file
     * from metabolite analysis.
     *
     * @param token the token of the task that produced the result files
     * @return list of MetaboliteStats
     */
    public List<MetaboliteStat> getMetaboliteAnalysisResults(String token) {

        File file = new File(String.format("%s%s%s%sdata.csv", LOCAL_FILE_DOWNLOAD_PATH, sep, token, sep));
        List<MetaboliteStat> list = new ArrayList<>();

        if (file.exists()) {
            FileReader fr = null;
            BufferedReader br = null;

            try {
                fr = new FileReader(file);
                br = new BufferedReader(fr);

                String line;
                String[] lineArr;
                while((line = br.readLine()) != null) {
                    line = line.replace("\"", "");
                    lineArr = line.split(",");
                    if (lineArr.length != 6 || lineArr[0].equals("")) {
                        continue;   // something is wrong with this row, or it is the first row
                    }

                    MetaboliteStat stat = new MetaboliteStat(Integer.parseInt(lineArr[0]),
                            lineArr[1],
                            Double.parseDouble(lineArr[2]),
                            Double.parseDouble(lineArr[3]),
                            Double.parseDouble(lineArr[4]),
                            lineArr[5]);

                    list.add(stat);
                }

            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    if (fr != null) {
                        fr.close();
                    }

                    if (br != null) {
                        br.close();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }

        return list;
    }

    /**
     *
     * @param token
     * @return
     */
    public List<List<PatternRecogStat>> getPatternRecogResults(String token){

        File file = new File(String.format("%s%s%s%sclustered_result.csv", LOCAL_FILE_DOWNLOAD_PATH, sep, token, sep));

        List<List<PatternRecogStat>> list = new ArrayList<List<PatternRecogStat>>();

        ArrayList<Integer> timePoints = new ArrayList<>();

        if(file.exists()) {
            FileReader fr = null;
            BufferedReader br = null;

            try {
                fr = new FileReader(file);
                br = new BufferedReader(fr);

                String line = br.readLine();
                line = line.replaceAll("\"", "");
                String[] tokens = line.split(",");

                for (int i = 1; i < tokens.length; i++) {
                    timePoints.add(Integer.parseInt(tokens[i]));
                }

                ArrayList<PatternRecogStat> cluster = new ArrayList<>();
                while ((line = br.readLine()) != null) {
                    line = line.replaceAll("\"", "");
                    tokens = line.split(",");
                    if (tokens[tokens.length - 1].equals("NA")) {
                        list.add(cluster);
                        cluster = new ArrayList<>();
                        continue;
                    }
                    PatternRecogStat temp = new PatternRecogStat(tokens[0]);
                    ArrayList<Double> abundanceRatios = new ArrayList<>();

                    for (int i = 1; i < tokens.length; i++) {
                        abundanceRatios.add(Double.parseDouble(tokens[i]));
                    }

                    temp.setData(timePoints, abundanceRatios);
                    cluster.add(temp);
                }

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    /**
     * Returns a list of stats that represent each row in the resultant
     * time_series_concentrations.csv file from the time series analysis.
     *
     * @param token the token of the task that produced the result files
     * @return list of TimeSeriesStats
     */
    public List<TimeSeriesValue> getTimeSeriesConcentrations(String token) {

        File file = new File(String.format("%s%s%s%stime_series_concentrations.csv", LOCAL_FILE_DOWNLOAD_PATH, sep, token, sep));
        List<TimeSeriesValue> list = new ArrayList<>();

        if (file.exists()) {
            FileReader fr = null;
            BufferedReader br = null;

            try {
                fr = new FileReader(file);
                br = new BufferedReader(fr);

                String line;
                String[] lineArr;
                while((line = br.readLine()) != null) {
                    line = line.replace("\"", "");
                    lineArr = line.split(",");

                    list.add(new TimeSeriesValue(lineArr[4], lineArr[3],
                            new ArrayList(Arrays.asList(Arrays.copyOfRange(lineArr, 5, lineArr.length)))));
                }

            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    if (fr != null) {
                        fr.close();
                    }

                    if (br != null) {
                        br.close();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }


        return list;
    }

    /**
     * Returns a list of stats that represent each row in the resultant
     * time_series_concentrations.csv file from the time series analysis.
     *
     * @param token the token of the task that produced the result files
     * @return list of TimeSeriesSignificances
     */
    public List<TimeSeriesSignificance> getTimeSeriesSignificances(String token) {

        File file = new File(String.format("%s%s%s%stime_series_significance.csv", LOCAL_FILE_DOWNLOAD_PATH, sep, token, sep));
        List<TimeSeriesSignificance> list = new ArrayList<>();

        if (file.exists()) {
            FileReader fr = null;
            BufferedReader br = null;

            try {
                fr = new FileReader(file);
                br = new BufferedReader(fr);

                String line;
                String[] lineArr;
                int startIndex = 0;

                // read in first line to look for significance columns
                if ((line = br.readLine()) != null) {
                    line = line.replace("\"", "");
                    lineArr = line.split(",");
                    for (int i = 0; i < lineArr.length; i++) {
                        // first sig column found
                        if (lineArr[i].startsWith("is_sig")) {
                            startIndex = i;
                            break;
                        }
                    }
                }
                // parse remaining file
                while((line = br.readLine()) != null) {
                    line = line.replace("\"", "");
                    lineArr = line.split(",");

                    list.add(new TimeSeriesSignificance(lineArr[1],
                            new ArrayList(Arrays.asList(Arrays.copyOfRange(lineArr, startIndex, lineArr.length)))));
                }

            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    if (fr != null) {
                        fr.close();
                    }

                    if (br != null) {
                        br.close();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }


        return list;
    }

    /**
     * Given a task's token, delete the temporary directory and files used.
     * This is a relatively safe function, as it will only look for directories present
     * in LOCAL_DOWNLOAD_PATH (e.g. /ssd2/metaprot).
     *
     * UUIDs by definition are difficult to guess, so we can be relatively assured
     * that no user can delete another user's task information before it gets stored
     * to some data store.
     *
     * @param token
     */
    public void deleteTemporaryAnalysisFiles(String token) {

        File directoryToDelete = new File(LOCAL_FILE_DOWNLOAD_PATH + sep + token);

        // if the dir is invalid, skip
        if (!directoryToDelete.exists()) {
            return;
        }

        // iteratively delete all files -- this assumes that no sub directories exist
        for (File file : directoryToDelete.listFiles()) {
            file.delete();
        }
        directoryToDelete.delete();
    }
}
