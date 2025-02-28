const prompt = require('prompt-sync')();
const username = prompt('What is your name? ');
console.log(`Your name is ${username}`);

let playerHp = 10
let computerHp = 10
let playerBarracks = []


const createPeon = function() {
  let name = prompt("Enter peon name:")
  playerBarracks.push({ name: name, job: "nothing" })
}

createPeon()
console.log(playerBarracks)

//Objects//
// const Player = {

//     playerHp = 10
//     playerBarracks = []
//     }

// // Example usage:
// const player1 = Player.create("Hero");
// console.log(player1);