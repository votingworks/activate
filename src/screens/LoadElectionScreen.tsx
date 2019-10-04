import React from 'react'

import Prose from '../components/Prose'
import Main, { MainChild } from '../components/Main'
import MainNav from '../components/MainNav'
import Screen from '../components/Screen'

const LoadElectionScreen = () => {
  return (
    <Screen>
      <Main>
        <MainChild center>
          <Prose textCenter>
            <h1>Not Configured</h1>
            <p>Insert Election Clerk card.</p>
          </Prose>
        </MainChild>
      </Main>
      <MainNav />
    </Screen>
  )
}

export default LoadElectionScreen
