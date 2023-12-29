// Created by Adam Gunn (asgunn@umich.edu) for the website adamgunn.net
// https://github.com/adamgunn
//
//
//
// Defines the Snowman object, which contains all the data about the game
class Snowman {
	num_players;
	player0_name;
	player1_name;
	word = "";
	wrong_letters = [];
	displaying_word = [];
	losing_letters;
	available_letters = {
		A: true,
		B: true,
		C: true,
		D: true,
		E: true,
		F: true,
		G: true,
		H: true,
		I: true,
		J: true,
		K: true,
		L: true,
		M: true,
		N: true,
		O: true,
		P: true,
		Q: true,
		R: true,
		S: true,
		T: true,
		U: true,
		V: true,
		W: true,
		X: true,
		Y: true,
		Z: true,
	};
	num_letters_left;
	game_started = false;
	word_bank = [
		"NO IFS, ANDS, OR BUTS",
		"CRISS-CROSS APPLESAUCE",
		"DON'T COUNT YOUR CHICKENS BEFORE THEY HATCH",
		"DON'T GET IT TWISTED",
		"RISK IT FOR THE BISCUIT",
		"THE DOG ATE MY HOMEWORK",
		"THE EARLY BIRD GETS THE WORM",
		"THE GRASS IS ALWAYS GREENER ON THE OTHER SIDE",
		"THE PEN IS MIGHTIER THAN THE SWORD",
		"THE SKY'S THE LIMIT",
		"THE WHOLE NINE YARDS",
		"THERE'S NO PLACE LIKE HOME",
		"THERE'S NO TIME LIKE THE PRESENT",
		"THERE'S SOMETHING FISHY GOING ON",
		"THIRD TIME'S THE CHARM",
		"THROW CAUTION TO THE WIND",
		"TWO WRONGS DON'T MAKE A RIGHT",
		"WATER UNDER THE BRIDGE",
		"WE'LL CROSS THAT BRIDGE WHEN WE COME TO IT",
		"WE'RE ALL IN THE SAME BOAT",
		"WE'RE NOT OUT OF THE WOODS YET",
		"WHAT GOES UP MUST COME DOWN",
		"WHAT YOU SEE IS WHAT YOU GET",
		"WHEN IT RAINS, IT POURS",
		"WHEN PIGS FLY",
		"WHEN THE GOING GETS TOUGH, THE TOUGH GET GOING",
		"WHERE THERE'S A WILL, THERE'S A WAY",
		"YOU CAN'T JUDGE A BOOK BY ITS COVER",
		"YOU CAN'T MAKE AN OMELET WITHOUT BREAKING EGGS",
		"YOU CAN'T PLEASE EVERYONE",
		"YOU REAP WHAT YOU SOW",
		"YOU'RE BARKING UP THE WRONG TREE",
		"YOU'RE THE APPLE OF MY EYE",
		"YOU'VE GOT TO BE KIDDING ME",
		"A BLESSING IN DISGUISE",
		"A CHIP ON YOUR SHOULDER",
		"A DIME A DOZEN",
		"A DROP IN THE BUCKET",
		"A FRIEND IN NEED IS A FRIEND INDEED",
		"A PENNY SAVED IS A PENNY EARNED",
		"A PICTURE IS WORTH A THOUSAND WORDS",
		"A PIECE OF CAKE",
		"A TASTE OF YOUR OWN MEDICINE",
		"A WORD TO THE WISE IS ENOUGH",
		"THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
		"WHAT GOES UP MUST COME DOWN",
		"GO BLUE",
	];

	get word() {
		return this.word;
	}

	get wrong_letters() {
		return this.wrong_letters;
	}

	set word(word_input) {
		this.word = word_input;
	}

	// If there are two players, prints the word picking prompt.
	// Otherwise, determine the word randomly, then calculate the blanks to display
	pickWord() {
		var snowmanHTML = document.querySelector("div.snowman");
		if (this.num_players == 2) {
			snowmanHTML.innerHTML = `
            <ul>
                <li>
                    <h2 class="subtitle">${this.player0_name}, avert your eyes!</h2>
                    <label for="pick_word" class="subtitle">${this.player1_name}, pick something for ${this.player0_name} to guess.</label>
                    <br>
                    <textarea id="pick_word" name="pick_word" required onchange=(verifyWord())></textarea>
                </li>
                <li>
                    <button class="submit_button" id="submit_word" onclick=(beginSnowmanGame()) disabled>Submit</button>
                </li>
            </ul>
            `;
		} else if (this.num_players == 1) {
			this.word =
				this.word_bank[
					Math.floor(Math.random() * this.word_bank.length)
				];
			this.num_letters_left = 0;
			for (var i = 0; i < this.word.length; i++) {
				if (!isALetter(this.word[i])) {
					this.displaying_word.push(this.word[i] + " ");
				} else {
					this.num_letters_left++;
					this.displaying_word.push("_ ");
				}
			}
			this.printGame();
		}
	}

	// Updates the screen each time a letter is played, as well as at the beginning.
	printGame() {
		this.game_started = true;
		var snowmanHTML = document.querySelector("div.snowman");
		var stickman_svg = `
            <img src="/static/images/snowman-${this.wrong_letters.length}.svg" width="600" height="600" id="snowman-game" alt="Snowman game"/>
        `;
		snowmanHTML.innerHTML = stickman_svg;
		snowmanHTML.innerHTML += `<pre>${this.updateDisplayWord()}</pre>`;
		snowmanHTML.innerHTML += `<pre>Wrong letters: ${this.updateUsedLetters()}</pre>`;
	}

	// Updates the string of blanks and spaces that is shown on-screen.
	updateDisplayWord() {
		var display_text = "";
		for (var i = 0; i < this.displaying_word.length; i++) {
			display_text += this.displaying_word[i];
		}
		return display_text;
	}

	// Updates the list of used letters displayed on-screen.
	updateUsedLetters() {
		var display_text = "";
		for (var i = 0; i < this.wrong_letters.length; i++) {
			display_text += this.wrong_letters[i] + " ";
		}
		return display_text;
	}

	// When a letter is played, checks if it is in the word as well as if it has already been played.
	// Also checks if the game is over and updates the screen accordingly.
	playLetter(char) {
		if (this.word.includes(char) && this.available_letters[char] == true) {
			this.available_letters[char] = false;
			for (var i = 0; i < this.displaying_word.length; i++) {
				if (this.word[i] == char) {
					this.displaying_word[i] = char + " ";
					this.num_letters_left--;
				}
			}
		} else if (
			!this.word.includes(char) &&
			this.available_letters[char] == true
		) {
			this.wrong_letters.push(char);
			this.available_letters[char] = false;
		}
		if (this.wrong_letters.length >= this.losing_letters) {
			this.game_started = false;
			var snowmanHTML = document.querySelector("div.snowman");
			var losing_message;
			if (this.num_players == 2) {
				losing_message = this.player1_name + " wins!";
			} else {
				losing_message = this.player0_name + ", you lost!";
			}
			snowmanHTML.innerHTML = `
            <img src="/static/images/snowman-${this.losing_letters}.svg" width="600" height="600" id="snowman-game" alt="Snowman game"/>
            <h2 class="subtitle">${losing_message}</h2>
            <h2 class="subtitle">The correct phrase was: &ldquo;${this.word}&rdquo;</h2>
            <a href="" class="game_link"><h2 class="subtitle">Click here to play again</h2></a>
            `;
		} else if (this.num_letters_left == 0) {
			this.game_started = false;
			var snowmanHTML = document.querySelector("div.snowman");
			var winning_message;
			if (this.num_players == 2) {
				winning_message = this.player0_name + " wins!";
			} else {
				winning_message = this.player0_name + ", you won!";
			}
			snowmanHTML.innerHTML = `
            <img src="/static/images/snowman-${this.wrong_letters.length}.svg" width="600" height="600" id="snowman-game" alt="Snowman game"/>
            <h2 class="subtitle">${winning_message}</h2>
            <h2 class="subtitle">The correct phrase was: &ldquo;${this.word}&rdquo;</h2>
            <a href="" class="game_link"><h2 class="subtitle">Click here to play again</h2></a>
            `;
		} else {
			this.printGame();
		}
	}
}

// When a letter key is pressed, calls playLetter
document.addEventListener("keyup", function (e) {
	if (isALetter(e.code.slice(3))) {
		var char = e.code.slice(3);
		if (snowman_game.game_started) {
			snowman_game.playLetter(char);
		}
	}
});

// Determines if the given string char is one of the 26 capital letters
function isALetter(char) {
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	for (var i = 0; i < letters.length; i++) {
		if (char == letters[i]) {
			return true;
		}
	}
	return false;
}

// Disables or enables the submit button depending on whether or not a word is entered
function verifyWord() {
	var entered_word = document.getElementById("pick_word").value;
	entered_word = entered_word.toUpperCase();
	document.getElementById("pick_word").value = entered_word;
	var good_word = entered_word.length != 0;
	if (good_word) {
		document.getElementById("submit_word").disabled = false;
	} else {
		document.getElementById("submit_word").disabled = true;
	}
}

// Checks to make sure the names are not left blank as well as to make sure they aren't the same
function verifyNames() {
	var num_players = document.getElementById("num_players").value;
	if (
		document.getElementById("p0_name").value == "" ||
		document.getElementById("p0_name").value == null
	) {
		document.getElementById("submit_players").disabled = true;
	} else if (
		num_players == 2 &&
		(document.getElementById("p1_name").value == "" ||
			document.getElementById("p1_name").value == null ||
			document.getElementById("p0_name").value ==
				document.getElementById("p1_name").value)
	) {
		document.getElementById("submit_players").disabled = true;
	} else {
		document.getElementById("submit_players").disabled = false;
	}
}

// Adds/removes the player 2 box depending on the number of players input
function checkNumPlayers() {
	var num_players = document.getElementById("num_players").value;
	var p1_input = document.querySelector(".p1_input");
	if (num_players == 1) {
		p1_input.innerHTML = "";
	} else if (num_players == 2) {
		p1_input.innerHTML = `
            <label for="p1_name" class="subtitle">Player 2 Name (Picks)</label>
            <br>
            <input type="text" id="p1_name" name="p1_name" required placeholder="Joe S." onchange=(verifyNames()) />
        `;
	}
	verifyNames();
}

// For 2 players, starts the game with the picked word
function beginSnowmanGame() {
	snowman_game.word = document.getElementById("pick_word").value;
	snowman_game.num_letters_left = 0;
	for (var i = 0; i < snowman_game.word.length; i++) {
		if (snowman_game.word[i] == "\n") {
			snowman_game.displaying_word.push("\n");
		} else if (!isALetter(snowman_game.word[i])) {
			snowman_game.displaying_word.push(snowman_game.word[i] + " ");
		} else {
			snowman_game.num_letters_left++;
			snowman_game.displaying_word.push("_ ");
		}
	}
	snowman_game.printGame();
}

// The snowman_game object used throughout the program
var snowman_game = new Snowman();

// Collects the information from the first form and adds it to the game object
function playSnowman() {
	var num_players = document.getElementById("num_players").value;
	var p0_name = document.getElementById("p0_name").value;
	var losing_letters = document.getElementById("losing_letters").value;
	if (num_players == 2) {
		var p1_name = document.getElementById("p1_name").value;
	} else {
		var p1_name = null;
	}
	snowman_game.num_players = num_players;
	snowman_game.player0_name = p0_name;
	snowman_game.player1_name = p1_name;
	snowman_game.losing_letters = losing_letters;
	snowman_game.pickWord();
}
