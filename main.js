let player1, player2, grid;

let selectingGrid = {};

window.addEventListener("load", () => {
    //Initiate new game data

    player1 = {
        fraction: 1,
        name: "player1",
        hand: [
            {
                name: "Goblin",
                stats: {
                    attack: 5,
                    health: 15,
                    cost: 5,
                    move: 1
                },
                img: "./img/cards/goblin.jpg",
            },
            {
                name: "Ogre",
                stats: {
                    attack: 12,
                    health: 35,
                    cost: 12,
                    move: 1
                },
                img: "./img/cards/ogre.jpg"
            },
            {
                name: "Goblin",
                stats: {
                    attack: 5,
                    health: 15,
                    cost: 5,
                    move: 1
                },
                img: "./img/cards/goblin.jpg"
            },
            {
                name: "Goblin",
                stats: {
                    attack: 5,
                    health: 15,
                    cost: 5,
                    move: 1
                },
                img: "./img/cards/goblin.jpg"
            },
            {
                name: "Blood Orc",
                stats: {
                    attack: 15,
                    health: 25,
                    cost: 8,
                    move: 1
                },
                img: "./img/cards/blood-orc.jpg"
            },
        ],
        health: 100,
        mana: 50,
    }

    grid = [
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
        [{}, {}, {}, {}],
    ]
    for (let i = 0; i < grid.length; i += 1) {
        for (let p = 0; p < grid[i].length; p += 1) {
            if (i === 1) {
                if (p === 0 || p === 3) {
                    grid[i][p] = {
                        name: "tower",
                        stats: {
                            attack: 2,
                            health: 20
                        },
                        position: {
                            x: p,
                            y: i
                        },
                        img: "./img/cards/tower-human.jpg",
                        fraction: 2
                    }
                }
            }
            if (i === 4) {
                if (p === 0 || p === 3) {
                    grid[i][p] = {
                        name: "tower",
                        stats: {
                            attack: 2,
                            health: 20
                        },
                        position: {
                            x: p,
                            y: i
                        },
                        img: "./img/cards/tower-ogre.jpg",
                        fraction: 1
                    }
                }
            }
        }
    }

    document.getElementById("board-map").addEventListener("click", (e) => {
        if (!e.target.classList.contains("board-cell-action")) {
            selectingGrid = {};
            clearGridSpawn()
            updateUI();
        }
    })

    updateUI();
});

function activateCard(player, cardNumber) {
    const card = player.hand[cardNumber];
    selectingGrid.action = "action-spawn-card";
    selectingGrid.card = card;
    selectingGrid.cardNumber = cardNumber;
    selectingGrid.fraction = player.fraction;
    calculateGridSpawn(player);

    updateUI();
}

function spawnSelectedCard(position) {
    if (!selectingGrid.action || !selectingGrid.card) {
        console.error("Unexpted logic flow");
        return;
    }
    grid[position.y][position.x] = {
        name: selectingGrid.card.name,
        stats: {
            attack: selectingGrid.card.stats.attack,
            health: selectingGrid.card.stats.health,
            move: selectingGrid.card.stats.move
        },
        position: {
            x: position.x,
            y: position.y
        },
        img: selectingGrid.card.img,
        fraction: selectingGrid.fraction
    }
    console.log(grid[position.y][position.x])


    const player = selectingGrid.fraction === 1 ? player1 : player2;

    player.hand.splice(selectingGrid.cardNumber, 1);
    selectingGrid = {}
    clearGridSpawn();
    updateUI();
}

function calculateGridSpawn(player) {
    for (let i = 0; i < grid.length; i += 1) {
        for (let p = 0; p < grid[i].length; p += 1) {
            if (!(grid[i][p].name) && canSpawnCell({ y: i, x: p }, player.fraction)) {
                grid[i][p].action = "action-spawn-card";
            }
            else grid[i][p].action = "action-not-allowed";
        }
    }
}

function clearGridSpawn() {
    for (let i = 0; i < grid.length; i += 1) {
        for (let p = 0; p < grid[i].length; p += 1) {
            delete grid[i][p].action;
        }
    }
}

function canSpawnCell(position, fraction) {
    if ((grid[position.y - 1] && grid[position.y - 1][position.x]?.name === "tower" && grid[position.y - 1][position.x]?.fraction === fraction)
        || (grid[position.y - 1] && grid[position.y - 1][position.x + 1]?.name === "tower" && grid[position.y - 1][position.x + 1]?.fraction === fraction)
        || (grid[position.y] && grid[position.y][position.x + 1]?.name === "tower" && grid[position.y][position.x + 1]?.fraction === fraction)
        || (grid[position.y + 1] && grid[position.y + 1][position.x + 1]?.name === "tower" && grid[position.y + 1][position.x + 1]?.fraction === fraction)
        || (grid[position.y + 1] && grid[position.y + 1][position.x]?.name === "tower" && grid[position.y + 1][position.x]?.fraction === fraction)
        || (grid[position.y + 1] && grid[position.y + 1][position.x - 1]?.name === "tower" && grid[position.y + 1][position.x - 1]?.fraction === fraction)
        || (grid[position.y] && grid[position.y][position.x - 1]?.name === "tower" && grid[position.y][position.x - 1]?.fraction === fraction)
        || (grid[position.y - 1] && grid[position.y - 1][position.x - 1]?.name === "tower" && grid[position.y - 1][position.x - 1]?.fraction === fraction)
    ) {
        return true;
    }
    return false;
}

function updateUI() {
    //Update player stats

    //Update player cards
    const player1CardsZone = document.getElementById("player1-cards");
    let newCardsHTML = ``;
    player1.hand.forEach(card => {
        newCardsHTML += `
            <div class="card-player">
                <span class="card-player-cost">${card.stats.cost}</span>
                <div class="card-player-img">
                    <img src="${card.img}" />
                </div>
                <h3>${card.name}</h3>
                <div class="card-stats card-player-stats">
                    <div class="card-stat card-attack">
                        <img src="./img/attack.png">
                        <span>${card.stats.attack}</span>
                    </div>
                    <div class="card-stat card-heatlh">
                        <img src="./img/health.png">
                        <span>${card.stats.health}</span>
                    </div>
                </div>
            </div>
        `;
    })
    player1CardsZone.innerHTML = newCardsHTML;
    const player1Cards = document.querySelectorAll('#player1-cards .card-player');
    player1Cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            activateCard(player1, index);
        })
    })

    //Update grid entities
    const gridCells = document.querySelectorAll(".board-grid-cell");
    for (let i = 0; i < grid.length; i += 1) {
        for (let p = 0; p < grid[i].length; p += 1) {
            let cellHTML = '';
            const item = grid[i][p];
            if (item.img) {
                cellHTML += `<img src="${item.img}" class="board-grid-cell-image" />`;
            }
            if (item.stats && item.stats.attack && item.stats.health) {
                cellHTML += `
                    <div class="card-stats card-board-stats cardboard-unit-player-${item.fraction}">
                    <div class="card-stat card-attack">
                        <img src="./img/attack.png">
                        <span>${item.stats.attack}</span>
                    </div>
                    <div class="card-stat card-heatlh">
                        <img src="./img/health.png">
                        <span>${item.stats.health}</span>
                    </div>
                </div>
                `
            }
            if (selectingGrid.action) {
                cellHTML += `<div class="board-cell-action ${grid[i][p].action}"></div>`
            }

            gridCells[(i * grid[i].length) + p].innerHTML = cellHTML;

            if (item.action === "action-spawn-card") {
                const actionCoverPanel = gridCells[(i * grid[i].length) + p].querySelector(".board-cell-action");
                actionCoverPanel.addEventListener("click", () => {
                    spawnSelectedCard({ x: p, y: i })
                });
            }
        }
    }
}