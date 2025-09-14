function storePlayers(players) {
    localStorage.setItem('players', JSON.stringify(players));
}


export { storePlayers };