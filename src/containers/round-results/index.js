import React from 'react'

import './index.scss'
import { SocketContext } from '../../socket-wrapper'

class RoundResults extends React.Component {
  static contextType = SocketContext

  render() {
    return (
      <div className="page-container round-results-container">
        <h1 className="game-title"><span role="img" aria-label="clock">🕧</span> Countdown Online</h1>
      </div>
    )
  }
}

export default RoundResults
