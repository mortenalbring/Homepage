var svg = d3.select("#wordBar1"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;


var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range ([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv("/words/bar-data.csv").then(function(flatData) {
    console.log(flatData);
    xScale.domain(flatData.map(function(d) { return d.wordlength; }));
    yScale.domain([0, d3.max(flatData, function(d) { return parseInt(d.words); })]);

    var maxval = d3.max(flatData, function(d) { return parseInt(d.words); });
    console.log(maxval);
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", 20)
        .attr("x", (width/2))
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .text("Length of word");
    

    g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;
        }).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("x", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Number of words");

    g.selectAll(".bar")
        .data(flatData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill","orange")
        .attr("x", function(d) { return xScale(d.wordlength); })
        .attr("y", function(d) { return yScale(parseInt(d.words)); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(parseInt(d.words)); });
    
});
