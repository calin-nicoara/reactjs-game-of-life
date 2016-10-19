var React = require('react');
var Main = require('./Main');

class MainContainer extends React.Component {
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
    this.toggleCellState = this.toggleCellState.bind(this);
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
    this.setState({
      intervalMilliSeconds: milliseconds,
    });

    if(this.state.isRunning) {
      clearInterval(this.state.interval);
      this.setState({
        interval: setInterval(this.interval, milliseconds)
      });
    }

  }
  render() {
    return (
      <Main
        cellStates={this.cellStates}
        generation={this.state.generation}
        boardData={this.state.boardData}
        numberRows={this.state.numberRows}
        numberColumns={this.state.numberColumns}
        handleRun={this.handleRun}
        handlePause={this.handlePause}
        handleClear={this.handleClear}
        changeBoardSize={this.changeBoardSize}
        changeBoardSpeed={this.changeBoardSpeed}
        toggleCellState={this.toggleCellState}
      />
    )
  }
}

module.exports = MainContainer;