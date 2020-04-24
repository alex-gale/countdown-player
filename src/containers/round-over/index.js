import React from 'react'

import './index.scss'
import { SocketContext } from '../../socket-wrapper'

class RoundOver extends React.Component {
	static contextType = SocketContext

	componentDidMount() {
		setTimeout(() => this.context.setGamestate("round_results"), 2000)
	}

	render() {
		return (
			<div className="page-container round-over-container">
				<h1 className="game-title"><span role="img" aria-label="clock">🕑</span> Countdown Online</h1>

				<h2>Round Over!</h2>
			</div>
		)
	}
}

export default RoundOver
