# rm(list = ls(all = T)); # remove all variables to start over

# import pkgs
library(ade4); # pkgs for PCA
library(scatterplot3d) # library(plotly) # pkgs for 3d plots
library(plotly) # dynamic 3d plot
library(readr)
# read a data

analyze.result.validation <- function(input, outputPlot) {
  ml_hl_ptm = read_csv(input)
  
  quant_dta = 
    ml_hl_ptm %>% 
    select(`AAELIAN(0.984)SLATAGDGLIELR_2`:`YVTLIYTNYEN(0.984)GK_2`)
    
  # perfor pca
  pca_dta = dudi.pca(quant_dta, scale = F, scannf=F, nf=3);
  png(outputPlot, width = 800, height = 800)
  # 3D plot
  with(pca_dta$l1, {
    s3d <- scatterplot3d(RS1, 
                         RS2,
                         RS3,        # x y and z axis
                         color=ml_hl_ptm$color_code, pch=19,        # circle color indicates no. of cylinders
                         cex.symbols = 2,
                         cex.axis = 1.5,
                         cex.lab = 1.5,
                         cex.main = 3,
                         type="h", lty.hplot=3,       # lines to the horizontal plane
                         scale.y=.75,                 # scale y axis (reduce by 25%)
                         main="3-D Scatterplot of Iteration 9",
                         xlab="PC 1",
                         ylab="PC 2",
                         zlab="PC 3")
    
    s3d.coords <- s3d$xyz.convert(RS1, 
                                  RS2,
                                  RS3)
    text(s3d.coords$x, s3d.coords$y,     # x and y coordinates
         labels=ml_hl_ptm$strain,       # text to plot
         pos=4, cex=1.75)                  # shrink text 50% and place to right of points)
    # add the legend
    legend("topleft", inset=.0,      # location and inset
           bty="n", cex=2,              # suppress legend box, shrink text 50%
           title="Treatments",
           c("Iso", "Control"), fill=c('#BF382A', '#0C4B8E'))
  });
   dev.off(); # delet the plot
}
# # dynamic 3d plot
# p <- plot_ly(pca_dta$l1, x = ~RS1, y = ~RS2, z = ~RS3, color = ml_hl_ptm$treatment, colors = c('#BF382A', '#0C4B8E')) %>%
#   add_markers() %>%
#   layout(scene = list(xaxis = list(title = 'PC 1'),
#                       yaxis = list(title = 'PC 2'),
#                       zaxis = list(title = 'PC 3')));
# p
# # dev.off(); # delet the plot
# 


