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
model = YOLOWorld('yolov8l-worldv2.pt')
details_model = YOLOWorld('yolov8l-worldv2.pt')

ssl._create_default_https_context = ssl._create_unverified_context

# def crop_to_sidewalk(image, results):
#     for result in results:
#         for obj in result['pred']:
#             if obj['name'] == 'sidewalk':
#                 bbox = obj['box']
#                 x1, y1, x2, y2 = bbox[0], bbox[1], bbox[2], bbox[3]
#                 cropped_image = image.crop((x1, y1, x2, y2))
#                 return cropped_image
#     return None

def upload_image_to_firebase(image, lat, lng):
    bucket = firebase.get_storage_bucket()
    blob = bucket.blob(f'annotated/images/{lat}_{lng}.png')  # creates a new file-like object in the storage bucket where img will b stored
    image.save(f"/tmp/{lat}_{lng}.png")                # saves img to temporary file on the local file system
    blob.upload_from_filename(f"/tmp/{lat}_{lng}.png") # uploads file to blob in storage
    blob.make_public()
    return blob.public_url

def get_image_from_url(image_url):
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
    class_names = []
    for result in results: 
        for box in boxes:
            class_id = int(box.cls.type(torch.int64).item())
            class_name = results[0].names[class_id]
            class_names.append(class_name)
    return class_names

def detectSidewalk(imgUrl, lat, lng):
    
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

    if "sidewalk" not in class_names:
        return {"sidewalk": False}
    
    # # Crop to sidewalk area
    # cropped_img = crop_to_sidewalk(img, results)
    # if not cropped_img:
    #     return {"error": "Failed to crop sidewalk area"}
    
    # Run further detections if sidewalk detected
    additional_classes = [
        "sidewalk-obstacle", 
        "overgrown-sidewalk", 
        "cracked-sidewalk", 
        "yellow-square-path", 
        "car-on-sidewalk", 
        "street-vendor-on-sidewalk",
        "road"
    ]
    detailed_model.set_classes(additional_classes)
    detailed_results = details_model.predict(img, conf=0.03)
    
    detections = {
        "sidewalk": True,
        "details": {class_name: class_name in detailed_class_names for class_name in additional_classes}
    }
    
    print(detections)
 
    return detections

# Restore SSL verification
ssl._create_default_https_context = ssl._create_stdlib_context