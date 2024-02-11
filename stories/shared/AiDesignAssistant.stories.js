import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import CssAssistant from '../../app/components/component-ai-assistant/CssAssistant'

const Container = styled.div``

export const Base = () => {
  const mainRef = useRef(null)
  const [context, setContext] = useState(null)

  useEffect(() => {
    mainRef?.current && setContext(mainRef.current)
  }, [mainRef])

  return (
    <Container>
      <article id="css-assistant-scoped" ref={mainRef}>
        <header>
          <h1>Chapter 1</h1>
        </header>
        <section>
          <p>
            Call me Ishmael. Some years ago—never mind how long precisely—having
            little or no money in my purse, and nothing particular to interest
            me on shore, I thought I would sail about a little and see the
            watery part of the world.
          </p>
        </section>
        <section>
          <p>
            It is a way I have of driving off the spleen and regulating the
            circulation. Whenever I find myself growing grim about the mouth;
            whenever it is a damp, drizzly November in my soul; whenever I find
            myself involuntarily pausing before coffin warehouses, and bringing
            up the rear of every funeral I meet; and especially whenever my
            hypos get such an upper hand of me, that it requires a strong moral
            principle to prevent me from deliberately stepping into the street,
            and methodically knocking people’s hats off—then, I account it high
            time to get to sea as soon as I can.
          </p>
        </section>
      </article>
      <CssAssistant enabled scope={context} />
    </Container>
  )
}

export default {
  title: 'CssAssistant/Base',
  component: Base,
}
