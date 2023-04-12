from flask import Flask, Response, abort, jsonify, render_template, request
from riot_auth import RiotAuth, auth_exceptions
from flask_cors import CORS
import asyncio
import valochecker
import json

app = Flask(__name__)
CORS(app)
skins = []

@app.route('/', methods=['POST', 'GET'])
def main():
    return render_template('storepage.html')

@app.route('/items', methods=['POST', 'GET'])
def items():
    if(request.method == 'POST'):
        
        data = request.data.decode('utf-8') # decode the bytes object to a string
        data_dict = json.loads(data) # load the string as JSON and convert it to a dictionary

        try:
            skins = asyncio.run(valochecker.store(data_dict['username'], data_dict['password'], data_dict['region']))
        except auth_exceptions.RiotAuthenticationError:
            response = jsonify("credError")
            response.status_code=400
            return response
        except auth_exceptions.RiotMultifactorError:
            response = jsonify("2faError")
            response.status_code=400
            return response
        
        print("sto continuando")

        response = jsonify(skins)
        response.headers.add('Access-Control-Allow-Origin', '*')
        
        return response
    
  

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="$PORT")
