package org.bd2k.metaprot.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.bd2k.metaprot.model.*;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
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

    /**
     * Returns a list of stats that represent each row in the resultant data.csv file
     * from metabolite analysis.
     *
     * @param token the token of the task that produced the result files
     * @return list of MetaboliteStats
     */
    public List<MetaboliteStat> getMetaboliteAnalysisResults(String token) {

        File file = new File(String.format("%s%s%sdata.csv", root, token, sep));
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
     * Returns a list of stats that represent each row in the resultant
     * time_series_concentrations.csv file from the time series analysis.
     *
     * @param token the token of the task that produced the result files
     * @return list of PatternRecognitionValue
     */
    public List<PatternRecognitionValue> getPatternRecognitionConcentrations(String token) {

        File file = new File(String.format("%s%s%spattern_concentrations.csv", root, token, sep));
        List<PatternRecognitionValue> list = new ArrayList<>();

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

                    list.add(new PatternRecognitionValue(lineArr[4], lineArr[3],
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
     * @return list of PatternRecognitionSignificance
     */
    public List<PatternRecognitionSignificance> getPatternRecognitionSignificance(String token) {

        File file = new File(String.format("%s%s%spattern_significance.csv", root, token, sep));
        List<PatternRecognitionSignificance> list = new ArrayList<>();

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

                    list.add(new PatternRecognitionSignificance(lineArr[1],
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

    public ResultValidationResults getResultValidationResults(String token) {

        String pathToPlot = root + token + sep + "static3Dplot.png";
        String pathToData = root + token + sep + "dynamic3Ddata.csv";

        File plotFile = new File(pathToPlot);
        File dataFile = new File(pathToData);

        String base64EncodedStaticPlot = "";
        List<ResultValidationValue> list = new ArrayList<>();


        if (plotFile.exists() && dataFile.exists()) {
            FileReader fr = null;   // for parsing CSV file
            BufferedReader br = null;   // for parsing CSV file

            try {
                // encode data for static 3d plot image
                byte[] binaryData = IOUtils.toByteArray(new FileInputStream(plotFile));
                byte[] encodeBase64 = Base64.encodeBase64(binaryData);
                base64EncodedStaticPlot = new String(encodeBase64, "UTF-8");

                // parse CSV data
                fr = new FileReader(dataFile);
                br = new BufferedReader(fr);

                String line;
                String[] lineArr;

                br.readLine(); // skip header line

                while((line = br.readLine()) != null) {
                    line = line.replace("\"", "");
                    lineArr = line.split(",");

                    list.add(new ResultValidationValue(
                                Double.parseDouble(lineArr[1]),
                                Double.parseDouble(lineArr[2]),
                                Double.parseDouble(lineArr[3]),
                                lineArr[4]
                            )
                    );
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
        ResultValidationResults results = new ResultValidationResults(base64EncodedStaticPlot, list);
        return results;
    }

    /**
     * Given a task's token, delete the temporary directory and files used.
     * This is a relatively safe function, as it will only look for directories present
     * in root (e.g. /ssd2/metprot).
     *
     * UUIDs by definition are difficult to guess, so we can be relatively assured
     * that no user can delete another user's task information before it gets stored
     * to some data store.
     *
     * @param token
     */
    public void deleteTemporaryAnalysisFiles(String token) {

        File directoryToDelete = new File(root + token);

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
