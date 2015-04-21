$(".repos.show").ready(function() {
  d3.selectAll('svg').remove();
  moodRing();

  function moodRing() {
    analyze();
    chart();

    function chart() {
      var margin = {top: 10, right: 10, bottom: 100, left: 40},
          margin2 = {top: 430, right: 10, bottom: 20, left: 40},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom,
          height2 = 500 - margin2.top - margin2.bottom;

      var parseDate = d3.time.format("%b %Y").parse;

      var x = d3.time.scale().range([0, width]),
          x2 = d3.time.scale().range([0, width]),
          y = d3.scale.linear().range([height, 0]),
          y2 = d3.scale.linear().range([height2, 0]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom"),
              xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
                  yAxis = d3.svg.axis().scale(y).orient("left");

      var brush = d3.svg.brush()
            .x(x2)
                .on("brush", brushed);

      var area = d3.svg.area()
            .interpolate("monotone")
                .x(function(d) { return x(d.date); })
                    .y0(height)
                        .y1(function(d) { return y(d.price); });

      var area2 = d3.svg.area()
            .interpolate("monotone")
                .x(function(d) { return x2(d.date); })
                    .y0(height2)
                        .y1(function(d) { return y2(d.price); });

      var svg = d3.select("#show-graph").append("svg")
            .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

      svg.append("defs").append("clipPath")
            .attr("id", "clip")
              .append("rect")
                  .attr("width", width)
                      .attr("height", height);

      var focus = svg.append("g")
            .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var context = svg.append("g")
            .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

      d3.json("/assets/test.json", function(error, data) {
        data = data.map(function(d) { return type(d); });;
        x.domain(d3.extent(data.map(function(d) { return d.date; })));
        y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
        x2.domain(x.domain());
        y2.domain(y.domain());

      focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

      focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

      context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

      context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
      });

      function brushed() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".area").attr("d", area);
        focus.select(".x.axis").call(xAxis);
      }

      function type(d) {
        d.date = parseDate(d.date);
        d.price = Math.floor(Math.random() * (100 - 40)) + 40;
        return d;
      }
    }

    function analyze() {
      var start = 0,
          stop  = 0.033,
          total = 0,
          repo  = $('.temp_information').data('temp'),
          commits = 0;

      var source = new EventSource('/commit_sentiments?id='+ repo.id);

      source.onmessage = function (event){
        if (event.data === '"stream_end"') { 
          source.close(); 
          console.log(commits);
          fullCircle(Math.round(total/commits)); 
          updateMood(repo, total);
          return
        };
        var e = JSON.parse(event.data);
        commits += 1;
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
