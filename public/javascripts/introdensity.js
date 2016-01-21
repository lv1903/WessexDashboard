IntroDensity= function(indicator, gender, container, widgetId){

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


IntroDensity.prototype._init = function(){

    this._draw_all();

};


IntroDensity.prototype._update_widget = function(){

    var gender = this.gender;
    var areaType = controller.state.areaType;
    var indicatorMapped = this.indicatorMapped;
    var current_period = controller.state.current_period;
    var current_area = controller.state.current_area;

    this.data = controller.filterData(areaType, gender, indicatorMapped);
    this.data_period = controller.filterDataPeriod(areaType, gender, indicatorMapped, current_period);
    this.data_area = controller.filterDataArea(areaType, gender, indicatorMapped, current_area);
    this.val = controller.getValueFromPeriodData(areaType, gender, indicatorMapped, current_period, current_area);

    console.log(controller)

};

IntroDensity.prototype._draw_all = function(){

    this._build_graph();

    this._draw_densityGraph();
    this._draw_label();


};

IntroDensity.prototype._build_graph = function() {

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



IntroDensity.prototype._draw_densityGraph = function(){

    var self = this;

    this._densityGraph = component.densityGraph(self, {
        x: 14,
        y: 0,
        compHeight: 14 * 14,
        compWidth: self.width
    });

    this._densityGraph.render();
    this._densityGraph.update(self);

    function update(){
        self._densityGraph.update(self);
    }
    ee.addListener("update", update)

};


IntroDensity.prototype._draw_label = function(){

    var self = this;

    var label = controller.config.indicatorLabels[this.indicator];
    label = label.charAt(0).toUpperCase() + label.slice(1);

    this._label_text = component.text(self, {
        str: label,
        x: 0,
        y: 17 * 14,
        width: this.width,
        id: "label" + this.widgetId
    });

    this._label_text.render()

};

