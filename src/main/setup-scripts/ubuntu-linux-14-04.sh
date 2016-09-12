#!/bin/bash

###
# A set up script to install all dependencies needed to run Metaprot on Ubuntu 14.04.
#
# Currently includes: installing R and Rserve, starting multiple Rserve processes,
###

# setup R
echo "Setting up R..."
sudo sh -c 'echo "deb http://cran.rstudio.com/bin/linux/ubuntu trusty/" >> /etc/apt/sources.list'
gpg --keyserver keyserver.ubuntu.com --recv-key E084DAB9
gpg -a --export E084DAB9 | sudo apt-key add -

sudo apt-get update
sudo apt-get -y install r-base

#export PATH=$PATH:/path/to/dir

# setup Rserve
echo "Setting up Rserve..."
R CMD BATCH R/rserve_setup.R


