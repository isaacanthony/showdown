"use strict";
// https://www.showdownbot.com/
// https://www.sportslogos.net/leagues/list_by_sport/2/Baseball-Logos
let data = {};
let dice;
let isRolling = false;

async function init() {
    data = await (await fetch("data.json")).json();
    console.log(data);
    // nav("dice", () => {
    //     dice = new DICE.dice_box(document.querySelector("#dice-container"));
    //     dice.setDice("1d20");
    // });
    nav("landing");
}

function nav(page, callback = () => {}) {
    $("#container").load(`html/${page}.html`, callback);
}

function startGame() {
    // Generate game ID.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    $("#game-id").val(result);

    // TODO: Set listener for opponent.
}

function joinGame() {
    // TODO: Create connection to opponent.
    const gameId = $("#game-id").val();
    console.log(`Joining ${gameId}...`);
    nav("select-team", () => setLeague('AL'));
}

function setLeague(league) {
    const teams = data.teams[league].map((team) => {
        return `
            <img
                src="imgs/teams/${league}/${team}.png"
                class="d-inline-block vh-40 w-auto px-5 cursor-pointer"
                onclick="nav('select-lineup', () => setTeam('${league}', '${team}'))"
            >
        `;
    });
    $("#select-team-scroll").html(teams);
}

function setTeam(league, team) {
    console.log(league, team);
}

function rollDice() {
    if (isRolling) return;
    isRolling = true;
    const vector = { x: (Math.random() * 3 - 1) * dice.w, y: -(Math.random() * 3 - 1) * dice.h };
    const dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    const boost = (Math.random() + 2) * dist;
    const beforeRoll = (_) => {
        $("#btn-roll-value").empty();
    };
    const afterRoll = (notation) => {
        $("#btn-roll-value").html(`: ${notation.resultString}`);
        isRolling = false;
    };
    dice.throw_dices(vector, boost, dist, beforeRoll, afterRoll);
}
