var index = 0;
var new_negs = [];
var new_poses = [];
var old_value;

var setup = function(targetID){
  //Set size of svg element and chart
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    categoryIndent = 4*15 + 5,
    defaultBarWidth = 1000;

  //Set up scales
  var x = d3.scale.linear()
    .domain([0,defaultBarWidth])
    .range([0,width]);
  var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1, 0);

  //Create SVG element
  d3.select(targetID).selectAll("svg").remove()
  var svg = d3.select(targetID).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  //Package and export settings
  var settings = {
    margin:margin, width:width, height:height, categoryIndent:categoryIndent,
    svg:svg, x:x, y:y
  }
  return settings;
}

var redrawChart = function(targetID, newdata, callback) {
  console.log('redrawChart got called')
  //Import settings
  var margin=settings.margin, width=settings.width, height=settings.height, categoryIndent=settings.categoryIndent, 
  svg=settings.svg, x=settings.x, y=settings.y;

  //Reset domains
  y.domain(newdata.sort(function(a,b){
    return b.value - a.value;
  })
    .map(function(d) { return d.key; }));
  var barmax = d3.max(newdata, function(e) {
    return e.value;
  });
  x.domain([-barmax,barmax]);

  /////////
  //ENTER//
  /////////

  //Bind new data to chart rows 

  //Create chart row and move to below the bottom of the chart
  var chartRow = svg.selectAll("g.chartRow")
    .data(newdata, function(d){ return d.key});
  var newRow = chartRow
    .enter()
    .append("g")
    .attr("class", "chartRow")
    .attr("transform", "translate(250," + height + margin.top + margin.bottom + ")");

  //Add rectangles
  newRow.insert("rect")
    .attr("class","bar")
    .attr("x", function(d){return x(d.value);})
    .attr("opacity",0)
    .attr("height", y.rangeBand())
    .attr("width", function(d) { return Math.abs(x(d.value));});

  //Add value labels
  newRow.append("text")
    .attr("class","label")
    .attr("y", y.rangeBand()/2)
    .attr("x",0)
    .attr("opacity",0)
    .attr("dy",".35em")
    .attr("dx","0.5em")
    .text(function(d){return d.value;}); 
  
  //Add Headlines
  newRow.append("text")
    .attr("class","category")
    .attr("text-overflow","ellipsis")
    .attr("y", y.rangeBand()/2)
    .attr("x",categoryIndent)
    .attr("opacity",0)
    .attr("dy",".35em")
    .attr("dx","0.5em")
    .text(function(d){return d.key});


  //////////
  //UPDATE//
  //////////

  //Update bar widths
  chartRow.select(".bar").transition()
    .duration(300)
    .attr("width", function(d) { return Math.abs(d.value);})
    .attr("opacity",1)
    .attr("x", function(d){
      if (d.value < 0){
        new_negs.push(Math.abs(d.value));
        return d.value;
      } else {
        new_poses.push(Math.abs(d.value));
        return 0;
      }
    });

  //Update data labels
  chartRow.select(".label").transition()
    .duration(300)
    .attr("opacity",1)
    .tween("text", function(d) { 
    var i = d3.interpolate(+this.textContent.replace(/\,/g,''), +d.value);
    return function(t) {
      this.textContent = Math.round(i(t));
    };
    });

  //Fade in categories
  chartRow.select(".category").transition()
    .duration(300)
    .attr("opacity",1);


  ////////
  //EXIT//
  ////////

  //Fade out and remove exit elements
  chartRow.exit().transition()
    .style("opacity","0")
    .attr("transform", "translate(250," + (height + margin.top + margin.bottom) + ")")
    .remove();

  ////////////////
  //REORDER ROWS//
  ////////////////

  if(index == 0) {
    var delay = function(d, i) { return 200 + i * 30; };

    chartRow.transition()
      .delay(delay)
      .duration(900)
      .attr("transform", function(d){ return "translate(250," + y(d.key) + ")"; });
    index = 1;
  }

  callback();
};



//Pulls data
//Since our data is fake, adds some random changes to simulate a data stream.
//Uses a callback because d3.json loading is asynchronous
var pullData = function(settings,callback){
  d3.json("js/data.json", function (err, data){
    console.log('pullData got called')
    if (err) return console.warn(err);

    var newData = data;
    data.forEach(function(d,i){
      var sign = Math.random() > .5 ? -1 : 1;
      var newValue = d.value + Math.floor((Math.random()*100)*sign);
      newData[i].value = newValue
    })

    newData = formatData(newData);

    callback(settings,newData, color_update);
  })
}

var color_update = function(){
  new_negs.forEach(function(val){
    console.log($('[width="' + val + '"]'));
    $('[width="' + val + '"]').css('fill', 'lightcoral');
  });

  new_poses.forEach(function(val){
    $('[width="' + val + '"]').css('fill', '#00ff80');
  });
}

//Sort data in descending order and take the top 10 values
var formatData = function(data){
    return data.sort(function (a, b) {
        return b.value - a.value;
      })
    .slice(0, 10);
}

//I like to call it what it does
var redraw = function(settings){
  console.log("redraw got called");
  pullData(settings,redrawChart)
  console.log('exiting redraw');
}

//setup (includes first draw)
var settings = setup('#operator');
redraw(settings);
new_negs.forEach(function(val){
  var e = $('[width="' + val + '"]');
  console.log(e);
});

//Repeat every 3 seconds
setInterval(function(){
  redraw(settings);
}, 2000);