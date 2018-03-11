import * as d3 from 'd3';
import 'd3.chart';
import '../hierarchy/hierarchy';

d3.chart("hierarchy").extend("pack.nested", {

  initialize : function() {
    var chart = this;

    chart.d3.layout = d3.layout.pack();

    chart._width  = chart.base.attr("width");
    chart._height = chart.base.attr("height");
    chart.diameter(chart._diameter || Math.min(chart._width, chart._height));

    chart.d3.zoom.translate([(chart._width - chart._diameter) / 2, (chart._height - chart._diameter) / 2]);

    chart.layers.base
      .attr("transform", "translate(" + (chart._width - chart._diameter) / 2 + "," + (chart._height - chart._diameter) / 2 + ")");


    chart.layer("base", chart.layers.base, {

      dataBind: function(data) {
        return this.selectAll(".node").data(data);
      },

      insert: function() {
        return this.append("g");
      },

      events: {
        enter: function() {

          this.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

          this.append("circle")
            .attr("r", function(d) { return d.r; });

          this.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle");

          this.on("click", function (event) {
            chart.trigger("click:node", event);
          });
        },

        merge: function() {

          this.attr("class", function(d) { return d.children ? "node parent" : "node child"; });

          this.select("text")
            .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
            .text(function(d) { return d[chart._name]; });
        }
      }
    });


    chart.on("change:diameter", function() {
      chart.layers.base
        .attr("transform", "translate(" + (chart._width - chart._diameter) / 2 + "," + (chart._height - chart._diameter) / 2 + ")");
    });
  },


  transform: function(root) {
    var chart = this;

    chart.root = root;

    return chart.d3.layout
      .size([chart._diameter, chart._diameter])
      .nodes(root);
  },


  diameter: function(_) {
    if( ! arguments.length ) {
      return this._diameter;
    }

    this._diameter = _ - 10;

    this.trigger("change:diameter");
    if( this.root ) {
      this.draw(this.root);
    }

    return this;
  },


  collapsible: function() {
    var chart = this;

    var node,
        x = d3.scale.linear().range([0, chart._diameter]),
        y = d3.scale.linear().range([0, chart._diameter]);


    chart.layers.base.on("merge", function() {
      node = chart.root;
      chart.on("click:node", function(d) {
        collapse(node == d ? chart.root : d);
      });
    });


    function collapse(d) {
      var k = chart._diameter / d.r / 2;

      x.domain([d.x - d.r, d.x + d.r]);
      y.domain([d.y - d.r, d.y + d.r]);

      var t = chart.layers.base.transition()
        .duration(chart._duration);

      t.selectAll(".node")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

      t.selectAll("circle")
        .attr("r", function(d) { return k * d.r; });

      t.selectAll("text")
        .style("opacity", function(d) { return k * d.r > 20 ? 1 : 0; });

      node = d;
    }

    return chart;
  }
});


