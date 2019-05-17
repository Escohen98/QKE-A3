d3.csv('../Data/athlete_events.csv', function(error, data) {
	console.log(data)

	//Filters out NA values for wanted columns
//	data = data.filter(function(el) {
  //      return !isNaN(el.ID) && !isNaN(el.Age) && !isNaN(el.Sex);
    //});

	data.forEach(function(d) {
			d.ID = +d.ID;
			d.Name = d.Name;
			d.Sex = d.Sex;
			d.Age = +d.Age;
			d.Height = +d.Height;
			d.Weight = +d.Weight;
			d.Team = d.Team;
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
	var margin = {top: 25, bottom: 10, left: 25, right: 25},
	width = 700 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

	var svg = d3.select("body").append("svg")
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

		//End Building Frame

		var ages = [...new Set(data.map(function(d) { return d.Age; }))].sort()
		var sexes = [...new Set(data.map(function(d) {return d.Sex; }))]
		var optionsA = d3.select("#age").selectAll("option")
			.data(ages)
		.enter().append("option")
			.text(function(d) {return d;})
		var optionsS = d3.select("#sex").selectAll("option")
			.data(sexes)
		.enter().append("option")
			.text(function(d) {return d;})

		//Age box changes
		var selectA = d3.select("#age")
			.on("change", function() {
				var age = this.value;
				var sex = d3.select("#sex").property("value");
				update(data, age, sex);
			})

		//Sex box changes
		var selectS = d3.select("#sex")
			.on("change", function() {
				var sex = this.value;
				var age = d3.select("#age").property("value");
				update(data, age, sex);
			})

		//When checkbox event change
		var selectM = d3.select("#medals")
			.on("change", function() {
				var sex = d3.select("#sex").property("value");
				var age = d3.select("#age").property("value");
				update(data, age, sex);
			})

		update(data, d3.select("#age").property("value"),
			d3.select("#sex").property("value"));

	var slider = $("age");
	var output = document.getElementById("ageval");
	output.innerHTML = slider.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider.oninput = function() {
	  output.innerHTML = this.value;
	}
		function update(data1, age, sex) {
		//	$("ageval").innerText = age;
			var data1 = data1.filter(function(d) { return d.Age == age &&
				d.Sex == sex});
			console.log(data1.length);
			var none = data1.filter(function(d) {
				d.Medal == 0
			}).length;
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

			var bar = svg.selectAll(".bar")
				.data(data1, function(d) {return d.ID;})

			bar.exit().remove();

			bar.enter().append("rect")
				.attr("class", "bar")
				.attr("fill", "steelblue")
				.attr("width", x.bandwidth())
				.merge(bar)
				.transition().duration(1000)
				.attr("x", function(d) { return x(d.Medal)})
				.attr("y", function(d) { return y(d.Count)})
				.attr("height", function(d) { return y(0) - y(d.Count)})
			}


			//Counts all medals in given dataSet and returns new dataset containing
			//count of each medal and its count in the previous dataset.
			function groupMedals(dataSet) {
				//Case only medals
				if($("medals").checked) {
					//Bronze, Silver, Gold
					var counts = [0,0,0];
					console.log(dataSet)
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
					console.log(dataSet)
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
					console.log(theData);
					return theData;
			 }

			 //Helper function to get element by id.
			 function $(id) {
				 return document.getElementById(id);
			 }
	})
