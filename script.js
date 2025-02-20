// Game state
let runs = 0;
let wickets = 0;
let balls = 0;
let oversLimit = 5;
let battingTeam = "";
let bowlingTeam = "";
let currentBatsmanIdx = 0;
let currentBowlerIdx = 0;

// Team players (simplified)
const teams = {
    "India": ["Virat Kohli", "Rohit Sharma", "KL Rahul", "Suryakumar Yadav", "Hardik Pandya", "Rishabh Pant", "Jasprit Bumrah", "Mohammed Shami", "Ravindra Jadeja", "Yuzvendra Chahal", "Ishan Kishan"],
    "Australia": ["Steve Smith", "David Warner", "Marnus Labuschagne", "Pat Cummins", "Mitchell Starc", "Josh Hazlewood", "Glenn Maxwell", "Aaron Finch", "Travis Head", "Adam Zampa", "Cameron Green"],
    "England": ["Joe Root", "Ben Stokes", "Jos Buttler", "Jonny Bairstow", "Jason Roy", "Mark Wood", "Jofra Archer", "Sam Curran", "Chris Woakes", "Adil Rashid", "Eoin Morgan"],
    "Pakistan": ["Babar Azam", "Mohammad Rizwan", "Shaheen Afridi", "Hasan Ali", "Fakhar Zaman", "Imam-ul-Haq", "Shadab Khan", "Haris Rauf", "Asif Ali", "Mohammad Nawaz", "Iftikhar Ahmed"],
    "South Africa": ["Quinton de Kock", "Temba Bavuma", "Aiden Markram", "David Miller", "Kagiso Rabada", "Anrich Nortje", "Lungi Ngidi", "Rassie van der Dussen", "Keshav Maharaj", "Heinrich Klaasen", "Tabraiz Shamsi"],
    "New Zealand": ["Kane Williamson", "Devon Conway", "Tom Latham", "Trent Boult", "Tim Southee", "Kyle Jamieson", "Daryl Mitchell", "Glenn Phillips", "Mitchell Santner", "Ish Sodhi", "Martin Guptill"],
    "West Indies": ["Kieron Pollard", "Nicholas Pooran", "Jason Holder", "Andre Russell", "Shimron Hetmyer", "Dwayne Bravo", "Oshane Thomas", "Akeal Hosein", "Evin Lewis", "Chris Gayle", "Fabian Allen"],
    "Sri Lanka": ["Dasun Shanaka", "Kusal Mendis", "Pathum Nissanka", "Dhananjaya de Silva", "Wanindu Hasaranga", "Dushmantha Chameera", "Maheesh Theekshana", "Charith Asalanka", "Bhanuka Rajapaksa", "Lahiru Kumara", "Chamika Karunaratne"]
};

// Commentary lines
const commentary = {
    run: ["What a shot!", "Beautifully played!", "That’s a boundary!", "Six runs, magnificent!", "Good running!"],
    wicket: ["Bowled him!", "Caught behind!", "He’s out!", "What a delivery!", "That’s the end of him!"],
    dot: ["Good ball!", "No run there.", "Tight bowling.", "Well defended.", "Keeps it out."]
};

// Start the game
function startGame() {
    battingTeam = document.getElementById("batting-team").value;
    bowlingTeam = document.getElementById("bowling-team").value;
    oversLimit = parseInt(document.getElementById("overs-limit").value);

    if (battingTeam === bowlingTeam) {
        alert("Please select different teams!");
        return;
    }

    document.getElementById("team-selection").style.display = "none";
    document.getElementById("game-area").style.display = "block";
    document.getElementById("match-title").innerText = `${battingTeam} vs ${bowlingTeam}`;
    document.getElementById("max-overs").innerText = oversLimit;
    updateDisplay();
}

// Play a shot
function playShot(shot) {
    let outcomes;
    if (shot === "Defend") outcomes = [0, 1, "Wicket"]; // Safer
    else if (shot === "Drive") outcomes = [0, 1, 2, 4, "Wicket"];
    else if (shot === "Loft") outcomes = [0, 4, 6, "Wicket", "Wicket"]; // Riskier
    else if (shot === "Sweep") outcomes = [0, 2, 4, 6, "Wicket"];

    let result = outcomes[Math.floor(Math.random() * outcomes.length)];
    balls++;

    if (result === "Wicket") {
        wickets++;
        playSound("wicket");
        setCommentary("wicket");
        currentBatsmanIdx = Math.min(currentBatsmanIdx + 1, 10);
    } else {
        runs += result;
        playSound("cheer");
        setCommentary(result === 0 ? "dot" : "run");
    }

    if (balls % 6 === 0) {
        currentBowlerIdx = (currentBowlerIdx + 1) % 11; // Rotate bowler
    }

    updateDisplay();
    checkInningsEnd();
}

// Update display
function updateDisplay() {
    let overs = Math.floor(balls / 6) + (balls % 6) / 10;
    document.getElementById("score").innerText = `${runs}/${wickets}`;
    document.getElementById("overs").innerText = overs.toFixed(1);
    document.getElementById("batsman").innerText = teams[battingTeam][currentBatsmanIdx];
    document.getElementById("bowler").innerText = teams[bowlingTeam][currentBowlerIdx];
}

// Play sound
function playSound(type) {
    let sound = document.getElementById(type + "-sound");
    sound.currentTime = 0;
    sound.play().catch(() => console.log("Audio not found, please add " + type + ".mp3"));
}

// Set commentary
function setCommentary(type) {
    let options = commentary[type];
    document.getElementById("commentary").innerText = options[Math.floor(Math.random() * options.length)];
}

// Check if innings should end
function checkInningsEnd() {
    let overs = Math.floor(balls / 6) + (balls % 6) / 10;
    if (wickets >= 10 || overs >= oversLimit) {
        document.getElementById("end-innings-btn").style.display = "block";
        document.querySelectorAll(".shot-buttons button").forEach(btn => btn.disabled = true);
    }
}

// End innings and show result
function endInnings() {
    document.getElementById("game-area").style.display = "none";
    document.getElementById("result-area").style.display = "block";
    document.getElementById("result-text").innerText = `${battingTeam} scored ${runs}/${wickets} in ${Math.floor(balls / 6) + (balls % 6) / 10} overs.`;
}

// Reset game
function resetGame() {
    runs = 0;
    wickets = 0;
    balls = 0;
    currentBatsmanIdx = 0;
    currentBowlerIdx = 0;
    document.getElementById("result-area").style.display = "none";
    document.getElementById("team-selection").style.display = "block";
    document.querySelectorAll(".shot-buttons button").forEach(btn => btn.disabled = false);
    document.getElementById("end-innings-btn").style.display = "none";
}