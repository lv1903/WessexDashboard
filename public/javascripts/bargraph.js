BarGraph = function(indicator, gender, container, widgetId){


    var self = this
    this.config = controller.config;

    this.widgetId = widgetId;
    this.indicator = indicator;
    this.indicatorMapped = controller.config.indicatorMapping[indicator];
    this.gender = gender;
    this.container = container;

    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped
    var current_period = controller.state.current_period;


    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    this.data_period.sort(this._sort_y("alpha"));

    this.cs = controller.config.colorScheme;
    this._init();

};

BarGraph.prototype._init = function(){

    var state = controller.state;

    var areaType = state.areaType;
    var indicator = state.indicator;
    var genderType = state.genderType;

    //this.data_period.sort(this._sort_y("alpha"));

    this._draw_all();

    this._bindEvents();

};

BarGraph.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();
    this._set_scales();
    this._draw_bars();
    this._draw_header();

};


BarGraph.prototype.validate_NaN_to_0 = function(val){
    if(isNaN(val)) return 0; else return Number(val);
};


BarGraph.prototype._sort_y = function(sort_class) {
    var self = this;

    validate_NaN_to_0 = this.validate_NaN_to_0
    if(sort_class == "alpha"){
        return function (a, b) {return d3.ascending(a[self.config.source.name], b[self.config.source.name]);}
    }
    if(sort_class == "numeric"){
        return function (a, b) {return self.validate_NaN_to_0(b[self.config.source.value]) - self.validate_NaN_to_0(a[self.config.source.value]);}
    }
};

BarGraph.prototype._build_graph = function(){

    validate_NaN_to_0 = this.validate_NaN_to_0;


    var config = this.config;

    config.full_width = 300;
    config.full_height = 400;

    config.middle = config.full_width / 2;

    config.margin.middle = 2;
    this.topMargin = config.margin.top + 7;

    this.width =  config.middle - config.margin.left  - config.margin.middle;
    this.height = config.full_height - config.margin.bottom - config.margin.top;

    this._svg = d3.select(this.container)
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("class", "widget")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + config.full_width + " " + config.full_height )
        .classed("svg-content-responsive", true)

    var topMargin = config.margin.top + 7;

    this._chart_left = this._svg
        .append('g')
        .attr("transform", "translate(" + config.margin.left + "," + this.topMargin + ")");


    this._chart_right = this._svg
        .append('g')
        .attr("transform", "translate(" + (config.middle + config.margin.middle) + "," + this.topMargin + ")");


};


BarGraph.prototype._set_scales = function(){

    var self = this;
    var config = this.config;

    var state = controller.state;

    var areaType = state.areaType;
    var indicator = state.indicator;
    var genderType = state.genderType;

    this.x = d3.scale.linear().range([0, this.width]);


    //adjust height of bar graph for more lines
    var y0 = 0;
    var y1 = this.height;

    if(this.data_period.length > 7 && this.data_period.length <= 15){
        y1 += 21;
    }else if( this.data_period.length > 15){
        y1 += 42;
    }

    this.y = d3.scale.ordinal().rangeRoundBands([y0, y1], .14, .2);



    this.x.domain([0, d3.max(this.data_period, function (d) {return self.validate_NaN_to_0(d[config.source.value]);})]);
    this.y.domain( this.data_period.map(function (d) {return d[config.source.name];}));

};

//BarGraph.prototype._draw_axes = function(){
//
//    var state = controller.state;
//
//    this.xAxis_right = d3.svg.axis()
//        .scale(this.x)
//        .orient("bottom")
//        .tickFormat(d3.format("1g"))
//        .ticks(5)
//        .outerTickSize(0);
//
//
//
//    this._chart_right.append("g")
//        .attr("class", "x axis")
//        .attr("transform", "translate(0," + this.height + ")")
//        .call(this.xAxis_right);
//
//
//
//    this._chart_right.append("text")
//        .attr("class", "x-label")
//        .attr("text-anchor", "end")
//        .attr("x", this.width - 20)
//        .attr("y", this.height + 40)
//        .text(controller.config.indicatorLabels[state.indicator]);
//
//
//};

BarGraph.prototype._draw_bars = function(){

    var self = this;
    var config = self.config;
    var state = controller.state;

    var areaType = state.areaType;
    var indicator = state.indicator;
    var genderType = state.genderType;

    var data = this.data_period;


    this._background_bars_right = this._chart_right.selectAll(".background_bar")
        .data(data);

    this._background_bars_right.enter().append("rect")
        .attr("class", "background bar clickable")
        .attr("x", 0)
        .attr("y", function (d, i) {return self.y(d[config.source.name])})
        .attr("width", self.width)
        .attr("height", function (d, i) {return self.y.rangeBand()})
        .style("fill", "white") //config file???
        .style("stroke-width", "0")
        .on("click", self._bar_click.bind(this));


    this._bars = this._chart_right.selectAll(".foreground bar")
        .data(data);

    this._bars.enter().append("rect")
        .attr("class", "foreground bar clickable")
        .attr("x", 0)
        .attr("y", function (d, i) {return self.y(d[config.source.name])})

        .attr("height", function (d, i) {return self.y.rangeBand()})
        .style("stroke-width", "0")
        .style("fill", function(d){ return self._select_color(d)})
        .on("click", self._bar_click.bind(this));

    //check if data is available and add change graph
    if(this.data_period.length == 0) {
        this._bars.attr("width", 0)
    } else {
        this._bars.attr("width", function (d, i) {return self.x(self.validate_NaN_to_0(d[config.source.value]))})
    }


    this._background_bars_left = this._chart_left.selectAll(".background_bar")
        .data(data);

    this._background_bars_left.enter().append("rect")
        .attr("class", "background_bar clickable" )
        .attr("x", 0)
        .attr("y", function (d, i) {return self.y(d[config.source.name])})
        .attr("width", self.width)
        .attr("height", function (d, i) {return self.y.rangeBand()})
        .style("stroke-width", "0")
        .style("fill", function(d){ return self._select_color(d)})
        .on("click", self._bar_click.bind(this));


    this._label = this._chart_left.selectAll(".name text")
        .data(data);


    this._label.enter().append("text")
        .attr("class", "name text clickable")
        .attr("x", "0.5em")
        .attr("y", function (d, i) {return (self.y(d[config.source.name]) + self.y(d[config.source.name]) + self.y.rangeBand()) / 2})
        .attr("dy", "0.4em")
        .text(function(d, i){return controller._get_area_name(d[config.source.id])})
        .style("font-size", "0.8em")
        .style("font-weight", "bold")
        .style("fill", self.cs.dark_text_color)
        //.style("fill", "white")
        .on("click", self._bar_click.bind(this));

    //check if data is available and add change graph
    if(this.data_period.length == 0) {
        this._label.text("NA")
    } else {
        this._label.text(function(d, i){return controller._get_area_short_name(d[config.source.id])})
    }

    var format = d3.format("1g")

    this._label_value = this._chart_left.selectAll(".value text")
        .data(data);

    this._label_value.enter().append("text")
        .attr("class", "name text clickable")
        .attr("x", self.width - 7)
        .attr("y", function (d, i) {return (self.y(d[config.source.name]) + self.y(d[config.source.name]) + self.y.rangeBand()) / 2})
        .attr("dy", "0.4em")
        .text(function(d, i){return d[config.source.value].toFixed(0)})
        .style("text-anchor", "end")
        .style("font-size", "0.8em")
        .style("font-weight", "bold")
        .style("fill", self.cs.dark_text_color)
        //.style("fill", "white")
        .on("click", self._bar_click.bind(this));


};

BarGraph.prototype._draw_header = function(){

    var self = this;
    var config = controller.config;

    var state = controller.state;

    var str = controller.config.indicatorLabels[this.indicator]
    var str = str.charAt(0).toUpperCase() + str.slice(1);

    this._header  = this._chart_left.append("text")
        .attr("x", "0em")
        .attr("y", - this.topMargin + config.margin.top )//compensate for additional top margin
        .attr("dy", "0em")
        .attr("text-anchor", "left")
        .style("font-size", "1.5em")
        .style("fill", "white")
        .text(str);


};


BarGraph.prototype._add_help_button = function(){

    var config = this.config;
    var self = this;

    var r = 10;
    var margin = 5;
    var x =  config.full_width - r - margin;
    var y = r + margin;

    this.help_circle = this._svg
        .append("circle")
        .attr("class", "clickable")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r)
        .style("fill", "white")
        .on("click", self._draw_help.bind(this));


    this._help_text = this._svg
        .append('text')
        .attr("class", "clickable")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", margin)
        .attr("text-anchor", "middle")
        .attr('font-family', 'FontAwesome')
        .style("fill", self.cs.background_color)
        .text('\uf128')
        .on("click", self._draw_help.bind(this));


};

BarGraph.prototype._add_return_to_graph_button = function(){

    var config = this.config;
    var self = this;

    var r = 10;
    var margin = 5;
    var x =  config.full_width - r - margin;
    var y = r + margin;

    this.help_circle = this._svg
        .append("circle")
        .attr("class", "clickable")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r)
        .style("fill", "white")
        .on("click", self._redraw.bind(this));



    this._help_text = this._svg
        .append('text')
        .attr("class", "clickable")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", margin)
        .attr("text-anchor", "middle")
        .attr('font-family', 'FontAwesome')
        .style("fill", self.cs.background_color)
        .text('\uf112')
        .on("click", self._redraw.bind(this));

};

BarGraph.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._draw_help_text();
    this._add_return_to_graph_button();

};

BarGraph.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

BarGraph.prototype._draw_help_text = function(){
    //todo
};





BarGraph.prototype._bindEvents = function(){

    ee.addListener('period_change', this._period_change_listener.bind(this));
    ee.addListener('area_change', this._area_change_listener.bind(this));
    ee.addListener('secondary_area_change', this._secondary_area_change_listner.bind(this))

};


/*----------------transitions------------------*/

BarGraph.prototype._area_change_listener = function() {

    var self = this;
    var config = this.config;
    var state = controller.state;

    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped
    var current_period = controller.state.current_period;
    var gender = this.gender


    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    this.data_period.sort(this._sort_y("alpha"));



    self._bars
        .data(this.data_period)
        .transition()
        .duration(500)
        .style("fill", function(d){ return self._select_color(d)});

    self._background_bars_left
        .data(this.data_period)
        .transition()
        .duration(500)
        .style("fill", function(d){ return self._select_color(d)});



};

BarGraph.prototype._secondary_area_change_listner = function(){
    this._area_change_listener()
}

BarGraph.prototype._period_change_listener = function() {

    var self = this;
    var config = this.config;
    var state = controller.state;

    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped
    var current_period = controller.state.current_period;
    var gender = this.gender


    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    this.data_period.sort(this._sort_y("alpha"));

    if(this.data_period.length == 0) {

        self._bars
            .transition()
            .duration(500)
            .attr("width", 0);

        self._label_value
            .transition()
            .duration(500)
            .text("NA")


    } else {

        //this.data_period.sort(self._sort_y("alpha"));
        self.x.domain([0, d3.max(this.data_period, function (d) {return self.validate_NaN_to_0(d[config.source.value]);})]);


        //console.log(controller.data_period[0].Value)

        self._bars
            .data(this.data_period)
            .transition()
            .duration(500)
            .attr("width", function (d, i) {if(i == 0){console.log(self.x(self.validate_NaN_to_0(d[config.source.value])))}; return self.x(self.validate_NaN_to_0(d[config.source.value]))});

        //console.log(self._bars[0][0])

        self._label_value
            .data(this.data_period)
            .transition()
            .duration(500)
            .text(function(d, i){return d[config.source.value].toFixed(0)});



    }

    /*var self = this;
    var config = this.config;
    var state = controller.state;

    //check if data is available and add change graph
    if(controller.data_period.length == 0) {

        self._bars
            .data(controller.data_period)
            .transition()
            .duration(750)
            //.style("fill", "red")
            .attr("width", 0);

        self.bars_label_value
            .data(controller.data_period)
            .transition()
            .duration(750)
            .text("NA")

    } else {

        //self.data_period = controller.data_period;
        controller.data_period.sort(self._sort_y("alpha"));
        self.x.domain([0, d3.max(controller.data_period, function (d) {return self.validate_NaN_to_0(d[config.source.value]);})]);

        self._label_value
            .data(controller.data_period)
            .transition()
            .duration(50)
            .text(function(d, i){return d[config.source.value].toFixed(0)})

        self._bars
            .data(controller.data_period)
            .transition()
            .delay(1000)
            .duration(750)
            //.style("fill", "green")
            .attr("width", function (d, i) {return self.x(self.validate_NaN_to_0(d[config.source.value]))})


    }
*/
};





/*---------------functions---------------------*/



BarGraph.prototype._select_color = function(d){

    var config = this.config;
    var state = controller.state;
    var self = this;

    var id = d[config.source.id];

    if(id == state.current_area){ //always highlight
        return self.cs.highlight_color
    }

    var index = state.current_secondary_areas.indexOf(id); //get color
    if(index == -1){
        return self.cs.main_color
    } else {
        //repeat colors
        while(index >= state.secondary_areas_colors.length){
            index -= state.secondary_areas_colors.length;
        }
        return state.secondary_areas_colors[index]
    }


};

BarGraph.prototype._bar_click = function(d){

    var config = this.config;
    controller._area_change(d[config.source.id]);

};





