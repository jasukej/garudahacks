import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Location } from '../Map';
import AddressDisplay from './AddressDisplay';
import { CiMap } from 'react-icons/ci';

type Issue = {
    title: string,
    description: string,
    imgURL?: string,
    type: string,
    urgency: string,
    location: any,
}

const IssueDisplay = () => {
    const [issues, setIssues] = useState<Issue[]>([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'issues'));
                const issuesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(issuesList)
                //@ts-ignore
                setIssues(issuesList);
            } catch (error) {
                console.log("Error fetching issues ", error);
            }
        }

        fetchIssues();
    }, [])

  return (
    <div className="
        bg-red-700
        py-10
        w-full
        px-8
    ">
        <div className="
            flex
            flex-row
            justify-between
            items-start
            text-white
            mb-6
        ">
            <div className="
                font-semibold
                text-lg
            ">
                Isu terbuka
            </div>
            <div className="
                flex
                flex-row
                gap-x-2
                text-md
                hover:underline
                hover:cursor-pointer
            ">
                <CiMap size={24}/>
                Daerah Jakarta Barat
            </div>
        </div>
        {issues.map((issue, index) => (
            <div 
            key={index}
            className="
                rounded-md
                flex-row
                p-4
                text-black
                bg-white
            "
            >
                {issue.imgURL && 
                <div>
                    <img src="" />
                </div>
                }
                <div className="
                    flex 
                    flex-col 
                    justify-between
                    items-start
                    gap-y-4
                ">
                    <div className="
                        flex
                        flex-col
                        gap-y-1
                    ">
                    <div className="flex font-semibold">
                        {issue.title}
                    </div>
                    <AddressDisplay 
                        lat={issue.location.latitude}
                        lng={issue.location.longitude}
                    />
                    </div>
                    <div className="
                    px-3
                    py-1.5
                    bg-red-600
                    text-xs
                    rounded-full
                    text-white
                    flex
                    ">
                        MENDESAK
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default IssueDisplay