import React, { useState, useEffect } from 'react'

import Prose from '../components/Prose'
import Main, { MainChild } from '../components/Main'
import ProgressBar from '../components/ProgressBar'
import Screen from '../components/Screen'

interface Props {
  precinctName: string
  ballotStyleId: string
}

const WritingCardScreen = ({ ballotStyleId, precinctName }: Props) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setProgress(1)
    }, 0)
  }, [])

  return (
    <Screen>
      <Main>
        <MainChild center>
          <Prose textCenter>
            <p>
              <ProgressBar progress={progress} />
            </p>
            <h1>Programming card…</h1>
            <p>
              {precinctName} / {ballotStyleId}
            </p>
          </Prose>
        </MainChild>
      </Main>
    </Screen>
  )
}

export default WritingCardScreen
