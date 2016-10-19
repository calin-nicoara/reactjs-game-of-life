import React from "../../node_modules/react/react";

require('../styles/main.sass');

class Main extends React.Component {
  constructor() {
    super();

    this.cellStates = {
      dead: 0,
      alive: 1,
      old: 2
    };

    var numberRows = 60;
    var numberColumns = 60;

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
      generation: 0,
      intervalMilliSeconds: 100
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

    this.state.interval = setInterval(this.interval, this.state.intervalMilliSeconds);
    this.handleRun = this.handleRun.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.changeBoardSpeed = this.changeBoardSpeed.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
  }
  handleRun() {
    if(!this.state.isRunning) {
      this.setState({
        interval: setInterval(this.interval, this.state.intervalMilliSeconds),
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
  handleClear(rows, columns) {
    var clearBoard = [];
    for(var i = 0; i < rows; i++) {
      clearBoard[i] = [];
      for(var j = 0; j < columns; j++) {
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
    console.log(rowIndex + " " + columnIndex);
  }
  changeBoardSize(rows, columns) {
    this.setState({
      numberRows: rows,
      numberColumns: columns
    });
    this.handleClear(rows, columns);
  }
  changeBoardSpeed(milliseconds) {
    clearInterval(this.state.interval);
    this.setState({
      intervalMilliSeconds: milliseconds,
      interval: setInterval(this.interval, milliseconds)
    });
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
        return <div onClick={() => that.toggleCellState(rowIndex, columnIndex) } className={getClassNameForCell(cell) + " cell"} key={columnIndex} />
      })
    };

    var mapDataToBoard = function (data) {
      return data.map(function(row, rowIndex) {
        return <div className="cell-row" key={rowIndex}>
          {mapRowDataToRow(row, rowIndex)}
        </div>
      })
    };

    return (
      <div className='container main-container'>
        <h1>THE GAME OF LIFE</h1>
        <div className="control-buttons row">
          <div className="col-md-2 col-md-offset-3">
            <button className="btn btn-primary" onClick={this.handleRun} >Run</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={this.handlePause} >Pause</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={() => this.handleClear(this.state.numberRows, this.state.numberColumns)} >Clear</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 col-md-offset-5">
            Generations: {this.state.generation}
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="board">
              {mapDataToBoard(this.state.boardData)}
            </div>
          </div>
        </div>
        <div className="game-settings">
          <div className="row">
            Board Size
          </div>
          <div className="row">
            <div className="col-md-2 col-md-offset-3">
              <button onClick={() => this.changeBoardSize(40, 40)} className="btn btn-primary">40 x 40</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.changeBoardSize(50, 50)} className="btn btn-primary">50 x 50</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.changeBoardSize(60, 60)} className="btn btn-primary">60 x 60</button>
            </div>
          </div>
          <br />
          <div className="row">
            Speed
          </div>
          <div className="row">
            <div className="col-md-2 col-md-offset-3">
              <button onClick={() => this.changeBoardSpeed(600)}  className="btn btn-primary">Slow</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.changeBoardSpeed(300)}  className="btn btn-primary">Normal</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.changeBoardSpeed(100)}  className="btn btn-primary">Fast</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Main;