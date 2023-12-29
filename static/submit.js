const form = document.getElementById("new_post_form");
const title = document.getElementById("new_post_title");
const body = document.getElementById("new_post_body");
const button = document.getElementById("new_post_button");
const result = document.getElementById("result");

const inputChange = (e) => {
	result.innerText = "";
	result.style.color = "white";
	result.style.display = "none";
	button.disabled = title.value === "" || body.value === "";
};

title.oninput = inputChange;
title.onfocus = inputChange;
body.oninput = inputChange;
body.onfocus = inputChange;

form.onsubmit = (e) => {
	e.preventDefault();
	result.innerText = "Loading...";
	result.style.color = "white";
	result.style.display = "block";
	button.disabled = true;
	let data = new FormData(form);
	fetch("/api/new/", {
		method: "POST",
		body: data,
	}).then((res) => {
		button.disabled = false;
		if (res.status === 200) {
			result.innerText = "Success!";
			result.style.color = "lightgreen";
			title.value = "";
			body.value = "";
		} else {
			result.innerText = `Error ${res.status}: ${res.statusText}`;
			result.style.color = "red";
		}
	});
};
