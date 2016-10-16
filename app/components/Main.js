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
      numberColumns: numberColumns
    };

    setInterval(function() {
      var that = this;

      function getNewCellState(boardData, rowNb, colNb) {
        function getNbOfAliveAndDeadNeighbours(boardData, rowNb, colNb) {
          var numberOfAliveNeighbours = 0;
          for(var i = rowNb - 1; i <= rowNb + 1; i++) {
            for(var j = colNb - 1; j <= colNb + 1; j++) {
              var tempRowIndex;
              var tempColumnIndex;
              if(i === -1) tempRowIndex = that.state.numberRows-1;
              else if(i === that.state.numberRows) tempRowIndex = 0;
              else tempRowIndex = i;

              if(j === -1) tempColumnIndex = that.state.numberColumns-1;
              else if(j === that.state.numberColumns) tempColumnIndex = 0;
              else tempColumnIndex = j;

              if(boardData[tempRowIndex][tempColumnIndex] > that.cellStates.dead && !(colNb === j && rowNb === i)) { numberOfAliveNeighbours++; }
            }
          }
          return numberOfAliveNeighbours;
        }

        function getStateByNumberOfAliveNeighbours(stateOfCell, numberOfAliveNeighbours) {
          if(numberOfAliveNeighbours < 2) return that.cellStates.dead;
          else if(numberOfAliveNeighbours === 2) {
            if(stateOfCell > that.cellStates.dead) return that.cellStates.old;
            else return that.cellStates.dead;
          }
          else if(numberOfAliveNeighbours === 3) {
            if(stateOfCell > that.cellStates.dead) return that.cellStates.old;
            else return that.cellStates.alive;
          }
          else return that.cellStates.dead;
        }

        var numberOfAliveNeighbours = getNbOfAliveAndDeadNeighbours(boardData, rowNb, colNb);
        return getStateByNumberOfAliveNeighbours(boardData[rowNb][colNb], numberOfAliveNeighbours);
      }

      var newBoardData = [];
      for(var i = 0; i < that.state.numberRows; i++) {
        newBoardData[i] = [];
        for(var j = 0; j < that.state.numberColumns; j++) {
          newBoardData[i][j] = getNewCellState(that.state.boardData, i, j);
        }
      }
      that.setState({boardData: newBoardData});
    }.bind(this), 100);

  }
  render() {
    var getClassNameForCell = function(cell) {
      if(cell === this.cellStates.dead) return 'dead';
      else if(cell === this.cellStates.alive) return 'alive';
      else if(cell === this.cellStates.old) return 'old';
    }.bind(this);

    function mapRowDataToRow(row) {
      return row.map(function(cell, i) {
        return <td className={getClassNameForCell(cell)} key={i} />
      })
    }
    function mapDataToBoard(data) {
      return data.map(function(row, i) {
        return <tr key={i}>
          {mapRowDataToRow(row)}
        </tr>
      })
    }
    return (
      <div className='container main-container'>
        <h1>THE GAME OF LIFE</h1>
        <div className="control-buttons row">
          <button className="col-md-2 col-md-offset-3">Run</button>
          <button className="col-md-2">Pause</button>
          <button className="col-md-2">Clear</button>
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