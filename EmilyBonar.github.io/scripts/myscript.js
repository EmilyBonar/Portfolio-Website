[...document.getElementsByClassName("clickable")].forEach((element) => {
	element.onclick = () => eventHandler(element, "onclick");
});

function eventHandler(element, event) {
	element.nextElementSibling.classList.toggle("invisible");
}
