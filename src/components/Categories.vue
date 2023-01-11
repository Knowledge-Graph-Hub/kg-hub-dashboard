<template>

  <div id="categories">

    <b-card-group class="chart-cards" deck>

      <b-card class="card-shadow first-card" header-tag="header" align="center">
        <template v-slot:header>
          <div class="card-title graph-title">
            Node Categories (Log Scale)
          </div>
        </template>
        <div id="node-categories" class="chart"></div>
      </b-card>

      <b-card class="card-shadow" header-tag="header" align="center">
        <template v-slot:header>
          <div class="card-title graph-title">
            Edge Categories (Log Scale)
          </div>
        </template>
        <div id="edge-categories" class="chart"></div>
      </b-card>

    </b-card-group>

  </div>

</template>

<script>

import Plotly from 'plotly.js-dist';

export default {
  name: 'Categories',
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.getEdgeChart();
    this.getNodeChart();
  },
  methods: {
    getEdgeChart() {
      const layout = {
        height: 450,
        width: 500,
        margin: {
          l: 250, r: 20, t: 40, b: 40
        },
        yaxis: {
          showline: true,
          linewidth: 1,
          ticks: 'outside',
          tickcolor: 'rgba(0,0,0,0)'
        },
      };

      // Get data from this.stats
      const data = Object.keys(this.stats.edge_stats.count_by_predicates).map((cat) => {
        const category = cat
          .replace('biolink:', '')
          .replace(/_/g, ' ');
        const catCount = this.stats.edge_stats.count_by_predicates[cat].count;
        return [category, catCount];
      });

      // sort by count
      data.sort((a, b) => {
        if (a[1] === b[1]) {
          return 0;
        }

        return (a[1] < b[1]) ? -1 : 1;
      });

      const labels = data.map((val) => val[0]);
      const counts = data.map((val) => val[1]);

      const zeros = labels.map(() => 0);

      const initData = [
        {
          y: labels,
          x: zeros,
          type: 'bar',
          orientation: 'h',
          marker: {
            color: 'rgb(91, 192, 222)',
          },
        }
      ];

      layout.xaxis = {
        type: 'log',
        linewidth: 1,
        showline: true,
        range: [0, Math.log10(Math.max(...counts))]
      };

      Plotly.newPlot('edge-categories', initData, layout);
      Plotly.animate('edge-categories', {
        data: [{
          x: counts
        }]
      }, {
        transition: {
          duration: 1000,
          easing: 'cubic-in-out'

        },
        frame: {
          duration: 1000,
          redraw: false
        }
      });
    },
    getNodeChart() {
      const layout = {
        height: 450,
        width: 500,
        margin: {
          l: 130, r: 20, t: 40, b: 40
        },
        yaxis: {
          ticks: 'outside',
          tickcolor: 'rgba(0,0,0,0)'
        }
      };

      // Get data from this.stats
      const data = Object.keys(this.stats.node_stats.count_by_category).map((cat) => {
        const category = cat.replace('biolink:', '');
        const catCount = this.stats.node_stats.count_by_category[cat].count;
        return [category, catCount];
      });

      // sort by count
      data.sort((a, b) => {
        if (a[1] === b[1]) {
          return 0;
        }

        return (a[1] < b[1]) ? -1 : 1;
      });

      const labels = data.map((val) => val[0]);
      const counts = data.map((val) => val[1]);

      const zeros = labels.map(() => 0);

      const initData = [
        {
          y: labels,
          x: zeros,
          type: 'bar',
          orientation: 'h',
          marker: {
            color: 'rgb(2, 117, 216)',
          },
        }
      ];

      layout.xaxis = {
        type: 'log',
        linewidth: 1,
        showline: true,
        range: [0, Math.log10(Math.max(...counts))]
      };

      Plotly.newPlot('node-categories', initData, layout);
      Plotly.animate('node-categories', {
        data: [{
          x: counts
        }]
      }, {
        transition: {
          duration: 1000,
          easing: 'cubic-in-out'

        },
        frame: {
          duration: 1000,
          redraw: false
        }
      });
    }
  }
};

</script>

<style lang="scss" scoped>
  @import "~@/style/variables";

  h3 {
    padding-top: 20px;
  }

  .card {
    min-width: 400px !important;
  }

  .chart {
    margin: auto;
    width: 100%;
  }

  .chart-cards {
    padding: 50px 80px;
    margin-right: 0 !important;
  }

  .first-card {
    margin-right: 100px !important;
  }

  .graph-title {
    color: #15556A;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 0 !important;
  }

  .card-body {
    padding: 0 1.25rem 1.25rem 1.25rem !important;
  }

</style>
