DensityGraph = function(indicator, gender, container, widgetId){

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


DensityGraph.prototype._init = function(){

    this._draw_all();
    this._bindEvents();

};

DensityGraph.prototype._bindEvents = function(){

    ee.addListener('update_widget', this._update_widget.bind(this));

};

DensityGraph.prototype._update_widget = function(){

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

DensityGraph.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_header();
    this._draw_no_data();
    this._draw_densityGraph();
    this._draw_label();


};

DensityGraph.prototype._build_graph = function() {

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

DensityGraph.prototype._draw_header = function(){

    var self = this;

    this._header_text = component.text(self, {
        str: "Distribution in England",
        font_size: "1.5em",
        x: 0,
        y: 0,
        width: this.width,
        id: "header" + this.widgetId
    });

    this._header_text.render();


};

DensityGraph.prototype._draw_no_data = function(){

    var self = this;

    function get_string_obj(){

        if(self.val == null){
            return [{str: "No Data Available", font_size: "1.5em"}]
        } else {
            return [{str: "", font_size: "0"}]
        }
    }

    this._no_data_text = component.textHump(self, {
        string_obj: get_string_obj(),
        x: 0,
        y: 3 * 14,
        id: "noDataText" + this.widgetId
    });

    this._no_data_text.render();

    function update(){
        self._no_data_text.update(get_string_obj());
    }
    ee.addListener("update", update)

};


DensityGraph.prototype._draw_densityGraph = function(){

    var self = this;

    this._densityGraph = component.densityGraph(self, {
        x: 14,
        y: 4 * 14,
        compHeight: 14 * 14,
        compWidth: self.width
    });

    this._densityGraph.render();

    function update(){
        self._densityGraph.update(self);
    }
    ee.addListener("update", update)

};


DensityGraph.prototype._draw_label = function(){

    var self = this;

    var label = controller.config.indicatorLabels[this.indicator];
    label = label.charAt(0).toUpperCase() + label.slice(1);

    this._label_text = component.text(self, {
        str: label,
        x: 0,
        y: 21 * 14,
        width: this.width,
        id: "label" + this.widgetId
    });

    this._label_text.render()

};





DensityGraph.prototype._add_help_button = function(){

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

DensityGraph.prototype._add_return_to_graph_button = function(){

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

