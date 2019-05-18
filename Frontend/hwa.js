//Data source: https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results
//d3.csv('https://zbtuw.org/QKE-A3/Data/athlete_events.csv', function(error, data) {

	//Filters out NA values for wanted columns
//	data = data.filter(function(el) {
  //      return !isNaN(el.ID) && !isNaN(el.Age) && !isNaN(el.Sex);
    //});

function process_bar(error, data) {

		data.forEach(function(d) {
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
		})

	//Start Building Frame

	//Frame Dimensions
	var mult = 2;
	var margin = {top: 25*mult, bottom: 10*mult, left: 25*mult, right: 25*mult},
	width = 700*mult - margin.left - margin.right,
	height = 400*mult - margin.top - margin.bottom;

	var svg = d3.select("body div[id=bar]").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .attr("id", "chart")
	  .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	 	var x = d3.scaleBand()
			.range([margin.left, width - margin.right])
			.padding(0.1)

		var y = d3.scaleLinear()
			.range([height - margin.bottom, margin.top])

		var yAxis = d3.axisLeft()
	    	.scale(y);

		var xAxis = d3.axisBottom()
	    	.scale(x)

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
	   svg.append("text")
	       .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
	       .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
	       .text("Number of Olympians");
		//x-axis
	   svg.append("text")
	       .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
	       .attr("transform", "translate("+ (width/2) +","+(height+(20))+")")  // centre below axis
	       .text("Medal");

		//title
			//Taken from http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
		svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("text-decoration", "underline")
        .text("Number of Olympians vs Medal");
		//End Building Frame

		var ages = [...new Set(data.map(function(d) { return d.Age; }))].sort()
		var sexes = [...new Set(data.map(function(d) {return d.Sex; }))]
		sexes.unshift("Both");
		var countries = [...new Set(data.map(function(d) { return d.Country; }))].sort()
		countries.unshift("Any");
		var optionsA = d3.select("#age").selectAll("option")
			.data(ages)
		.enter().append("option")
			.text(function(d) {return d;})
		var optionsS = d3.select("#sex").selectAll("option")
			.data(sexes)
		.enter().append("option")
			.text(function(d) {return d;})
		var optionsC = d3.select("#country").selectAll("option")
			.data(countries)
		.enter().append("option")
			.text(function(d) {return d;})
		//Year Slider changes
		var selectY = d3.select("#year")
			.on("change", function() {
				update(data);
			})

		//Age Slider changes
		var selectA = d3.select("#age")
			.on("change", function() {
				update(data);
			})

		//Height Slider changes
		var selectH = d3.select("#height")
			.on("change", function() {
				update(data);
			})

		//Weight Slider changes
		var selectW = d3.select("#weight")
			.on("change", function() {
				update(data);
			})

		//Sex Dropdown changes
		var selectS = d3.select("#sex")
			.on("change", function() {
				update(data);
			})

		//Country Dropdown changes
		var selectC = d3.select("#country")
			.on("change", function() {
				update(data);
			})

		//When medal checkbox event change
		var selectM = d3.select("#medals")
			.on("change", function() {
				update(data);
			})

		//When year checkbox event change
		var checkY = d3.select("#yvis")
			.on("change", function() {
				hide("yhide");
				update(data);
			})

		//When age checkbox event change
		var checkA = d3.select("#avis")
			.on("change", function() {
				hide("ahide");
				update(data);
			})

		//When height checkbox event change
		var checkH = d3.select("#hvis")
			.on("change", function() {
				hide("hhide");
				update(data);
			})

		//When weight checkbox event change
		var checkW = d3.select("#wvis")
			.on("change", function() {
				hide("whide");
				update(data);
			})


		//Initial Update (onLoad)
		update(data, d3.select("#age").property("value"),
			d3.select("#sex").property("value"),
			d3.select("#country").property("value"));

	var yslider = $("year"); //Slider for year
	var aslider = $("age"); //Slider for Age
	var hslider = $("height"); //Slider for Height
	var wslider = $("weight"); //Slider for 1
	var youtput = document.getElementById("yearval"); //Output value for year
	var aoutput = document.getElementById("ageval"); //Output value for age
	var houtput = document.getElementById("heightval"); //Output value for height
	var woutput = document.getElementById("weightval"); //Output value for weight

	//Possibly redundant
	youtput.innerHTML = yslider.value;
	aoutput.innerHTML = aslider.value; // Display the default slider value
	houtput.innerHTML = hslider.value;
	woutput.innerHTML = wslider.value;
	// Update the current slider value (each time you drag the slider handle)
	//Realtime
	yslider.oninput = function() {
		youtput.innerHTML = this.value;
	}
	aslider.oninput = function() {
	  aoutput.innerHTML = this.value;
	}
	hslider.oninput = function() {
	  houtput.innerHTML = this.value;
	}
	wslider.oninput = function() {
	  woutput.innerHTML = this.value;
	}


		function update(data) {
			var sex = d3.select("#sex").property("value");
			var country = d3.select("#country").property("value");
			var data1 = data;
			if(sex != "Both") {
				data1 = data1.filter(function(d) { return d.Sex == sex});
			} if(country != "Any") {
				data1 = data1.filter(function(d) { return d.Country == country});
			}
			data1 = filterData(data1);

			data1 = groupMedals(data1);
			x.domain(data1.map(function(d) { return d.Medal;}))
			y.domain([0, d3.max(data1, function(d) {return d.Count;})]).nice()

			svg.selectAll(".x-axis")
				.transition()
				.duration(0)
				.call(xAxis)

			svg.selectAll(".y-axis")
				.transition()
				.duration(0)
				.call(yAxis);

			svg.selectAll('.bargroup').remove();

            var bar = svg.selectAll('.bar')
                .data(data1, function(d) {return d.ID;});

            var barGroups = bar.enter().append('g')
                .attr("class", "bargroup");

    				//Appends rectangles (bars) to g elemnent
            barGroups.append("rect")
                .attr("class", "bar")
                .attr("fill",  function(d) {
                    switch(d.Medal) {
                        case "Bronze":
                            return "#cd7f32";
                        case "Silver":
                            return "#c0c0c0";
                        case "Gold":
                            return "#ffd700";
                        case "NA":
                        default:
                            return "steelblue";
                    }
                })
                .attr("width", x.bandwidth())
                .merge(bar)
                .transition().duration(1000)
                .attr("x", function(d) { return x(d.Medal)})
                .attr("y", function(d) { return y(d.Count)})
                .attr("height", function(d) { return y(0) - y(d.Count)});

						//Appends corresponding text values to g element
            barGroups.append('text')
                .attr('class', 'value')
                .attr('x', (d) => x(d.Medal) + x.bandwidth() / 2)
                .attr('y', (d) => y(d.Count) - 10)
                .attr('text-anchor', 'middle')
                .text((a) => `${a.Count}`);

			}

			//Filters data based on what is checked.
			//Returns filtered data.
			function filterData(data1) {
				var year = d3.select("#year").property("value");
				var age = d3.select("#age").property("value");
				var weight = d3.select("#weight").property("value");
				var height = d3.select("#height").property("value");
				var data2 = data1;
				if($("yvis").checked) {
					data2 = data2.filter(function(d) { return d.Year == year });
				} if($("avis").checked) {
					data2 = data2.filter(function(d) { return d.Age == age });
				} if($("hvis").checked) {
					data2 = data2.filter(function(d) { return d.Height == height });
				} if($("wvis").checked) {
					data2 = data2.filter(function(d) { return d.Weight == weight });
				}
				//test = data2.filter(function(d) { return d.Age == max(d.Age)});
				return data2;
			}

			//Counts all medals in given dataSet and returns new dataset containing
			//count of each medal and its count in the previous dataset.
			function groupMedals(dataSet) {
				//Case only medals
				if($("medals").checked) {
					//Bronze, Silver, Gold
					var counts = [0,0,0];
					for (var i = 0; i < dataSet.length; i++) {
						if(dataSet[i].Medal != 0)
						 	counts[dataSet[i].Medal-1]++;
						}
						 var theData = [
			 				{
			 					Medal: "Bronze",
			 					Count: counts[0]
			 				},
			 				{
			 					Medal: "Silver",
			 					Count: counts[1]
			 				},
			 				{
			 					Medal: "Gold",
			 					Count: counts[2]
			 				}
			 			]
						$("total").innerText = counts[0]+counts[1]+counts[2];
				} else {
					//None, Bronze, Silver, Gold
					var counts = [0,0,0,0];
					for (var i = 0; i < dataSet.length; i++) {
						 counts[dataSet[i].Medal]++;
					}
						 var theData = [
			 				{
			 					Medal: "None",
			 					Count: counts[0]
			 				},
			 				{
			 					Medal: "Bronze",
			 					Count: counts[1]
			 				},
			 				{
			 					Medal: "Silver",
			 					Count: counts[2]
			 				},
			 				{
			 					Medal: "Gold",
			 					Count: counts[3]
			 				}
			 			]
							$("total").innerText = counts[0]+counts[1]+counts[2]+counts[3];
					}
					return theData;
			 }

			 //Helper function to get element by id.
			 function $(id) {
				 return document.getElementById(id);
			 }

			 //Helper function to toggle hiding given dom element.
			 function hide(id) {
				 $(id).classList.toggle('hidden');
			 }
	}