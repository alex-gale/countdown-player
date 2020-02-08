import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const TextInput = ({ label, ...rest }) => {
	return (
		<div className="text-input-container">
			<div className="text-input-label">{label}</div>
			<input className="text-input" type="text" {...rest}  />
		</div>
	)
}

TextInput.propTypes = {
	label: PropTypes.string.isRequired
}

export default TextInput
