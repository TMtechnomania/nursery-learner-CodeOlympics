const questions = [
{ question: "What does HTML stand for?", options: ["HyperText Markup Language", "High-Level Text Machine Language", "Hyperlinks and Text Markup", "Home Tool Markup Language"], answer: 0 },
{ question: "Which property is used to change the background color in CSS?", options: ["color", "bgcolor", "background-color", "background"], answer: 2 },
{ question: "What is the correct syntax for a JavaScript arrow function?", options: ["function = () => {}", "const func = () => {}", "const func = function() {}", "() => {} = func"], answer: 1 },
{ question: "Which of these is NOT a JavaScript data type?", options: ["String", "Boolean", "Alert", "Number"], answer: 2 },
{ question: "What does 'DOM' stand for?", options: ["Document Object Model", "Data Object Model", "Desktop Oriented-Model", "Document Order Model"], answer: 0 },
{ question: "How do you select an element with id 'demo' in CSS?", options: [".demo", "demo", "#demo", "*demo"], answer: 2 },
{ question: "Which HTML tag is used to create a hyperlink?", options: ["<link>", "<href>", "<a>", "<hyper>"], answer: 2 },
{ question: "Which tag defines an ordered list?", options: ["<ul>", "<ol>", "<li>", "<list>"], answer: 1 },
{ question: "How do you make text bold in CSS?", options: ["font-weight: bold;", "text-style: bold;", "bold: true;", "font: bold;"], answer: 0 },
{ question: "What are the 4 parts of the CSS Box Model, in order from inside out?", options: ["Margin, Border, Padding, Content", "Content, Padding, Border, Margin", "Content, Margin, Padding, Border", "Padding, Content, Border, Margin"], answer: 1 },
{ question: "How do you declare a JavaScript variable that cannot be reassigned?", options: ["let", "var", "const", "static"], answer: 2 },
{ question: "Which method adds a new element to the end of an array?", options: [".add()", ".push()", ".append()", ".end()"], answer: 1 },
{ question: "What does the `===` operator check for in JavaScript?", options: ["Value only", "Type only", "Value and Type", "Assignment"], answer: 2 },
{ question: "What does HTTP stand for?", options: ["Hypertext Transfer Protocol", "Hyperlink Text Transfer", "Home-Text Transfer Protocol", "Hypertext Test Protocol"], answer: 0 },
{ question: "What does a 404 error mean?", options: ["Server Error", "File Not Found", "Access Denied", "OK"], answer: 1 },
];
const facts = [
"The first computer programmer was Ada Lovelace, an English mathematician.",
"The first computer mouse was invented by Douglas Engelbart in 1964 and was made of wood.",
"The first 1GB hard drive was announced in 1980, weighed 550 pounds, and cost $40,000.",
"The programming language 'Python' was named after the British comedy group 'Monty Python'.",
"JavaScript was created in just 10 days by Brendan Eich at Netscape.",
"The first computer 'bug' was a literal moth found trapped in a relay of the Harvard Mark II computer.",
"The world's first website (info.cern.ch) is still online today.",
"The QWERTY keyboard layout was designed to slow typists down to prevent typewriter jams.",
"Google's original name was 'Backrub', based on its analysis of 'backlinks'.",
"The average smartphone has more computing power than the Apollo 11 lunar module.",
"The 'img' tag in HTML was first proposed in 1993 by Marc Andreessen.",
"The term 'Wi-Fi' doesn't actually stand for anything. It was a marketing term created to sound like 'Hi-Fi'.",
"It is estimated that 90% of the world's data was created in the last two years alone.",
"In 1936, Russian scientists built a computer that ran on water, called a 'Water Integrator'.",
"The 'Alt' key on your keyboard stands for 'Alternate'.",
"Amazon was originally called 'Cadabra', as in 'abracadabra'."
];
const deck = document.getElementById("deck"),
landing = document.getElementById("landing"),
startButton = document.querySelector("#landing .btn"),
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
function startQuiz() {
landing.style.display = "none";
deck.style.display = "block";
backButton.style.display = "block";
deck.innerHTML = "";
set = shuffle([...questions]).slice(0, 5);
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
<h3>💡 Fun Coding Fact</h3>
<div class="meta" style="font-size: 1rem; margin-top: 1rem;">
${facts[Math.floor(Math.random() * facts.length)]}
</div>
<button class="btn" onclick="resetGame()">Play Again</button>`;
deck.append(r);
deck.append(f);
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
startButton.addEventListener("click", startQuiz);
backButton.addEventListener("click", resetGame);