import { geohashForLocation } from 'geofire-common';
import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

export const addGeohashToDetections = async () => {
    const detectionsSnapshot = await getDocs(collection(db, 'detections'));

    const batch = writeBatch(db); // Use writeBatch for batch writes

    detectionsSnapshot.forEach((detectionDoc) => {
        const data = detectionDoc.data();
        
        // Check if the geohash field is already present
        if (!data.geohash) {
            const { latitude, longitude } = data.location;

            // Compute the geohash
            const geohash = geohashForLocation([latitude, longitude]);

            // Get the document reference
            const detectionRef = doc(db, 'detections', detectionDoc.id);

            // Update the document with the new geohash field
            batch.update(detectionRef, { geohash });
        }
    });

    // Commit the batch
    await batch.commit();
    console.log('All documents have been updated with geohash.');
};

// Call the function
addGeohashToDetections().catch(console.error);