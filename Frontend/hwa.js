d3.csv('../Data/athlete_events.csv', function(error, data) {
	console.log(data[1].ID)
	data.forEach(function(d) {
			d.ID = +d.ID;
			d.Name = +d.Name;
			d.Sex = +d.Sex;
			d.Age = +d.Age;
			d.Height = +d.Height;
			d.Weight = +d.Weight;
			d.Team = +d.Team;
			d.NOC = +d.NOC;
			d.Games = +d.Games;
			d.Year = +d.Year;
			d.Season = +d.Season;
			d.City = +d.City;
			d.Sport = +d.Sport;
			d.Event = +d.Event;
			d.Medal = +d.Medal;
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

		var years = [...new Set(data.map(function(d) { return d.Year; }))].sort();
		var medals = [...new Set(data.map(function(d) { return d.Medal; }))]
		console.log(data)
		var options = d3.select("#Year").selectAll("option")
			.data(years)
		.enter().append("option")
			.text(function(d) {return d;})

		var select = d3.select("#Year")
			.on("change", function() {
				update(data, this.Medal)
			})

		update(data, d3.select("#Year").property("Medal"))

		function update(data2, years) {
			var data1 = data2.filter(function(d) { return d.Year == years})
			x.domain(data1.map(function(d) {return d.ID;}))
			y.domain([0, d3.max(data1, function(d) {return d.Medal;})]).nice()

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
				.attr("x", function(d) { return x(d.ID)})
				.attr("y", function(d) { return y(d.Medal)})
				.attr("height", function(d) { return y(0) - y(d.Medal)})
			}

		})
