<template>

  <div class="dashboard">

    <sidebar/>

    <div v-show="!statsFetched" class="dash-spinner">
      <h4>Fetching Data</h4>
      <b-spinner
        class="loading-spinner"
        type="grow"
        label="Loading"
      />
    </div>

    <template v-if="statsFetched">

      <div id="overview">

        <b-card-group class="overview-cards" deck>

          <b-card class="card-shadow border-left-primary" align="left">
            <b-row align-v="center">
              <b-col cols="9">
                <b-card-text>
                  <div class="card-title node-title">
                    Nodes
                  </div>
                  <div class="overview-text">
                    Count: {{nodeCount}}
                    <br>
                    Categories: {{nodeCategories}}
                  </div>
                </b-card-text>
              </b-col>
              <b-col>
                <font-awesome-icon
                  :icon="['fas', 'virus']"
                  :style="{ color: 'grey' }"
                  size="2x"
                />
              </b-col>
            </b-row>
          </b-card>

          <b-card class="card-shadow border-left-info" align="left">
            <b-row align-v="center">
              <b-col cols="9">
                <b-card-text>
                  <div class="card-title edge-title">
                    Edges
                  </div>
                  <div class="overview-text">
                    Count: {{edgeCount}}
                    <br>
                    Categories: {{edgeCategories}}
                  </div>
                </b-card-text>
              </b-col>
              <b-col>
                <font-awesome-icon
                  :icon="['fas', 'people-arrows']"
                  :style="{ color: 'grey' }"
                  size="2x"
                />
              </b-col>
            </b-row>
          </b-card>

          <b-card class="card-shadow border-left-success" align="left">
            <b-row align-v="center">
              <b-col cols="9">
                <b-card-text>
                  <div class="card-title source-title">
                    Sources
                  </div>
                  <div class="overview-text">
                    {{sourceCount}}
                    <br><br>
                  </div>
                </b-card-text>
              </b-col>
              <b-col>
                <font-awesome-icon
                  :icon="['fas', 'database']"
                  :style="{ color: 'grey' }"
                  size="2x"
                />
              </b-col>
            </b-row>
          </b-card>

          <b-card class="card-shadow border-left-warning" align="left">
            <b-row align-v="center">
              <b-col cols="9">
                <b-card-text>
                  <div class="card-title date-title">
                    Release
                  </div>
                  <div class="overview-text">
                    {{releaseDate}}
                    <br><br>
                  </div>
                </b-card-text>
              </b-col>
              <b-col>
                <font-awesome-icon
                  :icon="['fas', 'calendar-day']"
                  :style="{ color: 'grey' }"
                  size="2x"
                />
              </b-col>
            </b-row>
          </b-card>

        </b-card-group>
      </div>

      <Categories :stats="stats"/>
      <Heatmap :stats="stats"/>
      <Sankey :stats="stats"/>

    </template>

  </div>
</template>

<script>
// @ is an alias to /src
import Categories from '@/components/Categories.vue';
import Sankey from '@/components/Sankey.vue';
import Heatmap from '@/components/Heatmap.vue';
import Sidebar from '@/components/Sidebar.vue';

import yaml from 'js-yaml';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    Categories,
    Sankey,
    Heatmap,
    Sidebar
  },
  data() {
    return {
      stats: null,
      statsFetched: false,
      nodeCategories: null,
      nodeCount: null,
      edgeCategories: null,
      edgeCount: null,
      sourceCount: null,
      releaseDate: '9/01/2020', // TODO
    };
  },
  async mounted() {
    // no idea why but this changes the transition speed from different routes
    // comment out and go from 'About' to the homepage to determine what you
    // like better
    await new Promise((r) => setTimeout(r, 0));

    await this.getStats();
    this.statsFetched = true;

    this.nodeCount = this.stats.node_stats.total_nodes.toLocaleString();
    this.nodeCategories = this.stats.node_stats.node_categories.length.toLocaleString();
    this.edgeCount = this.stats.edge_stats.total_edges.toLocaleString();
    this.edgeCategories = this.stats.edge_stats.predicates.length.toLocaleString();
    this.sourceCount = this.stats.node_stats.provided_by.length.toLocaleString();
  },

  methods: {
    async getStats() {
      if (this.stats === null
          && window.sessionStorage.getItem('stats') === null
      ) {
        const stats = await this.fetchStats();
        this.stats = stats;
        window.sessionStorage.setItem('stats', JSON.stringify(stats));
        window.sessionStorage.setItem('releaseDate', JSON.stringify(this.releaseDate));
      } else if (window.sessionStorage.getItem('stats') !== null) {
        this.stats = JSON.parse(window.sessionStorage.getItem('stats'));
        this.releaseDate = JSON.parse(window.sessionStorage.getItem('releaseDate'));
      }
    },

    async fetchStats() {
      const graphStats = 'https://kg-hub.berkeleybop.io/kg-covid-19/current/stats/merged_graph_stats.yaml'
      const statsYaml = await axios.get(graphStats);

      // get release date from headers
      if ('last-modified' in statsYaml.headers) {
        const lastModified = statsYaml.headers['last-modified'];
        this.releaseDate = new Date(lastModified).toDateString().slice(4);
      }

      let statsData = null;
      try {
        statsData = await yaml.safeLoad(statsYaml.data, 'utf8');
      } catch (e) {
        // console.log('stats yaml.safeLoad ERROR', e);
      }
      return statsData;
    }

  },
};

</script>

<style lang="scss" scoped>
  @import "~@/style/variables";

  .dash-spinner {
    margin: 100px auto;
    width: 20%;
  }
  .dashboard {
    padding-left: $sidebar-width;
  }

  .overview-cards {
    padding: 30px 10px 0 40px;
    width: 100%;
  }

  .overview-text {
    font-size: 15px;
    font-weight: bold;
  }

  .border-left-primary {
    border-left: .25rem solid theme-color("primary") !important;
  }

  .border-left-info {
    border-left: .25rem solid theme-color("info") !important;
  }

  .border-left-success {
    border-left: .25rem solid theme-color("success") !important;
  }

  .border-left-warning {
    border-left: .25rem solid #ba9c17 !important;
  }

  .card-title {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: .25rem;
  }

  .node-title {
    color: theme-color("primary");
  }

  .edge-title {
    color: theme-color("info");
  }

  .source-title {
    color: theme-color("success");
  }

  .date-title {
    color: #ba9c17;
  }

  .card-body {
    padding: 1rem;
  }

</style>
