console.log("FILTER BTN REVEAL SCRIPT: ACTIVE");

const bodyEl = document.querySelector("body");
const checkBoxes = document.querySelectorAll(".filters__option");

const mainHeader = document.querySelector('#main-header');
const filterContainer = document.querySelector('.filters');
const filterBtn = document.querySelector('#filter-btn');
const libraryBtn = document.querySelector('#library-btn');

const btnContainer = document.querySelector(".btn-container");
const dismissBtn = document.querySelector("#btn-dismiss");

filterBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (filterBtn.closest('li').classList.contains('active')) {
        e.target.textContent = 'Filters';
    } else {
        e.target.textContent = 'Close';
    }

    filterContainer.classList.toggle('filters--open');

    filterBtn.closest('li').classList.toggle('active');
    libraryBtn.closest('li').classList.toggle('active');

    mainHeader.classList.toggle('filters--open');
});

// checkBoxes.forEach(box => {
//     box.addEventListener("change", () => {
//         bodyEl.classList.toggle("overlay");
//         btnContainer.classList.toggle("visible");
//     });
// });

// dismissBtn.addEventListener("click", (event) => {
//     event.preventDefault();

//     checkBoxes.forEach(box => {
//         box.checked = false;
//     })
    
//     bodyEl.classList.toggle("overlay");
//     btnContainer.classList.toggle("visible");
// })
