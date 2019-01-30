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
      ignoreFirstColumn: true

      /**
       * Sets new state for the table.
       * Called each time a cell value is changed.
       *
       * @param array changes Array of change object for each cell
       * @param array additions Array of cells that are more than the grid
       * @return null
       */
    }, _this.onCellChanged = function (changes, additions) {
      var totalChanges = changes.length;
      // fix for bad excel pasting
      if (totalChanges > 1 && !changes[totalChanges - 1].value) {
        // remove last element which is redundant
        changes.pop();
      }

      var grid = Object.assign([], _this.state.grid);

      // do we need to ignore first column when pasting?
      if (_this.state.ignoreFirstColumn) {
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

          // if we are pasting from col 0 move all to the right
        } else if (changes[0].col === 0) {
          changes.forEach(function (_ref3) {
            var row = _ref3.row,
                col = _ref3.col,
                value = _ref3.value;

            var newCol = col + 1;
            if (newCol < rowTemplate.length) {
              grid[row][newCol] = _extends({}, grid[row][newCol], { value: value });
            }
          });

          // paste is not from col 0, we update normally
        } else {
          changes.forEach(function (_ref4) {
            var row = _ref4.row,
                col = _ref4.col,
                value = _ref4.value;

            // updates state grid with new values
            grid[row][col] = _extends({}, grid[row][col], { value: value });
          });
        }
      } else {
        changes.forEach(function (_ref5) {
          var row = _ref5.row,
              col = _ref5.col,
              value = _ref5.value;

          // updates state grid with new values
          grid[row][col] = _extends({}, grid[row][col], { value: value });
        });
      }

      // did we paste more data than present rows?
      if (additions && additions.length) {
        // fix for bad excel pasting
        if (!additions[additions.length - 1].value) {
          // remove last element which is redundant
          additions.pop();
        }

        // if we have col 0 then we need to move all to the right
        var BreakException = null;
        var isPasteOnFirstColumn = false;
        if (_this.state.ignoreFirstColumn) {
          try {
            additions.forEach(function (_ref6) {
              var col = _ref6.col;

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
        additions.forEach(function (_ref7) {
          var row = _ref7.row,
              col = _ref7.col,
              value = _ref7.value;

          // we create new index only at first column
          if (!grid[row]) {
            grid[row] = [].concat(rowTemplate);
            if (_this.state.ignoreFirstColumn) {
              grid[row][0] = _extends({}, grid[row][0], {
                value: row.toString(),
                dataEditor: DataEditorSimulator
              });
            }
          }
          // if first column acts like read only than move all values to the right
          if (isPasteOnFirstColumn) {
            var newCol = col + 1;
            if (newCol < rowTemplate.length) {
              grid[row][newCol] = { value: value };
            }
          } else {
            grid[row][col] = { value: value };
          }
        });
      }

      // set new grid and send data to parent
      // this.setState({ grid: [...grid] }, () => this.props.parseData(grid));
      _this.setState({ grid: [].concat(_toConsumableArray(grid)) });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

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

          , forceStartEditCell: { i: 1, j: 1 },
          enableTabEdit: true,
          ignoreFirstColumnTab: true
        })
      );
    }
  }]);

  return Test;
}(_react.Component);

exports.default = Test;