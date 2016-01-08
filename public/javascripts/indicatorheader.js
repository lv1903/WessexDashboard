
IndicatorHeader = function(indicator, gender, container, widgetId){

    var self = this;

    this.widgetId = widgetId;
    this.indicator = indicator;
    this.indicatorArr = controller.config.indicatorMapping[indicator];
    this.gender = gender;
    this.container = container;


    this.cs = controller.config.colorScheme;
    this._init();


};

IndicatorHeader.prototype._init = function(){

    this._draw_all();


};

IndicatorHeader.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_header();
    this._draw_indicator();
    this._draw_gender();
    this._draw_area_type();
    this._draw_timeSlider();
    this._draw_select_year();


};

IndicatorHeader.prototype._build_graph = function() {

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
        .classed("svg-content-responsive", true)

    this._chart = this._svg
        .append('g')
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");

};


IndicatorHeader.prototype._draw_header = function(){

    var self = this;

    this._header_text = component.text(self, {
        str: "Report:",
        font_size: "2em",
        x: 0,
        y: 0 * 14,
        dy: 0,
        width: this.width,
        id: "header" + this.widgetId
    });

    this._header_text.render();


};


IndicatorHeader.prototype._draw_indicator = function(){

    var self = this;

    this._indicator_text = component.text(self, {
        str: this.indicator,
        font_size: "1.5em",
        x: 0,
        y: 3 * 14,
        width: this.width,
        id: "indicator" + this.widgetId
    });

    this._indicator_text.render()

};


IndicatorHeader.prototype._draw_gender = function(){

    var self = this;

    this._gender_text = component.text(self, {
        str: this.gender,
        font_size: "1.5em",
        x: 0,
        y: 7 * 14,
        width: this.width,
        id: "gender" + this.widgetId
    })

    this._gender_text.render()


};

IndicatorHeader.prototype._draw_area_type = function(){

    var self = this;

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    this._area_type = component.text(self, {
        str: "Wessex " + areaTypeLabel,
        font_size: "1.5em",
        x: 0,
        y: 9 * 14,
        width: this.width,
        id: "areaType" + this.widgetId
    });

    this._area_type.render()

};


IndicatorHeader.prototype._draw_timeSlider = function(){

    var self = this;

    this._timeSlider = component.timeSlider(self, {

        x:0,
        y: 10 * 14,
        compHeight: 3 * 14,
        compWidth: self.width,
        firstPeriod: controller.config.firstPeriod,
        lastPeriod: controller.config.lastPeriod

    })

    this._timeSlider.render();

};

IndicatorHeader.prototype._draw_select_year = function(){

    var self = this;

    this._year_select = component.text(self, {
        str: "click to select year",
        font_size: "1em",
        x: -5,
        y: 16 * 14,
        width: this.width,
        id: "yearSelectText" + this.widgetId
    })

    this._year_select.render()

};








IndicatorHeader.prototype._add_help_button = function(){

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

IndicatorHeader.prototype._add_return_to_graph_button = function(){

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

IndicatorHeader.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._draw_help_text();
    this._add_return_to_graph_button();

};

IndicatorHeader.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

IndicatorHeader.prototype._draw_help_text = function(){
    //todo
};
