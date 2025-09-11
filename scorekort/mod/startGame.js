import { courtData } from '../main.js';

let gameScore = {};
function saveGameScore() {
    localStorage.setItem('currentGame', JSON.stringify(gameScore));
}

function loadGameScore() {
    const saved = localStorage.getItem('currentGame');
    if (saved) {
        gameScore = JSON.parse(saved);

        document.querySelector('.mainContent').innerHTML = '';
        document.querySelector('.hero').innerHTML = '';
        genCourtHtml(courtData);
        genControlHtml();
    }
}

function startNewGame(players) {

    if (!players || players.length === 0) {
        console.error("No players provided");
    }
    else {
        let maincontent = document.querySelector('.mainContent');
        maincontent.innerHTML = '';
        let hero = document.querySelector('.hero');
        hero.innerHTML = '';

        for (let i = 0; i < players.length; i++) {
            gameScore[players[i]] = { name: players[i], scores: [] };

            for (let j = 0; j < courtData.length; j++) {
                gameScore[players[i]].scores.push(0);
            }
        }
        gameScore['currentCourt'] = 0;
        saveGameScore();
        console.log(gameScore);
        genCourtHtml(courtData);
        genControlHtml();
    }
}
function genCourtHtml(courtData) {
    let mainContent = document.querySelector('.mainContent');
    let hero = document.querySelector('.hero');
    mainContent.innerHTML = '';
    hero.innerHTML = '';

    let courtDiv = document.createElement('div');
    courtDiv.className = 'court';
    courtDiv.innerHTML = `
        <h2>Hål: ${courtData[gameScore.currentCourt].id}</h2>
        <p>Par: ${courtData[gameScore.currentCourt].par}</p>
        <p>Info: ${courtData[gameScore.currentCourt].info}</p>
    `;
    hero.appendChild(courtDiv);

    let scoreSelectorContainer = document.createElement('div');
    scoreSelectorContainer.className = 'scoreSelectorContainer';

    for (let player in gameScore) {
        if (player === "currentCourt") continue;

        let playerSection = document.createElement('div');
        playerSection.className = 'playerScoreSection';
        playerSection.setAttribute('data-player', player);

        let playerLabel = document.createElement('div');
        playerLabel.className = 'playerLabel';
        playerLabel.textContent = player;
        playerSection.appendChild(playerLabel);

        let scoreSelector = document.createElement('div');
        scoreSelector.className = 'scoreSelector';
        scoreSelector.id = `scoreSelector-${player}`;
        scoreSelector.setAttribute('data-player', player);

        let scoreSelectorList = document.createElement('ul');
        scoreSelectorList.className = 'scoreSelectorList';
        scoreSelectorList.setAttribute('data-player', player);

        let padCount = 1;
        for (let i = 0; i < padCount; i++) {
            let pad = document.createElement('li');
            pad.className = 'scoreBtn pad';
            pad.textContent = '';
            scoreSelectorList.appendChild(pad);
        }


        for (let i = 0; i <= 9; i++) {
            let scoreBtn = document.createElement('li');
            scoreBtn.className = 'scoreBtn';
            scoreBtn.textContent = i;
            scoreSelectorList.appendChild(scoreBtn);
        }

        for (let i = 0; i < padCount; i++) {
            let pad = document.createElement('li');
            pad.className = 'scoreBtn pad';
            pad.textContent = '';
            scoreSelectorList.appendChild(pad);
        }

        scoreSelector.appendChild(scoreSelectorList);
        playerSection.appendChild(scoreSelector);
        scoreSelectorContainer.appendChild(playerSection);

        scoreSelectorList.querySelectorAll('.scoreBtn').forEach((btn, idx) => {
            btn.addEventListener('click', function () {
                if (btn.classList.contains('pad')) return;
                let itemHeight = btn.offsetHeight;
                scoreSelectorList.scrollTo({ top: (idx - padCount) * itemHeight, behavior: 'smooth' });

                scoreSelectorList.querySelectorAll('.scoreBtn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                gameScore[player].scores[gameScore.currentCourt] = parseInt(btn.textContent, 10);
                saveGameScore();
            });
        });


        scoreSelectorList.addEventListener('scroll', function () {
            let scrollTop = scoreSelectorList.scrollTop;
            let itemHeight = scoreSelectorList.children[padCount].offsetHeight;
            let index = Math.round(scrollTop / itemHeight) + padCount;
            scoreSelectorList.querySelectorAll('.scoreBtn').forEach(b => b.classList.remove('selected'));
            let btn = scoreSelectorList.children[index];
            if (btn && !btn.classList.contains('pad')) {
                btn.classList.add('selected');
                gameScore[player].scores[gameScore.currentCourt] = parseInt(btn.textContent, 10);
                saveGameScore();
            }
        });


    }

    mainContent.appendChild(scoreSelectorContainer);


    for (let player in gameScore) {
        if (player === "currentCourt") continue;

        let scoreSelector = document.getElementById(`scoreSelector-${player}`);
        let scoreSelectorList = scoreSelector.querySelector('.scoreSelectorList');
        let padCount = 1;
        let scoreForCourt = gameScore[player].scores[gameScore.currentCourt];

        if (scoreForCourt !== undefined && scoreForCourt !== null) {
            let selectedIdx = padCount + parseInt(scoreForCourt, 10);
            scoreSelectorList.querySelectorAll('.scoreBtn').forEach(btn => btn.classList.remove('selected'));

            const btn = scoreSelectorList.children[selectedIdx];
            if (btn && !btn.classList.contains('pad')) {
                btn.classList.add('selected');
                let itemHeight = scoreSelectorList.children[padCount].offsetHeight;
                scoreSelectorList.scrollTo({ top: (selectedIdx - padCount) * itemHeight, behavior: 'auto' });
            }
        }
    }
}


function genControlHtml() {
    let mainContent = document.querySelector('.mainContent');

    let nextCourtBtn = document.createElement('button');
    let nextCourtIcon = document.createElement('span');
    nextCourtIcon.innerHTML = '>';
    nextCourtIcon.className = 'nextCourtIcon';
    nextCourtBtn.appendChild(nextCourtIcon);
    nextCourtBtn.className = 'btn1';
    let previousCourtBtn = document.createElement('button');
    previousCourtBtn.className = 'btn2';
    let previousCourtIcon = document.createElement('span');
    previousCourtIcon.innerHTML = '<';
    previousCourtIcon.className = 'previousCourtIcon';
    previousCourtBtn.appendChild(previousCourtIcon);
    mainContent.appendChild(previousCourtBtn);
    mainContent.appendChild(nextCourtBtn);
    nextCourtBtn.addEventListener('click', function () {
        for (let player in gameScore) {
            if (player === "currentCourt") continue;
            let scoreSelector = document.getElementById(`scoreSelector-${player}`);
            let selectedBtn = scoreSelector.querySelector('.scoreBtn.selected');
            let score = selectedBtn.textContent;
            gameScore[player].scores[gameScore.currentCourt] = score;
        }
          showGameScore();

        if (gameScore.currentCourt < courtData.length - 1) {
            gameScore.currentCourt++;
        } else {
            gameScore.currentCourt = 0;
        }
        saveGameScore();
        genCourtHtml(courtData);
        genControlHtml();
        console.log(gameScore);
    });
    previousCourtBtn.addEventListener('click', function () {
        for (let player in gameScore) {
            if (player === "currentCourt") continue;
            let scoreSelector = document.getElementById(`scoreSelector-${player}`);
            let selectedBtn = scoreSelector.querySelector('.scoreBtn.selected');
            let score = selectedBtn.textContent;
            gameScore[player].scores[gameScore.currentCourt] = score;
        }

        if (gameScore.currentCourt > 0) {
            gameScore.currentCourt--;
        } else {
            gameScore.currentCourt = courtData.length - 1;
        }
        saveGameScore();
        genCourtHtml(courtData);
        genControlHtml();
        console.log(gameScore);
    });


};


function showGameScore() {
    let existingScoreHtml = document.querySelector('.gameScoreHtml');
    if (existingScoreHtml) existingScoreHtml.remove();
    
    let gameScoreHtml = document.createElement('div');
    gameScoreHtml.className = 'gameScoreHtml';

    
    let scores = [];
    for (let player in gameScore) {

      if (player !== "currentCourt"){
        let score = 0;
        for (let i = 0; i < gameScore.currentCourt+1; i++) {
            
            score += Number(gameScore[player].scores[i]);
        }
        scores.push({ name: player, score: score });
        } 
    }
    scores.sort((a, b) => a.score - b.score);

    let scoreList = document.createElement('ul');
    scoreList.className = 'scoreList';
    scores.forEach(s => {
        let li = document.createElement('li');
        li.textContent = `${s.name}: ${s.score}`;
        scoreList.appendChild(li);
    });
    gameScoreHtml.appendChild(scoreList);
    let hero = document.querySelector('.hero');
    let body = document.querySelector('body');
    body.insertBefore(gameScoreHtml, hero);

};


export { startNewGame, loadGameScore };