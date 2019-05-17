d3.csv('../Data/athlete_events0.csv', function(error, data) {
	data.forEach(function(d) {
			countries = d.Team.split("-");
			d.country = countries[0];
			d.year = +d.Year;
			d.age = +d.Age;
			d.season = +d.Season;
			d.weight = +d.Weight;
			d.medal = +d.Medal;
			d.height = +d.Height;
			d.sex = +d.Sex;
			return d;
		})

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

		var years = [...new Set(data.map(function(d) { return d.year; }))]
		console.log(years)
		var options = d3.select("#year").selectAll("option")
			.data(years)
		.enter().append("option")
			.text(function(d) {return d;})

		var select = d3.select("#year")
			.on("change", function() {
				update(data, this.medal)
			})

		update(data, d3.select("#year").property("medal"))

		function update(data, years) {
			var data = data.filter(function(d) { return d.year == years})

			x.domain(data.map(function(d) {return d.country;}))
			y.domain([0, d3.max(data, function(d) {return d.medal;})]).nice()

			svg.selectAll(".x-axis")
				.transition()
				.duration(0)
				.call(xAxis)

			svg.selectAll(".y-axis")
				.transition()
				.duration(0)
				.call(yAxis);

			var bar = svg.selectAll(".bar")
				.data(data, function(d) {return d.country;})

			bar.exit().remove();

			bar.enter().append("rect")
				.attr("class", "bar")
				.attr("fill", "steelblue")
				.attr("width", x.bandwidth())
				.merge(bar)
				.transition().duration(1000)
				.attr("x", function(d) { return x(d.country)})
				.attr("y", function(d) { return y(d.medal)})
				.attr("height", function(d) { return y(0) - y(d.medal)})
			}

		})
