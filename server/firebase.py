import firebase_admin
from firebase_admin import credentials, storage, firestore

def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate('./jalankami-decac-firebase-adminsdk-w6bt3-6b6f9b13a0.json')
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'jalankami-decac.appspot.com'
        })
    
# should probably add reference to real-time db here too

def get_storage_bucket():
    bucket_name = 'jalankami-decac.appspot.com'
    return storage.bucket(name=bucket_name)

def get_firestore_db():
    return firestore.client()