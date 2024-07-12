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
            mb-4
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
        <div className="flex flex-row pt-2 gap-x-4 overflow-x-scroll">
        {issues.map((issue, index) => (
            <div
            key={index}
            className="
              rounded-md
              flex
              flex-col
              text-black
              !aspect-square
              w-[180px]
              min-w-[180px]
              relative
              overflow-hidden
              bg-white
              shadow-lg
              cursor-pointer
              hover:-translate-y-2
              hover:transition
              hover:ease-in-out
            "
            style={{
              backgroundImage: `url(${issue.imgURL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            >
                <div className="absolute opacity-80 w-full h-full bg-gradient-to-b from-slate-500 to-black">
                </div>
                <div className="
                    flex 
                    flex-col 
                    justify-between
                    items-start
                    gap-y-4
                    p-4
                    z-10
                    h-full
                ">
                    <div className={`
                    px-2
                    py-1
                    ${issue.urgency == 'mendesak' ? 'bg-red-700' : issue.urgency == 'SEDANG' ? 'bg-amber-600' : 'bg-green-600'}
                    text-xs
                    rounded-full
                    text-white
                    uppercase
                    flex
                    `}>
                        {issue.urgency}
                    </div>
                    <div className="
                        flex
                        flex-col
                        gap-y-1
                    ">
                    <div className="flex text-start text-white font-semibold">
                        {issue.title}
                    </div>
                    <AddressDisplay 
                        lat={issue.location.latitude}
                        lng={issue.location.longitude}
                    />
                    </div>
                </div>
            </div>
        ))}
        </div>

        <div className="
            border-black 
            border-[1.5px]
            rounded-lg
            bg-white
            w-full 
            flex
            mt-6
            py-2
            justify-center
            hover:bg-neutral-200
            cursor-pointer
        ">
            Lihat 12 isu lainnya
        </div>
    </div>
  )
}

export default IssueDisplay