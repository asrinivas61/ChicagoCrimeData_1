var result = {}, result_1 = [];

d3.json("../output/theft.json", function(error, data) {
    if (error) throw error;

var xData = ["under_500", "over_500"];
var cases = ["$500 AND UNDER", "OVER $500"];

    function counter(i, caseType) {
      return data.filter(function(elem) {
        return elem.Year==i && elem.Description==caseType;
      }).length;
    }
    for(var i=2001; i<2017; i++) {
      result = {};
      result["year"] = i;
      result["under_500"] = counter(i, cases[0]);
      result["over_500"] = counter(i, cases[1]);
      result_1.push(result);
    }
    result_1.forEach(function(d) {
        d.year = +d.year;
        d.under_500 = +d.under_500;
        d.over_500 = +d.over_500;
    });

var margin = {top: 20, right: 50, bottom: 60, left: 400},
        width = 1000 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);

var y = d3.scale.linear()
        .rangeRound([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10, "s");

d3.select("body").append("h2")
    .attr("class", "header")
    .text("Chicago Crime Records");

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var color_hash = {
      0 : ["$500 And Under","#1f77b4"],
      1 : ["Over $500","#aec7e8"]
  };

var dataIntermediate = xData.map(function (c) {
    return result_1.map(function (d) {
        return {x: d.year, y: d[c]};
    });
});

var stackLayout = d3.layout.stack()(dataIntermediate);
x.domain(stackLayout[0].map(function (d) {
    return d.x;
}));

y.domain([0, d3.max(stackLayout[stackLayout.length - 1],
                function (d) { return d.y0 + d.y;})
            ]).nice();

var layer = svg.selectAll(".stack")
        .data(stackLayout)
        .enter().append("g")
        .attr("class", "stack")
        .style("fill", function (d, i) {
            return color(i);
        });

layer.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.x);
        })
        .attr("y", function (d) {
            return y(d.y + d.y0);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", x.rangeBand());

svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

svg.append("text")
       .attr("class","xtext")
       .attr("x",width/2)
       .attr("y",height + 35)
       .attr("text-anchor","middle")
       .text("Years");

svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
        .attr("class", "sideHead")
        .attr("transform","rotate(-90)")
        .attr("y", 0-50)
        .attr("x", 0-(height/2))
        .attr("dy","1em")
        .text("Crimes");

    var legend = svg.append("g")
                .attr("class","legend")
                .attr("x", width - margin.right - 65)
                .attr("y", 25)
                .attr("height", 100)
                .attr("width",100);

  legend.selectAll("g").data(result_1)
        .enter()
        .append('g')
        .each(function(d,i){
            var g = d3.select(this);
            g.append("rect")
              .attr("x", width - margin.right - 65)
              .attr("y", i*25 + 10)
              .attr("width", 10)
              .attr("height",10)
              .style("fill",color_hash[String(i)][1]);
            g.append("text")
             .attr("x", width - margin.right - 50)
             .attr("y", i*25 + 20)
             .attr("height",30)
             .attr("width",100)
             .style("fill",color_hash[String(i)][1])
             .text(color_hash[String(i)][0]);
        });
});