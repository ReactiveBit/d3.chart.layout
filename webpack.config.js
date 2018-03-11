'use strict';

module.exports = {
    context: `${__dirname}/src`,

    entry: {
      'd3.chart.layout.hierarchy': './index.js'
    },

    output: {
        filename: '[name].js',
        path: `${__dirname}/dist`,
        pathinfo: true,
        library: 'd3.chart.layout.hierarchy',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    externals: {
      d3: true,
      'd3.chart': true
    },

    devtool: 'source-map'
};
