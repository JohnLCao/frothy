var index = 0;
var data_index = {
  "0" : 1,
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
    .attr("transform", "translate(100," + height + margin.top + margin.bottom + ")");

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
    .attr("transform", "translate(100," + (height + margin.top + margin.bottom) + ")")
    .remove();

  ////////////////
  //REORDER ROWS//
  ////////////////

  if(index < 3) {
    var delay = function(d, i) { return 200 + i * 30; };

    chartRow.transition()
      .delay(delay)
      .duration(900)
      .attr("transform", function(d){ return "translate(100," + y(d.key) + ")"; });
    index++;
  }
};

var fakeAjax = function(iter, graph_num){
  if (iter === 1){
    switch(graph_num) {
      case 0:
            return {
            "MF Pb": 5.2458934784,
            "MF Zn": 13.497014999,
            "MF Fe": 5.4422984123,
            "PbFC Pb": 55.410709381,
            "PbFC ZN": 11.606258392,
            "PbFC Fe": 7.1280002594,
            "ZRF Pb": 3.0963323116,
            "ZRF Zn": 17.857028961,
            "ZRF Fe": 8.1788711548,
            "ZRT A Pb": 1.9203318357,
            "ZRT A Zn": 0.9989464879,
            "ZRT A Fe": 3.1686306,
            "ZRT B Pb": 99.900001526,
            "ZRT B Zn": 99.900001526,
            "ZRT B Fe": 99.900001526,
            "ZRT Comb Pb": 99.900001526,
            "ZRT Comb Zn": 99.900001526,
            "ZRT Comb Fe": 99.900001526,
            "Z1RC Pb": 3.2828223705,
            "Z1RC Zn": 38.465496063,
            "Z1RC Fe": 5.6342253685,
            "Z2RC Pb": 4.0510892868,
            "Z2RC Zn": 23.221212387,
            "Z2RC Fe": 14.158090591,
            "ZRCC Pb": 2.8032693863,
            "ZRCC Zn": 26.109272003,
            "ZRCC Fe": 8.2968492508,
            "value": 0.3892795,
            "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 178.51496778/1.8,
            "SAG2": 155.15563684/1.8,
            "SAG3": 118.50767439/1.8,
            "Pb Rghr Tails Flow": 3758.995226/40,
            "Zn Rougher 2 Con Flow": 983.59431435/40,
            "Bank A Airflow": 1117.0152574/40,
            "Bank B Airflow": 1049.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 80,
            "Z1RC 02 Output": 86,
            "Z2RC 01 Output": 86,
            "Z2RC 02 Output": 82
          };
          break;
      default: 
          return null;
          break;
      }
  }
  else if (iter===2) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 15.2458934784,
              "MF Zn": 3.497014999,
              "MF Fe": 67.4422984123,
              "PbFCPb": 35.410709381,
              "PbFC ZN": 51.606258392,
              "PbFC Fe": 7.1280002594,
              "ZRF Pb": 67.0963323116,
              "ZRF Zn": 11.857028961,
              "ZRF Fe": 85.1788711548,
              "ZRT A Pb": 12.9203318357,
              "ZRT A Zn": 7.9989464879,
              "ZRT A Fe": 4.1686306,
              "ZRT B Pb": 97.900001526,
              "ZRT B Zn": 90.900001526,
              "ZRT B Fe": 69.900001526,
              "ZRT Comb Pb": 49.900001526,
              "ZRT Comb Zn": 69.900001526,
              "ZRT Comb Fe": 99.900001526,
              "Z1RC Pb": 4.2828223705,
              "Z1RC Zn": 33.465496063,
              "Z1RC Fe": 6.6342253685,
              "Z2RC Pb": 89.0510892868,
              "Z2RC Zn": 2.221212387,
              "Z2RC Fe": 74.158090591,
              "ZRCC Pb": 1.8032693863,
              "ZRCC Zn": 46.109272003,
              "ZRCC Fe": 78.2968492508,
              "value": 0.3892795,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 78.51496778/1.8,
            "SAG2": 135.15563684/1.8,
            "SAG3": 18.50767439/1.8,
            "Pb Rghr Tails Flow": 3798.995226/40,
            "Zn Rougher 2 Con Flow": 913.59431435/40,
            "Bank A Airflow": 1017.0152574/40,
            "Bank B Airflow": 1549.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 50,
            "Z1RC 02 Output": 76,
            "Z2RC 01 Output": 36,
            "Z2RC 02 Output": 92
          }
          break;
      default: 
          return null;
          break;
      }
  }
}

//Pulls data
//Since our data is fake, adds some random changes to simulate a data stream.
//Uses a callback because d3.json loading is asynchronous
var pullData = function(settings,callback, graph_num){
  // d3.json("js/data.json", function (err, data){
    // console.log('pullData got called')
    // if (err) return console.warn(err);
    // console.log(data_index);
    var newData = fakeAjax(data_index[graph_num], graph_num);
    if (data_index[graph_num] === 1){
      data_index[graph_num] = 2;  
    }else {
      data_index[graph_num] = 1;
    }
    
    newData = formatData(newData);
    callback(settings,newData);
  // })
}

//Sort data in descending order and take the top 10 values
var formatData = function(data){
    // return data.sort(function (a, b) {
    //     return b.value - a.value;
    //   })
    // .slice(0, 10)
    var processedData = [];
    for (var prop in data){
      processedData.push({
        "key": prop,
        "value": data[prop]
      })
    }
    return processedData;
}

//I like to call it what it does
var redraw = function(settings, graph_num){
  pullData(settings, redrawChart, graph_num)
}

//setup (includes first draw)
var settings0 = setup('#operator0');
var settings1 = setup('#operator1');
var settings2 = setup('#operator2')
redraw(settings0, 0);
redraw(settings1, 1);
redraw(settings2, 2);

//Repeat every 3 seconds
setInterval(function(){
  redraw(settings0, 0);
  redraw(settings1, 1);
  redraw(settings2, 2);
}, 1000);