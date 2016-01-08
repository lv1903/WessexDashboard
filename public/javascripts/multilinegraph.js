MultiLineGraph = function(indicator, gender, container, widgetId){

    var self = this;

    this.widgetId = widgetId;
    this.indicator = indicator;
    this.indicatorMapped = controller.config.indicatorMapping[indicator];
    this.gender = gender;
    this.container = container;

    this.cs = controller.config.colorScheme;

    self.select_all = true;//initally set all lines selected



    this._update_widget();
    this._init();


};


MultiLineGraph.prototype._init = function(){

    this._draw_all();
    this._bindEvents();

};

MultiLineGraph.prototype._bindEvents = function(){

    ee.addListener('update_widget', this._update_widget.bind(this));

};

MultiLineGraph.prototype._update_widget = function(){

    var gender = this.gender;
    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped;
    var current_period = controller.state.current_period;
    var current_area = controller.state.current_area;

    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    this.data_area = controller.filterDataArea(areaType, gender, indicatorMapped, current_area);
    this.val = controller.getValueFromPeriodData(areaType, gender, indicatorMapped, current_period, current_area);

};

MultiLineGraph.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();
    this._add_select_button();

    this._draw_header();
    this._draw_multiLineGraph();


};

MultiLineGraph.prototype._build_graph = function() {

    var config = controller.config;
    var self = this;

    this.full_width = 300;
    this.full_height = 400;


    this.width =  config.full_width - config.margin.left  - config.margin.right;
    this.height = config.full_height - config.margin.bottom - config.margin.top;

    this._svg = d3.select(this.container)
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("class", "widget")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + config.full_width + " " + config.full_height )
        .classed("svg-content-responsive", true);

    this._chart = this._svg
        .append('g')
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");


};

MultiLineGraph.prototype._draw_header = function(){

    var self = this;

    var label = controller.config.indicatorLabels[this.indicator];
    label = label.charAt(0).toUpperCase() + label.slice(1);

    this._header_text = component.text(self, {
        str: label,
        font_size: "1.5em",
        x: 0,
        y: 0,
        width: this.width,
        id: "header" + this.widgetId
    });

    this._header_text.render();

};


MultiLineGraph.prototype._draw_multiLineGraph = function(){

    var self = this;

    this._multi_line = component.multiLineGraph(self, {
        x: 0,
        y: 2 * 14,
        compHeight: 18 * 14,
        compWidth: self.width
    });

    this._multi_line.render();

    function update(){
        self._multi_line.update(self);
    }
    ee.addListener("update", update)

};


/*---------------*/

MultiLineGraph.prototype._add_help_button = function(){

    var self = this;
    var config = controller.config;

    var r = 10;
    var margin = 5;
    var x =  this.full_width - config.margin.left - r - margin;
    var y = r - config.margin.top + margin;
    var icon = "\uf128";

    this._help_button = component.circleButton( self, {
        r: r,
        margin: margin,
        x: x,
        y: y,
        icon: icon,
        clicked: self._draw_help
    });

    this._help_button.render();

};

MultiLineGraph.prototype._add_return_to_graph_button = function(){

    var self = this;
    var config = controller.config;

    var r = 10;
    var margin = 5;
    var x =  this.full_width - config.margin.left - r - margin;
    var y = r - config.margin.top + margin;
    var icon = "\uf112";

    this._return_button = component.circleButton( self, {
        r: r,
        margin: margin,
        x: x,
        y: y,
        icon: icon,
        clicked: self._redraw
    });

    this._return_button.render();

};

MultiLineGraph.prototype._add_select_button = function(){

    var self = this;
    var config = controller.config;

    var r = 10;
    var margin = 5;
    var x =  this.full_width - config.margin.left - 3 * r - 2 * margin;
    var y = r - config.margin.top + margin;
    var icon = "\uf142";

    this._select_button = component.circleButton( self, {
        r: r,
        margin: margin,
        x: x,
        y: y,
        icon: icon,
        clicked: self._draw_all_select
    });

    this._select_button.render();
};



MultiLineGraph.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._add_return_to_graph_button();
    this._draw_help_text();

};

MultiLineGraph.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

MultiLineGraph.prototype._draw_help_text = function(){
    //todo
};


/*------------------*/



MultiLineGraph.prototype._draw_all_select = function(){

    this._svg.remove();
    this._build_graph();
    this._add_return_to_graph_button();
    this._draw_select();


}

MultiLineGraph.prototype._draw_select = function(){

    var self = this;

    this._select_bar = component.selectBar(self, {
        x: 0,
        y: 7,
        compHeight: self.height,
        compWidth: self.width
    });

    this._select_bar.render();

    //function update(){
    //    self._multi_line.update(self);
    //}
    //ee.addListener("update", update)



}



/*---------------------------*/

/*


LineGraph = function(indicator, gender, container, widgetId){


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

    this.cs = controller.config.colorScheme;

    this.all_lines_selected = true;

    this._init();

};


LineGraph.prototype._init = function(){

    console.log("init line graph");

    var state = controller.state;

    this.dataNest = this._nestData(this.data, this.config.source.id);

    //this.density_data = controller[areaType][indicator][genderType].density_data;
    //this.densityDataNest = this._nestData(controller[areaType][indicator][genderType].density_data, this.config.x_field);

    this._draw_all();

    this._bindEvents();

};

LineGraph.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();
    this._add_select_button();
    this._set_scales();
    this._draw_axes();
    this._draw_lines();
    this._draw_points();
    this._draw_header();
    this._draw_time_vertical();
    
}


LineGraph.prototype._build_graph = function(){

    validate_NaN_to_0 = this.validate_NaN_to_0;


    var config = this.config;

    config.full_width = 300;
    config.full_height = 400;

    config.additional_margin_bottom = 14;

    this,topMargin = config.margin.top + 7;
    


    this.width =  config.full_width - config.margin.left  - config.margin.right;
    this.height = config.full_height - config.margin.bottom - config.margin.top - config.additional_margin_bottom;

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
        .attr("transform", "translate(" + config.margin.left + "," + topMargin + ")");


};


 LineGraph.prototype._set_scales = function(){

     var self = this;
     var config = this.config;
     var state = controller.state;

     var areaType = state.areaType;
     var indicator = state.indicator;
     var genderType = state.genderType;


     var max_y_value = d3.max(this.data.map(function(obj){return obj[config.source.value]}));
     var max_y_value_width = String(max_y_value.toFixed(0)).length * 10;


     //calcualate constant origin shift

     console.log(config.source.period)


     this._period_arr = controller.getUniqueArray(config.source.period, this.data);

     console.log(this._period_arr)

     var origin_shift_x = max_y_value_width;

     var tick_width_x = self.width / (this._period_arr.length - 1);

     this.x = d3.scale.linear()
         .range([0, this.width])
         .domain([-(origin_shift_x/tick_width_x), this._period_arr.length - 1]);


     this.y = d3.scale.linear()
         .range([0, this.height])
         .domain([ max_y_value * 1.25, 0]);

 };



 LineGraph.prototype._draw_axes = function(){

     var config = this.config;
     var self = this;
     var state = controller.state;

     var areaType = state.areaType;
     var indicator = state.indicator;
     var genderType = state.genderType;


     this.xAxisLine = d3.svg.axis()
         .scale(this.x)
         .orient("bottom")
         .outerTickSize(0)
         .tickFormat(function(d, i){
             if(d === parseInt(d, 10)){ //we can only map intergers to time periods otherwise return blank
                 return self._period_arr[d]
             } else {
                 return ""
             }})
         .ticks(Math.max(5, Math.ceil(self._period_arr.length/2))); //set max 5 ticks otherwise every other???


     this.yAxis = d3.svg.axis()
         .scale(this.y)
         .orient("left")
         .tickFormat(d3.format("1g"))
         .outerTickSize(0)
         .ticks(5);



     this._chart.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + this.height + ")")
         .call(this.xAxisLine);



     var max_y_value = d3.max(this.data.map(function(obj){return obj[config.source.value]}));
     var max_y_value_width = String(max_y_value.toFixed(0)).length * 10

     this._chart.append("g")
         .attr("class", "y axis")
         .attr("transform", "translate("  + max_y_value_width / 2 + ", 0)")
         .call(this.yAxis);

     this._chart.append("text")
         .attr("class", "x-label")
         .attr("text-anchor", "end")
         .attr("x", this.width - 20)
         .attr("y", this.height + 40)
         .text("Year");

};


LineGraph.prototype._draw_lines = function(){

    var config = this.config;
    var self = this;
    var state = controller.state;


    // Define the line
    var fLine = d3.svg.line()
        .defined(function(d) {return !isNaN(d[config.source.value]); })
        .x(function(d, i) {return self.x(i);})
        .y(function(d) {return self.y(d[config.source.value]);});
        //.interpolate("monotone");


    this.dataNest.forEach(function(d, i){

        var id = d.key

        var lines = self._chart.append("path")
            .attr("class", "line timeLine clickable")
            .attr("id", "line" + d.key + this.widgetId) // assign ID
            .attr("d", fLine(d.values))
            .style("stroke", function(){return self._select_color(d.key)})
            .style("stroke-width", function(){return self._select_line_stroke_width(d.key)})
            .style("fill", "none")
            .on("click", function() { self._line_click(self, d.key)});
    });

    d3.select("#line" + state.current_area).moveToFront();

};

LineGraph.prototype._draw_points = function(){
    var self = this;
    var config = this.config;
    var state = controller.state;

    this.dataNest.forEach(function(d, i){

        var dots = self._chart.selectAll(".timeDot")
            .data(d.values)
            .enter()
            .append("circle")
            .attr("class", "dots" + d.key + this.widgetId + " clickable")
            .attr("id", "timeDots" + d.key + this.widgetId)
            .attr("cx", function(e, i){return self.x(i)})
            .attr("cy", function(e){return self.y(e[config.source.value])})
            .style("stroke", self.cs.background_color)
            .attr("r", function(){return self._select_dot_radius(d.key)})
            .style("stroke-width", function(){return self._select_dot_stroke_width(d.key)})
            .style("fill", function(){return self._select_color(d.key)})
            .on("click", self._dot_click.bind(self));
    });

    d3.selectAll(".dots" + state.current_area).moveToFront();


};



LineGraph.prototype._draw_header = function(){

    var self = this;
    var config = controller.config;

    var state = controller.state;

    var str = controller.config.indicatorLabels[this.indicator]
    var str = str.charAt(0).toUpperCase() + str.slice(1);

    this._header  = this._chart.append("text")
        .attr("x", "0em")
        .attr("y", -5 )
        .attr("dy", "0em")
        .attr("text-anchor", "left")
        .style("font-size", "1.5em")
        .style("fill", "white")
        .text(str);

};

LineGraph.prototype._draw_time_vertical = function(){
    var self = this;
    var config = this.config;
    var state = controller.state;

    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped
    var current_period = controller.state.current_period;
    var gender = this.gender


    self._vertical_line = self._chart.append("line")
        .attr("class", "line verticalTimeLine")
        .style("stroke-width", 2)
        .style("stroke", "white")
        .style("fill", "none");


    //check if data is available and add change graph
    if(this.data_period.length == 0) {

        self._vertical_line
            .attr("y1", self.height / 2)
            .attr("y2", self.height /2)

    } else {

        self._vertical_line
            .attr("x1", self.x(self._period_arr.indexOf(state.current_period)))
            .attr("x2", self.x(self._period_arr.indexOf(state.current_period)))
            .attr("y1", self.height)
            .attr("y2", self.height * 0.1)

    }

    self._vertical_line.moveToBack();


};




LineGraph.prototype._add_help_button = function(){

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

LineGraph.prototype._add_select_button = function(){

    var config = this.config;
    var self = this;

    var r = 10;
    var margin = 5;
    var x =  config.full_width - 3 * r - 2 * margin;
    var y = r + margin;

    this.help_circle = this._svg
        .append("circle")
        .attr("class", "clickable")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", r)
        .style("fill", "white")
        .on("click", self._draw_select.bind(this));


    this._help_text = this._svg
        .append('text')
        .attr("class", "clickable")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", margin)
        .attr("text-anchor", "middle")
        .attr('font-family', 'FontAwesome')
        //.style("font-size", "0.8em")
        .style("fill", self.cs.background_color)
        //.text('\uf0ca')
        .text('\uf142')
        .on("click", self._draw_select.bind(this));


};

LineGraph.prototype._add_return_to_graph_button = function(){

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

LineGraph.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._draw_help_text();
    this._add_return_to_graph_button();

};

LineGraph.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

LineGraph.prototype._draw_help_text = function(){
    //todo
};


LineGraph.prototype._draw_select = function(){

    this._svg.remove();
    this._build_graph();
    this._set_select_scales();
    this._draw_select_bars();
    this._add_return_to_graph_button();

};

LineGraph.prototype._set_select_scales = function(){

    //this code should match bar graph scales
    //except do not need x scale

    var self = this;
    var config = this.config;
    var state = controller.state;

    var areaType = state.areaType;
    var indicator = state.indicator;
    var genderType = state.genderType;

    //console.log(controller.data_period.length)

    //this.x = d3.scale.linear().range([0, this.width]);


    //adjust height of bar graph for more lines
    var y0 = 0;
    var y1 = this.height + config.additional_margin_bottom;

    if(this.data_period.length > 7 && this.data_period.length <= 15){
        y1 += 21;
    }else if( this.data_period.length > 15){
        console.log("there")
        y1 += 42;
    }

    this.y = d3.scale.ordinal().rangeRoundBands([y0, y1], .14, .2);
    //this.x.domain([0, d3.max(controller.data_period, function (d) {return self.validate_NaN_to_0(d[config.value_field]);})]);
    this.y.domain( this.data_period.map(function (d) {return d[config.source.name];}));

};

LineGraph.prototype._draw_select_bars = function(){

    var self = this;
    var config = self.config;
    var state = controller.state;

    var areaType = state.areaType;
    var indicator = this.indicator;
    var gender = this.gender

    var data = this.data_period;

    this._select_all_bar = this._chart
        .append("rect")
        .attr("class", "background bar clickable")
        .attr("id", "select_all_bar")
        .attr("x", 0)
        .attr("y",function () {return - self.y.rangeBand() * 0.9})//0.9 reflects range bound margin 0.2
        .attr("width", self.width)
        .attr("height", function () {return self.y.rangeBand()})
        .style("fill", function(){return self._select_all_color()})
        .style("stroke-width", "0")
        .on("click", this._select_all_lines.bind(this));

    this._select_all_text = this._chart
        .append("text")
        .attr("x", "0.5em")
        .attr("y", function (d, i) {return -0.45 *  self.y.rangeBand()})//0.45 reflects range bound margin 0.2
        .attr("dy", "0.4em")
        .text("Select All")
        .style("font-size", "0.8em")
        .style("font-weight", "bold")
        .style("fill", self.cs.dark_text_color)
        .on("click", this._select_all_lines.bind(this));





    this._background_bars = this._chart.selectAll(".background_bar")
        .data(data);

    this._background_bars.enter().append("rect")
        .attr("class", "background bar clickable")
        .attr("x", 0)
        .attr("y", function (d, i) {return self.y(d[config.source.name])})
        .attr("width", self.width)
        .attr("height", function (d, i) {return self.y.rangeBand()})
        .style("fill", function(d){ return self._select_selection_color(d)})
        .style("stroke-width", "0")
        .on("click", self._select_line.bind(this));


    this._label = this._chart.selectAll(".name text")
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
        .on("click", self._select_line.bind(this));

};

//LineGraph.prototype._draw_select_graph = function(){
//
//
//}








LineGraph.prototype._bindEvents = function(){

    ee.addListener('period_change', this._period_change_listener.bind(this));
    ee.addListener('area_change', this._area_change_listener.bind(this));
    ee.addListener('secondary_area_change', this._secondary_area_change_listner.bind(this))

};


/!*------------------transitions---------------------*!/

LineGraph.prototype._area_change_listener = function() {

    var self = this;
    var config = this.config;
    var state = controller.state;

    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped
    var current_period = controller.state.current_period;
    var gender = this.gender


    d3.select("#line" + state.current_area + this.widgetId).moveToFront();
    d3.selectAll(".dots" + state.current_area + this.widgetId).moveToFront();


    this.dataNest.forEach(function(d, i){
        var lines = self._chart.select("#line" + d.key + this.widgetId)
            .transition()
            .duration(750)
            .style("stroke", function(){return self._select_color(d.key)})
            .style("stroke-width", function(){return self._select_line_stroke_width(d.key)})

    });

    this.dataNest.forEach(function(d, i){
        var dots = self._chart.selectAll(".dots" + d.key + this.widgetId)
            .transition()
            .duration(750)
            .attr("r", function(){return self._select_dot_radius(d.key)})
            .style("stroke-width", function(){return self._select_dot_stroke_width(d.key)})
            .style("fill", function(){return self._select_color(d.key)});
    });


};


LineGraph.prototype._period_change_listener = function() {

    var self = this;
    var config = this.config;
    var state = controller.state;

    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped
    var current_period = controller.state.current_period;
    var gender = this.gender


    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);






    if(this.data_period.length == 0) {

        if(current_period > self._period_arr[self._period_arr.length - 1]){
            x = self.x(self._period_arr.length)
        }

        if(current_period < self._period_arr[0]){
            x = self.x(0)
        }


        self._vertical_line
            .transition()
            .duration(500)
            .ease("exp")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", self.height / 2)
            .attr("y2", self.height /2)

    } else {

        self._vertical_line
            .transition()
            .duration(500)
            .ease("exp")
            .attr("x1", self.x(self._period_arr.indexOf(state.current_period)))
            .attr("x2", self.x(self._period_arr.indexOf(state.current_period)))
            .attr("y1", self.height)
            .attr("y2", self.height * 0.1)
    }
};

LineGraph.prototype._secondary_area_change_listner = function(){

    var self = this;
    var state = controller.state;

    var areaType = state.areaType;
    var indicator = state.indicator;
    var genderType = state.genderType;

    this._select_all_bar
        .transition()
        .duration(200)
        .style("fill", function(){return self._select_all_color()})

    this._background_bars
        .data(this.data_period)
        .transition()
        .duration(200)
        .style("fill", function(d){ return self._select_selection_color(d)});


}

/!*----------functions--------------------*!/


LineGraph.prototype.validate_NaN_to_0 = function(val){
    if(isNaN(val)) return 0; else return Number(val);
};

LineGraph.prototype._list = function(data, key){
    var arr =[];
    for(var i in data) {
        var prop = data[i][key];
        if(arr.indexOf(prop) == -1){
            arr.push(prop)
        }
    }
    return arr;
};

LineGraph.prototype._nestData = function(data, nestField){
    var self = this;
    return d3.nest()
        .key(function(d){return d[nestField]})
        .entries(data);
};




LineGraph.prototype._select_color = function(id){
    var self = this;
    var state = controller.state;


    if(id == state.current_area){ //always highlight
        return self.cs.highlight_color
    }

    if(this.all_lines_selected){ //if all selected = true return main color
        return self.cs.main_color
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

    return self.cs.main_color //catch all!!

};

LineGraph.prototype._select_line_stroke_width = function(id){
    var self = this;
    var state = controller.state;


    if(id == state.current_area){ //always highlight
        return 4
    }

    if(this.all_lines_selected){ //if all selected = true return normal
        return 2
    }

    var index = state.current_secondary_areas.indexOf(id); //get color
    if(index == -1){
        return 0 //don't show
    } else {
        return 2
    }
};

LineGraph.prototype._select_dot_stroke_width = function(id){
    var self = this;
    var state = controller.state;


    if(id == state.current_area){ //always highlight
        return 2
    }

    if(this.all_lines_selected){ //if all selected = true return normal
        return 1
    }

    var index = state.current_secondary_areas.indexOf(id); //get color
    if(index == -1){
        return 0 //don't show
    } else {
        return 1
    }
};

LineGraph.prototype._select_dot_radius = function(id){
    var self = this;
    var state = controller.state;


    if(id == state.current_area){ //always highlight
        return 5
    }

    if(this.all_lines_selected){ //if all selected = true return normal
        return 4
    }

    var index = state.current_secondary_areas.indexOf(id); //get color
    if(index == -1){
        return 0 //don't show
    } else {
        return 4
    }
};





LineGraph.prototype._line_click = function(self, id){

    var config = self.config;
    controller._area_change(id);

};

LineGraph.prototype._dot_click = function(d){
    var config = this.config;
    controller._period_change(d[config.source.period]);
    controller._area_change(d[config.source.id]);

};

//LineGraph.prototype._get_name = function(id){
//
//    var state = controller.state;
//
//    return controller.config.areaList[state.areaType].filter(function(d){
//        if(d.id == id){return d}
//    })[0].name;
//
//};



//selection functions---------------

LineGraph.prototype._select_all_lines = function(){

    var self = this;
    var config = this.config;


    //switch state
    if(this.all_lines_selected){
        this.all_lines_selected = false;
    }else{
        this.all_lines_selected = true;
        controller.state.current_secondary_areas = []; //clear the selected areas
    }


    ////this.all_lines_selected = !this.all_lines_selected;
    //
    //this._set_selection_color();

    controller._secondary_area_change();



};



LineGraph.prototype._select_line = function(d){

    var self = this;
    var config = this.config;
    var state = controller.state;

    //always set all selected to false
    this.all_lines_selected = false;


    var id = d[config.source.id];

    //check if area is secondary area
    var index = state.current_secondary_areas.indexOf(id);
    if(index == -1){
        state.current_secondary_areas.push(id)
    } else {
        state.current_secondary_areas.splice(index, 1)
    }


    //this._set_selection_color();
    controller._secondary_area_change();


};


LineGraph.prototype._select_all_color = function(){

    var self = this;

    if(this.all_lines_selected){
        return self.cs.main_color
    } else {
        return "white"
    }
};

LineGraph.prototype._select_selection_color = function(d){

    var self = this;
    var config = this.config;
    var state = controller.state;

    var id = d[config.source.id];

    if(id == state.current_area){ //highlight is always highlight color
        return self.cs.highlight_color
    }

    if(self.all_lines_selected){ //when select all = true apart from the highlight all are white
        return "white"
    }

    var index = state.current_secondary_areas.indexOf(id);

    if(index == -1){
        return "white"
    } else {

        //repeat colors
        while(index >= state.secondary_areas_colors.length){
            index -= state.secondary_areas_colors.length;
        }

        return state.secondary_areas_colors[index]
    }


};


LineGraph.prototype._get_select_all_state = function(){

    var state = controller.state;

    if(state.current_secondary_areas.length > 0){
        this.all_lines_selected = false ;
    } else {
        this.all_lines_selected = true;
    }


}*/
