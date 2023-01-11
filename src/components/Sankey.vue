<template>

  <div id="sankey">

    <b-card class="card-shadow sankey-card" header-tag="header" align="center">
      <template v-slot:header>
        <div class="card-title graph-title">
          Source > Category > Category > Source
        </div>
      </template>
      <div id="sankey-diagram" class="chart"></div>
    </b-card>

  </div>

</template>

<script>

import sankeyConfig from '@/api/SankeyConfig';
import Plotly from 'plotly.js-dist';

export default {
  name: 'Sankey',
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.makeSankey();
  },
  methods: {
    makeSankey() {
      // Reference code
      // https://nbviewer.jupyter.org/github/deepakunni3/kg-covid-19-illustrations/
      // blob/master/sankey/KG-COVID-19-sankey-plots.ipynb

      const edgeSourceLeft = this.stats.edge_stats.provided_by.map((val) => `l#${val}`);
      const edgeSourceRight = this.stats.edge_stats.provided_by.map((val) => `r#${val}`);

      const nodeCatSub = this.stats.node_stats.node_categories.map((val) => `s#${val}`);
      const nodeCatObj = this.stats.node_stats.node_categories.map((val) => `o#${val}`);
      const additional = ['s#unknown', 'o#unknown'];

      const allNodes = Array.from(
        new Set(
          edgeSourceLeft.concat(edgeSourceRight, nodeCatSub, nodeCatObj, additional)
        )
      ).sort();

      sankeyConfig.data[0].node.label = allNodes;

      for (const category in this.stats.node_stats.count_by_category) {
        const target = allNodes.indexOf(`s#${category}`);

        /* if (category === 'biolink:OntologyClass') {
          // eslint-disable-next-line no-continue
          continue;
        } */

        if ('provided_by' in this.stats.node_stats.count_by_category[category]) {
          for (const provider in this.stats.node_stats.count_by_category[category].provided_by) {
            const source = allNodes.indexOf(`l#${provider}`);
            const { count } = this.stats.node_stats.count_by_category[category].provided_by[provider];
            sankeyConfig.data[0].link.source.push(source);
            sankeyConfig.data[0].link.target.push(target);
            sankeyConfig.data[0].link.value.push(count);
            sankeyConfig.data[0].link.label.push(count.toString());
          }
        }
      }

      for (const spo in this.stats.edge_stats.count_by_spo) {
        const triple = spo.split('-');
        let source = allNodes.indexOf(`s#${triple[0]}`);
        let target = allNodes.indexOf(`o#${triple[2]}`);

        const { count } = this.stats.edge_stats.count_by_spo[spo];

        /* if (triple[0] === 'biolink:OntologyClass' || triple[2] === 'biolink:OntologyClass') {
          // eslint-disable-next-line no-continue
          console.log(triple[0]);
          console.log(triple[2]);
          continue;
        } */

        sankeyConfig.data[0].link.source.push(source);
        sankeyConfig.data[0].link.target.push(target);
        sankeyConfig.data[0].link.value.push(count);
        sankeyConfig.data[0].link.label.push(triple[1].replace(/^[lrso]#/, ''));

        // swap source and target
        source = target;

        if ('provided_by' in this.stats.edge_stats.count_by_spo[spo]) {
          for (const provider in this.stats.edge_stats.count_by_spo[spo].provided_by) {
            target = allNodes.indexOf(`r#${provider}`);
            const { count } = this.stats.edge_stats.count_by_spo[spo].provided_by[provider];
            sankeyConfig.data[0].link.source.push(source);
            sankeyConfig.data[0].link.target.push(target);
            sankeyConfig.data[0].link.value.push(count);
            sankeyConfig.data[0].link.label.push(count.toString());
          }
        }
      }

      sankeyConfig.data[0].node.label = sankeyConfig.data[0].node.label.map(
        (val) => val.replace(/^[lrso]#/, '')
      );

      // link colors
      const linkOpacity = '0.4';
      sankeyConfig.data[0].link.color = sankeyConfig.data[0].link.source.map((val) => {
        if (sankeyConfig.data[0].node.color[val] != null) {
          return sankeyConfig.data[0].node.color[val].replace('0.8', linkOpacity);
        }
      });
      Plotly.newPlot('sankey-diagram', sankeyConfig);
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

  .sankey-card {
    margin: 20px auto;
    width: 85%;
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
    padding: 0 1.25rem 0 0 !important;
  }

</style>
