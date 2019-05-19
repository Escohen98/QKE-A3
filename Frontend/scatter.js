function process_scatter(error, data_iter, d3_elements) {

    
	//Filters out NA values for wanted columns
//	data = data.filter(function(el) {
  //      return !isNaN(el.ID) && !isNaN(el.Age) && !isNaN(el.Sex);
    //});

    var reuse = d3_elements?true:false;

    console.log(reuse);

    if ( !reuse ) {
        d3_elements = {};
    }

    var features =null;

    var random_dist = [];

    var data = Array.from(data_iter);

    var n = data.length;

    var subsample_size_input = $("#samplesize");

    var subsample_n = subsample_size_input.val();

    subsample_size_input.on("input", ()=>{console.log(d3_elements);
    //process_scatter(null, data_iter, d3_elements);
    })

    console.log(subsample_n);

    for(i=0; i<subsample_n; i++){
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

    var sex = {"Male":0, "Female":1, "NA":2};
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
    var name_codes = {};

    function code_labels(coding, label) {
        if(!Object.keys(coding).includes(label)){
            index = Object.keys(coding).length;
            coding[label] = index;
        }
    }

    
	var parsedData = random_dist.map(function(index) {

            d = data[index];

            if (features == null){
                features = Array.from(Object.keys(d));
            }

            var countries = ["NA"];
            
            if(typeof(d.Team)=="string")
                countries = d.Team.split("-");
            
            d.ID = +d.ID;
            
            code_labels(name_codes, d.Name)
            d.Name = name_codes[d.Name];
            
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

            d.Country = countries[0];
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
    var inv_NOC = create_inv(NOC_codes);
    var inv_games = create_inv(games_codes);
    var inv_names = create_inv(name_codes);

    var class_labels = {
        "Sex": inv_sex,
        "Medal": inv_medal,
        "Team": inv_teams,
        "Country": inv_country,
        "City": inv_city,
        "Season": inv_season,
        "Sport": inv_sport,
        "Event": inv_event,
        "NOC": inv_NOC,
        "Games": inv_games, 
        "Name": inv_names,
    };

	//Start Building Frame

	//Frame Dimensions
	var mult = 2;
	var margin = {top: 25*mult, bottom: 10*mult, left: 25*mult, right: 25*mult},
	width = 700*mult - margin.left - margin.right,
	height = 400*mult - margin.top - margin.bottom;
    
    if(reuse){
        var svg =d3_elements["svg"];
        var xScale = d3_elements["xscale"];
        var yScale = d3_elements["yscale"];

        var xAxis = d3_elements["xaxis"];
        var yAxis = d3_elements["yaxis"];

        var ylabel = d3_elements["ylabel"];
        var xlabel = d3_elements["xlabel"];
        var title = d3_elements["title"];

    } else {
        var svg = d3.select("main div[id=scatter]").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "chart")
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        d3_elements["svg"] = svg;

        var xScale = d3.scaleLinear()
            .range([margin.left, width - margin.right])

        var yScale = d3.scaleLinear()
            .range([height - margin.bottom, margin.top])

        d3_elements["xscale"] = xScale;
        d3_elements["yscale"] = yScale;

        var yAxis = d3.axisLeft()
            .scale(yScale);

        var xAxis = d3.axisBottom()
            .scale(xScale)

        d3_elements["xaxis"] = xAxis;
        d3_elements["yaxis"] = yAxis;

        svg.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .attr("class", "x-axis")
            .call(xAxis)

        svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .attr("class", "y-axis")
            .call(yAxis)

        //Axis Labels
        
        var padding = 0;
        // now add titles to the axes

            //y-axis
        var ylabel = svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)");  // text is drawn off the screen top left, move down and out and rotate
        
        d3_elements["ylabel"]=ylabel;
        //x-axis
        var xlabel = svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (width/2) +","+(height+(20))+")");  // centre below axis
            
        d3_elements["xlabel"]=xlabel;

        //title
            //Taken from http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
        var title = svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("text-decoration", "underline");
        //End Building Frame

        d3_elements["title"] = title;
    }

    function label_classes(axis, feat){
        
        if(Object.keys(class_labels).includes(feat)) {

            feat_labels = class_labels[feat];
            //since this may just be nominal
            axis.ticks(Object.keys(feat_labels).length);

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
        
        title.text(`${x_feat} vs ${y_var.property("value")}`);
        
        var x_extent = d3.extent(parsedData, (d)=>d[x_feat]);

        x_extent = [x_extent[0]-0.25, x_extent[1]+0.25]

        xScale.domain(x_extent);

        label_classes(xAxis, x_feat);

        d3.selectAll("body div[id=scatter] .x-axis")
                .transition()
                .duration(1000)
                .call(xAxis)
                .selectAll("text")
                //adapted from https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
                .style("text-anchor", "end")
                //.attr("dx", "-.8em")
                //.attr("dy", ".15em")
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
        title.text(`${x_var.property("value")} vs ${y_feat}`);
        
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
    title.text(`${x_var.property("value")} vs ${y_var.property("value")}`);

    var x_extent = d3.extent(parsedData, (d)=>d[x_var.property("value")]);

    xScale.domain(x_extent);
    //xAxis.scale(xScale);
    
    var y_extent = d3.extent(parsedData, (d)=>d[y_var.property("value")]);

    yScale.domain(y_extent);
    //yAxis.scale(yScale)

    //circles = 
    d3.select("body div[id=scatter] svg")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .selectAll("circle")
        .data(parsedData)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", function(d){return xScale(d[x_var.property("value")])})
        .attr("cy", function(d){return yScale(d[y_var.property("value")])})
        .on("mousemove", function(d,i) {
            var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
    
            //ofsets
            var switch_left = (mouse[0] + 600) > window.innerWidth;

	        var offsetL = switch_left ? document.getElementById('container').offsetLeft-300 : document.getElementById('container').offsetLeft+300;
	        var offsetT = document.getElementById('container').offsetTop-30;

            tooltip.classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px;width:20%;opacity:25%;")
            .classed("text-truncate", true)
            .html(`ID: ${d.ID}<br>
                    Name: ${d.Name}<br>
                    Sex: ${inv_sex[d.Sex]}<br>
                    Age: ${d.Age}<br>
                    Height: ${d.Height}<br>
                    Weight:${d.Weight}<br>
                    Team: ${inv_teams[d.Team]}<br>
                    NOC: ${inv_NOC[d.NOC]}<br>
                    Games: ${inv_games[d.Games]}<br>
                    Year: ${d.Year}<br>
                    Season: ${inv_season[d.Season]}<br>
                    City: ${inv_city[d.City]}<br>
                    Sport: ${inv_sport[d.Sport]}<br>
                    Event: ${inv_event[d.Event]}<br>
                    Medal: ${inv_medal[d.Medal]}<br>
                    Country:${inv_country[d.Country]}`);
        })
        .on("mouseout",  function(d,i) {
            tooltip.classed("hidden", true);
        });
    
    d3.select("div[id=scatter] .x-axis")
        .transition()
        .call(xAxis)

    d3.select("div[id=scatter] .y-axis")
        .transition()
        .call(yAxis);

    var tooltip = d3.select("body div[id=scatter]").append("div").attr("class", "tooltip hidden");
    

    
}