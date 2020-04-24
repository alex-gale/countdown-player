import React from 'react'

import './index.scss'
import Button from '../../components/button'
import TextInput from '../../components/text-input'
import { SocketContext } from '../../socket-wrapper'

class Start extends React.Component {
	static contextType = SocketContext

	constructor(props) {
		super(props)

		this.state = {
			username: this.props.player.username,
			game_code: this.props.code
		}
	}

	updateGameCode(e) {
		const re = /^[0-9\b]+$/

		if (e.target.value === "" || re.test(e.target.value)) {
			this.setState({ game_code: e.target.value })
		}
	}

	updateUsername(e) {
		const re = /([A-Za-z0-9.?,!])/

		if ((e.target.value === "" || re.test(e.target.value)) && this.state.username.length <= 25) {
			this.setState({ username: e.target.value })
		}
	}

	onSubmit(e) {
		e.preventDefault()

		this.context.connect(this.state.username, this.state.game_code)
	}

	render() {
		const { username, game_code } = this.state
		const { error } = this.context

		return (
			<div className="page-container start-container">
				<h1 className="game-title"><span role="img" aria-label="clock">🕑</span> Countdown Online</h1>

				{
					this.context.gamestate === "join_game"
						? <form className="game-inputs" onSubmit={this.onSubmit.bind(this)}>
								<TextInput
									label="Username"
									value={username}
									onChange={this.updateUsername.bind(this)}
									required
								/>
								<TextInput
									label="Game Code"
									value={game_code}
									onChange={this.updateGameCode.bind(this)}
									type="number"
									required
								/>

								<div className="join-action">
									<Button submit="true" disabled={this.context.loading}>
										{this.context.loading ? "Loading..." : "Join"}
									</Button>
									<span className={`error-message ${error && "display"}`}>{error}</span>
								</div>
							</form>

						: this.context.gamestate === "waiting"
							? <div className="welcome-display">
									<h1>Welcome {this.context.score > 0 ? "back" : null} to Countdown, <span className="underline bold">{this.context.player.username}</span></h1>
									<p>{this.context.score > 0 ? `You have ${this.context.score} points.` : null} Round will be starting soon!</p>
								</div>
							: null
				}
			</div>
		)
	}
}

// inject player and gamecode into props so that constructor can access them
export default React.forwardRef((props, ref) => {
	return (
		<SocketContext.Consumer>
			{socket => <Start player={socket.player} code={socket.gameCode} />}
		</SocketContext.Consumer>
	)
})
