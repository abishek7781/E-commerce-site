from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'

socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB setup
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/ecommerce')
client = MongoClient(MONGO_URI)
db = client.ecommerce
users_collection = db.users

@app.route('/')
def index():
    return "E-commerce backend is running."

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 400

    hashed_password = generate_password_hash(password)
    user = {
        'name': name,
        'email': email,
        'password': hashed_password
    }
    users_collection.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    # For simplicity, just return success message; token can be added later
    return jsonify({'message': 'Login successful', 'name': user['name']}), 200

if __name__ == '__main__':
    socketio.run(app, debug=True)
