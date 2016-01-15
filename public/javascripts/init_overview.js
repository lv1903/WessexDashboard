var controller;

window.onload = function() {

    var gender = state_obj.genderArr[0]; //there should only be one gender for indicator report

    controller = new Controller(data_obj, config_obj, state_obj);


    overviewWidget = new OverviewWidget(state_obj.indicatorArr, state_obj.genderArr[0], "#wi0Item", "wi0" );


};
