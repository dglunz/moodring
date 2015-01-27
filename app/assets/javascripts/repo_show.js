$(".repos.show").ready(function() {
  d3.selectAll('svg').remove();
  moodRing();

  function moodRing() {
    analyze();

    function analyze() {
      var start = 0,
          stop  = 0.033,
          total = 0,
          repo  = $('.temp_information').data('temp');

      var source = new EventSource('/commit_sentiments?id='+ repo.id);

      source.onmessage = function (event){
        if (event.data === '"stream_end"') { 
          source.close(); 
          fullCircle(Math.round(total/30)); 
          updateMood(repo, total);
          return
        };
        var e = JSON.parse(event.data);
        score = +e["score"];
        total += score;
        circlePiece(start, stop, score);
        start += 0.033;
        stop += 0.033;
      }
    }

    var width = 480,
        height = 250,
        twoPi = 2 * Math.PI,
        created = 0;

    var svg = d3.select("#show-circle").append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    var meter = svg.append("g")
        .attr("class", "progress-meter");


    var text = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");

    var o = d3.scale.ordinal()
        .domain(d3.range(100))
        .range(["#e34a33", "#fdbb84", "#fee8c8", "#e5f5f9", "#99d8c9"]);

    function circlePiece(start, end, score) {
        var background = meter.append("path");
        var arc = d3.svg.arc()
          .startAngle(twoPi * start)
          .innerRadius(85)
          .outerRadius(95);

        svg.append("path").transition().duration(1000).tween("created", function() {
          var i = d3.interpolate(start,end);
          var c = d3.interpolateRgb('white', o(score));
              return function(t) {
                created = i(t);
                color = c(t);
                background.attr("d", arc.endAngle(twoPi * created))
                          .attr("fill", color);
                text.text(score.toString());
              };
        })
    }

    function fullCircle(total) {
        var background = meter.append("path");
        var arc = d3.svg.arc()
          .startAngle(0)
          .innerRadius(85)
          .outerRadius(95);

        svg.append("path").transition().duration(1000).tween("created", function() {
          var i = d3.interpolate(0,2);
          var c = d3.interpolateRgb('white', o(total));
              return function(t) {
                created = i(t);
                color = c(t);
                background.attr("d", arc.endAngle(twoPi * created))
                          .attr("fill", color);
                text.text(total.toString());
              };
        })
    }

    function updateMood(repo, total) {
      $.ajax({
        type: "PATCH",
        url: "/repos/"+ repo.id,
        data: { "mood": total }
      });
    }
  }
});
