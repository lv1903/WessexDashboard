IndicatorWidget = function(indicator, gender, container, widgetId){

    var self = this;

    this.widgetId = widgetId;
    this.indicator = indicator;
    this.indicatorMapped = controller.config.indicatorMapping[indicator];
    this.gender = gender;
    this.container = container;

    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped;
    var current_period = controller.state.current_period;
    var current_area = controller.state.current_area;

    //this.config = controller.config;

    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    this.val = controller.getValueFromPeriodData(areaType, gender, indicatorMapped, current_period, current_area);

    this.cs = controller.config.colorScheme;
    this._init();
    
    
};


IndicatorWidget.prototype._init = function(){

    this._draw_all();
    this._bindEvents();

};

IndicatorWidget.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_indicator();
    this._draw_gender();
    this._draw_area_name();
    this._draw_value();
    this._draw_count();
    this._draw_gauge();
    this._draw_rank();
    this._draw_densityGraph();
    this._draw_label();
    this._draw_lineGraph();

};

IndicatorWidget.prototype._build_graph = function() {

    var config = controller.config;
    var self = this;

    config.full_width = 300;
    config.full_height = 800;


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


IndicatorWidget.prototype._draw_indicator = function(){

    var self = this;

    this._indicator_text = component.text(self, {
        str: this.indicator,
        font_size: "1.5em",
        x: 0,
        y: 0,
        width: this.width,
        id: "#indicator" + this.widgetId
    })

    this._indicator_text.render()

};

IndicatorWidget.prototype._draw_gender = function(){

    var self = this;

    this._gender_text = component.text(self, {
        str: this.gender,
        font_size: "1.5em",
        x: 0,
        y: 4 * 14,
        width: this.width,
        id: "#gender" + this.widgetId
    })

    this._gender_text.render()

};

IndicatorWidget.prototype._draw_area_name = function(){

    var self = this;

    var current_area_name = controller._get_area_name(controller.state.current_area);

    this._area_text = component.text(self, {
        str: current_area_name,
        font_size: "1.5em",
        x: 0,
        y: 6.5 * 14,
        width: this.width,
        fill: controller.config.colorScheme.highlight_color,
        id: "#areaName" + this.widgetId
    })

    this._area_text.render()

};


IndicatorWidget.prototype._draw_value = function(){

    var self = this;

    var format = d3.format(",.0f");

    var value = format(this.val.value);
    var unit = controller.config.indicatorLabels[this.indicator];

    var string_obj = [
            {str: value, font_size: "1.5em"},
            {str: unit, font_size: "1em"}
        ];

    this._value_text = component.textHump(self, {
        string_obj: string_obj,
        x: 0,
        y: 11 * 14,
        id: "valueText" + this.widgetId
    });

    this._value_text.render()

};

IndicatorWidget.prototype._draw_count = function(){

    //add count text if available
    if(this.val.count != null) {

        var self = this;

        var format = d3.format(",.0f");

        count = format(Number(this.val.count));
        unit = controller.config.genderLabels[this.gender];

        var string_obj = [
            {str: count, font_size: "1.5em"},
            {str: unit, font_size: "1em"}
        ];

        this._count_text = component.textHump(self, {
            string_obj: string_obj,
            x: 0,
            y: 13 * 14,
            id: "countText" + this.widgetId
        });

        this._count_text.render()

    }
};

IndicatorWidget.prototype._draw_gauge = function(){

    var self = this;

    var sideLength = 12 * 14;

    this._gauge = component.gauge(self._chart, {
        size: sideLength,
        clipWidth: sideLength,
        clipHeight: sideLength,
        ringWidth: 40,
        maxValue: 1,
        transitionMs: 4000,
        color1: "white",
        color2: self.cs.dark_text_color,
        xTranslate: self.width / 2 - sideLength / 2,
        yTranslate: 15 * 14,
        lowLabelx: -10,
        highLabelx: self.width - 35


    });

    this._gauge.render();

    //check if data is available for period otherwise send 0 and exit
    if(this.data_period.length == 0){
        this._gauge.update(0)
        return
    }
    this._gauge.update(this.val.percent)
};

IndicatorWidget.prototype._draw_rank = function(){

    var self = this;

    var format = d3.format(",.0f");

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];


    var prefix = "Ranked ";
    var rank = format(this.val.index);
    var middle = "out of ";
    var total = format(this.val.indexMax);
    var suffix = " " + areaTypeLabel;

    var string_obj = [
        {"str": prefix, "font_size": "1em"},
        {"str": rank, "font_size": "1.5em"},
        {"str": middle, "font_size": "1em"},
        {"str": total, "font_size": "1.5em"},
        {"str": suffix, "font_size": "1em"}
    ];

    this._rank_text = component.textHump(self, {
        string_obj: string_obj,
        x: 0,
        y: 24 * 14,
        id: "valueText" + this.widgetId
    });

    this._rank_text.render()

};



IndicatorWidget.prototype._draw_densityGraph = function(){

    var self = this;

    this._densityGraph = component.densityGraph(self, {
        x: 14,
        y: 27 * 14,
        compHeight: 10 * 14,
        compWidth: self.width
    });

    this._densityGraph.render()

};


IndicatorWidget.prototype._draw_label = function(){

    var self = this;

    var label = controller.config.indicatorLabels[this.indicator];
    label = label.charAt(0).toUpperCase() + label.slice(1);

    this._label_text = component.text(self, {
        str: label,
        x: 0,
        y: 40.5 * 14,
        width: this.width,
        id: "#label" + this.widgetId
    });

    this._label_text.render()

};



IndicatorWidget.prototype._draw_lineGraph = function(){

    var self = this;

    this._line = component.lineGraph(self, {
        x: 0,
        y: 42 * 14,
        compHeight: 7 * 14,
        compWidth: self.width
    });

    this._line.render()

};










IndicatorWidget.prototype._add_help_button = function(){

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

IndicatorWidget.prototype._add_return_to_graph_button = function(){

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

IndicatorWidget.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._draw_help_text();
    this._add_return_to_graph_button();

};

IndicatorWidget.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

IndicatorWidget.prototype._draw_help_text = function(){
    //todo
};



IndicatorWidget.prototype._bindEvents = function(){

    //ee.addListener('period_change', this._period_change_listener.bind(this));
    //ee.addListener('area_change', this._area_change_listener.bind(this));
}

