import React, { useState, useContext } from 'react'

const WS_URL = "wss://api.countdown.codes/ws"

export const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
	const [ws, setWS] = useState()
	const [gameCode, setGameCode] = useState("")
	const [gamestate, setGamestate] = useState("join_game")
	const [player, setPlayer] = useState({ username: "" })
	const [currentAnswer, setCurrentAnswer] = useState("")
	const [answerFeedback, setAnswerFeedback] = useState({ dict: false, letters: false, top_answer: false })
	const [score, setScore] = useState(0)
	const [error, setError] = useState("")
	const [letters, setLetters] = useState("")
	const [loading, setLoading] = useState(false)

	const handleError = (err, webSoc) => {
		setError(err.msg)

		switch (err.code) {
			case 10:
				// no username
				webSoc.close()
				break

			case 11:
				// invalid join code
				webSoc.close()
				break

			default:
				console.error("Invalid error received from server")
		}
	}

	const submitAnswer = (answer) => {
		ws.send(JSON.stringify({ type: "round_answer", "data": answer }))
	}

	const processResults = (results) => {
		if (results.feedback.top_answer) {
			setCurrentAnswer(answer => {
				setScore(score => score + answer.length)

				return answer
			})
		}

		setAnswerFeedback(results.feedback)
	}

	const connect = (username, game_code) => {
		setLoading(true)
		setError("")

		if (ws) {
			return false
		}

		const connectUrl = `${WS_URL}?username=${username}&code=${game_code}`
		const webSoc = new WebSocket(connectUrl)

		webSoc.onopen = () => {
			setWS(webSoc)
			setLoading(false)
		}

		webSoc.onmessage = (event) => {
			const message = JSON.parse(event.data)
			const { type, data } = message

			switch(type) {
				case "error":
					handleError(data, webSoc)
					break
				case "game_data":
					setGameCode(data.game_code)
					setGamestate("waiting")
					setPlayer({ username: data.username })
					setScore(data.score)
					break
				case "round_start":
					setGamestate("round")
					setLetters(data.letters)
					setCurrentAnswer("")
					setError("")
					break
				case "answer_confirm":
					setCurrentAnswer(data)
					break
				case "round_end":
					setGamestate("round_over")
					break
				case "round_feedback":
					processResults(data)
					break
				default:
					console.error(`Invalid websocket message received - ${type}`)
			}
		}

		webSoc.onclose = () => {
			setWS(null)
			setGamestate("join_game")
			setLetters("")
			setScore(0)
			setAnswerFeedback({ dict: false, letters: false, top_answer: false })
		}
	}

	return (
		<SocketContext.Provider
			value={{
				connect,
				gamestate,
				gameCode,
				player,
				error,
				letters,
				currentAnswer,
				score,
				answerFeedback,
				submitAnswer,
				loading,
				setGamestate
			}}
		>
			{children}
		</SocketContext.Provider>
	)
}
