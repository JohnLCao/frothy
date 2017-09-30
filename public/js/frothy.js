// node connected graph for recommendations to the operator
var width = 960,
    height = 500

var svg = d3.select("#operator").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

d3.json("js/graphFile.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.weight).toString(); })
    .style("stroke", "#bbb");

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("circle")
      .attr("r","5");

  node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  });
});
// end node connected graph

//----------------------------------------------------------------------


var svg_width = 500,
   svg_height = 250,
   data = [50, 60, 70, 80, 90, 100, 9, 7, 5, 3, 8, 90, 28, 35],
   margin = {top:30, right: 20, bottom:40, left: 50},
   chart_width = svg_width - margin.left - margin.right,
   chart_height = svg_height - margin.top - margin.bottom

var transfer_x = d3.scale.linear().domain([0, data.length]).range([0, chart_width]),
   transfer_y = d3.scale.linear().domain([0, d3.max(data)]).range([chart_height, 0])

var vis = d3.select("#recovery")
.append("svg:svg")
.attr("width", svg_width)
.attr("height", svg_height)

var draw_line = d3.svg.line()
.x(function(d,i) { return transfer_x(i); })
.y(function(d) { return transfer_y(d); })
.interpolate("cardinal")

var g = vis.append("svg:g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

g.append("svg:path")
.attr("class", "area")
.attr("d", draw_line(data));

var x_axis = d3.svg.axis().scale(transfer_x).orient("bottom").ticks(10)
var y_axis = d3.svg.axis().scale(transfer_y).orient("left").ticks(18)

g.append("svg:g")
.attr("class", "x axis")
.call(x_axis)
.attr("transform", "translate(0," + chart_height + ")")
.append("text")
.attr("x", 410)
.attr("y", 37)
.text("Time");

g.append("svg:g")
.attr("class", "y axis")
.call(y_axis)
.append("text")
.attr("y", -30)
.style("text-anchor", "end")
.attr("transform", "rotate(-90)")
.text("Recovery");

var assays = [];

// $(document).ready(function() {
//   $.get('data.csv', function(data){ 
    
//     var lines = data.split('\n');
//     var properties = ["Timestamp", "MF_Pb", "MF_Zn"]
    
//     for (var i = 0; i < lines.length; i++){
//       var assay = lines[i].split(',');
//       var tmp = {}
//       for (var j = 0; j < assay.length; j++){
//          tmp[properties[j]] = assay[j]
//       }
//       assays.push(tmp);
//     }
    
//   });
//   console.log.(assays);
//   console.log(assays[0]);
//   console.log(assays[0], ["Timestamp"]);
// });