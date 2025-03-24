
Page({
  data: {
    cellArr: [],
    isGameover: false
  },
  onLoad: function () {
    this.startGame()
  },
  startGame() {
    this.setData({
      isGameover: false,
      cellArr: Array.from(Array(4)).map(() => Array(4).fill(0))
    })
    this.fillOneEmptyCell()
    this.fillOneEmptyCell()
  },
  fillOneEmptyCell() {
    const emptyCells = this.findEmptyCells()
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[this.random(emptyCells.length)]
      this.data.cellArr[row][col] = this.getRandomValue()
      this.setData({ cellArr: this.data.cellArr })
    }
  },
  getRandomValue() {
    return Math.random() < 0.9 ? 2 : 4
  },
  random(max) {
    return Math.floor(Math.random() * max)
  },
  findEmptyCells() {
    const emptyCells = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.data.cellArr[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }
    return emptyCells
  },
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart(ev) {
    const touch = ev.touches[0]
    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
  },
  touchMove(ev) {
    const touch = ev.touches[0]
    this.touchEndX = touch.clientX
    this.touchEndY = touch.clientY
  },
  touchEnd() {
    const disX = this.touchEndX - this.touchStartX
    const absDisX = Math.abs(disX)
    const disY = this.touchEndY - this.touchStartY
    const absDisY = Math.abs(disY)

    if (Math.max(absDisX, absDisY) > 10) {
      if (absDisX > absDisY) {
        this.move(disX > 0 ? 'right' : 'left')
      } else {
        this.move(disY > 0 ? 'down' : 'up')
      }
    }
  },
  move(direction) {
    this.moveCells(direction);
    this.checkGameOverOrContinue()
  },
  moveCells(direction) {
    const isHorzontal = direction === 'left' || direction === 'right'
    const isForward = direction === 'left' || direction === 'up'

    for (let i = 0; i < 4; i++) {
      const currentArr = isHorzontal ? this.data.cellArr[i] : this.data.cellArr.map(row => row[i])
      const resultArr = this.removeZerosAndAdd(currentArr, isForward)
      if (isHorzontal) {
        this.data.cellArr[i] = resultArr
      } else {
        resultArr.forEach((value, j) => (this.data.cellArr[j][i] = value))
      }
    }
    this.setData({ cellArr: this.data.cellArr })
  },
  removeZerosAndAdd(arr, isForward) {
    const nonZeroCells = arr.filter(x => x !== 0)
    const mergedCells = this.mergeCells(nonZeroCells, isForward)
    const result = new Array(4).fill(0)
    if (isForward) {
      result.splice(0, mergedCells.length, ...mergedCells)
    } else {
      result.splice(4 - mergedCells.length, mergedCells.length, ...mergedCells)
    }
    return result
  },
  mergeCells(cells, isForward) {
    if (!isForward) {
      cells = cells.reverse()
    }
    let result = []
    let i = 0
    while (i < cells.length) {
      if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
        result.push(cells[i] * 2)
        i += 2
      } else {
        result.push(cells[i])
        i += 1
      }
    }
    if (!isForward) {
      result = result.reverse()
    }
    return result
  },
  checkGameOverOrContinue() {
    if (this.canMove()) {
      this.fillOneEmptyCell()
    } else {
      this.setData({ isGameover: true })
    }
  },
  canMove(){
    const grid = this.data.cellArr
    for( let i=0;i<4;i++){
      for( let j=0;j<4;j++){
        if(grid[i][j] === 0){
          return true
        }
        if(j<3 && grid[i][j] === grid[i][j+1]){
          return true
        }
        if(i<3 && grid[i][j] === grid[i+1][j]){
          return true
        }
      }
    }
    return false
  }
})
