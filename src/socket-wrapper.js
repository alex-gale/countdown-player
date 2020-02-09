import React, { useState, useContext } from 'react'

const WS_URL = "wss://api.countdown.codes/ws"

export const SocketContext = React.createContext()
export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
	const [ws, setWS] = useState()
	const [gameCode, setGameCode] = useState("")
	const [gamestate, setGamestate] = useState("join_game")
	const [player, setPlayer] = useState({})
	const [error, setError] = useState("")
	const [letters, setLetters] = useState("")

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

			case 12:
				// can't accept answer
				break

			default:
				console.error("Invalid error received from server")
		}
	}

	const joinGame = (game_data) => {
		const playerData = { username: game_data.username, id: game_data.user_id, score: 0 }

		setGameCode(game_data.game_code)
		setGamestate("waiting")
		setPlayer(playerData)
	}

	const startRound = (letters) => {
		setGamestate("round")
		setLetters(letters)
	}

	const connect = (username, game_code) => {
		setError("")

		if (ws) {
			return false
		}

		const connectUrl = `${WS_URL}?username=${username}&code=${game_code}`
		const webSoc = new WebSocket(connectUrl)

		webSoc.onopen = () => {
			setWS(webSoc)
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
					startRound(data.letters)
					break
				default:
					console.error("Invalid websocket message received")
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
				letters
			}}
		>
			{children}
		</SocketContext.Provider>
	)
}
