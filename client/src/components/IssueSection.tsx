import React from 'react'
import IssueForm from './issue/issueForm'
import IssueDisplay from './issue/IssueDisplay'

const IssueSection = () => {
  return (
    <div className="
          min-h-screen
          mb-12
        ">
        <div className="
            flex 
            flex-col
            gap-y-10
            ">
            <IssueDisplay />
            <IssueForm />
          </div>
        </div>
  )
}

export default IssueSection