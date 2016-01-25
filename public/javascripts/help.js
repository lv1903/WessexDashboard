Help = function(){};

/*-----Graphics------------------*/


Help.prototype.overviewWidgetHelp = function (self, y){

    component.text(self, {
        str: "This overview shows the value for each area for each indicator.",
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "The arrows show the year on year trend.",
        font_size: "1em",
        x: 0,
        y: y + 2 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "All the England areas have been ranked and divided into quartiles.",
        font_size: "1em",
        x: 0,
        y: y + 4 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "The color of the cell shows which quartile the rank of each area falls in.",
        font_size: "1em",
        x: 0,
        y: y + 6 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the time slider to change the year.",
        font_size: "1em",
        x: 0,
        y: y + 8 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "You can select different areas and highlight them on the scatter plot.",
        font_size: "1em",
        x: 0,
        y: y + 10 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};

Help.prototype.scatterPlotHelp = function (self, y){

    component.text(self, {
        str: "This matrix of scatter plots shows relationships between all the indicators.",
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the dots and their name is shown in the top left.",
        font_size: "1em",
        x: 0,
        y: y + 2 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "You can change the year with the time slider.",
        font_size: "1em",
        x: 0,
        y: y + 4 * 14,
        dy: 0,
        width: 500,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};



Help.prototype.areaHeaderHelp = function (self, y){

    component.text(self, {
        str: "This report shows the data for your selected area for all the indicators.",
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the time slider to change the year.",
        font_size: "1em",
        x: 0,
        y: y + 3 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "And click on the map to change the your selected area.",
        font_size: "1em",
        x: 0,
        y: y + 6 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "You can select different reports at the top as well as share the app!",
        font_size: "1em",
        x: 0,
        y: y + 9 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};


Help.prototype.indicatorWidgetHelp = function (self, y){

    component.text(self, {
        str: "This report shows the data for:",
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str:  self.indicator,
        font_size: "1em",
        x: 0,
        y: y + 2 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    component.text(self, {
        str: "All the England " + areaTypeLabel + " have been ranked and divided into quartiles.",
        font_size: "1em",
        x: 0,
        y: y + 7 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "The gauge shows the rank of the selected area.",
        font_size: "1em",
        x: 0,
        y: y + 11 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();


    component.text(self, {
        str: "The density plot shows the distribution of all the chosen boundary types for all of England.",
        font_size: "1em",
        x: 0,
        y: y + 15 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "We have also shown the median values for England and the Wessex areas As well as the actual value for the area you have selected.",
        font_size: "1em",
        x: 0,
        y: y + 19 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "The color of the density plot shows which quartile the rank of the selected area falls in.",
        font_size: "1em",
        x: 0,
        y: y + 24 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();


    component.text(self, {
        str: "The line graph shows how the values change over time.",
        font_size: "1em",
        x: 0,
        y: y + 29 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the dots to change the year.",
        font_size: "1em",
        x: 0,
        y: y + 32 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};



Help.prototype.indicatorHeaderHelp = function (self, y){

    component.text(self, {
        str: "This report shows the data for all the areas in Wessex for one indicator.",
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the time slider to change the year.",
        font_size: "1em",
        x: 0,
        y: y + 3 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Or click on the graphics to select different areas or years.",
        font_size: "1em",
        x: 0,
        y: y + 6 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "You can select different reports at the top as well as share the app!",
        font_size: "1em",
        x: 0,
        y: y + 9 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};


Help.prototype.densityGraphHelp = function (self, y){

    component.text(self, {
        str: "The density plot shows the distribution of all the chosen boundary types for all of England.",
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "We have also shown the median values for England and the Wessex areas As well as the actual value for the area you have selected.",
        font_size: "1em",
        x: 0,
        y: y + 4 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "All the England areas have been ranked and divided into quartiles.",
        font_size: "1em",
        x: 0,
        y: y + 9 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "The color of the density plot shows which quartile the rank of the selected area falls in.",
        font_size: "1em",
        x: 0,
        y: y + 12 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};

Help.prototype.mapHelp = function (self, y){

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    component.text(self, {
        str: "Heat map of Wessex " + areaTypeLabel,
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "All the England areas have been ranked and divided into quartiles.",
        font_size: "1em",
        x: 0,
        y: y + 2 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "The color of the heat map shows which quartile the rank of each area falls in.",
        font_size: "1em",
        x: 0,
        y: y + 5 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the map to select and highlight different areas",
        font_size: "1em",
        x: 0,
        y: y + 8 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};


Help.prototype.areaFactsHelp = function (self, y){

    var current_area_name = controller._get_area_name(controller.state.current_area);


    component.text(self, {
        str: "Facts about " + current_area_name,
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "All the England areas have been ranked and divided into quartiles.",
        font_size: "1em",
        x: 0,
        y: y + 3 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "The gauge shows the rank of the selected area.",
        font_size: "1em",
        x: 0,
        y: y + 6 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();


};

Help.prototype.barGraphHelp = function (self, y){

    console.log(self.width)

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    component.text(self, {
        str: "Bar graph of Wessex " + areaTypeLabel,
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the bar graph to highlight different areas.",
        font_size: "1em",
        x: 0,
        y: y + 2 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "If you filter the line graph the bar graph will serve as a legend for the selected lines.",
        font_size: "1em",
        x: 0,
        y: y + 5 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};

Help.prototype.multiLineGraphHelp = function (self, y){

    var areaType = controller.getKeyByValue(controller.config.areaTypeMapping, controller.state.areaType); //get the area type
    areaTypeLabel = controller.config.areaTypeLabels[areaType];

    component.text(self, {
        str: "The line graph shows how the values change over time for Wessex " + areaTypeLabel,
        font_size: "1em",
        x: 0,
        y: y + 0 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.header_text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on the filter icon to select fewer lines.",
        font_size: "1em",
        x: 0,
        y: y + 3 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Click on different lines to change the highlight area.",
        font_size: "1em",
        x: 0,
        y: y + 6 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

    component.text(self, {
        str: "Or click on the dots to change the year.",
        font_size: "1em",
        x: 0,
        y: y + 9 * 14,
        dy: 0,
        width: 240,
        fill: controller.config.colorScheme.text_color,
        id: "header" + self.widgetId
    }).render();

};



/*--------Indicators----------------------*/


Help.prototype.indicatorHelp = function(self, y, indicator){

    var sourceClick = function(){
        controller.source(self.indicator)
    };

    if(indicator === undefined){
        indicator = self.indicator
    }


    switch(indicator) {
        case "Admission episodes for alcohol-related conditions":

            component.text(self, {
                str: "Admission episodes for alcohol-related conditions",
                font_size: "1em",
                x: 0,
                y: y + 0 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.header_text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "Admissions to hospital where the primary diagnosis or any of the secondary diagnoses are an alcohol-attributable code.",
                font_size: "1em",
                x: 0,
                y: y + 3 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "The values shown are for the financial year ending in the selected year...",
                font_size: "1em",
                x: 0,
                y: y + 8 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            self._chart.append("text")
                .attr("class", "clickable")
                .attr("x", 0)
                .attr("y", y + 11 * 14)
                .style("fill", "#337ab7")
                .text("...more")
                .on("click", sourceClick);

            break



        case "Alcohol-specific mortality":

            component.text(self, {
                str: "Alcohol-specific mortality",
                font_size: "1em",
                x: 0,
                y: y + 0 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.header_text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "Deaths from alcohol-specific conditions, all ages, directly age-standardised rate per 100,000 population.",
                font_size: "1em",
                x: 0,
                y: y + 3 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "The values shown are for the previous three years pooled up to and including the the selected year...",
                font_size: "1em",
                x: 0,
                y: y + 7 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            self._chart.append("text")
                .attr("class", "clickable")
                .attr("x", 0)
                .attr("y", y + 11 * 14)
                .style("fill", "#337ab7")
                .text("...more")
                .on("click", sourceClick);

            break


        case "Mortality from chronic liver disease":

            component.text(self, {
                str: "Mortality from chronic liver disease",
                font_size: "1em",
                x: 0,
                y: y + 0 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.header_text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "Deaths from chronic liver disease, all ages, directly age-standardised rate per 100,000 population.",
                font_size: "1em",
                x: 0,
                y: y + 3 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "The values shown are for the previous three years pooled up to and including the the selected year...",
                font_size: "1em",
                x: 0,
                y: y + 7 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            self._chart.append("text")
                .attr("class", "clickable")
                .attr("x", 0)
                .attr("y", y + 11 * 14)
                .style("fill", "#337ab7")
                .text("...more")
                .on("click", sourceClick);

            break


        case "Months of life lost due to alcohol":

            component.text(self, {
                str: "Months of life lost due to alcohol",
                font_size: "1em",
                x: 0,
                y: y + 0 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.header_text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "An estimate of the increase in life expectancy at birth which would be expected if all alcohol-related deaths were prevented for those aged 75 years or less.",
                font_size: "1em",
                x: 0,
                y: y + 2 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            component.text(self, {
                str: "The values shown are for the previous three years pooled up to and including the the selected year...",
                font_size: "1em",
                x: 0,
                y: y + 8 * 14,
                dy: 0,
                width: 240,
                fill: controller.config.colorScheme.text_color,
                id: "header" + self.widgetId
            }).render();

            self._chart.append("text")
                .attr("class", "clickable")
                .attr("x", 0)
                .attr("y", y + 12 * 14)
                .style("fill", "#337ab7")
                .text("...more")
                .on("click", sourceClick);

            break



    }
};



help = new Help();
