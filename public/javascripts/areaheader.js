AreaHeader = function(indicatorArr, gender, container, widgetId){

    var self = this;

    this.widgetId = widgetId;
    this.indicatorArr = indicatorArr;
    this.gender = gender;
    this.container = container;


    this.cs = controller.config.colorScheme;
    this._init();


};

AreaHeader.prototype._init = function(){

    this._draw_all();


};

AreaHeader.prototype._draw_all = function(){

    this._build_graph();
    this._add_help_button();

    this._draw_header();
    this._draw_gender();
    this._draw_area_name();
    this._draw_area_type();
    this._draw_map();
    this._draw_select_area();
    this._draw_timeSlider();
    this._draw_select_year();
    this._draw_play_button();
    this._draw_stop_button();
    this._draw_play_text();


};

AreaHeader.prototype._build_graph = function() {

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


AreaHeader.prototype._draw_header = function(){

    var self = this;

    this._header_text = component.text(self, {
        str: "Area Report:",
        font_size: "2em",
        x: 0,
        y: 1.65 * 14,
        dy: 0,
        width: this.width,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + this.widgetId
    });

    this._header_text.render();
};

AreaHeader.prototype._draw_gender = function(){

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

    this._gender_text.render();

    //function update(){
    //    self._gender_text.update(); //remove
    //    self._draw_gender(); // redraw
    //}
    //ee.addListener("update", update)

};

AreaHeader.prototype._draw_area_name = function(){

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


AreaHeader.prototype._draw_area_type = function(){

    var self = this;

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    this._area_type = component.text(self, {
        str: "Wessex " + areaTypeLabel,
        font_size: "1.5em",
        x: 0,
        y: 13 * 14,
        width: this.width,
        id: "areaType" + this.widgetId
    });

    this._area_type.render()

};




AreaHeader.prototype._draw_map = function(){


    var fFill = function(d){
        if(d.properties.id == controller.state.current_area){
            return controller.config.colorScheme.highlight_color
        } else {
            return "white"
        }
    };

    var self = this;

    this._map = component.map(self, {

        x:0,
        y:16 * 14,
        compHeight: 10 * 14,
        compWidth: self.width,
        style: {
            stroke: controller.config.colorScheme.main_color,
            "stroke-width": 2,
            fill: fFill
        }


    });

    this._map.render();

};

AreaHeader.prototype._draw_select_area = function(){

    var self = this;

    this._area_select = component.text(self, {
        str: "click to select area",
        font_size: "1em",
        x: -5,
        y: 33 * 14,
        width: this.width,
        id: "areaSelectText" + this.widgetId
    });
    if(!controller.state.pdf) { //don't render for pdf
        this._area_select.render()
    }
};


AreaHeader.prototype._draw_timeSlider = function(){

    var self = this;


    this._timeSlider = component.timeSlider(self, {

        x:0,
        y: 34 * 14,
        compHeight: 3 * 14,
        compWidth: self.width,
        firstPeriod: controller.config.firstPeriod,
        lastPeriod: controller.config.lastPeriod

    });

    this._timeSlider.render();

};

AreaHeader.prototype._draw_select_year = function(){

    var self = this;

    this._year_select = component.text(self, {
        str: "click to select year",
        font_size: "1em",
        x: -5,
        y: 40 * 14,
        width: this.width,
        id: "yearSelectText" + this.widgetId,
        color: controller.config.colorScheme.main_color
    });
    if(!controller.state.pdf) { //don't render for pdf
        this._year_select.render()
    }
};





AreaHeader.prototype._draw_play_button = function(){

    var self = this;
    var config = controller.config;

    var r = 14;
    var margin = 16
        ;
    var x =  14;
    var y = 43 * 14;
    var icon = "\u25B6";

    this._help_button = component.circleButton( self, {
        r: r,
        margin: margin,
        x: x,
        y: y,
        icon: icon,
        font_size: "3em",
        stroke_width: 3,
        color: config.colorScheme.quartile_dark_color_array[0],
        background_color: config.colorScheme.background_color,
        //opacity: 0.8,

        component_class: "play_button",
        clicked: function(){controller.play(controller)}
    });

    this._help_button.render();

};


AreaHeader.prototype._draw_stop_button = function(){

    var self = this;
    var config = controller.config;

    var r = 14;
    var margin = 8;
    var x =  4.5 * 14;
    var y = 43 * 14;
    var icon = "\u25A0";

    this._help_button = component.circleButton( self, {
        r: r,
        margin: margin,
        x: x,
        y: y,
        icon: icon,
        font_size: "1.6em",
        stroke_width: 3,
        color: config.colorScheme.quartile_dark_color_array[3],
        background_color: config.colorScheme.background_color,
        opacity: 0.5,

        component_class: "stop_button",
        clicked: function(){controller.stop(controller)}
    });

    this._help_button.render();

};

AreaHeader.prototype._draw_play_text = function(){

    var self = this;

    this._year_select = component.text(self, {
        str: "press play to step through the years",
        font_size: "1em",
        x: -5,
        y: 46 * 14,
        width: this.width,
        id: "yearSelectText" + this.widgetId,
        color: controller.config.colorScheme.main_color
    });

    if(!controller.state.pdf){ //don't render for pdf
        this._year_select.render();
    }
};








AreaHeader.prototype._add_help_button = function(){

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

AreaHeader.prototype._add_return_to_graph_button = function(){

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



AreaHeader.prototype._draw_help = function(){

    this._svg.remove();
    this._build_graph();
    this._add_return_to_graph_button();
    this._draw_help_text();

};

AreaHeader.prototype._redraw = function(){

    this._svg.remove();
    this._draw_all();

};

AreaHeader.prototype._draw_help_text = function(){
    var self = this;
    help.areaHeaderHelp(self, 0);

};
