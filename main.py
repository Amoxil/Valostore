from flask import Flask, jsonify, render_template, request
import json
import random

app = Flask(__name__)
skins = []

@app.route('/', methods=['POST', 'GET'])
def main():
    return render_template('index.html')

@app.route('/items', methods=['POST', 'GET'])
def items():
    if(request.method == 'POST'):
        print(request.data)
        response = jsonify(
            skins[random.randint(0, len(skins))],
            skins[random.randint(0, len(skins))],
            skins[random.randint(0, len(skins))],
            skins[random.randint(0, len(skins))]
        )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
  

if __name__ == "__main__":
    with open("skins.json", 'r') as jsonSkin:
        skinsData = json.load(jsonSkin)
    
    skins = skinsData['data']
    
    print()
    app.run(debug=True)
