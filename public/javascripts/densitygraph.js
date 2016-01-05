DensityGraph = function(indicator, gender, container, widgetId){

    var self = this

    this.widgetId = widgetId;
    this.indicator = indicator;
    this.indicatorMapped = controller.config.indicatorMapping[indicator];
    this.gender = gender;
    this.container = container;

    var state = controller.state


    this.config = controller.config;

    this.data = controller.filterData(controller.state.areaType, this.gender, this.indicatorMapped);
    this.data_period = controller.filterDataPeriod(controller.state.areaType, this.gender, this.indicatorMapped, controller.state.current_period);

    this.averages = this._getAverages();

    this.cs = this.config.colorScheme;
    
    this._init();

};



DensityGraph.prototype._init = function(){

    var state = controller.state;

    var areaType = state.areaType;
    var indicator = state.indicator;
    var gender = state.gender;

    //this.dataNest = this._nestData(controller[areaType][indicator][gender].data, this.config.id_field);

    //this.density_data = controller.density_data;
    //this.densityDataNest = this._nestData(controller[areaType][indicator][gender].density_data, this.config.x_field);

    this._draw_all();

    this._bindEvents();

};

DensityGraph.prototype._draw_all= function(){

    this._build_graph();
    this._add_help_button();
    this._set_scales();
    this._draw_axes();
    this._draw_density_line();
    this._draw_averages();
    this._draw_header();

}


DensityGraph.prototype._build_graph = function(){

    validate_NaN_to_0 = this.validate_NaN_to_0;


    var config = this.config;

    config.full_width = 300;
    config.full_height = 400;

    var additional_margin_bottom = 14;

    this.width =  config.full_width - config.margin.left  - config.margin.right;
    this.height = config.full_height - config.margin.bottom - config.margin.top - additional_margin_bottom;

    this._svg = d3.select(this.container)
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("class", "widget")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + config.full_width + " " + config.full_height )
        .classed("svg-content-responsive", true)

    this._chart = this._svg
        .append('g')
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");




};

DensityGraph.prototype._set_scales = function(){

    var self = this;
    var config = this.config;
    var state = controller.state;

    var areaType = state.areaType;
    var indicator = this.indicator;
    var indicatorMapped = this.indicatorMapped;
    var gender = this.gender;

    //get max value for all years

    var max_density = 0;
    var max_length = 0;
    var obj = controller.data_obj.density_obj[areaType][gender][indicatorMapped];
    for(var year in obj){
        var len = obj[year].length;
        var density = d3.max(obj[year]);
        if(len > max_length){max_length = len}
        if(density > max_density){max_density = density}
    }

    this.x = d3.scale.linear()
        .range([0, this.width])
        .domain([0, max_length]);

    this.y = d3.scale.linear()
        .range([this.height, this.height / 2])
        .domain([0, max_density]);

};



DensityGraph.prototype._draw_axes = function(){

    var config = this.config;
    var self = this;
    var state = controller.state;

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom")
        .tickFormat(d3.format("1g"))
        .outerTickSize(0)
        .ticks(2);



    this._chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis);

    this._chart.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", this.width - 20)
        .attr("y", this.height + 40)
        .text(controller.config.indicatorLabels[this.indicator]);

};


DensityGraph.prototype._draw_density_line = function(){

    var self = this;
    var config = this.config;

    var state = controller.state;

    var areaType = state.areaType;
    var indicator = this.indicator;
    var indicatorMapped = this.indicatorMapped;
    var gender = this.gender;
    var year = state.current_period;


    var densityArray = controller.data_obj.density_obj[areaType][gender][indicatorMapped][year]

    this.fArea = d3.svg.area()
        .x(function(d, i) { return self.x(i); })
        .y0(function(d) { return self.y(0) })
        .y1(function(d) { return self.y(d); })
        .interpolate("monotone");

    this._dist_area = this._chart
        .datum(densityArray)
        .append("path")
        .attr("class", "densityArea")
        .attr("d", this.fArea)
        .style("fill", self.cs.main_color);

};


DensityGraph.prototype._draw_averages = function() {

    var self = this;

    this.averages = this._getAverages();

    var y_arr = [this.height / 2 - 25, this.height / 2 - 110, this.height / 2 - 50];
    var text_anchor_arr = ["end", "start", "start"]

    this.averages.sort(function (a, b) {return a.average - b.average;});

    for (i in self.averages) {

        var name = self.averages[i].name.trim();

        if(name == "England"){
            id = "England"
        } else if(name == "Wessex"){
            id = "Wessex"
        }else {
            id = "Alt"
        }

        var median = self.averages[i].average;

        this._chart.append("line")
            .attr("class", "average_line")
            .attr("id", "average_line_" + id)
            .attr("x1", self.x(median))
            .attr("x2", self.x(median))
            .attr("y1", self.height)
            .attr("y2", function(){return y_arr[i]})
            //.attr("y2", self.height)
            .style("stroke-width", 2)
            .style("stroke", "white")
            .style("fill", "none");


        this._chart.append("text")
            .attr("class", "average_text")
            .attr("id", "average_text_" + id)
            .attr("text-anchor", function () {
                return text_anchor_arr[i]
            })
            .attr("x", function () {
                var text_anchor = text_anchor_arr[i];
                if (text_anchor == "end") {
                    return self.x(median) - 5
                } else {
                    return self.x(median) + 5
                }
            })
            .attr("y", function () {
                return y_arr[i]
            })
            .attr("dy", "0.8em")
            .style("fill", function(){if(id == "Alt"){
                    return self.cs.highlight_color
                } else {
                    return "white"
                }
            })
            //.style("fill", self.cs.background_color)
            .text(name);


        this._chart.append("text")
            .attr("class", "average_value")
            .attr("id", "average_value_" + id)
            .attr("text-anchor", function () {
                return text_anchor_arr[i]
            })
            .attr("x", function () {
                var text_anchor = text_anchor_arr[i];
                if (text_anchor == "end") {
                    return self.x(median) - 10
                } else {
                    return self.x(median) + 10
                }
            })
            .attr("y", function () {
                return y_arr[i]
            })
            .attr("dy", "1.8em")
            .style("fill", function(){if(id == "Alt"){
                    return self.cs.highlight_color
                } else {
                    return "white"
                }
            })
            //.style("fill", self.cs.background_color)
            .style("font-size", "1.5em")
            .text(Math.round(median));


    }

};

DensityGraph.prototype._move_averages= function(){

    var self = this;

    var y_arr = [this.height / 2 - 25 , this.height / 2 - 110, this.height / 2 - 50];
    var text_anchor_arr = ["end", "start", "start"];

    this.averages.sort(function (a, b) {return a.average - b.average;});

    for (i in self.averages) {

        var name = self.averages[i].name.trim();

        if(name == "England"){
            id = "England"
        } else if(name == "Wessex"){
            id = "Wessex"
        }else {
            id = "Alt"
        }

        var median = self.averages[i].average
            ;

        d3.select("#average_line_" + id)
            .transition()
            .duration(500)
            .attr("x1", self.x(median))
            .attr("x2", self.x(median))
            .attr("y1", self.height)
            .attr("y2", function () {
                return y_arr[i]
            })



        d3.select("#average_text_" + id)
            .transition()
            .duration(500)
            .attr("text-anchor", function () {
                return text_anchor_arr[i]
            })
            .attr("x", function () {
                var text_anchor = text_anchor_arr[i];
                if (text_anchor == "end") {
                    return self.x(median) - 5
                } else {
                    return self.x(median) + 5
                }
            })
            .attr("y", function () {
                return y_arr[i]
            })
            //.style("fill", self.cs.background_color)
            .text(name);


        d3.select("#average_value_" + id)
            .transition()
            .duration(500)
            .attr("text-anchor", function () {
                return text_anchor_arr[i]
            })
            .attr("x", function () {
                var text_anchor = text_anchor_arr[i];
                if (text_anchor == "end") {
                    return self.x(median) - 10
                } else {
                    return self.x(median) + 10
                }
            })
            .attr("y", function () {
                return y_arr[i]
            })
            .text(Math.round(median));
    }

}


DensityGraph.prototype._draw_header = function(){

    this._header  = this._chart.append("text")
        .attr("x", "0em")
        .attr("y", "0em" )
        .attr("dy", "0em")
        .attr("text-anchor", "left")
        .style("font-size", "1.5em")
        .style("fill", "white")
        .text("Distribution in England");

    this._no_data  = this._chart.append("text")
        .attr("class", "noDataText")
        .attr("x", "0em")
        .attr("y", 30 )
        .attr("dy", "0em")
        .attr("text-anchor", "left")
        .style("font-size", "1.5em")
        .style("fill", "white")
        .text("");

};


DensityGraph.prototype._add_help_button = function(){

    var config = this.config;
    var self = this;

    var r = 10
    var margin = 5;
    var x =  config.full_width - r - margin;
    var y = r + margin

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

DensityGraph.prototype._add_return_to_graph_button = function(){

    var config = this.config;
    var self = this;

    var r = 10
    var margin = 5;
    var x =  config.full_width - r - margin;
    var y = r + margin

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

DensityGraph.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._draw_help_text();
    this._add_return_to_graph_button();

};

DensityGraph.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

DensityGraph.prototype._draw_help_text = function(){
    //todo
};







DensityGraph.prototype._bindEvents = function(){

    ee.addListener('period_change', this._period_change_listener.bind(this));
    ee.addListener('area_change', this._area_change_listener.bind(this));

};


/*------------------transitions---------------------*/

DensityGraph.prototype._area_change_listener = function() {

    //this._remove_averages();
    this.averages = this._getAverages();
    this._move_averages();


};


DensityGraph.prototype._period_change_listener = function() {

    var state = controller.state;
    var self = this;

    var areaType = state.areaType;
    var indicatorMapped = this.indicatorMapped
    var indicator = this.indicator;
    var gender = this.gender;
    var current_period = state.current_period;

    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);


    //check if data is available and add no data text
    if(this.data_period.length == 0){
        self._no_data
            .transition()
            .duration(10)
            .text("Sorry No Data Available")

    } else {
        self._no_data
            .transition()
            .duration(10)
            .text("")
    }



    //check if data is available and add change graph
    if(this.data_period.length == 0) {

        var fNoData = d3.svg.area()
            .x(function(d) { return self.width /2 })
            .y0(function(d) { return self.height })
            .y1(function(d) { return self.height })

        this._dist_area
            .transition()
            .duration(500)
            .style("opacity", 0)


        this._dist_area
            .transition()
            .delay(500)
            .duration(0)
            .attr("d", fNoData)
            .delay(500)
            .duration(0)
            .style("opacity", 1)


        for (i in self.averages) {

            var name = self.averages[i].name;

            if(name == "England"){
                id = "England"
            } else if(name == "Wessex"){
                id = "Wessex"
            }else {
                id = "Alt"
            }

            d3.select("#average_line_" + id)
                .transition()
                .duration(500)
                .attr("y1", self.height)
                .attr("y2", self.height)

            d3.select("#average_text_" + id)
                .transition()
                .duration(1000)
                .text("")


            d3.select("#average_value_" + id)
                .transition()
                .duration(1000)
                .text("");

        }

    } else {



        var densityArray = controller.data_obj.density_obj[areaType][gender][indicatorMapped][current_period]
        this._dist_area
            .datum(densityArray)
            .transition()
            .duration(750)
            .attr("d", this.fArea);

        this.averages = this._getAverages();
        this._move_averages();






    }




};

/*----------functions--------------------*/


DensityGraph.prototype.validate_NaN_to_0 = function(val){
    if(isNaN(val)) return 0; else return Number(val);
};

DensityGraph.prototype._list = function(data, key){
    var arr =[];
    for(var i in data) {
        var prop = data[i][key];
        if(arr.indexOf(prop) == -1){
            arr.push(prop)
        }
    }
    return arr;
};

//DensityGraph.prototype._nestData = function(data, nestField){
//    var self = this;
//    return d3.nest()
//        .key(function(d){return d[nestField]})
//        .entries(data);
//};




DensityGraph.prototype._select_color = function(id){
    var self = this;
    var state = controller.state;
    if(id == state.current_area){ //colors in config file;
        return self.cs.highlight_color
    } else {
        return self.cs.main_color_offset
    }
};

DensityGraph.prototype._select_line_stroke_width = function(id){
    var state = controller.state;
    if(id == state.current_area){ //colors in config file;
        return 4
    } else {
        return 2
    }
};

DensityGraph.prototype._select_dot_stroke_width = function(id){
    var state = controller.state;
    if(id == state.current_area){ //colors in config file;
        return 2
    } else {
        return 1
    }
};

DensityGraph.prototype._select_dot_radius = function(id){
    var state = controller.state;
    if(id == state.current_area){ //colors in config file;
        return 5
    } else {
        return 4
    }
};

DensityGraph.prototype._getAverages = function(){

    var config = this.config;
    var state = controller.state;

    var areaType = state.areaType;
    var indicatorMapped = this.indicatorMapped;
    var indicator = this.indicator;
    var gender = this.gender;
    var current_period = controller.state.current_period;
    var id = state.current_area;
    var name = controller._get_area_short_name(id);

    var objAverages = [];

    var obj;
    var average;

    //-----------------
    average =  controller.median(controller.data_obj.ordered_list_obj[areaType][gender][indicatorMapped][current_period])
    obj = {
        "name": "England",
        "average": average
    };
    objAverages.push(obj);
    //-----------------

    //-----------------
    average = controller.median(
        controller.filterDataPeriod(
            areaType,
            gender,
            indicatorMapped,
            current_period
        ).map(function(obj){
                return obj[config.source.value]
        })
    );
    obj = {
        "name": "Wessex",
        "average": average
    };
    objAverages.push(obj);
    //-----------------

    //-----------------
    average = controller.filterDataPeriodArea(
        areaType,
        gender,
        indicatorMapped,
        current_period,
        id
    )[0][config.source.value];

    var id = state.current_area;
    var name = controller._get_area_short_name(id);
    obj = {"name": name,
        "average": average
    };
    objAverages.push(obj);
    //-----------------


    return objAverages
};


