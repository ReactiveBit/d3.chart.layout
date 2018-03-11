import * as d3 from 'd3';
import 'd3.chart';

d3.chart("hierarchy", {

  initialize: function() {
    var chart = this;

    chart.d3      = {};
    chart.layers  = {};

    // List of enabled features. They are only used to check whether a feature
    // was already enabled, to avoid multiple event handler bindings etc.
    this._features = {};

    // Set width and height attributes only if they weren't set explicitly
    if (!chart.base.attr("width"))
      chart.base.attr("width",  this.base.node().parentElement.clientWidth);

    if (!chart.base.attr("height"))
      chart.base.attr("height", this.base.node().parentElement.clientHeight);

    chart.d3.zoom = d3.behavior.zoom();
    chart.layers.base = chart.base.append("g");

    chart.name(chart._name         || "name");
    chart.value(chart._value       || "value");
    chart.duration(chart._duration || 750);



    chart.on("change:value", function() {
      chart.d3.layout.value(function(d) { return chart._value === "_COUNT" ? 1 : d[chart._value]; });
    });


    // http://bl.ocks.org/robschmuecker/7926762
    chart.walker = function(parent, walkerFunction, childrenFunction) {
      if( ! parent ) {
        return;
      }

      walkerFunction(parent);

      var children = childrenFunction(parent);
      if( children ) {
        for( var count = children.length, i = 0; i < count; i++ ) {
          chart.walker( children[i], walkerFunction, childrenFunction );
        }
      }
    };
  },


  name: function(_) {
    if( ! arguments.length ) {
      return this._name;
    }

    this._name = _;

    this.trigger("change:name");
    if( this.root ) {
      this.draw(this.root);
    }

    return this;
  },


  value: function(_) {
    if( ! arguments.length ) {
      return this._value;
    }

    this._value = _;

    this.trigger("change:value");
    if( this.root ) {
      this.draw(this.root);
    }

    return this;
  },


  duration: function(_) {
    if( ! arguments.length ) {
      return this._duration;
    }

    this._duration = _;

    this.trigger("change:duration");
    if( this.root ) {
      this.draw(this.root);
    }

    return this;
  },


  zoomable: function(_) {
    var chart = this;

    var extent = _ || [0, Infinity];

    function zoom() {
      chart.layers.base
        .attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    }

    chart.base.call(chart.d3.zoom.scaleExtent(extent).on("zoom", zoom));

    return chart;
  },


  sort: function(_) {
    var chart = this;

    if( _ === "_ASC" ) {
      chart.d3.layout.sort(function(a, b) { return d3.ascending(a[chart._name], b[chart._name] ); });
    } else if( _ === "_DESC" ) {
      chart.d3.layout.sort(function(a, b) { return d3.descending(a[chart._name], b[chart._name] ); });
    } else {
      chart.d3.layout.sort(_);
    }

    return chart;
  },


  /**
   * Checks whether specified feature was already enabled. Used to prevent
   * multiple event bindings.
   *
   * @param featureName Name of the feature.
   */
  _isFeatureEnabled: function(featureName) {
    return this._features[featureName];
  },


  /**
   * Marks feature as enabled of disabled. Should be used in functions that
   * control certain features.
   *
   * @param featureName Name of the feature.
   * @param isEnabled Feature status to set: true - mark feature as enabled,
   *                  false - mark as disabled.
   */
  _setFeatureEnabled: function(featureName, isEnabled) {
    this._features[featureName] = isEnabled;
  }
});


