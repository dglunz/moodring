$(".pages.home").ready(function() {
  var width = 480,
      height = 250,
      twoPi = 2 * Math.PI,
      progress = 0,
      start = 0,
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

  var foreground = meter.append("path")
      .attr("class", "foreground");

  var text = meter.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em");

  var circleLine = meter.append("path");

  function drawCircle() {
  circleLine.transition().duration(1000).tween("start", function() {
    var i = d3.interpolate(0,1);
    var c = d3.interpolateRgb('white', 'black');
        return function(t) {
          start = i(t);
          color = c(t);
          background.attr("d", arc.endAngle(twoPi * start))
                    .attr("fill", color);
          text.text("Submit");
        };
    });
  }

  function loadingCircle() {
  circleLine.transition().duration(1000).tween("start", function() {
    var i = d3.interpolate(0,1);
    var c = d3.interpolateRgb('white', 'black');
        return function(t) {
          start = i(t);
          color = c(t);
          background.attr("d", arc.endAngle(twoPi * start))
                    .attr("fill", color);
          text.text("Analyzing");
        };
    }).each("end", loadingCircle);
  }

  drawCircle();

  $('#repoForm').keydown(function(e) {
    if (e.keyCode==13) {
      $('svg#submit-repo').trigger('click');
    }
  });

  $("svg#submit-repo").click(function() {
    $('form#repoForm').trigger('submit.rails');
    loadingCircle();
  });
});
