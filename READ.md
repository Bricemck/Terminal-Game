# Castle Battle!
## Summary
We’re making a turn-based strategy game. Two sides take turns battling each other

## Player
* This is a two Player game (one human and one computer)
* Each Player has a Barracks (see below)
* Each Player starts with 10 hit points

## Barracks
* A Barracks can store Peons (see below)

## Peon
* A Peon has a name
* A Peon has a job, one of the following:
  * nothing (this is the initial value upon creating a peon)
  * repair
  * attack

## Flow of game:

#### At the start of player’s turn, ask what the user wants to do (one of the following)
* Create a peon
  * If chosen, ask what the peon’s name should be
* Add a peon with the correct name to the player’s barracks. Set its job to ‘nothing’
* Select a peon
  * If chosen, ask which peon they want to select
  * Once a peon is chosen, ask what action the peon should perform
* attack
  * If chosen, set the peon’s job to attack
* repair
  * If chosen, set the peon’s job to repair

#### Once this is complete, loop through the peons in the player’s barracks
* If a peon’s job is to repair, increase the user’s hit points by one
* If a peon’s job is to attack, decrease the computer’s hit points by one

#### Once this is complete, start the computer’s turn
* Choose a random number of hit points from 1-5
  * The computer either repairs itself for that number of hit points or damages you for that number of hit points
* Evaluate the state of the game:
  * If the computer has 0 or fewer hit points, you win
  * If you have 0 or fewer hit points, the computer wins
  * If you both have 0 or fewer hit points, it’s a tie
  * If you both have more than 0 hit points, start player’s turn over again (step 1)

## Hungry for more?
* Make it so that the computer doesn’t randomly attack you/repair itself directly. 
  * Instead, it will act like a player and either create a peon or, if a peon already exists, select a random peon and tell it to either attack or repair
* Make the 2nd player optionally be either the computer (random decisions) or another human
* Repairs increase your hit points by a random number between 1-3
* Attacks decrease the enemy’s hit points by a random number between 1-3
* Create additional combatants (CPU or human) that can attack other combatants/repair themselves


# Chat GPT Suggestions

class Peon {
    constructor(name) {
        this.name = name;
        this.job = "nothing";
    }
}

class Barracks {
    constructor() {
        this.peons = [];
    }

    addPeon(name) {
        this.peons.push(new Peon(name));
    }
}

class Player {
    constructor(isHuman) {
        this.isHuman = isHuman;
        this.hp = 10;
        this.barracks = new Barracks();
    }
}

class Game {
    constructor() {
        this.human = new Player(true);
        this.computer = new Player(false);
        this.startGame();
    }

    startGame() {
        while (this.human.hp > 0 && this.computer.hp > 0) {
            this.playerTurn();
            if (this.computer.hp <= 0) break;
            this.computerTurn();
        }
        this.evaluateGame();
    }

    playerTurn() {
        console.log("Your turn! Choose an action: \n1. Create a peon\n2. Select a peon");
        let choice = prompt("Enter choice (1 or 2):");

        if (choice === "1") {
            let name = prompt("Enter peon name:");
            this.human.barracks.addPeon(name);
            console.log(`${name} has been added to your barracks.`);
        } else if (choice === "2") {
            this.selectPeon(this.human);
        }
        this.processPeons(this.human, this.computer);
    }

    selectPeon(player) {
        console.log("Choose a peon:");
        player.barracks.peons.forEach((peon, index) => {
            console.log(`${index + 1}. ${peon.name} (Job: ${peon.job})`);
        });

        let index = parseInt(prompt("Enter peon number:")) - 1;
        if (index >= 0 && index < player.barracks.peons.length) {
            let action = prompt("Choose action: attack or repair?");
            player.barracks.peons[index].job = action;
        }
    }

    processPeons(player, opponent) {
        player.barracks.peons.forEach(peon => {
            if (peon.job === "repair") {
                player.hp += 1;
                console.log(`${peon.name} repaired! HP is now ${player.hp}.`);
            } else if (peon.job === "attack") {
                opponent.hp -= 1;
                console.log(`${peon.name} attacked! Opponent HP is now ${opponent.hp}.`);
            }
        });
    }

    computerTurn() {
        console.log("Computer's turn...");
        let action = Math.random() < 0.5 ? "repair" : "attack";
        let value = Math.floor(Math.random() * 5) + 1;

        if (action === "repair") {
            this.computer.hp += value;
            console.log(`Computer repairs itself for ${value} HP. HP is now ${this.computer.hp}.`);
        } else {
            this.human.hp -= value;
            console.log(`Computer attacks you for ${value} damage! Your HP is now ${this.human.hp}.`);
        }
    }

    evaluateGame() {
        if (this.human.hp <= 0 && this.computer.hp <= 0) {
            console.log("It's a tie!");
        } else if (this.human.hp <= 0) {
            console.log("You lose!");
        } else {
            console.log("You win!");
        }
    }
}

new Game();
