<template>
  <div id="heatmap">

    <b-card class="card-shadow heatmap-card" header-tag="header" align="center">
      <template v-slot:header>
        <div class="card-title graph-title">
          Node Categories By Source
        </div>
      </template>
      <div id="node-heatmap" class="chart"></div>
    </b-card>

    <b-card class="card-shadow heatmap-card" header-tag="header" align="center">
      <template v-slot:header>
        <div class="card-title graph-title">
          Edge Categories By Source (Top 20)
        </div>
      </template>
      <div id="edge-heatmap" class="chart"></div>
    </b-card>

  </div>

</template>

<script>

import Plotly from 'plotly.js-dist';

export default {
  name: 'Heatmap',
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.makeHeatMap('node-heatmap', 'node_stats', 'count_by_category');
    this.makeHeatMap('edge-heatmap', 'edge_stats', 'count_by_predicates');
  },
  methods: {
    makeHeatMap(plotDiv, statType, countType) {
      const pivotTable = this.getPivotTable(statType, countType);

      let categories = Object.keys(pivotTable).reverse();
      const sources = this.stats[statType].provided_by.sort().reverse();

      // 2d array for heatmap
      const counts = [];

      for (const source of sources) {
        const heatmapRow = [];
        for (const cat of categories) {
          heatmapRow.push(pivotTable[cat][source]);
        }
        counts.push(heatmapRow);
      }

      categories = categories.map((cat) => cat.replace('biolink:', '')
        .replace(/_/g, ' '));

      const layout = {
        autosize: false,
        margin: {
          l: 200, r: 160, t: 30, b: 170
        },
        height: 15 * sources.length + 220,
        width: 850,
        xaxis: {
          // title: 'Association'
          tickangle: 30,
          tickfont: {
            size: 13
          },
          showgrid: false
        },
        yaxis: {
          // title: 'Source'
          tickfont: {
            size: 13
          },
          showgrid: false
        },
      };

      const data = [
        {
          z: counts,
          x: categories,
          y: sources,
          type: 'heatmap',
          xgap: 3,
          ygap: 3
        }
      ];

      // Todo fix this hack
      if (plotDiv.startsWith('edge')) {
        data[0].colorscale = [
          ['0', 'rgb(255,255,255)'],
          ['0.0001', 'rgb(116,173,209)'],
          ['0.5', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ];
      } else {
        data[0].colorscale = [
          ['0', 'rgb(255,255,255)'],
          ['0.0001', 'rgb(171,217,233)'],
          ['0.1', 'rgb(116,173,209)'],
          ['0.666', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ];
      }

      Plotly.newPlot(plotDiv, data, layout);
    },
    getPivotTable(statType, countType) {
      const pivotTable = {};

      const sources = this.stats.edge_stats.provided_by.sort();

      // Get top 20 edge categories from this.stats
      const catCounts = Object.keys(this.stats[statType][countType]).map((cat) => {
        const catCount = this.stats[statType][countType][cat].count;
        return [cat, catCount];
      });

      // sort by count
      catCounts.sort((a, b) => {
        if (a[1] === b[1]) {
          return 0;
        }

        return (a[1] < b[1]) ? -1 : 1;
      });

      const categories = catCounts.map((val) => val[0]).slice(-20);

      // zeros
      for (const cat of categories) {
        pivotTable[cat] = {};
        for (const source of sources) {
          pivotTable[cat][source] = 0;
          pivotTable[cat][source] = 0;
        }
      }

      for (const cat in this.stats[statType][countType]) {
        if (categories.includes(cat)) {
          for (const src in this.stats[statType][countType][cat].provided_by) {
            pivotTable[cat][src] = this.stats[statType][countType][cat].provided_by[src].count;
          }
        }
      }
      return pivotTable;
    }
  }
};

</script>

<style lang="scss" scoped>

  @import "~@/style/variables";

  .chart {
    margin: 0 auto;
    width: 90%;
  }

  .heatmap-card {
    margin: 20px auto;
    width: 60%;
  }

  .card {
    min-width: 1000px !important;
  }

  .graph-title {
    color: #15556A;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 0 !important;
  }

  .card-body {
    padding: 0 1.25rem 0 1.25rem !important;
  }
</style>
