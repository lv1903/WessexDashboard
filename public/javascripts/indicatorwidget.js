IndicatorWidget = function(indicator, gender, container, widgetId){

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


IndicatorWidget.prototype._init = function(){

    this._draw_all();
    this._bindEvents();

};

IndicatorWidget.prototype._bindEvents = function(){

    ee.addListener('update_widget', this._update_widget.bind(this));

};

IndicatorWidget.prototype._update_widget = function(){

    var gender = this.gender;
    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped;
    var current_period = controller.state.current_period;
    var current_area = controller.state.current_area;

    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    this.data_area = controller.filterDataArea(areaType, gender, indicatorMapped, current_area);
    this.val = controller.getValueFromPeriodData(areaType, gender, indicatorMapped, current_period, current_area);

    this.data_area.sort(function(a,b){
        if (a.Map_Period < b.Map_Period)
        return -1;
        if (a.Map_Period > b.Map_Period)
            return 1;
        return 0;})

};

IndicatorWidget.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_indicator();
    this._draw_gender();
    this._draw_area_name();
    this._draw_value();
    this._draw_no_data();
    this._draw_count();
    this._draw_gauge();
    this._draw_rank();
    this._draw_densityGraph();
    this._draw_label_1();
    this._draw_lineGraph();
    this._draw_label_2();

};

IndicatorWidget.prototype._build_graph = function() {

    var config = controller.config;
    var self = this;

    this.full_width = 300;
    this.full_height = 800;


    this.width =  this.full_width - config.margin.left  - config.margin.right;
    this.height = this.full_height - config.margin.bottom - config.margin.top;

    this._svg = d3.select(this.container)
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("class", "widget")
        .attr("id", "widget" + this.widgetId)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + this.full_width + " " + this.full_height )
        .classed("svg-content-responsive", true);

    controller.setWidgetZoom("#widget" + this.widgetId);

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
        fill: controller.config.colorScheme.header_text_color,
        id: "indicator" + this.widgetId
    });

    this._indicator_text.render();

};

IndicatorWidget.prototype._draw_gender = function(){

    var self = this;

    this._gender_text = component.text(self, {
        str: this.gender,
        font_size: "1.5em",
        x: 0,
        y: 4 * 14,
        width: this.width,
        fill: controller.config.colorScheme.header_text_color,
        id: "gender" + this.widgetId
    });

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
        fill: controller.config.colorScheme.highlight_text_color,
        id: "areaName" + this.widgetId
    });

    this._area_text.render();

    function update(){
        self._area_text.update(controller._get_area_name(controller.state.current_area));
    }
    ee.addListener("update", update)

};


IndicatorWidget.prototype._draw_value = function(){

    var self = this;

    var format = controller.value_format;

    function get_string_obj(){

        if(self.val == null){
            return [{str: "", font_size: "0"}]
        }

        var value = format(self.val.value);
        var unit = controller.config.indicatorLabels[self.indicator];

        return [
            {str: value, font_size: "1.5em"},
            {str: unit, font_size: "1em"}
        ];

    }


    this._value_text = component.textHump(self, {
        string_obj: get_string_obj(),
        x: 0,
        y: 11 * 14,
        id: "valueText" + this.widgetId
    });

    this._value_text.render();



    function update(){
          self._value_text.update(get_string_obj());
    }
    ee.addListener("update", update)

};

IndicatorWidget.prototype._draw_no_data = function(){

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
        y: 11 * 14,
        id: "noDataText" + this.widgetId
    });

    this._no_data_text.render();



    function update(){
        self._no_data_text.update(get_string_obj());
    }
    ee.addListener("update", update)

};

IndicatorWidget.prototype._draw_count = function(){

    var self = this;

    //add count text if available
    if(this.val != null && this.val.count != null) {

        var self = this;

        function get_string_obj() {

            if(self.val == null){
                return [{str: "", font_size: "0"}]
            }

             var format = controller.value_format;

            count = format(Number(self.val.count));
            unit = controller.config.genderLabels[self.gender] + " " + controller.config.indicatorCountLabels[self.indicator];

            return [
                {str: count, font_size: "1.5em"},
                {str: unit, font_size: "1em"}
            ];
        }

        this._count_text = component.textHump(self, {
            string_obj: get_string_obj(),
            x: 0,
            y: 13 * 14,
            id: "countText" + this.widgetId
        });

        this._count_text.render();


        function update(){
            self._count_text.update(get_string_obj());
        }
        ee.addListener("update", update)


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

    update();

    function update(){
        if(self.val == null){
            self._gauge.update(0);
        } else {
            self._gauge.update(self.val.percent);
        }
    }
    ee.addListener("update", update)



};

IndicatorWidget.prototype._draw_rank = function(){

    var self = this;

    function get_string_obj() {

        if(self.val == null){
            return [{str: "", font_size: "0"}]
        }

         var format = controller.value_format;

        var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
        areaTypeLabel = controller.config.areaTypeLabels[areaType];

        var prefix = "Ranked ";
        var rank = format(self.val.index);
        var middle = "out of ";
        var total = format(self.val.indexMax);
        var suffix = "English " + areaTypeLabel;

        return [
            {"str": prefix, "font_size": "1em"},
            {"str": rank, "font_size": "1.5em"},
            {"str": middle, "font_size": "1em"},
            {"str": total, "font_size": "1.5em"},
            {"str": suffix, "font_size": "1em"}
        ];
    }

    this._rank_text = component.textHump(self, {
        string_obj: get_string_obj(),
        x: 0,
        y: 24 * 14,
        id: "rankText" + this.widgetId
    });

    this._rank_text.render();


    function update(){
        self._rank_text.update(get_string_obj());
    }
    ee.addListener("update", update)

};



IndicatorWidget.prototype._draw_densityGraph = function(){

    var self = this;

    this._densityGraph = component.densityGraph(self, {
        x: 14,
        y: 27 * 14,
        compHeight: 10 * 14,
        compWidth: self.width
    });

    this._densityGraph.render();
    this._densityGraph.update(self);

    function update(){
        self._densityGraph.update(self);
    }
    ee.addListener("update", update)

};


IndicatorWidget.prototype._draw_label_1 = function(){

    var self = this;

    var label = controller.config.indicatorLabels[this.indicator];
    label = label.charAt(0).toUpperCase() + label.slice(1);

    this._label_text = component.text(self, {
        str: label,
        x: 0,
        y: 40 * 14,
        width: this.width,
        fill: controller.config.colorScheme.text_color,
        id: "label" + this.widgetId
    });

    this._label_text.render()

};



IndicatorWidget.prototype._draw_lineGraph = function(){

    var self = this;

    if(self.data.length > 0) { //only add if there is some data

        this._line = component.lineGraph(self, {
            x: 0,
            y: 42 * 14,
            compHeight: 7 * 14,
            compWidth: self.width
        });

        this._line.render();

        function update() {
            self._line.update(self);
        }

        ee.addListener("update", update)
    };

};

IndicatorWidget.prototype._draw_label_2 = function(){

    var self = this;

    var label = controller.config.indicatorLabels[this.indicator];
    label = label.charAt(0).toUpperCase() + label.slice(1);

    this._label_text = component.text(self, {
        str: label,
        x: 0,
        y: 52 * 14,
        width: this.width,
        fill: controller.config.colorScheme.text_color,
        id: "label" + this.widgetId
    });

    this._label_text.render();

};







IndicatorWidget.prototype._add_help_button = function(){

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

IndicatorWidget.prototype._add_return_to_graph_button = function(){

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



IndicatorWidget.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._add_return_to_graph_button();
    this._draw_help_text();

};

IndicatorWidget.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

IndicatorWidget.prototype._draw_help_text = function(){
    var self = this;
    help.indicatorWidgetHelp(self, 0);
    help.indicatorHelp(self, 36 * 14);
};


