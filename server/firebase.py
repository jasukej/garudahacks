import firebase_admin
from firebase_admin import credentials, storage, firestore

def initialize_firebase():
    """
    Initialize Firebase application with credentials and storage bucket.
    If the Firebase app is already initialized, it will not reinitialize.

    This function sets up Firebase for use with Firestore and Storage.
    """
    if not firebase_admin._apps:
        cred = credentials.Certificate('./jalankami-decac-firebase-adminsdk-w6bt3-6b6f9b13a0.json')
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'jalankami-decac.appspot.com'
        })

def get_storage_bucket():
    """
    Get the Firebase Storage bucket.

    Returns:
        google.cloud.storage.bucket.Bucket: The Firebase Storage bucket instance.
    """
    bucket_name = 'jalankami-decac.appspot.com'
    return storage.bucket(name=bucket_name)

def get_firestore_db():
    return firestore.client()