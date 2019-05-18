function process_scatter(error, data) {

	//Filters out NA values for wanted columns
//	data = data.filter(function(el) {
  //      return !isNaN(el.ID) && !isNaN(el.Age) && !isNaN(el.Sex);
    //});

    var features = null;

	data.forEach(function(d) {
            if (features == null){
                features = Array.from(Object.keys(d));
            }

            var countries = d.Team.split("-");
			d.ID = +d.ID;
			d.Name = d.Name;
			d.Sex = d.Sex;
			d.Age = +d.Age;
			d.Height = +d.Height;
			d.Weight = +d.Weight;
			d.Team = d.Team;
			d.Country = countries[0];
			d.NOC = d.NOC;
			d.Games = d.Games;
			d.Year = +d.Year;
			d.Season = d.Season;
			d.City = d.City;
			d.Sport = d.Sport;
			d.Event = d.Event;
			switch(d.Medal) {
							case "Gold":
									d.Medal = 3;
									break;
							case "Silver":
									d.Medal = 2;
									break;
							 case "Bronze":
									 d.Medal = 1;
									 break;
							 case "NA":
							 default:
									 d.Medal = 0;
									 break;
					 }
			return d;
		});

	//Start Building Frame

	//Frame Dimensions
	var mult = 2;
	var margin = {top: 25*mult, bottom: 10*mult, left: 25*mult, right: 25*mult},
	width = 700*mult - margin.left - margin.right,
	height = 400*mult - margin.top - margin.bottom;

	var svg = d3.select("main div[id=scatter]").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr("id", "chart")
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear()
        .range([margin.left, width - margin.right])
        //.padding(0.1)

    var yScale = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])

    var yAxis = d3.axisLeft()
        .scale(yScale);

    var xAxis = d3.axisBottom()
        .scale(xScale)

    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .attr("class", "x-axis")
        .call(xAxis)

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .attr("class", "y-axis")
        .call(yAxis)

    //Axis Labels
        //Taken from http://bl.ocks.org/phoebebright/3061203

        // now rotate text on x axis
    // solution based on idea here: https://groups.google.com/forum/?fromgroups#!topic/d3-js/heOBPQF3sAY
    // first move the text left so no longer centered on the tick
    // then rotate up to get 45 degrees.
    svg.selectAll(".xaxis text")  // select all the text elements for the xaxis
        .attr("transform", function(d) {
        return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
    });
    var padding = 0;
    // now add titles to the axes

        //y-axis
    var ylabel = svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)");  // text is drawn off the screen top left, move down and out and rotate
        
    //x-axis
    var xlabel = svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height+(20))+")");  // centre below axis
        

    //title
        //Taken from http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
    var svg = svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .style("text-decoration", "underline");
    //End Building Frame

    var circles = null;
    
    d3.select("#x_var")
        .selectAll("option")
        .data(features)
        .enter()
        .append("option")
        .text(function(d){return d;})
    
    var x_var = d3.select("#x_var");
    x_var.on("change", function (){
        xlabel.text(x_var.property("value"));
        svg.text(`${x_var.property("value")} vs ${y_var.property("value")}`);
        console.log("about to update circle cx");
        if(circles != null) {
            console.log("updating circle cx");
            circles
            .attr("cx", function(d){return xScale(d[x_var.property("value")])});
        }
        
        //console.log(type(x_col));
        xScale.domain([d3.min(data, function(d){return d[x_var.property("value")];}), d3.max(data, function(d){return d[x_var.property("value")];})]);

        xAxis.scale(xScale);

        svg.selectAll(".x-axis")
				.transition()
				.duration(0)
				.call(xAxis);
    });

    d3.select("#y_var")
        .selectAll("option")
        .data(features)
        .enter()
        .append("option")
        .text(function(d){return d;})
    
    var y_var = d3.select("#y_var");
    y_var.on("change", function(){
        ylabel.text(y_var.property("value"));
        svg.text(`${x_var.property("value")} vs ${y_var.property("value")}`);
        console.log("about to update circle cy");
        if(circles != null) {
            y_col = data[y_var.property("value")]

            y_col = y_col || 0;

            console.log("updating circle cy");
            circles
            .attr("cy",y_col);
        }
        yScale.domain([d3.min(data, function(d){return d[y_var.property("value")];}), d3.max(data, function(d){return d[y_var.property("value")];})]);
        yAxis.scale(yScale)

        svg.selectAll(".y-axis")
            .transition()
            .duration(0)
            .call(yAxis);
        
    });

    ylabel.text(y_var.property("value"));
    xlabel.text(x_var.property("value"));
    svg.text(`${x_var.property("value")} vs ${y_var.property("value")}`);


    xScale.domain([d3.min(data, function(d){return d[x_var.property("value")];}), d3.max(data, function(d){return d[x_var.property("value")];})]);
    xAxis.scale(xScale);
    
    yScale.domain([d3.min(data, function(d){return d[y_var.property("value")];}), d3.max(data, function(d){return d[y_var.property("value")];})]);
    yAxis.scale(yScale)

    svg.selectAll(".x-axis")
				.transition()
				.duration(0)
				.call(xAxis)

    svg.selectAll(".y-axis")
        .transition()
        .duration(0)
        .call(yAxis);

    circles = d3.select("body div[id=scatter] svg")
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", 3)
        //xMap?
        .attr("cx", function(d){return xScale(d[x_var.property("value")])})
        .attr("cy", function(d){return yScale(d[y_var.property("value")])   });
        
        

    
}