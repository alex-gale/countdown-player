import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'

import './index.scss'
import { SocketContext } from './socket-wrapper'
import Start from './containers/start'
import Round from './containers/round'
import RoundOver from './containers/round-over'
import RoundResults from './containers/round-results'

const App = () => {
	const { gamestate } = useContext(SocketContext)

	switch (gamestate) {
		case "join_game":
		case "waiting":
			return (
				<div className="container waiting">
					<Helmet>
						<meta name="theme-color" content="#37714A" />
					</Helmet>

					<Start />
				</div>
			)

		case "round":
			return (
				<div className="container round">
					<Helmet>
						<meta name="theme-color" content="#FFFFFF" />
					</Helmet>

					<Round />
				</div>
			)

		case "round_over":
			return (
				<div className="container round-over">
					<Helmet>
						<meta name="theme-color" content="#374171" />
					</Helmet>

					<RoundOver />
				</div>
			)

		case "round_results":
			return (
				<div className="container round-results">
					<Helmet>
						<meta name="theme-color" content="#673771" />
					</Helmet>

					<RoundResults />
				</div>
			)

		default:
			return null
	}
}

export default App
