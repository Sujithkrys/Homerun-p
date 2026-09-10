# HomeRun AI Assistant

A conversational AI assistant for **[HomeRun](https://home-run.co)**, Bangalore's quick commerce platform delivering construction materials in 60 minutes.

This application features a 3-mode interactive interface powered by a unified backend and persistent cart engine.

---

## 🌟 Demo Modes (3 Modes Total)

### 1. 🖥 Web Platform
- Simulates the assistant embedded directly on HomeRun's desktop website.
- Two-panel layout: chat on the left (~60%) and a live, synchronized cart sidebar on the right (~40%).
- Real-time cart calculations (subtotal, free delivery on orders ≥ ₹500, and 5% bulk order cashback for orders > ₹50,000).
- Visual estimation cards with project type and area calculations.

### 2. 📱 Mobile App
- Renders inside an authentic **phone frame mockup** (375×812px, rounded ~40px corners, dark bezel, static status bar with 9:41 time, signal, wifi, battery).
- Same HomeRun green branding, yellow HR logo, and quick action suggestion pills.
- **Slide-up Bottom Sheet Cart**:
  - Covers ~70% of the screen from the bottom when tapping the cart icon in the header.
  - Drag handle bar, item list with quantity steppers, subtotal, delivery fee, and "Place Order" button.
  - Semi-transparent dark backdrop (tap outside to dismiss).

### 3. 💬 WhatsApp Mode
- Simulates how civil contractors and site supervisors order via WhatsApp inside the phone frame mockup.
- Authentic WhatsApp styling: `#075e54` header, verified badge, `#efeae2` wallpaper, chat bubbles with tails, and blue checkmarks (`✓✓`).
- In-bubble formatted text cart with interactive buttons:
  - `[🛒 View Cart]`: Re-displays current order breakdown.
  - `[💳 Checkout]`: Generates a simulated Razorpay payment link (`https://rzp.io/i/hr-pay-...`) with site delivery instructions.
  - `[➕ Add More]`: Suggests complementary materials.
- WhatsApp-style quick reply suggestion chips.

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **AI Engine**: Google Gemini 2.0 Flash (`@google/generative-ai`)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations / Effects**: Canvas Confetti

---

## 📦 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Sujithkrys/Homerun-p.git
cd Homerun-p
npm install
```

### 2. Configure Environment Variables

Create `.env.local` based on `.env.example`:

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploy to Vercel

1. Push to your GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. Add the `GOOGLE_GEMINI_API_KEY` environment variable in Vercel project settings.
4. Deploy! Next.js is automatically detected.

---

## 👤 Author

Built by **[Sujith Thalathoty](https://linkedin.com/in/thalathotysujith)**  
*AI Product Operations Demo for HomeRun*
