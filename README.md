# BebeMart

**BebeMart** is a community-driven, hyper-local marketplace designed to make children's essentials affordable for Nigerian parents. By implementing a strict price cap and a unique "Gift-It-Forward" system, BebeMart ensures that quality clothes, toys, and gear remain accessible despite economic inflation.

## 🔗 Live Deployment
**View the live site here:** [https://bebe-mart.netlify.app](https://bebe-mart.netlify.app)

---

## The Mission
In an economy where the cost of new imported children's items has skyrocketed, BebeMart provides a platform for parents to declutter responsibly and for other families to acquire necessary items at a fraction of their retail price.

## Key Features

### The 5,000 NGN Price Cap
To maintain the mission of affordability, no item on BebeMart can be listed for more than **5,000 NGN**. This creates a predictable and safe financial environment for parents on a budget.

### Gift-It-Forward
This specialized category allows parents to list items for **0 NGN**. 
* **The item is free:** Only a small platform maintenance fee of **500 NGN** is charged.
* **Dignity & Sustainability:** This system preserves the dignity of the transaction while ensuring the platform remains sustainable.

### Escrow Protection
To build trust in the pre-loved market, BebeMart utilizes an escrow system. Payments are held securely by the platform and only released to the seller once the buyer confirms the item matches the description.

---

## Technical Architecture
This project is structured as a **monorepo** to maintain strict synchronization between the frontend application and the API specifications.

* **Frontend:** React with Vite & TypeScript
* **Styling:** Tailwind CSS
* **Package Management:** pnpm (via Corepack)
* **Deployment:** Netlify (Continuous Deployment via GitHub)

### Asset Management
Product imagery (e.g., rompers, strollers) is hosted locally within the `/public/assets` directory. This ensures that the marketplace remains fully functional as a static site without dependency on external API servers for media rendering.

### Deployment Configuration
The project is optimized for Netlify using a `netlify.toml` configuration:
* **Base Directory:** `artifacts/bebemart`
* **Build Command:** Automates API codegen and frontend compilation.
* **Routing:** SPA redirects are enabled to support direct URL navigation.

---

## How to Run Locally

1. **Enable Corepack:**
   ```bash
   corepack enable
   ```
2. **Install Dependencies:**
   ```bash
   pnpm install
   ```
3. **Run Development Server:**
   ```bash
   pnpm --filter @workspace/bebemart run dev
   ```
