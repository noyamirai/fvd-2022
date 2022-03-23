console.log("FILTER BTN REVEAL SCRIPT: ACTIVE");

const bodyEl = document.querySelector("body");
const checkBoxes = document.querySelectorAll(".filters__option");

const btnContainer = document.querySelector(".btn-container");
const dismissBtn = document.querySelector("#btn-dismiss");

checkBoxes.forEach(box => {
    box.addEventListener("change", () => {
        bodyEl.classList.toggle("overlay");
        btnContainer.classList.toggle("visible");
    });
});

dismissBtn.addEventListener("click", (event) => {
    event.preventDefault();

    checkBoxes.forEach(box => {
        box.checked = false;
    })
    
    bodyEl.classList.toggle("overlay");
    btnContainer.classList.toggle("visible");
})
