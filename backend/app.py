from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'

socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB setup
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/ecommerce')
client = MongoClient(MONGO_URI)
db = client.ecommerce
users_collection = db.users
products_collection = db.products
orders_collection = db.orders  # Orders collection
cart_collection = db.carts    # New carts collection

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

@app.route('/api/products', methods=['GET'])
def get_products():
    products = list(products_collection.find({}, {'_id': 0}))
    return jsonify(products), 200

@app.route('/api/products/<int:product_id>/stock', methods=['POST'])
def update_stock(product_id):
    data = request.json
    new_stock = data.get('stock')
    if new_stock is None:
        return jsonify({'error': 'Missing stock value'}), 400

    result = products_collection.update_one({'id': product_id}, {'$set': {'stock': new_stock}})
    if result.matched_count == 0:
        return jsonify({'error': 'Product not found'}), 404

    # Emit real-time stock update to clients
    socketio.emit('stock_update', {'product_id': product_id, 'stock': new_stock}, broadcast=True)
    return jsonify({'message': 'Stock updated'}), 200

# Orders endpoints
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    user_email = data.get('user_email')
    items = data.get('items')
    city = data.get('city')
    pincode = data.get('pincode')
    total_price = data.get('total_price')

    if not user_email or not items or not city or not pincode or total_price is None:
        return jsonify({'error': 'Missing required order fields'}), 400

    # Enrich items with product images from products collection
    enriched_items = []
    for item in items:
        product = products_collection.find_one({'id': item.get('id')})
        if product and 'image' in product:
            item['image'] = product['image']
        else:
            item['image'] = ''  # Default empty string if no image found
        enriched_items.append(item)

    order = {
        'user_email': user_email,
        'items': enriched_items,
        'city': city,
        'pincode': pincode,
        'total_price': total_price,
        'status': 'Pending',
        'order_date': datetime.utcnow().isoformat(),  # Add order date in ISO format UTC
        'cancellationRequested': False  # New field for cancellation request
    }
    orders_collection.insert_one(order)
    return jsonify({'message': 'Order placed successfully'}), 201

@app.route('/api/orders/<user_email>', methods=['GET'])
def get_orders(user_email):
    orders = list(orders_collection.find({'user_email': user_email}))
    # Convert ObjectId to string for frontend
    for order in orders:
        order['_id'] = str(order['_id'])
    return jsonify(orders), 200

# Endpoint for user to request cancellation
@app.route('/api/orders/<order_id>/request-cancellation', methods=['POST'])
def request_cancellation(order_id):
    result = orders_collection.update_one({'_id': ObjectId(order_id)}, {'$set': {'cancellationRequested': True}})
    if result.matched_count == 0:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify({'message': 'Cancellation requested successfully'}), 200

# Admin endpoint to get all orders
@app.route('/api/admin/orders', methods=['GET'])
def admin_get_orders():
    orders = list(orders_collection.find({}, {'_id': 1, 'user_email': 1, 'items': 1, 'city': 1, 'pincode': 1, 'total_price': 1, 'status': 1, 'order_date': 1, 'cancellationRequested': 1}))
    # Convert ObjectId to string for frontend
    for order in orders:
        order['_id'] = str(order['_id'])
    return jsonify(orders), 200

# Admin endpoint to update order status
@app.route('/api/admin/orders/<order_id>/status', methods=['PUT'])
def admin_update_order_status(order_id):
    data = request.json
    new_status = data.get('status')
    if not new_status:
        return jsonify({'error': 'Missing status'}), 400

    result = orders_collection.update_one({'_id': ObjectId(order_id)}, {'$set': {'status': new_status}})
    if result.matched_count == 0:
        return jsonify({'error': 'Order not found'}), 404

    return jsonify({'message': 'Order status updated successfully'}), 200

# New Cart endpoints
@app.route('/api/cart/<user_email>', methods=['GET'])
def get_cart(user_email):
    cart = cart_collection.find_one({'user_email': user_email}, {'_id': 0})
    if cart:
        return jsonify(cart.get('items', [])), 200
    else:
        return jsonify([]), 200

@app.route('/api/cart', methods=['POST'])
def save_cart():
    data = request.json
    user_email = data.get('user_email')
    items = data.get('items')

    if not user_email or items is None:
        return jsonify({'error': 'Missing user_email or items'}), 400

    cart_collection.update_one(
        {'user_email': user_email},
        {'$set': {'items': items}},
        upsert=True
    )
    return jsonify({'message': 'Cart saved successfully'}), 200

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('chat_message')
def handle_chat_message(data):
    message = data.get('message')
    if message:
        emit('chat_message', {'message': message}, broadcast=True)

@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    users = list(users_collection.find({}, {'password': 0}))
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users), 200

from bson.objectid import ObjectId

@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
def admin_delete_user(user_id):
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user_email = user.get('email')
    result = users_collection.delete_one({'_id': ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'User not found'}), 404
    # Delete all orders for this user
    orders_collection.delete_many({'user_email': user_email})
    return jsonify({'message': 'User and their orders removed successfully'}), 200

@app.route('/api/admin/update-credentials', methods=['PUT'])
def update_admin_credentials():
    data = request.json
    current_email = data.get('current_email')
    new_email = data.get('new_email')
    new_password = data.get('new_password')

    if not current_email or not new_email or not new_password:
        return jsonify({'error': 'Missing required fields'}), 400

    admin_user = users_collection.find_one({'email': current_email})
    if not admin_user:
        return jsonify({'error': 'Admin user not found'}), 404

    hashed_password = generate_password_hash(new_password)
    update_result = users_collection.update_one(
        {'email': current_email},
        {'$set': {'email': new_email, 'password': hashed_password}}
    )

    if update_result.modified_count == 0:
        return jsonify({'error': 'Failed to update admin credentials'}), 500

    return jsonify({'message': 'Admin credentials updated successfully'}), 200

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
