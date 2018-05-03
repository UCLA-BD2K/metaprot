# MetProt

### Dependencies

#### Node.js and npm
Head over to https://nodejs.org/en/download/ to install Node.js and npm.

Run the following command in the terminal (inside the project directory) and keep the tab/window open while you are developing and making changes to the front-end of the application. This command will automatically create a new bundle at `src/main/resources/static/built/` as changes are made. Without this command running, front-end changes will not take effect.
```bash
npm run-script watch
```

#### R
Install a local version of R (can be from homebrew if on OSX) 

#### Rserve
Head over to https://rforge.net/Rserve/doc.html#inst to install Rserve,
note that you may need to build/install from source depending on your
OS. Otherwise, running:

```bash
install.packages("Rserve")
library(Rserve)
Rserve(args="--RS-port <port>")
```

in the R shell where ```<port>``` refers to the desired port you would like to run Rserve on should suffice. This will install and run Rserve on your desired port(s).


## Running MetProt
If you have not done so already, double check that the home directory
for your R installation is in your PATH. Running:

```bash
R.home()
```

in the R shell should point you to where R is installed. If using an IDE
like IntelliJ, you may need to edit run configurations to set the R_HOME
environment variable.

You will need a `application.properties` file at `src/main/resources/application.properties` with the correct
information to connect to AWS, etc. You will also need a `secret.p12` file at `src/main/resources/static/secret.p12` to successfully connect to Google Analytics. Ask for these files/information from a local developer or retrieve it from one of the previously deployed packages on AWS Elastic Beanstalk.

You will also need a profile (Maven) that complements the .properties file. Specifically,
you will need a local and production profile for setting variables such as the path
to the R scripts directory. Again, ask one of the developers for this information.

With the above steps, you should be able to run MetProt locally via
embedded Tomcat (IntelliJ, etc.).

### Deploying MetProt
Deployment is still under standardization, but Metaprot is live at: 
http://metaprot-env.us-west-2.elasticbeanstalk.com/

Ensure to specify the appropriate Maven profile when packaging, and 
use the Elastic Beanstalk console to upload a new application version.

In the future it would be nice to either: create a standard deploy
command in Maven, or have a bash script that handles uploading and
re-deploying new versions of the application. We want this so that we
can avoid re-running all of the setup scripts we configure in .ebextensions.


## Using MetProt
Here are the features provided by MetProt and how to use them. Before performing any kinds of analysis, you must first upload a dataset in either '.csv' or '.rdata' format.

### Dynamic Time Warping
After you have uploaded your dataset, you can perform dynamic time warping clustering to the metabolites. In order to choose the right amount of clusters k, you must first choose a range [a, b] that includes k.  Set a as the minimum amount of clusters and b as the maximum amount of clusters and press submit. After pressing submit, MetProt will run the dynamic time warping algorithm on the dataset for each number of clusters from a to b, and create a link to a new page that displays the plot of sum-of-squares within clusters against the number of clusters.  This way, you can use the `elbow method` to determine the correct number of clusters to use.  After you have determined to optimal number of clusters to use, enter the number in the blank field and click `Submit`, which will create a link that brings you to another page that displays the results of clustering. This page will display plots of the different clusters and the different metabolites in each cluster.