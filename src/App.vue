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
      <input type="text" name="glo-api-token" v-model="gloToken">
    </div>
    <div id="progress">

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from "axios";

let trelloAxios = null;
let gloAxios = null;

export default {
    name: "app",
    data: () => ({
        trelloApiKey: "fbd5d818e63312d828e59163e199f626",
        trelloToken: "c2dcc93df2ea37e1af5c78f61984500c69459781becc9348a9c7437f0223e29f",
        trelloBoards: [],
        trelloCards: [],
        trelloColumns: [],
        trelloLabels: {},
        selectedBoard: "",
        gloToken: "4480fabb112e4deaeef2fd153bd1192a81435999",
        gloBoard: null,
        gloColumns: {},
        gloLabels: {},
        columnMappings: {

        },
        labelMappings: {

        },
        cardMappings: {

        }
    }),
    components: {},
    methods: {
        loadTrello: function(event) {
            trelloAxios = axios.create({
                baseURL: 'https://api.trello.com/',
                params: {
                    key: this.trelloApiKey,
                    token: this.trelloToken
                }
            });
            trelloAxios
                .get(
                    '1/members/me/boards'
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
                trelloAxios.get(
                    `/1/boards/${this.selectedBoard}/cards`
                ),
                trelloAxios.get(
                    `/1/boards/${this.selectedBoard}/lists`
                ),
                trelloAxios.get(
                    `/1/boards/${this.selectedBoard}/labels`
                ),
            ];

            Promise.all(promises)
                .then(responses => {
                    console.log("cards", responses[0]);
                    this.trelloCards = responses[0].data
                    console.log("columns", responses[1]);
                    this.trelloColumns = responses[1].data;
                    console.log("labels", responses[2]);
                    responses[2].data.forEach(label => {
                        this.trelloLabels[label.name] = label;
                    });
                    this.createBoard();
                })
                .catch(error => {
                    console.error("uh oh", error);
                });
        },
        createBoard: function() {
            const boardName = this.trelloBoards.filter(b => b.id == this.selectedBoard)[0].name

            gloAxios = axios.create({
                baseURL: 'https://app.gitkraken.com/api/glo/',
                headers: {
                    authorization: this.gloToken
                }
            })
            console.log("Creating Glo Board with name:", boardName);
            gloAxios.post(
                '/boards',
                {
                    name: boardName,
                    isPublic: false
                }
            ).then(response => {
                console.log("Board created", response);
                this.gloBoard = response.data;
                this.createColumns();
            })
        },
        createColumns: async function() {
            console.log("Creating columns in Glo");
            try {
                for (let i = 0; i < this.trelloColumns.length;i++){
                    let column = this.trelloColumns[i];
                    const response = await gloAxios.post(
                        `/boards/${this.gloBoard.id}/columns`,
                        {
                            name: column.name,
                            order: i
                        }
                    );
                    this.gloColumns[response.data.id] = response.data;
                    this.columnMappings[column.id] = response.data;
                }
            } catch (error){
                console.error("Failed to create columns", error);
            }
            console.log('Created columns', this.gloColumns);
            this.createLabels();
        },
        createLabels: async function() {
            console.log("Creating labels in Glo");
            for (let labelName in this.trelloLabels) {
                let label = this.trelloLabels[labelName];
                if (label.name != ""){
                    const response = await gloAxios.post(
                        `/boards/${this.gloBoard.id}/labels`,
                        {
                            name: label.name,
                            color: this.getLabelColor(label.color)
                        }
                    );
                    this.gloLabels[response.data.id] = response.data;
                    this.labelMappings[label.id] = response.data.labels.filter(l => l.name == label.name)[0];
                }
            }
            console.log("Created labels", this.gloLabels);
            console.log("Label mapping", this.labelMappings);
            this.createCards();
        },
        getLabelColor: function(colorString) {
            switch(colorString){
                case "yellow":
                    return {
                        r: 230,
                        g: 215,
                        b: 71
                    }
                case "purple":
                    return {
                        r: 157,
                        g: 104,
                        b: 255
                    }
                case "blue":
                    return {
                        r: 0,
                        g: 97,
                        b: 173
                    }
                case "red":
                    return {
                        r: 187,
                        g: 45,
                        b: 41
                    }
                case "green":
                    return {
                        r: 31,
                        g: 126,
                        b: 56
                    }
                case "orange":
                    return {
                        r: 240,
                        g: 147,
                        b: 43
                    }
                case "black":
                    return {
                        r: 77,
                        g: 77,
                        b: 77
                    }
                case "sky":
                    return {
                        r: 30,
                        g: 192,
                        b: 193
                    }
                case "pink":
                    return {
                        r: 241,
                        g: 87,
                        b: 218
                    }
                case "lime":
                    return {
                        r: 89,
                        g: 196,
                        b: 102
                    }
                case null:
                    return {
                        r: 182,
                        g: 187,
                        b: 191
                    }
            }
        },
        createCards: async function() {
            console.log("Creating cards in Glo");
            let column_count = {};
            for (let i = 0; i < this.trelloCards.length; i++){
                let card = this.trelloCards[i];
                
                let board_id = this.gloBoard.id;;
                let column_id = this.columnMappings[card.idList].id;;
                let labels = card.idLabels.map(labelId => ({id: this.labelMappings[labelId].id, name: this.labelMappings[labelId].name}));

                if (column_count[column_id] == null){
                    column_count[column_id] = 0;
                }
                let position = column_count[column_id]++;

                console.log("board", board_id, "column", column_id, "labels", labels, "position", position);

                const response = await gloAxios.post(
                    `/boards/${this.gloBoard.id}/cards`,
                    {
                        board_id,
                        column_id,
                        labels,
                        name: card.name,
                        position
                    }
                );

                this.cardMappings[card.id] = this.response;
            }
            console.log("Created cards!");

            this.addDescriptions();
        },
        addDescriptions: function() {
            console.log("Adding descriptions to cards in Glo");

            console.log("Added Descriptions!");
        }
    }
};
</script>

<style lang="scss">
</style>
