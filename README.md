# Setup Guide

##  Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)
---

##  Installation Guide

### Step 1: Clone the Repository

If you haven't set up Git yet, [follow this guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

```bash
git clone <repository-url>
cd <repository-folder>
```

---

### Step 2: Setup Frontend

1. **Download all files from the `database` branch** (not the main branch)

2. **Create the frontend folder:**
   ```bash
   mkdir healthcare
   ```

3. **Copy all files from the `database` branch into the `healthcare` folder**

4. **Navigate to the healthcare folder and install dependencies:**
   ```bash
   cd healthcare
   npm install
   ```

5. **Verify all files are present and error-free**

---

### Step 3: Setup Backend

1. **Create the backend folder** (in the same parent directory as `healthcare`, NOT inside it):
   ```bash
   cd ..
   mkdir HealthCare-Backend
   ```

2. **Download files from the `HealthCare-Backend` repository (main branch only)**

3. **Extract and place files directly under `HealthCare-Backend`** (not inside a subfolder)

4. **Navigate to the backend folder:**
   ```bash
   cd HealthCare-Backend
   ```

5. **Initialize npm:**
   ```bash
   npm init -y
   ```

6. **Install required dependencies:**
   ```bash
   npm install express cors firebase-admin bcryptjs dotenv
   npm install --save-dev nodemon
   ```

7. **Verify all files are properly configured**

---

##  Running the Application

### Start the Backend Server

Open a terminal in the `HealthCare-Backend` folder:

```bash
npm run dev
```

Or:

```bash
npm start
```

### Start the Frontend Application

Open a **separate terminal** in the `healthcare` folder:

```bash
npm start
```

---

## Verification

Once both servers are running:

- **Frontend:** Should open automatically at `http://localhost:3000`
- **Backend:** Should be running on `http://localhost:5000`

---

## 📁 Project Structure

```
parent-folder/
├── healthcare/              # Frontend (React app)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── HealthCare-Backend/      # Backend (Node.js + Express)
    ├── server.js
    ├── .env
    └── package.json
```

---
### Module Not Found
Make sure you've installed all dependencies:
```bash
npm install
```

## 📝 Notes

- Always pull from the **`database` branch** for frontend files
- Always pull from the **`main` branch** for backend files
- Keep both terminals running simultaneously for the app to function properly
- Check the console for any error messages during startup

---
