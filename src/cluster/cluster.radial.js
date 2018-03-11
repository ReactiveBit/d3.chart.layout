import * as d3 from 'd3';
import 'd3.chart';
import '../hierarchy/cluster-tree.radial';

d3.chart("cluster-tree.radial").extend("cluster.radial", {

  initialize : function() {
    this.d3.layout = d3.layout.cluster();
  },
});
