package org.bd2k.metaprot.util;

import org.bd2k.metaprot.model.MetaboliteStat;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Provides access to filesystem files.
 *
 * Created by allengong on 8/15/16.
 */
public class FileAccess {

    /* default location for the analysis csv results is /ssd2/metaprot/{token}/data.csv */
    private final String LOCAL_DOWNLOAD_LOC = "/ssd2/metaprot";

    /**
     * Returns a list of stats that represent each row in the resultant data.csv file
     * from metabolite analysis.
     *
     * @param token the token of the task that produced the result files
     * @return list of MetaboliteStats
     */
    public List<MetaboliteStat> getMetaboliteAnalysisResults(String token) {

        File file = new File(String.format("%s/%s/data.csv", LOCAL_DOWNLOAD_LOC, token));
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
                    if (lineArr.length != 5 || lineArr[0].equals("")) {
                        continue;   // something is wrong with this row, or it is the first row
                    }

                    MetaboliteStat stat = new MetaboliteStat(Double.parseDouble(lineArr[1]),
                            Double.parseDouble(lineArr[2]), Double.parseDouble(lineArr[3]), lineArr[4]);

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
}
