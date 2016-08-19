/**
 * Exposes Modules that aid in segregating (or re-segregating data). For now,
 * this JS file is geared specifically for metabolite analysis.
 *
 * Construct new DataSegregator(data-in-some-form)
 **/
var DataSegregator =  (function(data) {

    /*
        result =
            {
                significance1: [],
                significance2: [],
                etc...
            }

            Significance levels determined by significance field in input objects
     */
    var result = null;

    if (!data) {
        alert("Data not correctly initialized in DataSegregator!");
        return;
    }

    // processes input data
    var segregate = function() {

        if (!result) {
            result = {};
        }

        for (var index in data) {
            var sig = getSignificanceLabel(data[index].significance);
            if (result[ sig ]) {
                result[ sig ].push(data[index]);
            } else {
                result[ sig ] = [data[index]];
            }
        }

        return result;
    };

    // given specified pThreshold and fcThreshold, re-segregate the data
    var resegregate = function(pThreshold, fcThreshold) {
        if (!result) {
            console.log("Cannot re-segregate uninitialized data!");
            return;
        }

        var newResult = {};

        for (var significance in result) {
            for (var index in result[significance]) {
                var sig = computeSignificance(result[significance][index], pThreshold, fcThreshold);

                if (newResult[sig]) {
                    newResult[sig].push(result[significance][index]);
                } else {
                    newResult[sig] = [result[significance][index]];
                }
            }
        }

        return newResult;

    };

    // given pThreshold and fc threshold, return significance value --somewhat hardcoded, but will do for now
    var computeSignificance = function(object, pThreshold, fcThreshold) {

        var normP = -1*Math.log10(object.pValue);
        var normFc = Math.log2(object.foldChange);

        var norm_pThreshold = -1*Math.log10(pThreshold);
        var norm_fcThreshold = Math.log2(fcThreshold);
        var lowerFcThreshold = -1*norm_fcThreshold;
        // ERROR
        if ((normP < norm_pThreshold)  ||
            (normFc > lowerFcThreshold) && (normFc < norm_fcThreshold)) {
            return "insignificant";
        } else if (normFc > norm_fcThreshold) {
            return "upregulated";
        } else if (normFc < norm_fcThreshold) {
            return "downregulated";
        } else {
            return "undeterminate";
        }
    };

    // input label -> segregated label
    var getSignificanceLabel = function(label) {
        var sig;
        switch (label) {
            case "upregulated in HF":
                sig = "upregulated";
                break;
            case "downregulated in HF":
                sig = "downregulated";
                break;
            case "insignificant":
                sig = "insignificant";
                break;
            default:
                sig = "error";
                break;
        }

        return sig;
    };

    return {
        segregate : segregate,
        resegregate : resegregate
    };
});