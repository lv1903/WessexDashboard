IntroMap = function(indicator, gender, container, widgetId){

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


IntroMap.prototype._init = function(){

    this._draw_all();

};

IntroMap.prototype._update_widget = function(){

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



IntroMap.prototype._draw_all = function(){

    this._build_graph();
    this._draw_map();
    this._draw_key();



};

IntroMap.prototype._build_graph = function() {

    var config = controller.config;
    var self = this;

    this.full_width = 300;
    this.full_height = 300;


    this.width =  this.full_width - config.margin.left  - config.margin.right;
    this.height = this.full_height - config.margin.bottom - config.margin.top;

    this._svg = d3.select(this.container)
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("class", "introWidget")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + this.full_width + " " + this.full_height )
        .classed("svg-content-responsive", true);

    this._chart = this._svg
        .append('g')
        .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");



};


IntroMap.prototype._draw_map = function(){

    var self = this;

    var fFill = function(d){

        var id = d.properties.id;

        var gender = self.gender;
        var areaType = controller.state.areaType;
        var indicatorMapped = self.indicatorMapped;
        var current_period = controller.state.current_period;

        var val = controller.getValueFromPeriodData(areaType, gender, indicatorMapped, current_period, id);

        if(val == null){
            return "white"
        } else {
            return controller.config.colorScheme.quartile_color_array[Math.floor(val.percent * 4)]
            //return d3.interpolateHsl(d3.rgb('#fff'), d3.rgb(self.cs.dark_text_color))((Math.floor(val.percent * 4) / 4).toFixed(1))
        }
        //}
    };


    this._map = component.map(self, {

        x:0,
        y:0,
        compHeight: 10 * 14,
        compWidth: self.width,
        style: {
            stroke: controller.config.colorScheme.main_color,
            "stroke-width": 2,
            "opacity": 1,
            fill: fFill

        }
    });

    this._map.render();

};

IntroMap.prototype._draw_key = function(){

    var self = this;

    this._map_key = component.wessexMapKey(self, {
        x: 0,
        y: 18 * 14,
        width: this.width,
        stroke: controller.config.colorScheme.main_color,
        id: "mapKey" + this.widgetId
    });

    this._map_key.render()

};


