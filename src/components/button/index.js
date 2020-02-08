import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const Button = ({ children, ...rest }) => {
  return (
    <button {...rest} className="button">
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired
}

export default Button
