[...document.getElementsByClassName("clickable")].forEach((element) => {
	element.onclick = () => eventHandler(element, "click");
	element.onkeydown = (event) => eventHandler(element, event.key);
});

function eventHandler(element, key) {
	if (key != "Tab") {
		element.nextElementSibling.classList.toggle("invisible");
	}
}
