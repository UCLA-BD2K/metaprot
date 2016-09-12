# sets up Rserve

# install
if ("Rserve" %in% rownames(installed.packages()) == FALSE) {
    install.packages("Rserve")
}

# run an instance
library(Rserve)
Rserve(args="--no-save --RS-port 9001")