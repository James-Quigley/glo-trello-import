<template>
  <div id="app">
    <div id="trello">
      <h2>Trello</h2>
      <label for="apikey">API Key</label>
      <input type="text" name="apikey" v-model="trelloApiKey">
      <label for="token">Token</label>
      <input type="text" name="token" v-model="trelloToken">
      <button type="submit" v-on:click="loadTrello">Load Boards</button>

      <select id="boards" v-model="selectedBoard">
        <option v-for="board of trelloBoards" :key="board.id" v-bind:value="board.id">
          {{board.name}}
        </option>
      </select>
    </div>
    <div>
      <button type="submit" v-on:click="importBoard">Import!</button>
    </div>
    <div id="glo">
      <h2>Glo</h2>
      <label for="glo-api-token">API Token</label>
      <input type="text" name="glo-api-token">
    </div>
    <div id="progress">

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";

const url = "https://api.trello.com";

export default {
    name: "app",
    data: () => ({
        trelloApiKey: "",
        trelloToken: "",
        trelloBoards: [],
        selectedBoard: ""
    }),
    components: {},
    methods: {
        loadTrello: function(event) {
            axios
                .get(
                    `${url}/1/members/me/boards?key=${
                        this.trelloApiKey
                    }&token=${this.trelloToken}`
                )
                .then(response => {
                    console.log(response);
                    this.trelloBoards = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        importBoard: function(event) {
            console.log(this.selectedBoard);
            let promises = [
                axios.get(
                    `${url}/1/boards/${this.selectedBoard}/cards?key=${
                        this.trelloApiKey
                    }&token=${this.trelloToken}`
                ),
                axios.get(
                    `${url}/1/boards/${this.selectedBoard}/lists?key=${
                        this.trelloApiKey
                    }&token=${this.trelloToken}`
                )
            ];
        }
    }
};
</script>

<style lang="scss">
</style>
