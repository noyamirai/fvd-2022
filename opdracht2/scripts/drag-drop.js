console.log('DRAG AND DROP SCRIPT: ACTIVE');

const dragContainer = document.querySelectorAll('.list__drag-container');
const draggableItems = document.querySelectorAll('.draggable');
const notification = document.querySelector('.notification');
const notificationText = document.querySelector('#notification-text');

const gameActionContainer = document.querySelector('#game-action');
const dismissBtn = document.querySelector("#btn-dismiss");
const addGameButtons = document.querySelectorAll('.add-game');
const removeGameButtons = document.querySelectorAll('.remove-game');

const addToFaves = document.querySelector('#fav-game');
const addToCompleted = document.querySelector('#completed-game');

const faveGameCollection = document.querySelector('#fave-game-collection');
const completedGameCollection = document.querySelector('#completed-game-collection');

let counter = 0;

// TODO (GLOBAL): REFACTOR AND PUT IN FUNCTIONS

window.addEventListener('load', (event) => {
    // const savedFaves = JSON.parse(localStorage.getItem("saved-faves") || "[]");
    
    // TODO: CHECK IF ANYTHING IS SAVED AND IN WHICH COLLECTION
    // faveGameCollection.classList.toggle('list__empty');
    // faveGameCollection.innerHTML = savedFaves;
});


const addListeners = (cloneEl) => {
    const cloneButton = cloneEl.querySelector('.remove-game');

    cloneButton.addEventListener('click', (e) => {

        if (e.target.closest('ol').id == 'fave-game-collection') {
            const collection = faveGameCollection;
            const allItems = collection.getElementsByTagName('li');
            
            e.target.closest('li').remove();                    
            if (!allItems.length) {
                collection.classList.add('list__empty');
            }
        } else if (e.target.closest('ol').id == 'completed-game-collection') {
            const collection = completedGameCollection;
            const allItems = collection.getElementsByTagName('li');
            
            e.target.closest('li').remove();                    
            if (!allItems.length) {
                collection.classList.add('list__empty');
            }
        }

        notificationText.textContent = 'Game has been removed from list!'
        notification.classList.remove('notification--added');        
        notification.classList.toggle('notification--open');
        notification.classList.toggle('notification--removed');

        setTimeout(() => {
            notification.classList.remove('notification--open');
        }, 1500);
    });
}

const allowDrop = (e) => {
    e.preventDefault();
};

const onDrop = (e) => {
    e.preventDefault();

    const data = e.dataTransfer.getData("text");

    let nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = `${data}-copy`;
    nodeCopy.removeAttribute('class');
    nodeCopy.querySelector('.add-game').classList.toggle('hide');
    nodeCopy.querySelector('.remove-game').classList.toggle('hide');
    nodeCopy.draggable = false;

    if (e.target.tagName.toLowerCase() == 'li') {
        const newTarget = e.target.closest('ol');
        newTarget.appendChild(nodeCopy);
        addListeners(nodeCopy);

    } else {
        e.target.appendChild(nodeCopy);
        addListeners(nodeCopy);
    }

    notificationText.textContent = 'Game has been added to list!'
    notification.classList.remove('notification--removed');        
    notification.classList.toggle('notification--open');
    notification.classList.toggle('notification--added');

    setTimeout(() => {
        notification.classList.remove('notification--open');
    }, 1500);

    // TODO: CHECK IN WHICH COLLECTION IT WAS DROPPED
    // localStorage.setItem('saved-faves', JSON.stringify(e.target.innerHTML));

    e.target.classList.remove('list__empty');
};

const drag = (e) => {
    e.dataTransfer.setData('text', e.target.closest('li').id);
};

dragContainer.forEach((item) => {
    item.addEventListener('dragover', (e) => {
        if (!e.target.classList.contains('list__drag-container--block')) {
            allowDrop(e);
        }
    });

    item.addEventListener('drop', (e) => {
        onDrop(e);
    })
});

draggableItems.forEach((listItem) => {
    listItem.draggable = true;
    listItem.id = `drag-${counter++}`;

    listItem.addEventListener('dragstart', (e) => {
        dragContainer.forEach((container) => {

            const allItems = container.getElementsByTagName('li');

            // Check if container already has games
            if (allItems.length) {
                for (let game of allItems) {
                    // If game is already inside list
                    if (game.id == `${listItem.id}-copy`) {
                        container.classList.add('list__drag-container--block');
                    } else {
                        container.classList.add('list__empty--active');
                    }
                }
            } else {
                container.classList.add('list__empty--active');
            }
        });
        drag(e);
    });

    listItem.addEventListener('dragend', (e) => {
        dragContainer.forEach((item) => {
            item.classList.remove('list__empty--active');
            item.classList.remove('list__drag-container--block');
        });
    });
});

let gameClone;

addGameButtons.forEach((button) => {
    button.addEventListener('click', (e) => {

        let nodeCopy = e.target.closest('li').cloneNode(true);
        nodeCopy.id = `${e.target.closest('li').id}-copy`;
        nodeCopy.removeAttribute('class');
        nodeCopy.querySelector('.add-game').classList.toggle('hide');
        nodeCopy.querySelector('.remove-game').classList.toggle('hide');
        nodeCopy.draggable = false;

        gameClone = nodeCopy;
        // TODO: SAVE IN LOCAL STORAGE

        bodyEl.classList.toggle("overlay");
        gameActionContainer.classList.toggle('visible');

    });
});

addToFaves.addEventListener('click', (e) => {
    const gameItem = gameClone;

    faveGameCollection.classList.remove('list__empty');
    faveGameCollection.appendChild(gameItem);
    addListeners(gameItem);

    bodyEl.classList.toggle("overlay");
    gameActionContainer.classList.toggle('visible');

    // TODO: SAVE IN LOCAL STORAGE
    // TODO: ADD DELAY HERE?
    notificationText.textContent = 'Game has been added to list!'
    notification.classList.remove('notification--removed');        
    notification.classList.toggle('notification--open');
    notification.classList.toggle('notification--added');

    setTimeout(() => {
        notification.classList.remove('notification--open');
    }, 1500);
});

addToCompleted.addEventListener('click', (e) => {
    const gameItem = gameClone;

    completedGameCollection.classList.remove('list__empty');
    completedGameCollection.appendChild(gameItem);
    addListeners(gameItem);

    bodyEl.classList.toggle("overlay");
    gameActionContainer.classList.toggle('visible');
    
    // TODO: SAVE IN LOCAL STORAGE
    // TODO: ADD DELAY HERE?
    notificationText.textContent = 'Game has been added to list!'
    notification.classList.remove('notification--removed');        
    notification.classList.toggle('notification--open');
    notification.classList.toggle('notification--added');

    setTimeout(() => {
        notification.classList.remove('notification--open');
    }, 1500);
});

dismissBtn.addEventListener("click", (e) => {
    e.preventDefault();

    bodyEl.classList.toggle("overlay");
    gameActionContainer.classList.toggle("visible");
});