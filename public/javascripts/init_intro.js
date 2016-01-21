var controller;



window.onload = function() {

    controller = new Controller(data_obj, config_obj, state_obj);

    controller.state.current_area = "E38000137";

    introMap = new IntroMap("Alcohol-specific mortality", "Persons", "#introMapItem", "w0");
    introDensity = new IntroDensity("Mortality from chronic liver disease", "Persons", "#introDensityItem", "w1");





/*
    var config = config_obj;
    var state = state_obj


    var indicator;
    var period;

    var areaType = state.areaType;
    var gender = state.genderArr[0];



    //----------------------------------------
    period = config.lastPeriod;
    indicator = "9.01 - Admission episodes for alcohol-related conditions (Broad)";

    //find the first available period
    while(controller.filterDataPeriod(areaType, gender, indicator, period).length == 0 && period >= config.firstPeriod){
        period -= 1
    }

    var admission_period = period;

    var total_admissions = controller
        .filterDataPeriod(areaType, gender, indicator, period)
        .reduce(function(a, b){return a + b[config.source.count]}, 0);


    //----------------------------------------
    period = config.lastPeriod;
    indicator = "2.01 - Alcohol-specific mortality";

    //find the first available period
    while(controller.filterDataPeriod(areaType, gender, indicator, period).length == 0 && period >= config.firstPeriod){
        period -= 1
    }

    var mortality_period = period;

    var total_mortality = controller
        .filterDataPeriod(areaType, gender, indicator, period)
        .reduce(function(a, b){return a + b[config.source.count]}, 0)

    console.log(total_admissions + " " + total_mortality)
*/












};