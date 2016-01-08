


var controller;



window.onload = function() {

    var indicator = state_obj.indicatorArr[0]; //there should only be one for indicator report

    var gender = state_obj.genderArr[0]; //there should only be one gender for indicator report


    controller = new Controller(data_obj, config_obj, state_obj);


    indicatorHeader = new IndicatorHeader(indicator, gender, "#headerItem", "w0");
    densityGraph = new DensityGraph(indicator, gender, "#densitygraphItem", "w1");
    wessexMap = new WessexMap(indicator, gender, "#wessexmapItem", "w2");
    areaFacts = new AreaFacts(indicator, gender, "#areafactsItem", "w3");
    barGraph = new BarGraph(indicator, gender, "#bargraphItem", "w4");
    multilineGraph = new MultiLineGraph(indicator, gender, "#multilinegraphItem", "w5");




};


