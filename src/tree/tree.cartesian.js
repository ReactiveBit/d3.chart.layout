import * as d3 from 'd3';
import 'd3.chart';
import '../hierarchy/cluster-tree.cartesian';

d3.chart("cluster-tree.cartesian").extend("tree.cartesian", {

  initialize : function() {
    this.d3.layout = d3.layout.tree();
  }
});
