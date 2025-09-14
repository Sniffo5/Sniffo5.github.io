import { startHtmlGeneration } from "./mod/startMenu.js";
import { startNewGame, loadGameScore } from "./mod/startGame.js";

document.getElementById("newGame").addEventListener("click", function () {
  startHtmlGeneration();
});

const loadGameBtn = document.getElementById("loadGame");
if (loadGameBtn) {
  loadGameBtn.onclick = function () {
    loadGameScore();
  };
}

async function getInfo() {
  try {
    let info = await fetch("info.json");
    let infoData = await info.json();

    return infoData;
  } catch (error) {
    console.error("Error fetching info:", error);
  }
}

let infoData = await getInfo();
let courtData = infoData.court;

let navHome = document.querySelector("#navHome");
navHome.addEventListener("click", function () {
  window.location.reload();
});
let navScore = document.querySelector("#navScore");

navScore.addEventListener("click", function () {
  let hero = document.querySelector(".hero");
  let mainContent = document.querySelector(".mainContent");
  let gameScoreHtml = document.querySelector(".gameScoreHtml")

  if (gameScoreHtml) gameScoreHtml.remove();
  if (hero)  hero.remove();
  if (mainContent) mainContent.innerHTML = "";
  
  let resultsHtml = document.createElement("div");
  resultsHtml.classList.add("resultsHtml");

  const gameScore = JSON.parse(localStorage.getItem("currentGame"));
  const courtStatus = JSON.parse(localStorage.getItem("courtStatus"));

  let uncompletePlayers = [];
  for (let i = 0; i < courtStatus.length; i++) {
    if (courtStatus[i] == 1) {
      for (let player in gameScore) {
        if (player !== "currentCourt" && gameScore[player].scores[i] == 0) {
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
          gameScore[player].scores[i] !== 0 &&
          gameScore[player].scores[i] !== undefined &&
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

  let podiumWrapper = document.createElement("div");
  podiumWrapper.classList.add("podiumWrapper");

  let podiumImg = document.createElement("img");
  podiumImg.classList.add("podiumImage");

  if (scores.length === 1) {
    podiumImg.src = "podium3.png";
  } else if (scores.length === 2) {
    podiumImg.src = "podium2.png";
  } else {
    podiumImg.src = "podium.png";
  }

  podiumWrapper.appendChild(podiumImg);
  resultsHtml.appendChild(podiumWrapper);

  let podiumPlayers = document.createElement("div");
  podiumPlayers.classList.add("podiumPlayers");
  podiumWrapper.appendChild(podiumPlayers);

  if (scores.length === 1) {
    let div = document.createElement("div");
    div.className = "playerLabel firstPlace";
    div.textContent = `${scores[0].name} (${scores[0].score})`;
    podiumPlayers.appendChild(div);
  } else if (scores.length === 2) {
    let div1 = document.createElement("div");
    div1.className = "playerLabel secondPlace";
    div1.textContent = `${scores[1].name} (${scores[1].score})`;
    let div2 = document.createElement("div");
    div2.className = "playerLabel firstPlace";
    div2.textContent = `${scores[0].name} (${scores[0].score})`;
    podiumPlayers.appendChild(div1);
    podiumPlayers.appendChild(div2);
  } else if (scores.length >= 3) {
    let div3 = document.createElement("div");
    div3.className = "playerLabel thirdPlace";
    div3.textContent = `${scores[2].name} (${scores[2].score})`;
    let div2 = document.createElement("div");
    div2.className = "playerLabel secondPlace";
    div2.textContent = `${scores[1].name} (${scores[1].score})`;
    let div1 = document.createElement("div");
    div1.className = "playerLabel firstPlace";
    div1.textContent = `${scores[0].name} (${scores[0].score})`;
    podiumPlayers.appendChild(div2);
    podiumPlayers.appendChild(div1);
    podiumPlayers.appendChild(div3);

    if (scores.length > 3) {
        let position = 4
      let others = document.createElement("div");
      others.className = "othersPlayers";
      scores.slice(3).forEach((p) => {
        let div = document.createElement("div");
        div.textContent = `#${position}. ${p.name} (${p.score})`;
        others.appendChild(div);
        position++
      });
      resultsHtml.appendChild(others);
    }
  }

  mainContent.append(resultsHtml);
});

let navRules = document.querySelector("#navRules");

/* navRules.addEventListener("click", function () {

    let rulesHtml = document.querySelector(".rules");
    rulesHtml.classList.toggle("hidden");

}); */

export { courtData };
