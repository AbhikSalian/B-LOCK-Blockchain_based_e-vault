# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from hashlib import sha256
import random
import json

# Blockchain related imports
from Block import Block
from Blockchain import Blockchain

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

blockchain = Blockchain()

@app.route("/new_transaction", methods=["POST"])
def new_transaction():
    file_data = request.get_json()
    required_fields = ["user", "v_file", "file_data", "file_size"]
    for field in required_fields:
        if not file_data.get(field):
            return "Transaction does not have valid fields!", 404
    blockchain.add_pending(file_data)
    return "Success", 201

@app.route("/chain", methods=["GET"])
def get_chain():
    chain = [block.__dict__ for block in blockchain.chain]
    return jsonify({"length": len(chain), "chain": chain})

@app.route("/mine", methods=["GET"])
def mine_unconfirmed_transactions():
    result = blockchain.mine()
    if result:
        return "Block #{0} mined successfully.".format(result)
    else:
        return "No pending transactions to mine."

@app.route("/pending_tx", methods=["GET"])
def get_pending_tx():
    return jsonify(blockchain.pending)

@app.route("/add_block", methods=["POST"])
def validate_and_add_block():
    block_data = request.get_json()
    block = Block(block_data["index"], block_data["transactions"], block_data["prev_hash"])
    hashl = block_data["hash"]
    added = blockchain.add_block(block, hashl)
    if not added:
        return "The Block was discarded by the node.", 400
    return "The block was added to the chain.", 201

if __name__ == '__main__':
    app.run(port=8800, debug=True)
