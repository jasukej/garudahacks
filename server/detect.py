from ultralytics import YOLOWorld
import firebase_admin
from firebase_admin import credentials, firestore
from PIL import Image
import requests
from io import BytesIO
import torch
import firebase
import ssl

# Initialize Firebase
cred = credentials.Certificate('jalankami-decac-firebase-adminsdk-w6bt3-6b6f9b13a0.json')
firebase_admin.initialize_app(cred)

# Load a YOLO-World model
model = YOLOWorld('best.pt')
details_model = YOLOWorld('best.pt')

ssl._create_default_https_context = ssl._create_unverified_context

def upload_image_to_firebase(image, lat, lng):
    """
    Uploads an image to Firebase Storage and makes it public.

    Args:
        image (PIL.Image): The image to upload.
        lat (float): Latitude of the image location.
        lng (float): Longitude of the image location.

    Returns:
        str: Public URL of the uploaded image.
    """
    bucket = firebase.get_storage_bucket()
    blob = bucket.blob(f'annotated/images/{lat}_{lng}.png')  
    image.save(f"/tmp/{lat}_{lng}.png")                
    blob.upload_from_filename(f"/tmp/{lat}_{lng}.png")
    blob.make_public()
    return blob.public_url

def get_image_from_url(image_url):
    """
    Fetches an image from a URL.

    Args:
        image_url (str): URL of the image.

    Returns:
        PIL.Image or None: Image object if successful, otherwise None.
    """
    response = requests.get(image_url)
    print(f"Fetching image from URL: {image_url}")
    print(f"Response status code: {response.status_code}")
    print(f"Response content type: {response.headers['Content-Type']}")

    if response.status_code == 200 and 'image' in response.headers['Content-Type']:
        try:
            img = Image.open(BytesIO(response.content))
            print("Image successfully loaded.")
            return img
        except Exception as e:
            print(f"Error loading image: {e}")
            return None
    else:
        print("Failed to fetch a valid image.")
        return None

def extract_class_names(results):
    """
    Extracts class names from YOLO-World model results.

    Args:
        results (list): Results from the YOLO-World model.

    Returns:
        list: List of class names.
    """
    class_names = []
    for result in results: 
        print(result)
        for box in result.boxes:
            class_id = int(box.cls.type(torch.int64).item())
            class_name = result.names[class_id]
            class_names.append(class_name)
    return class_names

def detectSidewalk(imgUrl, lat, lng):
    """
    Detects sidewalks and additional details from an image.

    Args:
        imgUrl (str): URL of the image.
        lat (float): Latitude of the image location.
        lng (float): Longitude of the image location.

    Returns:
        dict: Detection results.
    """
    img = get_image_from_url(imgUrl)
    print(img)
    
    # Detect sidewalk
    model.set_classes(['sidewalk', 'road'])
    results = model.predict(img, conf=0.01)
    
    print(results)
    
    # upload_image_to_firebase(results[0].save(f"{lat}_{lng}.png"), lat, lng)
    print(results[0].boxes)
    
    class_names = extract_class_names(results[0])
    print(f"Detected classes: {class_names}")
    
    additional_classes = [
        "obstacle", 
        "overgrown-sidewalk", 
        "crack", 
        "yellow-path", 
        "car-on-sidewalk", 
        "motorcycle-on-sidewalk", 
        "street-vendors"
    ]
    details_model.set_classes(additional_classes)
    details_results = details_model.predict(img, conf=0.01)
    
    print(details_results)
    
    detailed_class_names = extract_class_names(details_results)
    print(f"Detected details: {detailed_class_names}")
    
    detections = {
        "hasSidewalk": "sidewalk" in class_names or "crack" in detailed_class_names or "overgrown-sidewalk" in detailed_class_names or "yellow-path" in detailed_class_names or "street-vendors" in detailed_class_names,
        "hasObstacles": "obstacle" in detailed_class_names,
        "hasCracks": "crack" in detailed_class_names or "overgrown-sidewalk" in detailed_class_names,
        "hasParkedVehicles": "car-on-sidewalk" in detailed_class_names or "motorcycle-on-sidewalk" in detailed_class_names,
        "hasVendors": "street-vendors" in detailed_class_names,
        "hasTactilePath": "yellow-path" in detailed_class_names,
    }
    
    print(detections)
 
    return detections

# Restore SSL verification
ssl._create_default_https_context = ssl._create_stdlib_context