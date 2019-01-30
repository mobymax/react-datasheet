import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactDataSheet from './index';

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

export default class Test extends Component {
  state = {
    grid: [gridHeader].concat([ [...rowTemplate], [...rowTemplate]]),
    ignoreFirstColumn: true,
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
    // fix for bad excel pasting
    if (totalChanges > 1 && !changes[totalChanges - 1].value) {
      // remove last element which is redundant
      changes.pop();
    }

    const grid = Object.assign([], this.state.grid);

    // do we need to ignore first column when pasting?
    if (this.state.ignoreFirstColumn) {
      // if we have only one change then it means we are manually editing
      if (totalChanges === 1) {
        // @TODO change this to only 1 row
        changes.forEach(({ row, col, value }) => {
          if (col !== 0) {
            // updates state grid with new values
            grid[row][col] = { ...grid[row][col], value };
          }
        });

      // if we are pasting from col 0 move all to the right
      } else if (changes[0].col === 0) {
        changes.forEach(({ row, col, value }) => {
          const newCol = col + 1;
          if (newCol < rowTemplate.length) {
            grid[row][newCol] = { ...grid[row][newCol], value };
          }
        });

      // paste is not from col 0, we update normally
      } else {
        changes.forEach(({ row, col, value }) => {
          // updates state grid with new values
          grid[row][col] = { ...grid[row][col], value };
        });
      }
    } else {
      changes.forEach(({ row, col, value }) => {
        // updates state grid with new values
        grid[row][col] = { ...grid[row][col], value };
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
      const BreakException = null;
      let isPasteOnFirstColumn = false;
      if (this.state.ignoreFirstColumn) {
        try {
          additions.forEach(({ col }) => {
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
      additions.forEach(({ row, col, value }) => {
        // we create new index only at first column
        if (!grid[row]) {
          grid[row] = [...rowTemplate];
          if (this.state.ignoreFirstColumn) {
            grid[row][0] = {
              ...grid[row][0],
              value: (row).toString(),
              dataEditor: DataEditorSimulator,
            };
          }
        }
        // if first column acts like read only than move all values to the right
        if (isPasteOnFirstColumn) {
          const newCol = col + 1;
          if (newCol < rowTemplate.length) {
            grid[row][newCol] = { value };
          }
        } else {
          grid[row][col] = { value };
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

          forceStartEditCell={{ i:1 , j:1 }}
          enableTabEdit={true}
          ignoreFirstColumnTab={true}
        />
      </div>
    )
  }
}
