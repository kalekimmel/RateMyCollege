# Getting Started with my app

To start app:
make sure you have the following installed:
Node.js
MongoDB (Ensure MongoDB is running)

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
cd sentiment-backend

Create a .env file in the root of the backend directory and add the following :

PORT=5000
MONGODB_URI=mongodb://localhost:27017/schools
JWT_SECRET=your_secret_key

node server.js
The backend server should now be running on http://localhost:5000.

npm install
npm start

Open your web browser and navigate to http://localhost:3000 to access the application.
Ensure MongoDB is running and the backend server is connected to the database.
