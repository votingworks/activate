import React, { useCallback, useEffect, useState } from 'react'

import { ButtonEvent, OptionalElection } from './config/types'

import Brand from './components/Brand'
import Button from './components/Button'
import ButtonBar from './components/ButtonBar'
import Main, { MainChild } from './components/Main'
import Screen from './components/Screen'
import useStateAndLocalStorage from './hooks/useStateWithLocalStorage'

import PrecinctBallotStylesScreen from './screens/PrecinctBallotStylesScreen'
import LoadElectionScreen from './screens/LoadElectionScreen'
import PrecinctsScreen from './screens/PrecinctsScreen'

import 'normalize.css'
import './App.css'

const App: React.FC = () => {
  const [isProgrammingCard, setIsProgrammingCard] = useState(false)
  const [election, setElection] = useStateAndLocalStorage<OptionalElection>(
    'election'
  )
  const [precinctId, setPrecinctId] = useState('')

  const updatePrecinct = (event: ButtonEvent) => {
    const { id = '' } = (event.target as HTMLElement).dataset
    setPrecinctId(id)
  }

  const getPrecinctNameByPrecinctId = (precinctId: string): string =>
    (election && election.precincts.find(p => p.id === precinctId)!.name) || ''

  const getBallotStylesByPreinctId = (id: string) =>
    (election &&
      election.ballotStyles.filter(b => b.precincts.find(p => p === id))) ||
    []

  const reset = () => {
    setPrecinctId('')
  }

  const programCard = (event: ButtonEvent) => {
    const ballotStyleId = (event.target as HTMLElement).dataset.ballotStyleId
    if (precinctId && ballotStyleId) {
      setIsProgrammingCard(true)
      const code = { t: 'voter', pr: `${precinctId}`, bs: `${ballotStyleId}` }
      fetch('/card/write', {
        method: 'post',
        body: JSON.stringify(code),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            // TODO: better notification of success
            // https://github.com/votingworks/bas/issues/7
            reset()
            setIsProgrammingCard(false)
          }
        })
        .catch(() => {
          window.setTimeout(() => {
            // TODO: UI Notification if unable to write to card
            // https://github.com/votingworks/bas/issues/10
            console.log(code) // eslint-disable-line no-console
            reset()
            setIsProgrammingCard(false)
          }, 500)
        })
    }
  }

  const handleUserKeyPress = useCallback(event => {
    event.keyCode === 27 && reset()
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress)
    return () => {
      window.removeEventListener('keydown', handleUserKeyPress)
    }
  }, [handleUserKeyPress])

  if (election) {
    return (
      <Screen>
        <Main>
          {isProgrammingCard ? (
            <MainChild center>
              <h1>Programming card…</h1>
            </MainChild>
          ) : (
            <MainChild maxWidth={false}>
              {precinctId ? (
                <PrecinctBallotStylesScreen
                  precinctBallotStyles={getBallotStylesByPreinctId(precinctId)}
                  precinctName={getPrecinctNameByPrecinctId(precinctId)}
                  programCard={programCard}
                />
              ) : (
                <PrecinctsScreen
                  precincts={election.precincts}
                  updatePrecinct={updatePrecinct}
                />
              )}
            </MainChild>
          )}
        </Main>
        <ButtonBar secondary separatePrimaryButton>
          <Button disabled={!precinctId || isProgrammingCard} onClick={reset}>
            Reset
          </Button>
          <Brand>VxEncode</Brand>
        </ButtonBar>
      </Screen>
    )
  }

  return <LoadElectionScreen setElection={setElection} />
}

export default App
