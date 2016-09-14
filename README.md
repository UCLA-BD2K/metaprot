#Metaprot

###Dependencies

####R
Install a local version of R (can be from homebrew if on OSX) 

####Rserve
Head over to https://rforge.net/Rserve/doc.html#inst to install Rserve,
note that you may need to build/install from source depending on your
OS. Otherwise, running:

```bash
install.packages("Rserve")
library(Rserve)
Rserve(args="RS-port <port>")
```

in the R shell where ```<port>``` refers to the desired port you would like to run Rserve on should suffice. This will install and run Rserve on your desired port(s).

####Mongo
This will change in the near future, as there is a high chance that
we will migrate to AWS DynamoDB in the future. For now, grab an installation
of mongo and start a mongod process at the default port (27017).

###Running Metaprot
If you have not done so already, double check that the home directory
for your R installation is in your PATH. Running:

```bash
R.home()
```

in the R shell should point you to where R is installed. If using an IDE
like IntelliJ, you may need to edit run configurations to set the R_HOME
environment variable.

You will need a .properties file (application.properties) with the correct
information to connect to AWS, etc. Ask one of the developers for this file/information
as needed.

With the above steps, you should be able to run Metaprot locally via
embedded Tomcat (IntelliJ, etc.).