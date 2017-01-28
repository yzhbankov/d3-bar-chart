/**
 * Created by Iaroslav Zhbankov on 27.01.2017.
 */
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function dateParser(date) {
    var theDate = new Date(date);
    var year = theDate.getFullYear();
    var month = theDate.getMonth();
    return year;
}

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years, 2);


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<div><div><strong><h4>$" + d[1] + " Billion</h4></strong></div>" +
            "<div><h6>" + d[0] + "</h6></div></div>";
    });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function (error, json) {
    var data = json.data;
    x.domain(data.map(function (d) {
        return d[0];
    }));
    y.domain([0, d3.max(data, function (d) {
        return d[1];
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return height - y(d[1]);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
});
