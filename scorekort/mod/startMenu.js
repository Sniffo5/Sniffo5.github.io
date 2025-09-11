import { startNewGame } from './startGame.js';

const players = {};

function startHtmlGeneration() {
    document.getElementsByClassName('mainContent')[0].innerHTML = '';
    generateStartHtml();
}
function generateStartHtml() {

    let main = document.querySelector('.mainContent');
    let form = document.createElement('form');
    form.className = 'nameForm';
    let input = document.createElement('input');
    input.type = 'text';
    input.name = 'playerName';
    input.placeholder = 'Ange Spelarnamn';
    form.appendChild(input);
    main.appendChild(form);


    const firstPlayerId = 'player1';
    input.addEventListener('input', function (event) {
        const playerName = event.target.value;
        generateHeroHtml(firstPlayerId, playerName);
    });
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputs = form.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i] === event.target && i < inputs.length - 1) {
                    inputs[i + 1].focus();
                    break;
                }
            }
        }
    });
    let newPlayer = document.createElement('button');
    newPlayer.type = 'button';
    newPlayer.id = 'newGame';
    newPlayer.className = 'gameBtn';
    newPlayer.textContent = 'Ny Spelare';
    let startGame = document.createElement('button');
    startGame.type = 'button';
    startGame.id = 'startGame';
    startGame.className = 'gameBtn';
    startGame.textContent = 'Starta Spelet';
    main.appendChild(newPlayer);
    main.appendChild(startGame);


    newPlayer.addEventListener('click', function (event) {
        event.preventDefault();
        const formCount = main.querySelectorAll('input').length;
        const nextPlayerId = `player${formCount + 1}`;

        let input = document.createElement('input');
        input.type = 'text';


        startGame.addEventListener('click', function () {
            startNewGame();
        });
        input.name = 'playerName';
        input.placeholder = 'Ange Spelarnamn';
        form.appendChild(input);

        input.addEventListener('input', function (event) {
            event.preventDefault();
            const playerName = event.target.value;
            generateHeroHtml(nextPlayerId, playerName);
        });

        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const inputs = form.getElementsByTagName('input');
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i] === event.target && i < inputs.length - 1) {
                        inputs[i + 1].focus();
                        break;
                    }
                }
            }


        });
    });

    input.addEventListener('input', function (event) {
        const playerName = event.target.value;
        if (playerName) {
            players[playerName] = []
        }
    });

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputs = form.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i] === event.target && i < inputs.length - 1) {
                    inputs[i + 1].focus();
                    break;
                }
            }
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
    });

    startGame.addEventListener('click', function () {

        let players = [];
        const inputs = form.querySelectorAll('input[name="playerName"]');

        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                players.push(input.value.trim());
            }
        });

        startNewGame(players);
    });
}

function generateHeroHtml(playerId, playerName) {

    let hero = document.querySelector('.hero');
    let playerDiv = document.getElementById(playerId);

    if (!playerName) {

        if (playerDiv) {
            playerDiv.remove();
        }

        return;
    }
    else {

        if (playerDiv) {
            playerDiv.innerHTML = `<h2>${playerName}</h2>`;
        }
        else {
            playerDiv = document.createElement('div');
            playerDiv.className = 'playerDiv';
            playerDiv.id = playerId;
            playerDiv.innerHTML = `<h2>${playerName}</h2>`;
            hero.appendChild(playerDiv);
        }
    }
}



export { startHtmlGeneration };