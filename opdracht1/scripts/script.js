console.log("TOGGLE SCRIPT: ACTIVE");

const toggleContainer = document.querySelector("fieldset");
const toggleBtn = document.querySelector("#color-mode");
const bodyElement = document.querySelector("body");

toggleContainer.classList.toggle("hide");

if (localStorage.getItem('colorMode') == 'light') {
    bodyElement.classList.add("lightmode"); 
    toggleBtn.checked = true;
}

toggleBtn.addEventListener(`click`, event => {
    if (!localStorage.getItem('colorMode')) {
        localStorage.setItem('colorMode', 'light');
    } else {
        localStorage.clear();
    }

    bodyElement.classList.toggle("lightmode");
});