const API_BASE = 'https://deckofcardsapi.com/api/deck';
const CARD_BACK = 'https://deckofcardsapi.com/static/img/back.png';
const SHOE_DECKS = 6;
const shoeRemaining = document.querySelector('#shoe-remaining');
const dealerCards   = document.querySelector('#dealer-cards');
const playerCards   = document.querySelector('#player-cards');
const dealerTotal   = document.querySelector('#dealer-total');
const playerTotal   = document.querySelector('#player-total');
const statusText    = document.querySelector('#status-text');
const newShoebutton  = document.querySelector('#new-shoe-button');
const dealbutton     = document.querySelector('#deal-button');
const hitbutton      = document.querySelector('#hit-button');
const standbutton    = document.querySelector('#stand-button');
const newHandbutton  = document.querySelector('#new-hand-button');

let deckId = null;
let remaining = 0;
let playerHand = [];
let dealerHand = [];
let roundOver = false;
let dealerHidden = false;

async function createShoe() {
  const url = `${API_BASE}/new/shuffle/?deck_count=${SHOE_DECKS}`;
  const res = await fetch(url);
  const data = await res.json();
  deckId = data.deck_id;
  localStorage.setItem('deckId', deckId);
  remaining = data.remaining;
  updateRemaining();
}

async function draw(count = 1) {
  const url = `${API_BASE}/${deckId}/draw/?count=${count}`;
  const res = await fetch(url);
  const data = await res.json();
  remaining = data.remaining;
  updateRemaining();
  return data.cards;
}

function cardNumericValue(card) { 
  const value = card.value.toString().toUpperCase();
  if (value === 'ACE') return 11;
  if (value === 'KING' || value === 'QUEEN' || value === 'JACK') return 10;
  return parseInt(value);
}

function bestHandTotal(hand) {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    const v = cardNumericValue(c);
    total += v;
    if (c.value === 'ACE') aces++;
  }
  //Check bust Aces 11->1
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}


function updateTotals(showDealer = false) {
  playerTotal.textContent = bestHandTotal(playerHand);
  dealerTotal.textContent = showDealer ? bestHandTotal(dealerHand) : dealerHand.length ? cardNumericValue(dealerHand[1]) : '—';
}

function updateRemaining() {
  shoeRemaining.textContent = `Remaining: ${remaining}`;
}


function renderHands() {
  dealerCards.innerHTML = '';
  dealerHand.forEach((card, index) => {
    const img = document.createElement('img');
    if (index === 0 && dealerHidden) {
      img.src = CARD_BACK;
      img.alt = 'Hidden card';
      img.title = 'Hidden';
    } else {
      img.src = card.image;
      img.alt = `${card.value} of ${card.suit}`;
      img.title = `${card.value} of ${card.suit}`;
    }
    dealerCards.appendChild(img);
  });

  playerCards.innerHTML = '';
  playerHand.forEach(card => {
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = `${card.value} of ${card.suit}`;
    img.title = `${card.value} of ${card.suit}`;
    playerCards.appendChild(img);
  });
}

function setButtons({ canDeal, canHit, canStand, canNewHand, canNewShoe }) {
  dealbutton.disabled = !canDeal;
  hitbutton.disabled = !canHit;
  standbutton.disabled = !canStand;
  newHandbutton.disabled = !canNewHand;
  newShoebutton.disabled = !canNewShoe;
}

function setStatus(message) {
  statusText.textContent = message;
}

async function startRound() {
  roundOver = false;
  playerHand = [];
  dealerHand = [];
  dealerHidden = false;
  setStatus('Dealing…');

 
  const [p1, d1, p2, d2] = await draw(4);
  playerHand.push(p1);
  dealerHidden = true;
  dealerHand.push(d1);
  playerHand.push(p2);
  dealerHand.push(d2);

  renderHands();
  updateTotals(false);

  const pTotal = bestHandTotal(playerHand);
  const dTotal = bestHandTotal([dealerHand[1]]);

  if (pTotal === 21 || dTotal === 21) {
    // Reveal immediately if natural
    await dealerRevealAndResolve(true);
    return;
  }

  setStatus('Your turn: Hit or Stand.');
  setButtons({ canDeal: true, canHit: true, canStand: true, canNewHand: false, canNewShoe: true });
}

async function playerHit() {
  if (roundOver) return;
  const [card] = await draw(1);
  playerHand.push(card);
  renderHands();
  updateTotals(false);

  const total = bestHandTotal(playerHand);
  if (total > 21) {
    await dealerRevealAndResolve(false);
  }
}

async function playerStand() {
  if (roundOver) return;
  await dealerRevealAndResolve(false);
}

async function dealerRevealAndResolve(naturalCheck) {
  dealerHidden = false;
  renderHands();
  updateTotals(true);

  while (true) {
    const total = bestHandTotal(dealerHand);
    const shouldHit = total < 17 ;
    if (!shouldHit){ break;}
    const [card] = await draw(1);
    dealerHand.push(card);
    renderHands();
    updateTotals(true);
  }

  const p = bestHandTotal(playerHand);
  const d = bestHandTotal(dealerHand);

  let message = '';
  if (naturalCheck && p === 21 && d === 21) {
    message = 'Push! Both have Blackjack.';
  } else if (naturalCheck && p === 21) {
    message = 'Blackjack! You win !!';
  } else if (naturalCheck && d === 21) {
    message = 'Dealer has Blackjack. You lose.';
  } else if (p > 21) {
    message = 'Bust! You lose.';
  } else if (d > 21) {
    message = 'Dealer busts. You win !!';
  } else if (p > d) {
    message = 'You win !!';
  } else if (p < d) {
    message = 'You lose.';
  } else {
    message = 'Push.';
  }

  setStatus(message);
  roundOver = true;
  setButtons({ canDeal: false, canHit: false, canStand: false, canNewHand: true, canNewShoe: true });
}

newShoebutton.addEventListener('click', async () => {
  setStatus('Creating new 6‑deck shoe…');
  await createShoe();
  setButtons({ canDeal: true, canHit: false, canStand: false, canNewHand: false, canNewShoe: true });
  dealerCardsEl.innerHTML = '';
  playerCardsEl.innerHTML = '';
  dealerTotalEl.textContent = '—';
  playerTotalEl.textContent = '—';
});

dealbutton.addEventListener('click', startRound);
hitbutton.addEventListener('click', playerHit);
standbutton.addEventListener('click', playerStand);
newHandbutton.addEventListener('click', startRound);

async function main() {
    await createShoe();
    setStatus('Shoe ready. Click Deal to start.');
    setButtons({ canDeal: true, canHit: false, canStand: false, canNewHand: false, canNewShoe: true });
}

window.addEventListener('load', main);