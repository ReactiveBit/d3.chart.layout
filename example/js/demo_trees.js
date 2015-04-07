
// Add info about cartesian tree
ChartDemo.registerChart({

  /**
   * Title that will be displayed on demo page.
   */
  title: "tree.cartesian",


  /**
   * Schema of chart properties. This is actually JSON editor schema.
   * See here for details: https://github.com/jdorn/json-editor
   */
  propertySchema: {
    type: "object",
    title: "Properties",
    properties: {
      levelGap: {type: "string", enum: ["auto", 100, 200, 300]}
    }
  },


  /**
   * Default options that will be applied to tree when it's first rendered.
   * Object format should match propertySchema.
   */
  defaults: {
    levelGap: "auto"
  },


  /**
   * Chart initialization. Shouldn't render anything, just set properties and
   * return resulting chart object.
   *
   * @param svgElement SVG element which can be used to
   * @returns {*}
   */
  init: function(svgElement) {
    var tree = svgElement
      .chart("tree.cartesian")
      .margin({ top: 0, right: 180, bottom: 0, left: 40 })
      .radius(function(d) { if( d.size ) return Math.log(d.size); else return 7; })
      .sort(function(a, b) { return d3.descending(a.size, b.size); })
      .zoomable([0.1, 3])
      .collapsible(1);

    return tree;
  },


  /**
   * Apply function that's called each time chart properties are updated in
   * property editor.
   *
   * @param chart Chart which options should be updated.
   * @param options New options that should be applied to passed chart.
   */
  apply: function(chart, options) {
    console.log(">>> Applying chart options:");
    console.log(options);

    chart
      .levelGap(options.levelGap);
  }
});



// Add info about cartesian tree - nothing special here, just to have more than
// one chart in the demo.
ChartDemo.registerChart({

  /**
   * Title that will be displayed on demo page.
   */
  title: "tree.radial",


  /**
   * Schema of chart properties. This is actually JSON editor schema.
   * See here for details: https://github.com/jdorn/json-editor
   */
  propertySchema: null,


  /**
   * Default options that will be applied to tree when it's first rendered.
   * Object format should match propertySchema.
   */
  defaults: {},

  /**
   * Chart initialization. Shouldn't render anything, just set properties and
   * return resulting chart object.
   *
   * @param svgElement SVG element which can be used to
   * @returns {*}
   */
  init: function(svgElement) {
    var tree = svgElement
      .chart("tree.radial")
        .value("size")
        .radius(3)
        .zoomable([0.1, 3])
        .collapsible(2);

    return tree;
  },


  /**
   * Apply function that's called each time chart properties are updated in
   * property editor.
   *
   * @param chart Chart which options should be updated.
   * @param options New options that should be applied to passed chart.
   */
  apply: function(chart, options) {
    // Nothing to apply yet.
  }
});
