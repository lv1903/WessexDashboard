

var controller;



window.onload = function() {



    var gender = state_obj.genderArr[0]; //there should only be one gender for indicator report

    controller = new Controller(data_obj, config_obj, state_obj);

    var widget_obj = {};

    widget_obj["wi0"] = new AreaHeader(state_obj.indicatorArray, gender, "#wi0Item", "wi0");

    for(var i in state_obj.indicatorArr){

        var indicator = state_obj.indicatorArr[i];
        var index = Number(i) + 1
        var widgetId = "wi" + index;

        widget_obj[widgetId] = new IndicatorWidget(indicator, gender, "#" + widgetId + "Item", widgetId );
    }

};









