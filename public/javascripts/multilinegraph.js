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


    this.width =  this.full_width - config.margin.left  - config.margin.right;
    this.height = this.full_height - config.margin.bottom - config.margin.top;

    this._svg = d3.select(this.container)
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("class", "widget")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + this.full_width + " " + this.full_height )
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
        fill: controller.config.colorScheme.header_text_color,
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
    var icon = "\uf0b0";
    //var icon = "\uf142";

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
    var self = this;
    help.multiLineGraphHelp(self, 0);
    help.indicatorHelp(self, 12 * 14);
};


/*------------------*/



MultiLineGraph.prototype._draw_all_select = function(){

    this._svg.remove();
    this._build_graph();
    this._add_return_to_graph_button();
    this._draw_select();


};

MultiLineGraph.prototype._draw_select = function(){

    var self = this;

    this._select_bar = component.selectBar(self, {
        x: 0,
        y: 7,
        compHeight: self.height,
        compWidth: self.width
    });

    this._select_bar.render();

};