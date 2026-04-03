# Run3DModel 🧊

A full-stack web application designed for seamlessly uploading, visualizing, and manipulating 3D models with advanced tracking technology.

![Technology Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Authentication](https://img.shields.io/badge/Auth-JWT-green?style=for-the-badge)
![Rendering engine](https://img.shields.io/badge/Rendering-Three.js-orange?style=for-the-badge)

## 🌟 Key Features

- **Robust 3D Rendering**: Ultra-smooth rendering using `@react-three/fiber` and `@react-three/drei`.
- **GLB Uploads**: Easily drop complex `.glb` binary objects right into your dashboard.
- **Auto-Normalization Engine**: Intelligent `Box3` algorithms organically identify the model's structure to scale your 3D assets to a perfect standard viewing size.
- **Persistent Camera State Tracking**: Adjust the zoom, viewing angle, and rotation in the Canvas and click **Save View**. Your perfect viewing angle is encoded and stored inside the MongoDB database so it instantly jumps exactly to that rotation next time you open it!
- **Premium UI Experience**: Floating glassmorphic styling, non-blocking UI toasts, and graceful multi-step uploads.
- **Secure Architecture**: Complete internal user authentication with JWT, preventing unauthorized users from dumping or retrieving blobs.

## 🛠 Tech Stack

**Frontend Environment:**
* React 18 (Bootstrapped via Vite)
* State Management: Zustand 🐻
* Graphics Library: Three.js (`react-three-fiber`)
* Styling: Vanilla CSS (Custom dark-mode tokenized system)
* Routing: React Router v6

**Backend Environment:**
* Engine: Node.js / Express
* Database: MongoDB Atlas (Mongoose ODM)
* Filesystem Handling: Multer
* Security: bcryptjs, jsonwebtoken (JWT)

## 🚀 Running Locally

Before you begin, ensure you have Node.js installed.

1. **Clone the repo**
   ```sh
   git clone https://github.com/toshakparmar/Run3DModel.git
   cd Run3DModel
   ```

2. **Configure your Database**
   Inside the `/server` directory, create a `.env` file and define:
   ```env
   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.yourmongodb.net/run3dmodel?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_hex_key
   PORT=5000
   ```
   *Make sure you URL-encode any special characters like `@` in your password (`%40`).*

3. **Install Dependencies & Start the Backend**
   ```sh
   cd server
   npm install
   npm run dev
   ```

4. **Install Dependencies & Start the Frontend**
   Open a second terminal window:
   ```sh
   cd client
   npm install
   npm run dev
   ```

*(The `client` will automatically boot onto `http://localhost:5173` and start talking to the backend running on `:5000`)*

## 📦 Production Deployment

This repository is built with **Infrastructure as Code** blueprints heavily optimized for Vercel and Render!

**Backend (Render.com)**:
1. Connect this GitHub branch to Render using `New > Blueprint`.
2. Render will automatically parse the `render.yaml` file, install the environment, assign an active port, and generate an encrypted JWT secret. 
3. *Provide your MongoDB credentials when prompted!*

**Frontend (Vercel)**:
1. Create a modern project on Vercel and hook this GitHub repository.
2. Under "Root Directory", be sure to click `client`.
3. Add a single Environment Variable `VITE_APP_URL` and hand it your live Render backend URL!
4. The `vercel.json` already solves the dreaded React Router page-refresh 404 bugs for you automatically.

---
*Built with passion by the Advanced Agentic Coding module at Google DeepMind.*
