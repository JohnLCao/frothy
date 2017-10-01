// operator recommendations graph
var data = [
    ["Air",0.012], ["Feed Grade",-0.025], ["Density",0.008], ["Frother",0.023], ["Activator",-0.009], ["Collector", 0.005]
];


d3.select("#operator")
  .datum(data)
    .call(columnChart()
      .width(960)
      .height(500)
      .x(function(d, i) { return d[0]; })
      .y(function(d, i) { return d[1]; }));
// end operator recommendations graph

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

// ver fileInput = document.getElementByld("csv"),
// readFile = function () {
//   var reader = new FileReader();
//   reader.onload = function () {
//     document.getElementByld('out').innerHTML = reader.result;
//   };
//   reader.readAsBinaryString(fileInput.files[0]);
// };

// fileInput.addEventListener('chage', readFile);
// var assays = []

// $(document).ready(function() {
//   $.get('Assays.csv', function(data){ 
    
//     var lines = data.split('\n');

//     var properties = ["Timestamp", "MF_Pb", "MF_Zn"]

//     for (var i = 0; i < lines.length; i++) {
//       var assay = lines[i].split(',');
//       var tmp = {}
//       for (var j = 0; j < assay.length; j++) {
//         tmp[properties[j]] = assay[j]
//       }
//       assays.push(tmp);
//     }
//   });
//   console.log(assays[1]);
// });