'use strict';

//********TODO */
//1- make sure random mine positions are different!


// GLOBALS:

var gBoard = []          // each cell in the board is an object 



// var gLevel = { SIZE: 4, MINES: 2 };
var gShownCounter = 0
var gChosenLevelIdx = 0;
var gLevels = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 12 }, { SIZE: 12, MINES: 30 }]
var gMinesPoss = []//[{ iKey: 0, jKey: 1 }, { iKey: 2, jKey: 0 }];
var MINE = 'MINE'//`U+1F4A3`;
var EMPTY = 'EMPTY';
var MINE_IMG = '<img  src="img/Mine.png" />';
var COVERED_IMG = '<img  src="img/covered.png" />';
var FLAG_IMG = '<img src="img/Flag.png" />';
var WIN = '<img src="img/unicorn.png" />'
var DEAD = '<img src="img/scream.png" />'
var SMILY = '<img src="img/smile.png" />'
var LIFE = '<img src="img/colorLife.png" />'
var USEDLIFE = '<img src="img/usedLife.png" />'
var BELL = '<img src="img/bell.png" />'
var FIRST = '<img src="first/bell.png" />' 
localStorage.setItem('BesTime', +Infinity)





var gGame = {
    isOn: false,            //   isOn – boolean, when true we let the user play   
    shownCount: 0,          //   shownCount: how many cells are shown 
    markedCount: 0,         //   markedCount: how many cells are marked (with a flag)
    secsPassed: 0           //   secsPassed: how many seconds passed
};



// This is called when page loads 
function initGame() {
    gShownCounter = 0;
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    console.log('GOOD LUCK')
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log(gMinesPoss)
    var Lives = document.querySelectorAll('.Lives button')
    for (var i = 0; i < Lives.length; i++) {
        Lives[i].innerHTML = LIFE
    }


}

// Builds the board   Set mines at random locations Call setMinesNegsCount() Return the created board 
function buildBoard() {
    randomMinePos()
    var board = [];
    for (var i = 0; i < gLevels[gChosenLevelIdx].SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevels[gChosenLevelIdx].SIZE; j++) {
            board[i][j] = createCell(i, j);

        }
    }
    setMinesNegsCount(board)
    console.dir(board);
    return board;
}


function randomMinePos() {
    var mineCount = gLevels[gChosenLevelIdx].MINES;
    for (var i = 0; i < mineCount; i++) {
        var mineI = getRandomInt(0, gLevels[gChosenLevelIdx].SIZE - 1)
        var mineJ = getRandomInt(0, gLevels[gChosenLevelIdx].SIZE - 1)
        
        var newMinePos = { iKey: mineI, jKey: mineJ }
        gMinesPoss.push(newMinePos)
        
        // renderCell(newMinePos, MINE)
    }
    return;
}

function createCell(i, j) {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: isPosOfMine(i, j),
        isMarked: false
    }
    return cell
}

function isPosOfMine(posI, posJ) {
    var numOfMine = gLevels[gChosenLevelIdx].MINES;
    for (var i = 0; i < numOfMine; i++) {
        if (gMinesPoss[i].iKey === posI && gMinesPoss[i].jKey === posJ) return true;
    }
    return false
}

//Count mines around each cell and set the cell's minesAroundCount. 
function setMinesNegsCount(board) {
    var currSize = gLevels[gChosenLevelIdx].SIZE;
    for (var i = 0; i < currSize; i++) {
        for (var j = 0; j < currSize; j++) {
            var cell = board[i][j];
            var count = calculateNegs(board, i, j)
            cell.minesAroundCount = count;
        }
    }


}

function calculateNegs(board, posI, posJ) {
    var currSize = gLevels[gChosenLevelIdx].SIZE;
    var count = 0
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= currSize) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= currSize) continue;
            if (i === posI && j === posJ) continue;
            var cell = board[i][j];
            if (cell.isMine) count++
        }

    }
    return count;

}

//Render the board as a <table> to the page 
function renderBoard(board) {
    var currSize = gLevels[gChosenLevelIdx].SIZE;
    var strHTML = '';
    for (var i = 0; i < currSize; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < currSize; j++) {
            var cellVal = board[i][j]
            var minesCount = cellVal.minesAroundCount;
            var isShownVal = cellVal.isShown;
            var isMineVal = cellVal.isMine
            var isMarkedVal = cellVal.isMarked
            var className = setClassName(cellVal, i, j)
            var cellContent = COVERED_IMG
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td  
                class="${className} " 
                id="${tdId}"
                data-minesAroundCount="${minesCount} "
                data-isShown="${isShownVal} "
                data-isMine="${isMineVal} "
                data-isMarked="${isMarkedVal}" 
                onmousedown="cellClicked(this, ${i}, ${j},event)"
                >${cellContent} </td>`;
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;




}

function setClassName(cellVal, i, j, ) {
    var strHTML = ''
    strHTML += `cell `
    if (cellVal.isMarked) cellVal.classList.add("marked")
    if (cellVal.isShown) cellVal.classList.add("shown")
    return strHTML;
}

function setCellContent(cellVal, i, j) {
    var content;
    var minesCount = +cellVal.dataset.minesaroundcount
    if (cellVal.dataset.ismine === "true") gameOver(MINE)
    else if (minesCount > 0) content = cellVal.dataset.minesaroundcount;
    else if (minesCount === 0) content = ''

    return content
}
function renderCell(tdId, value) {
    var cellSelector = `#${tdId}`
    gShownCounter++
    checkGameOver()
    console.log(gShownCounter)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}


//Called when a cell (td) is clicked
function cellClicked(elCell, i, j, ev) {
    if (!gGame.isOn) return
    if (gGame.secsPassed===0) startTimer()
    if (ev.button === 0) exposingboard(elCell, i, j)
    else if (ev.button === 2) setFlagImg(elCell, i, j)


}
function setFlagImg(elCell, i, j) {
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        elCell.dataset.isMarked = false
        gGame.markedCount--
        renderCell(elCell.id, COVERED_IMG)


    }
    else {
        gBoard[i][j].isMarked = true;
        elCell.dataset.isMarked = true;
        renderCell(elCell.id, FLAG_IMG)
        gGame.markedCount++
        gShownCounter--
        checkGameOver()
    }
}
//
function exposingboard(elCell, posI, posJ) {
    console.log('cell', posI, posJ, 'isClicked')
    if (gBoard[posI][posJ].isMine) gameOver(MINE)
    if (gBoard[posI][posJ].isMarked) return
    if (gBoard[posI][posJ].isShown) return
    gBoard[posI][posJ].isShown = true;
    elCell.dataset.isshown = true;
    var value = setCellContent(elCell, posI, posJ)
    renderCell(elCell.id, value)
    if (gBoard[posI][posJ].minesAroundCount === 0) exposeNegs(elCell, posI, posJ)


}

function exposeNegs(elCell, posI, posJ) {
    var emptyCellPos = []
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gLevels[gChosenLevelIdx].SIZE) continue
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gLevels[gChosenLevelIdx].SIZE) continue
            if (i === posI && j === posJ) continue
            if (gBoard[i][j].isMine) continue
            if (gBoard[i][j].isShown) continue
            else {
                gBoard[i][j].isShown = true;
                gBoard[i][j].isMarked = false
                elCell.dataset.isshown = true;
                elCell.dataset.ismarked = false
                var coord = { i: i, j: j }
                if (gBoard[i][j].minesAroundCount === 0) emptyCellPos.push(coord)   //   <----Empty Cells Array
                var elId = `cell-${i}-${j}`
                var eltestedCell = document.querySelector('#' + elId)
                var value = setCellContent(eltestedCell, i, j)
                renderCell(eltestedCell.id, value)
                checkGameOver()
            }

        }
    }
    // keep loopig on each of the empty cells (any new empty cells will be pushed and checked as well)
    while (emptyCellPos.length) {
        var cell = emptyCellPos.pop()
        var posI = cell.i
        var posJ = cell.j
        for (var i = posI - 1; i <= posI + 1; i++) {
            if (i < 0 || i >= gLevels[gChosenLevelIdx].SIZE) continue
            for (var j = posJ - 1; j <= posJ + 1; j++) {
                if (j < 0 || j >= gLevels[gChosenLevelIdx].SIZE) continue
                if (i === posI && j === posJ) continue
                if (gBoard[i][j].isMine) continue
                if (gBoard[i][j].isShown) continue
                else {
                    gBoard[i][j].isShown = true;
                    gBoard[i][j].isMarked = false
                    elCell.dataset.isshown = true;
                    elCell.dataset.ismarked = false
                    var coord = { i: i, j: j }
                    if (gBoard[i][j].minesAroundCount === 0) emptyCellPos.push(coord)
                    var elId = `cell-${i}-${j}`
                    var eltestedCell = document.querySelector('#' + elId)
                    var value = setCellContent(eltestedCell, i, j)
                    renderCell(eltestedCell.id, value)

                }

            }

        }

    }
}

function gameOver(value) {
    stopTimer()
    gGame.isOn = false
    switch (value) {
        case MINE:
            console.log('OOOHHH No')
            for (var i = 0; i < gMinesPoss.length; i++) {
                var MineId = `cell-${gMinesPoss[i].iKey}-${gMinesPoss[i].jKey}`
                var elMine = document.querySelector('#' + MineId)
                elMine.innerHTML = `${MINE_IMG}`
            }
            var smily = document.querySelector('.smily')
            smily.innerHTML = DEAD
            gGame.isOn = false
    }
}


// Called on right click to mark a cell (suspected to be a mine) Search the web 
// (and implement) how to hide the context menu on right click 

function cellMarked(elCell) {// implemented above under the name: setFlagImg


}

//Game ends when all mines are marked and all the other cells are shown
function checkGameOver() {
    var chosenSize = gLevels[gChosenLevelIdx].SIZE
    var mineNum = gLevels[gChosenLevelIdx].MINES
    var goalShownCount = (chosenSize ** 2) - mineNum
    var flagNum = mineNum
    if (goalShownCount == gShownCounter && flagNum == gGame.markedCount) {
        console.log('Victory!!!')
        var smily = document.querySelector('.smily')
        smily.innerHTML = WIN
        gGame.isOn = false
        var BestTimeTillNow= localStorage.getItem('BesTime')
        console.log(BestTimeTillNow);
        if(gGame.secsPassed<BestTimeTillNow){
            console.log(`It's World Record!!`)
            localStorage.setItem('BesTime',gGame.secsPassed)
            var elbody= document.querySelector('body')

        }
    }


    // localStorage.setItem('Best Time', gGame.secsPassed);
    // (localStorage.getItem('Name')== null){
    //     var userName = prompt("what's your name?")

    //     var Name = localStorage.getItem('Name');

}

// When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.  

// NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors 

// BONUS: if you have the time later, try to work more like the real algorithm (see description at the Bonuses section below) 

function expandShown(board, elCell, i, j) {


}

function setLevel(num) {
    stopTimer()
    resetTimer()
    gGame.secsPassed = 0
    switch (num) {
        case 0:
            gChosenLevelIdx = 0
            initGame()
            break
        case 1:
            gChosenLevelIdx = 1
            initGame()
            break
        case 2:
            gChosenLevelIdx = 2
            initGame()
            break

    }
}

function restart() {
    var smily = document.querySelector('.smily')
    smily.innerHTML = SMILY
    initGame()
}
//implementation of Safe Click ...
function safeClick(elLife) {
    elLife.innerHTML = USEDLIFE
    setTimeout(() => {
        elLife.hidden = true
    }, 500);
    var safePos = []
    for (var i = 0; i < gLevels[gChosenLevelIdx].SIZE; i++) {
        for (var j = 0; j < gLevels[gChosenLevelIdx].SIZE; j++) {
            var cell = gBoard[i][j]
            if (cell.isShown === true || cell.ismine === true) continue
            else{
           
            var coord = { i: i, j: j }
            safePos.push(coord)
            }
        }
    }
    console.log(safePos)
    var safeIdx = getRandomInt(0, safePos.length)
    console.log(safeIdx)
    console.log(safePos[safeIdx])
    var posI = safePos[safeIdx].i
    var posJ = safePos[safeIdx].j
    var elCellId = `cell-${posI}-${posJ}`
    var elCell = document.querySelector(`#${elCellId}`)
    elCell.innerHTML = BELL
    setTimeout(() => {
        elCell.innerHTML = COVERED_IMG
    }, 400);
    return
}

