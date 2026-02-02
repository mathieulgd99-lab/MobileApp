# ClimbingApp

## Requirements

Before running the project, make sure you have:

- **Node.js** (recommended recent version)
- **npm**
- A smartphone with the **Expo Go** app installed

## How to Run the Project

### 1. Frontend (Expo App)

From the root of the repository:

1. Navigate to the frontend folder:
   ```bash
   cd ClimbingApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

After running this command, a **QR code** will appear in the terminal or in your browser.  
Scan this QR code with your **phone using the Expo Go app**.

**Important:**  
Your **computer and your phone must be connected to the same internet network (Wi-Fi)** for the application to work properly.

---

### 2. Backend (API & Database)

In a separate terminal:

1. Navigate to the backend folder:
   ```bash
   cd ClimbingApp/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

The backend must be running to allow access to the database.

## Notes

- Make sure the backend server is running before using features that require database access.
- Backend configuration (such as ports) can be modified in the backend files if needed.
