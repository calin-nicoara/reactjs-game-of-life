var React = require('react');

require('../styles/main.sass');

class Main extends React.Component {
  constructor() {
    super();
    this.getClassNameForCell = this.getClassNameForCell.bind(this);
    this.mapRowDataToRow = this.mapRowDataToRow.bind(this);
    this.mapDataToBoard = this.mapDataToBoard.bind(this);
  }
  getClassNameForCell(cell) {
    if(cell === this.props.cellStates.dead) return 'dead';
    else if(cell === this.props.cellStates.alive) return 'alive';
    else if(cell === this.props.cellStates.old) return 'old';
  }
  mapRowDataToRow(row, rowIndex) {
    return row.map(function(cell, columnIndex) {
      return <div onClick={() => this.props.toggleCellState(rowIndex, columnIndex) } className={this.getClassNameForCell(cell) + " cell"} key={columnIndex} />
    }.bind(this))
  }
  mapDataToBoard(data) {
    return data.map(function(row, rowIndex) {
      return <div className="cell-row" key={rowIndex}>
        {this.mapRowDataToRow(row, rowIndex)}
      </div>
    }.bind(this))
  }
  render() {
    return (
      <div className='container main-container'>
        <h1>THE GAME OF LIFE</h1>
        <div className="control-buttons row">
          <div className="col-md-2 col-md-offset-3">
            <button className="btn btn-primary" onClick={this.props.handleRun} >Run</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={this.props.handlePause} >Pause</button>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={() => this.props.handleClear(this.props.numberRows, this.props.numberColumns)} >Clear</button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2 col-md-offset-5">
            Generations: {this.props.generation}
          </div>
        </div>

        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <div className="board">
              {this.mapDataToBoard(this.props.boardData)}
            </div>
          </div>
        </div>
        <div className="game-settings">
          <div className="row">
            Board Size
          </div>
          <div className="row">
            <div className="col-md-2 col-md-offset-3">
              <button onClick={() => this.props.changeBoardSize(40, 40)} className="btn btn-primary">40 x 40</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.props.changeBoardSize(50, 50)} className="btn btn-primary">50 x 50</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.props.changeBoardSize(60, 60)} className="btn btn-primary">60 x 60</button>
            </div>
          </div>
          <br />
          <div className="row">
            Speed
          </div>
          <div className="row">
            <div className="col-md-2 col-md-offset-3">
              <button onClick={() => this.props.changeBoardSpeed(600)}  className="btn btn-primary">Slow</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.props.changeBoardSpeed(300)}  className="btn btn-primary">Normal</button>
            </div>
            <div className="col-md-2">
              <button onClick={() => this.props.changeBoardSpeed(100)}  className="btn btn-primary">Fast</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Main.propTypes = {
  cellStates: React.PropTypes.object.isRequired,
  handleRun: React.PropTypes.func.isRequired,
  handlePause: React.PropTypes.func.isRequired,
  handleClear: React.PropTypes.func.isRequired,
  toggleCellState: React.PropTypes.func.isRequired,
  generation: React.PropTypes.number.isRequired,
  boardData: React.PropTypes.array.isRequired,
  changeBoardSize: React.PropTypes.func.isRequired,
  changeBoardSpeed: React.PropTypes.func.isRequired,
  numberRows: React.PropTypes.number.isRequired,
  numberColumns: React.PropTypes.number.isRequired
};


module.exports = Main;