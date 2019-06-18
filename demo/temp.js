import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactDataSheet from '../src/index';

export const rowTemplate = [
  { value: '' },
  { value: '', placeholder: 'First Name' },
  { value: '', placeholder: 'Last Name' },
  { value: '', placeholder: 'ID' },
  { value: '', placeholder: 'K-12' },
  { value: '', placeholder: 'Username' },
  { value: '', placeholder: 'Password' },
];


export const gridHeader = [
  {
    value: '',
    readOnly: true,
  },
  {
    value: 'First Name',
    id: 'studentFirstName',
    readOnly: true,
    size: 'l',
  },
  {
    value: 'Last Name',
    id: 'studentLastName',
    readOnly: true,
    size: 'l',
  },
  {
    value: 'ID',
    id: 'studentID',
    readOnly: true,
    size: 'l',
  },
  {
    value: 'Grade',
    id: 'studentGrade',
    readOnly: true,
    size: 'xs',
  },
  {
    value: 'Username',
    id: 'studentUsername',
    readOnly: true,
    size: 'l',
  },
  {
    value: 'Password',
    id: 'studentPassword',
    readOnly: true,
  },
];

const getMultipleRows = nr => {
  const arr = [];
  let el = {};
  for (let i = 0; i < nr; i++) {
    el = JSON.parse(JSON.stringify(rowTemplate));
    el[0].value = i + 1;
    arr.push(el);
  }
  return arr;
}

export default class Test extends Component {
  state = {
    grid: [gridHeader].concat(getMultipleRows(30)),
    ignoreFirstColumn: true,
    totalNrOfRows: 10,
  }
  
  defaultParsePaste = (str) => {
    const newRows = str.split(/\r\n|\n|\r/).map((row) => row.split('\t'));
    const totalRowsWithMultipleCols = newRows.filter(el => el.length > 1);

    let cols = gridHeader.length - 1;
    if (this.state.ignoreFirstColumn) {
      cols--;
    }
  
    let newData = [];
    // do we have a single column paste? (ex: pdf)
    if (totalRowsWithMultipleCols.length === 0) {
      let col = 0;
      let row = 0;
      newRows.map((el, index) => {
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
      newData = [...newRows];
    }
    
    return newData;
  }
  
  /**
   * Return number of rows found in grid
   *
   * @param array gridData
   * @return integer
   */
  getLastRow = gridData => {
    if (gridData && gridData.length) {
      return gridData[gridData.length - 1].row;
    }
    return 0;
  }

  /**
   * Sets new state for the table.
   * Called each time a cell value is changed.
   *
   * @param array changes Array of change object for each cell
   * @param array additions Array of cells that are more than the grid
   * @return null
   */
   onCellChanged = (changes, additions) => {
    const totalChanges = changes.length;
    let newAdditions = Object.assign([], additions);

    const grid = Object.assign([], this.state.grid);

    // cut everything down if changes are more than totalNrOfRows
    if (newAdditions && this.getLastRow(newAdditions) > this.state.totalNrOfRows + 1) {
      // cut off additions
      newAdditions = newAdditions.filter(cell => cell.row < this.state.totalNrOfRows + 1);
    }

    // if we have only one change then it means we are manually editing
    if (totalChanges === 1) {
      // @TODO change this to only 1 row
      changes.forEach(({ row, col, value }) => {
        if (col !== 0) {
        // updates state grid with new values
        grid[row][col] = { ...grid[row][col], value };
        }
      });

    // are we pasting from 0,0 ?
    } else if (this.state.ignoreFirstColumn && this.props.ignoreFirstRow && changes[0].col === 0 && changes[0].row === 0) {
      let moveDown = false;
      // compare value with header[col+1] if different then newRow = row + 1
      if (changes[0].value !== gridHeader[changes[1].col].value) {
        moveDown = true;
      }
      changes.forEach(({ row, col, value }) => {
        const newCol = col + 1;
        let newRow = row;
        if (moveDown) {
          newRow++;
        }
        if (newCol < rowTemplate.length) {
          grid[newRow][newCol] = { ...grid[newRow][newCol], value };
        }
      });
    // do we need to ignore first column when pasting?
    // if we are pasting from col 0 move all to the right
    } else if (this.state.ignoreFirstColumn && changes[0].col === 0) {
      changes.forEach(({ row, col, value }) => {
        const newCol = col + 1;
        if (newCol < rowTemplate.length) {
          grid[row][newCol] = { ...grid[row][newCol], value };
        }
      });

    // do we need to ignore first row when pasting?
    // if we are pasting from row 0 move all one row down if needed only
    } else if (this.props.ignoreFirstRow && changes[0].row === 0) {
      let moveDown = false;
      // compare value with header[col] if different then newRow = row + 1
      if (changes[0].value !== gridHeader[changes[0].col].value) {
        moveDown = true;
      }

      changes.forEach(({ row, col, value }) => {
        let newRow = row;
        if (moveDown) {
          newRow++;
        }
        grid[newRow][col] = { ...grid[newRow][col], value };
      });

    // paste is not from col 0, we update normally
    } else {
      changes.forEach(({ row, col, value }) => {
        // updates state grid with new values
        grid[row][col] = { ...grid[row][col], value };
      });
    }

    // did we paste more data than present rows?
    if (newAdditions && newAdditions.length) {
      // if we have col 0 then we need to move all to the right
      const BreakException = null;
      let isPasteOnFirstColumn = false;
      if (this.state.ignoreFirstColumn) {
        try {
          newAdditions.forEach(({ col }) => {
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
      newAdditions.forEach(({ row, col, value }) => {
        // we create new index only at first column
        if (!grid[row]) {
          grid[row] = [...rowTemplate];
          if (this.state.ignoreFirstColumn) {
            grid[row][0] = {
              ...grid[row][0],
              value: (row).toString(),
              // dataEditor: DataEditorSimulator,
            };
          }
        }
        let newCol = col;
        // if first column acts like read only than move all values to the right
        if (isPasteOnFirstColumn) {
          newCol++;
        }
        // we only allow additions that do not go over the columns that we have
        if (newCol < rowTemplate.length) {
          grid[row][newCol] = { value };
        }
      });
    }

    // set new grid and send data to parent
    // this.setState({ grid: [...grid] }, () => this.props.parseData(grid));
    this.setState({ grid: [...grid] });
  }
  
  render() {
    
    return (
      <div
        ref={node => { this.node = node; }}
        // className={`${styles.data_grid_wrapper} ${className}`}
        >
        <ReactDataSheet
          data={this.state.grid}
          // data={data}
          valueRenderer={cell => cell.value}
          onCellsChanged={this.onCellChanged}
          // selected={this.state.selected}
          // onContextMenu={this.onContextMenu}
          // onSelect={this.onSelect}
          // sheetRenderer={this.sheetRenderer}
          // rowRenderer={this.rowRenderer}
          // cellRenderer={this.cellRenderer}
          // dataEditor={DataEditorInput}

          ignoreFirstColumnTab={true}
          ignoreFirstColumnCopy={true}
          reattachEvents={true}
          parsePaste={this.defaultParsePaste}
        />
      </div>
    )
  }
}
