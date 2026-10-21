const board = document.querySelector('.memory-board');
const flipsDisplay = document.getElementById('flips');
const restartBtn = document.getElementById('restart-btn');

const emojis = ['🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐯', '🐰'];
let cards = [...emojis, ...emojis];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let flipCount = 0;
let matchesFound = 0;
let mismatchTimeout;

function initGame() {
    clearTimeout(mismatchTimeout);
    mismatchTimeout = undefined;
    resetBoard();
    board.innerHTML = '';
    flipCount = 0;
    matchesFound = 0;
    flipsDisplay.textContent = flipCount;


    cards.sort(() => Math.random() - 0.5); // Shuffle the cards

    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

    card.innerHTML = `
        <div class="card-face card-front">?</div>
        <div class="card-face card-back">${emoji}</div>
    `;

      card.addEventListener('click', flipCard);
    board.appendChild(card);
});
}


function flipCard() {
    if (lockBoard) return; //Ignore clicks when the board is locked
    if (this === firstCard) return; // Ignore if the same card is clicked twice

    this.classList.add('flip'); //Triggers CSS animation to flip the card 3D rotation

    if (!hasFlippedCard) {
        // First card flipped
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second card flipped
    secondCard = this;
    flipCount++;
    flipsDisplay.textContent = flipCount;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchesFound++;
    resetBoard();

    //check if all matches are found
    if (matchesFound === emojis.length) {
        setTimeout(() => {
            alert(`Congratulations! You found all matches in ${flipCount} flips!`);
            initGame();
        }, 400);
    }
}

function unflipCards() {
    lockBoard = true; // Lock the board to prevent further clicks while cards are being unflipped
    const first = firstCard;
    const second = secondCard;
    mismatchTimeout = setTimeout(() => {
        first.classList.remove('flip');
        second.classList.remove('flip');
        mismatchTimeout = undefined;
        resetBoard();
    }, 1000); // Wait for 1 second before flipping the cards back
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Restart button functionality
restartBtn.addEventListener('click', initGame);
initGame(); // Initialize the game when the page loads