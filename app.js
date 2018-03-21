var svgWidth = 960;
var svgHeight = 500;


var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;

var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.

var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class

d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);



d3.csv("data.csv", function(err, data) {
  if (err) throw err;


  data.forEach(function(point) {
    point.income50k  = +point.income50k;
    point.hsDegplus = +point.hsDegplus;
    point.abbrev = point.abbrev;
    point.state = point.state;
  });


  // Create scale functions

  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);


  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain

  xLinearScale.domain([d3.min(data, function(point) {
    return +point.hsDegplus-1;
  }), d3.max(data, function(point) {
    return +point.hsDegplus;
  })]);

  yLinearScale.domain([0, d3.max(data, function(point) {
    return +point.income50k ;
  })]);



  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(point) {
      var state = point.state;
      var income50k = +point.income50k;
      var hsDegplus = +point.hsDegplus;
      return (state + "<br> $50,000 plus: " + income50k + "<br> HS Degree Plus: " + hsDegplus);
    });

  chart.call(toolTip);

  chart.selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx", function(point, index) {
        console.log(point.hsDegplus);
        return xLinearScale(point.hsDegplus);
      })
      .attr("cy", function(point, index) {
        return yLinearScale(point.income50k);
      })
      .attr("r", "15")
      .attr("fill", "pink")
      .on("click", function(point) {
        toolTip.show(point);
        toolTip.style("display", null)
      })

      // onmouseout event

      .on("mouseout", function(point, index) {

        toolTip.hide(point);
        toolTip.style("display", "none")        
      });

  chart.selectAll("g")
      .data(data)
      .enter()
      .append("text")
      .attr("dx", function(point, index) {
        return xLinearScale(point.hsDegplus)-11

      })
      .attr("dy", function(point, index) {
        return yLinearScale(point.income50k)+4
      })
      .text(function(point, index) {
        return point.abbrev
      })
      .on("click", function(point) {
        toolTip.show(point);
        toolTip.style("display", null)
      })

      // onmouseout event

      .on("mouseout", function(point, index) {
        toolTip.hide(point);
        toolTip.style("display", "none")        
      });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);



  chart.append("g")
    .call(leftAxis);



  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income above $50,000");



// Append x-axis labels

  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("High School Degree Plus");

  chart.append("text")
    .attr("transform", "translate(" + (width/2) + "," + 0 + ")")
    .attr("class", "axisText")
    .text("Name")

});

 
