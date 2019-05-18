function process_scatter(error, data_iter) {

	//Filters out NA values for wanted columns
//	data = data.filter(function(el) {
  //      return !isNaN(el.ID) && !isNaN(el.Age) && !isNaN(el.Sex);
    //});

    //var features = ["Sex", "Age", "Height", "Weight", ];

    var features =null;

    var random_dist = [];

    var data = Array.from(data_iter);

    var n = data.length;

    for(i=0; i<500; i++){
        random_dist.push( parseInt(Math.random()*n) );
    }

    function create_inv(o){
        var inv_o = {};

        //console.log(o);

        entries= Object.entries(o)
        for(entry of entries){
            //console.log(entry);
            inv_o[entry[1]]= entry[0];
        }

        //console.log(inv_o);

        return inv_o;
    }

    var sex = {"Male":0.2, "Female":0.5, "NA":0.8};
    var inv_sex = create_inv(sex);
    var medal = {"NA":0, "Bronze":1, "Silver":2, "Gold":3};
    var inv_medal = create_inv(medal);

    var season = {"Summer":0, "Winter":1};
    var inv_season = create_inv(season);

    var teams = {};
    var country_codes = {};
    var city_codes = {};
    var sport_codes = {};
    var event_codes = {};
    var games_codes = {};
    var NOC_codes = {};

    function code_labels(coding, label) {
        if(!Object.keys(coding).includes(label)){
            index = Object.keys(coding).length;
            coding[label] = index;
        }
    }

    
	var parsedData = random_dist.map(function(index) {

            d = data[index];

            if (features == null){
                console.log(d)
                features = Array.from(Object.keys(d));
            }

            var countries = ["NA"];

            if(typeof(d.Team)==String)
                countries = d.Team.split("-");
            
            d.ID = +d.ID;
            
            d.Name = d.Name;
            
            switch(d.Sex){
                case "M":
                    d.Sex = sex["Male"];
                    break;
                case "F":
                    d.Sex = sex["Female"];
                    break;

                default:
                    d.Sex = sex["NA"];
                    break;
            }
            
            
			d.Age = +d.Age;
			d.Height = +d.Height;
			d.Weight = +d.Weight;
            
            //d.Team = d.Team;
            //code the team name as a numeric
            code_labels(teams, d.Team);
            d.Team = teams[d.Team];

            code_labels(country_codes, countries[0])
            d.Country = country_codes[countries[0]];

            code_labels(NOC_codes, d.NOC);
            d.NOC = NOC_codes[d.NOC];
            
            code_labels(games_codes, d.Games);
            d.Games = games_codes[d.Games];
            
            d.Year = +d.Year;
            
            d.Season = season[d.Season];
            
            //d.City = d.City;
            code_labels(city_codes, d.City);
            d.City = city_codes[d.City];
            
            //d.Sport = d.Sport;
            code_labels(sport_codes, d.Sport);
            d.Sport = sport_codes[d.Sport];
            
            //d.Event = d.Event;
            code_labels(event_codes, d.Event);
            d.Event = event_codes[d.Event];

			/*switch(d.Medal) {
							case "Gold":
									d.Medal = medal["Gold"];
									break;
							case "Silver":
									d.Medal = medal["Silver"];
									break;
							 case "Bronze":
									 d.Medal = medal["Bronze"];
									 break;
							 case "NA":
							 default:
									 d.Medal = medal["NA"];
									 break;
                     }
            */
			return d;
        });
        
    var inv_teams = create_inv(teams);
    var inv_country = create_inv(country_codes);
    var inv_city = create_inv(city_codes);
    var inv_sport = create_inv(sport_codes);
    var inv_event = create_inv(event_codes);

    var class_labels = {
        "Sex": inv_sex,
        "Medal": inv_medal,
        "Team": inv_teams,
        "Country": inv_country,
        "City": inv_city,
        "Season": inv_season,
        "Sport": inv_sport,
        "Event": inv_event,
    };

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

    function label_classes(axis, feat){
        
        if(Object.keys(class_labels).includes(feat)) {

            feat_labels = class_labels[feat];
            //since this may just be nominal
            axis.ticks(Object.keys(feat_labels).length);

            console.log(feat);
            axis.tickFormat(function(d,i){
                
                var keys = Object.keys(feat_labels).map((d)=>parseFloat(d));

                label = "";
                if(keys.includes(d)) {
                    label = feat_labels[d];
                }
                return label;
            })
        } else {
            axis.ticks(10);
            axis.tickFormat(function(d){return d});
        }
    }

    var circles = null;
    
    d3.select("#x_var")
        .selectAll("option")
        .data(features)
        .enter()
        .append("option")
        .text(function(d){return d;})
    
    var x_var = d3.select("#x_var");
    x_var.on("change", function (){
        var x_feat = x_var.property("value")
        xlabel.text(x_feat);
        
        svg.text(`${x_feat} vs ${y_var.property("value")}`);
        
        var x_extent = d3.extent(parsedData, (d)=>d[x_feat]);

        x_extent = [x_extent[0]-0.25, x_extent[1]+0.25]
        console.log(x_extent);

        
        xScale.domain(x_extent);

        /*if(Object.keys(class_labels).includes(x_feat)) {

            console.log(x_feat);
            xAxis.tickFormat(function(d,i){
                feat_labels = class_labels[x_feat];
                var keys = Object.keys(feat_labels).map((d)=>parseFloat(d));

                label = "";
                if(keys.includes(d)) {
                    label = feat_labels[d];
                }
                return label;
            })
        }*/
        label_classes(xAxis, x_feat);


        d3.selectAll("body div[id=scatter] .x-axis")
                .transition()
                .duration(1000)
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "rotate(-65)");
                
        d3.selectAll("circle")
        .data(parsedData)
        .attr("cx", (d)=>xScale(d[x_feat]|| 0))
        .attr("cy", (d)=>yScale(d[y_var.property("value")]|| 0))
        .transition()
        .duration(1000);
        
        
    });

    d3.select("#y_var")
        .selectAll("option")
        .data(features)
        .enter()
        .append("option")
        .text(function(d){return d;})
    
    var y_var = d3.select("#y_var");
    y_var.on("change", function(){
        y_feat = y_var.property("value");
        ylabel.text(y_feat);
        svg.text(`${x_var.property("value")} vs ${y_feat}`);
        
        var y_extent = d3.extent(parsedData, (d)=>d[y_feat]);

        y_extent = [y_extent[0]-0.25, y_extent[1]+0.25]

        yScale.domain(y_extent);
        //yAxis.scale(yScale)

        label_classes(yAxis, y_feat);

        d3.selectAll("body div[id=scatter] .y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);
 
        d3.selectAll("circle")
            .data(parsedData)
            .attr("cx", (d)=>xScale(d[x_var.property("value")] || 0))
            .attr("cy", (d)=>yScale(d[y_feat] || 0))
            .transition()
            .duration(1000);

        
        
    });

    ylabel.text(y_var.property("value"));
    xlabel.text(x_var.property("value"));
    svg.text(`${x_var.property("value")} vs ${y_var.property("value")}`);

    var x_extent = d3.extent(parsedData, (d)=>d[x_var.property("value")]);

    xScale.domain(x_extent);
    //xAxis.scale(xScale);
    
    var y_extent = d3.extent(parsedData, (d)=>d[y_var.property("value")]);

    yScale.domain(y_extent);
    //yAxis.scale(yScale)

    //circles = 
    d3.select("body div[id=scatter] svg")
        .append("g")
        .attr("transform", "translate(0," + (margin.top) + ")")
        .attr("transform", "translate(" + margin.left + ",0)")
        .selectAll("circle")
        .data(parsedData)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function(d){return xScale(d[x_var.property("value")])})
        .attr("cy", function(d){return yScale(d[y_var.property("value")])});
    
    d3.select("div[id=scatter] .x-axis")
        .transition()
        .call(xAxis)

    d3.select("div[id=scatter] .y-axis")
        .transition()
        .call(yAxis);
    

    
}