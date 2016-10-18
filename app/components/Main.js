var React = require('react');

require('../styles/main.sass');

class Main extends React.Component {
  constructor() {
    super();

    this.cellStates = {
      dead: 0,
      alive: 1,
      old: 2
    };

    var numberRows = 40;
    var numberColumns = 40;

    var testData = [];
    for(var i = 0; i < numberRows; i++) {
      testData[i] = [];
      for(var j = 0; j < numberColumns; j++) {
        testData[i][j] = Math.random() >= 0.50 ? this.cellStates.dead  : this.cellStates.alive;
      }
    }

    this.state ={
      boardData: testData,
      numberRows: numberRows,
      numberColumns: numberColumns,
      isRunning: true,
      generation: 0
    };

    var getNewCellState = function (boardData, rowNb, colNb) {
      var that = this;

      function getNbOfAliveAndDeadNeighbours(boardData, rowNb, colNb) {

        var numberOfAliveNeighbours = 0;
        for (var i = rowNb - 1; i <= rowNb + 1; i++) {
          for (var j = colNb - 1; j <= colNb + 1; j++) {
            var tempRowIndex;
            var tempColumnIndex;
            if (i === -1) tempRowIndex = that.state.numberRows - 1;
            else if (i === that.state.numberRows) tempRowIndex = 0;
            else tempRowIndex = i;

            if (j === -1) tempColumnIndex = that.state.numberColumns - 1;
            else if (j === that.state.numberColumns) tempColumnIndex = 0;
            else tempColumnIndex = j;

            if (boardData[tempRowIndex][tempColumnIndex] > that.cellStates.dead && !(colNb === j && rowNb === i)) {
              numberOfAliveNeighbours++;
            }
          }
        }
        return numberOfAliveNeighbours;
      }

      function getStateByNumberOfAliveNeighbours(stateOfCell, numberOfAliveNeighbours) {
        if (numberOfAliveNeighbours < 2) return that.cellStates.dead;
        else if (numberOfAliveNeighbours === 2) {
          if (stateOfCell > that.cellStates.dead) return that.cellStates.old;
          else return that.cellStates.dead;
        }
        else if (numberOfAliveNeighbours === 3) {
          if (stateOfCell > that.cellStates.dead) return that.cellStates.old;
          else return that.cellStates.alive;
        }
        else return that.cellStates.dead;
      }

      var numberOfAliveNeighbours = getNbOfAliveAndDeadNeighbours(boardData, rowNb, colNb);
      return getStateByNumberOfAliveNeighbours(boardData[rowNb][colNb], numberOfAliveNeighbours);
    }.bind(this);

    this.interval = function() {

      var newBoardData = [];
      for(var i = 0; i < this.state.numberRows; i++) {
        newBoardData[i] = [];
        for(var j = 0; j < this.state.numberColumns; j++) {
          newBoardData[i][j] = getNewCellState(this.state.boardData, i, j);
        }
      }
      this.setState({ boardData: newBoardData, generation: this.state.generation+1 });
    }.bind(this);

    this.state.interval = setInterval(this.interval, 100);
    this.handleRun = this.handleRun.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }
  handleRun() {
    if(!this.state.isRunning) {
      this.setState({
        interval: setInterval(this.interval, 100),
        isRunning: true
      });
    }
  }
  handlePause() {
    if(this.state.isRunning) {
      this.setState({ isRunning: false });
      clearInterval(this.state.interval);
    }
  }
  handleClear() {
    var clearBoard = [];
    for(var i = 0; i < this.state.numberRows; i++) {
      clearBoard[i] = [];
      for(var j = 0; j < this.state.numberColumns; j++) {
        clearBoard[i][j] = 0;
      }
    }

    clearInterval(this.state.interval);
    this.setState({
      boardData: clearBoard,
      isRunning: false,
      generation: 0
    });
  }
  toggleCellState(rowIndex, columnIndex) {
    this.state.boardData[rowIndex][columnIndex] = this.state.boardData[rowIndex][columnIndex] > 0 ? 0 : 1;
    this.setState({ boardData: this.state.boardData });
  }
  render() {
    var that = this;

    var getClassNameForCell = function(cell) {
      if(cell === that.cellStates.dead) return 'dead';
      else if(cell === that.cellStates.alive) return 'alive';
      else if(cell === that.cellStates.old) return 'old';
    };

    var mapRowDataToRow = function (row, rowIndex) {
      return row.map(function(cell, columnIndex) {
        return <td onClick={() => that.toggleCellState(rowIndex, columnIndex) } className={getClassNameForCell(cell)} key={columnIndex} />
      })
    };

    var mapDataToBoard = function (data) {
      return data.map(function(row, rowIndex) {
        return <tr key={rowIndex}>
          {mapRowDataToRow(row, rowIndex)}
        </tr>
      })
    };

    return (
      <div className='container main-container'>
        <h1>THE GAME OF LIFE</h1>
        <div className="control-buttons row">
          <button onClick={this.handleRun} className="col-md-2 col-md-offset-3">Run</button>
          <button onClick={this.handlePause} className="col-md-2">Pause</button>
          <button onClick={this.handleClear} className="col-md-2">Clear</button>
        </div>
        <div className="row">
          <div className="col-md-2 col-md-offset-5">
            Generations: {this.state.generation}
          </div>
        </div>

        <div className="board row">
          <table className="col-md-8 col-md-offset-2">
            <tbody>
            {mapDataToBoard(this.state.boardData)}
            </tbody>
          </table>
        </div>
        <div className="game-settings">
          <div className="row">
            <div className="col-md-2 col-md-offset-2">Board Size: </div>
            <button className="col-md-2">Size 1</button>
            <button className="col-md-2">Size 2</button>
            <button className="col-md-2">Size 3</button>
          </div>
          <br />
          <div className="row">
            <div className="col-md-2 col-md-offset-2">Sim Speed: </div>
            <button className="col-md-2">Size 1</button>
            <button className="col-md-2">Size 2</button>
            <button className="col-md-2">Size 3</button>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Main;