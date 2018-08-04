<template>
    <!-- eslint-disable -->
    <div id="app" class="">

        <md-toolbar class="md-primary">
            <span class="md-title">Trello -> Glo Import</span>
        </md-toolbar>

        <div>

            <div class="md-layout md-gutter md-alignment-center" style="min-height:55px;margin-top:0px;">
                <div class="md-layout-item">
                    <md-progress-bar id="progress" class="md-accent" md-mode="indeterminate" style="display:none"></md-progress-bar>
                </div>
            </div>

            <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100 md-xsmall-size-100">
                    <md-card class="md-primary">
                        <md-card-header>
                            <div class="md-title" style="color: #64dd17;">Trello Credentials</div>
                        </md-card-header>

                        <md-card-content>
                            <p>You will need to get your API Key and Token from
                                <a class="md-accent" href="https://trello.com/app-key">Trello</a>.</p>
                            <div id="trello">
                                <md-field>
                                    <label>API Key</label>
                                    <md-input v-model="trelloApiKey"></md-input>
                                </md-field>
                                <md-field>
                                    <label>Token</label>
                                    <md-input v-model="trelloToken"></md-input>
                                </md-field>
                            </div>
                        </md-card-content>

                        <md-card-actions>
                            <md-button v-on:click="loadTrello" class="md-accent md-raised">Load Boards</md-button>
                        </md-card-actions>
                    </md-card>
                </div>

                <div class="md-layout-item md-small-size-100 md-xsmall-size-100">
                    <md-card class="md-primary">
                        <md-card-header>
                            <div class="md-title" style="color: #64dd17;">Glo Credentials</div>
                        </md-card-header>

                        <md-card-content>
                            <p>Your Glo Token can be found in the developer tools while on Glo. An official Public API should
                                be out soon.</p>
                            <div id="glo">
                                <md-field>
                                    <label>Board to Import</label>
                                    <md-select v-model="selectedBoard">
                                        <md-option v-for="board of trelloBoards" :key="board.id" v-bind:value="board.id">
                                            {{board.name}}
                                        </md-option>
                                    </md-select>
                                </md-field>
                                <md-field>
                                    <label for="glo-api-token">API Token</label>
                                    <md-input v-model="gloToken"></md-input>
                                </md-field>
                            </div>
                        </md-card-content>

                        <md-card-actions>
                            <md-button v-on:click="importBoard" class="md-accent md-raised">Import!</md-button>
                        </md-card-actions>
                    </md-card>
                </div>
            </div>




            <div class="md-layout md-gutter">
                <div class="md-layout-item">
                    <md-card class="md-primary">
                        <md-card-header>
                            <div class="md-title" style="color: #64dd17;">Details</div>
                        </md-card-header>
                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div style="margin-top:5px;" class="md-layout-item md-xlarge-size-100 md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
                                    <md-card>
                                        <md-card-header>
                                            <md-icon class="md-accent">transform</md-icon>
                                            <span class="md-title"> Summary</span>
                                        </md-card-header>
                                        <md-card-content>
                                            <p>This application will take an existing
                                                <a class="md-accent" href="https://trello.com">Trello</a> board and import it into
                                                <a class="md-accent" href="https://app.gitkraken.com/glo">GitKraken Glo</a>! Note that Glo is under active development, and therefore
                                                not all parts of a Trello board may be copied 1:1.</p>
                                        </md-card-content>
                                    </md-card>
                                </div>
                                <div style="margin-top:5px;" class="md-layout-item md-xlarge-size-100 md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
                                    <md-card>
                                        <md-card-header>
                                            <md-icon class="md-accent">sync_disabled</md-icon>
                                            <span class="md-title"> One-Time Sync</span>
                                        </md-card-header>
                                        <md-card-content>
                                            <p>This application is only a one-time import. This will not sync your items back
                                                and forth between Trello and Glo.</p>
                                        </md-card-content>
                                    </md-card>
                                </div>
                                <div style="margin-top:5px;" class="md-layout-item md-xlarge-size-100 md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
                                    <md-card>
                                        <md-card-header>
                                            <md-icon class="md-accent">security</md-icon>
                                            <span class="md-title"> Security</span>
                                        </md-card-header>
                                        <md-card-content>
                                            <p>We ask for your credentials for both services so that we can make API calls on
                                                your behalf, automating the copy process. This application is entirely client
                                                side, meaning the only time the credentials leave this page is when they
                                                are used to make those API calls. 
                                                <!-- Additionally, the code is open source on
                                                <a class="md-accent" href="https://github.com/James-Quigley/glo-trello-import">GitHub</a>. -->
                                                </p>
                                        </md-card-content>
                                    </md-card>
                                </div>
                                <div style="margin-top:5px;" class="md-layout-item md-xlarge-size-100 md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100">
                                    <md-card>
                                        <md-card-header>
                                            <md-icon class="md-accent">list</md-icon>
                                            <span class="md-title"> Copied Items:</span>
                                        </md-card-header>
                                        <md-card-content>
                                            <md-list>
                                                <md-list-item>Board Name</md-list-item>
                                                <md-list-item>Board Columns</md-list-item>
                                                <md-list-item>Labels</md-list-item>
                                                <md-list-item>Card Name</md-list-item>
                                                <md-list-item>Card Description</md-list-item>
                                                <md-list-item>Card Tasks</md-list-item>
                                            </md-list>
                                        </md-card-content>
                                    </md-card>
                                </div>
                            </div>
                        </md-card-content>
                        <md-card-actions>

                        </md-card-actions>
                    </md-card>
                </div>
            </div>
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
        trelloApiKey: "",
        trelloToken: "",
        trelloBoards: [],
        trelloCards: [],
        trelloColumns: [],
        trelloLabels: {},
        selectedBoard: "",
        gloToken: "",
        gloBoard: null,
        gloColumns: {},
        gloLabels: {},
        columnMappings: {},
        labelMappings: {},
        cardMappings: {}
    }),
    components: {},
    methods: {
        loadTrello: function(event) {
            document.getElementById("progress").style.display = "block";
            trelloAxios = axios.create({
                baseURL: "https://api.trello.com/1",
                params: {
                    key: this.trelloApiKey,
                    token: this.trelloToken
                }
            });
            trelloAxios
                .get("/members/me/boards")
                .then(response => {
                    console.log(response);
                    this.trelloBoards = response.data;
                    document.getElementById("progress").style.display = "none";
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        importBoard: function(event) {
            document.getElementById("progress").style.display = "block";
            console.log(this.selectedBoard);
            let promises = [
                trelloAxios.get(`/boards/${this.selectedBoard}/cards`),
                trelloAxios.get(`/boards/${this.selectedBoard}/lists`),
                trelloAxios.get(`/boards/${this.selectedBoard}/labels`)
            ];

            Promise.all(promises)
                .then(responses => {
                    console.log("cards", responses[0]);
                    this.trelloCards = responses[0].data;
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
            const boardName = this.trelloBoards.filter(
                b => b.id == this.selectedBoard
            )[0].name;

            gloAxios = axios.create({
                baseURL: "https://app.gitkraken.com/api/glo/",
                headers: {
                    authorization: this.gloToken
                }
            });
            console.log("Creating Glo Board with name:", boardName);
            gloAxios
                .post("/boards", {
                    name: boardName,
                    isPublic: false
                })
                .then(response => {
                    console.log("Board created", response);
                    this.gloBoard = response.data;
                    this.createColumns();
                });
        },
        createColumns: async function() {
            console.log("Creating columns in Glo");
            try {
                for (let i = 0; i < this.trelloColumns.length; i++) {
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
            } catch (error) {
                console.error("Failed to create columns", error);
            }
            console.log("Created columns", this.gloColumns);
            this.createLabels();
        },
        createLabels: async function() {
            console.log("Creating labels in Glo");
            for (let labelName in this.trelloLabels) {
                let label = this.trelloLabels[labelName];
                if (label.name != "") {
                    const response = await gloAxios.post(
                        `/boards/${this.gloBoard.id}/labels`,
                        {
                            name: label.name,
                            color: this.getLabelColor(label.color)
                        }
                    );
                    this.gloLabels[response.data.id] = response.data;
                    this.labelMappings[label.id] = response.data.labels.filter(
                        l => l.name == label.name
                    )[0];
                }
            }
            console.log("Created labels", this.gloLabels);
            console.log("Label mapping", this.labelMappings);
            this.createCards();
        },
        getLabelColor: function(colorString) {
            switch (colorString) {
                case "yellow":
                    return {
                        r: 230,
                        g: 215,
                        b: 71
                    };
                case "purple":
                    return {
                        r: 157,
                        g: 104,
                        b: 255
                    };
                case "blue":
                    return {
                        r: 0,
                        g: 97,
                        b: 173
                    };
                case "red":
                    return {
                        r: 187,
                        g: 45,
                        b: 41
                    };
                case "green":
                    return {
                        r: 31,
                        g: 126,
                        b: 56
                    };
                case "orange":
                    return {
                        r: 240,
                        g: 147,
                        b: 43
                    };
                case "black":
                    return {
                        r: 77,
                        g: 77,
                        b: 77
                    };
                case "sky":
                    return {
                        r: 30,
                        g: 192,
                        b: 193
                    };
                case "pink":
                    return {
                        r: 241,
                        g: 87,
                        b: 218
                    };
                case "lime":
                    return {
                        r: 89,
                        g: 196,
                        b: 102
                    };
                case null:
                    return {
                        r: 182,
                        g: 187,
                        b: 191
                    };
            }
        },
        createCards: async function() {
            console.log("Creating cards in Glo");
            let column_count = {};
            for (let i = 0; i < this.trelloCards.length; i++) {
                let card = this.trelloCards[i];

                let board_id = this.gloBoard.id;
                let column_id = this.columnMappings[card.idList].id;
                let labels = card.idLabels.map(labelId => ({
                    id: this.labelMappings[labelId].id,
                    name: this.labelMappings[labelId].name
                }));

                if (column_count[column_id] == null) {
                    column_count[column_id] = 0;
                }
                let position = column_count[column_id]++;

                console.log(
                    "board",
                    board_id,
                    "column",
                    column_id,
                    "labels",
                    labels,
                    "position",
                    position
                );

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

                this.cardMappings[card.id] = response.data;
            }
            console.log("Created cards!");

            this.addDescriptions();
        },
        addDescriptions: async function() {
            console.log("Adding descriptions to cards in Glo");

            for (let card of this.trelloCards) {
                let tasks = [];

                for (let id of card.idChecklists) {
                    const checklist = (await trelloAxios.get(
                        `/checklists/${id}/checkItems`
                    )).data;

                    for (let item of checklist) {
                        tasks.push(item);
                    }
                }

                let taskDesc = "";

                for (let task of tasks) {
                    task.state == "complete"
                        ? (taskDesc += "- [x] ")
                        : (taskDesc += "- [ ] ");
                    taskDesc += `${task.name}\n`;
                }
                console.log("tasks for card", tasks);

                console.log("Card mappings", this.cardMappings);
                console.log("card", card);
                let cardId = this.cardMappings[card.id].id;
                gloAxios.post(`/boards/${this.gloBoard.id}/cards/${cardId}`, {
                    id: cardId,
                    description: {
                        text: `${card.desc}\n${taskDesc}`
                    },
                    fields: [
                        "description",
                        "total_task_count",
                        "completed_task_count"
                    ]
                });
            }

            console.log("Added Descriptions!");
            document.getElementById("progress").style.display = "none";
        }
    }
};
</script>

<style lang="scss">
#progress {
    margin-top: 50px;
}

.md-layout.md-gutter {
    margin-right: 0;
    margin-left: 0;
    margin-top: 50px;
}
</style>
