import React from 'react'
import IssueForm from './issue/issueForm'
import IssueDisplay from './issue/IssueDisplay'

const IssueSection = () => {
  return (
    <div className="
          min-h-screen
          px-8
        ">
        <div className="
            flex 
            flex-col
            ">
            <IssueDisplay />
            <div className="
              text-xl
              font-semibold
              flex
              justify-start
              px-2
              py-2
            ">
              Laporkan masalah infrastruktur
            </div>
            <IssueForm />
          </div>
        </div>
  )
}

export default IssueSection