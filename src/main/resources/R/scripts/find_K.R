library(tidyverse)
library(stringr)
library(ggplot2)
library(dtw)
library(dtwclust)

#data_path = "C:/Users/Pengqi/Desktop/BD2K/dtw/mouse_tidy.rdata";
#output_path = "C:/Users/Pengqi/Desktop/BD2K/dtw/elbow_plot.jpg";

elbow_plot <- function(data_path, lower, upper, output_path){
  load(data_path)
  missing_type = c("< LOD", "no peak", "NA");
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
  data = 
    concentration_full_tbl %>%
    gather(key = metabo_key, value = concentration, Ala_p180:GABA_Neurotransmitter) %>%
    select(-sample) %>% 
    spread(timepoint, concentration);
  
  column_indices <- c()
  for (i in dim(data)[2]:1){
    if (sapply(data[,i], is.numeric)){
      column_indices <- c(i, column_indices)
    } else {
      break
    }
  }
  
  replicates <- length(unique(data$tech_replicate))
  numeric_columns <- column_indices
  df <- data %>% arrange(tech_replicate) %>% arrange(metabo_key) %>% group_by(tech_replicate)
  predicted <- data.frame("metabo_key" = character(0), stringsAsFactors = FALSE)
  for (i in 1:length(numeric_columns)){
    predicted[,i+1] <- double(0)
  }
  for (i in 1:((dim(df)[1])/replicates)){
    y_values <- c()
    for (j in 1:replicates){
      y_values <- c(y_values, c(unlist(df[replicates*(i-1)+j,numeric_columns], use.names = FALSE)))
    }
    fit <- lm(y_values ~ splines::bs(rep(1:length(numeric_columns), replicates, degree = 3)))
    predicted[i,] <- c(unlist(df[replicates*i,"metabo_key"], use.names = FALSE), predict(fit)[c(1:length(numeric_columns))])
  }
  cluster_format <- function(row){
    Name <- row[1]
    value <- unlist(c(row[c(2:length(row))]))
  }
  data <- predicted
  a <- by(as_tibble(data), 1:nrow(data), cluster_format)
  names(a) <- data$metabo_key
  num_clusters <- c()
  sse <- c()
  for (i in lower:upper){
    pc <- tsclust(a, type = "partitional", k = i, 
                  distance = "sbd", centroid = "pam", 
                  seed = 3247L, trace = TRUE,
                  args = tsclust_args(dist = list(window.size = 20L)))
    num_clusters <- c(num_clusters, i)
    sse <- c(sse, sum(pc@cldist ^ 2))
  }
  sse_per_cluster <- data.frame(num_clusters, sse)
  ggplot(sse_per_cluster, aes(x=num_clusters, y=sse)) +
    geom_point() +
    geom_text(label=sse_per_cluster$num_clusters, vjust=-1)
  ggsave(output_path)
}

partitional_cluster <- function(data_path, k, output_path_plot, output_path_clusters){
  load(data_path)
  missing_type = c("< LOD", "no peak", "NA");
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
  data =
  concentration_full_tbl %>%
    gather(key = metabo_key, value = concentration, Ala_p180:GABA_Neurotransmitter) %>%
    select(-sample) %>%
    spread(timepoint, concentration);

  column_indices <- c()
  for (i in dim(data)[2]:1){
    if (sapply(data[,i], is.numeric)){
      column_indices <- c(i, column_indices)
    } else {
      break
    }
  }

  replicates <- length(unique(data$tech_replicate))
  numeric_columns <- column_indices
  df <- data %>% arrange(tech_replicate) %>% arrange(metabo_key) %>% group_by(tech_replicate)
  predicted <- data.frame("metabo_key" = character(0), stringsAsFactors = FALSE)
  for (i in 1:length(numeric_columns)){
    predicted[,i+1] <- double(0)
  }
  for (i in 1:((dim(df)[1])/replicates)){
    y_values <- c()
    for (j in 1:replicates){
      y_values <- c(y_values, c(unlist(df[replicates*(i-1)+j,numeric_columns], use.names = FALSE)))
    }
    fit <- lm(y_values ~ splines::bs(rep(1:length(numeric_columns), replicates, degree = 3)))
    predicted[i,] <- c(unlist(df[replicates*i,"metabo_key"], use.names = FALSE), predict(fit)[c(1:length(numeric_columns))])
  }
  cluster_format <- function(row){
    Name <- row[1]
    value <- unlist(c(row[c(2:length(row))]))
  }
  data <- predicted
  a <- by(as_tibble(data), 1:nrow(data), cluster_format)
  names(a) <- data$metabo_key
  pc <- tsclust(a, type = "partitional", k = k,
  distance = "sbd", centroid = "pam",
  seed = 1234L, trace = TRUE,
  args = tsclust_args(dist = list(window.size = 20L)))
  cluster_groups <- vector("list", k)
  names(cluster_groups) <- 1:k
  for (i in 1:dim(data)[1]){
    cluster_groups[[pc@cluster[i]]] <- c(cluster_groups[[pc@cluster[i]]], names(pc@datalist)[i])
  }
  plot(pc)
  ggsave(output_path_plot)

  sink(output_path_clusters)
  for (group in cluster_groups){
    for (metabolite in group){
      cat(metabolite)
      cat(",")
    }
    cat("\n")
  }
  sink()
  return(cluster_groups)
}