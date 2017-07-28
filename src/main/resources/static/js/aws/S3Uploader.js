// modules
	// conains 2 total, S3Uploader and FileController

	/**
	 * S3 uploader module.
	 *
	 * Usage:
	 * 1. Can simply call S3Uploader.upload(data, filename, [, moreOptions, callback, onUploadProgress])
	 *
	 * Note that moreOptions, callback, and onUploadProgress are OPTIONAL
	 * moreOptions should be in form: {ContentLength:<>, ContentType:<>}, but customize to your needs
	 * the callback function will be called with a single argument containing a JSON object with the upload details
	**/
	var S3Uploader = (function() {

		// members

		var credentialsInitialized = false;
		var s3BucketName = "metaprot";
		var s3Bucket;
		var params = {	// change as needed
				Bucket:s3BucketName,
				ACL: "authenticated-read"
			};
		var options = {
			partSize: 10 * 1024 * 1024,
			queueSize: 1
		};


		// functions

		/**
		 * Initializes AWS credentials, only once per page load.
		**/
		var initAWSCredentials = function() {

			if (credentialsInitialized) {
				// skip init if already done.
				return;	
			}

			// Initialize the Amazon Cognito credentials provider
			AWS.config.region = 'us-west-2'; // Region
			AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			    IdentityPoolId: 'us-west-2:c9010013-552a-406e-8f4f-eee00cc257e6',
			});

			// Make the call to obtain credentials
			AWS.config.credentials.get(function(){

			    // Credentials will be available when this function is called.
			    console.log("Retreived new temporary credentials.");
			});
			
			credentialsInitialized = true;
			refreshAWSCredentials();		// begins continuous credential refresh
			s3Bucket = new AWS.S3({ params:{ Bucket : s3BucketName} });
		};


		/**
		 * Uploads the input stream of bytes to s3, with the given file name. 
		 * Uses "intelligent" upload that chunks as needed. Optional callback
		 * and options such as ContentType, etc., if specified. 
		**/
		var upload = function(inputStream, fileName, moreParams, callback, onUploadprogress) {

			initAWSCredentials();

			params.Key = fileName;	// replace "" with some prefix later on
			params.Body = inputStream;

			if (moreParams) {
				//params.ContentEncoding = options.ContentEncoding,
				params.ContentType = moreParams.ContentType,
				params.ContentLength = moreParams.ContentLength
			}

			// begin upload
			s3Bucket.upload(params, options, function(err, data) {
				if (err) {
					console.log(err);
				} else {
					if (callback) {
						callback(data);
					}
				}
			})
			.on("httpUploadProgress", function(e) {
				if (onUploadprogress) {
					onUploadprogress(e.key, e.loaded, e.total);
				}
			});

		};

		function download(filePath, callback){

			initAWSCredentials();
			var s3 = new AWS.S3();

			return s3.getObject({ Bucket: s3BucketName, Key: filePath }).promise()
			        .then( data => {
			            var fileContent = new TextDecoder("utf-8").decode(data.Body);
			            return fileContent;
                    }).catch( err => {
                        throw new Error(err);
                    });
		}

		var deleteFile = function(filePath){

			initAWSCredentials();
            var s3 = new AWS.S3();
            return s3.deleteObject({ Bucket: s3BucketName, Key: filePath }).promise();

		};

		// private
		var refreshAWSCredentials = function() {
			// every 45 minutes, refresh access credentials
			setTimeout(function() {
				AWS.config.credentials.refresh(function(err) {
					if (err) {
						console.log("Could not refresh temporary credentials.");
					} else {
						console.log("Refreshed temporary credentials.");
					}

					refreshAWSCredentials();	// call again in 45 minutes
				});
			}, 2700000);
		};

		return {
			upload:upload,
			download:download,
			deleteFile:deleteFile
		};

	})();

	/**
	 * File controller used specifically for multiple file uploads - though
	 * it will work with single files as well.
	 *
	 * Usage: 
	 * 1. Initialize FileController's onFileRead() callback function using setOnFileRead(...)
	 * 2. call setInputElement(jqueryEle) to register file input element to retrieve files from
	 * 3. call readFiles() after 1 and 2, which will read all the files as array buffers and call
	 * 	   the registered callback function for each file read.
	 * 
	**/
	var FileController = (function() {

		//members 

		var $input = null;		// the input element to look at for files
		var readers = [];		// array of active readers, good for aborting
	
		var onFileRead = function() {	// placeholder
			console.log("No onFileRead() callback registered with FileController");
		};

		// functions

		// called after setting input element, reads all files in and
		// calls the callback once each file is ready (e.g. for upload)
		var readFiles = function() {
			if (!$input) {
				alert("Input not correctly initialized.");
				return;
			} else if (!$input[0].files || !$input[0].files.length){
				alert("Files property not supported by your browser or no files selected.");
			} else {
				// eveything looks good, for each file, read it in and call
				// the callback
			
				var afterEachFileRead = function(options, nextIndex) {

					onFileRead(options);	// do whatever you want with the file now that it is read
					
					if (nextIndex >= $input[0].files.length) {
						return;	// all files have been read
					}
					
					readFile(nextIndex, afterEachFileRead);
				};

				// start the sequential file reading
				readFile(0, afterEachFileRead);

			}

		};

		var readFile = function(index, next) {	// private function that reads each file sequentially

			var reader = new FileReader();
			readers.push(reader);

			var currentFile = $input[0].files.item(index);

			reader.onload = function(e) {
				var options = {
					name: currentFile.name,
					type: currentFile.type,
					size: currentFile.size,	// in bytes
					data: reader.result
				}

				next(options, index+1);	// should initiate next file to read
			}
			
			reader.readAsArrayBuffer(currentFile);
		};

		/* setters */
		var setOnFileRead = function(cb) {	// callback after each file is ready
			onFileRead = cb;
		};

		var setInputElement = function(jqInput) {
			$input = jqInput;
			console.log($input);
		};

		return {
			setOnFileRead:setOnFileRead,
			setInputElement:setInputElement,
			readFiles:readFiles
		};

	})();