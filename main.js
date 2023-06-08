const playerState = {
    xPosition: 0,
    yPosition: 0,
    isMovingRight: false,
    isMovingLeft: false,
    spaceshipWidth: 37.5,
    spaceshipSpeed: 10,
    isShooting: false,
    weapons: [],
    cooldown: 0,
};

const enemyState = {
    enemies: [],
    enemyWidth: 35,
    numberOfEnemies: 20,
    enemyWeapons: [],
    enemyCooldown: 0,
};

const gameStatus = {
    score: 0,
    lives: 3,
    gameOver: false,
};

const gameConstants = {
    KEY_ENTER: 13,
    KEY_RIGHT: 39,
    KEY_LEFT: 37,
    KEY_SPACE: 32,
    KEY_P: 80,
    KEY_R: 82,
    GAME_WIDTH: 600, 
    GAME_HEIGHT: 525,
    SPACESHIP_SPEED: 400,
    STARTTIME: performance.now(),
    
};

// Player
function createPlayer(container) {
    playerState.xPosition = gameConstants.GAME_WIDTH / 2;
    playerState.yPosition = gameConstants.GAME_HEIGHT - 100;

    const player = document.createElement('img');
    player.src = 'img/player.webp';
    player.alt = 'Player';
    player.className = 'player';

    container.appendChild(player);

    setPosition(player, playerState.xPosition, playerState.yPosition);
    setSize(player, playerState.spaceshipWidth);
}

// Update Player
function updatePlayer(deltaTime) {
    if (playerState.isMovingLeft) {      
        playerState.xPosition -= gameConstants.SPACESHIP_SPEED * deltaTime;
    } else if (playerState.isMovingRight) {
        playerState.xPosition += gameConstants.SPACESHIP_SPEED * deltaTime;
    }
    if (playerState.isShooting && playerState.cooldown <= 0) {
        createWeapon(container, playerState.xPosition - playerState.spaceshipWidth / 2, playerState.yPosition);
        playerState.cooldown = 10;
    }
    const player = document.querySelector('.player');
    setPosition(player, bound(playerState.xPosition), playerState.yPosition);
    if (playerState.cooldown > 0) {
        playerState.cooldown -= 30 * deltaTime;
    }
}

// Player weapon
function createWeapon(container, x, y) {
    const weapon = document.createElement('img');
    weapon.src = 'img/fireball.webp';
    weapon.alt = 'Weapon';
    weapon.className = 'weapon';
    container.appendChild(weapon);

    const weaponObject = { x, y, weapon };
    playerState.weapons.push(weaponObject);
    setPosition(weapon, x, y);
}

// Update Weapon
function updateWeapon() {
    const weapons = playerState.weapons;
    for (let i = 0; i < weapons.length; i++) {
        const weaponObject = weapons[i];
        weaponObject.y -= 5;
        if (weaponObject.y < 0) {
            deleteWeapon(weaponObject, weapons, weaponObject.weapon);
        }
        setPosition(weaponObject.weapon, weaponObject.x, weaponObject.y - 30);
        const weaponRect = weaponObject.weapon.getBoundingClientRect();
        const enemies = enemyState.enemies;
        for (let j = 0; j < enemies.length; j++) {
            const enemyObject = enemies[j];
            const enemyRect = enemyObject.enemy.getBoundingClientRect();
            if (collideRect(weaponRect, enemyRect)) {
                deleteWeapon(weaponObject, weapons, weaponObject.weapon);
                const index = enemies.indexOf(enemyObject);
                enemies.splice(index, 1);
                container.removeChild(enemyObject.enemy);
                updateScore(10);
            }
        }
    }
}

// Delete Weapon
function deleteWeapon(weaponObject, weapons, weapon) {
    const index = weapons.indexOf(weaponObject);
    weapons.splice(index, 1);
    container.removeChild(weapon);
}

// Update score
function updateScore(points) {
    gameStatus.score += points;
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Score: ${gameStatus.score}`;
}

// General functions

// Set position
function setPosition(element, x, y) {
    element.style.transform = `translate(${x}px, ${y}px)`;
}

// Set size
function setSize(element, width) {
    element.style.width = `${width}px`;
    element.style.height = 'auto';
}

// Boundaries
function bound(x) {
    if (x >= gameConstants.GAME_WIDTH - playerState.spaceshipWidth) {
        playerState.xPosition = gameConstants.GAME_WIDTH - playerState.spaceshipWidth;
        return gameConstants.GAME_WIDTH - playerState.spaceshipWidth;
    } else if (x <= 0) {
        playerState.xPosition = 0;
        return 0;
    } else {
        return x;
    }
}

// Create Enemy
function createEnemy(container, x, y) {  
    
    const enemy = document.createElement('img');
    enemy.src = 'img/enemy.webp';
    enemy.alt = 'Enemy';
    enemy.className = 'enemy';
    container.appendChild(enemy);

    const enemyCooldown = Math.floor(Math.random() * 50) + 100;
    const enemyObject = { x, y, enemy, enemyCooldown };

    enemyState.enemies.push(enemyObject);

    setSize(enemy, enemyState.enemyWidth);
    setPosition(enemy, x, y);
}

// Update Enemies
function updateEnemies(container, deltaTime) {
    const dx = Math.sin(Date.now() / 1000) * 40;
    const dy = Math.cos(Date.now() / 1000) * 40;
    const enemies = enemyState.enemies;

    for (let i = 0; i < enemies.length; i++) {
        const enemyObject = enemies[i];
        const x = enemyObject.x + dx;
        const y = enemyObject.y + dy + 50;
        setPosition(enemyObject.enemy, x, y);

        if (enemyObject.enemyCooldown <= 0){ 
            createEnemyWeapon(container, x, y);
            enemyObject.enemyCooldown = 100;
        }
        
        enemyObject.enemyCooldown -= 30 * deltaTime;
    }
}

// Create Enemies
function createEnemies(container) {
    for (let i = 0; i < enemyState.numberOfEnemies/2; i++) {
        createEnemy(container, i * 50, 40);
    } for (let i = 0; i < enemyState.numberOfEnemies/2; i++) {
        createEnemy(container, i * 50, 100);
    } for (let i = 0; i < enemyState.numberOfEnemies/2; i++) {
        createEnemy(container, i * 50, 160);
    } 
}

// Create enemy weapon
function createEnemyWeapon(container, x, y) {  
    console.log("Enemy weapon creation"); 
    const enemyWeapon = document.createElement('img');
    enemyWeapon.src = 'img/stone.webp';
    enemyWeapon.alt = 'Enemy Weapon';
    enemyWeapon.className = 'enemyWeapon';
    container.appendChild(enemyWeapon);
    const enemyWeaponObject = { x, y, enemyWeapon };
    enemyState.enemyWeapons.push(enemyWeaponObject);
    setPosition(enemyWeapon, x, y);
}

// Update Enemy Weapon
function updateEnemyWeapon(deltaTime) {
    const enemyWeapons = enemyState.enemyWeapons;
    for (let i = 0; i < enemyWeapons.length; i++) {      
        const enemyWeaponObject = enemyWeapons[i];
        enemyWeaponObject.y += 300 * deltaTime;

        if (enemyWeaponObject.y > gameConstants.GAME_HEIGHT - 80) {
            deleteWeapon(enemyWeaponObject, enemyWeapons, enemyWeaponObject.enemyWeapon);
        } else {
            const enemyWeapon_rectangle = enemyWeaponObject.enemyWeapon.getBoundingClientRect();
            const spaceship_rectangle = document.querySelector('.player').getBoundingClientRect();

            if (collideRect(spaceship_rectangle, enemyWeapon_rectangle)) {
                gameStatus.lives -= 1;
                updateLives();
                deleteWeapon(enemyWeaponObject, enemyWeapons, enemyWeaponObject.enemyWeapon);
            }
            setPosition(enemyWeaponObject.enemyWeapon, enemyWeaponObject.x + enemyState.enemyWidth / 2, enemyWeaponObject.y + 15);
        }
    }
}

// Collision
function collideRect(rect1, rect2){
    return (
    rect2.left <= rect1.right &&
    rect2.right >= rect1.left &&
    rect2.top <= rect1.bottom &&
    rect2.bottom >= rect1.top
  );
}

let isGameStarted = false;
let isGamePaused = false;
let accumulatedPauseTime = 0;

// Key Presses
function handleKeyPress(event) {
    if (!isGameStarted && event.keyCode === gameConstants.KEY_ENTER) {
        isGameStarted = true;
        console.log('Game started');
        window.requestAnimationFrame(update);
    } else if (event.keyCode === gameConstants.KEY_P) {
            if (isGamePaused) {
                accumulatedPauseTime += performance.now() - pauseStartTime;
                isGamePaused = false;
                if (!gameStatus.gameOver && gameStatus.lives > 0 && enemyState.enemies.length > 0) {
                    window.requestAnimationFrame(update);
                }
            } else {
                isGamePaused = true;
                pauseStartTime = performance.now(); 
            }            
    } else if (event.keyCode === gameConstants.KEY_RIGHT) {
        playerState.isMovingRight = true;
    } else if (event.keyCode === gameConstants.KEY_LEFT) {
        playerState.isMovingLeft = true;
    } else if (event.keyCode === gameConstants.KEY_SPACE) {
        playerState.isShooting = true;
    } else if (event.keyCode === gameConstants.KEY_R) {
        window.location.reload();
    }

}

function handleKeyRelease(event) {
    if (event.keyCode === gameConstants.KEY_RIGHT) {
        playerState.isMovingRight = false;
    } else if (event.keyCode === gameConstants.KEY_LEFT) {
        playerState.isMovingLeft = false;
    } else if (event.keyCode === gameConstants.KEY_SPACE) {
        playerState.isShooting = false;
    }
}

// Timer
function updateTimer() {
    const currentTime = performance.now();
    const elapsedTime = Math.round((currentTime - gameConstants.STARTTIME - accumulatedPauseTime) / 1000);

    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');

    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Timer: ${minutes}:${seconds}`;
}

// Update lives count and check for game over
function updateLives() {
    const livesElement = document.getElementById('lives');
    livesElement.textContent = `Lives: ${gameStatus.lives}`;

    if (gameStatus.lives === 1) {
        livesElement.style.color = 'red';
    }

    if (gameStatus.lives === 0) {
        gameStatus.gameOver = true;
    }

}

// Main Update Function
let lastFrameTime = performance.now();
const fpsElement = document.getElementById('fps');

function update(currentTime) {
  // Calculate time elapsed since the last frame
  const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert to seconds

  // Update FPS element
  const fps = Math.round(1 / deltaTime);
  fpsElement.textContent = `FPS: ${fps}`;

  if (!isGameStarted || isGamePaused) {
    return;
  }

  // Call other update functions
  updateTimer();

  updatePlayer(deltaTime);
  updateWeapon(container);
  updateEnemies(container, deltaTime);
  updateEnemyWeapon(deltaTime);

  // Request the next frame
  lastFrameTime = currentTime;
  if (!gameStatus.gameOver && gameStatus.lives > 0 && enemyState.enemies.length > 0) {
    window.requestAnimationFrame(update);
  } else {
    if (gameStatus.lives === 0) {
      document.querySelector('.lose').style.display = 'block';
    } else if (enemyState.enemies.length === 0) {
      document.querySelector('.win').style.display = 'block';
    }
  }
}

// Init. Game
const container = document.querySelector('.main');
createPlayer(container);
createEnemies(container);

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyRelease);

// Start the animation loop
window.requestAnimationFrame(update);

document.querySelector("#copyright-year").innerText =
new Date().getFullYear();