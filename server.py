from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configure MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")  # Connect to MongoDB
db = client["your_database_name"]  # Change to your MongoDB database name
users_collection = db["users"]  # Collection for storing user data

app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a strong secret key
jwt = JWTManager(app)

# Home Route
@app.route('/')
def home():
    return render_template('index.html')
# Register Route
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if users_collection.find_one({"username": username}):
        return jsonify({'error': 'Username already exists'}), 400
    if users_collection.find_one({"email": email}):
        return jsonify({'error': 'Email already registered'}), 400

    hashed_password = generate_password_hash(password)  # Secure password storage

    new_user = {
        "username": username,
        "password": hashed_password,
        "email": email
    }

    users_collection.insert_one(new_user)  # Insert user into MongoDB

    return jsonify({'message': 'User registered successfully'})

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({"username": username})

    if user and check_password_hash(user["password"], password):
        access_token = create_access_token(identity=str(user["_id"]))  # Use MongoDB ObjectId as identity
        return jsonify({'access_token': access_token})

    return jsonify({'error': 'Invalid credentials'}), 401

# Protected Route (Example: Fetch Study Plans)
@app.route('/study-plans', methods=['GET'])
@jwt_required()
def get_study_plans():
    return jsonify({'message': 'This is a protected route. Implement study plans here.'})

# Start the Flask Server
if __name__ == '__main__':
    app.run(debug=True)