(function () {

  // Contains the list of all charts to be displayed.
  var demoCharts = [];
  var currentChartId = -1;
  var currentChart = null;


  // Public functions
  window.ChartDemo = {

    options: {},

    init: function (options) {
      this.options = options;

      this._initNavigation();
      this.navigate(0);
    },


    /**
     * Registers chart to be displayed on demo page.
     *
     * @param chartInfo
     */
    registerChart: function (chartInfo) {
      demoCharts.push(chartInfo);
    },


    /**
     * Navigates to chart wit specified chatId
     * @param chartId Chart index in the list of charts registered for demo.
     */
    navigate: function(chartId) {
      if (currentChartId == chartId)
        return;

      currentChartId = chartId;

      var chartInfo = demoCharts[chartId];

      // Update navigation links
      var $nav = this.options.navigationContainer;
      $nav.find('li').removeClass('active');

      var $link = $nav.find('a[data-id="' + chartId + '"]');
      $link.closest('li').addClass('active');

      // Update page title
      $('h1.page-header').text(chartInfo.title);

      this._initEditor(this.options.editorContainer, chartInfo);

      // Finally render default data.
      var _this = this;
      currentChart = this._render(chartId);

      d3.json("data/flare.json", function(error, json) {
        _this.draw(json);
      });
    },


    draw: function(data) {
      currentChart.draw(data);
    },


    /**
     * Generated random tree.
     *
     * @param levels Number of levels.
     * @param maxChildrenPerParent Maximum number of children for each parent.
     *
     * @returns {{name: string, children: Array}}
     */
    generateRandomTree: function (levels, maxChildrenPerParent) {
      var root = {
        name: 'root',
        children: []
      };

      function generateChildren(currentRoot, level) {
        // For
        if ((Math.random() < 0.3) && level > 1)
          return;

        if (level > levels)
          return;

        var numChildren = Math.floor((Math.random() * maxChildrenPerParent) + 1);
        for (var i = 0; i < numChildren; i++) {

          var child = {
            name: "child " + level + "-" + (i + 1),
            children: []
          };

          currentRoot.children.push(child);

          generateChildren(child, level + 1);
        }
      }

      generateChildren(root, 1);

      return root;
    },


    // Quick and dirty implementation of navigation.
    _initNavigation: function () {
      var _this = this;

      var $container = this.options.navigationContainer;
      $container.empty();

      for (var i = 0; i < demoCharts.length; i++) {
        var chart = demoCharts[i];

        var $menuItem = $('<li><a href="#" data-id="' + i + '">' + chart.title + '</a></li>');
        $container.append($menuItem);
      }

      $container.on('click', 'a', function (e) {
        e.preventDefault();
        _this.navigate(parseInt($(e.target).data('id')));
      });
    },


    _render: function (chartID) {
      var chartInfo = demoCharts[chartID];
      this.options.chartContainer.empty();

      var svg = d3.select(this.options.chartContainer[0])
        .append("svg");

      var chart = chartInfo.init(svg);
      chartInfo.apply(chart, chartInfo.defaults);

      return chart;
    },


    _initEditor: function ($container, chartInfo) {
      $container.empty();

      if (chartInfo.propertySchema == null)
        return;

      // Initialize the editor
      JSONEditor.defaults.options.theme = 'bootstrap3';

      var editor = new JSONEditor($container[0], {
        schema: chartInfo.propertySchema,
        disable_properties: true,
        disable_edit_json: true,
        disable_collapse: true,
        form_name_root: "chart",
        startval: chartInfo.defaults
      });


      // Listen for changes
      editor.on("change", function () {
        console.log("Applying chart options");
        console.log(editor.getValue());

        chartInfo.apply(currentChart, editor.getValue());
      });
    }

  }

})();
