console.log('DRAG AND DROP SCRIPT: ACTIVE');

const dragContainer = document.querySelectorAll('.list__drag-container');
const draggableItems = document.querySelectorAll('.draggable');
const notification = document.querySelector('.notification');
const notificationText = document.querySelector('#notification-text');

const gameActionContainer = document.querySelector('#game-action');
const dismissBtn = document.querySelector('#btn-dismiss');
const addGameButtons = document.querySelectorAll('.add-game');

const addToFaves = document.querySelector('#fav-game');
const addToCompleted = document.querySelector('#completed-game');

const faveGameCollection = document.querySelector('#fave-game-collection');
const completedGameCollection = document.querySelector('#completed-game-collection');

let counter = 0;
let gameClone;

// TODO (GLOBAL): REFACTOR AND PUT IN FUNCTIONS

window.addEventListener('load', () => {
    const savedFaves = JSON.parse(localStorage.getItem('saved-faves') || '[]');
    const savedCompleted = JSON.parse(localStorage.getItem('saved-completed') || '[]');

    // When user has saved games for both collections
    if (savedFaves != '' && savedCompleted != '') {
        faveGameCollection.classList.toggle('list__empty');
        faveGameCollection.innerHTML = savedFaves;

        completedGameCollection.classList.toggle('list__empty');
        completedGameCollection.innerHTML = savedCompleted;
        
        faveGameCollection.querySelectorAll('li').forEach((item) => {
            addRemoveListeners(item);
        });

        completedGameCollection.querySelectorAll('li').forEach((item) => {
            addRemoveListeners(item);
        });

    // When user only has saved games in fav collection
    } else if (savedFaves != '' && savedCompleted == '') {
        faveGameCollection.classList.toggle('list__empty');
        faveGameCollection.innerHTML = savedFaves;

        faveGameCollection.querySelectorAll('li').forEach((item) => {
            addRemoveListeners(item);
        });

        localStorage.removeItem('saved-completed');

    // When user only has saved games in completed collection
    } else if (savedFaves == '' && savedCompleted != '') {
        completedGameCollection.classList.toggle('list__empty');
        completedGameCollection.innerHTML = savedCompleted;

        completedGameCollection.querySelectorAll('li').forEach((item) => {
            addRemoveListeners(item);
        });

        localStorage.removeItem('saved-faves');
    }
    
});

// Save HTML of collection on add or remove item
const saveData = (collection) => {
    if (collection.id == 'fave-game-collection') {
        let collectionHTML = JSON.stringify(collection.innerHTML.trim().replace(/^(&nbsp;|\s)*/, ''));
        let savedHTML = collectionHTML.replace(/\\n/g, '');

        console.log('added to faves');
        localStorage.setItem('saved-faves', savedHTML);

    } else if (collection.id == 'completed-game-collection') {
        let collectionHTML = JSON.stringify(collection.innerHTML.trim().replace(/^(&nbsp;|\s)*/, ''));
        let savedHTML = collectionHTML.replace(/\\n/g, '');

        console.log('added to completed');
        localStorage.setItem('saved-completed', savedHTML);
    }
};

// Clone item 
const getClone = (toBeClonedItem, fromAction) => {
    let nodeCopy = toBeClonedItem.cloneNode(true);

    nodeCopy.removeAttribute('class');
    nodeCopy.querySelector('.add-game').classList.toggle('hide');
    nodeCopy.querySelector('.remove-game').classList.toggle('hide');
    nodeCopy.draggable = false;

    if (fromAction == 'click') {
        nodeCopy.id = `${toBeClonedItem.id}-copy`;

    } else if (fromAction == 'drag') {
        nodeCopy.id = `${toBeClonedItem.id}-copy`;
    }

    return nodeCopy;
};

const activateNotification = (notificationLabel, type) => {
    notificationText.textContent = notificationLabel;

    if (type == 'removed') {
        notification.classList.remove('notification--added');
        notification.classList.toggle('notification--open');
        notification.classList.toggle('notification--removed');

    } else if (type == 'added') {
        notification.classList.remove('notification--removed');
        notification.classList.toggle('notification--open');
        notification.classList.toggle('notification--added');
    }

    setTimeout(() => {
        notification.classList.remove('notification--open');
    }, 2000);
};

// 
const addToCollection = (gameCollection, clonedItem) => {
    gameCollection.classList.remove('list__empty');
    gameCollection.appendChild(clonedItem);
    addRemoveListeners(clonedItem);

    toggleActionContainer();
};

const addRemoveListeners = (cloneEl) => {
    const cloneButton = cloneEl.querySelector('.remove-game');

    // REMOVE BUTTON
    cloneButton.addEventListener('click', (e) => {
        const collection = e.target.closest('ol');

        if (collection.id == 'fave-game-collection') {
            const allItems = collection.getElementsByTagName('li');

            e.target.closest('li').remove();
            saveData(collection);

            if (!allItems.length) {
                collection.classList.add('list__empty');
            }
        } else if (collection.id == 'completed-game-collection') {
            const allItems = collection.getElementsByTagName('li');

            e.target.closest('li').remove();
            saveData(collection);

            if (!allItems.length) {
                collection.classList.add('list__empty');
            }
        }

        activateNotification('Game has been removed from list!', 'removed');
    });
};

const toggleActionContainer = () => {
    bodyEl.classList.toggle('overlay');
    gameActionContainer.classList.toggle('visible');
};

const allowDrop = (e) => {
    e.preventDefault();
};

const onDrop = (e) => {
    e.preventDefault();

    const data = e.dataTransfer.getData('text');
    const clonedItem = getClone(document.getElementById(data), 'drag');

    if (e.target.tagName.toLowerCase() == 'li') {
        const newTarget = e.target.closest('ol');
        newTarget.appendChild(clonedItem);
        addRemoveListeners(clonedItem);

    } else {
        e.target.appendChild(clonedItem);
        addRemoveListeners(clonedItem);
    }

    activateNotification('Game has been added to list!', 'added');

    saveData(e.target);

    e.target.classList.remove('list__empty');
};

const drag = (e) => {
    e.dataTransfer.setData('text', e.target.closest('li').id);
};

dragContainer.forEach((item) => {
    if (!(window.innerWidth <= 950)) {

        item.addEventListener('dragover', (e) => {
            if (!e.target.classList.contains('list__drag-container--block')) {
                allowDrop(e);
            }
        });

        item.addEventListener('drop', (e) => {
            onDrop(e);
        });
    }
});

draggableItems.forEach((listItem) => {

    // IF DESKTOP SIZE
    if (!(window.innerWidth <= 950)) {

        listItem.classList.remove('draggable--mobile');
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
    } else {
        listItem.classList.add('draggable--mobile');

        listItem.querySelector('picture').addEventListener('click', (e) => {
            e.preventDefault();

            gameClone = getClone(e.target.closest('li'), 'click');
            toggleActionContainer();
        });
    }
});

addGameButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        gameClone = getClone(e.target.closest('li'), 'click');

        toggleActionContainer();
    });
});

addToFaves.addEventListener('click', (e) => {
    const gameItem = gameClone;

    addToCollection(faveGameCollection, gameItem);

    activateNotification('Game has been added to list!', 'added');
    saveData(faveGameCollection);
});

addToCompleted.addEventListener('click', (e) => {
    const gameItem = gameClone;

    addToCollection(completedGameCollection, gameItem);

    activateNotification('Game has been added to list!', 'added');
    saveData(completedGameCollection);
});

dismissBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleActionContainer();
});