from flask import Flask, jsonify, request
from flask_cors import CORS
from secret import GCP_MAPS_KEY
import pipeline

# create an app instance
app = Flask(__name__)

# ensure cross-origin requests accepted (from frontend port)
CORS(app) 
    
@app.route('/analyze', methods=['GET'])
def analyze():
    args = request.args
    print("args are ", args)
    
    
    
    # call a function from pipeline.py file here that 
    # (1) gets the url for google street view
    # (2) passes it to detect.py to create instance of our model and detect for needed reqs

# we run our application through this line
if __name__ == "__app__":
    app.run(debug=True, port=8080)

# flask run --host=0.0.0.0 --port=8080