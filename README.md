This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
🍴 Spark Bytes

Spark Bytes is a Next.js web application designed to connect Boston University students with local event vendors who have leftover food from campus events. Vendors can post their events and list any extra food available, while students can browse, reserve, and pick up food within designated time frames — reducing waste and building community.

🚀 Features
👩‍🍳 For Vendors

Create and manage event listings with details such as time, location, and food availability.

Mark extra food items available for pickup after events.

Monitor and manage student reservations.

🎓 For Students

Sign up and log in using Supabase authentication.

View all active and upcoming campus events with available food.

Reserve portions of leftover food and view pickup details.

Explore a map view showing nearby vendors and events around BU’s campus.

🧭 For Everyone

Intuitive, responsive Next.js frontend.

Supabase integration for authentication, storage, and data management.

Dynamic role-based interfaces (vendor vs. student).

Real-time updates for event and food availability.

🏗️ Tech Stack
Category	Technology
Frontend Framework	Next.js

Database & Auth	Supabase

Styling	Tailwind CSS / Ant Design (optional)
Mapping	Google Maps API / Leaflet.js
Deployment	Vercel (recommended)

3. Set Up Environment Variables

Create a .env.local file in the root directory and include the following keys:

NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>

4. Run the Development Server
npm run dev
# or
yarn dev


Then open http://localhost:3000
 to view the app in your browser.

🗂️ Project Structure
spark-bytes/
├── components/          # Reusable UI components
├── pages/               # Next.js pages and routes
├── lib/                 # Supabase and helper utilities
├── styles/              # Global and component styles
├── public/              # Static assets
└── .env.local           # Environment variables (not committed)

🔐 User Roles & Views
Vendors

Can create, edit, and delete event listings.

Input details like event name, food type, location, and time window.

Manage student reservations.

Students

Can view events in a list or map view.

Reserve available food and see pickup details.

Receive notifications when pickup windows open.

🗺️ Map View

Students can toggle to a map-based interface displaying nearby event vendors and available food, helping them locate the nearest pickup opportunities around the BU campus.

📦 Future Enhancements

Email or push notifications when reservations are confirmed.

Vendor analytics dashboard (food waste reduction stats).

Student rewards or loyalty points for participation.

Admin dashboard for event moderation.

