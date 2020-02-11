import React from 'react'
import shortid from 'shortid'

import './index.scss'
import { SocketContext } from '../../socket-wrapper'
import TextInput from '../../components/text-input'
import Button from '../../components/button'

class Round extends React.Component {
	static contextType = SocketContext

	constructor(props) {
		super(props)

		this.state = {
			answer: "",
			submittedAnswer: false
		}

		this.submitAnswer = this.submitAnswer.bind(this)
	}

	submitAnswer(e) {
		e.preventDefault()

		this.context.submitAnswer(this.state.answer)

	}

	render() {
		const { answer } = this.state
		const { error, currentAnswer } = this.context

		return (
			<div className="page-container round-container">
				<h1 className="game-title"><span role="img" aria-label="clock">🕧</span> Countdown Online</h1>

				<div className="letters-container">
					{this.context.letters.split("").map(letter => <div className="letter" key={shortid.generate()}>{letter}</div>)}
				</div>
				<div className="time-slider" />

				{
					!currentAnswer
					? <form className="answer-inputs" onSubmit={this.submitAnswer}>
							<TextInput
								label="Answer"
								value={answer}
								onChange={e => this.setState({ answer: e.target.value })}
								required
							/>

							<div className="submit-action">
								<Button submit="true" disabled={this.context.loading}>
									{this.context.loading ? "Loading..." : "Submit"}
								</Button>
								<span className={`error-message ${error && "display"}`}>{error}</span>
							</div>
						</form>
					: <div className="answer-info">Answer submitted</div>
			}
			</div>
		)
	}
}

export default Round
