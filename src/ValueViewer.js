import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import CellShape from './CellShape'

export default class ValueViewer extends PureComponent {
  render () {
    const {value, cell, row, col, mobile, onFocus} = this.props;
    if(mobile && !(cell.readOnly || cell.isReadOnly)) {
      return (
        <input
          value={value}
          className='value-viewer'
          onFocus={e => onFocus(e, row, col)}
          onChange={() => {}} // to make React happy
        />
      );
    }
    return (
      <span className='value-viewer'>
        {value}
      </span>
    )
  }
}

ValueViewer.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  cell: PropTypes.shape(CellShape),
  value: PropTypes.node.isRequired,
  mobile: PropTypes.bool,
  onFocus: PropTypes.func,
}

ValueViewer.defaultProps = {
  mobile: false,
  onFocus: () => {},
}
