const deck = document.getElementById("deck"),
landing = document.getElementById("landing"),
backButton = document.getElementById("back");
let set = [],
i = 0,
score = 0,
done = false,
currentTimer = null,
timeLeft = 12;
function shuffle(a) {
for (let j = a.length - 1; j > 0; j--) {
const r = Math.floor(Math.random() * (j + 1));
[a[j], a[r]] = [a[r], a[j]];
}
return a;
}
function decode(str) {
const txt = document.createElement("textarea");
txt.innerHTML = str;
return txt.value;
}
async function fetchQuestions(cat) {
let url = `https://opentdb.com/api.php?amount=5&type=multiple`;
if (cat > 0) {
url += `&category=${cat}`;
}
try {
const res = await fetch(url);
const data = await res.json();
return data.results.map((q) => {
const options = [...q.incorrect_answers.map(decode)];
const answer = Math.floor(Math.random() * 4);
options.splice(answer, 0, decode(q.correct_answer));
return {
question: decode(q.question),
options: options,
answer: answer,
};
});
} catch (err) {
return null;
}
}
async function startQuiz(cat = 0) {
landing.style.display = "none";
set = await fetchQuestions(cat);
if (!set || set.length === 0) {
alert("Error fetching questions. Please try again.");
resetGame();
return;
}
deck.style.display = "block";
backButton.style.display = "block";
deck.innerHTML = "";
i = 0;
score = 0;
done = false;
stopTimer();
for (let k = 0; k < 3; k++) appendCard();
arrange();
}
function appendCard() {
if (i >= set.length && !done) {
appendResultFact();
done = true;
return;
}
if (i >= set.length) return;
const q = set[i++];
const c = document.createElement("div");
c.className = "card";
c.innerHTML = `
<div> <div class="timer">
<div class="timer-slider"></div>
<div class="timer-text">12</div>
</div>
<h3>${q.question}</h3>
</div>
<div> <div class="options"></div>
<div class="meta">Question ${i} of ${set.length}</div>
</div>`;
q.options.forEach((o, n) => {
const b = document.createElement("button");
b.className = "option-btn";
b.textContent = o;
b.onclick = (e) => checkAns(e, q.answer, c, n);
c.querySelector(".options").appendChild(b);
});
deck.appendChild(c);
}
function checkAns(e, ans, card, n) {
if (!card.classList.contains("pos-top")) return;
stopTimer();
const btns = card.querySelectorAll(".option-btn");
btns.forEach((b) => {
b.disabled = true;
});
const slider = card.querySelector(".timer-slider");
if (slider) {
slider.style.transition = "none";
slider.style.opacity = "0.4";
}
btns.forEach((b, ix) => {
if (ix === ans) b.classList.add("correct");
if (ix === n && n !== ans) b.classList.add("wrong");
});
if (n === ans) score++;
setTimeout(() => {
card.classList.add("fly-up");
card.addEventListener(
"transitionend",
() => {
card.remove();
appendCard();
arrange();
},
{ once: true }
);
}, 300);
}
function appendResultFact() {
const r = document.createElement("div");
r.className = "card";
r.id = "scoreCard";
r.innerHTML = `
<div id="close" onclick="dismissCard(this)">×</div>
<h3>Your Score</h3>
<div class="score-display">
<span class="score-number" id="scoreNum"></span>
<span class="score-percent" id="scorePerc"></span>
<div class="score-message" id="scoreMsg"></div>
</div>
<button class="btn" onclick="dismissCard(this)">Next</button>`;
const f = document.createElement("div");
f.className = "card";
f.innerHTML = `
<div id="close" onclick="resetGame()">×</div>
<h3>💡 Coding Quote</h3>
<div class="meta" style="font-size: 1rem; margin-top: 1rem;">
Loading...
</div>
<button class="btn" onclick="resetGame()">Play Again</button>`;
deck.append(r);
deck.append(f);
loadDynamicFact(f);
}
function loadDynamicFact(card) {
const meta = card.querySelector(".meta");
fetch("https://api.quotable.io/random?tags=technology,programming")
.then((res) => res.json())
.then((data) => {
meta.innerHTML = `"${data.content}"<br><br><em>- ${data.author}</em>`;
})
.catch(() => {
meta.textContent = "The first computer 'bug' was a literal moth found trapped in a relay of the Harvard Mark II computer.";
});
}
function dismissCard(el) {
const card = el.closest(".card");
if (!card || !card.classList.contains("pos-top")) return;
stopTimer();
card.classList.add("fly-up");
card.addEventListener(
"transitionend",
() => {
card.remove();
arrange();
},
{ once: true }
);
}
function arrange() {
stopTimer();
const cards = [...deck.querySelectorAll(".card")];
cards.forEach((c) =>
c.classList.remove("pos-top", "pos-mid", "pos-bottom")
);
if (cards[0]) {
cards[0].classList.add("pos-top");
if (cards[0].id === "scoreCard") {
const perc = Math.round((score / set.length) * 100);
let message =
perc === 100
? "Perfect Score! 🤩"
: perc >= 75
? "Great job! 🔥"
: perc >= 50
? "Nice try! 👍"
: "Good effort!";
document.getElementById("scoreNum").textContent = `${score} / ${set.length}`;
document.getElementById("scorePerc").textContent = `(${perc}%)`;
document.getElementById("scoreMsg").textContent = message;
} else if (cards[0].querySelector(".timer")) {
startTimer(cards[0]);
}
}
if (cards[1]) cards[1].classList.add("pos-mid");
if (cards[2]) cards[2].classList.add("pos-bottom");
}
function resetGame() {
deck.style.display = "none";
landing.style.display = "block";
backButton.style.display = "none";
stopTimer();
}
function startTimer(card) {
timeLeft = 12;
const slider = card.querySelector(".timer-slider");
const text = card.querySelector(".timer-text");
if (!slider || !text) return;
slider.style.transition = "none";
slider.style.transform = "scaleX(1)";
void slider.offsetWidth;
slider.style.transition = "transform 12s linear";
slider.style.transform = "scaleX(0)";
text.textContent = timeLeft;
currentTimer = setInterval(() => {
timeLeft--;
text.textContent = timeLeft;
if (timeLeft <= 0) {
handleTimeOut(card);
}
}, 1000);
}
function stopTimer() {
clearInterval(currentTimer);
currentTimer = null;
}
function handleTimeOut(card) {
stopTimer();
if (!card.classList.contains("pos-top")) return;
const btns = card.querySelectorAll(".option-btn");
const cardIndex = i - deck.querySelectorAll(".card").length;
if (set[cardIndex]) {
const q = set[cardIndex];
btns.forEach((b, ix) => {
b.disabled = true;
if (ix === q.answer) b.classList.add("correct");
});
}
setTimeout(() => {
card.classList.add("fly-up");
card.addEventListener(
"transitionend",
() => {
card.remove();
appendCard();
arrange();
},
{ once: true }
);
}, 300);
}
backButton.addEventListener("click", resetGame);