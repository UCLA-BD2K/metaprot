Met(a)prot

Setting up metaprot

1. Intall R (mac via homebrew, windows via official website)
2. Install ggplot2 and gplots (optional for now)
3. Set R_HOME environment variable
4. Install Rserve via "install.packages(Rserve)"
5. Run a local instance of Rserve by entering R shell and entering:
    library(Rserve)
    Rserve(args="--no-args --RS-port <port>")

where <port> refers the port you want to bind the Rserve instance to.
6. Install MongoDB, and run a local instance with defaults (localhost, default port)
7. Run application