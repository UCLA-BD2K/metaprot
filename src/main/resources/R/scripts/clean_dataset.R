  clean.dataset <- function(input, output) {

  #rm(list = ls(all = TRUE)); # remove all variables

  # # import pkgs
  library(tidyverse); library(stringr); library(ggplot2)

  # data folder path and output path, respectively
  data_path = "/Users/davidmeng/Downloads/";

  # read in data
  data = read.csv(input, header = TRUE)

  for (name in colnames(data)) {
    if (is.numeric(data[[name]]))
      data[[name]] = scale(data[[name]])
  }


  # write out to CSV files
  write.csv(data, output)


}
