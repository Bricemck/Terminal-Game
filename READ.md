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


