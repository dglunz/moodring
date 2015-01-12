$(function() {
var width = 480,
    height = 250,
    twoPi = 2 * Math.PI,
    progress = 0,
    start = 0,
    total = 1308573,
    formatPercent = d3.format(".0%");

var arc = d3.svg.arc()
    .startAngle(0)
    .innerRadius(90)
    .outerRadius(95);

var svg = d3.select("#circle").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "submit-repo")
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

var meter = svg.append("g")
    .attr("class", "progress-meter");

var background = meter.append("path");

meter.append("path").transition().duration(1000).tween("start", function() {
  var i = d3.interpolate(0,1);
  var c = d3.interpolateRgb('white', 'black');
      return function(t) {
        start = i(t);
        color = c(t);
        background.attr("d", arc.endAngle(twoPi * start))
                  .attr("fill", color);
        text.text("Submit");
      };
  })

var foreground = meter.append("path")
    .attr("class", "foreground");

var text = meter.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em");

$("svg#submit-repo").click(function() {
  d3.json("https://api.github.com/repos/mbostock/d3/git/blobs/2e0e3b6305fa10c1a89d1dfd6478b1fe7bc19c1e?" + Math.random())
  .on("progress", function() {
    var i = d3.interpolate(progress, d3.event.loaded / total);
    d3.transition().tween("progress", function() {
      return function(t) {
        progress = i(t);
        foreground.attr("d", arc.endAngle(twoPi * progress));
        text.text(formatPercent(progress));
      };
    });
  })
  .get(function(error, data) {
    meter.transition().delay(1250).attr("transform", "scale(0)");
  });
    $('form#repoForm').trigger('submit.rails');
  });
});
