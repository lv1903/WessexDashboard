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
        if(that.config.hasOwnProperty("fill")){ fill = that.config.fill } else {fill = "white"}


    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        svg.append("text")
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

    configure(widget, configuration);

    return that;



}


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


    function configure(widget, configuration) {

        that.config = configuration;

        if(that.config.hasOwnProperty("x")){ x = that.config.x } else {x = 0}
        if(that.config.hasOwnProperty("y")){ y = that.config.y } else {y = 0}
        if(that.config.hasOwnProperty("dy")){ dy = that.config.dy } else {dy = 0}
        if(that.config.hasOwnProperty("text-anchor")){ text_anchor = that.config.text_anchor } else {text_anchor = "left"}
        if(that.config.hasOwnProperty("fill")){ fill = that.config.fill } else {fill = "white"}


    }
    that.configure = configure;

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render() {

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        var temp_obj = {};

        for(var i in that.config.string_obj){

            var str = that.config.string_obj[i].str;
            var font_size = that.config.string_obj[i].font_size;

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
    that.render = render;

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
            .style("fill", "white")
            .call(self.wrap, 30, "England Low");

        container.append("text")
            .attr("x", configuration.highLabelx)
            .attr("y", configuration.yTranslate + 40)
            .attr("text-anchor", "right")
            .style("font-size", "1em")
            .style("fill", "white")
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
                return config.arcColorFn(d * i);
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

        var id = state.current_area;
        var name = controller._get_area_short_name(id);
        obj = {"name": name,
            "average": average
        };
        objAverages.push(obj);
        //-----------------
        return objAverages
    }

    function configure(widget, configuration) {

       that.config = configuration;

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
            //.attr("transform", "translate(0,0)");


        //add axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.config.compHeight + ")")
            .call(xAxis);

        //svg.append("text")
        //    .attr("class", "x-label")
        //    .attr("text-anchor", "end")
        //    .attr("x", that.config.compWidth - 20)
        //    .attr("y", that.config.compHeight + 40)
        //    .text(controller.config.indicatorLabels[widget.indicator]);


        //add density graph
        var densityArray = controller.data_obj.density_obj[areaType][gender][indicatorMapped][current_period];

        density_area = svg
            .datum(densityArray)
            .append("path")
            .attr("class", "densityArea")
            .attr("d", fArea)
            .style("fill", widget.cs.main_color);

        //add averages
        var self = this;

        averages = getAverages();

        var y_arr = [that.config.compHeight * .4 , that.config.compHeight * 0, that.config.compHeight *.35];
        var text_anchor_arr = ["end", "start", "start"];

        averages.sort(function (a, b) {return a.average - b.average;});

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
                .attr("id", "average_line_" + id)
                .attr("x1", xscale(median))
                .attr("x2", xscale(median))
                .attr("y1", that.config.compHeight)
                .attr("y2", function(){return y_arr[i]})
                .style("stroke-width", 2)
                .style("stroke", "white")
                .style("fill", "none");


            svg.append("text")
                .attr("class", "average_text")
                .attr("id", "average_text_" + id)
                .attr("text-anchor", function () {
                    return text_anchor_arr[i]
                })
                .attr("x", function () {
                    var text_anchor = text_anchor_arr[i];
                    if (text_anchor == "end") {
                        return xscale(median) - 5
                    } else {
                        return xscale(median) + 5
                    }
                })
                .attr("y", function () {
                    return y_arr[i]
                })
                .attr("dy", "0.8em")
                .style("fill", function(){if(id == "Alt"){
                    return widget.cs.highlight_color
                } else {
                    return "white"
                }
                })
                //.style("fill", self.cs.background_color)
                .text(name);


            svg.append("text")
                .attr("class", "average_value")
                .attr("id", "average_value_" + id)
                .attr("text-anchor", function () {
                    return text_anchor_arr[i]
                })
                .attr("x", function () {
                    var text_anchor = text_anchor_arr[i];
                    if (text_anchor == "end") {
                        return xscale(median) - 10
                    } else {
                        return xscale(median) + 10
                    }
                })
                .attr("y", function () {
                    return y_arr[i]
                })
                .attr("dy", "1.8em")
                .style("fill", function(){if(id == "Alt"){
                    return widget.cs.highlight_color
                } else {
                    return "white"
                }
                })
                //.style("fill", self.cs.background_color)
                .style("font-size", "1.5em")
                .text(Math.round(median));


        }





    }
    that.render = render;






    configure(widget, configuration);

    return that;



}



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
    var vx1 = undefined;
    var vx2 = undefined;
    var vy1 = undefined;
    var vy2 = undefined;


    function dot_click(d){

        console.log(d)

            //var config = this.config;
            //controller._period_change(d[config.source.period]);
            //controller._area_change(d[config.source.id]);


    }



    function configure(widget, configuration) {

        that.config = configuration;

        var config = controller.config;
        var state = controller.state;

        var areaType = state.areaType;
        var indicator = widget.indicator;
        var indicatorMapped = widget.indicatorMapped;
        var gender = widget.gender;
        var current_area = state.current_area;
        var current_period = state.current_period;

        data = controller.filterDataArea(areaType, gender, indicatorMapped, current_area);
        data_period = controller.filterDataPeriodArea(areaType, gender, indicatorMapped, current_period, current_area);

        max_y_value = d3.max(data.map(function(obj){return obj[config.source.value]}));
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
        vx1 = xscale(period_arr.indexOf(current_period));
        vx2 = xscale(period_arr.indexOf(current_period));

        if(data_period.length == 0) {
            vy1 = that.config.compHeight / 2;
            vy2 = that.config.compHeight / 2;
        } else {
            vy1 = that.config.compHeight;
            vy2 = that.config.compHeight * 0.1;
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
        var indicator = widget.indicator;
        var indicatorMapped = widget.indicatorMapped;
        var gender = widget.gender;
        var current_period = state.current_period;

        svg = widget._chart.append("g")
            .attr("transform", "translate(" + that.config.x + "," + that.config.y + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + that.config.compHeight + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("  + max_y_value_width / 2 + ", 0)")
            .call(yAxis);

        svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "end")
            .attr("x", that.config.compWidth - 20)
            .attr("y", that.config.compHeight + 40)
            .text("Year");



        svg.append("line")
            .attr("id", "verticalTimeLine" + widget.widgetId )
            .style("stroke-width", 2)
            .style("stroke", "white")
            .style("fill", "none")
            .attr("x1", vx1)
            .attr("x2", vx2)
            .attr("y1", vy1)
            .attr("y2", vy2);



        svg.append("path")
            .datum(data)
            .attr("class", "line timeLine clickable")
            .attr("id", "line" +  widget.widgetId) // assign ID
            .attr("d", fLine)
            .style("stroke", widget.cs.highlight_color)
            .style("stroke-width", 2)
            .style("fill", "none")
            //.on("click", function() { self._line_click(self, d.key)});

        svg.selectAll(".timeDot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dots" + this.widgetId + " clickable")
            .attr("id", "timeDots" + this.widgetId)
            .attr("cx", function(e, i){return xscale(period_arr.indexOf(e[config.source.period]))})
            .attr("cy", function(e){ return yscale(e[config.source.value])})
            .style("stroke", widget.cs.background_color)
            .attr("r", 4)
            .style("stroke-width", 1)
            .style("fill", widget.cs.highlight_color)
            .on("click", dot_click);



    }
    that.render = render;

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

                if (d3.event.sourceEvent) { // not a programmatic event
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
            .call(xAxis)
            .select(".domain")
            .select(function() {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "halo")
            .style("fill", config.colorScheme.main_color); //not working in CSS



        slider = svg.append("g")
            .attr("class", "slider")
            .call(brush);

        slider.selectAll(".extent,.resize")
            .remove();

        slider.select(".background")
            .attr("height", that.config.compHeight);

        handle = slider.append("g")
            .attr("class", "handle clickable")

        handle.append("path")
            .attr("transform", "translate(0," + that.config.compHeight  + ")")
            .attr("d", "M 0 -10 V 10")

        handle.append('text')
            .text(xscale(current_period))
            .attr("transform", "translate(" + (-18) + " ," + (that.config.compHeight - 15) + ")")

        slider
            .call(brush.event)

    }
    that.render = render;

    configure(widget, configuration);

    return that;

};




Components.prototype.map = function(widget, configuration){

    var that = {};

    that.config = {};

    var svg = undefined;
    var topojson_data = undefined;
    var projection = undefined;
    var path = undefined;
    var feature = undefined;


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

        console.log(features)

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

        svg.selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("class", "feature clickable")
            .attr("id", function(d){ return "feature" + d.properties.id} + widget.widgetId)
            .attr("d", path)
            .style(that.config.style)
            //.on("click", self._feature_click);

        d3.select("#feature" + state.current_area + widget.widgetId).moveToFront();


    }
    that.render = render;

    configure(widget, configuration);

    return that;

};


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