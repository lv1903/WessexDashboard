
var express = require("express");
var jade = require("jade");
var bodyParser = require("body-parser");
var app = express();


app.set("views", __dirname + "/views");
app.set("view engine","jade");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: (5*1024*1000) }));




var phantom = require('phantom');
var fs = require('fs');
var path = require('path');


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

};




/*------------------------------------------------------------------*/

app.get("/projects/alcdash", function(req, res){

    var reportType = "Intro";

    var areaType = "CCG";

    var genderArr = ["Persons"]


    var area = req.params["area"];


    var indicatorArr = [];
    for(var indicator in config_obj.indicatorMapping){
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


    var view = "intro";

    res.render(view, {
        title: view,
        state_obj: state_obj,
        data_obj: data_obj,
        config_obj: config_obj
    });

});

app.get("/projects/alcdash/select/:reportType/:areaType/:indicator/:gender/:area", function(req, res){

    var reportType = req.params["reportType"];
    var areaType = req.params["areaType"];
    var indicator = req.params["indicator"];
    var indicatorArr = [req.params["indicator"]];
    var gender = req.params["gender"]
    var genderArr = [req.params["gender"]];
    var area = req.params["area"];


    var state_obj = {
        reportType: reportType,
        areaType: areaType,
        gender: gender,
        genderArr: genderArr,
        indicator: indicator,
        indicatorArr: indicatorArr,
        current_area: area
    };

    var view = "select";

    res.render(view, {
        title: view,
        config_obj: config_obj,
        state_obj: state_obj
    });

});

app.get("/projects/alcdash/share/:reportType/:areaType/:indicator/:gender/:area", function(req, res){

    var reportType = req.params["reportType"];
    var areaType = req.params["areaType"];
    var indicator = req.params["indicator"];
    var indicatorArr = [req.params["indicator"]];
    var gender = req.params["gender"]
    var genderArr = [req.params["gender"]];
    var area = req.params["area"];


    var state_obj = {
        reportType: reportType,
        areaType: areaType,
        gender: gender,
        genderArr: genderArr,
        indicator: indicator,
        indicatorArr: indicatorArr,
        current_area: area
    };

    var view = "share";

    res.render(view, {
        title: view,
        config_obj: config_obj,
        state_obj: state_obj
    });

});

app.get("/projects/alcdash/source/:reportType/:areaType/:indicator/:gender/:area", function(req, res){

        var reportType = req.params["reportType"];
        var areaType = req.params["areaType"];
        var indicator = req.params["indicator"];
        var indicatorArr = [req.params["indicator"]];
        var gender = req.params["gender"]
        var genderArr = [req.params["gender"]];
        var area = req.params["area"];


        var state_obj = {
            reportType: reportType,
            areaType: areaType,
            gender: gender,
            genderArr: genderArr,
            indicator: indicator,
            indicatorArr: indicatorArr,
            current_area: area
        };

        var view = "source";

        res.render(view, {
            title: view,
            config_obj: config_obj,
            state_obj: state_obj
        });

    });

app.get("/projects/alcdash/IndicatorReport/:areaType/:indicator/:gender/:area", function(req, res) {

    var reportType = req.params["reportType"];

    var pdf = false;
    if(req.headers['user-agent'].indexOf("PhantomJS") > 0){pdf = true} //for removing certain elements from pdf

    var color = true;
    if(req.query.color == "greyscale"){color = false}; //set color or grey scale

    var reportType = "IndicatorReport";

    var areaType = req.params["areaType"];
    if(!isNaN(areaType)){areaType = config_obj.areaTypeArray[areaType]}

    var indicator = req.params["indicator"];
    if(!isNaN(indicator)){indicator = config_obj.indicatorArray[indicator]}
    var indicatorArr = [indicator];

    var gender = req.params["gender"]
    if(!isNaN(gender)){gender = config_obj.genderArray[gender]}
    var genderArr = [gender];

    var area = req.params["area"];

    var state_obj = {
        reportType: reportType,
        areaType: areaType,
        genderArr: genderArr,
        indicatorArr: indicatorArr,
        current_area: area,
        pdf: pdf,
        color: color
    };



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

app.get("/projects/alcdash/AreaReport/:areaType/:area/:gender", function(req, res) {

    var pdf = false;
    if(req.headers['user-agent'].indexOf("PhantomJS") > 0){pdf = true} //for removing certain elements from pdf

    var color = true;
    if(req.query.color == "greyscale"){color = false}; //set color or grey scale

    var reportType = "AreaReport";

    var areaType = req.params["areaType"];
    if(!isNaN(areaType)){areaType = config_obj.areaTypeArray[areaType]}

    var gender = req.params["gender"]
    if(!isNaN(gender)){gender = config_obj.genderArray[gender]}
    var genderArr = [gender];

    var area = req.params["area"];


    var indicatorArr = [];
    for(var indicator in config_obj.indicatorMapping){
        indicatorArr.push(indicator)
    }

    var state_obj = {
        reportType: reportType,
        areaType: areaType,
        genderArr: genderArr,
        indicatorArr: indicatorArr,
        current_area: area,
        pdf: pdf,
        color: color
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

});

app.get("/projects/alcdash/OverviewReport/:areaType/:area/:gender", function(req, res) {

    var pdf = false;
    if(req.headers['user-agent'].indexOf("PhantomJS") > 0){pdf = true} //for removing certain elements from pdf

    var color = true;
    if(req.query.color == "greyscale"){color = false}; //set color or grey scale

    var reportType = "OverviewReport";

    var areaType = req.params["areaType"];
    if(!isNaN(areaType)){areaType = config_obj.areaTypeArray[areaType]}

    var indicatorArr = [];
    for(var indicator in config_obj.indicatorMapping){
        indicatorArr.push(indicator)
    }

    var gender = req.params["gender"]
    if(!isNaN(gender)){gender = config_obj.genderArray[gender]}
    var genderArr = [gender];

    var area = req.params["area"];



    var state_obj = {
        reportType: reportType,
        areaType: areaType,
        genderArr: genderArr,
        indicatorArr: indicatorArr,
        current_area: area,
        pdf: pdf,
        color: color
    };




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


    var data_obj = {
        data_arr: wessex_arr,
        ordered_list_obj: ordered_list_obj,
        density_obj: density_obj
    };


    var view = "reportOverview";

    res.render(view, {
        title: view,
        state_obj: state_obj,
        data_obj: data_obj,
        config_obj: config_obj
    });

});

app.get("/pdf/projects/alcdash/:reportType/:areaType/:area/:gender", function(req, res) {


    var reportType = req.params["reportType"];

    if(reportType == "AreaReport") {
        var viewportSize = {width: 820, height: 1};
        var paperSize = {
            format: "A4",
            orientation: 'landscape',
            margin: '0cm'
        };
    }


    if(reportType == "OverviewReport") {
        var viewportSize = {width: 850, height: 1};
        var paperSize = {
            format: "A4",
            orientation: 'landscape',
            margin: '0cm'
        };
    }

    var zoomFactor = 1;

    var arrSet = [
        ['paperSize', paperSize],
        ['viewportSize', viewportSize],
        ['zoomFactor', zoomFactor]
    ];

    var nextSet = function(page, index, arrSet, callback){
        if(index < arrSet.length){
            page.set(arrSet[index][0], arrSet[index][1], function(res){
                nextSet(page, index+1, arrSet, callback)
            })
        } else {
            callback(page)
        }
    };

    //remove "/pdf" and render the url to pdf
    var address = req.protocol + '://' + req.get('host') + req.originalUrl.substring(4); //'/' + reportType + '/' + areaType + '/' + indicator + '/' + gender + '/' + area;
    //console.log(address);

    var output = 'LAPW_' + Date.now() + '.pdf';
    var download_output = 'LAPW_' + reportType + '.pdf';

    var file = path.join(__dirname, "tmp/" + output);

    //var settings = {
    //    operation: "POST",
    //    encoding: "utf8",
    //    headers: {
    //        "Content-Type": "application/json"
    //    },
    //    data: JSON.stringify({
    //        pdf: "pdf"
    //    })
    //};

    phantom.create("--web-security=no", function (ph) {
        //console.log("creating page")
        ph.createPage(function (page) {
            page.open(address, function (status) {
                nextSet(page, 0, arrSet, function(page){
                    //console.log("rendering page")
                    page.render("tmp/" + output, function(result){
                        //console.log("pdf: " + file)
                        res.download(file, download_output, function(err){
                            if(err){console.log(err.message)}
                            fs.unlink(file)
                        })
			ph.exit();
                    })
                });
            });
        })
    }, {
        dnodeOpts: { //only for MS
            weak: false
        }
    });

});

app.get("/pdf/projects/alcdash/:reportType/:areaType/:indicator/:gender/:area", function(req, res) {


    var reportType = req.params["reportType"];

    var viewportSize = {width: 750, height: 1};
            var paperSize = {
            format: "A4",
            orientation: 'landscape',
            margin: '0cm'
        };    

    var zoomFactor = 1;

    var arrSet = [
        ['paperSize', paperSize],
        ['viewportSize', viewportSize],
        ['zoomFactor', zoomFactor]
    ];

    var nextSet = function(page, index, arrSet, callback){
        if(index < arrSet.length){
            page.set(arrSet[index][0], arrSet[index][1], function(res){
                nextSet(page, index+1, arrSet, callback)
            })
        } else {
            callback(page)
        }
    };

    //remove "/pdf" and render the url to pdf
    var address = req.protocol + '://' + req.get('host') + req.originalUrl.substring(4); //'/' + reportType + '/' + areaType + '/' + indicator + '/' + gender + '/' + area;
    //console.log(address);

    var output = 'LAPW_' + Date.now() + '.pdf';
    var download_output = 'LAPW_' + reportType + '.pdf';

    var file = path.join(__dirname, "tmp/" + output);

    var settings = {
        operation: "POST",
        encoding: "utf8",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            pdf: "pdf"
        })
    };

    phantom.create("--web-security=no", function (ph) {
        //console.log("creating page")
        ph.createPage(function (page) {
            page.open(address, function (status) {
                nextSet(page, 0, arrSet, function(page){
                    //console.log("rendering page")
                    page.render("tmp/" + output, function(result){
                        //console.log("pdf: " + file)
                        res.download(file, download_output, function(err){
                            if(err){console.log(err.message)}
                            fs.unlink(file)
                        })
			ph.exit();	
                    })		    
                });                
            });
        })
    }, {
        dnodeOpts: { //only for MS
            weak: false
        }
    });

});





app.listen(3011);