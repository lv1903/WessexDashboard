
var ee = new EventEmitter();

var Controller = function(data_obj, config, state_obj){

    //console.log(state_obj)

    var self = this;

    this.data_obj = data_obj;

    this.config = config;

    this.state = state_obj;

    this.state.current_period = config.defaultPeriod;

    var areaType = this.state.areaType;
    var indicatorArr = this.state.indicatorArr;
    var genderArr = this.state.genderArr;

    if(this.state.current_area == null) {

        //pick a random area
        var temp_arr = data_obj.data_arr.filter(function (obj) {
            if (obj[config.source.areaType] == self.state.areaType) {
                return obj
            }
        });
        temp_arr = this.getUniqueArray(config.source.id, temp_arr);
        var randomIndex = Math.floor(Math.random() * temp_arr.length);
        this.state.current_area = temp_arr[randomIndex];
    }


    //set inital zoom level
    this.zoom_level = 1;


    //set the color scheme
    if(this.state.color == false){
        this.config.colorScheme = this.config.greyscaleScheme
    }

    this.state.current_secondary_areas = [];
    this.state.secondary_areas_colors = this.config.colorScheme.secondary_colors





};


Controller.prototype.value_format = function (d) {
    console.log(d)
    if (d == -1) { return "na" }
    if (d < 10) { return d3.format("0.2n")(d) }    
    else { return d3.format(",.0f")(d) }
};

Controller.prototype.value_round = function (d) {

    if (d < 10 && d >= 1) {
        return Math.round(d * 10) / 10
    }
    else if (d < 1) {
        return Math.round(d * 100) / 100
    }
    else {
        return Math.round(d)
    }

};


Controller.prototype._get_area_name = function(id){ //!!should be passed areaType too
    var self = this;
    return self.config.areaList[self.state.areaType].filter(function(d){
        if(d.id == id){return d}
    })[0].name;
};

Controller.prototype._get_area_short_name = function(id){
    var self = this;
    return self.config.areaList[self.state.areaType].filter(function(d){
        if(d.id == id){return d}
    })[0].short_name;
};

Controller.prototype._period_change = function(value){

    this.state.current_period = value;

    ee.emitEvent("period_change");

    ee.emitEvent("update_widget");
    ee.emitEvent("update");
};

Controller.prototype._area_change = function(id){

    this.state.current_area = id;
    this.state.current_area_name = this._get_area_name(id);


    ee.emitEvent("area_change");


    ee.emitEvent("update_widget");
    ee.emitEvent("update");
};

Controller.prototype._secondary_area_change = function(){

    ee.emitEvent("update_widget");
    ee.emitEvent("update");

};

Controller.prototype.validate_NaN_to_0 = function(val){
    if(isNaN(val)) return 0; else return Number(val);
};

Controller.prototype.median = function(values){
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
};

Controller.prototype._wrap = function(text, width, string){ //is this surplus now??
    text.each(function () {
        var text = d3.select(this),
            words = string.split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
};

Controller.prototype.getKeyByValue = function( obj, value ) {
    for( var prop in obj) {
        if( obj.hasOwnProperty( prop ) ) {
            if( obj[ prop ] === value )
                return prop;
        }
    }
};

Controller.prototype.getUniqueArray = function(key, arr){
    var uniqueArr = [];
    for(var i in arr){
        var prop = arr[i][key];
        if(uniqueArr.indexOf(prop) == -1){uniqueArr.push(prop)}
    }
    return uniqueArr
};

Controller.prototype.filterData = function(areaType, gender, indicator){

    var src = this.config.source;

    //console.log(areaType + " " +  gender + " " +  indicator)

    var data = this.data_obj.data_arr.filter(function(obj){
        if(
            obj[src.areaType] == areaType &&
            obj[src.indicator] == indicator &&
            obj[src.gender] == gender
        ){
            return obj
        }
    });

    data.sort(function(a, b) {return d3.ascending(a[src.name], b[src.name])});
    return data
};

Controller.prototype.filterDataPeriod = function(areaType, gender, indicator, period){


    var src = this.config.source;

    var data = this.data_obj.data_arr.filter(function(obj){
        if(
            obj[src.areaType] == areaType &&
            obj[src.indicator] == indicator &&
            obj[src.gender] == gender &&
            obj[src.period] == period
        ){
            return obj
        }
    });

    data.sort(function(a, b) {return d3.ascending(a[src.name], b[src.name])});
    return data
};

Controller.prototype.filterDataPeriodArea = function(areaType, gender, indicator, period, id){

    var src = this.config.source;

    var data = this.data_obj.data_arr.filter(function(obj){
        if(
            obj[src.areaType] == areaType &&
            obj[src.indicator] == indicator &&
            obj[src.gender] == gender &&
            obj[src.period] == period &&
            obj[src.id] == id
        ){
            return obj
        }
    });
    data.sort(function(a, b) {return d3.ascending(a[src.name], b[src.name])});
    return data
};

Controller.prototype.filterDataArea = function(areaType, gender, indicator, id){

    var src = this.config.source;

    var data = this.data_obj.data_arr.filter(function(obj){
        if(
            obj[src.areaType] == areaType &&
            obj[src.indicator] == indicator &&
            obj[src.gender] == gender &&
            obj[src.id] == id
        ){
            return obj
        }
    });


    data.sort(function(a, b) {return d3.ascending(a[src.name], b[src.name])});
    return data
};

Controller.prototype.getValueFromPeriodData = function(areaType,gender, indicatorMapped, current_period, id){

    var self = this;
    var config = self.config;

    //console.log(areaType + " " + gender + " " +  indicatorMapped + " " +  current_period + " " +  id)

    var obj = this.filterDataPeriodArea(
        areaType,
        gender,
        indicatorMapped,
        current_period,
        id
    );

    if(obj.length == 0){
        return  null
    }

    var value = obj[0][config.source.value];
    var count = obj[0][config.source.count];


    var orderedList = controller.data_obj.ordered_list_obj[areaType][gender][indicatorMapped][current_period];

    var index;
    if(config.indicatorHighIsBad){
        index = orderedList.indexOf(value) + 1;
    } else {
        index =  orderedList.length - orderedList.indexOf(value);
    }

    var percent = index / orderedList.length;

    return {"value": value, "count": count, "index": index, "indexMax": orderedList.length, "percent": percent}

};

Controller.prototype.getIndicatorMappedArr = function(inputArr, dic){
    var mappedArr = [];
    for(var i in inputArr){
        mappedArr.push(dic[inputArr[i]])
    }
    return mappedArr
};

Controller.prototype.select = function () {
    console.log(state_obj)
    var path = window.location.protocol + "//" + window.location.host + "/datavis/alcdash/select/"
        + encodeURIComponent(state_obj.reportType) + "/"
        + encodeURIComponent(state_obj.areaType) + "/"
        + encodeURIComponent(state_obj.indicatorArr[0]) + "/"
        + encodeURIComponent(state_obj.genderArr[0]) + "/"
        + encodeURIComponent(state_obj.current_area) + "/";
    console.log(path)
    window.location.href = path;
};

Controller.prototype.share = function () {
    console.log(state_obj)
    var path = window.location.protocol + "//" + window.location.host + "/datavis/alcdash/share/"
        + encodeURIComponent(state_obj.reportType) + "/"
        + encodeURIComponent(state_obj.areaType) + "/"
        + encodeURIComponent(state_obj.indicatorArr[0]) + "/"
        + encodeURIComponent(state_obj.genderArr[0]) + "/"
        + encodeURIComponent(state_obj.current_area) + "/";
    console.log(path)
    window.location.href = path;
};

Controller.prototype.pdf = function (color) {

    var path;

    var areaType = this.config.areaTypeArray.indexOf(state_obj.areaType);
    var indicator = this.config.indicatorArray.indexOf(state_obj.indicatorArr[0]);
    var gender = this.config.genderArray.indexOf(state_obj.genderArr[0]);


    switch (state_obj.reportType) {

        case "IndicatorReport":
            path = window.location.protocol + "//" + window.location.host + "/pdf/datavis/alcdash/IndicatorReport/" + areaType + "/" + indicator + "/" + gender  + "/" + state_obj.current_area;
            break;

        case "OverviewReport":
            path = window.location.protocol + "//" + window.location.host + "/pdf/datavis/alcdash/OverviewReport/" + areaType + "/" + state_obj.current_area + "/" + gender;
            break;

        case "AreaReport":
            path = window.location.protocol + "//" + window.location.host + "/pdf/datavis/alcdash/AreaReport/" + areaType + "/" + state_obj.current_area + "/" + gender;
            break;
    }

    window.location.href = path + "?color=" + color  ;

};

Controller.prototype.welcome = function(){
    window.location.href =   window.location.protocol + "//" + window.location.host + "/datavis/alcdash"
};

Controller.prototype.getSourcePath = function(anchor){

    if(anchor == null) {
        anchor = "";
    } else {
        anchor = "#" + anchor;
    }

    console.log(anchor)

    return  window.location.protocol + "//" + window.location.host + "/datavis/alcdash/source/"
        + encodeURIComponent(state_obj.reportType) + "/"
        + encodeURIComponent(state_obj.areaType) + "/"
        + encodeURIComponent(state_obj.indicatorArr[0]) + "/"
        + encodeURIComponent(state_obj.genderArr[0]) + "/"
        + encodeURIComponent(state_obj.current_area)
        + anchor;


};

Controller.prototype.source = function (anchor) {

    window.location.href = this.getSourcePath(anchor);
};

Controller.prototype.zoom = function(pct){

    if(pct == -1){ //reset
        pct = 1 / this.zoom_level;
        this.zoom_level = 1;
    } else {
        this.zoom_level = this.zoom_level * pct;
    }

    $(".widget").each(function(index){

        var ratio = $(this).width() / $(this).height();

        $(this).width(Math.round($(this).width() * pct));
        $(this).height(Math.round($(this).width() / ratio));
    })

};

Controller.prototype.setWidgetZoom = function(widgetId){

    var ratio = $(widgetId).width() / $(widgetId).height();

    $(widgetId).width(Math.round($(widgetId).width() * this.zoom_level));
    $(widgetId).height(Math.round($(widgetId).width() / ratio));


};

Controller.prototype.play = function(self){

    if(self.state.play){return} //do nothing if already playing

    //set button opacity
    d3.selectAll(".play_button").style("opacity", 0.5);
    d3.selectAll(".stop_button").style("opacity", 1);

    self.state.play = true;

    var period = self.state.current_period;

    if (period < this.config.lastPeriod) { //get next period
        period += 1
    } else {
        period = self.config.firstPeriod;
    }

    self._period_change(period); //do quick update

    self.play_next(period) //start cycle



    self.play_next(self.state.current_period);

};

Controller.prototype.play_next = function(period){
    var self = this;
    if(self.state.play) {
        if (period <= this.config.lastPeriod) {
            self._period_change(period);
            setTimeout(function () {
                self.play_next(period + 1);
            }, 2000);
        } else {
            self.play_next(self.config.firstPeriod);
        }
    }
};

Controller.prototype.stop = function(self){

    //set button opacity
    d3.selectAll(".play_button").style("opacity", 1);
    d3.selectAll(".stop_button").style("opacity", 0.5);

    self.state.play = false;
};