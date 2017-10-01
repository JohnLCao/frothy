var index = 0;
var data_index = {
  "1" : 1,
  "2" : 1
}
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

var redrawChart = function(settings, newdata) {
  // console.log('redrawChart got called')
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
    .attr("transform", "translate(200," + height + margin.top + margin.bottom + ")");

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

  if(index < 2) {
    var delay = function(d, i) { return 200 + i * 30; };

    chartRow.transition()
      .delay(delay)
      .duration(900)
      .attr("transform", function(d){ return "translate(250," + y(d.key) + ")"; });
    index++;
  }
};



//Pulls data
//Since our data is fake, adds some random changes to simulate a data stream.
//Uses a callback because d3.json loading is asynchronous
var pullData = function(settings,callback, graph_num){
  d3.json("js/data.json", function (err, data){
    // console.log('pullData got called')
    if (err) return console.warn(err);

    console.log(data_index);
    var newData = data[data_index[graph_num]];
    if (data_index[graph_num] === 1){
      data_index[graph_num] = 2;
    }else {
      data_index[graph_num] = 1;
    }
    // data.forEach(function(d,i){
    //   var sign = Math.random() > .5 ? -1 : 1;
    //   var newValue = d.value + Math.floor((Math.random()*100)*sign);
    //   newData[i].value = newValue
    // })

    newData = formatData(newData, data_index[graph_num]);

    callback(settings,newData);
  })
}

//Sort data in descending order and take the top 10 values
var formatData = function(data, iteration){
    // return data.sort(function (a, b) {
    //     return b.value - a.value;
    //   })
    // .slice(0, 10
    if (iteration === 1){
      return [
              {"key":"MF Pb", "value": 5.2458934784},
              {"key":"MF Zn", "value": 13.497014999},
              {"key":"MF Fe", "value": 5.4422984123},
              {"key":"PbFC Pb","value": 55.410709381},
              {"key":"PbFC ZN","value": 11.606258392},
              {"key":"PbFC Fe","value": 7.1280002594},
              {"key":"ZRF Pb","value": 3.0963323116},
              {"key":"ZRF Zn","value": 17.857028961},
              {"key":"ZRF Fe","value": 8.1788711548},
              {"key":"ZRT A Pb","value": 1.9203318357},
              {"key":"ZRT A Zn","value": 0.9989464879},
              {"key":"ZRT A Fe","value": 3.1686306},
              {"key":"ZRT B Pb","value": 99.900001526},
              {"key":"ZRT B Zn","value": 99.900001526},
              {"key":"ZRT B Fe","value": 99.900001526},
              {"key":"ZRT Comb Pb","value": 99.900001526},
              {"key":"ZRT Comb Zn","value": 99.900001526},
              {"key":"ZRT Comb Fe","value": 99.900001526},
              {"key":"Z1RC Pb","value": 3.2828223705},
              {"key":"Z1RC Zn","value": 38.465496063},
              {"key":"Z1RC Fe","value": 5.6342253685},
              {"key":"Z2RC Pb","value": 4.0510892868},
              {"key":"Z2RC Zn","value": 23.221212387},
              {"key":"Z2RC Fe","value": 14.158090591},
              {"key":"ZRCC Pb","value": 2.8032693863},
              {"key":"ZRCC Zn","value": 26.109272003},
              {"key":"ZRCC Fe","value": 8.2968492508},
              {"key":"value","value": 0.3892795},
              {"key":"qualityName_id","value": 1}
        ]
    }
    else if (iteration === 2){
      return [
                {"key":"MF Pb", "value": 12.2458934784},
                {"key":"MF Zn", "value": 5.497014999},
                {"key":"MF Fe", "value": 55.4422984123},
                {"key":"PbFCPb", "value": 3.410709381},
                {"key":"PbFC ZN", "value": 7.606258392},
                {"key":"PbFC Fe", "value": 11.1280002594},
                {"key":"ZRF Pb", "value": 7.0963323116},
                {"key":"ZRF Zn", "value": 12.857028961},
                {"key":"ZRF Fe", "value": 10.1788711548},
                {"key":"ZRT A Pb", "value": 3.9203318357},
                {"key":"ZRT A Zn", "value": 1.9989464879},
                {"key":"ZRT A Fe", "value": 4.1686306},
                {"key":"ZRT B Pb", "value": 93.900001526},
                {"key":"ZRT B Zn", "value": 96.900001526},
                {"key":"ZRT B Fe", "value": 77.900001526},
                {"key":"ZRT Comb Pb", "value": 33.900001526},
                {"key":"ZRT Comb Zn", "value": 33.900001526},
                {"key":"ZRT Comb Fe", "value": 78.900001526},
                {"key":"Z1RC Pb", "value": 83.2828223705},
                {"key":"Z1RC Zn", "value": 35.465496063},
                {"key":"Z1RC Fe", "value": 1.6342253685},
                {"key":"Z2RC Pb", "value": 6.0510892868},
                {"key":"Z2RC Zn", "value": 73.221212387},
                {"key":"Z2RC Fe", "value": 14.158090591},
                {"key":"ZRCC Pb", "value": 34.8032693863},
                {"key":"ZRCC Zn", "value": 6.109272003},
                {"key":"ZRCC Fe", "value": 2.2968492508},
                {"key":"value", "value": 10.3892795},
                {"key":"qualityName_id", "value": 0}
      ]
    }
  
}

//I like to call it what it does
var redraw = function(settings, graph_num){
  // console.log("redraw got called");
  pullData(settings,redrawChart, graph_num)
  // console.log('exiting redraw');
}

//setup (includes first draw)
var settings0 = setup('#operator0');
var settings1 = setup('#operator1');
redraw(settings0, 1);
redraw(settings1, 2);

//Repeat every 3 seconds
setInterval(function(){
  redraw(settings0, 1);
  redraw(settings1, 2);
}, 2000);