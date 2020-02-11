import React, { useState, useContext } from 'react'

const WS_URL = "wss://api.countdown.codes/ws"

export const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
	const [ws, setWS] = useState()
	const [gameCode, setGameCode] = useState("")
	const [gamestate, setGamestate] = useState("round_results")
	const [player, setPlayer] = useState({})
	const [currentAnswer, setCurrentAnswer] = useState("ambulance")
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

	const joinGame = (game_data) => {
		const playerData = { username: game_data.username, id: game_data.user_id }

		setGameCode(game_data.game_code)
		setGamestate("waiting")
		setPlayer(playerData)
	}

	const submitAnswer = (answer) => {
		ws.send(JSON.stringify({ type: "round_answer", "data": answer }))
	}

	const processResults = (results) => {
		if (results.feedback.top_answer) {
			setScore(score => score + currentAnswer.length)
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
					if (data.user_type === "host") {
						setError("No game in progress")
						return webSoc.close()
					}

					joinGame(data)
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
				case "round_results":
					processResults(data)
					break
				default:
					console.error(`Invalid websocket message received - ${type}`)
			}
		}

		webSoc.onclose = () => {
			setWS(null)
			setGameCode("")
			setGamestate("join_game")
			setPlayer({})
			setLetters("")
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
