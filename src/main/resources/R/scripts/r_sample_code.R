# import packages
library(ggplot2);
library(gplots);

analyze.file <- function(data_path, outputCSV, outputPNG, th_pvalue = 0.1, th_fc = 1.5) {

    # read data
    #file_name = paste(data_path, "MetaProt_Sample.csv", sep = "");
    file_name = data_path;
    raw_dta = read.csv(file_name, header = TRUE, row.names = 1);

    # remove missing values
    complete_idx = (colSums((raw_dta == "no peak") | (raw_dta == "<LOD") | (raw_dta == "< LOD") | is.na(raw_dta) | (raw_dta == 0) | raw_dta == 5e-05) == 0);
    dta = data.matrix(raw_dta[,complete_idx]);

    # get p values
    pvals = apply(dta, 2, function(x) {t.test(x[c(1:6)], x[c(7:12)], paired = TRUE, alternative = "two.sided")$p.value});

    # get fdr from p values
    fdrs = p.adjust(pvals, method = "fdr");

    # get fold changes = mean(diseased)/mean(control)
    fcs = colMeans(dta[c(7:12),])/colMeans(dta[c(1:6),]);

    # get significant metabolite index
    sigs = rep("insignificant", length(fdrs));
    sigs[(fdrs < th_pvalue) & (log2(fcs) >= log2(th_fc))] = "upregulated in HF";
    sigs[(fdrs < th_pvalue) & (log2(fcs) <= -log2(th_fc))] = "downregulated in HF";

    # return result
    results = cbind(colnames(dta), as.numeric(pvals), as.numeric(fdrs), as.numeric(fcs), sigs);

    # write csv file
    write.csv(results, outputCSV);

    # Volcano Plot
    theVolcano = ggplot(data=data.frame(results), aes(x=log2(fcs) , y=-log10(fdrs), color = sigs )) +
      geom_point(alpha=1, size=5) +
      xlim(c(-3.7, 3.7)) + ylim(c(0, 3)) +
      xlab("log2 (Heart Failure/Control)") + ylab("-log10 (p-value)") +

      geom_abline(intercept = -log10(th_pvalue), slope = 0, linetype = "longdash") +
      geom_vline(xintercept = c(-log2(th_fc), log2(th_fc)), linetype = "longdash") +

      scale_color_manual(values = c("darkgoldenrod3","gray77", "blue2"))+

      theme(axis.text=element_text(size=16, face="bold"),
            axis.title=element_text(size=14,face="bold"),
            legend.title=element_text(size=10,face="bold"),
            legend.text=element_text(size=10),
            legend.background=element_rect(colour = "black"));

    # Print
    #print(theVolcano);

    # PNG
    #png(paste(output,"Volcano_MouseModel.png", sep=""), width = 1000, height = 1000);
    png(outputPNG, width = 1000, height = 1000);
    plot(theVolcano);
    dev.off();
}

