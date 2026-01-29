let cuteness = 0;
let perSecond = 0;
let prestige = 0;
let clickPower = 1;

const upgrades = [
  {
    name: "Blush Generator",
    baseCost: 15,
    cps: 1,
    owned: 0,
    desc: "Produces passive cuteness.",
  },
  {
    name: "Outfit Stylist",
    baseCost: 60,
    cps: 5,
    owned: 0,
    desc: "Improves passive output.",
  },
  {
    name: "Catboy Assistant",
    baseCost: 220,
    cps: 15,
    owned: 0,
    desc: "Handles background production.",
  },
  {
    name: "Fashion Sponsor",
    baseCost: 900,
    cps: 45,
    owned: 0,
    desc: "Boosts brand influence.",
  },
  {
    name: "Aura Core",
    baseCost: 4000,
    cps: 150,
    owned: 0,
    desc: "High-tier production engine.",
  },
];

const achievements = [
  { name: "First Click", requirement: 1, unlocked: false },
  { name: "Getting Started", requirement: 100, unlocked: false },
  { name: "Dedicated Clicker", requirement: 1000, unlocked: false },
  { name: "Serious Grinder", requirement: 10000, unlocked: false },
  { name: "Endgame Energy", requirement: 100000, unlocked: false },
];

const scoreUI = document.getElementById("score");
const perSecondUI = document.getElementById("perSecond");
const shopUI = document.getElementById("shop");
const achievementsUI = document.getElementById("achievements");
const bigButton = document.getElementById("bigButton");
const goldenClick = document.getElementById("goldenClick");

// Main click
bigButton.addEventListener("click", () => {
  cuteness += clickPower * (1 + prestige * 0.2);
});

// Prestige
document.getElementById("prestigeButton").addEventListener("click", () => {
  if (cuteness >= 5000) {
    prestige++;
    cuteness = 0;
    perSecond = 0;
    upgrades.forEach((u) => (u.owned = 0));
    buildShop();
    saveGame();
  }
});

// Shop builder
function buildShop() {
  shopUI.innerHTML = "";

  upgrades.forEach((upgrade, index) => {
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.35, upgrade.owned));

    const row = document.createElement("div");
    row.className = "shop-item";

    const label = document.createElement("span");
    label.textContent = `${upgrade.name} (+${upgrade.cps} / sec)`;

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = upgrade.desc;

    const button = document.createElement("button");
    button.textContent = `Buy (${cost})`;

    button.onclick = () => {
      if (cuteness >= cost) {
        cuteness -= cost;
        upgrade.owned++;
        perSecond += upgrade.cps;
        buildShop();
        saveGame();
      }
    };

    row.appendChild(label);
    row.appendChild(button);
    row.appendChild(tooltip);
    shopUI.appendChild(row);
  });
}



// Golden click event
function spawnGoldenClick() {
  // pick random position inside viewport
  const padding = 50; // so it doesn’t go off-screen
  const maxX = window.innerWidth - goldenClick.offsetWidth - padding;
  const maxY = window.innerHeight - goldenClick.offsetHeight - padding;

  const randomX = Math.floor(Math.random() * maxX) + padding / 2;
  const randomY = Math.floor(Math.random() * maxY) + padding / 2;

  goldenClick.style.left = randomX + "px";
  goldenClick.style.top = randomY + "px";
  goldenClick.style.position = "absolute";
  goldenClick.hidden = false;

  // click event
  goldenClick.onclick = () => {
    cuteness += perSecond * 20 + 100; // reward
    goldenClick.hidden = true;
  };

  // hide after 5 seconds if not clicked
  setTimeout(() => {
    goldenClick.hidden = true;
  }, 10000);
}

// Achievements
function checkAchievements() {
  achievements.forEach((a) => {
    if (!a.unlocked && cuteness >= a.requirement) {
      a.unlocked = true;
    }
  });

  achievementsUI.innerHTML = "";
  achievements.forEach((a) => {
    if (a.unlocked) {
      const li = document.createElement("li");
      li.textContent = a.name;
      achievementsUI.appendChild(li);
    }
  });
}

// Save system
function saveGame() {
  localStorage.setItem(
    "femboyClickerSave",
    JSON.stringify({
      cuteness,
      perSecond,
      prestige,
      upgrades,
      achievements,
    }),
  );
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("femboyClickerSave"));
  if (!data) return;

  cuteness = data.cuteness;
  perSecond = data.perSecond;
  prestige = data.prestige;

  data.upgrades.forEach((saved, i) => {
    upgrades[i].owned = saved.owned;
  });

  data.achievements.forEach((saved, i) => {
    achievements[i].unlocked = saved.unlocked;
  });
}

// Main loop
function update() {
  cuteness += perSecond / 60;

  scoreUI.textContent = `Cuteness: ${Math.floor(cuteness)}`;
  perSecondUI.textContent = `Per second: ${perSecond}`;

  checkAchievements();
  requestAnimationFrame(update);
}

// Init
loadGame();
buildShop();
update();
setInterval(saveGame, 2000);






console.log("UwU, you found me :3");
