document.addEventListener('DOMContentLoaded', () => {
  // Define token types
  const tokenTypes = ['plusOne', 'zero', 'minusOne', 'minusTwo', 'minusThree', 'minusFive', 'skull', 'autofail', 'cultist', 'elderSign', 'tablet', 'elderThing'];

  // Define token counts and values
  const tokenCounts = {};
  const tokenValues = {};
  tokenTypes.forEach(token => {
    tokenCounts[token] = 0;
    tokenValues[token] = getTokenValue(token); // Initial values
  });

  // Define draw log
  const drawLog = {
    1: [],
    2: [],
    3: [],
    4: []
  };

  // Function to update player names
  function updatePlayerNames() {
    for (let i = 1; i <= 4; i++) {
      const name = document.getElementById(`player${i}Name`).value || `Player ${i}`;
      document.getElementById(`logPlayer${i}`).textContent = name;
      const buttons = document.querySelectorAll(`.player${i}Button`);
      buttons.forEach(button => {
        button.textContent = name;
      });
    }
  }

  // Add event listeners to player name inputs
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`player${i}Name`).addEventListener('input', updatePlayerNames);
  }
  updatePlayerNames();

  // Function to update draw log
  function updateDrawLog() {
    const drawLogBody = document.getElementById('drawLogBody');
    drawLogBody.innerHTML = '';
    for (let i = 0; i < Math.max(...Object.values(drawLog).map(log => log.length)); i++) {
      const row = document.createElement('tr');
      for (let j = 1; j <= 4; j++) {
        const cell = document.createElement('td');
        cell.textContent = drawLog[j][i] || '';
        row.appendChild(cell);
      }
      drawLogBody.appendChild(row);
    }
  }

  // Function to increment token count
  window.incrementCount = function(token) {
    tokenCounts[token]++;
    document.getElementById(`${token}Count`).textContent = tokenCounts[token];
    updateChances();
  };

  // Function to decrement token count
  window.decrementCount = function(token) {
    if (tokenCounts[token] > 0) {
      tokenCounts[token]--;
      document.getElementById(`${token}Count`).textContent = tokenCounts[token];
      updateChances();
    }
  };

  // Function to add draw
  window.addDraw = function(player, token) {
    const totalTokens = Object.values(tokenCounts).reduce((sum, count) => sum + count, 0);
    const chance = totalTokens ? (tokenCounts[token] / totalTokens * 100).toFixed(2) : '0.00';
    drawLog[player].push(`${token.charAt(0).toUpperCase() + token.slice(1)} (${chance}%)`);
    updateDrawLog();
  };

  // Function to remove last draw
  window.removeLastDraw = function(playerIndex) {
    if (drawLog[playerIndex].length > 0) {
      drawLog[playerIndex].pop(); // Remove the last entry from the player's log
      updateDrawLog(); // Update the display log
    }
  };

  // Function to clear all draws
  window.clearAllDraws = function() {
    for (let i = 1; i <= 4; i++) {
      drawLog[i] = [];
    }
    updateDrawLog(); // Update the display log
  };

  // Function to calculate success chance
  window.calculateSuccess = function() {
    const skillValue = parseInt(document.getElementById('skillValue').value);
    const testDifficulty = parseInt(document.getElementById('testDifficulty').value);
    if (isNaN(skillValue) || isNaN(testDifficulty)) {
      document.getElementById('successChance').textContent = 'Please enter valid numbers for skill value and test difficulty.';
      return;
    }

    const totalTokens = Object.values(tokenCounts).reduce((sum, count) => sum + count, 0);
    if (totalTokens === 0) {
      document.getElementById('successChance').textContent = 'Success Chance: 0.00% (No tokens in the bag)';
      return;
    }

    const successTokens = tokenTypes.filter(token => {
      const tokenValue = getTokenValue(token);
      return skillValue + tokenValue >= testDifficulty;
    });

    const successCount = successTokens.reduce((sum, token) => sum + tokenCounts[token], 0);
    const successChance = (successCount / totalTokens * 100).toFixed(2);
    document.getElementById('successChance').textContent = `Success Chance: ${successChance}%`;

    // Display eligible tokens to succeed
    document.getElementById('eligibleTokens').textContent = `Eligible Tokens to Succeed: ${successTokens.join(', ')}`;
  };

  // Function to get token value
  function getTokenValue(token) {
    const tokenValues = {
      plusOne: 1,
      skull: -1,
      zero: 0,
      minusOne: -1,
      minusTwo: -2,
      minusThree: -3,
      minusFive: -5,
      cultist: -2,
      elderSign: 1,
      tablet: -3,
      elderThing: -4
    };
    return tokenValues[token] || 0;
  }

  // Function to update chances
  function updateChances() {
    const totalTokens = Object.values(tokenCounts).reduce((sum, count) => sum + count, 0);
    tokenTypes.forEach(token => {
      const chance = totalTokens ? (tokenCounts[token] / totalTokens * 100).toFixed(2) : 0;
      document.getElementById(`${token}Chance`).textContent = chance;
    });
  }

  // Function to adjust token value
  window.adjustTokenValue = function(token, adjustment) {
    tokenValues[token] += adjustment;
    document.getElementById(`${token}Value`).textContent = tokenValues[token];
  };

  // Dynamically generate token rows
  const tokenTableBody = document.querySelector('.token-table tbody');
  tokenTypes.forEach(token => {
    const row = document.createElement('tr');
    // Actions column
    const actionsColumn = document.createElement('td');
    const incrementButton = document.createElement('button');
    incrementButton.textContent = '+';
    incrementButton.onclick = () => incrementCount(token);
    const decrementButton = document.createElement('button');
    decrementButton.textContent = '-';
    decrementButton.onclick = () => decrementCount(token);
    actionsColumn.appendChild(incrementButton);
    actionsColumn.appendChild(decrementButton);
    row.appendChild(actionsColumn);
    // Token name column
    const tokenNameColumn = document.createElement('td');
    tokenNameColumn.textContent = token.charAt(0).toUpperCase() + token.slice(1);
    row.appendChild(tokenNameColumn);
    // Token count column
    const tokenCountColumn = document.createElement('td');
    const tokenCountSpan = document.createElement('span');
    tokenCountSpan.id = `${token}Count`;
    tokenCountSpan.textContent = '0';
    tokenCountColumn.appendChild(tokenCountSpan);
    row.appendChild(tokenCountColumn);
    // Draw chance column
    const drawChanceColumn = document.createElement('td');
    const drawChanceSpan = document.createElement('span');
    drawChanceSpan.id = `${token}Chance`;
    drawChanceSpan.textContent = '0.00';
    drawChanceColumn.appendChild(drawChanceSpan);
    row.appendChild(drawChanceColumn);
    // Value column
    const valueColumn = document.createElement('td');
    const tokenValueSpan = document.createElement('span');
    tokenValueSpan.id = `${token}Value`;
    tokenValueSpan.textContent = tokenValues[token];
    valueColumn.appendChild(tokenValueSpan);
    row.appendChild(valueColumn);
    // Adjust value column
    const adjustValueColumn = document.createElement('td');
    const increaseValueButton = document.createElement('button');
    increaseValueButton.textContent = '+';
    increaseValueButton.onclick = () => adjustTokenValue(token, 1);
    const decreaseValueButton = document.createElement('button');
    decreaseValueButton.textContent = '-';
    decreaseValueButton.onclick = () => adjustTokenValue(token, -1);
    adjustValueColumn.appendChild(increaseValueButton);
    adjustValueColumn.appendChild(decreaseValueButton);
    row.appendChild(adjustValueColumn);
    // Players column
    const playersColumn = document.createElement('td');
    for (let i = 1; i <= 4; i++) {
      const playerButton = document.createElement('button');
      playerButton.textContent = document.getElementById(`player${i}Name`).value || `Player ${i}`;
      playerButton.onclick = () => addDraw(i, token);
      playerButton.className = `player${i}Button`;
      playersColumn.appendChild(playerButton);
    }
    row.appendChild(playersColumn);
    // Append the row to the table body
    tokenTableBody.appendChild(row);
  });
});
