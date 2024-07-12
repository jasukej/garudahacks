import React from 'react'
import IssueForm from './issue/issueForm'
import IssueDisplay from './issue/IssueDisplay'

const IssueSection = () => {
  return (
    <div className="
          min-h-screen
          mb-24
          mt-10
        ">
        <div className="
            flex 
            flex-col
            gap-y-16
            ">
            <IssueDisplay />
            <IssueForm />
          </div>
        </div>
  )
}

export default IssueSection