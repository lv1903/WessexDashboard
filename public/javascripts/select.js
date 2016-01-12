

var getPage = function(){

    var inArr, outArtt, path;

    if(document.getElementById("reportTypeSelect").value == "IndicatorReport"){

        inArr = ["areaTypeSelect", "indicatorSelect","genderSelect", "areaSelect"];
        outArr =[];

        for(var i in inArr){
            var e = document.getElementById(inArr[i]);
            outArr[i] = e.options[e.selectedIndex].value;
        }
        path = window.location.protocol + "//" + window.location.host + "/IndicatorReport/" + outArr[0] + "/" + outArr[1] + "/" + outArr[2]  + "/" + outArr[3];
        window.location.href = path;

    }

    if(document.getElementById("reportTypeSelect").value == "AreaReport"){

        inArr = ["areaTypeSelect", "areaSelect", "genderSelect"];
        outArr = [];
        for (var i in inArr) {
            var e = document.getElementById(inArr[i]);
            outArr[i] = e.options[e.selectedIndex].value;
        }
        path = window.location.protocol + "//" + window.location.host + "/AreaReport/" + outArr[0] + "/" + outArr[1] + "/" + outArr[2];
        window.location.href = path;
    }

};



var reportTypeChange = function(){

    var reportType = document.getElementById("reportTypeSelect").value;

    if(reportType == "AreaReport"){

        document.getElementById("genderSelector").style.display = 'block';
        document.getElementById("indicatorSelector").style.display = 'none';
        document.getElementById("areaTypeSelector").style.display = 'block';
        document.getElementById("areaSelector").style.display = 'block';
        document.getElementById("areaSelectorText").innerHTML = "Area";

    }

    if (reportType == "IndicatorReport") {

        document.getElementById("genderSelector").style.display = 'block';
        document.getElementById("indicatorSelector").style.display = 'block';
        document.getElementById("areaTypeSelector").style.display = 'block';
        document.getElementById("areaSelector").style.display = 'block';
        document.getElementById("areaSelectorText").innerHTML = "Highlight Area";

    }

};

var areaTypeChange = function(){

    var areaType = document.getElementById("areaTypeSelect").value;

    var areaList = config_obj.areaList[areaType].sort(function(a, b){
        if (a.name < b.name)
            return -1;
        else if (a.name > b.name)
            return 1;
        else
            return 0;
    });

    var select;
    var length;
    var i;
    var opt;

    //update the possible areas

    select = document.getElementById("areaSelect");

    while (select.options.length > 0) {
        select.options[0] = null;
    }



    for (i in areaList ) {
        opt = document.createElement('option');
        opt.value =areaList[i].id;
        opt.innerHTML = areaList[i].name;
        select.appendChild(opt);
    }

};

var indicatorChange = function(){

    //var indicator = document.getElementById("indicatorSelect").value;
    //
    //var api_query = 'http://q.nqminds.com/v1/datasets/41WGoeXhQg/distinct?key=Sex&filter={"Indicator":"'
    //                + encodeURIComponent(config_obj.indicatorMapping[indicator] ) + '"}'
    //
    //
    //$.ajax(api_query).done(function (res) {
    //
    //    select = document.getElementById("genderSelect");
    //
    //    while(select.options.length > 0) {
    //        select.options[0] = null;
    //    }
    //
    //    for (i in res.data ) {
    //        opt = document.createElement('option');
    //        opt.value = res.data[i];
    //        opt.innerHTML = res.data[i];
    //        select.appendChild(opt);
    //    }
    //
    //});

    //if(document.getElementById("genderSelect").value == "Persons" &&
    //        ){
    //    document.getElementById("genderSelect").value = "Male"
    //}

};






window.onload = function() {

    //update twice once to populate once to set current values

    console.log(state_obj)

    reportTypeChange();
    areaTypeChange();
    indicatorChange();

    document.getElementById("reportTypeSelect").value = state_obj.reportType;
    document.getElementById("genderSelect").value = state_obj.gender;
    document.getElementById("areaTypeSelect").value = state_obj.areaType;
    document.getElementById("areaSelect").value = state_obj.current_area;
    document.getElementById("indicatorSelect").value = state_obj.indicator;

    reportTypeChange();
    areaTypeChange();
    indicatorChange();

    document.getElementById("reportTypeSelect").value = state_obj.reportType;
    document.getElementById("genderSelect").value = state_obj.gender;
    document.getElementById("areaTypeSelect").value = state_obj.areaType;
    document.getElementById("areaSelect").value = state_obj.current_area;
    document.getElementById("indicatorSelect").value = state_obj.indicator;


}