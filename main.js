
var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();


app.set("views", __dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: (5*1024*1000) }));


var f = require("./serverfun.js");




//get config
var config_obj = require("./configs/master_config.json")



//get topojson
var all_topojson_obj = {};

var areaTypeArray = config_obj.areaTypeDataBaseDetails;

for(var iAT in areaTypeArray){

    var areaTypeObj = areaTypeArray[iAT];
    var areaListObj = config_obj.areaList;

    f.getTopoJsons(areaTypeObj, areaListObj, function(areaType, topology){
        console.log(areaType + " topojson acquired");
        all_topojson_obj[areaType] = topology
    });



};

//get data
var data_arr = [];

var indicatorArray = config_obj.indicatorDataBaseDetails;
var indicatorCount = indicatorArray.length;

for(var iI in indicatorArray){

    var indicatorObj = indicatorArray[iI];

    f.getIndicator(indicatorObj, function(indicator, data){
        console.log(indicator + " acquired");
        data_arr = data_arr.concat((data));

        indicatorCount -= 1;
        if(indicatorCount == 0){
            callNestObj()

        }

    });
}


//nest obj
var nested_obj;
var england_ordered_list_obj;
var england_density_obj;


var callNestObj = function(){

    var key;
    var keyArr = ["Area Type", "Sex", "Indicator", "Map Period"];

    nested_obj = {};
    nested_obj = f.nestObj(nested_obj, 0, keyArr, data_arr);

    england_density_obj = {};
    england_density_obj = f.getEnglandDensityObj(england_density_obj, nested_obj);

    england_ordered_list_obj = {};
    england_ordered_list_obj = f.getEnglandOrderList(england_ordered_list_obj, nested_obj);

    console.log("nested objects ready")


    //console.log("nested obj: " + f.roughSizeOfObject(nested_obj));
    //console.log("nested obj: " + f.roughSizeOfObject(england_ordered_list_obj));
    //console.log("nested obj: " + f.roughSizeOfObject(england_density_obj));

};



/*------------------------------------------------------------------*/


app.get("/", function(req, res){


});


app.get("/IndicatorReport/:areaType/:indicator/:gender", function(req, res) {

    //need to send topojson for areaType
    //config file
    //state
    //data for wessex list
    //ordered list of all values
    //density data

    var reportType = "IndicatorReport";
    var areaType = req.params["areaType"];
    var indicatorArr = [req.params["indicator"]];
    var genderArr = [req.params["gender"]];

    var state_obj = {
        reportType: reportType,
        areaType: areaType,
        genderArr: genderArr,
        indicatorArr: indicatorArr
    }



    //for the area type, indicator and gender get data for wessex areas

    //get the mappings for the indicator
    var indicatorMappedArr = f.getIndicatorMappedArr(indicatorArr, config_obj.indicatorMapping );

    //get list of wessex areas for area type
    var wessexList = config_obj.areaList[areaType].map(function(obj){ return obj.id});

    var wessex_arr = data_arr.filter(function(obj){
        if(
            obj["Area Type"] == areaType &&
            indicatorMappedArr.indexOf(obj["Indicator"]) > -1 &&
            genderArr.indexOf(obj["Sex"]) > -1 &&
            wessexList.indexOf(obj["Area Code"]) > -1
        ){
            return obj
        }
    });


    //get ordered list data and density data
    var ordered_list_obj = {};
    ordered_list_obj =  england_ordered_list_obj //f.filterEnglandObj(ordered_list_obj, england_ordered_list_obj, state_obj);
    var density_obj = {}
    density_obj = england_density_obj //f.filterEnglandObj(density_obj, england_density_obj, state_obj);

    var topojson_obj = {};
    topojson_obj[areaType] = all_topojson_obj[areaType];


    var data_obj = {
        data_arr: wessex_arr,
        ordered_list_obj: ordered_list_obj,
        density_obj: density_obj,
        topojson_obj: topojson_obj
    };


    var view = "reportIndicator";

    res.render(view, {
        title: view,
        state_obj: state_obj,
        data_obj: data_obj,
        config_obj: config_obj
    });

});



app.get("/AreaReport/:areaType/:area/:gender", function(req, res) {

    //need to send topojson for areaType
    //config file
    //state
    //data for wessex list for all inidcators - all areas? - all periods
    //ordered list of all values
    //density data

    var reportType = "AreaReport";
    var areaType = req.params["areaType"];
    var genderArr = [req.params["gender"]];
    var area = req.params["area"];


    var indicatorArr = [];
    for(indicator in config_obj.indicatorMapping){
        indicatorArr.push(indicator)
    }

    var state_obj = {
        reportType: reportType,
        areaType: areaType,
        genderArr: genderArr,
        indicatorArr: indicatorArr,
        current_area: area
    }



    //for the area type, area(currently sending all areas) and gender get data for wessex areas

    //get list of wessex areas for area type
    var wessexList = config_obj.areaList[areaType].map(function(obj){ return obj.id});

    var wessex_arr = data_arr.filter(function(obj){
        if(
            obj["Area Type"] == areaType &&
            //indicatorMappedArr.indexOf(obj["Indicator"]) > -1 &&
            genderArr.indexOf(obj["Sex"]) > -1 &&
            wessexList.indexOf(obj["Area Code"]) > -1
        ){
            return obj
        }
    });


    //get ordered list data and density data
    var ordered_list_obj = {};
    ordered_list_obj =  england_ordered_list_obj; //f.filterEnglandObj(ordered_list_obj, england_ordered_list_obj, state_obj);
    var density_obj = {}
    density_obj = england_density_obj; //f.filterEnglandObj(density_obj, england_density_obj, state_obj);

    var topojson_obj = {};
    topojson_obj[areaType] = all_topojson_obj[areaType];


    var data_obj = {
        data_arr: wessex_arr,
        ordered_list_obj: ordered_list_obj,
        density_obj: density_obj,
        topojson_obj: topojson_obj
    };


    var view = "reportArea";

    res.render(view, {
        title: view,
        state_obj: state_obj,
        data_obj: data_obj,
        config_obj: config_obj
    });

})


app.listen(3011);