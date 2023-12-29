/* 
============================================================
Responsive header
============================================================
*/

const mobile_header = document.querySelector("#mobile_header");
const mobile_header_icon = document.querySelector("#mobile_header_icon");
const mobile_links_wrapper = document.querySelector("#mobile_links_wrapper");
const mobile_exit_button = document.querySelector("#mobile_exit_button");
const mobile_back_button = document.querySelector("#mobile_back_button");
const games_button = document.querySelector("#games_button");
const themes_button = document.querySelector("#themes_button");
const mobile_main = document.querySelector("#mobile_main");
const mobile_games = document.querySelector("#mobile_games");
const mobile_themes = document.querySelector("#mobile_themes");
let onerem = parseFloat(getComputedStyle(document.documentElement).fontSize);
mobile_header_icon.onclick = (e) => {
	e.preventDefault();
	mobile_links_wrapper.style.display = "flex";
	mobile_header.style.display = "none";
	mobile_main.style.display = null;
	document.querySelector("body").style.overflow = "hidden";
};
mobile_exit_button.onclick = (e) => {
	e.preventDefault();
	mobile_links_wrapper.style.display = "none";
	mobile_back_button.style.display = "none";
	mobile_header.style.display = "flex";
	mobile_games.style.display = null;
	mobile_themes.style.display = null;
	document.querySelector("body").style.overflow = "auto";
};
mobile_back_button.onclick = (e) => {
	e.preventDefault();
	mobile_back_button.style.display = "none";
	mobile_main.style.display = null;
	mobile_games.style.display = null;
	mobile_themes.style.display = null;
};
games_button.onclick = (e) => {
	e.preventDefault();
	mobile_main.style.display = "none";
	mobile_games.style.display = "flex";
	mobile_back_button.style.display = "initial";
};
themes_button.onclick = (e) => {
	e.preventDefault();
	mobile_main.style.display = "none";
	mobile_themes.style.display = "flex";
	mobile_back_button.style.display = "initial";
};
window.onresize = (e) => {
	if (window.innerWidth > 40 * onerem) {
		mobile_links_wrapper.style.display = "none";
		mobile_header.style.display = "none";
		mobile_games.style.display = "none";
		mobile_themes.style.display = "none";
		mobile_back_button.style.display = "none";
		document.querySelector("body").style.overflow = "auto";
	} else {
		mobile_links_wrapper.style.display = null;
		mobile_header.style.display = null;
		mobile_main.style.display = null;
		mobile_games.style.display = null;
		mobile_themes.style.display = null;
		mobile_back_button.style.display = null;
	}
};

/* 
============================================================
Home page animation
============================================================
*/

if (window.location.pathname === "/") {
	let paused = true;
	const play_button = document.getElementById("play_button");
	const pause_play_button = document.getElementById("pause_play_button");
	const pause_play_icon = document.getElementById("pause_play_icon");
	const pause = (e) => {
		e.preventDefault();
		paused = true;
		pause_play_icon.innerHTML = `
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
        `;
		pause_play_button.onclick = play;
	};
	const play = (e) => {
		e.preventDefault();
		paused = false;
		pause_play_icon.innerHTML = `
            <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
        `;
		pause_play_button.onclick = pause;
	};
	play_button.onclick = (e) => {
		e.preventDefault();
		paused = false;
		play_button.style.display = "none";
		document.getElementById("about_link").style.pointerEvents = "auto";
		pause_play_button.style.opacity = "1";
		pause_play_button.style.pointerEvents = "auto";
	};
	pause_play_button.onclick = pause;

	const NUM_PICS = {
		A: 10,
		D: 8,
		M: 8,
		G: 9,
		U: 8,
		N: 5,
		PUNC: 26,
	};

	const LETTER_LOCATION = (letter, index) => {
		return `/static/images/magazine/letters/${letter}${index}.png`;
	};

	const unique_letter_ids = ["D", "M", "G", "U"];
	const repeated_letters = ["A", "N"];
	const all_letter_ids = ["A1", "D", "A2", "M", "G", "U", "N1", "N2", "PUNC"];

	// var letter_indexes = {
	//     "A1": 0,
	//     "D": 0,
	//     "A2": 1,
	//     "M": 0,
	//     "G": 0,
	//     "U": 0,
	//     "N1": 0,
	//     "N2": 1,
	//     "PUNC": 0
	// }

	const new_single_repeated_letter = (letter_id) => {
		if (
			letter_id.length !== 2 ||
			(letter_id[1] !== "1" && letter_id[1] !== "2")
		) {
			console.error("Incorrect usage! Invalid passed value:", letter_id);
			return;
		}
		const opp_letter_id = letter_id[0] + (letter_id[1] === "1" ? "2" : "1");
		const ltr_elt = document.querySelector(`#${letter_id}`);
		const old_index = letter_indexes[letter_id];
		do {
			letter_indexes[letter_id] = Math.floor(
				Math.random() * NUM_PICS[letter_id.slice(0, -1)]
			);
		} while (
			letter_indexes[letter_id] === letter_indexes[opp_letter_id] ||
			letter_indexes[letter_id] === old_index
		);
		// console.log(letter_indexes);
		ltr_elt.src = LETTER_LOCATION(
			letter_id.slice(0, -1),
			letter_indexes[letter_id]
		);
	};

	const all_new_letters = () => {
		unique_letter_ids.forEach((id) => {
			const ltr = document.querySelector("#" + id);
			letter_indexes[id] = Math.floor(Math.random() * NUM_PICS[id]);
			ltr.src = LETTER_LOCATION(id, letter_indexes[id]);
		});
		repeated_letters.forEach((letter) => {
			new_single_repeated_letter(letter + "1");
			new_single_repeated_letter(letter + "2");
		});
		const punc = document.querySelector("#PUNC");
		letter_indexes["PUNC"] = Math.floor(Math.random() * NUM_PICS["PUNC"]);
		punc.src = `/static/images/magazine/punctuation/${letter_indexes["PUNC"]}.png`;
	};

	const new_single_letter = (index) => {
		switch (index) {
			case 0:
				new_single_repeated_letter("A1");
				break;
			case 2:
				new_single_repeated_letter("A2");
				break;
			case 6:
				new_single_repeated_letter("N1");
				break;
			case 7:
				new_single_repeated_letter("N2");
				break;
			case 8: {
				const PUNC = document.getElementById("PUNC");
				const old_index = letter_indexes["PUNC"];
				do {
					letter_indexes["PUNC"] = Math.floor(
						Math.random() * NUM_PICS["PUNC"]
					);
				} while (letter_indexes["PUNC"] == old_index);
				PUNC.src = `/static/images/magazine/punctuation/${letter_indexes["PUNC"]}.png`;
				break;
			}
			default:
				const char = all_letter_ids[index];
				const ltr = document.getElementById(char);
				const old_index = letter_indexes[char];
				do {
					letter_indexes[char] = Math.floor(
						Math.random() * NUM_PICS[char]
					);
				} while (letter_indexes[char] == old_index);
				ltr.src = LETTER_LOCATION(char, letter_indexes[char]);
				break;
		}
	};

	const NUM_SPOTS = 9;
	var interval = setInterval(() => {
		if (!paused && !document.hidden) {
			const changing_char = Math.floor(Math.random() * NUM_SPOTS);
			new_single_letter(changing_char);
		}
	}, 1000);
}

/* 
============================================================
About page rotation
============================================================
*/
function isTouchDevice() {
	return (
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	);
}

if (/about/.test(window.location.pathname) && !isTouchDevice()) {
	const title = document.querySelector(".page_title");
	// const NUM_COPIES = 8;
	// for (var i = 1; i <= NUM_COPIES; ++i) {
	//     var copy = document.createElement('h1');
	//     copy.id = `page_title_copy_${i}`;
	//     copy.style.display = "none";
	//     title.appendChild(copy);
	// }
	document.onmousemove = (e) => {
		// e.preventDefault();
		const width = window.innerWidth;
		const height = window.innerHeight;
		const x = e.clientX;
		const y = e.clientY;
		const transformation = `rotateY(${
			((x - width / 2) / (width / 2)) * 90
		}deg) rotateX(${((height / 2 - y) / (height / 2)) * 90}deg)`;
		title.style.transform = transformation;
	};
}

const colors = {
	default: ["#ffffff", "#000000"],
	dark: ["#222222", "#ffffff"],
	darker: ["#000000", "#ffffff"],
	earthy: ["#A0A083", "#EAE0CC"],
};
const options = Object.keys(colors);

options.forEach((option) => {
	const buttons = [...document.querySelectorAll("." + option)];
	buttons.forEach((button) => {
		button.onclick = (e) => {
			e.preventDefault();
			color_var_names.forEach((var_name, index) => {
				root.style.setProperty(var_name, colors[option][index]);
				localStorage.setItem(var_name, colors[option][index]);
			});
		};
	});
});

const getRandomColor = () => {
	var letters = "0123456789abcdef";
	var color = "#";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

const random_buttons = [...document.querySelectorAll(".random")];
random_buttons.forEach((button) => {
	button.onclick = (e) => {
		e.preventDefault();
		color_var_names.forEach((var_name) => {
			var color = getRandomColor();
			root.style.setProperty(var_name, color);
			localStorage.setItem(var_name, color);
		});
	};
});

/* 
============================================================
Portfolio image display
============================================================
*/

if (/design/.test(window.location.pathname)) {
	const location = (filename) => {
		return `/static/images/${filename}`;
	};

	const captions = {
		"door_collage.jpg":
			"A sort of collage of pictures I took in Chicago during the summer of 2021. Made in Photoshop.",
		"fruitsurrealism.jpg":
			"Some fruit edited into a scene taken in Garfield Park on the west side of Chicago. Made in Photoshop.",
		"greenhousegas.jpg":
			"A small infographic depicting greenhouse gas emissions of different kinds of protein. Made in Illustrator.",
		"holescover.jpg":
			"A mockup cover for the novel 'Holes' by Louis Sachar. Made in Illustrator.",
		"infographicfinal_01.jpg":
			"Page 1 of a two-page spread about the dangers of fake news. Made in Illustrator.",
		"infographicfinal_02.jpg":
			"Page 2 of a two-page spread about the dangers of fake news. Made in Illustrator.",
		"postcardfinal.jpg":
			"A postcard for the card game Uno. Made in Photoshop.",
		"posterfinal.jpg":
			"A magazine ad for the card game Uno. Made in Photoshop.",
		"typology.jpg":
			"A typology study of fronts of buildings in the East Ukrainian Village neighborhood of Chicago. Made in Photoshop.",
	};

	const image_filenames = Object.keys(captions);

	const showOverlay = (filename) => {
		document.querySelector("body").style.overflow = "hidden";
		document.getElementById("portfolio_display").src = location(filename);
		document.getElementById("portfolio_display_description").innerText =
			captions[filename];
		document.getElementById("portfolio_display_overlay").style.display =
			"flex";
		document.getElementById("portfolio_display_overlay").onclick = (e) => {
			e.preventDefault();
			if (
				e.target.id != "portfolio_display" &&
				e.target.id != "portfolio_display_description"
			) {
				hideOverlay();
			}
		};
	};

	const hideOverlay = () => {
		document.querySelector("body").style.overflow = "auto";
		document.getElementById("portfolio_display_overlay").style.display =
			"none";
	};

	const grid = document.getElementById("portfolio_grid");
	image_filenames.forEach((filename) => {
		let item = document.createElement("li");
		item.classList.add("grid_item");
		item.style.backgroundImage = `url('${location(filename)}')`;
		item.id = filename;
		item.onclick = (e) => {
			showOverlay(filename);
		};
		grid.appendChild(item);
	});
	document.getElementById("x_button").onclick = (e) => {
		e.preventDefault();
		hideOverlay();
	};
}

if (/pong/.test(window.location.pathname) && isTouchDevice()) {
	document.querySelector(".pong-container").innerHTML = `
    <p class="page_content caption">
            You're on a touchsceen device so this won't work :(
    </p>
    `;
}

/* 
============================================================
Resume iframe checking
============================================================
*/

if (/resume/.test(window.location.pathname)) {
	const iframe = document.getElementById("resume_embed");
	setTimeout(() => {
		if (iframe.contentDocument !== null) {
			iframe.remove();
			const html = `
                <p class="page_content caption">
                    The PDF couldn't load. :( Try refreshing?
                </p>
            `;
			document.getElementById("resume_wrapper").innerHTML += html;
		}
	}, 5000);
}
