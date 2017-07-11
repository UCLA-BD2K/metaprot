  analyze.time.series <- function(input, outputData, outputSig) {
  
  rm(list = ls(all = TRUE)); # remove all variables
  
  # # import pkgs
  library(tidyverse); library(stringr); library(ggplot2)
  # require(XLConnect); library(reshape); source("/Users/HowardChoi/Desktop/WorkSpace/wsRStudio/CustomizedFunctions.R");
  # library(TimeSeriesMetaboDataAnalyzer); library(vioplot); library(ape);# import pkg
  
  # data folder path and output path, respectively
  data_path = "/Users/davidmeng/Downloads/";
  
  # load data
  load(paste(data_path, "mouse_tidy.Rdata", sep = ""));
  
  # missing types?
  missing_type = c("< LOD", "no peak", "NA");
  
  # get a tibble with numerical metabolite concentration
  concentration_tbl = 
    quant_tbl %>% 
    select(-c(1:5)) %>% # change concentrations to numerical values
    sapply(parse_double, na = missing_type) %>%
    tbl_df() %>% 
    add_column(batch = factor(quant_tbl$batch, levels = unique(quant_tbl$batch)), # add meta columns back in factor's format
               timepoint = factor(quant_tbl$timepoint , levels = str_c(0:14)),
               tech_replicate = factor(quant_tbl$tech_replicate, levels = sort(unique(quant_tbl$tech_replicate))),
               strain = factor(quant_tbl$strain, levels = unique(quant_tbl$strain)),
               sample = factor(quant_tbl$sample, levels = unique(quant_tbl$sample))); 
  
  # how many metabolites have full concentration observation?
  # persentage of missing values, so no missing values -> 0%
  metabolite_x_percent_na = 
    concentration_tbl %>%
    filter(strain != "CEJ") %>%
    is.na() %>%
    colMeans() %>%
    #round(1) %>% #table() %>% barplot() # plot
    (function(x) {return((x*100) == 0)}) %>% # input percent here
    #sum()
    which() %>%
    names();
  # 216 - 5 = 211 metabolites have full concentration: wow
  # 362 - 5 = 357 metabolites have over 50%
  
  # what is appropriate cut off?
  # to be honest, don't know. So, let's start with metabolites that has full concentration
  concentration_full_tbl = 
    concentration_tbl %>% 
    filter(strain != "CEJ") %>% 
    select(metabolite_x_percent_na);
  
  # spread full by timepoints
  timepoint_full_tbl = 
    concentration_full_tbl %>%
    gather(key = metabo_key, value = concentration, Ala_p180:GABA_Neurotransmitter) %>%
    select(-sample) %>% 
    spread(timepoint, concentration);
  
  # perform paired t-test, multiple test correction, and log 2 fold change
  diff_expr_tbl = 
    timepoint_full_tbl %>% 
    group_by(metabo_key) %>% 
    summarise(# p value
      pvalue_1 = t.test(`0`, `1`, paired = T)$p.value,
      pvalue_3 = t.test(`0`, `3`, paired = T)$p.value,
      pvalue_5 = t.test(`0`, `5`, paired = T)$p.value,
      pvalue_7 = t.test(`0`, `7`, paired = T)$p.value,
      pvalue_14 = t.test(`0`, `14`, paired = T)$p.value,
      # fold change
      log2_fold_change_1 = log2(mean(`1`)/mean(`0`)),
      log2_fold_change_3 = log2(mean(`3`)/mean(`0`)),
      log2_fold_change_5 = log2(mean(`5`)/mean(`0`)),
      log2_fold_change_7 = log2(mean(`7`)/mean(`0`)),
      log2_fold_change_14 = log2(mean(`14`)/mean(`0`))) %>% 
    mutate(# multiple testing correction
      fdr_1 = p.adjust(pvalue_1, method = "fdr"),
      fdr_3 = p.adjust(pvalue_3, method = "fdr"),
      fdr_5 = p.adjust(pvalue_5, method = "fdr"),
      fdr_7 = p.adjust(pvalue_7, method = "fdr"),
      fdr_14 = p.adjust(pvalue_14, method = "fdr"));
  
  # significant metabolites
  fdr_th = 0.05; log2_fold_change_th = log2(1.5);
  diff_expr_significant_tbl = 
    diff_expr_tbl %>% 
    filter((fdr_1 < fdr_th) | (fdr_3 < fdr_th) | (fdr_5 < fdr_th) | (fdr_7 < fdr_th) | (fdr_14 < fdr_th)) %>% 
    #filter((fdr_1 < fdr_th) & (fdr_3 < fdr_th) & (fdr_5 < fdr_th) & (fdr_7 < fdr_th) & (fdr_14 < fdr_th)) %>% 
    mutate( is_sig_1 = (fdr_1 < fdr_th), is_sig_3 =  (fdr_3 < fdr_th), is_sig_5 =  (fdr_5 < fdr_th), is_sig_7 =  (fdr_7 < fdr_th), is_sig_14 =  (fdr_14 < fdr_th));
  
  
  #write out to CSV files
  write.csv(timepoint_full_tbl, outputData)
  write.csv(diff_expr_significant_tbl, outputSig)
  
  
  # 
  # # display time series pattern for significant metabolite in boxplot
  # idx = 1;
  # 
  # concentration_full_tbl %>% 
  #   select(batch:sample , concentration = diff_expr_significant_tbl$metabo_key[idx]) %>%
  #   left_join(concentration_full_tbl %>% 
  #               select(timepoint, strain, concentration = diff_expr_significant_tbl$metabo_key[idx]) %>% 
  #               group_by(timepoint, strain) %>% 
  #               summarise(mean_concentration = mean(concentration)),
  #             by = c("timepoint", "strain")) %>%
    # # visualization
    # ggplot(aes(x = timepoint, y = concentration)) + # 
    # # geom
    # geom_boxplot(outlier.shape = NA, colour = (diff_expr_significant_tbl %>%
    #                                              filter(metabo_key == metabo_key[idx]) %>%
    #                                              select(is_sig_1:is_sig_14) %>%
    #                                              str_replace("TRUE", "black") %>%
    #                                              str_replace("FALSE", "gray62") %>%
    #                                              append("gray62", after = 0))) +
    # geom_jitter(height = 0, width = 0.1, aes(colour = strain), alpha = 0.7) +
    # geom_line(aes(y = mean_concentration, group = strain, colour = strain), size = 0.8, alpha = 0.7) +
    # # geom_smooth(method = "loess", aes(y = mean_concentration, group = strain, colour = strain), se = F) +
    # ggtitle(str_c("*Metabolite: ", diff_expr_significant_tbl$metabo_key[idx] , collapse = "" )) +
    # xlab("Time Point (Day)") + 
    # ylab(paste("Concentration (", 
    #            metabolite_tbl$unit[metabolite_tbl$metabo_key == diff_expr_significant_tbl$metabo_key[idx]],
    #            ")")) +
    # scale_x_discrete(drop = F, labels = c("2" = "", "4" = "", "6" = "", "8" = "",
    #                                       "9" = "", "10" = "", "11" = "", "12" = "", "13" = "")) +
    # theme(# title
    #   plot.title = element_text(size = 15, face = "bold"),
    #   # axis
    #   axis.title = element_text(size = 12, face = "bold"),
    #   axis.text = element_text(size = 12),
    #   axis.ticks = element_blank(),
    #   # legend
    #   legend.text = element_text(size = 10),
    #   legend.title = element_text(size = 10));
  #idx = idx + 1;
  
}
