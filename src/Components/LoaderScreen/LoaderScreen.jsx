import React from 'react'
import { SyncLoader } from 'react-spinners';

export default function LoaderScreen() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <SyncLoader color="#ffffff" margin={5} size={15} speedMultiplier={1} />
      </div>
    </>
  )
}
