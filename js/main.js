"use strict";
// https://www.showdownbot.com/
// https://www.sportslogos.net/leagues/list_by_sport/2/Baseball-Logos
let data = {};
let myTeam = {};
let dice;
let isRolling = false;

async function init() {
    data = await (await fetch("data.json")).json();
    // nav("dice", () => {
    //     dice = new DICE.dice_box(document.querySelector("#dice-container"));
    //     dice.setDice("1d20");
    // });
    nav("landing");
    // nav("select-lineup", () => setTeam("NL", "LAD"));
}

function reset() {
    myTeam = {};
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
    nav("select-team", () => showTeams('AL'));
}

function showTeams(league) {
    if (myTeam.team) {
        $("#next-to-select-lineup").removeClass("d-none");
    } else {
        $("#next-to-select-lineup").addClass("d-none");
    }
    const teams = data.teams[league].map((team) => {
        return `
            <div 
                class="d-inline-block vh-40 w-50 mx-5 br-4 bg-light bg-url cursor-pointer"
                style="background-image: url('imgs/teams/${league}/${team}.png')"
                onclick="nav('select-lineup', () => setTeam('${league}', '${team}'))"
            ></div>
        `;
    });
    $("#select-team-scroll").html(teams);
}

function setTeam(league, team) {
    myTeam = {
        league,
        team,
        players: data.cards["2025"][league][team],
    };
    showLineup("lineup");
}

function showLineup(position) {
    const cards = myTeam.players[position].map((card) => {
        return `
            <img
                src="imgs/cards/2025/${myTeam.league}/${myTeam.team}/${card}.png"
                class="d-inline-block vh-60 mx-3 br-4 cursor-pointer"
            >
        `;
    });
    $("#select-lineup-scroll").html(cards);
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
