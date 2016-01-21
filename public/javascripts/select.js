
var buildPath = function(){

    var inArr, outArtt, path;

    var reportType = $('input[name=selectName]:checked', '#reportForm').val();

    if(reportType == "IndicatorReport"){

        inArr = ["areaTypeSelect", "indicatorSelect","genderSelect", "areaSelect"];
        outArr =[];

        for(var i in inArr){
            var e = document.getElementById(inArr[i]);
            outArr[i] = e.options[e.selectedIndex].value;
        }
        path = window.location.protocol + "//" + window.location.host + "/IndicatorReport/" + outArr[0] + "/" + outArr[1] + "/" + outArr[2]  + "/" + outArr[3];


    }


    if(reportType == "OverviewReport"){

        inArr = ["areaTypeSelect", "areaSelect", "genderSelect"];
        outArr = [];
        for (var i in inArr) {
            var e = document.getElementById(inArr[i]);
            outArr[i] = e.options[e.selectedIndex].value;
        }
        path = window.location.protocol + "//" + window.location.host + "/OverviewReport/" + outArr[0] + "/" + outArr[1] + "/" + outArr[2];
    }


    if(reportType == "AreaReport"){

        inArr = ["areaTypeSelect", "areaSelect", "genderSelect"];
        outArr = [];
        for (var i in inArr) {
            var e = document.getElementById(inArr[i]);
            outArr[i] = e.options[e.selectedIndex].value;
        }
        path = window.location.protocol + "//" + window.location.host + "/AreaReport/" + outArr[0] + "/" + outArr[1] + "/" + outArr[2];
    }

    return path



};



var getPage = function(){

    window.location.href = buildPath();

};



var reportTypeChange = function(){


    var reportType = $('input[name=selectName]:checked', '#reportForm').val();
    if(reportType == undefined){

        $('input[value=' + state_obj.reportType + ']', '#reportForm').prop('checked', true)
            .siblings('.btn-radio').addClass('active')
            .siblings('.img-radio').css('opacity','1');

    }
    reportType = $('input[name=selectName]:checked', '#reportForm').val();


    if(reportType == "AreaReport" || reportType == "OverviewReport" ) {



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




window.onload = function() {

    //update twice once to populate once to set current values

    reportTypeChange();
    areaTypeChange();

    //document.getElementById("reportTypeSelect").value = state_obj.reportType;
    document.getElementById("genderSelect").value = state_obj.gender;
    document.getElementById("areaTypeSelect").value = state_obj.areaType;
    document.getElementById("areaSelect").value = state_obj.current_area;
    document.getElementById("indicatorSelect").value = state_obj.indicator;

    reportTypeChange();
    areaTypeChange();

    //document.getElementById("reportTypeSelect").value = state_obj.reportType;
    document.getElementById("genderSelect").value = state_obj.gender;
    document.getElementById("areaTypeSelect").value = state_obj.areaType;
    document.getElementById("areaSelect").value = state_obj.current_area;
    document.getElementById("indicatorSelect").value = state_obj.indicator;


};

$(function () {
    $('.btn-radio, img').click(function(e) {
        $('.btn-radio').not(this).removeClass('active')
            .siblings('input').prop('checked',false)
            .siblings('.img-radio').css('opacity','0.5');
        $(this).parent().children('.btn-radio').addClass('active')
            .siblings('input').prop('checked',true)
            .siblings('.img-radio').css('opacity','1');
        reportTypeChange();
    });

});