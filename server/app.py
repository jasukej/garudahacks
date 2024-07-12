from flask import Flask, jsonify, request
from flask_cors import CORS
from secret import GCP_MAPS_KEY
import pipeline
import summarize

# create an app instance
app = Flask(__name__)

# ensure cross-origin requests accepted (from frontend port)
CORS(app) 
    
@app.route('/analyze', methods=['GET'])
def analyze():
    args = request.args
    print("args are ", args)
    
    try:
        lat = float(args.get("lat"))
        lng = float(args.get("lng"))
        print("calling analyze_location with ", lat, lng)
        results = pipeline.analyze_location(lat, lng, GCP_MAPS_KEY) # works
        print(results)
        return jsonify(results)
    except Exception as e:
        print(f"Error occurred: {e}")
        return {"error": "Failed to fetch street view images"}
    
@app.route('/generate_summary', methods=['POST'])
def generate_summary():
    data = request.json
    print("Detections: ", data)
    detections = data.get('detections', [])

    # Generate the summary using OpenAI
    
    summary = summarize.generate(detections)
    
    return jsonify({'summary': summary})
        
# we run our application through this line
if __name__ == "__app__":
    app.run(debug=True, port=8080)

# flask run --host=0.0.0.0 --port=8080