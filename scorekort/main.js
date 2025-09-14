import { startHtmlGeneration } from './mod/startMenu.js';
import { startNewGame, loadGameScore } from './mod/startGame.js';

document.getElementById('newGame').addEventListener('click', function () {
    startHtmlGeneration();
});

const loadGameBtn = document.getElementById('loadGame');
if (loadGameBtn) {
    loadGameBtn.onclick = function () {
        loadGameScore();
    };
}

async function getInfo() {

    try {
        let info = await fetch('info.json');
        let infoData = await info.json();

        return infoData;

    } catch (error) {
        console.error('Error fetching info:', error);
    }

}

let infoData = await getInfo();
let courtData = infoData.court;

console.log(courtData);

export { courtData };
