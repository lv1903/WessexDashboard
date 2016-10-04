


module.exports = {

    

    getIndicator: function (indicatorObj, callback) {

        var config_obj = require("./configs/master_config.json");

        var indicator = indicatorObj.indicator;
        var databaseId = indicatorObj.databaseId;
        var indicatorKey = indicatorObj.indicatorKey;

        var versionTimestamp;


        //set a large limit
        var apiPath = '/v1/datasets/' + databaseId + '/data?opts={"limit":1000000}&filter={"' + indicatorKey + '":"' + encodeURIComponent(indicator) + '","Value":{"$ne":-1},"Map_Period":{"$gte":' + config_obj.firstPeriod + ',"$lte":' + config_obj.lastPeriod + '}}';
        console.log(apiPath)

        var options = {
            host: 'q.nqminds.com',
            path: apiPath
        };

        //console.log(options.path)


        console.log("request data");
        this.nqm_tbx_query(options, function(body){

            var data = JSON.parse(body).data;

            console.log(data[data.length - 1])

            callback(indicator, data)

        })

    },



    getTopoJsons: function(areaTypeObj, areaListObj, callback){
        //input: object with key for area type
        // and property as array of entity objects for required boundaries
        //id is the key for the enitiy objects
        //output: object with key for area type
        // and geojson feature collection as property

        //var fs = require("fs")
        //
        //var util = require('util');
        //var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
        //var log_stdout = process.stdout;
        //
        //console.log = function(d) { //
        //    log_file.write(util.format(d) + '\n');
        //    log_stdout.write(util.format(d) + '\n');
        //};


        var topojson = require("topojson");


        var areaType = areaTypeObj.areaType;
        var idKey =  areaTypeObj.idKey;
        var databaseId = areaTypeObj.databaseId

        var request_array = this.filterToArray(areaListObj[areaType], "id");
        var string_request_array = JSON.stringify(request_array);

        var apiPath = '/v1/datasets/' +  databaseId + '/data?filter={"properties.' +  idKey + '":{"$in":' + string_request_array + '}}';

        var options = {
            host: 'q.nqminds.com',
            path: apiPath
        };

        console.log("request data")
        this.nqm_tbx_query(options, function(body){

            var features = JSON.parse(body).data;

            //console.log(features)

            //combine features into feature collection
            var collection = {
                "type": "FeatureCollection",
                "features": []

            };
            for(var i in features){
                //console.log(features[i])
                collection.features.push(features[i])
            }

            var qVal = 1e1;
            var sVal = 1e-3;

            var topology;

            topology = topojson.topology(
                {collection: collection},
                {"property-transform":function(feature) {return {"id": feature.properties[idKey]} ;}}//,
            );
            topology = topojson.simplify(topology, {"coordinate-system":"cartesian", "quantization":qVal, "minimum-area": sVal});

            callback(areaType, topology)

        });



    },


    filterToArray: function(obj, key){
        //extract the key property from obj into array
        var arr = [];
        for(var i in obj){arr.push(obj[i][key]);}
        return arr
    },


    getUniqueArray: function(key, arr){

        var uniqueArr = [];
        for(var i in arr){
            var prop = arr[i][key];
            if(uniqueArr.indexOf(prop) == -1){uniqueArr.push(prop)}
        }
        return uniqueArr
    },

    nestObj: function(obj, index_keyArray, keyArray, arr){
        //recursively create nested object
        if(index_keyArray  < keyArray.length){

            var key = keyArray[index_keyArray];
            var uniqueArray = this.getUniqueArray(key, arr);

            for(var u in uniqueArray){

                var prop = uniqueArray[u];
                var filterArray = arr.filter(function(obj){if(obj[key] == prop){return obj}});

                obj[prop] = {};
                obj[prop] = this.nestObj(obj[prop], index_keyArray + 1, keyArray, filterArray)
            }
            return obj //pass back the object

        } else {

            return arr //got to end return the filtered array
        }
    },

    //extract values from nested object
    getEnglandOrderList: function(target_obj, source_obj){

        //returns nested object with arrays of values for all england

        for(var key in source_obj){

            if( Object.prototype.toString.call( source_obj[key] ) === '[object Array]' ) {
                //if the data array strip out values into a sorted array and return the new value array

                var arr = source_obj[key].map(function(el){return Number(el.Value)}).sort(function(a, b){return a-b});
                target_obj[key] = arr;

                //return arr

            } else {
                target_obj[key] = {};
                target_obj[key] = this.getEnglandOrderList(target_obj[key] , source_obj[key])
            }
        }
        return target_obj
    },

    //extract values and calculate densities from nested obj
    getEnglandDensityObj: function(target_obj, source_obj){

        //returns nested object with arrays of for density plots


        for(var key in source_obj){

            //console.log("******************")
            //console.log(key)

            if( Object.prototype.toString.call( source_obj[key] ) === '[object Array]' ) {
                //if the data array strip out values into a sorted array and return the new value array

                var arr = source_obj[key].map(function(el){if(el.Value != null){return Number(el.Value)}}).sort(function(a, b){return a-b});

                target_obj[key] = this.getDensityArray(arr);

            } else {
                target_obj[key] = {};
                target_obj[key] = this.getEnglandDensityObj(target_obj[key] , source_obj[key])
            }
        }
        return target_obj

    },


    getDensityArray: function(source_arr){

        //from a source array of values, returns an array of desnsities for interger values up to max value + 10%

        var kernel = require("kernel-smooth");

        //get max value and add 10% to make graph cleaner

        //console.log(source_arr)

        var max_x = source_arr[source_arr.length - 1] * 1.1;

        //create x_arr
        var x_arr = [];
        for(var i = 0; i <=  max_x; i++){
            x_arr.push(i);
        }


        var bandwidth = max_x / 5;
        var kde = kernel.density(source_arr, kernel.fun.epanechnikov, bandwidth);
        var density_arr = kde(x_arr);


        //console.log("source_arr: " +  source_arr.length + " " + source_arr[0] + " " + source_arr[source_arr.length - 1] )
        //console.log("max_x: " + max_x);
        //console.log("x_arr: " + x_arr.length)
        //console.log("density_arr: " + density_arr.length)

        return density_arr

    },


    filterEnglandObj: function(target_obj, source_obj, s){

        target_obj[s.areaType] = {};
        for(var i in s.genderArr) {
           target_obj[s.areaType][s.genderArr[i]] = {};
            for (var j in s.indicatorArr) {
                target_obj[s.areaType][s.genderArr[i]][s.indicatorArr[j]] = source_obj[s.areaType][s.genderArr[i]][s.indicatorArr[j]]
            }
        }
        return target_obj
    },


    nqm_tbx_query: function(options, callback){
        //requests data from tbx and returns body string

        var http = require("http");

        var req = http.get(options, function(res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            // Buffer the body entirely for processing as a whole.
            var bodyChunks = [];
            res.on('data', function(chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            }).on('end', function() {
                var body = Buffer.concat(bodyChunks);

                ////extract the subset list for the area you require
                //var allObj = JSON.parse(body).data;
                //var subsetObj = getSubset(allObj, subsetList);
                //
                ////get array for density function
                //var splitBy = "Map Period";
                //var value = "Value"
                //var densityObj = getDensityObj(allObj, splitBy, value);

                //callback(subsetObj, densityObj)

                callback(body)
            })
        });
        req.on('error', function(e) {
            console.log('ERROR: ' + e.message);
        });
    },


    getIndicatorMappedArr: function(inputArr, dic){
        var mappedArr = [];
        for(var i in inputArr){
            mappedArr.push(dic[inputArr[i]])
        }
        return mappedArr
    },

    roughSizeOfObject: function( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}



};



