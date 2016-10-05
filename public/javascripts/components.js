Components = function(){};


Components.prototype.text = function(widget, configuration){

    //write wrapped text

    var self = this;
    var that = {};
    that.config = {};

    var svg = undefined;
    var x = undefined;
    var y = undefined;
    var dy = undefined;
    var text_anchor = undefined;
    var font_size = undefined;
    var fill = undefined;


    function configure(widget, configuration) {

        that.config = configuration;

        if(that.config.hasOwnProperty("x")){ x = that.config.x } else {x = 0}
        if(that.config.hasOwnProperty("y")){ y = that.config.y } else {y = 0}
        if(that.config.hasOwnProperty("dy")){ dy = that.config.dy } else {dy = 0}
        if(that.config.hasOwnProperty("text-anchor")){ text_anchor = that.config.text_anchor } else {text_anchor = "left"}
        if(that.config.hasOwnProperty("font_size")){ font_size = that.config.font_size } else {font_size = "1em"}
        if(that.config.hasOwnProperty("fill")){ fill = that.config.fill } else {fill = controller.config.colorScheme.text_color}


    }
    that.configure = configure;



    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        this._text = svg.append("text")
            .attr("id", that.config.id)
            .attr("x", 0)
            .attr("y", 0 )
            .attr("dy", dy)
            .attr("text-anchor", text_anchor)
            .style("font-size", font_size)
            .style("fill", fill)
            .call(self.wrap, that.config.width, that.config.str)

    }
    that.render = render;

    function update(new_string) {

        this._text.remove();

        this._text = svg.append("text")
            .attr("id", that.config.id)
            .attr("x", 0)
            .attr("y", 0 )
            .attr("dy", dy)
            .attr("text-anchor", text_anchor)
            .style("font-size", font_size)
            .style("fill", fill)
            .call(self.wrap, that.config.width, new_string)



    }
    that.update = update;

    configure(widget, configuration);

    return that;

};


Components.prototype.wrap =  function(text, width, string){

    text.each(function () {
        var text = d3.select(this),
            words = string.split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });

};


Components.prototype.textHump = function(widget, configuration){

    //write text with different sized fonts


    var self = this;
    var that = {};
    that.config = {};

    var svg = undefined;
    var x = undefined;
    var y = undefined;
    var dy = undefined;
    var text_anchor = undefined;
    var font_size = undefined;
    var fill = undefined;

    function write_string(string_obj){

        if(that.config.hasOwnProperty("x")){ x = that.config.x } else {x = 0};

        var temp_obj = {};
        for(var i in string_obj){

            var str = string_obj[i].str;
            var font_size = string_obj[i].font_size;


            if( i > 0) {
                x += 5 + temp_obj[that.config.id + (i - 1)].node().getComputedTextLength() ;
            };

            temp_obj[that.config.id + i] = svg
                .append("text")
                //.attr("class", name)
                .attr("id", that.config.id)
                .attr("x", x)
                .attr("y", 0)
                .attr("dy", dy)
                .attr("text-anchor", text_anchor)
                .style("font-size", font_size)
                .style("fill", fill)
                .text(str);
        }
    }


    function configure(widget, configuration) {

        that.config = configuration;

        if(that.config.hasOwnProperty("x")){ x = that.config.x } else {x = 0}
        if(that.config.hasOwnProperty("y")){ y = that.config.y } else {y = 0}
        if(that.config.hasOwnProperty("dy")){ dy = that.config.dy } else {dy = 0}
        if(that.config.hasOwnProperty("text-anchor")){ text_anchor = that.config.text_anchor } else {text_anchor = "left"}
        if(that.config.hasOwnProperty("fill")){ fill = that.config.fill } else {fill = controller.config.colorScheme.text_color}


    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");


        write_string(that.config.string_obj)

    }
    that.render = render;

    function update(string_obj) {

        d3.selectAll("#" + that.config.id).remove();

        that.config.string_obj = string_obj;
        write_string(string_obj);

    }
    that.update = update;

    configure(widget, configuration);

    return that;






};


Components.prototype.gauge = function(container, configuration) {

    var self = this;


    var that = {};
    var config = {
        size						: 200,
        clipWidth					: 200,
        clipHeight					: 110,
        ringInset					: 20,
        ringWidth					: 20,

        pointerWidth				: 10,
        pointerTailLength			: 4,
        pointerHeadLengthPercent	: 0.9,

        minValue					: 0,
        maxValue					: 10,

        minAngle					: -90,
        maxAngle					: 90,

        transitionMs				: 750,

        majorTicks					: 4,
        labelFormat					: d3.format(''),
        labelInset					: 20,

        arcColorFn					: d3.interpolateHsl(d3.rgb(configuration.color1), d3.rgb(configuration.color2))
    };
    var range = undefined;
    var r = undefined;
    var pointerHeadLength = undefined;
    var value = 0;

    var svg = undefined;
    var arc = undefined;
    var scale = undefined;
    var ticks = undefined;
    var tickData = undefined;
    var pointer = undefined;

    var donut = d3.layout.pie();

    function addLabels(configuration, container){

        container.append("text")
            .attr("x", configuration.lowLabelx)
            .attr("y", configuration.yTranslate + 40)
            .attr("text-anchor", "left")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.quartile_dark_color_array[0])
            .call(self.wrap, 30, "England Low");

        container.append("text")
            .attr("x", configuration.highLabelx)
            .attr("y", configuration.yTranslate + 40)
            .attr("text-anchor", "right")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.quartile_dark_color_array[3])
            .call(self.wrap, 30, "England High");
    }

    function deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    function newAngle(d) {
        var ratio = scale(d);
        var newAngle = config.minAngle + (ratio * range);
        return newAngle;
    }

    function configure(configuration) {
        var prop = undefined;
        for ( prop in configuration ) {
            config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale that maps domain values to a percent from 0..1
        scale = d3.scale.linear()
            .range([0,1])
            .domain([config.minValue, config.maxValue]);

        //console.log(scale.ticks(config.majorTicks))

        tickString = ["Eng. Low", "", "", "", "Eng. High"];
        ticks = scale.ticks(config.majorTicks)
        tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});

        arc = d3.svg.arc()
            .innerRadius(r - config.ringWidth - config.ringInset)
            .outerRadius(r - config.ringInset)
            .startAngle(function(d, i) {
                var ratio = d * i;
                return deg2rad(config.minAngle + (ratio * range));
            })
            .endAngle(function(d, i) {
                var ratio = d * (i+1);
                return deg2rad(config.minAngle + (ratio * range));
            });
    }
    that.configure = configure;

    function centerTranslation() {
        return 'translate('+r +','+ r +')';
    }

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render(newValue) {
        svg = container
            .append("g")
            .attr("class", "gaugeSVG")
            .attr("transform", "translate(" + configuration.xTranslate + "," + configuration.yTranslate + ")")
            .append('svg')
            .attr('class', 'gauge') //should go in config!!
            .attr("id", "gauge") //should go in config!!
            .attr('width', config.clipWidth)
            .attr('height', config.clipHeight);

        var centerTx = centerTranslation();

        var arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx);

        arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            .attr('fill', function(d, i) {
                return controller.config.colorScheme.quartile_color_array[i]
                //return config.arcColorFn(d * i);
            })
            .attr('d', arc);


        var lineData = [ [config.pointerWidth / 2, 0],
            [0, -pointerHeadLength],
            [-(config.pointerWidth / 2), 0],
            [0, config.pointerTailLength],
            [config.pointerWidth / 2, 0] ];
        var pointerLine = d3.svg.line().interpolate('monotone');
        var pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx)
            .style("fill", controller.config.colorScheme.highlight_color)
            .style("stroke", controller.config.colorScheme.dark_text_color);

        pointer = pg.append('path')
            .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
            .attr('transform', 'rotate(' +config.minAngle +')');

        update(newValue === undefined ? 0 : newValue);
    }
    that.render = render;

    function update(newValue, newConfiguration) {
        if ( newConfiguration  !== undefined) {
            configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + (ratio * range);
        pointer.transition()
            .duration(config.transitionMs)
            .ease('elastic')
            .attr('transform', 'rotate(' +newAngle +')');
    }
    that.update = update;

    configure(configuration);
    addLabels(configuration, container)



    return that;
};


Components.prototype.densityGraph = function(widget, configuration){

    var that = {};

    that.config = {}

    var svg = undefined;
    var xscale = undefined;
    var yscale = undefined;
    var xAxis = undefined;
    var fArea = undefined;
    var fNoData = undefined;
    var density_area = undefined;
    var averages = undefined;

    function getAverages(){

        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var indicatorMapped = widget.indicatorMapped;
        var indicator = widget.indicator;
        var gender = widget.gender;
        var current_period = controller.state.current_period;
        var id = state.current_area;

        var name = controller._get_area_short_name(id);

        var objAverages = [];

        var obj;
        var average;


        if(widget.val == null){
            return [
                {"name": "England", "average": 0},
                {"name":  "Wessex", "average": 0},
                {"name": name, "average": 0}
            ]
        };





        //-----------------
        average =  controller.median(controller.data_obj.ordered_list_obj[areaType][gender][indicatorMapped][current_period])
        obj = {
            "name": "England",
            "average": average
        };
        objAverages.push(obj);
        //-----------------
        //-----------------
        average = controller.median(
            controller.filterDataPeriod(
                areaType,
                gender,
                indicatorMapped,
                current_period
            ).map(function(obj){
                    return obj[config.source.value]
                })
        );
        obj = {
            "name": "Wessex",
            "average": average
        };
        objAverages.push(obj);
        //-----------------
        //-----------------
        average = controller.filterDataPeriodArea(
            areaType,
            gender,
            indicatorMapped,
            current_period,
            id
        )[0][config.source.value];


        obj = {"name": name,
            "average": average
        };

        objAverages.push(obj);
        //-----------------
        objAverages.sort(function (a, b) {return a.average - b.average;});
        return objAverages
    }

    function configure(widget, configuration) {

        that.config = configuration;

        that.config.y_arr = [that.config.compHeight * .4 , that.config.compHeight * 0, that.config.compHeight *.35];
        that.config.text_anchor_arr = ["end", "start", "start"];

        var state = controller.state;

        var areaType = state.areaType;
        var indicator = widget.indicator;
        var indicatorMapped = widget.indicatorMapped;
        var gender = widget.gender;

        //get max value for all years
        var max_density = 0;
        var max_length = 0;
        var obj = controller.data_obj.density_obj[areaType][gender][indicatorMapped];
        for(var year in obj){
            var len = obj[year].length;
            var density = d3.max(obj[year]);
            if(len > max_length){max_length = len}
            if(density > max_density){max_density = density}
        }


        //set the scales
        xscale = d3.scale.linear()
            .range([0, that.config.compWidth])
            .domain([0, max_length]);

        yscale = d3.scale.linear()
            .range([that.config.compHeight, that.config.compHeight * 0.66])
            .domain([0, max_density]);

        //axis
        xAxis = d3.svg.axis()
            .scale(xscale)
            .orient("bottom")
            .tickFormat(d3.format("1g"))
            .outerTickSize(0)
            .ticks(2);


        //area function
        fArea = d3.svg.area()
            .x(function(d, i) { return xscale(i); })
            .y0(function(d) {  return yscale(0) })
            .y1(function(d) { return yscale(d); })
            .interpolate("monotone");

        fNoData = d3.svg.area()
            .x(function() { return that.config.compWidth /2 })
            .y0(function() { return that.config.compHeight })
            .y1(function() { return that.config.compHeight })



    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var indicator = widget.indicator;
        var indicatorMapped = widget.indicatorMapped;
        var gender = widget.gender;
        var current_period = state.current_period;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");


        //add axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.config.compHeight + ")")
            .style("fill", config.colorScheme.text_color)
            .call(xAxis);

        //add density graph as missing data

        density_area = svg
            .datum([])
            .append("path")
            .attr("class", "densityArea")
            .attr("d", fNoData)
            .style("opacity", 1)
            .style("fill", function(){if(widget.val == null) {
                return "none"
            } else {
                return controller.config.colorScheme.quartile_color_array[Math.floor(widget.val.percent * 4)]
            }});



        //add averages
        var self = this;

        averages = getAverages();

        for (i in averages) {

            var name = averages[i].name.trim();

            if(name == "England"){
                id = "England"
            } else if(name == "Wessex"){
                id = "Wessex"
            }else {
                id = "Alt"
            }

            var median = averages[i].average;

            svg.append("line")
                .attr("class", "average_line")
                .attr("id", "average_line_" + id + widget.widgetId)
                .attr("x1", xscale(median))
                .attr("x2", xscale(median))
                .attr("y1", self.height)
                .attr("y2", self.height)
                .style("stroke-width", 2)
                .style("stroke", widget.cs.main_color)
                .style("fill", "none");


            svg.append("text")
                .attr("class", "average_text")
                .attr("id", "average_text_" + id + widget.widgetId)
                .attr("text-anchor", function () {
                    return that.config.text_anchor_arr[i]
                })
                .attr("x", function () {
                    var text_anchor = that.config.text_anchor_arr[i];
                    if (text_anchor == "end") {
                        return xscale(median) - 5
                    } else {
                        return xscale(median) + 5
                    }
                })
                .attr("y", function () {
                    return that.config.y_arr[i]
                })
                .attr("dy", "0.8em")
                .style("fill", function(){if(id == "Alt"){
                    return widget.cs.highlight_text_color
                } else {
                    return widget.cs.text_color
                }
                })
                //.style("fill", self.cs.background_color)
                .text("");


            svg.append("text")
                .attr("class", "average_value")
                .attr("id", "average_value_" + id + widget.widgetId)
                .attr("text-anchor", function () {
                    return that.config.text_anchor_arr[i]
                })
                .attr("x", function () {
                    var text_anchor = that.config.text_anchor_arr[i];
                    if (text_anchor == "end") {
                        return xscale(median) - 10
                    } else {
                        return xscale(median) + 10
                    }
                })
                .attr("y", function () {
                    return that.config.y_arr[i]
                })
                .attr("dy", "1.8em")
                .style("fill", function(){if(id == "Alt"){
                    return widget.cs.highlight_text_color
                } else {
                    return widget.cs.text_color
                }
                })
                //.style("fill", self.cs.background_color)
                .style("font-size", "1.5em")
                .text("");
        }

    }
    that.render = render;


    function update(widget) {

        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var indicator = widget.indicator;
        var indicatorMapped = widget.indicatorMapped;
        var gender = widget.gender;
        var current_period = state.current_period;

        if(widget.val == null){

            density_area
                .transition()
                .duration(500)
                .style("opacity", 0)


            density_area
                .transition()
                .delay(500)
                .duration(0)
                .attr("d", fNoData)
                .delay(500)
                .duration(0)
                .style("opacity", 1)

            for (i in averages) {

                var name = averages[i].name;

                if(name == "England"){
                    id = "England"
                } else if(name == "Wessex"){
                    id = "Wessex"
                }else {
                    id = "Alt"
                }

                d3.select("#average_line_" + id )
                    .transition()
                    .duration(500)
                    .attr("y1", self.height)
                    .attr("y2", self.height)

                d3.select("#average_text_" + id)
                    .transition()
                    .duration(1000)
                    .text("")


                d3.select("#average_value_" + id)
                    .transition()
                    .duration(1000)
                    .text("");

            }

             for (i in averages) {

                var name = averages[i].name.trim();

                if (name == "England") {
                    id = "England"
                } else if (name == "Wessex") {
                    id = "Wessex"
                } else {
                    id = "Alt"
                }

                var median = averages[i].average;

                d3.select("#average_line_" + id + widget.widgetId)
                    .transition()
                    .duration(500)
                    .attr("y1", that.config.compHeight)
                    .attr("y2", that.config.compHeight);

                d3.select("#average_text_" + id + widget.widgetId)
                    .transition()
                    .duration(500)
                    .text("");

                d3.select("#average_value_" + id + widget.widgetId)
                    .transition()
                    .duration(500)
                    .text("");

            }


            return
        }

        var densityArray = controller.data_obj.density_obj[areaType][gender][indicatorMapped][current_period];

        density_area
            .datum(densityArray)
            .transition()
            .duration(750)
            .style("fill", function(){return controller.config.colorScheme.quartile_color_array[Math.floor(widget.val.percent * 4)]})
            .style("opacity", 1)
            .attr("d", fArea);

        averages = getAverages();

        for (i in averages) {

            var name = averages[i].name.trim();

            if (name == "England") {
                id = "England"
            } else if (name == "Wessex") {
                id = "Wessex"
            } else {
                id = "Alt"
            }

            var median = averages[i].average;

            
            //round dp depending on value
            median = controller.value_round(median)  


            d3.select("#average_line_" + id + widget.widgetId)
                .transition()
                .duration(500)
                .attr("x1", xscale(median))
                .attr("x2", xscale(median))
                .attr("y1", that.config.compHeight - 1)
                .attr("y2", function(){return that.config.y_arr[i]});

            d3.select("#average_text_" + id + widget.widgetId)
                .transition()
                .duration(500)
                .attr("text-anchor", function () {
                    return that.config.text_anchor_arr[i]
                })
                .attr("x", function () {
                    var text_anchor = that.config.text_anchor_arr[i];
                    if (text_anchor == "end") {
                        return xscale(median) - 5
                    } else {
                        return xscale(median) + 5
                    }
                })
                .attr("y", function () {
                    return that.config.y_arr[i]
                })
                .text(name);

            d3.select("#average_value_" + id + widget.widgetId)
                .transition()
                .duration(500)
                .attr("text-anchor", function () {
                    return that.config.text_anchor_arr[i]
                })
                .attr("x", function () {
                    var text_anchor = that.config.text_anchor_arr[i];
                    if (text_anchor == "end") {
                        return xscale(median) - 10
                    } else {
                        return xscale(median) + 10
                    }
                })
                .attr("y", function () {
                    return that.config.y_arr[i]
                })
                .text(median);
        }



    }
    that.update = update;

    //that.update(widget) //update as orignially rendered as no data



    configure(widget, configuration);

    return that;



};


Components.prototype.lineGraph = function(widget, configuration){

    var that = {};

    that.config = {};

    var svg = undefined;
    var data = undefined;
    var data_period = undefined;
    var xscale = undefined;
    var yscale = undefined;
    var xAxis = undefined;
    var yAxis = undefined;
    var period_arr = undefined;
    var max_y_value = undefined;
    var max_y_value_width = undefined;
    var fLine = undefined;
    var vArr = undefined;



    function dot_click(d){

        var config = controller.config;

        controller._period_change(d[config.source.period]);
        //controller._area_change(d[config.source.id]);

    }

    function getVerticalLineCoords(){

        x1 = xscale(period_arr.indexOf(controller.state.current_period));
        x2 = xscale(period_arr.indexOf(controller.state.current_period));

        if(widget.data_area.length == 0) {
            y1 = that.config.compHeight / 2;
            y2 = that.config.compHeight / 2;
        } else {
            y1 = that.config.compHeight;
            y2 = that.config.compHeight * 0.1;
        }

        return [[x1, y1], [x2, y2]]
    }



    function configure(widget, configuration) {

        that.config = configuration;

        var config = controller.config;
        var state = controller.state;

        max_y_value = d3.max(widget.data.map(function(obj){return obj[config.source.value]}));
        max_y_value_width = String(max_y_value.toFixed(0)).length * 10;


        period_arr = [];
        var y = config.firstPeriod;
        while(y <= config.lastPeriod){
            period_arr.push(y);
            y += 1;
        }

        //calcualate constant origin shift
        var origin_shift_x = max_y_value_width;
        var tick_width_x = that.config.compWidth / (period_arr.length - 1);

        xscale = d3.scale.linear()
            .range([0, that.config.compWidth])
            .domain([-(origin_shift_x/tick_width_x), period_arr.length - 1]);

        yscale = d3.scale.linear()
            .range([0, that.config.compHeight])
            .domain([ max_y_value * 1.25, 0]);


        xAxis = d3.svg.axis()
            .scale(xscale)
            .orient("bottom")
            .outerTickSize(0)
            .tickFormat(function(d, i){
                if(d === parseInt(d, 10)){ //we can only map integers to time periods otherwise return blank
                    return period_arr[d]
                } else {
                    return ""
                }})
            .ticks(period_arr.length/2); //set max 5 ticks otherwise every other



        yAxis = d3.svg.axis()
            .scale(yscale)
            .orient("left")
            .tickFormat(d3.format("1g"))
            .outerTickSize(0)
            .ticks(5);


        // Define the line
        fLine = d3.svg.line()
            .defined(function(d) {return !isNaN(d[config.source.value]); })
            .x(function(d, i) {return xscale(period_arr.indexOf(d[config.source.period]));})
            .y(function(d) {return yscale(d[config.source.value]);});



        //get coords for vertical time line
        vArr = getVerticalLineCoords()




    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        var config = controller.config;
        var state = controller.state;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.config.compHeight + ")")
            .style("fill", config.colorScheme.text_color)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("  + max_y_value_width / 2 + ", 0)")
            .style("fill", config.colorScheme.text_color)
            .call(yAxis);

        //svg.append("text")
        //    .attr("class", "x-label")
        //    .attr("text-anchor", "end")
        //    .attr("x", that.config.compWidth - 20)
        //    .attr("y", that.config.compHeight + 40)
        //    .text("Year");



        svg.append("line")
            .attr("id", "verticalTimeLine" + widget.widgetId )
            .style("stroke-width", 2)
            .style("stroke", widget.cs.text_color)
            .style("fill", "none")
            .attr("x1", vArr[0][0])
            .attr("x2", vArr[1][0])
            .attr("y1", vArr[0][1])
            .attr("y2", vArr[1][1]);





        svg.append("path")
            .datum(widget.data_area)
            .attr("class", "line timeLine")
            .attr("id", "line" +  widget.widgetId) // assign ID
            .attr("d", fLine)
            .style("stroke", widget.cs.highlight_color)
            .style("stroke-width", 2)
            .style("fill", "none")
            //.on("click", function() { self._line_click(self, d.key)});

        svg.selectAll(".timeDot")
            .data(widget.data_area)
            .enter()
            .append("circle")
            .attr("class", "dots" + widget.widgetId + " clickable")
            .attr("id", "timeDots" + widget.widgetId)
            .attr("cx", function(e, i){return xscale(period_arr.indexOf(e[config.source.period]))})
            .attr("cy", function(e){ return yscale(e[config.source.value])})
            .style("stroke", widget.cs.background_color)
            .attr("r", 4)
            .style("stroke-width", 1)
            .style("fill", widget.cs.highlight_color)
            .on("click", dot_click);



    }
    that.render = render;


    function update(widget) {

        var config = controller.config;

        vArr = getVerticalLineCoords();

        d3.select("#verticalTimeLine" + widget.widgetId )
            .transition()
            .duration(500)
            .ease("exp")
            .attr("x1", vArr[0][0])
            .attr("x2", vArr[1][0])
            .attr("y1", vArr[0][1])
            .attr("y2", vArr[1][1]);


        d3.select("#line" + widget.widgetId )
            .datum(widget.data_area)
            .transition()
            .duration(750)
            .attr("d", fLine);

        console.log("***********")
        for(var i in widget.data_area){
            console.log(widget.data_area[i].Map_Period)
        }

        //todo dots disapear when number of data points change

        d3.selectAll("#timeDots" + widget.widgetId)
            .style("opacity", 0)
            .data(widget.data_area)
            .style("opacity", 1)
            .transition()
            .duration(750)
            .attr("cx", function(e, i){return xscale(period_arr.indexOf(e[config.source.period]))})
            .attr("cy", function(e){console.log(yscale(e[config.source.value])); return yscale(e[config.source.value])})

    }
    that.update = update;


    configure(widget, configuration);

    return that;

};


Components.prototype.timeSlider = function(widget, configuration){

    var that = {};

    that.config = {};

    var svg = undefined;
    var xscale = undefined;
    var xAxis = undefined;

    var brush = undefined;
    var handle = undefined;
    var slider = undefined;


    function configure(widget, configuration) {

        var self = this;
        that.config = configuration;

        var config = controller.config;
        var state = controller.state;

        var current_period = state.current_period;

        xscale = d3.scale.linear()
            .domain([that.config.firstPeriod - 0.25, that.config.lastPeriod + 0.25 ])
            .range([0, that.config.compWidth])
            .clamp(true);

        xAxis = d3.svg.axis()
            .scale(xscale)
            .orient("bottom")
            .tickFormat(function(d) {return d;})
            .tickSize(0)
            .tickPadding(12)
            .tickValues([Math.round(xscale.domain()[0]), Math.round(xscale.domain()[1])]);


        brush = d3.svg.brush()
            .x(xscale)
            .extent([controller.state.current_period, controller.state.current_period])
            .on("brush", function() {

                var value = brush.extent()[0];



                if (d3.event.sourceEvent && d3.mouse(this)[1] > 0) { // not a programmatic event & not help button
                    value = xscale.invert(d3.mouse(this)[0]);
                    brush.extent([value, value]);
                }

                handle.attr("transform", "translate(" + xscale(Math.round(value)) + ",0)");
                handle.select('text').text(Math.round(value));

                controller._period_change(Math.round(value));
            });


    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var indicator = widget.indicator;
        var indicatorMapped = widget.indicatorMapped;
        var gender = widget.gender;
        var current_period = state.current_period;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        svg.append("g")
            .attr("class", "slider x axis")
            .attr("transform", "translate(0," + that.config.compHeight + ")")
            .style("stroke", config.colorScheme.main_color)
            .call(xAxis)
            .select(".domain")
            .select(function() {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "halo")




        slider = svg.append("g")
            .attr("class", "slider")
            //.style("stroke", config.colorScheme.text_color)
            .call(brush);

        slider.selectAll(".extent,.resize")
            .remove();

        slider.select(".background")
            .attr("height", that.config.compHeight);

        handle = slider.append("g")
            .attr("class", "handle clickable");


        handle.append("path")
            .attr("transform", "translate(0," + that.config.compHeight  + ")")
            .style("stroke", config.colorScheme.text_color)
            .attr("d", "M 0 -10 V 10");

        handle.append('text')
            .text(xscale(current_period))
            .style("stroke", config.colorScheme.text_color)
            .style("fill", config.colorScheme.text_color)
            .attr("transform", "translate(" + (-18) + " ," + (that.config.compHeight - 15) + ")");

        slider
            .call(brush.event)

    }
    that.render = render;

    function update() {

        var value = controller.state.current_period;
        handle.transition()
            .duration(500)
            .ease("exp")
            .attr("transform", "translate(" + xscale(Math.round(value)) + ",0)");
        handle.select('text').text(Math.round(value));

    }
    that.update = update;

    ee.addListener("update", update);

    configure(widget, configuration);

    return that;

};


Components.prototype.map = function(widget, configuration){

    var that = {};

    that.config = {};

    var svg = undefined;
    var map = undefined;
    var topojson_data = undefined;
    var projection = undefined;
    var path = undefined;
    var feature = undefined;

    function feature_click(d){
        controller._area_change(d.properties.id)

    }


    function configure(widget, configuration) {

        var self = this;
        that.config = configuration;

        var config = controller.config;
        var state = controller.state;

        topojson_data = controller.data_obj.topojson_obj[state.areaType];


        projection = d3.geo.albers()
            .center([2.05, 51.45])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(that.config.compWidth * 45)
            .translate([that.config.compWidth / 4, that.config.compHeight / 4]);

        path = d3.geo.path()
            .projection(projection);

        features = topojson.feature(topojson_data, topojson_data.objects.collection).features;

    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        var config = controller.config;
        var state = controller.state;

        var current_area = state.current_area;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        map = svg.selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("class", "feature clickable")
            .attr("id", function(d){ return "feature" + d.properties.id + widget.widgetId})
            .attr("d", path)
            .style(that.config.style)
            .on("click", feature_click);

        d3.select("#feature" + state.current_area + widget.widgetId).moveToFront();


    }
    that.render = render;

    function update() {

        var state = controller.state;

        map.transition()
            .duration(300)
            .style(that.config.style)

        d3.select("#feature" + state.current_area + widget.widgetId).moveToFront();
    }
    that.update = update;

    ee.addListener("update", update)

    configure(widget, configuration);

    return that;

};


Components.prototype.barGraph = function(widget, configuration){

    var that = {};

    that.config = {};

    var svg = undefined;
    var chart_left = undefined;
    var chart_right = undefined;
    var xscale = undefined;
    var yscale = undefined;
    var background_bars_right = undefined;
    var background_bars_left = undefined;
    var bars = undefined;
    var label = undefined;
    var label_value = undefined;

    function validate_NaN_to_0(val){
        if(isNaN(val)) return 0; else return Number(val);
    };

    function select_color(d){

        var config = controller.config;
        var state = controller.state;

        var id = d[config.source.id];

        if(id == state.current_area){ //always highlight
            return widget.cs.highlight_color
        }

        var index = state.current_secondary_areas.indexOf(id); //get color
        if(index == -1){
            return widget.cs.main_color_offset
        } else {
            //repeat colors
            while(index >= state.secondary_areas_colors.length){
                index -= state.secondary_areas_colors.length;
            }
            return state.secondary_areas_colors[index]
        }
    };

    function select_text_color(d){

        var config = controller.config;
        var state = controller.state;

        var id = d[config.source.id];

        if(id == state.current_area){ //always highlight
            return widget.cs.highlight_text_color
        } else {
            return widget.cs.text_color
        }
    };

    function bar_click(d){
        controller._area_change(d[controller.config.source.id]);
    };


    function calc_xscale(widget){

        var config = controller.config;

        return d3.scale.linear()
            .range([0, that.config.compWidth])
            .domain([0, d3.max(widget.data_period, function (d) {return validate_NaN_to_0(d[config.source.value]);})]);
    }


    function configure(widget, configuration) {

        that.config = configuration;

        var config = controller.config;
        var state = controller.state;

        that.config.middle = widget.width / 2;
        that.config.margin_middle = 2;

        //adjust height of bar graph for more lines
        var y0 = 0;
        var y1 = that.config.compHeight;

        if(widget.data_period.length > 7 && widget.data_period.length <= 15){
            y1 += 21;
        }else if( widget.data_period.length > 15){
            y1 += 42;
        }

        yscale = d3.scale.ordinal()
            .rangeRoundBands([y0, y1], .14, .2)
            .domain( widget.data_period.map(function (d) {return d[config.source.name];}));


        that.config.margin_middle = yscale.rangeBand() * 0.14;

        xscale = calc_xscale(widget);

    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        var self = this;
        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var indicator = state.indicator;
        var genderType = state.genderType;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        chart_left = svg
            .append('g')
            .attr("transform", "translate(-" + that.config.margin_middle / 2  + ",0)");

        chart_right = svg
            .append('g')
            .attr("transform", "translate(" + (that.config.middle + that.config.margin_middle / 2) + ",0)");


        var data = widget.data_period;

        background_bars_right = chart_right.selectAll(".background_bar_right")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "background_bar_right clickable")
            .attr("x", 0)
            .attr("y", function (d, i) {return yscale(d[config.source.name])})
            .attr("width",  that.config.middle  )
            .attr("height", function (d, i) {return yscale.rangeBand()})
            .style("fill", "white") //config file???
            .style("stroke-width", "0")
            .on("click", bar_click.bind(this));


        bars = chart_right.selectAll(".foreground bar") //???need to add ids
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "foreground bar clickable")
            .attr("x", 0)
            .attr("y", function (d, i) {return yscale(d[config.source.name])})

            .attr("height", function (d, i) {return yscale.rangeBand()})
            .style("stroke-width", "0")
            .style("fill", function(d){ return select_color(d)})
            .attr("width", function (d, i) {
                if(widget.data_period.length == 0){
                    return 0
                } else {
                    return xscale(validate_NaN_to_0(d[config.source.value]))
                }
            })
            .on("click", bar_click.bind(this));


        background_bars_left = chart_left.selectAll(".background_bar_left")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "background_bar_left clickable" )
            .attr("x", 0)
            .attr("y", function (d, i) {return yscale(d[config.source.name])})
            .attr("width",  that.config.compWidth )
            .attr("height", function (d, i) {return yscale.rangeBand()})
            .style("stroke-width", "0")
            .style("fill", function(d){ return select_color(d)})
            .on("click", bar_click.bind(this));


        label = chart_left.selectAll(".name text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "name text clickable")
            .attr("x", "0.5em")
            .attr("y", function (d, i) {return (yscale(d[config.source.name]) + yscale(d[config.source.name]) + yscale.rangeBand()) / 2})
            .attr("dy", "0.4em")
            .text(function(d, i){return controller._get_area_name(d[config.source.id])})
            .style("font-size", "0.8em")
            .style("font-weight", "bold")
            .style("fill",function(d){ return select_text_color(d)})
            .text(function(d, i){
                if(widget.data_period.length == 0) {
                    return "NA"
                } else {
                    return controller._get_area_short_name(d[config.source.id])
                }
            })
            .on("click", bar_click.bind(this));

        var format = d3.format("1g")

        label_value = chart_left.selectAll(".value text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "name text clickable")
            .attr("x", that.config.compWidth - 7)
            .attr("y", function (d, i) {return (yscale(d[config.source.name]) + yscale(d[config.source.name]) + yscale.rangeBand()) / 2})
            .attr("dy", "0.4em")
            .text(function(d, i){return d[config.source.value].toFixed(0)})
            .style("text-anchor", "end")
            .style("font-size", "0.8em")
            .style("font-weight", "bold")
            .style("fill",function(d){ return select_text_color(d)})
            .on("click", bar_click.bind(this));

    }
    that.render = render;


    function update(widget) {

        var self = this;
        var config = controller.config;

        xscale = calc_xscale(widget);

        bars
            .data(widget.data_period)
            .transition("barfill")
            .duration(500)
            .style("fill", function(d){ return select_color(d)});

        background_bars_left
            .data(widget.data_period)
            .transition()
            .duration(500)
            .style("fill", function(d){ return select_color(d)});


        if(widget.data_period.length == 0){
            bars
                .transition("barshift")
                .duration(500)
                .attr("width",0);

            label_value
                .transition()
                .duration(500)
                .text("NA");

        } else {
            bars
                .data(widget.data_period)
                .transition("barshift")
                .duration(500)
                .attr("width", function (d, i) {return xscale(validate_NaN_to_0(d[config.source.value]))});

            label_value
                .data(widget.data_period)
                .transition()
                .duration(500)
                .text(function(d, i){return d[config.source.value].toFixed(0)});
        }

        //label_value
        //    .data(widget.data_period)
        //    .transition()
        //    .duration(500)
        //    .text(function(d, i){return d[config.source.value].toFixed(0)});

        label
            .transition()
            .duration(500)
            .style("fill",function(d){ return select_text_color(d)});


        label_value
            .transition()
            .duration(500)
            .style("fill",function(d){ return select_text_color(d)});



    }
    that.update = update;


    configure(widget, configuration);

    return that;

};


Components.prototype.multiLineGraph = function(widget, configuration){

    var that = {};

    that.config = {};

    var svg = undefined;
    var data = undefined;
    var dataNest = undefined;
    //var data_period = undefined;
    var xscale = undefined;
    var yscale = undefined;
    var xAxis = undefined;
    var yAxis = undefined;
    var period_arr = undefined;
    var max_y_value = undefined;
    var max_y_value_width = undefined;
    var fLine = undefined;
    var vArr = undefined;


    function dot_click(d){
        var config = controller.config;
        controller._period_change(d[config.source.period]);
        controller._area_change(d[config.source.id]);
    }

    function line_click(id){
        controller._area_change(id);
    }


    function getVerticalLineCoords(){

        x1 = xscale(period_arr.indexOf(controller.state.current_period));
        x2 = xscale(period_arr.indexOf(controller.state.current_period));

        if(widget.data_area.length == 0) {
            y1 = that.config.compHeight / 2;
            y2 = that.config.compHeight / 2;
        } else {
            y1 = that.config.compHeight;
            y2 = that.config.compHeight * 0.1;
        }

        return [[x1, y1], [x2, y2]]
    }

    function nestData(data, nestField){
        var config = controller.config;
        return d3.nest()
            .key(function(d){return d[nestField]})
            .sortValues(function(a, b){return a[config.source.period] - b[config.source.period]})
            .entries(data);
    }

     function select_color(id){

         var state = controller.state;

         //always highlight selected area
         if(id == state.current_area){ return widget.cs.highlight_color}


         //if all selected = true return main color
         if(widget.select_all){ return widget.cs.main_color }

         var index = state.current_secondary_areas.indexOf(id); //get color

         if(index == -1){
            return widget.cs.main_color
         } else {
             //repeat colors
             while(index >= state.secondary_areas_colors.length){
                index -= state.secondary_areas_colors.length;
            }
            return state.secondary_areas_colors[index]
         }

     }

     function select_line_stroke_width(id){
         var state = controller.state;

         //always highlight selected area
         if(id == state.current_area){ return 4 }

        //if all selected = true return normal
         if(widget.select_all){ return 2 }

         var index = state.current_secondary_areas.indexOf(id); //get color
         if(index == -1){
            return 0; //don't show
         } else {
            return 2
         }
     }

     function select_dot_stroke_width(id){

         var state = controller.state;

         //always highlight
         if(id == state.current_area){ return 2 }

         //if all selected = true return normal
         if(widget.select_all){ return 1 }

         var index = state.current_secondary_areas.indexOf(id); //get color
         if(index == -1){
            return 0 //don't show
         } else {
            return 1
         }
     }

     select_dot_radius = function(id){

         var state = controller.state;

         //always highlight
         if(id == state.current_area){ return 5 }

        //if all selected = true return normal
         if(widget.select_all){ return 4 }

         var index = state.current_secondary_areas.indexOf(id); //get color
         if(index == -1){
            return 0 //don't show
         } else {
            return 4
        }
     };


    function configure(widget, configuration) {

        that.config = configuration;

        var config = controller.config;
        var state = controller.state;

        //console.log(widget)

        dataNest = nestData(widget.data, config.source.id);

        max_y_value = d3.max(widget.data.map(function(obj){return obj[config.source.value]}));
        max_y_value_width = String(max_y_value.toFixed(0)).length * 10;

        period_arr = [];
        var y = config.firstPeriod;
        while(y <= config.lastPeriod){
            period_arr.push(y);
            y += 1;
        }

        //calcualate constant origin shift
        var origin_shift_x = max_y_value_width;
        var tick_width_x = that.config.compWidth / (period_arr.length - 1);

        xscale = d3.scale.linear()
            .range([0, that.config.compWidth])
            .domain([-(origin_shift_x/tick_width_x), period_arr.length - 1]);

        yscale = d3.scale.linear()
            .range([0, that.config.compHeight])
            .domain([ max_y_value * 1.25, 0]);


        xAxis = d3.svg.axis()
            .scale(xscale)
            .orient("bottom")
            .outerTickSize(0)
            .tickFormat(function(d, i){
                if(d === parseInt(d, 10)){ //we can only map integers to time periods otherwise return blank
                    return period_arr[d]
                } else {
                    return ""
                }})
            .ticks(period_arr.length/2); //set max 5 ticks otherwise every other



        yAxis = d3.svg.axis()
            .scale(yscale)
            .orient("left")
            .tickFormat(d3.format("1g"))
            .outerTickSize(0)
            .ticks(5);


        // Define the line
        fLine = d3.svg.line()
            .defined(function(d) {return !isNaN(d[config.source.value]); })
            .x(function(d, i) {return xscale(period_arr.indexOf(d[config.source.period]));})
            .y(function(d) {return yscale(d[config.source.value]);});


        //get coords for vertical time line
        vArr = getVerticalLineCoords()




    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        var config = controller.config;
        var state = controller.state;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.config.compHeight + ")")
            .style("fill", config.colorScheme.text_color)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("  + max_y_value_width / 2 + ", 0)")
            .style("fill", config.colorScheme.text_color)
            .call(yAxis);

        svg.append("line")
            .attr("id", "verticalTimeLine" + widget.widgetId )
            .style("stroke-width", 2)
            .style("stroke", widget.cs.text_color)
            .style("fill", "none")
            .attr("x1", vArr[0][0])
            .attr("x2", vArr[1][0])
            .attr("y1", vArr[0][1])
            .attr("y2", vArr[1][1]);


        dataNest.forEach(function(d, i){

            var id = d.key

            svg.append("path")
                .attr("class", "line timeLine clickable")
                .attr("id", "line" + d.key + widget.widgetId) // assign ID
                .attr("d", fLine(d.values))
                .style("stroke", function(){return select_color(d.key)})
                .style("stroke-width", function(){return select_line_stroke_width(d.key)})
                .style("fill", "none")
                .on("click", function() { line_click(d.key)});

            svg.selectAll(".timeDot")
                .data(d.values)
                .enter()
                .append("circle")
                .attr("class", "dots" + d.key +  widget.widgetId + " clickable")
                .attr("id", "timeDots" + d.key + widget.widgetId)
                .attr("cx", function(e, i){return xscale(period_arr.indexOf(e[config.source.period]))})
                .attr("cy", function(e){ return yscale(e[config.source.value])})
                .style("stroke", widget.cs.background_color)
                .attr("r", function(){return select_dot_radius(d.key)})
                .style("stroke-width", function(){return select_dot_stroke_width(d.key)})
                .style("fill", function(){return select_color(d.key)})
                .on("click", dot_click);



        });

        d3.select("#line" + state.current_area  + widget.widgetId).moveToFront();
        d3.selectAll(".dots" + state.current_area  + widget.widgetId).moveToFront();

    }
    that.render = render;


    function update(widget) {

        var config = controller.config;
        var state = controller.state;

        vArr = getVerticalLineCoords();

        d3.select("#verticalTimeLine" + widget.widgetId )
            .transition()
            .duration(500)
            .ease("exp")
            .attr("x1", vArr[0][0])
            .attr("x2", vArr[1][0])
            .attr("y1", vArr[0][1])
            .attr("y2", vArr[1][1]);


        d3.select("#line" + state.current_area + widget.widgetId).moveToFront();
        d3.selectAll(".dots" + state.current_area + widget.widgetId).moveToFront();

        dataNest = nestData(widget.data, config.source.id);

        dataNest.forEach(function(d, i){

            d3.select("#line" + d.key + widget.widgetId)
                .transition()
                .duration(750)
                .style("stroke", function(){return select_color(d.key)})
                .style("stroke-width", function(){return select_line_stroke_width(d.key)})

            d3.selectAll(".dots" + d.key + widget.widgetId)
                .transition()
                .duration(750)
                .attr("r", function(){return select_dot_radius(d.key)})
                .style("stroke-width", function(){return select_dot_stroke_width(d.key)})
                .style("fill", function(){return select_color(d.key)});
        });
    }
    that.update = update;


    configure(widget, configuration);

    return that;

};


Components.prototype.circleButton = function(widget, configuration){

    var self = this;
    var that = {};
    that.config = {};

    var svg = undefined;
    var x = undefined;
    var y = undefined;
    var r = undefined;
    var margin = undefined;
    var icon = undefined;
    var clicked = undefined;
    var font_size = undefined;
    var stroke_width = undefined;
    var color = undefined;
    var background_color = undefined;
    var opacity = undefined;
    var component_class = undefined;
    var component_id = undefined;

    function mouseDown(){
        svg.transition()
            .duration(100)
            .attr("transform", "translate(0,1)")
            //.style("opacity", 0.5);
    }

    function mouseUp(){
        svg.transition()
            .duration(100)
            .attr("transform", "translate(-0,-1)")
            //.style("opacity", opacity);
    }

    function configure(widget, configuration) {

        that.config = configuration;
        x = that.config.x;
        y = that.config.y;
        r = that.config.r;
        margin = that.config.margin;
        icon = that.config.icon;
        clicked = that.config.clicked;

        if(that.config.hasOwnProperty("font_size")){ font_size = that.config.font_size } else {font_size = "1em"}
        if(that.config.hasOwnProperty("stroke_width")){ stroke_width = that.config.stroke_width } else {stroke_width = 1}
        if(that.config.hasOwnProperty("color")){ color = that.config.color } else {color = widget.cs.text_color}
        if(that.config.hasOwnProperty("background_color")){ background_color = that.config.background_color } else {background_color = "white"}
        if(that.config.hasOwnProperty("opacity")){ opacity = that.config.opacity } else {opacity = 1}


        component_class = "circle_button clickable";
        if(that.config.hasOwnProperty("component_class")){ component_class += " " + that.config.component_class }

        if(that.config.hasOwnProperty("component_id")){ component_id = that.config.component_id }



    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        svg = widget._chart.append("g")
            .attr("class", "test")
            .style("opacity", opacity);

        if(component_class != undefined){
            svg.attr("class", component_class)
        }

        if(component_id != undefined){
            svg.attr("id", component_id)
        }

        if(controller.state.pdf){ //this is a button hide from pdf
            svg.classed("pdf_hide", true)
        }

        svg.append("circle")
            //.attr("class", "circle_button clickable")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", r)
            //.style("fill", widget.cs.highlight_text_color)
            .style("fill", background_color)
            .style("stroke", color )
            .style("stroke-width", stroke_width)

            .on("mousedown", mouseDown)
            .on("mouseup", mouseUp)
            .on("click", clicked.bind(widget));

        svg.append('text')
            //.attr("class", "clickable")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", margin)
            .attr("text-anchor", "middle")
            .attr('font-family', 'FontAwesome')
            .style("font-size", font_size)
            .style("fill", color)
            //.style("opacity", opacity)
            //.style("stroke", 0)
            .text(icon)
            .on("mousedown", mouseDown)
            .on("mouseup", mouseUp)
            .on("click", clicked.bind(widget));
    }

    that.render = render;

    configure(widget, configuration);

    return that;
};


Components.prototype.selectBar = function(widget, configuration){

    var that = {};

    that.config = {};

    var svg = undefined;
    var xscale = undefined;
    var yscale = undefined;
    var select_all_bar = undefined;
    var select_all_text = undefined;
    var background_bars = undefined;
    var label = undefined;

    function select_all_color(){
        if(widget.select_all){
            return widget.cs.main_color_offset
        } else {
            return "white"
        }
    }
    function select_color(d){

        var config = controller.config;
        var state = controller.state;

        var id = d[config.source.id];

        if(id == state.current_area){ //always highlight
            return widget.cs.highlight_color
        }

        var index = state.current_secondary_areas.indexOf(id); //get color

        if(index == -1 && widget.select_all == false) {
            return "white" //widget.cs.main_color
        } else if (index == -1 && widget.select_all == true) {
            return widget.cs.main_color_offset
        } else {
            //repeat colors
            while(index >= state.secondary_areas_colors.length){
                index -= state.secondary_areas_colors.length;
            }
            return state.secondary_areas_colors[index]
        }
    }

    function select_text_color(d){

        var config = controller.config;
        var state = controller.state;

        var id = d[config.source.id];

        if(id == state.current_area){ //always highlight
            return widget.cs.highlight_text_color
        } else {
            return widget.cs.text_color
        }
    }


    function select_all_lines(){

        //switch state
        if(widget.select_all){
            widget.select_all = false;
        }else{
            widget.select_all = true;
            controller.state.current_secondary_areas = []; //clear the selected areas
        }

        controller._secondary_area_change();

    }

    function select_all_string(){
        if(widget.select_all == true){
            return "Remove All"
        } else {
            return "Select All"
        }

    }


    function select_line(d){

        var config = controller.config;
        var state = controller.state;

        //always set all selected to false
        widget.select_all = false;

        var id = d[config.source.id];

        //check if area is secondary area
        var index = state.current_secondary_areas.indexOf(id);
        if(index == -1){
            state.current_secondary_areas.push(id)
        } else {
            state.current_secondary_areas.splice(index, 1)
        }

        //this._set_selection_color();
        controller._secondary_area_change();

    }


    function configure(widget, configuration) {

        that.config = configuration;

        var config = controller.config;
        var state = controller.state;


        //adjust height of bar graph for more lines
        var y0 = 0;
        var y1 = that.config.compHeight;

        if(widget.data_period.length > 7 && widget.data_period.length <= 15){
            y1 += 21;
        }else if( widget.data_period.length > 15){
            y1 += 42;
        }

        yscale = d3.scale.ordinal()
            .rangeRoundBands([y0, y1], .14, .2)
            .domain( widget.data_period.map(function (d) {return d[config.source.name];}));


        that.config.margin_middle = yscale.rangeBand() * 0.14;

        //xscale = calc_xscale(widget);




    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        var self = this;
        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var indicator = state.indicator;
        var genderType = state.genderType;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");


        var data = widget.data_period;



        select_all_bar = svg
            .append("rect")
            .attr("class", "background bar clickable")
            .attr("id", "select_all_bar" + widget.widgetId)
            .attr("x", 0)
            .attr("y",function () {return - yscale.rangeBand() * 0.9})//0.9 reflects range bound margin 0.2
            .attr("width", widget.width)
            .attr("height", function () {return yscale.rangeBand()})
            .style("fill", function(){return select_all_color()})
            .style("stroke-width", "0")
            .on("click", select_all_lines);

        select_all_text = svg
            .append("text")
            .attr("x", "0.5em")
            .attr("y", function (d, i) {return -0.45 *  yscale.rangeBand()})//0.45 reflects range bound margin 0.2
            .attr("dy", "0.4em")
            .text(function(){return select_all_string()})
            .style("font-size", "0.8em")
            .style("font-weight", "bold")
            .style("fill", widget.cs.dark_text_color)
            .on("click", select_all_lines );

        background_bars = svg.selectAll(".background_bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "background_bar clickable" )
            .attr("x", 0)
            .attr("y", function (d, i) {return yscale(d[config.source.name])})
            .attr("width",  that.config.compWidth )
            .attr("height", function (d, i) {return yscale.rangeBand()})
            .style("stroke-width", "0")
            .style("fill", function(d){ return select_color(d)})
            .on("click", select_line);


        label = svg.selectAll(".name text")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "name text clickable")
            .attr("x", "0.5em")
            .attr("y", function (d, i) {return (yscale(d[config.source.name]) + yscale(d[config.source.name]) + yscale.rangeBand()) / 2})
            .attr("dy", "0.4em")
            .text(function(d, i){return controller._get_area_name(d[config.source.id])})
            .style("font-size", "0.8em")
            .style("font-weight", "bold")
            .style("fill", function(d){ return select_text_color(d)})
            .text(function(d){return controller._get_area_short_name(d[config.source.id])})
            .on("click",select_line);


    }
    that.render = render;


    function update() {



        var self = this;
        var config = controller.config;

        select_all_text
            .text(function(){return select_all_string()});

        select_all_bar
            .transition()
            .duration(500)
            .style("fill", function(){return select_all_color()});


        background_bars = svg.selectAll(".background_bar")
            .transition()
            .duration(500)
            .style("fill", function(d){ return select_color(d)});

        label
            .transition()
            .duration(500)
            .style("fill", function(d){ return select_text_color(d)});
    }
    that.update = update;

    ee.addListener("update", update);

    configure(widget, configuration);

    return that;

};


Components.prototype.tartanRug = function(widget, configuration){

    var self = this;

    var that = {};

    that.config = {};

    var svg = undefined;
    var xscale = undefined;
    var yscale = undefined;

    var areaList = undefined;
    var indicatorArr = undefined;

    var name_bars = undefined;
    var name_labels = undefined;

    var indicator_bars = undefined;
    var indicator_labels = undefined;

    var data_bars = undefined;


    function name_click(d){
        controller._area_change(d);
    }

    function value_click(d){
        controller._area_change(areaList[d.id.split("_")[2]])

    }

    function test(d){
        console.log(d)

    }



    function select_color(val){

        if(val == null){
            return "white"
        } else {
            return controller.config.colorScheme.quartile_color_array[Math.floor(val.percent * 4)]
        }
    }

    function select_text_color(val){

        if(val == null){
            return controller.config.colorScheme.text_color
        } else {
            return controller.config.colorScheme.quartile_dark_color_array[Math.floor(val.percent * 4)]
        }
    }


    function select_text(val, previous_val){

        var string;

        if(val == null){
            string =  "NA"
        } else {
            string = d3.round(val.value, 1)
        }

        var trend;
        if(val == null || previous_val == null){
            return string

        } else if(previous_val.value == val.value){
            return string
        } else if (previous_val.value > val.value){
            return "\u25BC" + " " + string

        } else if (previous_val.value < val.value){
            return "\u25B2" + " " + string

        }


    }

    function select_area_color(id){
        if(id == controller.state.current_area){
            return controller.config.colorScheme.highlight_color
        } else {
            return "white"
        }
    }

    function select_area_opacity(id){
        if(id == controller.state.current_area){
            return 0.5
        } else {
            return 1
        }
    }

    function cap(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    function configure(widget, configuration) {

        that.config = configuration;


        var data = controller.data_obj.data_arr;

        //nested_data = d3.nest()
        //    .key(function(d){ return d[[controller.config.source.period]]})
        //    .entries(data)


        that.config.header_height = 14 * 5;
        //that.config.label_width = 14 * 10;

        var config = controller.config;
        var state = controller.state;


        areaList = config.areaList[state.areaType]
            .sort(function(a, b){return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0; })
            .map(function (d) {return d.id});
        indicatorArr = widget.indicatorArr;


        yscale = d3.scale.ordinal()
            .rangeRoundBands([0, that.config.compHeight])// - that.config.header_height])
            .domain( areaList);

        xscale = d3.scale.linear()
            .range([0, that.config.compWidth])
            .domain([0, widget.indicatorArr.length + 1]);

    }

    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {


        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var genderType = state.genderType;


        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");


        indicator_bars = svg
            .append("g")
            .attr("transform", "translate(" + xscale(1) + ",0)")

            .selectAll(".indicator_bar")
            .data(indicatorArr)
            .enter()
            .append("rect")
            .attr("class", "indicator_bar")
            .attr("x", function(d, i){ return xscale(i)})
            .attr("y", 0)
            .attr("width",  xscale(1) )
            .attr("height", that.config.header_height + 20) //+20 ensures overlap where d3 adjusts rangebound
            .style("stroke-width", "1")
            .style("stroke", config.colorScheme.text_color)
            .style("fill", "white");


        for(var i in indicatorArr){ //loop here to use wrap function
            svg.append("text")
                .attr("transform", "translate(" + xscale(1) + ",0)")
                .attr("class", "indicator" + i)
                .attr("x", xscale(i) + 7)
                .attr("y", 21 )
                .style("font-size", "0.9em")
                .style("fill", config.colorScheme.text_color)
                .call(self.wrap, xscale(1), indicatorArr[i]);

            var unit = cap(config.indicatorLabels[indicatorArr[i]])
            svg.append("text")
                .attr("transform", "translate(" + xscale(1) + ",0)")
                .attr("class", "indicator_unit" + widget.widgetId)
                .attr("x", xscale(i) + 7)
                .attr("y", 14 * 4)
                .style("font-size", "0.8em")
                .style("fill", config.colorScheme.text_color)
                .call(self.wrap, xscale(1), unit);
        }


        name_bars = svg
            .append("g")
            .attr("transform", "translate(0," + that.config.header_height + ")")
            .selectAll(".name_bar")
            .data(areaList)
            .enter()
            .append("rect")
            .attr("class", "name_bar" )
            .attr("x", 0)
            .attr("y", function (d, i) {return yscale(d)})
            .attr("width", xscale(1) )
            .attr("height", function (d, i) {return yscale.rangeBand()})
            .style("stroke-width", "1")
            .style("stroke", config.colorScheme.text_color)
            .style("opacity", function(d){return select_area_opacity(d)})
            .style("fill", function(d){return select_area_color(d)})
            .on("click", name_click);;


        name_labels = svg
            .append("g")
            .attr("transform", "translate(0," + that.config.header_height + ")")
            .selectAll(".name_label")
            .data(areaList)
            .enter()
            .append("text")
            .attr("class", "name_label")
            .attr("x", "0.5em")
            .attr("y", function (d, i) {return yscale(d) + 0.5 * yscale.rangeBand()})
            .attr("dy", "0.5em")
            .text(function(d, i){return controller._get_area_name(d)})
            .style("font-size", "0.9em")
            //.style("font-weight", "bold")
            .style("fill", config.colorScheme.text_color)
            .on("click", name_click);


        //var period_data = nested_data.filter(function(obj){
        //    return obj.key == state.current_period
        //})[0].values;


        var data_grid = svg.append("g")
            .attr("transform", "translate(" + xscale(1) + "," + that.config.header_height + ")")

        for(var i in indicatorArr){
            for(var j in areaList){

                var val = controller.getValueFromPeriodData(state.areaType, widget.gender, config.indicatorMapping[indicatorArr[i]], state.current_period, areaList[j]);
                var previous_val = controller.getValueFromPeriodData(state.areaType, widget.gender, config.indicatorMapping[indicatorArr[i]], state.current_period - 1, areaList[j]);


                data_grid
                    .append("rect")
                    .attr("class", "name_bar" )
                    .attr("id", "dataBar_" + i + "_" + j )
                    .attr("x", xscale(i))
                    .attr("y", yscale(areaList[j]))
                    .attr("width",  xscale(1) )
                    .attr("height", yscale.rangeBand())
                    .style("stroke-width", "1")
                    .style("stroke", config.colorScheme.text_color)
                    .style("fill", function(){ return select_color(val)})
                    .on("click", function(){value_click(this)});


                data_grid
                    .append("text")
                    .attr("class", "data_label")
                    .attr("id", "dataLabel_" + i + "_" + j )
                    .attr("x", xscale(Number(i) + 0.5))
                    .attr("y",yscale(areaList[j]) + 0.5 * yscale.rangeBand())
                    .style("text-anchor", "middle")
                    .attr("dy", "0.5em")
                    .text(function(){return select_text(val, previous_val)})
                    .style("font-size", "1.5em")
                    .style("fill", function(){ return select_text_color(val)})
                    .on("click", function(){value_click(this)});

            }
        }

    }
    that.render = render;


    function update() {


        var self = this;
        var config = controller.config;
        var state = controller.state;

        name_bars
            .transition()
            .duration(500)
            .style("opacity", function(d){return select_area_opacity(d)})
            .style("fill", function(d){return select_area_color(d)});

        for(var i in indicatorArr){
            for(var j in areaList){

                var val = controller.getValueFromPeriodData(state.areaType, widget.gender, config.indicatorMapping[indicatorArr[i]], state.current_period, areaList[j]);
                var previous_val = controller.getValueFromPeriodData(state.areaType, widget.gender, config.indicatorMapping[indicatorArr[i]], state.current_period - 1, areaList[j]);


                d3.select("#dataBar_" + i + "_" + j)
                    .transition()
                    .duration(500)
                    .style("fill", function(){ return select_color(val)});

                d3.select("#dataLabel_" + i + "_" + j)
                    .text(function(){return select_text(val, previous_val)})

                d3.select("#dataLabel_" + i + "_" + j)
                    .transition()
                    .style("fill", function(){ return select_text_color(val)});
            }
        }

    }
    that.update = update;

    ee.addListener("update", update);

    configure(widget, configuration);

    return that;

};


Components.prototype.scatterPlotMatrix = function(widget, configuration){


    var self = this;

    var that = {};

    that.config = {};

    var svg = undefined;
    var scale = undefined;

    var indicator_nest = undefined;
    var scalets = undefined;
    var axlets = undefined;
    var girdlets = undefined;

    var areaList = undefined;
    var indicatorArr = undefined;

    var x_row = undefined;
    var y_row = undefined;

    var x_bars = undefined;
    var x_labels = undefined;

    var y_bars = undefined;
    var y_labels = undefined;

    var data_grid = undefined;

    var previous_period = undefined;


    function dot_click(d){
        controller._area_change(d.id);
    }


    function cap(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function  getDatlet(ind_x, ind_y, period) {

        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var gender = widget.gender;


        datlet = [];
        for (var a in areaList) {

            var x_val = controller.getValueFromPeriodData(areaType, gender, config.indicatorMapping[ind_x], period, areaList[a])
            var y_val = controller.getValueFromPeriodData(areaType, gender, config.indicatorMapping[ind_y], period, areaList[a])

            if (x_val != null && y_val != null) {
                var obj = {
                    id: areaList[a],
                    name: controller._get_area_name(areaList[a]),
                    x: x_val.value,
                    y: y_val.value
                };
                datlet.push(obj);
            }
        }

        return datlet

    }

    function select_color(id){
      if(id == controller.state.current_area){
            return controller.config.colorScheme.highlight_text_color;
      } else {
          return controller.config.colorScheme.text_color;
      }
    }

    function select_r(id){
        if(id == controller.state.current_area){
            return 8;
        } else {
            return 5;
        }
    }

    function select_opacity(id, datlet){
        if(datlet.length == 0){return 0} //hide points when no data

        if(id == controller.state.current_area){
            return 0.8;
        } else {
            return 0.5;
        }
    }



    function configure(widget, configuration) {

        that.config = configuration;


        var data = controller.data_obj.data_arr;

        that.config.header_height = 14 * 5;

        var config = controller.config;
        var state = controller.state;

        previous_period = state.current_period //used for tween transitions


        areaList = config.areaList[state.areaType].map(function (d) {return d.id});
        indicatorArr = widget.indicatorArr;


        scale = d3.scale.linear()
            .range([0, that.config.compWidth])
            .domain([0, widget.indicatorArr.length + 1]);



        indicator_nest =  d3.nest()
                .key(function(d){ return d[[controller.config.source.indicator]]})
                .entries(data);

        scalets = {};
        axlets = {};
        gridlets = {};


        for(var i in indicator_nest){
            var indicator = controller.getKeyByValue(config.indicatorMapping,indicator_nest[i].key );

            //get max value for indicator for all periods
            var max = d3.max(indicator_nest[i].values, function(d) { return d[config.source.value]; });
            var pct = max * 0.2;

            scalets[indicator] = {};
            scalets[indicator].max = max;
            scalets[indicator].scale = d3.scale.linear()
                .range([0, scale(1)])
                .domain([-pct, max + pct]);
            scalets[indicator].scaleInverse = d3.scale.linear()
                .range([scale(1), 0])
                .domain([-pct, max + pct]);


            axlets[indicator] = {};

            axlets[indicator].xAxis = d3.svg.axis()
                .scale(scalets[indicator].scale)
                .ticks(4)
                .orient("top");


            axlets[indicator].yAxis = d3.svg.axis()
                .scale(scalets[indicator].scaleInverse)
                .ticks(4)
                //.innerTickSize()
                .orient("right");

        }
    }

    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {


        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var gender = widget.gender;
        var period = state.current_period;



        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        //add x headers ---------------------------------
        x_row = svg.append("g")
            .attr("transform", "translate(" + scale(1) + ",0)")

        x_bars = x_row
            .selectAll(".x_bar")
            .data(indicatorArr)
            .enter()
            .append("rect")
            .attr("class", "x_bar" + widget.widgetId)
            .attr("x", function(d, i){ return scale(i)})
            .attr("y", 0)
            .attr("width",  scale(1) )
            .attr("height", that.config.header_height + 20) //+20 ensures overlap
            .style("stroke-width", "1")
            .style("stroke", config.colorScheme.text_color)
            .style("fill", "white");


        for(var i in indicatorArr){ //loop here to use wrap function
            x_row.append("text")
                .attr("class", "x_label" + widget.widgetId)
                .attr("x", scale(i) + 7)
                .attr("y", 21)
                .style("font-size", "0.9em")
                .style("fill", config.colorScheme.text_color)
                .call(self.wrap, scale(1), indicatorArr[i]);

            var unit = cap(config.indicatorLabels[indicatorArr[i]])
            x_row.append("text")
                .attr("class", "x_unit" + widget.widgetId)
                .attr("x", scale(i) + 7)
                .attr("y", 14 * 4)
                .style("font-size", "0.8em")
                .style("fill", config.colorScheme.text_color)
                .call(self.wrap, scale(1), unit);
        }


        //add y headers -------------------------------
        y_row = svg.append("g")
            .attr("transform", "translate(0," + that.config.header_height + ")")

        y_bars = y_row
            .selectAll(".x_bar")
            .data(indicatorArr)
            .enter()
            .append("rect")
            .attr("class", "y_bar" + widget.widgetId)
            .attr("x", 0)
            .attr("y", function(d, i){ return scale(i)})
            .attr("width",  scale(1) + 20) //+20 ensures overlap
            .attr("height", scale(1) )
            .style("stroke-width", "1")
            .style("stroke", config.colorScheme.text_color)
            .style("fill", "white");

        for(var i in indicatorArr){ //loop here to use wrap function
            y_row.append("text")
                .attr("class", "y_label" + widget.widgetId)
                .attr("x", 7)
                .attr("y", scale(i) + scale(0.4))
                .style("font-size", "0.9em")
                .style("fill", config.colorScheme.text_color)
                .call(self.wrap, scale(1), indicatorArr[i]);

            var unit = cap(config.indicatorLabels[indicatorArr[i]])

            y_row.append("text")
                .attr("class", "y_unit" + widget.widgetId)
                .attr("x", 7)
                .attr("y", scale(i) + scale(0.8))
                .style("font-size", "0.8em")
                .style("fill", config.colorScheme.text_color)
                .call(self.wrap, scale(1), unit);

        }



        //add plots-------------------------------------------
        var data_grid = svg.append("g")
            .attr("transform", "translate(" + scale(1) + "," + that.config.header_height + ")")

        for(var i in indicatorArr){
            for(var j in indicatorArr){

                //draw grid------------------------------------------
                data_grid
                    .append("rect")
                    .attr("class", "name_bar" + widget.widgetId )
                    .attr("id", "dataBar_" + widget.widgetId + "_" + i + "_" + j )
                    .attr("x", scale(i))
                    .attr("y", scale(j))
                    .attr("width",  scale(1) )
                    .attr("height", scale(1))
                    .style("stroke-width", "1")
                    .style("stroke", config.colorScheme.text_color)
                    .style("fill", "white")//function(){ return select_color(val)});


                if(indicatorArr[i] != indicatorArr[j]){ //don't plot self correlations


                    //draw grid
                    data_grid.append("g")
                        .attr("transform", "translate(" + scale(Number(i)) + "," + scale(Number(j)) + ")")
                        .selectAll("line.horizontalGrid")
                        .data(scalets[indicatorArr[j]].scaleInverse.ticks(4))
                        .enter()
                        .append("line")
                        .attr(
                        {
                            "class":"horizontalGrid",
                            "x1" : 0,
                            "x2" : scale(1),
                            "y1" : function(d){ return scalets[indicatorArr[j]].scaleInverse(d);},
                            "y2" : function(d){ return scalets[indicatorArr[j]].scaleInverse(d);},
                            "fill" : "none",
                            "stroke" : controller.config.colorScheme.main_color_offset,
                            "stroke-width" : "1px"
                        });


                    data_grid.append("g")
                        .attr("transform", "translate(" + scale(Number(i)) + "," + scale(Number(j)) + ")")
                        .selectAll("line.horizontalGrid")
                        .data(scalets[indicatorArr[i]].scale.ticks(4))
                        .enter()
                        .append("line")
                        .attr(
                        {
                            "class":"horizontalGrid",
                            "x1" : function(d){ return scalets[indicatorArr[i]].scale(d);},
                            "x2" : function(d){ return scalets[indicatorArr[i]].scale(d);},
                            "y1" : 0,
                            "y2" : scale(1),
                            "fill" : "none",
                            "stroke" : controller.config.colorScheme.main_color_offset,
                            "stroke-width" : "1px"
                        });




                    //draw axis numbers
                    data_grid.append("g")
                        .attr("class", "x axis scatter_axis")
                        .attr("transform", "translate(" + scale(Number(i)) + "," + scale(Number(j) + 1) + ")")
                        //.attr("transform", "translate(" + scale(Number(i) + 1) + "," + scale(j) + ")")
                        .style("fill", "none")
                        .style("font-size", "0.8em")
                        .call(axlets[indicatorArr[i]].xAxis);

                    data_grid.append("g")
                        .attr("class", "y axis scatter_axis")
                        .attr("transform", "translate(" + scale(Number(i)) + "," + scale(Number(j)) + ")")
                        //.attr("transform", "translate(" + scale(Number(i) + 1) + "," + scale(j) + ")")
                        .style("fill", "none")
                        .style("font-size", "0.8em")
                        .call(axlets[indicatorArr[j]].yAxis);

                    d3.selectAll(".scatter_axis")
                        .selectAll(".tick")
                        .style("stroke", controller.config.colorScheme.main_color);



                    //get data for plot
                    datlet = getDatlet(indicatorArr[i], indicatorArr[j], period)


                    //draw no data available
                    data_grid.append("text")
                        .attr("transform", "translate(" + scale(Number(i)) + "," + scale(Number(j) + 1) + ")")
                        .attr("id", "noScatterData" + widget.widgetId + i + j )
                        .attr("x", scale(0.5))
                        .attr("y", - scale(0.5))
                        .attr("dy", "0.5em")
                        .attr("text-anchor", "middle")
                        .text("No data available")
                        .style("font-size", "1em")
                        .style("opacity", function(){
                            if(datlet.length > 0){
                                return 0
                            } else {
                                return 1
                            }
                        })
                        .style("fill", config.colorScheme.text_color);


                    //plot data
                    data_grid
                        .selectAll(".scatter_dot" + i + j)
                        .data(datlet)
                        .enter()
                        .append("circle")
                        .attr("class", "scatter_dot clickable scatter" + widget.widgetId + i + j)
                        .attr("id", function(d){return "scatter" + widget.widgetId + i + j + d.id})
                        .attr("r", function(d){return select_r(d.id)})
                        .attr("cx", function(d){return scale(i) + scalets[indicatorArr[i]].scale(d.x)})
                        .attr("cy", function(d){return scale(j) + scalets[indicatorArr[j]].scaleInverse(d.y)})
                        .style("opacity",function(d){return select_opacity(d.id, datlet)})
                        .style("fill", function(d){return select_color(d.id)})
                        .on("click", dot_click);





                }

            }
        }


    }
    that.render = render;


    function update() {


        var self = this;
        var config = controller.config;
        var state = controller.state;

        //var areaType = state.areaType;
        //var gender = widget.gender;
        var period = state.current_period;


        for(var i in indicatorArr){ //loop through grod
            for(var j in indicatorArr){


                //get data for plot
                datlet = getDatlet(indicatorArr[i], indicatorArr[j],period);

                if(datlet.length == 0){

                    d3.selectAll(".scatter" + widget.widgetId + i + j)
                        .transition()
                        .duration(1000)
                        .style("opacity",function(d){return select_opacity(d.id, datlet)})


                } else {

                    //update data
                    d3.selectAll(".scatter" + widget.widgetId + i + j)
                        .data(datlet)
                        .transition()
                        //.delay(function(){return step * 5000})
                        .duration(1000)
                        .attr("r", function(d){return select_r(d.id)})
                        .attr("cx", function(d){return scale(i) + scalets[indicatorArr[i]].scale(d.x)})
                        .attr("cy", function(d){return scale(j) + scalets[indicatorArr[j]].scaleInverse(d.y)})
                        .style("opacity",function(d){return select_opacity(d.id, datlet)})
                        .style("fill", function(d){return select_color(d.id)})

                }


                d3.selectAll("#noScatterData" + widget.widgetId + i + j )
                        .transition()
                        .delay(0)
                        .duration(500)
                       .style("opacity", function(){
                        if(datlet.length > 0){
                            return 0
                        } else {
                            return 1
                        }
                    });

            }
        }
    }
    that.update = update;

    ee.addListener("update", update);

    configure(widget, configuration);

    return that;

};


Components.prototype.wessexMapKey =  function(widget, configuration){

    var self = this;
    var that = {};
    that.config = {};

    var svg = undefined;
    var x = undefined;
    var y = undefined;

    function configure(widget, configuration) {

        that.config = configuration;
        x = that.config.x;
        y = that.config.y;

    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        var pad = 14;
        var w = (that.config.width + pad * 2) / 4;

        svg.selectAll(".keyBars")
            .data(controller.config.colorScheme.quartile_color_array)
            .enter()
            .append("rect")
            .attr("x", function(d, i){ return i * w - pad})
            .attr("y", -15)
            .attr("width",  w)
            .attr("height", "1.5em")
            .style("fill", function(d){return d})
            .style("stroke", that.config.stroke)


        svg.append("text")
            .attr("x", - 0.5 * pad)
            .attr("y", 0)
            .attr("text-anchor", "left")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.quartile_dark_color_array[0])
            .call(self.wrap, 100, "Eng. Low");

        svg.append("text")
            .attr("x", that.config.width + 0.5 * pad)
            .attr("y", 0)
            .attr("text-anchor", "end")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.quartile_dark_color_array[3])
            .call(self.wrap, 100, "Eng. High");


    }

    that.render = render;

    configure(widget, configuration);

    return that;
}


Components.prototype.arrowKey =  function(widget, configuration){

    var self = this;
    var that = {};
    that.config = {};

    var svg = undefined;
    var x = undefined;
    var y = undefined;

    function configure(widget, configuration) {

        that.config = configuration;
        x = that.config.x;
        y = that.config.y;

    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        var pad = 14;
        var w = (that.config.width + pad * 2) / 2;

        var textArr = ["\u25B2 increase year-on-year", "\u25BC decrease year-on-year" ];

        svg.selectAll(".keyBars")
            .data(textArr)
            .enter()
            .append("rect")
            .attr("x", function(d, i){ return i * w - pad})
            .attr("y", -15)
            .attr("width",  w)
            .attr("height", "1.5em")
            .style("fill", "white")
            .style("stroke", that.config.stroke)


        svg.append("text")
            .attr("x", - 0.5 * pad)
            .attr("y", 0)
            .attr("text-anchor", "left")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.text_color)
            .text(textArr[0]);

        svg.append("text")
            .attr("x", that.config.width + 0.5 * pad)
            .attr("y", 0)
            .attr("text-anchor", "end")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.text_color)
            .text(textArr[1]);


    }

    that.render = render;

    configure(widget, configuration);

    return that;
}


var component = new Components();


//---d3 functions--------------

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {

            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};
