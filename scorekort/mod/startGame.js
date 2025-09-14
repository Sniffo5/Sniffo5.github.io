import { courtData } from "../main.js";

let gameScore = {};
let courtStatus = [];

function saveGameScore() {
  localStorage.setItem("currentGame", JSON.stringify(gameScore));
}

function loadGameScore() {
  const saved = localStorage.getItem("currentGame");
  if (saved) {
    gameScore = JSON.parse(saved);

    document.querySelector(".mainContent").innerHTML = "";
    document.querySelector(".hero").innerHTML = "";
    genCourtHtml(courtData);
    genControlHtml();
    createCourtSelector();
  }
}

function startNewGame(players) {
  if (!players || players.length === 0) {
    console.error("No players provided");
  } else {
    let maincontent = document.querySelector(".mainContent");
    maincontent.innerHTML = "";
    let hero = document.querySelector(".hero");
    hero.innerHTML = "";

    for (let i = 0; i < players.length; i++) {
      gameScore[players[i]] = { name: players[i], scores: [] };

      for (let j = 0; j < courtData.length; j++) {
        gameScore[players[i]].scores.push(0);
      }
    }
    gameScore["currentCourt"] = 0;
    saveGameScore();
    console.log(gameScore);
    genCourtHtml(courtData);
    genControlHtml();
    createCourtSelector();
  }
}

function genCourtHtml(courtData) {
  let mainContent = document.querySelector(".mainContent");
  let hero = document.querySelector(".hero");
  mainContent.innerHTML = "";
  hero.innerHTML = "";

  let courtDiv = document.createElement("div");
  courtDiv.className = "court";
  courtDiv.innerHTML = `
        <h2>Hål: ${courtData[gameScore.currentCourt].id}</h2>
        <p>Par: ${courtData[gameScore.currentCourt].par}</p>
        <p>Info: ${courtData[gameScore.currentCourt].info}</p>
    `;
  hero.appendChild(courtDiv);

  let scoreSelectorContainer = document.createElement("div");
  scoreSelectorContainer.className = "scoreSelectorContainer";

  for (let player in gameScore) {
    if (player === "currentCourt") continue;

    let playerSection = document.createElement("div");
    playerSection.className = "playerScoreSection";
    playerSection.setAttribute("data-player", player);

    let playerLabel = document.createElement("div");
    playerLabel.className = "playerLabel";
    playerLabel.textContent = player;
    playerSection.appendChild(playerLabel);

    let scoreSelector = document.createElement("div");
    scoreSelector.className = "scoreSelector";
    scoreSelector.id = `scoreSelector-${player}`;
    scoreSelector.setAttribute("data-player", player);

    let scoreSelectorList = document.createElement("ul");
    scoreSelectorList.className = "scoreSelectorList";
    scoreSelectorList.setAttribute("data-player", player);

    let padCount = 1;
    for (let i = 0; i < padCount; i++) {
      let pad = document.createElement("li");
      pad.className = "scoreBtn pad";
      pad.textContent = "";
      scoreSelectorList.appendChild(pad);
    }

    for (let i = 0; i <= 9; i++) {
      let scoreBtn = document.createElement("li");
      scoreBtn.className = "scoreBtn";
      scoreBtn.textContent = i;
      scoreSelectorList.appendChild(scoreBtn);
    }

    for (let i = 0; i < padCount; i++) {
      let pad = document.createElement("li");
      pad.className = "scoreBtn pad";
      pad.textContent = "";
      scoreSelectorList.appendChild(pad);
    }

    scoreSelector.appendChild(scoreSelectorList);
    playerSection.appendChild(scoreSelector);
    scoreSelectorContainer.appendChild(playerSection);

    scoreSelectorList.querySelectorAll(".scoreBtn").forEach((btn, idx) => {
      btn.addEventListener("click", function () {
        if (btn.classList.contains("pad")) return;
        let itemHeight = btn.offsetHeight;
        scoreSelectorList.scrollTo({
          top: (idx - padCount) * itemHeight,
          behavior: "smooth",
        });

        scoreSelectorList
          .querySelectorAll(".scoreBtn")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");

        gameScore[player].scores[gameScore.currentCourt] = parseInt(
          btn.textContent,
          10
        );
        saveGameScore();
      });
    });

    scoreSelectorList.addEventListener("scroll", function () {
      let scrollTop = scoreSelectorList.scrollTop;
      let itemHeight = scoreSelectorList.children[padCount].offsetHeight;
      let index = Math.round(scrollTop / itemHeight) + padCount;
      scoreSelectorList
        .querySelectorAll(".scoreBtn")
        .forEach((b) => b.classList.remove("selected"));
      let btn = scoreSelectorList.children[index];
      if (btn && !btn.classList.contains("pad")) {
        btn.classList.add("selected");
        gameScore[player].scores[gameScore.currentCourt] = parseInt(
          btn.textContent,
          10
        );
        saveGameScore();
      }
    });
  }

  mainContent.appendChild(scoreSelectorContainer);

  for (let player in gameScore) {
    if (player === "currentCourt") continue;

    let scoreSelector = document.getElementById(`scoreSelector-${player}`);
    let scoreSelectorList = scoreSelector.querySelector(".scoreSelectorList");
    let padCount = 1;
    let scoreForCourt = gameScore[player].scores[gameScore.currentCourt];

    if (scoreForCourt !== undefined && scoreForCourt !== null) {
      let selectedIdx = padCount + parseInt(scoreForCourt, 10);
      scoreSelectorList
        .querySelectorAll(".scoreBtn")
        .forEach((btn) => btn.classList.remove("selected"));

      const btn = scoreSelectorList.children[selectedIdx];
      if (btn && !btn.classList.contains("pad")) {
        btn.classList.add("selected");
        let itemHeight = scoreSelectorList.children[padCount].offsetHeight;
        scoreSelectorList.scrollTo({
          top: (selectedIdx - padCount) * itemHeight,
          behavior: "auto",
        });
      }
    }
  }
}

function genControlHtml() {
  let navigation = document.querySelector(".navigation");
  let navRules = navigation.querySelector("#navRules");

  let oldNextCourtDiv = navigation.querySelector("#navNextCourt");
  let oldPreviousCourtDiv = navigation.querySelector("#navPreviousCourt");

  if (oldNextCourtDiv) {
    oldNextCourtDiv.remove();
  }
  if (oldPreviousCourtDiv) {
    oldPreviousCourtDiv.remove();
  }

  let nextCourtDiv = document.createElement("div");
  nextCourtDiv.className = "navItem";
  nextCourtDiv.id = "navNextCourt";
  let nextCourtIcon = document.createElement("span");
  nextCourtIcon.innerHTML = "arrow_forward_ios";
  nextCourtIcon.className = "nextCourtIcon material-symbols-outlined";
  nextCourtDiv.appendChild(nextCourtIcon);
  let nextCourtText = document.createElement("p");
  nextCourtText.textContent = "Nästa";
  nextCourtDiv.appendChild(nextCourtText);

  let previousCourtDiv = document.createElement("div");
  previousCourtDiv.className = "navItem";
  previousCourtDiv.id = "navPreviousCourt";
  let previousCourtIcon = document.createElement("span");
  previousCourtIcon.innerHTML = "arrow_back_ios";
  previousCourtIcon.className = "previousCourtIcon material-symbols-outlined";
  previousCourtDiv.appendChild(previousCourtIcon);
  let previousCourtText = document.createElement("p");
  previousCourtText.textContent = "Förra";
  previousCourtDiv.appendChild(previousCourtText);

  navigation.insertBefore(previousCourtDiv, navRules);
  navigation.appendChild(nextCourtDiv);

  nextCourtDiv.addEventListener("click", function () {
    for (let player in gameScore) {
      if (player === "currentCourt") continue;
      let scoreSelector = document.getElementById(`scoreSelector-${player}`);
      let selectedBtn = scoreSelector.querySelector(".scoreBtn.selected");
      let score = selectedBtn.textContent;
      gameScore[player].scores[gameScore.currentCourt] = score;
    }

    if (gameScore.currentCourt < courtData.length - 1) {
      gameScore.currentCourt++;
    } else {
      gameScore.currentCourt = 0;
    }
    saveGameScore();
    genCourtHtml(courtData);
    genControlHtml();
    showGameScore();
    createCourtSelector();
  });

  previousCourtDiv.addEventListener("click", function () {
    for (let player in gameScore) {
      if (player === "currentCourt") continue;
      let scoreSelector = document.getElementById(`scoreSelector-${player}`);
      let selectedBtn = scoreSelector.querySelector(".scoreBtn.selected");
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
    showGameScore();
    createCourtSelector();
  });
}

function showGameScore() {
  let existingScoreHtml = document.querySelector(".gameScoreHtml");
  if (existingScoreHtml) existingScoreHtml.remove();

  let gameScoreHtml = document.createElement("div");
  gameScoreHtml.className = "gameScoreHtml";

  const courtStatus = JSON.parse(localStorage.getItem("courtStatus"));

  let uncompletePlayers = [];
  let uncompleteHoles = [];
  let finishedPlayers = [];

  for (let i = 0; i < courtStatus.length; i++) {
    let temp;
    if (courtStatus[i] == 0) {
      uncompleteHoles.push(i);
    }
    if (courtStatus[i] == 1) {
      for (let player in gameScore) {
        if (player !== "currentCourt" && gameScore[player].scores[i] != 0) {
          finishedPlayers.push(player.name);
        } else if (
          player !== "currentCourt" &&
          gameScore[player].scores[i] == 0
        ) {
          uncompletePlayers.push(player);
        }
      }
    }
  }

  let scores = [];
  for (let player in gameScore) {
    if (player !== "currentCourt") {
      let score = 0;
      for (let i = 0; i < gameScore[player].scores.length; i++) {
        if (
          gameScore[player].scores[i] !== 0 ||
          gameScore[player].scores[i] !== undefined ||
          gameScore[player].scores[i] !== null
        )
          score += Number(gameScore[player].scores[i]);
      }
      if (!uncompletePlayers.includes(player)) {
        scores.push({ name: player, score: score });
      }
    }
  }
  scores.sort((a, b) => a.score - b.score);

  let scoreList = document.createElement("ul");
  scoreList.className = "scoreList";
  let position = 1;
  scores.forEach((s) => {
    let li = document.createElement("li");
    li.textContent = `#${position}. ${s.name}: ${s.score}`;
    scoreList.appendChild(li);
    position++;
  });
  gameScoreHtml.appendChild(scoreList);
  let hero = document.querySelector(".hero");
  let body = document.querySelector("body");
  body.insertBefore(gameScoreHtml, hero);

  scoreList.scrollLeft = 0;

  initScoreScroll();

  window.setTimeout(function () {
    gameScoreHtml.remove();
  }, 30000);
}

function createCourtSelector() {
  let mainContent = document.querySelector(".mainContent");
  let courtSelector = document.createElement("div");
  courtSelector.className = "courtSelector";
  mainContent.appendChild(courtSelector);

  const playerCount = Object.keys(gameScore).filter(
    (p) => p !== "currentCourt"
  ).length;

  for (let i = 0; i < courtData.length; i++) {
    let courtBtn = document.createElement("button");
    courtBtn.className = "courtBtn";

    let playersOnCourt = 0;
    for (let player in gameScore) {
      if (player !== "currentCourt" && gameScore[player].scores[i] != 0) {
        playersOnCourt++;
      }
    }

    courtStatus[i] = 0;

    if (playersOnCourt > 0 && playersOnCourt < playerCount) {
      courtBtn.classList.add("uncomplete");
      courtStatus[i] = 1;
    }
    if (playersOnCourt === playerCount) {
      courtBtn.classList.add("played");
      courtStatus[i] = 2;
    }

    courtBtn.setAttribute("data-court-index", i);
    courtBtn.textContent = courtData[i].id;
    if (i === gameScore.currentCourt) {
      courtBtn.classList.add("currentCourt");
    }
    courtSelector.appendChild(courtBtn);

    localStorage.setItem("courtStatus", JSON.stringify(courtStatus));

    courtBtn.addEventListener("click", function () {
      let index = parseInt(courtBtn.getAttribute("data-court-index"), 10);
      gameScore.currentCourt = index;
      saveGameScore();
      genCourtHtml(courtData);
      genControlHtml();
      showGameScore();
      createCourtSelector();
    });
  }
}

function initScoreScroll() {
  const scoreList = document.querySelector(".scoreList");
  if (!scoreList) return;

  if (scoreList.children.length >= 3) {
    scoreList.innerHTML += scoreList.innerHTML;
  }

  let scrollInterval;
  let isUserScrolling = false;

  function startAutoScroll() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    if (scoreList.children.length >= 3) {
      scrollInterval = setInterval(function () {
        if (!isUserScrolling) {
          if (scoreList.scrollLeft >= scoreList.scrollWidth / 2) {
            scoreList.scrollLeft = 0;
          } else {
            scoreList.scrollLeft += 2;
          }
        }
      }, 30);
    }
    else{
         scrollInterval = setInterval(function () {
      if (!isUserScrolling) {
        if (scoreList.scrollLeft >= scoreList.scrollWidth) {
          scoreList.scrollLeft = 0;
        } else {
          scoreList.scrollLeft += 2;
        }
      }
    }, 30);
    }
  }

  function pauseAutoScroll() {
    isUserScrolling = true;
    clearInterval(scrollInterval);
  }

  function resumeAutoScroll() {
    setTimeout(() => {
      isUserScrolling = false;
      startAutoScroll();
    }, 1500);
  }

  scoreList.addEventListener("pointerdown", pauseAutoScroll);
  scoreList.addEventListener("pointerup", resumeAutoScroll);
  scoreList.addEventListener("pointerleave", resumeAutoScroll);
  scoreList.addEventListener("touchstart", pauseAutoScroll);
  scoreList.addEventListener("touchend", resumeAutoScroll);

  setTimeout(startAutoScroll, 1000);
}

export { startNewGame, loadGameScore };
