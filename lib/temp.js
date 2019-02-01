'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridHeader = exports.rowTemplate = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var rowTemplate = exports.rowTemplate = [{ value: '' }, { value: '', placeholder: 'First Name' }, { value: '', placeholder: 'Last Name' }, { value: '', placeholder: 'ID' }, { value: '', placeholder: 'K-12' }, { value: '', placeholder: 'Username' }, { value: '', placeholder: 'Password' }];

var gridHeader = exports.gridHeader = [{
  value: '',
  readOnly: true
}, {
  value: 'First Name',
  id: 'studentFirstName',
  readOnly: true,
  size: 'l'
}, {
  value: 'Last Name',
  id: 'studentLastName',
  readOnly: true,
  size: 'l'
}, {
  value: 'ID',
  id: 'studentID',
  readOnly: true,
  size: 'l'
}, {
  value: 'Grade',
  id: 'studentGrade',
  readOnly: true,
  size: 'xs'
}, {
  value: 'Username',
  id: 'studentUsername',
  readOnly: true,
  size: 'l'
}, {
  value: 'Password',
  id: 'studentPassword',
  readOnly: true
}];

var Test = function (_Component) {
  _inherits(Test, _Component);

  function Test() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Test);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Test.__proto__ || Object.getPrototypeOf(Test)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      grid: [gridHeader].concat([[].concat(rowTemplate), [].concat(rowTemplate)]),
      ignoreFirstColumn: true,
      totalNrOfRows: 10
    }, _this.defaultParsePaste = function (str) {
      var newRows = str.split(/\r\n|\n|\r/).map(function (row) {
        return row.split('\t');
      });
      var totalRowsWithMultipleCols = newRows.filter(function (el) {
        return el.length > 1;
      });

      var cols = gridHeader.length - 1;
      if (_this.state.ignoreFirstColumn) {
        cols--;
      }

      var newData = [];
      // do we have a single column paste? (ex: pdf)
      if (totalRowsWithMultipleCols.length === 0) {
        var col = 0;
        var row = 0;
        newRows.map(function (el, index) {
          // row does not exists
          if (!newData[row]) {
            newData[row] = Object.assign([]);
          }

          newData[row][col] = el;

          if (col === cols) {
            col = 0;
            row++;
          } else {
            col++;
          }
        });
      } else {
        newData = [].concat(_toConsumableArray(newRows));
      }

      return newData;
    }, _this.getLastRow = function (gridData) {
      if (gridData && gridData.length) {
        return gridData[gridData.length - 1].row;
      }
      return 0;
    }, _this.onCellChanged = function (changes, additions) {
      var totalChanges = changes.length;
      var newAdditions = Object.assign([], additions);

      var grid = Object.assign([], _this.state.grid);

      // cut everything down if changes are more than totalNrOfRows
      if (newAdditions && _this.getLastRow(newAdditions) > _this.state.totalNrOfRows + 1) {
        // cut off additions
        newAdditions = newAdditions.filter(function (cell) {
          return cell.row < _this.state.totalNrOfRows + 1;
        });
      }

      // if we have only one change then it means we are manually editing
      if (totalChanges === 1) {
        // @TODO change this to only 1 row
        changes.forEach(function (_ref2) {
          var row = _ref2.row,
              col = _ref2.col,
              value = _ref2.value;

          if (col !== 0) {
            // updates state grid with new values
            grid[row][col] = _extends({}, grid[row][col], { value: value });
          }
        });

        // are we pasting from 0,0 ?
      } else if (_this.state.ignoreFirstColumn && _this.props.ignoreFirstRow && changes[0].col === 0 && changes[0].row === 0) {
        var moveDown = false;
        // compare value with header[col+1] if different then newRow = row + 1
        if (changes[0].value !== gridHeader[changes[1].col].value) {
          moveDown = true;
        }
        changes.forEach(function (_ref3) {
          var row = _ref3.row,
              col = _ref3.col,
              value = _ref3.value;

          var newCol = col + 1;
          var newRow = row;
          if (moveDown) {
            newRow++;
          }
          if (newCol < rowTemplate.length) {
            grid[newRow][newCol] = _extends({}, grid[newRow][newCol], { value: value });
          }
        });
        // do we need to ignore first column when pasting?
        // if we are pasting from col 0 move all to the right
      } else if (_this.state.ignoreFirstColumn && changes[0].col === 0) {
        changes.forEach(function (_ref4) {
          var row = _ref4.row,
              col = _ref4.col,
              value = _ref4.value;

          var newCol = col + 1;
          if (newCol < rowTemplate.length) {
            grid[row][newCol] = _extends({}, grid[row][newCol], { value: value });
          }
        });

        // do we need to ignore first row when pasting?
        // if we are pasting from row 0 move all one row down if needed only
      } else if (_this.props.ignoreFirstRow && changes[0].row === 0) {
        var _moveDown = false;
        // compare value with header[col] if different then newRow = row + 1
        if (changes[0].value !== gridHeader[changes[0].col].value) {
          _moveDown = true;
        }

        changes.forEach(function (_ref5) {
          var row = _ref5.row,
              col = _ref5.col,
              value = _ref5.value;

          var newRow = row;
          if (_moveDown) {
            newRow++;
          }
          grid[newRow][col] = _extends({}, grid[newRow][col], { value: value });
        });

        // paste is not from col 0, we update normally
      } else {
        changes.forEach(function (_ref6) {
          var row = _ref6.row,
              col = _ref6.col,
              value = _ref6.value;

          // updates state grid with new values
          grid[row][col] = _extends({}, grid[row][col], { value: value });
        });
      }

      // did we paste more data than present rows?
      if (newAdditions && newAdditions.length) {
        // if we have col 0 then we need to move all to the right
        var BreakException = null;
        var isPasteOnFirstColumn = false;
        if (_this.state.ignoreFirstColumn) {
          try {
            newAdditions.forEach(function (_ref7) {
              var col = _ref7.col;

              if (col === 0) {
                isPasteOnFirstColumn = true;
                throw BreakException;
              }
            });
          } catch (e) {
            if (e !== BreakException) throw e;
          }
        }

        // add additional rows
        newAdditions.forEach(function (_ref8) {
          var row = _ref8.row,
              col = _ref8.col,
              value = _ref8.value;

          // we create new index only at first column
          if (!grid[row]) {
            grid[row] = [].concat(rowTemplate);
            if (_this.state.ignoreFirstColumn) {
              grid[row][0] = _extends({}, grid[row][0], {
                value: row.toString()
                // dataEditor: DataEditorSimulator,
              });
            }
          }
          var newCol = col;
          // if first column acts like read only than move all values to the right
          if (isPasteOnFirstColumn) {
            newCol++;
          }
          // we only allow additions that do not go over the columns that we have
          if (newCol < rowTemplate.length) {
            grid[row][newCol] = { value: value };
          }
        });
      }

      // set new grid and send data to parent
      // this.setState({ grid: [...grid] }, () => this.props.parseData(grid));
      _this.setState({ grid: [].concat(_toConsumableArray(grid)) });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * Return number of rows found in grid
   *
   * @param array gridData
   * @return integer
   */


  /**
   * Sets new state for the table.
   * Called each time a cell value is changed.
   *
   * @param array changes Array of change object for each cell
   * @param array additions Array of cells that are more than the grid
   * @return null
   */


  _createClass(Test, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(node) {
            _this2.node = node;
          }
          // className={`${styles.data_grid_wrapper} ${className}`}
        },
        _react2.default.createElement(_index2.default, {
          data: this.state.grid
          // data={data}
          , valueRenderer: function valueRenderer(cell) {
            return cell.value;
          },
          onCellsChanged: this.onCellChanged
          // selected={this.state.selected}
          // onContextMenu={this.onContextMenu}
          // onSelect={this.onSelect}
          // sheetRenderer={this.sheetRenderer}
          // rowRenderer={this.rowRenderer}
          // cellRenderer={this.cellRenderer}
          // dataEditor={DataEditorInput}

          , ignoreFirstColumnTab: true,
          parsePaste: this.defaultParsePaste
        })
      );
    }
  }]);

  return Test;
}(_react.Component);

exports.default = Test;