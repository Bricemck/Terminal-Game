//Gets user input//
const prompt = require('prompt-sync')();
const readlineSync = require('readline-sync');

//first prompt, sets username value.  
    // Username not used much in game.  Improve ending with 'username wins?' 
const username = prompt('What is your name? ');
console.log(`Your name is ${username}`);

//defining the function for user input.//
function getInput(promptText) {
  return readlineSync.question(promptText);
}

//defining the function for random damage & repair//
// the math is a bit wonky, it either returns 1 damage or 4 damage
//could be improved with a 1-4 range//
function getRandomHP() {
  return Math.floor(Math.random() * 3) + 1;
}

//set initial parameters for the game.  //
// Define starting HP, Creates arrays for barracks
//Sets turncount starting at 0//
//allows for peron actions to be assigned//
function CastleBattle() {
  let playerHP = 10;
  let computerHP = 10;
  const playerBarracks = [];
  const computerBarracks = [];
  let turnCount = 0;
  let peonActionsSet = new Set();

  //Peon Object, starting job 'nothing'//
  function Peon(name) {
    this.name = name;
    this.job = "nothing";
  }


//Turn display.  Shows player hp, available peons, shows turn, etc.//
  function displayStatus() {
    console.log(`\n--- Status ---`);
    console.log(`Player HP: ${playerHP}`);
    console.log(`Computer HP: ${computerHP}`);
    console.log(`Player Peons:`, playerBarracks);
    console.log(`Computer Peons:`, computerBarracks);
    console.log(`Turn: ${turnCount}`);
    console.log(`---`);
  }

  //Function for player turn, advances the turn count, asks for player input on 3 actions.//
  function playerTurn() {
    turnCount++;
    displayStatus();
    const action = getInput("What do you want to do? (create/select/view) ");

    //This is the turn loop setting if create then define peon name, log 'created'
    //Or the player can 'select' allowing peon job to be assigned.
    if (action === "create") {
      const peonName = getInput("Enter peon's name: ");
      playerBarracks.push(new Peon(peonName));
      console.log(`${peonName} created!`);
      processPlayerActions();
    } else if (action === "select") {
      if (playerBarracks.length === 0) {
        console.log("No peons available.");
        playerTurn();
        return;
      }
      //variables needed to distinguish Peons from each other, including name.  
      //Defines peon selection finder.
      const peonNames = playerBarracks.map(peon => peon.name).join(", ");
      const peonName = getInput(`Enter peon's name to select (${peonNames}): `);
      const selectedPeon = playerBarracks.find(peon => peon.name === peonName);

      //asks input from player on Peon action.
      //We prefered 'action' to 'job', it felt more appropriate for the game.
      //Peon's 'job' is to please the player, it does my bidding mwahahahahahahaha!
      if (selectedPeon) {
        if (!peonActionsSet.has(selectedPeon.name)) {
          const peonAction = getInput(
            `What action should ${selectedPeon.name} perform? (attack/repair/nothing) `
          );

          //Lines 80-112 define an if else loop calling attack or repair functions when selected.
          //A few error messages are including to make it clear to player when actions were improperly submitted.
          if (peonAction === "attack") {
            selectedPeon.job = "attack";
          } else if (peonAction === "repair") {
            selectedPeon.job = "repair";
          } else if (peonAction === "nothing") {
            selectedPeon.job = "nothing";
          } else {
            console.log("Invalid action.");
            playerTurn();
            return;
          }
          peonActionsSet.add(selectedPeon.name);
        }
        processPlayerActions();
        return; // added return here
      } else {
        console.log("Invalid peon selection.");
        playerTurn();
        return;
      }
    } else if (action === "view") {
      if (playerBarracks.length === 0) {
        console.log("No peons available.");
        playerTurn();
        return;
      }

      //This section confuses me the most.  
      // As I understand it the map calls the arrays to make the view function possible
      //It seems like a necessary element to manage the state of the game, but I"m lacking in the nuances.
      const peonNames = playerBarracks.map(peon => peon.name).join(", ");
      const peonName = getInput(`Enter peon's name to view (${peonNames}): `);
      const selectedPeon = playerBarracks.find(peon => peon.name === peonName);


      //If else loop allowing the view function and returning some error messages.
      if (selectedPeon) {
        console.log(`${selectedPeon.name}'s current job is: ${selectedPeon.job}`);
        playerTurn();
        return; // added return here
      } else {
        console.log("Invalid peon selection.");
        playerTurn();
        return;
      }
    } else {
      console.log("Invalid action.");
      playerTurn();
      return;
    }
  }

  //Function allowing actions to increase the player hp through repair or damage the computer hp through attack.
  //These call the getRandomHP math above in an attempt to make the game more interesting through variable numbers.
  //Passes player turn to the computer.  Computer turn happens instantly.
  function processPlayerActions() {
    playerBarracks.forEach((peon) => {
      if (peon.job === "repair") {
        playerHP += getRandomHP();
      } else if (peon.job === "attack") {
        computerHP -= getRandomHP();
      }
    });
    computerTurn();
  }

  //function for computer turn.
  //After computer turn, the game will check the state to see if player wins or computer wins.

  //COMPUTER ACTION IMPROVEMENTS//
  //It is supposed to start with creating a random Peon, which it does.
  //Then there's a random chance that it will select the Peon to attack, repair, etc.
  //There are a few bugs that could be improved on.
  //There's about a 33% chance to do nothing, which gives the player a huge advantage.
  //Also the computere will randomly created 2 Peons at a time, which is strange.
  function computerTurn() {
    const computerAction = Math.floor(Math.random() * 2);

    if (computerAction === 0 && computerBarracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * computerBarracks.length);
      const selectedPeon = computerBarracks[randomIndex];

      const randomAction = Math.random();
      if (randomAction < 0.33) {
        selectedPeon.job = "attack";
      } else if (randomAction < 0.66) {
        selectedPeon.job = "repair";
      } else {
        selectedPeon.job = "nothing";
      }

      if (selectedPeon.job === "attack") {
        playerHP -= getRandomHP();
        console.log(`Computer peon ${selectedPeon.name} attacked for ${getRandomHP()} HP. Player HP: ${playerHP}`);
      } else if (selectedPeon.job === "repair") {
        computerHP += getRandomHP();
        console.log(`Computer peon ${selectedPeon.name} repaired for ${getRandomHP()} HP. Computer HP: ${computerHP}`);
      } else {
        console.log(`Computer peon ${selectedPeon.name} did nothing.`);
      }
    } else {
      const peonName = "ComputerPeon" + computerBarracks.length;
      computerBarracks.push(new Peon(peonName));
      console.log("Computer created a peon");
    }

    checkGameState();
  }


  //function for game end state.
  //Simple if else statement.
  //If player and computer hit 0 at the same time, it's a tie.
  //If player hits 0 first log 'computer wins'

  function checkGameState() {
    if (computerHP <= 0 && playerHP <= 0) {
      console.log("It's a tie!");
      return;
    } else if (computerHP <= 0) {
      console.log("You win!");
      return;
    } else if (playerHP <= 0) {
      console.log("Computer wins!");
      return;
    } else {
      playerTurn();
    }
  }
//Finito Mussillini
  playerTurn();
}
CastleBattle();

// const prompt = require('prompt-sync')();

// let playerHp = 10;
// let computerHp = 10;
// let playerBarracks = [];

// const clearConsole = function() {
//   console.clear();
// };

// const displayStatus = function() {
//   console.log("=======================================");
//   console.log("             GAME STATUS               ");
//   console.log("=======================================");
//   console.log(`🛡️  Player HP:   ${"❤ ".repeat(Math.max(0, playerHp)).trim()}`);
//   console.log(`🤖 Computer HP: ${"❤ ".repeat(Math.max(0, computerHp)).trim()}`);
//   console.log("=======================================\n");
// };

// const createPeon = function() {
//   clearConsole();
//   let name = prompt("Enter peon name: ");
//   playerBarracks.push({ name: name, job: "nothing" });
//   console.log(`✅ ${name} has been added to your barracks!\n`);
//   displayStatus();
// };

// const selectPeon = function() {
//   if (playerBarracks.length === 0) {
//     console.log("⚠️  No peons available!\n");
//     displayStatus();
//     return;
//   }
//   const peonNames = playerBarracks.map((peon) => peon.name).join(", ");
//   let peonName = prompt(`Enter peon name: ( ${peonNames} )`);
//   let peon = playerBarracks.find((p) => p.name === peonName);
//   if (peon) {
//     while (true) {
//       clearConsole();
//       displayStatus();
//       console.log("=======================================");
//       console.log(`🔧 Choose job for ${peon.name.toUpperCase()}`);
//       console.log("1: ⚔️ Attack");
//       console.log("2: 🏥 Repair");
//       console.log("3: 🔙 Back");
//       console.log("\nChoose ( 1 / 2 / 3): ")
//       console.log("=======================================");
//       let job = parseInt(prompt("Choose Option: (1 / 2 / 3): ")) - 1;
//       let jobs = ["attack", "repair"];
//       if (job === 2) {
//         return;
//       } else if (job >= 0 && job < jobs.length) {
//         peon.job = jobs[job];
//         console.log(`✅ ${peon.name} is now assigned to ${peon.job.toUpperCase()}\n`);
//         processPeonActions();
//         if (checkGameOver()) return;
//         console.log("=======================================");
//         console.log("           COMPUTER'S TURN             ");
//         console.log("=======================================");
//         computerTurn();
//         if (checkGameOver()) return;
//       } else {
//         console.log("⚠️  Invalid job selection. Try again.\n");
//       }
//     }
//   } else {
//     console.log("⚠️  Peon not found!\n");
//     displayStatus();
//   }
// };

// const processPeonActions = function() {
//   playerBarracks.forEach(peon => {
//     if (peon.job === "repair") {
//       playerHp += 1;
//       console.log(`🔧 ${peon.name} repaired you! 🛡️  Player HP: ${"❤ ".repeat(Math.max(0, playerHp)).trim()}\n`);
//     } else if (peon.job === "attack") {
//       computerHp -= 1;
//       console.log(`⚔️  ${peon.name} attacked the computer! 🤖 Computer HP: ${"❤ ".repeat(Math.max(0, computerHp)).trim()}\n`);
//     }
//   });
//   displayStatus();
// };

// const computerTurn = function() {
//   clearConsole();
//   let damageOrHeal = Math.random() < 0.5 ? "damage" : "heal";
//   let amount = Math.floor(Math.random() * 5) + 1;
//   if (damageOrHeal === "damage") {
//     playerHp = Math.max(0, playerHp - amount);
//     console.log(`🤖 Computer attacked you for ${amount} damage! 🛡️  Player HP: ${"❤ ".repeat(Math.max(0, playerHp)).trim()}\n`);
//   } else {
//     computerHp += amount;
//     console.log(`🤖 Computer healed itself for ${amount} HP! 🤖 Computer HP: ${"❤ ".repeat(Math.max(0, computerHp)).trim()}\n`);
//   }
//   displayStatus();
// };

// const checkGameOver = function() {
//   if (playerHp <= 0 && computerHp <= 0) {
//     console.log("⚔️  It's a tie!\n");
//     return true;
//   } else if (playerHp <= 0) {
//     console.log("💀 Computer wins!\n");
//     return true;
//   } else if (computerHp <= 0) {
//     console.log("🎉 You win!\n");
//     return true;
//   }
//   return false;
// };

// const gameLoop = function() {
//   while (true) {
//     clearConsole();
//     displayStatus();

//     if (checkGameOver()) return; // ✅ Stop the game if over

//     console.log("=======================================");
//     console.log("            PLAYER'S TURN              ");
//     console.log("=======================================");
//     console.log("1: 👷 Create peon");
//     console.log("2: 🎯 Choose peon");
//     console.log("\nChoose ( 1 / 2): ")

//     console.log("=======================================");
//     let choice = parseInt(prompt("Choose option: (1 / 2): "));
    
//     if (choice === 1) {
//       createPeon();
//     } else if (choice === 2) {
//       selectPeon();
//     } else {
//       console.log("⚠️  Try again with the right selection.\n");
//       displayStatus();
//     }
//   }
// };

// gameLoop();