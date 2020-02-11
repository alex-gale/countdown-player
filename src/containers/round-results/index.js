import React from 'react'

import './index.scss'
import { SocketContext } from '../../socket-wrapper'

class RoundResults extends React.Component {
  static contextType = SocketContext

	constructor(props) {
		super(props)

		this.state = {
			scoreChangeDisplay: false
		}
	}

	componentDidMount() {
		setTimeout(() => this.setState({ scoreChangeDisplay: true }), 200)
	}

  render() {
    return (
      <div className="page-container round-results-container">
        <h1 className="game-title"><span role="img" aria-label="clock">🕧</span> Countdown Online</h1>

				{
					this.context.currentAnswer
					? <React.Fragment>
							<div className="answer-container">
								<p>Your answer:</p>
								<h1>{this.context.currentAnswer}</h1>
							</div>

							<div className="feedback-container">
								<div className="dictionary-container">
									<div className="feedback-box">
										<span className={this.context.answerFeedback.dict ? 'tick' : 'cross'} />
									</div>
									<p>Dictionary</p>
								</div>

								<div className="letters-container">
									<div className="feedback-box">
										<span className={this.context.answerFeedback.letters ? 'tick' : 'cross'} />
									</div>
									<p>Letters</p>
								</div>
							</div>
						</React.Fragment>
					: <h1 className="no-answer-message">No answer this round</h1>
				}

				<div className="score-container">
					Score: <span className="bold">{this.context.score}</span>
					<span className={`score-change ${this.state.scoreChangeDisplay ? 'display' : null}`}>
						{this.context.answerFeedback.top_answer && this.context.currentAnswer ? `+${this.context.currentAnswer.length}` : null}
					</span>
				</div>
      </div>
    )
  }
}

export default RoundResults
