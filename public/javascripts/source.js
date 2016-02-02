var sourcePath = function() {

    var path;

    var areaType = config_obj.areaTypeArray.indexOf(state_obj.areaType);
    var indicator = config_obj.indicatorArray.indexOf(state_obj.indicatorArr[0]);
    var gender = config_obj.genderArray.indexOf(state_obj.genderArr[0]);


    switch (state_obj.reportType) {

        case "IndicatorReport":
            path = window.location.protocol + "//" + window.location.host + "/projects/alcdash/IndicatorReport/" + areaType + "/" + indicator + "/" + gender  + "/" + state_obj.current_area;
            break;

        case "OverviewReport":
            path = window.location.protocol + "//" + window.location.host + "/projects/alcdash/OverviewReport/" + areaType + "/" + state_obj.current_area + "/" + gender;
            break;

        case "AreaReport":
            path = window.location.protocol + "//" + window.location.host + "/projects/alcdash/AreaReport/" + areaType + "/" + state_obj.current_area + "/" + gender;
            break;
    }

    return path
};

var getPage = function(){
    window.location.href = sourcePath();
};
