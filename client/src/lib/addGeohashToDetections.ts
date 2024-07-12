import { geohashForLocation } from 'geofire-common';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

export const addGeohashToDetections = async () => {
    const detectionsSnapshot = await getDocs(collection(db, 'detections'));

    const batch = writeBatch(db); // batch writes

    detectionsSnapshot.forEach((detectionDoc) => {
        const data = detectionDoc.data();
        
        // Check if the geohash field is already present
        if (!data.geohash) {
            const { latitude, longitude } = data.location;

            // Get geohash
            const geohash = geohashForLocation([latitude, longitude]);

            const detectionRef = doc(db, 'detections', detectionDoc.id);
            batch.update(detectionRef, { geohash });
        }
    });

    await batch.commit();
    console.log('All documents have been updated with geohash.');
};

// function call
addGeohashToDetections().catch(console.error);