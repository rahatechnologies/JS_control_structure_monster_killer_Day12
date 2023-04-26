// Game configuration parameter
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const ATTACK_MODE = 'ATTACK';
const STRONG_ATTACK_MODE = 'STRONG_ATTACK';

// Below varibales are used only for logging
const LOG_EVENT_PLAYER_ATTACK = ATTACK_MODE;
const LOG_EVENT_PLAYER_STRONG_ATTACK = STRONG_ATTACK_MODE;
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

const userInputForMaxLife = prompt('Maximum life for you and Monster.', '100');

let battleLog = [];

let choseMaxLife = parseInt(userInputForMaxLife);

if (isNaN(choseMaxLife) || choseMaxLife <= 0) {
  choseMaxLife = 100;
}

let currentMonsterHealth = choseMaxLife;
let currentPlayerHealth = choseMaxLife;

let hasBonusLife = true;

adjustHealthBars(choseMaxLife);

function printLogHandler() {
  // console.log(`under printLogHandler`);
  // writeToLog();
  console.log(battleLog); // object

  //  Koushik's approach
  // let count = 0;
  // for (let i = 0; i < battleLog.length; i++) {
  //   count++;
  //   console.log(`Operation : ${count}`); // no. of operations
  //   console.log(`Event : ${battleLog[i].event}`);
  //   console.log(`Value : ${battleLog[i].value}`);
  //   console.log(`Target : ${battleLog[i].target}`);
  //   console.log(`Monstar Health : ${battleLog[i].finalMosterHealth}`);
  //   console.log(`Player Health : ${battleLog[i].finalPlayerHealth}`);
  // }
}

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMosterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = 'MONSTER';
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = 'MONSTER';
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = 'PLAYER';
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = 'PLAYER';
  } else if (ev === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event: ev,
      value: val,
      finalMosterHealth: monsterHealth,
      finalPlayerHealth: playerHealth,
    };
  }

  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = choseMaxLife;
  currentPlayerHealth = choseMaxLife;
  if (!hasBonusLife) {
    console.log('inside new bonus life creation part ');
    hasBonusLife = true;
    // changes for bonus life reset in UI

    // **************************************************************
    // Wrong process 1

    // var newSpan = document.createElement('span'); // create a new span element
    // newSpan.setAttribute('id', 'bonus-life'); // assign it an ID (optional — for locating later)

    // var span_text = document.createTextNode(1); // create some content
    // newSpan.appendChild(span_text); // append the content to "newP"

    // playerHealthHeading.appendChild(newSpan);

    //  Wrong Process2
    // var newSpan = `<span id='bonus-life'>1</span>`;
    // playerHealthHeading.innerHTML += newSpan;

    // ************

    // Correct Process3
    playerHealthHeading.appendChild(bonusLifeEl);
  }
  resetGame(choseMaxLife);
}

function endRound() {
  // player damage functionality
  const initialPlayerHealth = currentPlayerHealth; // this is used for bonus life
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    // console.log(`satisfied - currentPlayerHealth <= 0 && hasBonusLife `);

    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth; // to update actual data
    setPlayerHealth(initialPlayerHealth); // calling vendor.js method to update UI
    alert('You would be dead but the bonus life saved you!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Won!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER_WON',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER_LOST',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('Match Draw!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MATCH_DRAW',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  // if (
  //   (currentMonsterHealth <= 0 && currentPlayerHealth >= 0) ||
  //   (currentMonsterHealth <= 0 && currentMonsterHealth >= 0) ||
  //   (currentMonsterHealth <= 0 && currentPlayerHealth <= 0)
  // ) {
  //   reset();
  // }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    console.log(`currentPlayerHealth : ${currentPlayerHealth}`);
    console.log(`currentMonsterHealth : ${currentMonsterHealth}`);
    reset();
  }
}

function removeBonusLife() {
  playerHealthHeading.removeChild(bonusLifeEl);
}

function attackMonster(mode) {
  // ternary operator
  let maxDamage = mode === ATTACK_MODE ? ATTACK_VALUE : STRONG_ATTACK_VALUE;

  let logEvent =
    mode === ATTACK_MODE
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  // if (mode === ATTACK_MODE) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === STRONG_ATTACK_MODE) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound(); // Damages to player
}

function attackHandler() {
  attackMonster(ATTACK_MODE);
}
function strongAttackHandler() {
  attackMonster(STRONG_ATTACK_MODE);
}

function healPlayerHandler() {
  let healValue;

  if (currentPlayerHealth >= choseMaxLife - HEAL_VALUE) {
    // suppose currentPlayerHealth = 95,
    // choseMaxLife = 100 Already delared as global variable
    //  HEAL_VALUE = 20  Already delared as global variable

    // In such case,
    // =>  95 >= 100 - 20;
    // => 95 + 20 >= 100
    // After heal , player's health is increasing more than max life (i.e. 100) which is not possible

    alert(`You can't heal to more than your max initial health.`);
    healValue = choseMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  inrecasePlayerHealth(healValue); //UI update > changed Progress bar value for player health
  currentPlayerHealth += healValue; // Data update
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );

  endRound(); // Damages to player
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);

logBtn.addEventListener('click', printLogHandler);
