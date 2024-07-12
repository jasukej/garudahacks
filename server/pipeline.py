import requests
from io import BytesIO 
from PIL import Image
import firebase
from detect import detectSidewalk

# Initialize Firebase
firebase.initialize_firebase()

def get_street_view_image(lat, lng, api_key):
    """returns street view image url"""
    
    base_url_metadata="https://maps.googleapis.com/maps/api/streetview/metadata"
    base_url_image = "https://maps.googleapis.com/maps/api/streetview"
    
    params = {
        'location': f"{lat},{lng}",
        'key': api_key,
    }
    
    # Get metadata to check if street view is even available first
    response_metadata = requests.get(base_url_metadata, params=params)
    metadata = response_metadata.json()
    
    print(metadata) # returning OK status
    
    if metadata.get("status") == "OK":
        
        params_image = {
            'size': '640x640',
            'location': f'{lat},{lng}',
            'key': api_key,
            'return_error_code': "true",
            'source': 'outdoor',
        }
        response_image = requests.get(base_url_image, params=params_image)
        print(response_image) # returning <Response [404]>
        if response_image.status_code == 200:
            print(Image.open(BytesIO(response_image.content)))
            return Image.open(BytesIO(response_image.content))
    return None

def upload_image_to_firebase(image, lat, lng):
    bucket = firebase.get_storage_bucket()
    blob = bucket.blob(f'raw/images/{lat}_{lng}.png')  # creates a new file-like object in the storage bucket where img will b stored
    image.save(f"/tmp/{lat}_{lng}.png")                # saves img to temporary file on the local file system
    blob.upload_from_filename(f"/tmp/{lat}_{lng}.png") # uploads file to blob in storage
    blob.make_public()
    return blob.public_url


def add_to_firestore(lat, lng, detected_dict):
    db = firebase.get_firestore_db()
    doc_ref = db.collection('detections').add({
        'location': {
            'latitude': lat,
            'longitude': lng
        },
        'hasSidewalk': detected_dict['hasSidewalk'],
        'hasCracks': detected_dict['hasCracks'],
        'hasObstacles': detected_dict['hasObstacles'],
        'hasVendors': detected_dict['hasVendors'],
        'hasParkedVehicles': detected_dict['hasParkedVehicles'],
        'hasTactilePath': detected_dict['hasTactilePath'],
        'title': 'placeholder'
    })
    return doc_ref

def analyze_location(lat, lng, api_key):
    img = get_street_view_image(lat, lng, api_key)
    print(img) # prints None
    if img: 
        print('Now detecting sidewalk')
        img_url = upload_image_to_firebase(img, lat, lng)
        detected_dict = detectSidewalk(img_url, lat, lng)
        print(detected_dict)
        
        # add_to_firestore(lat, lng, detected_dict)
        
        return {
            'location': {
                'latitude': lat,
                'longitude': lng
            },
            'hasSidewalk': detected_dict['hasSidewalk'],
            'hasCracks': detected_dict['hasCracks'],
            'hasObstacles': detected_dict['hasObstacles'],
            'hasVendors': detected_dict['hasVendors'],
            'hasParkedVehicles': detected_dict['hasParkedVehicles'],
            'hasTactilePath': detected_dict['hasTactilePath'],
            'title': 'Trotoar kurang memadai'
        }
    else:
        return {"error: Failed to fetch street view images"}