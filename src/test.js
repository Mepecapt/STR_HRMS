import React from 'react'

function Test() {

  // const auth = getAuth()
  // const user = auth.currentuser()
  // const userID = user.uid
  const currTime = new Date().toLocaleTimeString();
  // const docID = userID + currTime

  console.log(currTime);
  

  return (
    <div>Test</div>
  )
}

export default Test