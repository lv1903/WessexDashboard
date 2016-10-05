
AreaFacts = function(indicator, gender, container, widgetId){

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


AreaFacts.prototype._init = function(){

    this._draw_all();
    this._bindEvents();

};

AreaFacts.prototype._bindEvents = function(){

    ee.addListener('update_widget', this._update_widget.bind(this));

};

AreaFacts.prototype._update_widget = function(){

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

AreaFacts.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_area_name();
    this._draw_value();
    this._draw_no_data();
    this._draw_count();
    this._draw_gauge();
    this._draw_rank();



};

AreaFacts.prototype._build_graph = function() {

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
        .attr("id", "widget" + this.widgetId)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + this.full_width + " " + this.full_height )
        .classed("svg-content-responsive", true);


    controller.setWidgetZoom("#widget" + this.widgetId);

    this._chart = this._svg
        .append('g')
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");



};


AreaFacts.prototype._draw_area_name = function(){

    var self = this;

    var current_area_name = controller._get_area_name(controller.state.current_area);

    this._area_text = component.text(self, {
        str: current_area_name,
        font_size: "1.5em",
        x: 0,
        y: 0,
        width: this.width,
        fill: controller.config.colorScheme.highlight_text_color,
        id: "areaName" + this.widgetId
    })

    this._area_text.render()

    function update(){
        self._area_text.update(controller._get_area_name(controller.state.current_area));
    }
    ee.addListener("update", update)

};


AreaFacts.prototype._draw_value = function(){

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
        y: 4 * 14,
        id: "valueText" + this.widgetId
    });

    this._value_text.render()



    function update(){
        self._value_text.update(get_string_obj());
    }
    ee.addListener("update", update)

};

AreaFacts.prototype._draw_no_data = function(){

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
        y: 4 * 14,
        id: "noDataText" + this.widgetId
    });

    this._no_data_text.render()



    function update(){
        self._no_data_text.update(get_string_obj());
    }
    ee.addListener("update", update)

};

AreaFacts.prototype._draw_count = function(){

    var self = this;

    //add count text if available
    if(this.val != null) {

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
            y: 7 * 14,
            id: "countText" + this.widgetId
        });

        this._count_text.render()


        function update(){
            self._count_text.update(get_string_obj());
        }
        ee.addListener("update", update)


    }
};

AreaFacts.prototype._draw_gauge = function(){

    var self = this;

    var sideLength = 14 * 14;

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
        yTranslate: 8 * 14,
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

AreaFacts.prototype._draw_rank = function(){

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
        y: 21 * 14,
        id: "rankText" + this.widgetId
    });

    this._rank_text.render()


    function update(){
        self._rank_text.update(get_string_obj());
    }
    ee.addListener("update", update)

};






AreaFacts.prototype._add_help_button = function(){

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

AreaFacts.prototype._add_return_to_graph_button = function(){

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



AreaFacts.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._add_return_to_graph_button();
    this._draw_help_text();

};

AreaFacts.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

AreaFacts.prototype._draw_help_text = function(){
    var self = this;
    help.areaFactsHelp(self, 0);
    help.indicatorHelp(self, 12 * 14);
};
