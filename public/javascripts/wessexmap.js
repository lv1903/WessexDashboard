WessexMap = function(indicator, gender, container, widgetId){

    var self = this;

    this.widgetId = widgetId;
    this.indicator = indicator;
    this.indicatorMapped = controller.config.indicatorMapping[indicator];
    this.gender = gender;
    this.container = container;

    this.cs = controller.config.colorScheme;

    this._update_widget();
    this._init();
};


WessexMap.prototype._init = function(){

    this._draw_all();
    this._bindEvents();

};

WessexMap.prototype._bindEvents = function(){

    ee.addListener('update_widget', this._update_widget.bind(this));

};

WessexMap.prototype._update_widget = function(){

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

WessexMap.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_area_type();
    this._draw_map();
    this._draw_area_name();



};

WessexMap.prototype._build_graph = function() {

    var config = controller.config;
    var self = this;

    config.full_width = 300;
    config.full_height = 400;


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

WessexMap.prototype._draw_area_type = function(){

    var self = this;

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    this._area_type = component.text(self, {
        str: "Wessex " + areaTypeLabel,
        font_size: "1.5em",
        x: 0,
        y: 0,
        width: this.width,
        id: "areaType" + this.widgetId
    });

    this._area_type.render()

};



WessexMap.prototype._draw_map = function(){

    var self = this;

    var fFill = function(d){

        var id = d.properties.id;

        if(id == controller.state.current_area){
            return controller.config.colorScheme.highlight_color
        } else {

            var gender = self.gender;
            var areaType = controller.state.areaType;
            var indicatorMapped = self.indicatorMapped;
            var current_period = controller.state.current_period;

            var val = controller.getValueFromPeriodData(areaType, gender, indicatorMapped, current_period, id);

            if(val == null){
                return "white"
            } else {
                return d3.interpolateHsl(d3.rgb('#fff'), d3.rgb(self.cs.dark_text_color))((Math.floor(val.percent * 4) / 4).toFixed(1))
            }
        }
    };

    var fStroke = function(d){
        return controller.config.colorScheme.background_color
    }



    this._map = component.map(self, {

        x:0,
        y:3 * 14,
        compHeight: 10 * 14,
        compWidth: self.width,
        style: {
            stroke: fStroke,
            "stroke-width": 2,
            fill: fFill
        }
    });

    this._map.render();

};

WessexMap.prototype._draw_area_name = function(){

    var self = this;

    var current_area_name = controller._get_area_name(controller.state.current_area);

    this._area_text = component.text(self, {
        str: current_area_name,
        font_size: "1.5em",
        x: 0,
        y: 21 * 14,
        width: this.width,
        fill: controller.config.colorScheme.highlight_color,
        id: "areaName" + this.widgetId
    })

    this._area_text.render()

    function update(){
        self._area_text.update(controller._get_area_name(controller.state.current_area));
    }
    ee.addListener("update", update)

};






WessexMap.prototype._add_help_button = function(){

    var config = controller.config;
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

WessexMap.prototype._add_return_to_graph_button = function(){

    var config = controller.config;
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

WessexMap.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._draw_help_text();
    this._add_return_to_graph_button();

};

WessexMap.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

WessexMap.prototype._draw_help_text = function(){
    //todo
};

