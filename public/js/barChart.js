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
            "qualityName_id": 0
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
              "value": 0,
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
else if (iter===3) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 1.2458934784,
              "MF Zn": 13.497014999,
              "MF Fe": 62.4422984123,
              "PbFCPb": 15.410709381,
              "PbFC ZN": 61.606258392,
              "PbFC Fe": 4.1280002594,
              "ZRF Pb": 67.0963323116,
              "ZRF Zn": 21.857028961,
              "ZRF Fe": 95.1788711548,
              "ZRT A Pb": 15.9203318357,
              "ZRT A Zn": 1.9989464879,
              "ZRT A Fe": 2.1686306,
              "ZRT B Pb": 37.900001526,
              "ZRT B Zn": 30.900001526,
              "ZRT B Fe": 69.900001526,
              "ZRT Comb Pb": 39.900001526,
              "ZRT Comb Zn": 79.900001526,
              "ZRT Comb Fe": 69.900001526,
              "Z1RC Pb": 2.2828223705,
              "Z1RC Zn": 33.465496063,
              "Z1RC Fe": 4.6342253685,
              "Z2RC Pb": 79.0510892868,
              "Z2RC Zn": 6.221212387,
              "Z2RC Fe": 64.158090591,
              "ZRCC Pb": 3.8032693863,
              "ZRCC Zn": 36.109272003,
              "ZRCC Fe": 98.2968492508,
              "value": 1,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 138.51496778/1.8,
            "SAG2": 155.15563684/1.8,
            "SAG3": 50.50767439/1.8,
            "Pb Rghr Tails Flow": 3698.995226/40,
            "Zn Rougher 2 Con Flow": 1913.59431435/40,
            "Bank A Airflow": 1517.0152574/40,
            "Bank B Airflow": 149.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 80,
            "Z1RC 02 Output": 66,
            "Z2RC 01 Output": 56,
            "Z2RC 02 Output": 12
          }
          break;
      default: 
          return null;
          break;
      }
    }
  else if (iter===4) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 55.2458934784,
              "MF Zn": 33.497014999,
              "MF Fe": 47.4422984123,
              "PbFCPb": 15.410709381,
              "PbFC ZN": 61.606258392,
              "PbFC Fe": 17.1280002594,
              "ZRF Pb": 67.0963323116,
              "ZRF Zn": 51.857028961,
              "ZRF Fe": 25.1788711548,
              "ZRT A Pb": 72.9203318357,
              "ZRT A Zn": 12.9989464879,
              "ZRT A Fe": 54.1686306,
              "ZRT B Pb": 7.900001526,
              "ZRT B Zn": 70.900001526,
              "ZRT B Fe": 19.900001526,
              "ZRT Comb Pb": 29.900001526,
              "ZRT Comb Zn": 69.900001526,
              "ZRT Comb Fe": 59.900001526,
              "Z1RC Pb": 4.2828223705,
              "Z1RC Zn": 63.465496063,
              "Z1RC Fe": 1.6342253685,
              "Z2RC Pb": 89.0510892868,
              "Z2RC Zn": 2.221212387,
              "Z2RC Fe": 54.158090591,
              "ZRCC Pb": 1.8032693863,
              "ZRCC Zn": 46.109272003,
              "ZRCC Fe": 78.2968492508,
              "value": 1,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 18.51496778/1.8,
            "SAG2": 155.15563684/1.8,
            "SAG3": 167.50767439/1.8,
            "Pb Rghr Tails Flow": 3678.995226/40,
            "Zn Rougher 2 Con Flow": 1613.59431435/40,
            "Bank A Airflow": 417.0152574/40,
            "Bank B Airflow": 2549.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 50,
            "Z1RC 02 Output": 76,
            "Z2RC 01 Output": 67,
            "Z2RC 02 Output": 22
          }
          break;
      default: 
          return null;
          break;
      }
    }
  else if (iter===5) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 15.2458934784,
              "MF Zn": 3.497014999,
              "MF Fe": 67.4422984123,
              "PbFCPb": 35.410709381,
              "PbFC ZN": 51.606258392,
              "PbFC Fe": 57.1280002594,
              "ZRF Pb": 67.0963323116,
              "ZRF Zn": 11.857028961,
              "ZRF Fe": 55.1788711548,
              "ZRT A Pb": 12.9203318357,
              "ZRT A Zn": 7.9989464879,
              "ZRT A Fe": 4.1686306,
              "ZRT B Pb": 97.900001526,
              "ZRT B Zn": 90.900001526,
              "ZRT B Fe": 19.900001526,
              "ZRT Comb Pb": 49.900001526,
              "ZRT Comb Zn": 69.900001526,
              "ZRT Comb Fe": 99.900001526,
              "Z1RC Pb": 4.2828223705,
              "Z1RC Zn": 33.465496063,
              "Z1RC Fe": 6.6342253685,
              "Z2RC Pb": 79.0510892868,
              "Z2RC Zn": 2.221212387,
              "Z2RC Fe": 74.158090591,
              "ZRCC Pb": 1.8032693863,
              "ZRCC Zn": 46.109272003,
              "ZRCC Fe": 78.2968492508,
              "value": 0,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 178.51496778/1.8,
            "SAG2": 135.15563684/1.8,
            "SAG3": 148.50767439/1.8,
            "Pb Rghr Tails Flow": 2798.995226/40,
            "Zn Rougher 2 Con Flow": 513.59431435/40,
            "Bank A Airflow": 717.0152574/40,
            "Bank B Airflow": 1249.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 70,
            "Z1RC 02 Output": 87,
            "Z2RC 01 Output": 89,
            "Z2RC 02 Output": 29
          }
          break;
      default: 
          return null;
          break;
      }
    }
  else if (iter===6) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 15.2458934784,
              "MF Zn": 3.497014999,
              "MF Fe": 67.4422984123,
              "PbFCPb": 35.410709381,
              "PbFC ZN": 51.606258392,
              "PbFC Fe": 7.1280002594,
              "ZRF Pb": 17.0963323116,
              "ZRF Zn": 34.857028961,
              "ZRF Fe": 85.1788711548,
              "ZRT A Pb": 12.9203318357,
              "ZRT A Zn": 7.9989464879,
              "ZRT A Fe": 4.1686306,
              "ZRT B Pb": 97.900001526,
              "ZRT B Zn": 40.900001526,
              "ZRT B Fe": 69.900001526,
              "ZRT Comb Pb": 49.900001526,
              "ZRT Comb Zn": 69.900001526,
              "ZRT Comb Fe": 99.900001526,
              "Z1RC Pb": 4.2828223705,
              "Z1RC Zn": 33.465496063,
              "Z1RC Fe": 6.6342253685,
              "Z2RC Pb": 69.0510892868,
              "Z2RC Zn": 2.221212387,
              "Z2RC Fe": 74.158090591,
              "ZRCC Pb": 1.8032693863,
              "ZRCC Zn": 46.109272003,
              "ZRCC Fe": 78.2968492508,
              "value": 0,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 68.51496778/1.8,
            "SAG2": 15.15563684/1.8,
            "SAG3": 118.50767439/1.8,
            "Pb Rghr Tails Flow": 3598.995226/40,
            "Zn Rougher 2 Con Flow": 993.59431435/40,
            "Bank A Airflow": 1217.0152574/40,
            "Bank B Airflow": 549.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 13,
            "Z1RC 02 Output": 34,
            "Z2RC 01 Output": 46,
            "Z2RC 02 Output": 78
          }
          break;
      default: 
          return null;
          break;
      }
    }
  else if (iter===7) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 15.2458934784,
              "MF Zn": 3.497014999,
              "MF Fe":57.4422984123,
              "PbFCPb": 25.410709381,
              "PbFC ZN": 51.606258392,
              "PbFC Fe": 7.1280002594,
              "ZRF Pb": 67.0963323116,
              "ZRF Zn": 11.857028961,
              "ZRF Fe": 75.1788711548,
              "ZRT A Pb": 12.9203318357,
              "ZRT A Zn": 7.9989464879,
              "ZRT A Fe": 4.1686306,
              "ZRT B Pb": 97.900001526,
              "ZRT B Zn": 90.900001526,
              "ZRT B Fe": 89.900001526,
              "ZRT Comb Pb": 49.900001526,
              "ZRT Comb Zn": 69.900001526,
              "ZRT Comb Fe": 99.900001526,
              "Z1RC Pb": 4.2828223705,
              "Z1RC Zn": 45.465496063,
              "Z1RC Fe": 6.6342253685,
              "Z2RC Pb": 39.0510892868,
              "Z2RC Zn": 2.221212387,
              "Z2RC Fe": 74.158090591,
              "ZRCC Pb": 1.8032693863,
              "ZRCC Zn": 86.109272003,
              "ZRCC Fe": 78.2968492508,
              "value": 0,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 78.51496778/1.8,
            "SAG2": 125.15563684/1.8,
            "SAG3": 56.50767439/1.8,
            "Pb Rghr Tails Flow": 2798.995226/40,
            "Zn Rougher 2 Con Flow": 913.59431435/40,
            "Bank A Airflow": 117.0152574/40,
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
  else if (iter===8) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 15.2458934784,
              "MF Zn": 3.497014999,
              "MF Fe": 67.4422984123,
              "PbFCPb": 35.410709381,
              "PbFC ZN": 51.606258392,
              "PbFC Fe": 7.1280002594,
              "ZRF Pb": 27.0963323116,
              "ZRF Zn": 41.857028961,
              "ZRF Fe": 65.1788711548,
              "ZRT A Pb": 12.9203318357,
              "ZRT A Zn": 7.9989464879,
              "ZRT A Fe": 4.1686306,
              "ZRT B Pb": 57.900001526,
              "ZRT B Zn": 90.900001526,
              "ZRT B Fe": 49.900001526,
              "ZRT Comb Pb": 49.900001526,
              "ZRT Comb Zn": 69.900001526,
              "ZRT Comb Fe": 99.900001526,
              "Z1RC Pb": 4.2828223705,
              "Z1RC Zn": 36.465496063,
              "Z1RC Fe": 6.6342253685,
              "Z2RC Pb": 39.0510892868,
              "Z2RC Zn": 2.221212387,
              "Z2RC Fe": 74.158090591,
              "ZRCC Pb": 1.8032693863,
              "ZRCC Zn": 46.109272003,
              "ZRCC Fe": 78.2968492508,
              "value": 0,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 123.51496778/1.8,
            "SAG2": 34.15563684/1.8,
            "SAG3": 75.50767439/1.8,
            "Pb Rghr Tails Flow": 3148.995226/40,
            "Zn Rougher 2 Con Flow": 113.59431435/40,
            "Bank A Airflow": 1547.0152574/40,
            "Bank B Airflow": 119.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 10,
            "Z1RC 02 Output": 56,
            "Z2RC 01 Output": 76,
            "Z2RC 02 Output": 32
          }
          break;
      default: 
          return null;
          break;
      }
    }
  else if (iter===9) {
    switch(graph_num) {
      case 0:
            return {
              "MF Pb": 15.2458934784,
              "MF Zn": 3.497014999,
              "MF Fe": 12.4422984123,
              "PbFCPb": 35.410709381,
              "PbFC ZN": 51.606258392,
              "PbFC Fe": 7.1280002594,
              "ZRF Pb": 37.0963323116,
              "ZRF Zn": 65.857028961,
              "ZRF Fe": 35.1788711548,
              "ZRT A Pb": 12.9203318357,
              "ZRT A Zn": 7.9989464879,
              "ZRT A Fe": 4.1686306,
              "ZRT B Pb": 97.900001526,
              "ZRT B Zn": 76.900001526,
              "ZRT B Fe": 34.900001526,
              "ZRT Comb Pb": 49.900001526,
              "ZRT Comb Zn": 69.900001526,
              "ZRT Comb Fe": 39.900001526,
              "Z1RC Pb": 4.2828223705,
              "Z1RC Zn": 57.465496063,
              "Z1RC Fe": 6.6342253685,
              "Z2RC Pb": 89.0510892868,
              "Z2RC Zn": 2.221212387,
              "Z2RC Fe": 74.158090591,
              "ZRCC Pb": 1.8032693863,
              "ZRCC Zn": 46.109272003,
              "ZRCC Fe": 46.2968492508,
              "value": 0,
              "qualityName_id": 1
            };
            break;
      case 1:
          return {
            "SAG1": 78.51496778/1.8,
            "SAG2": 165.15563684/1.8,
            "SAG3": 148.50767439/1.8,
            "Pb Rghr Tails Flow": 3198.995226/40,
            "Zn Rougher 2 Con Flow": 913.59431435/40,
            "Bank A Airflow": 1417.0152574/40,
            "Bank B Airflow": 1549.8928814/40
          };
          break;
      case 2:
          return{
            "Z1RC 01 Output": 12,
            "Z1RC 02 Output": 43,
            "Z2RC 01 Output": 46,
            "Z2RC 02 Output": 72
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
    if (graph_num === 0){
      console.log(newData);
      let isgood = newData["value"];
      console.log(isgood);
      if (isgood!=0){
        $('.goodBad').css('background-color', 'salmon');
      } else {
        $('.goodBad').css('background-color', 'springgreen');
      }
    }
    data_index[graph_num]++;
    if (data_index[graph_num] === 10) {
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
}, 2500);