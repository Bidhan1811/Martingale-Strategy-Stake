require("dotenv").config();

const axios = require("axios");

const CONFIG = {
  defaultAmount: 0.02,
  multiplier: 2,
  maxLossStreak: 10,
  delayMs: 100,
  target: 50.5,
  condition: "above",
  currency: "inr",
};

const HEADERS = {
  "Accept": "*/*",
  "Content-Type": "application/json",
  "Cookie": process.env.COOKIE,
  "Priority": "u=1, i", 
  "sec-ch-ua": `"Microsoft Edge";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": "",
  "sec-ch-ua-platform": "Windows",
  "sec-ch-ua-platform-version": "19.0.0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "Accept-Language": "en-US,en;q=0.9,en-IN;q=0.8",
  "X-Access-Token": process.env.X_ACCESS_TOKEN,
  "X-Lockdown-Token": process.env.X_LOCKDOWN_TOKEN,
  "Origin": "https://stake.com",
  "Referer": "https://stake.com/casino/games/dice",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0",
};

function randomIdentifier() {
  return Math.random().toString(36).substring(2, 22);
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function placeBet(amount) {
  const payload = {
    amount,
    target: CONFIG.target,
    condition: CONFIG.condition,
    currency: CONFIG.currency,
    identifier: randomIdentifier(),
  };

  const response = await axios.post(
    "https://stake.com/_api/casino/dice/roll",
    payload,
    { headers: HEADERS }
  );

  if (!response.data) throw new Error("Empty response");
  return response.data;
}

async function main() {
  let amount = CONFIG.defaultAmount;
  let lossStreak = 0;
  let totalProfit = 0;
  let wins = 0;
  let losses = 0;
  let round = 0;

  console.log("🎲 Martingale Bot Started");
  console.log(`   Base bet   : ${CONFIG.defaultAmount} ${CONFIG.currency}`);
  console.log(`   Max loss   : ${(CONFIG.defaultAmount * Math.pow(CONFIG.multiplier, CONFIG.maxLossStreak)).toFixed(2)} ${CONFIG.currency}`);
  console.log("─".repeat(65));

  while (true) {
    round++;
    //console.log(`\nRound ${round} | Bet: ${amount.toFixed(4)} | Streak: ${lossStreak}`);

    try {
      const bet = await placeBet(amount);
      const roll = bet.diceRoll;                  
      const result = roll.state.result;           
      const payout = roll.payout ?? 0;            
      const condition = roll.state.condition;     
      const target = roll.state.target;           

      const won = condition === "above"
        ? result > target
        : result < target;

      const profit = won ? payout - amount : -amount;
      totalProfit += profit;

      if (won) {
        wins++;
        lossStreak = 0;
        console.log(`✅ WIN  | Result: ${result} | Payout: ${payout} | P/L: ${totalProfit.toFixed(4)}`);
        amount = CONFIG.defaultAmount;
      } else {
        losses++;
        lossStreak++;
        const nextBet = amount * CONFIG.multiplier;
        console.log(`❌ LOSS | Result: ${result} | Streak: ${lossStreak} | Next: ${nextBet.toFixed(4)} | P/L: ${totalProfit.toFixed(4)}`);
        amount = nextBet;
      }

      if (lossStreak >= CONFIG.maxLossStreak) {
        console.log("\n🛑 Max loss streak reached. Stopping.");
        break;
      }

    } catch (e) {
      console.error(`❌ Error on round ${round}:`, e.message);
      break;
    }

    await sleep(CONFIG.delayMs);
  }

  console.log("\n" + "─".repeat(65));
  console.log("📊 Final Summary");
  console.log(`   Rounds : ${round} | Wins: ${wins} | Losses: ${losses}`);
  console.log(`   P/L    : ${totalProfit.toFixed(4)} ${CONFIG.currency}`);
}

main();