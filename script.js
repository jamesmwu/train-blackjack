// ============================================
// BLACKJACK TRAINER - Game Logic
// ============================================

// Game State
let deck = [];
let playerHand = [];
let dealerHand = [];
let correctCount = 0;
let wrongCount = 0;
let gameActive = false;
let canDouble = true;
let canSplit = false;
let bigHandFeatureFlag = false;
let splitFeatureFlag = false;

// Card suits and values
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = [
	'A',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'J',
	'Q',
	'K',
];

// ============================================
// BASIC STRATEGY CHART
// ============================================

// Basic strategy lookup
// Returns: 'H' = Hit, 'S' = Stand, 'D' = Double (hit if can't), 'P' = Split, 'Ds' = Double (stand if can't)

// Hard totals strategy (player total vs dealer upcard)
const HARD_STRATEGY = {
	// Player total: { dealer upcard: action }
	4: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'H',
		6: 'H',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	5: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'H',
		6: 'H',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	6: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'H',
		6: 'H',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	7: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'H',
		6: 'H',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	8: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'H',
		6: 'H',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	9: {
		2: 'H',
		3: 'D',
		4: 'D',
		5: 'D',
		6: 'D',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	10: {
		2: 'D',
		3: 'D',
		4: 'D',
		5: 'D',
		6: 'D',
		7: 'D',
		8: 'D',
		9: 'D',
		10: 'H',
		11: 'H',
	},
	11: {
		2: 'D',
		3: 'D',
		4: 'D',
		5: 'D',
		6: 'D',
		7: 'D',
		8: 'D',
		9: 'D',
		10: 'D',
		11: 'D',
	},
	12: {
		2: 'H',
		3: 'H',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	13: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	14: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	15: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	16: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	17: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	},
	18: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	},
	19: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	},
	20: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	},
	21: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	},
};

// Soft totals strategy (player soft total vs dealer upcard)
const SOFT_STRATEGY = {
	// Soft total (A + X): { dealer upcard: action }
	13: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'D',
		6: 'D',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	}, // A,2
	14: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'D',
		6: 'D',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	}, // A,3
	15: {
		2: 'H',
		3: 'H',
		4: 'D',
		5: 'D',
		6: 'D',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	}, // A,4
	16: {
		2: 'H',
		3: 'H',
		4: 'D',
		5: 'D',
		6: 'D',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	}, // A,5
	17: {
		2: 'H',
		3: 'D',
		4: 'D',
		5: 'D',
		6: 'D',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	}, // A,6
	18: {
		2: 'Ds',
		3: 'Ds',
		4: 'Ds',
		5: 'Ds',
		6: 'Ds',
		7: 'S',
		8: 'S',
		9: 'H',
		10: 'H',
		11: 'H',
	}, // A,7
	19: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'Ds',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	}, // A,8
	20: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	}, // A,9
};

// Pair splitting strategy (pair value vs dealer upcard)
const PAIR_STRATEGY = {
	// Pair value: { dealer upcard: action } - 'P' = split, others = don't split (use hard/soft)
	2: {
		2: 'P',
		3: 'P',
		4: 'P',
		5: 'P',
		6: 'P',
		7: 'P',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	3: {
		2: 'P',
		3: 'P',
		4: 'P',
		5: 'P',
		6: 'P',
		7: 'P',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	4: {
		2: 'H',
		3: 'H',
		4: 'H',
		5: 'P',
		6: 'P',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	5: {
		2: 'D',
		3: 'D',
		4: 'D',
		5: 'D',
		6: 'D',
		7: 'D',
		8: 'D',
		9: 'D',
		10: 'H',
		11: 'H',
	}, // Never split 5s
	6: {
		2: 'P',
		3: 'P',
		4: 'P',
		5: 'P',
		6: 'P',
		7: 'H',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	7: {
		2: 'P',
		3: 'P',
		4: 'P',
		5: 'P',
		6: 'P',
		7: 'P',
		8: 'H',
		9: 'H',
		10: 'H',
		11: 'H',
	},
	8: {
		2: 'P',
		3: 'P',
		4: 'P',
		5: 'P',
		6: 'P',
		7: 'P',
		8: 'P',
		9: 'P',
		10: 'P',
		11: 'P',
	}, // Always split 8s
	9: {
		2: 'P',
		3: 'P',
		4: 'P',
		5: 'P',
		6: 'P',
		7: 'S',
		8: 'P',
		9: 'P',
		10: 'S',
		11: 'S',
	},
	10: {
		2: 'S',
		3: 'S',
		4: 'S',
		5: 'S',
		6: 'S',
		7: 'S',
		8: 'S',
		9: 'S',
		10: 'S',
		11: 'S',
	}, // Never split 10s
	11: {
		2: 'P',
		3: 'P',
		4: 'P',
		5: 'P',
		6: 'P',
		7: 'P',
		8: 'P',
		9: 'P',
		10: 'P',
		11: 'P',
	}, // Always split Aces
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function createDeck() {
	const newDeck = [];
	// Use 6 decks for more realistic play
	for (let d = 0; d < 6; d++) {
		for (const suit of SUITS) {
			for (const value of VALUES) {
				newDeck.push({ suit, value });
			}
		}
	}
	return shuffleDeck(newDeck);
}

function shuffleDeck(deck) {
	const shuffled = [...deck];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function drawCard() {
	if (deck.length < 52) {
		deck = createDeck();
	}
	return deck.pop();
}

function getCardValue(card) {
	if (['J', 'Q', 'K'].includes(card.value)) return 10;
	if (card.value === 'A') return 11;
	return parseInt(card.value);
}

function getCardNumericValue(card) {
	// For strategy lookup - Ace = 11
	if (['J', 'Q', 'K'].includes(card.value)) return 10;
	if (card.value === 'A') return 11;
	return parseInt(card.value);
}

function calculateHandValue(hand) {
	let value = 0;
	let aces = 0;

	for (const card of hand) {
		const cardVal = getCardValue(card);
		value += cardVal;
		if (card.value === 'A') aces++;
	}

	// Convert aces from 11 to 1 as needed
	while (value > 21 && aces > 0) {
		value -= 10;
		aces--;
	}

	return value;
}

function isSoftHand(hand) {
	let value = 0;
	let aces = 0;

	for (const card of hand) {
		const cardVal = getCardValue(card);
		value += cardVal;
		if (card.value === 'A') aces++;
	}

	// Hand is soft if it contains an Ace counted as 11
	while (value > 21 && aces > 0) {
		value -= 10;
		aces--;
	}

	return aces > 0 && value <= 21;
}

function isPair(hand) {
	if (hand.length !== 2) return false;
	return getCardNumericValue(hand[0]) === getCardNumericValue(hand[1]);
}

function isBlackjack(hand) {
	return hand.length === 2 && calculateHandValue(hand) === 21;
}

// ============================================
// STRATEGY LOOKUP
// ============================================

function getCorrectAction(playerHand, dealerUpcard) {
	const dealerValue = getCardNumericValue(dealerUpcard);
	const playerValue = calculateHandValue(playerHand);
	const soft = isSoftHand(playerHand);
	const pair = isPair(playerHand);

	// Check for blackjack - always stand
	if (isBlackjack(playerHand)) {
		return 'S';
	}

	// Check for pairs first
	if (pair) {
		const pairValue = getCardNumericValue(playerHand[0]);
		const pairAction = PAIR_STRATEGY[pairValue]?.[dealerValue];
		if (pairAction === 'P') {
			return 'P';
		}
		// If not splitting, fall through to soft/hard strategy
	}

	// Check soft hands
	if (soft && playerValue <= 20) {
		const softAction = SOFT_STRATEGY[playerValue]?.[dealerValue];
		if (softAction) {
			return softAction;
		}
	}

	// Hard totals
	const hardAction = HARD_STRATEGY[playerValue]?.[dealerValue];
	if (hardAction) {
		return hardAction;
	}

	// Default: stand on 17+, hit on less
	return playerValue >= 17 ? 'S' : 'H';
}

function evaluateAction(playerAction, playerHand, dealerUpcard) {
	const correctAction = getCorrectAction(playerHand, dealerUpcard);

	// Handle double variations
	if (correctAction === 'D') {
		// Double if possible, otherwise hit
		if (canDouble && playerAction === 'double') return true;
		if (!canDouble && playerAction === 'hit') return true;
		if (playerAction === 'hit') return true; // Hit is acceptable when double isn't available
		return false;
	}

	if (correctAction === 'Ds') {
		// Double if possible, otherwise stand
		if (canDouble && playerAction === 'double') return true;
		if (!canDouble && playerAction === 'stand') return true;
		if (playerAction === 'stand') return true; // Stand is acceptable when double isn't available
		return false;
	}

	// Map actions
	const actionMap = {
		H: 'hit',
		S: 'stand',
		P: 'split',
	};

	return actionMap[correctAction] === playerAction;
}

function getActionName(action) {
	const names = {
		H: 'Hit',
		S: 'Stand',
		D: 'Double',
		Ds: 'Double (or Stand)',
		P: 'Split',
	};
	return names[action] || action;
}

// ============================================
// UI FUNCTIONS
// ============================================

function createCardElement(card, faceDown = false) {
	const cardDiv = document.createElement('div');
	const isRed = card.suit === '♥' || card.suit === '♦';

	if (faceDown) {
		cardDiv.className = 'card face-down';
	} else {
		cardDiv.className = `card ${isRed ? 'red' : 'black'}`;
		cardDiv.innerHTML = `
            <div class="card-corner top-left">
                <span class="card-value">${card.value}</span>
                <span class="card-suit">${card.suit}</span>
            </div>
            <div class="card-center">${card.suit}</div>
            <div class="card-corner bottom-right">
                <span class="card-value">${card.value}</span>
                <span class="card-suit">${card.suit}</span>
            </div>
        `;
	}

	return cardDiv;
}

function renderDealerHand(showHoleCard = false, fullRender = true) {
	const container = document.getElementById('dealer-cards');

	if (fullRender) {
		container.innerHTML = '';
		dealerHand.forEach((card, index) => {
			const faceDown = index === 1 && !showHoleCard;
			const cardEl = createCardElement(card, faceDown);
			container.appendChild(cardEl);
		});
	} else {
		// Just update hole card if needed (flip it face up)
		if (
			showHoleCard &&
			container.children[1]?.classList.contains('face-down')
		) {
			const holeCard = dealerHand[1];
			const newCardEl = createCardElement(holeCard, false);
			newCardEl.classList.add('flipping');
			container.replaceChild(newCardEl, container.children[1]);
		}
	}

	updateDealerValue(showHoleCard);
}

function addDealerCard() {
	const container = document.getElementById('dealer-cards');
	const newCard = dealerHand[dealerHand.length - 1];
	const cardEl = createCardElement(newCard, false);
	cardEl.classList.add('new-card');
	container.appendChild(cardEl);
	updateDealerValue(true);
}

function renderPlayerHand(fullRender = true) {
	const container = document.getElementById('player-cards');

	if (fullRender) {
		container.innerHTML = '';
		playerHand.forEach((card) => {
			const cardEl = createCardElement(card);
			container.appendChild(cardEl);
		});
	}

	updatePlayerValue();
}

function addPlayerCard() {
	const container = document.getElementById('player-cards');
	const newCard = playerHand[playerHand.length - 1];
	const cardEl = createCardElement(newCard, false);
	cardEl.classList.add('new-card');
	container.appendChild(cardEl);
	updatePlayerValue();
}

function updateDealerValue(showAll = false) {
	const valueEl = document.getElementById('dealer-value');
	if (showAll) {
		const value = calculateHandValue(dealerHand);
		if (isBlackjack(dealerHand)) {
			valueEl.innerHTML = '<span class="blackjack-indicator">Blackjack!</span>';
		} else if (value > 21) {
			valueEl.innerHTML = `<span class="bust-indicator">${value} - Bust!</span>`;
		} else {
			valueEl.textContent = value;
		}
	} else {
		const upcard = dealerHand[0];
		valueEl.textContent = getCardNumericValue(upcard);
	}
}

function updatePlayerValue() {
	const valueEl = document.getElementById('player-value');
	const value = calculateHandValue(playerHand);
	const soft = isSoftHand(playerHand);

	if (isBlackjack(playerHand)) {
		valueEl.innerHTML = '<span class="blackjack-indicator">Blackjack!</span>';
	} else if (value > 21) {
		valueEl.innerHTML = `<span class="bust-indicator">${value} - Bust!</span>`;
	} else if (soft) {
		valueEl.innerHTML = `${value} <span class="soft-indicator">(soft)</span>`;
	} else {
		valueEl.textContent = value;
	}

	valueEl.classList.add('highlight');
	setTimeout(() => valueEl.classList.remove('highlight'), 300);
}

function showFeedback(type, message, detail = '') {
	const feedback = document.getElementById('feedback');
	feedback.className = `feedback ${type}`;
	feedback.innerHTML = detail
		? `${message}<div class="feedback-detail">${detail}</div>`
		: message;

	// Trigger reflow for animation
	feedback.offsetHeight;
	feedback.classList.add('show');
}

function hideFeedback() {
	const feedback = document.getElementById('feedback');
	feedback.classList.remove('show');
}

function updateButtons() {
	const hitBtn = document.getElementById('hit-btn');
	const standBtn = document.getElementById('stand-btn');
	const doubleBtn = document.getElementById('double-btn');
	const splitBtn = document.getElementById('split-btn');
	const actions = document.getElementById('actions');
	const newHandContainer = document.getElementById('new-hand-container');

	if (!gameActive) {
		actions.style.display = 'none';
		newHandContainer.classList.add('show');
		return;
	}

	actions.style.display = 'grid';
	newHandContainer.classList.remove('show');

	hitBtn.disabled = false;
	standBtn.disabled = false;
	doubleBtn.disabled = !canDouble;
	splitBtn.disabled = !canSplit;
}

function updateStats() {
	document.getElementById('correct-count').textContent = correctCount;
	document.getElementById('wrong-count').textContent = wrongCount;
}

// ============================================
// GAME FLOW
// ============================================

function startGame() {
	document.getElementById('start-screen').classList.add('hidden');
	startNewHand();
}

function startNewHand() {
	// Reset state
	playerHand = [];
	dealerHand = [];
	gameActive = true;
	canDouble = true;
	canSplit = false;

	hideFeedback();

	// Test mode: deal a multi-card hand
	if (bigHandFeatureFlag) {
		// Deal a hand with many low cards (won't bust)
		// 10 cards: A+A+A+A+2+2+2+2+3+3 = 4+8+6 = 18
		const lowCards = [
			{ suit: '♠', value: 'A' },
			{ suit: '♥', value: 'A' },
			{ suit: '♦', value: 'A' },
			{ suit: '♣', value: 'A' },
			{ suit: '♠', value: '2' },
			{ suit: '♥', value: '2' },
			{ suit: '♦', value: '2' },
			{ suit: '♣', value: '2' },
			{ suit: '♠', value: '3' },
			{ suit: '♥', value: '3' },
		];
		const dealerCards = [
			{ suit: '♣', value: '6' },
			{ suit: '♦', value: '5' },
			{ suit: '♠', value: '4' },
			{ suit: '♥', value: '3' },
			{ suit: '♦', value: '2' },
			{ suit: '♣', value: 'A' },
		];
		playerHand = lowCards.slice(0, 10); // 10 cards
		dealerHand = dealerCards.slice(0, 6); // 6 cards showing
		canDouble = false; // Can't double after initial deal
	} else if (splitFeatureFlag) {
		// Deal a splittable pair (8,8 vs dealer 6 - should split)
		playerHand = [
			{ suit: '♠', value: '8' },
			{ suit: '♥', value: '8' },
		];
		dealerHand = [
			{ suit: '♣', value: '6' },
			{ suit: '♦', value: 'K' }, // Hole card
		];
		canSplit = true;
	} else {
		// Normal deal
		playerHand.push(drawCard());
		dealerHand.push(drawCard());
		playerHand.push(drawCard());
		dealerHand.push(drawCard());
	}

	// Check for pairs
	canSplit = isPair(playerHand);

	// Render
	renderDealerHand(false);
	renderPlayerHand();
	updateButtons();

	// Check for player blackjack (skip in test mode)
	if (!bigHandFeatureFlag && isBlackjack(playerHand)) {
		setTimeout(() => {
			showFeedback('info', 'Blackjack!', 'Natural 21 - automatic win!');
			endHand(true);
		}, 500);
	}
}

function playerAction(action) {
	if (!gameActive) return;

	const dealerUpcard = dealerHand[0];
	const isCorrect = evaluateAction(action, playerHand, dealerUpcard);
	const correctAction = getCorrectAction(playerHand, dealerUpcard);

	if (isCorrect) {
		correctCount++;
		updateStats();

		if (action === 'hit') {
			handleHit();
		} else if (action === 'stand') {
			handleStand();
		} else if (action === 'double') {
			handleDouble();
		} else if (action === 'split') {
			handleSplit();
		}
	} else {
		wrongCount++;
		updateStats();

		const correctName = getActionName(correctAction);
		showFeedback(
			'wrong',
			`Incorrect!`,
			`You should ${correctName.toLowerCase()} here.`
		);
		endHand(false);
	}
}

function handleHit() {
	showFeedback('correct', 'Correct!', 'Hit is the right play.');

	// Can no longer double after hitting
	canDouble = false;
	canSplit = false;

	// Deal new card
	setTimeout(() => {
		playerHand.push(drawCard());
		addPlayerCard();
		updateButtons();
		hideFeedback();

		const value = calculateHandValue(playerHand);

		if (value > 21) {
			showFeedback('info', 'Bust!', 'You went over 21.');
			endHand(true);
		} else if (value === 21) {
			showFeedback('correct', '21!', 'Standing automatically.');
			setTimeout(() => handleStand(), 800);
		}
	}, 600);
}

function handleStand() {
	showFeedback('correct', 'Correct!', 'Stand is the right play.');

	setTimeout(() => {
		playDealerHand();
	}, 800);
}

function handleDouble() {
	showFeedback('correct', 'Correct!', 'Double is the right play.');

	canDouble = false;
	canSplit = false;

	// Deal one card and stand
	setTimeout(() => {
		playerHand.push(drawCard());
		addPlayerCard();

		const value = calculateHandValue(playerHand);

		if (value > 21) {
			showFeedback('info', 'Bust!', 'You went over 21 on the double.');
			endHand(true);
		} else {
			setTimeout(() => playDealerHand(), 600);
		}
	}, 600);
}

function handleSplit() {
	showFeedback('correct', 'Correct!', 'Split is the right play.');

	// For simplicity, we'll just acknowledge the split is correct
	// and deal a new hand (full split implementation would be complex)
	setTimeout(() => {
		showFeedback('info', 'Nice!', 'Split acknowledged. Starting fresh hand.');
		setTimeout(() => startNewHand(), 1200);
	}, 800);
}

function playDealerHand() {
	gameActive = false;

	// First, reveal the hole card with flip animation
	renderDealerHand(true, false);

	// Dealer hits on soft 17 and below
	const dealerPlay = () => {
		const value = calculateHandValue(dealerHand);
		const soft = isSoftHand(dealerHand);

		if (value < 17 || (value === 17 && soft)) {
			setTimeout(() => {
				dealerHand.push(drawCard());
				addDealerCard();
				dealerPlay();
			}, 500);
		} else {
			// Dealer done
			setTimeout(() => {
				showResult();
			}, 400);
		}
	};

	setTimeout(dealerPlay, 500);
}

function showResult() {
	const playerValue = calculateHandValue(playerHand);
	const dealerValue = calculateHandValue(dealerHand);

	let message = '';
	let detail = '';

	if (playerValue > 21) {
		message = 'Bust';
		detail = 'You went over 21.';
	} else if (dealerValue > 21) {
		message = 'Dealer Busts!';
		detail = `Dealer had ${dealerValue}. You win!`;
	} else if (playerValue > dealerValue) {
		message = 'You Win!';
		detail = `${playerValue} beats ${dealerValue}`;
	} else if (playerValue < dealerValue) {
		message = 'Dealer Wins';
		detail = `${dealerValue} beats ${playerValue}`;
	} else {
		message = 'Push';
		detail = `Both have ${playerValue}`;
	}

	showFeedback('info', message, detail);
	endHand(true);
}

function endHand(wasCorrect) {
	gameActive = false;
	// Just flip the hole card, don't re-render all cards
	renderDealerHand(true, false);
	updateButtons();
}

// ============================================
// SETTINGS & CHART
// ============================================

function toggleSettings() {
	const dropdown = document.getElementById('settings-dropdown');
	dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
	const container = document.querySelector('.settings-container');
	const dropdown = document.getElementById('settings-dropdown');
	if (container && !container.contains(e.target)) {
		dropdown.classList.remove('show');
	}
});

function resetScore() {
	correctCount = 0;
	wrongCount = 0;
	updateStats();
	saveStats();

	// Close dropdown
	document.getElementById('settings-dropdown').classList.remove('show');

	// Show brief feedback
	showFeedback('info', 'Score Reset!', 'Starting fresh.');
	setTimeout(hideFeedback, 1500);
}

function openStrategyChart() {
	// Close dropdown
	document.getElementById('settings-dropdown').classList.remove('show');

	// Generate and show chart
	generateChartHTML();
	document.getElementById('chart-modal').classList.add('show');
}

function closeStrategyChart() {
	document.getElementById('chart-modal').classList.remove('show');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
	const modal = document.getElementById('chart-modal');
	if (e.target === modal) {
		closeStrategyChart();
	}
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		closeStrategyChart();
		document.getElementById('settings-dropdown').classList.remove('show');
	}
});

function generateChartHTML() {
	const container = document.getElementById('chart-container');
	const dealerCards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

	// Helper to get cell class
	const getCellClass = (action) => {
		if (action === 'H') return 'hit';
		if (action === 'S') return 'stand';
		if (action === 'D' || action === 'Ds') return 'double';
		if (action === 'P') return 'split';
		return '';
	};

	// Helper to format action
	const formatAction = (action) => {
		if (action === 'Ds') return 'D*';
		return action;
	};

	let html = '';

	// HARD TOTALS
	html += '<div class="chart-section">';
	html += '<div class="chart-title">Hard Totals</div>';
	html += '<table class="strategy-table"><thead><tr><th></th>';
	dealerCards.forEach((card) => {
		html += `<th>${card}</th>`;
	});
	html += '</tr></thead><tbody>';

	// Hard totals from 8 to 17 (most relevant)
	for (let total = 8; total <= 17; total++) {
		html += `<tr><td class="row-header">${total}</td>`;
		dealerCards.forEach((card) => {
			const dealerVal = card === 'A' ? 11 : parseInt(card);
			const action = HARD_STRATEGY[total]?.[dealerVal] || 'H';
			html += `<td class="${getCellClass(action)}">${formatAction(
				action
			)}</td>`;
		});
		html += '</tr>';
	}
	html += '</tbody></table></div>';

	// SOFT TOTALS
	html += '<div class="chart-section">';
	html += '<div class="chart-title">Soft Totals (Ace counted as 11)</div>';
	html += '<table class="strategy-table"><thead><tr><th></th>';
	dealerCards.forEach((card) => {
		html += `<th>${card}</th>`;
	});
	html += '</tr></thead><tbody>';

	// Soft totals from A,2 (13) to A,9 (20)
	const softLabels = ['A,2', 'A,3', 'A,4', 'A,5', 'A,6', 'A,7', 'A,8', 'A,9'];
	for (let i = 0; i < softLabels.length; i++) {
		const total = 13 + i;
		html += `<tr><td class="row-header">${softLabels[i]}</td>`;
		dealerCards.forEach((card) => {
			const dealerVal = card === 'A' ? 11 : parseInt(card);
			const action = SOFT_STRATEGY[total]?.[dealerVal] || 'S';
			html += `<td class="${getCellClass(action)}">${formatAction(
				action
			)}</td>`;
		});
		html += '</tr>';
	}
	html += '</tbody></table></div>';

	// PAIRS
	html += '<div class="chart-section">';
	html += '<div class="chart-title">Pairs</div>';
	html += '<table class="strategy-table"><thead><tr><th></th>';
	dealerCards.forEach((card) => {
		html += `<th>${card}</th>`;
	});
	html += '</tr></thead><tbody>';

	// Pairs
	const pairLabels = [
		'2,2',
		'3,3',
		'4,4',
		'5,5',
		'6,6',
		'7,7',
		'8,8',
		'9,9',
		'10,10',
		'A,A',
	];
	const pairValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
	for (let i = 0; i < pairLabels.length; i++) {
		const pairVal = pairValues[i];
		html += `<tr><td class="row-header">${pairLabels[i]}</td>`;
		dealerCards.forEach((card) => {
			const dealerVal = card === 'A' ? 11 : parseInt(card);
			const action = PAIR_STRATEGY[pairVal]?.[dealerVal] || 'S';
			html += `<td class="${getCellClass(action)}">${formatAction(
				action
			)}</td>`;
		});
		html += '</tr>';
	}
	html += '</tbody></table></div>';

	// Add footnote
	html +=
		'<div style="text-align: center; font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top: 12px;">D* = Double if allowed, otherwise Stand</div>';

	container.innerHTML = html;
}

// ============================================
// INITIALIZATION
// ============================================

// Create initial deck
deck = createDeck();

// Save stats to localStorage
function saveStats() {
	localStorage.setItem('blackjack-correct', correctCount);
	localStorage.setItem('blackjack-wrong', wrongCount);
}

function loadStats() {
	const saved = localStorage.getItem('blackjack-correct');
	const savedWrong = localStorage.getItem('blackjack-wrong');
	if (saved !== null) correctCount = parseInt(saved);
	if (savedWrong !== null) wrongCount = parseInt(savedWrong);
	updateStats();
}

// Auto-save stats
setInterval(saveStats, 5000);

// Load stats on page load
loadStats();

// Handle visibility change to save stats
document.addEventListener('visibilitychange', () => {
	if (document.hidden) saveStats();
});
