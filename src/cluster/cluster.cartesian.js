import * as d3 from 'd3';
import 'd3.chart';
import '../hierarchy/cluster-tree.cartesian';

d3.chart("cluster-tree.cartesian").extend("cluster.cartesian", {

  initialize : function() {
    this.d3.layout = d3.layout.cluster();
  },
});
