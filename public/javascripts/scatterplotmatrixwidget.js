OverviewWidget = function(indicatorArr, gender, container, widgetId){



    var self = this;

    this.widgetId = widgetId;
    this.indicatorArr = indicatorArr;

    this.indicatorMappedArr = controller.getIndicatorMappedArr(this.indicatorArr, controller.config.indicatorMapping)

    this.gender = gender;
    this.container = container;

    this.cs = controller.config.colorScheme;


    this._update_widget();
    this._init();


};


OverviewWidget.prototype._init = function(){

    this._draw_all();
    this._bindEvents();

};

OverviewWidget.prototype._bindEvents = function(){

    ee.addListener('update_widget', this._update_widget.bind(this));

};

OverviewWidget.prototype._update_widget = function(){

    var gender = this.gender;
    var areaType = controller.state.areaType;
    this.indicatorMappedArr = controller.getIndicatorMappedArr(this.indicatorArr, controller.config.indicatorMapping)
    var current_period = controller.state.current_period;
    var current_area = controller.state.current_area;

    //this.data = controller.filterData(areaType, gender, indicatorMapped);
    //this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    //this.data_area = controller.filterDataArea(areaType, gender, indicatorMapped, current_area);
    //this.val = controller.getValueFromPeriodData(areaType, gender, indicatorMapped, current_period, current_area);

};

OverviewWidget.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_header();
    this._draw_timeSlider();
    this._draw_tartanRug();

    //this._draw_indicator();
    //this._draw_gender();
    //this._draw_area_name();
    //this._draw_value();
    //this._draw_no_data();
    //this._draw_count();
    //this._draw_gauge();
    //this._draw_rank();
    //this._draw_densityGraph();
    //this._draw_label();
    //this._draw_lineGraph();

};

OverviewWidget.prototype._build_graph = function() {


    var config = controller.config;
    var self = this;

    this.full_width = (300 * 3) + (14 * 2);
    this.full_height = 800;


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


OverviewWidget.prototype._draw_header = function(){

    var self = this;

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    this._header_text = component.text(self, {
        str: "Overview Report:   Wessex " +  areaTypeLabel,
        font_size: "2em",
        x: 0,
        y: 3 * 14,
        dy: 0,
        width: this.width,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + this.widgetId
    });

    this._header_text.render();
};

OverviewWidget.prototype._draw_timeSlider = function(){

    var self = this;

    this._timeSlider = component.timeSlider(self, {

        x: self.width - 300 - controller.config.margin.left ,
        y: 0,
        compHeight: 3 * 14,
        compWidth: 300,
        firstPeriod: controller.config.firstPeriod,
        lastPeriod: controller.config.lastPeriod

    })

    this._timeSlider.render();

};

OverviewWidget.prototype._draw_tartanRug = function(){

    var self = this;

    this._tartanRug = component.tartanRug(self, {
        x: 0,
        y: 7 * 15,
        compHeight: self.height - 10 * 14,
        compWidth: self.width
    });

    this._tartanRug.render();

    //function update(){
    //    self._tartanRug.update(self);
    //}
    //ee.addListener("update", update)



}











OverviewWidget.prototype._add_help_button = function(){

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

OverviewWidget.prototype._add_return_to_graph_button = function(){

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



OverviewWidget.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._add_return_to_graph_button();
    this._draw_help_text();

};

OverviewWidget.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

OverviewWidget.prototype._draw_help_text = function(){
    //to do
};



