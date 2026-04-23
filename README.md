🎲 Martingale Strategy Automation (Stake Dice - Node.js)

A small experiment to implement and observe the Martingale betting strategy by automating bet placement on Stake’s dice game using Node.js.

The script places bets programmatically, doubles the amount after each loss, resets after a win, and stops based on predefined risk limits — helping visualize how the strategy behaves over time.

⚠️ Disclaimer

This project is purely for educational and experimental purposes.
Martingale is a high-risk strategy and can lead to rapid losses.
Use responsibly. Do not rely on this for guaranteed profit.

⚙️ How It Works
Places bets by sending requests similar to the browser’s network calls
Doubles bet amount after each loss
Resets to base amount after a win
Stops execution based on:
Maximum loss limit
Maximum losing streak
Logs each win/loss in the terminal
🔑 Setup Instructions
1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Install dependencies
npm install
3. Capture Required Headers
Open Stake Dice game in your browser
Open Developer Tools → Network tab
Place a bet
Find the request named roll
Copy the following from Request Headers:
cookie
x-access-token
x-lockdown-token
4. Configure Environment Variables

Create a .env file in the root directory:

COOKIE=your_cookie_here
X_ACCESS_TOKEN=your_access_token_here
X_LOCKDOWN_TOKEN=your_lockdown_token_here
5. Update Headers in Code

Make sure the headers in the script match the latest request payload from the browser.

Example:

headers: {
  'cookie': process.env.COOKIE,
  'x-access-token': process.env.X_ACCESS_TOKEN,
  'x-lockdown-token': process.env.X_LOCKDOWN_TOKEN,
  // update other headers if required
}

⚠️ These values may expire, so you might need to refresh them periodically.

▶️ Run the Script
node index.js
📊 Output

The script logs each bet outcome in the terminal:

Win / Loss
Current bet amount
Running profit/loss
Streak tracking

You can also modify it to save logs to a file if needed.

🧠 Strategy Logic (Quick Recap)
Base Bet: b
After n losses:
Total loss = b × (2^n − 1)
Next bet = b × 2^n

The script stops when defined limits are hit to prevent uncontrolled losses.

🔧 Customization

You can tweak:

Base bet amount
Multiplier
Max loss limit
Max losing streak
Stop conditions
