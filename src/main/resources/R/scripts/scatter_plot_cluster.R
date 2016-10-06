analyze.temporal.patterns <- function(dataPath, outputCSV, numDesiredClusters, minMembersPerCluster) {

  # read sample data
  #dta_0 = read.csv("/Users/howardchoi/Desktop/MetaProt/Abineet/test_scatter_plot.csv", header = TRUE);
  dta_0 = read.csv(dataPath, header = TRUE);

  # get metabolites as row name and time points as col names
  metabolites = dta_0[,1];
  time_points = c(0,1,3,5,7,14);

  # re structure the sample data
  dta = dta_0[,-1];
  rownames(dta) = metabolites; colnames(dta) = time_points

  # scatter plot for each metabolite
  # ex) I want to plot patterns of first three metabolites
  # first_three_metabolites = dta[c(1:3),];

  # Time Series Clustering
  # hierarchical clustering with DTW Distance
  # myDist = dist(dta, method = "DTW");
  # hc = hclust(myDist, method = "average")
  myDist = dist(dta, method = "euclidean");
  hc = hclust(myDist, method = "average");

  #plot(hc, labels = observedLabels, main = "");
  #plot(hc, main = "");
  memb = cutree(hc, k = numDesiredClusters);                   # k = number of desired clusters
  memb_t = sort(table(memb), decreasing = TRUE);

  groups = names(memb_t)[memb_t > (minMembersPerCluster-1)]; # limit clusters to those with > e.g. 5 members, subtract one to mean AT LEAST

  tmp = c();
    empty_line = rep(NA, 6); names(empty_line) = time_points;
    for(i in groups){
     each_dta = dta[(memb == i),];
     tmp = rbind(tmp, each_dta, empty_line);
  }
  write.csv(tmp, outputCSV);


  ### script logic ends here, below is concerned with drawing plots

  # ex) I want to plot patterns of first three metabolites
  first_three_metabolites = dta[(memb == groups[1]),];
  # plot the first metabolite
#  # get color
#  a_color = "blue";
#  # set range of y axis
#  aylim = c(0.2, 1.8)
#  # set range of x axis
#  axlim = c(min(time_points),max(time_points))

#  # plot!
#  plot(time_points, first_three_metabolites[1,], type="o", col=a_color, axes=FALSE, ann=FALSE, ylim=aylim, xlim=axlim);
#  # draw x axis
#  axis(1, at = time_points, lab=paste("D", time_points, sep=""), cex.axis = 1);
#  # draw y axis
#  axis(2, las=1);
#  # draw box
#  box();
#  # give a title for the graph
#  title(main = paste(rownames(first_three_metabolites), collapse = ";"), col.main = "red", font.main = 4);
#
#  # add lines for rest of metabolites
#  for (i in c(2:nrow(first_three_metabolites))){
#    lines(time_points, first_three_metabolites[i,], type = "o", col = a_color);
#  };

  # plot trend in red line
  in_x = rep(time_points, nrow(first_three_metabolites)); in_y = as.vector(t(first_three_metabolites));
  in_data = data.frame(in_x, in_y); # data frame

  # fit a loess line
  loess_fit = loess(in_y ~ in_x, in_data);

  # return regression line
  predict(loess_fit)[1:length(time_points)]

  #lines(time_points, predict(loess_fit)[1:length(time_points)], col = "red", lwd=7, lty=2);

  #loess_fit contains data for regression line
}