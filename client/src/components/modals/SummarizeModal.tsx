import { useCallback, useMemo, useState } from 'react'
import useSummarizeModal from '../../hooks/useSummarizeModal'
import Modal from './Modal';
import LocationSearch from '../LocationSearch';
import { Location } from '../Map';
import { Slider } from '@mantine/core';
import { RxCross2 } from "react-icons/rx";
import { geohashQueryBounds, distanceBetween } from 'geofire-common';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Detection } from '../MapDisplay';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { addGeohashToDetections } from '../../lib/addGeohashToDetections';

enum STEPS {
    LOCATION_SELECT = 0,
    SUMMARY = 1,
}

const fetchDetectionsByLocation = async (center:Location, radiusInKm:number) => {
    addGeohashToDetections();
    console.log('Added Geohash')
    const bounds = geohashQueryBounds([center.lat, center.lng], radiusInKm * 1000);
    const promises:any = [];
    bounds.forEach((b) => {
        const q = query(collection(db, 'detections'), where('geohash', '>=', b[0]), where('geohash', '<=', b[1]));
        promises.push(getDocs(q));
    });
    const snapshots = await Promise.all(promises);
    console.log(snapshots)
    const matchingDocs:any = [];

    snapshots.forEach((snap) => {
        console.log(snap.docs)
        snap.docs.forEach((doc:any) => {
            console.log(doc)
            const lat = doc.get('location').latitude;
            const lng = doc.get('location').longitude;
            
            const distanceInKm = distanceBetween([lat, lng], [center.lat, center.lng]);
            console.log(distanceInKm)
            if (distanceInKm <= radiusInKm) {
                matchingDocs.push({ id: doc.id, ...doc.data() });
            }
        });
    });

    console.log(matchingDocs);
    return matchingDocs;
};

const generateSummary = async (detections:Detection[]) => {
    try {
        const response = await axios.post('http://localhost:8080/generate_summary', {
            detections
        });
        console.log(response)
        return response.data.summary;
    } catch (error) {
        console.error('Error sending detections to backend:', error);
    }
};

const SummarizeModal = () => {
    const summarizeModal = useSummarizeModal();

    const [step, setStep] = useState(STEPS.LOCATION_SELECT);
    const [distance, setDistance] = useState<number | undefined>(undefined); // in km
    const [location, setLocation] = useState<Location | null>(null);
    const [summary, setSummary] = useState<string | null>(null);

    const onNext = useCallback(() => {
        setStep((prev) => prev + 1)
    }, [])

    const submitLabel = useMemo(() => {
        if (step == STEPS.LOCATION_SELECT) {
            return 'Generate';
        }
        
        return 'Next';
    }, [step])

    const onSubmit = useCallback(async () => {
        if (step === STEPS.SUMMARY) {
            setStep(0);
            return summarizeModal.toggleModal();
        }

        if (location && distance) {
            const detections = await fetchDetectionsByLocation(location, distance);
            if (!detections || detections.length === 0) {
                toast.error('No detections found.');
                return;
            }
            console.log(detections)
            const summary = await generateSummary(detections);
            setSummary(summary);
            onNext();
        }

    }, [location, distance, step, onNext])

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <LocationSearch 
                onSelectLocation={(location) => setLocation(location)}
                position={location}
                radius={distance}
            />
            <div className="
                flex 
                flex-row 
                gap-x-4
                items-center
                ">
                <div className=" 
                    text-md
                    w-[120px]">
                        Radius: <span className="font-semibold"> {distance ? distance : '??'} km</span>
                </div>
                <Slider 
                    className="w-[70%]"
                    value={distance || 0}  
                    onChange={setDistance} 
                    min={0.1}
                    max={10}
                    step={0.1}
                    color="#D72D2D"
                    marks={[
                        { value: 2 },
                        { value: 4 },
                        { value: 6 },
                        { value: 8 }, 
                        { value: 10 }
                    ]} 
                />
                    <button 
                        onClick={() => setDistance(undefined)}
                        className="
                        hover:text-orange-main
                        rounded-full 
                        p-1
                        flex 
                        justify-center
                        items-center">
                        <RxCross2
                            size={16}/>
                    </button>
               
            </div>
        </div>
    )

    if (step === STEPS.SUMMARY) {

        const renderSummary = (title:string, content:string) => {
            console.log(content)
            return (
            <div className="
                border 
                rounded-sm 
                p-4 
                flex
                min-w-full
                flex-row
                mb-4"
            >
                <div className="
                    font-semibold 
                    text-lg 
                    flex
                    text-start
                    min-w-[33%]
                    mb-2"
                >
                    {title}
                </div>
                <div className="
                    font-light
                    flex
                    text-start
                ">
                    {content}
                </div>
            </div>
            )
        };

        let overallQuality = "";
        let areaOfWeakness = "";
        let improvements = "";

        console.log(summary)

        if (summary) {
            const overallQualityMatch = summary.match(/Overall Sidewalk Quality:([^]*?)(Accessibility:|$)/);
            const areaOfWeaknessMatch = summary.match(/Accessibility:([^]*?)(Improvements:|$)/);
            const improvementsMatch = summary.match(/Improvements:([^]*)/);

            overallQuality = overallQualityMatch ? overallQualityMatch[1].trim() : "";
            areaOfWeakness = areaOfWeaknessMatch ? areaOfWeaknessMatch[1].trim() : "";
            improvements = improvementsMatch ? improvementsMatch[1].trim() : "";
        }

        bodyContent = (
            <div className="
                flex 
                flex-col
                max-w-full
                overflow-y-scroll
                gap-8"
            >
                {!summary ? 
                    <div>Loading...</div>
                :
                    <div className="
                        text-xs
                    ">
                        {renderSummary("Overall Sidewalk Quality", overallQuality)}
                        {renderSummary("Area of Weakness", areaOfWeakness)}
                        {renderSummary("Improve-ments", improvements)}
                    </div>
                }
            </div>
        );
    }

  return (
    <div>
    <Modal 
        isOpen={summarizeModal.isOpen}
        onClose={summarizeModal.toggleModal}
        onSubmit={onSubmit}
        title="Buat ringkasan lokasi"
        body={bodyContent}
        submitLabel={submitLabel}
    />
    <ToastContainer />
    </div>
  )
}

export default SummarizeModal