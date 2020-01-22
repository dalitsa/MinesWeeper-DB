'use strict';

//********TODO */
//1- make sure random mine positions are different!

// GLOBALS:

var gBoard = []          // each cell in the board is an object built like:
// { minesAroundCount: 4,
//  isShown: true,
//  isMine: false,
//isMarked: true}


// var gLevel = { SIZE: 4, MINES: 2 };
var gChosenLevelIdx = 0;
var gLevels = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 12 }, { SIZE: 12, MINES: 30 }]
var gMinesPoss = []//[{ iKey: 0, jKey: 1 }, { iKey: 2, jKey: 0 }];
var MINE = 'MINE';
var EMPTY = 'EMPTY';
var MINE_IMG = '<img class ="notShown" src="img/MINE.png" />';
var COVERED_IMG = '<img src="img/covered.png" />';
// var EMPTY_IMG= 



var gGame = {
    isOn: false,           //   isOn – boolean, when true we let the user play   
    shownCount: 0,          //  shownCount: how many cells are shown 
    markedCount: 0,         // markedCount: how many cells are marked (with a flag)
    secsPassed: 0
};        //secsPassed: how many seconds passed



// This is called when page loads 
function initGame() {
    console.log('GOOD LUCK')
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log(gMinesPoss)
    var checkedCell = document.querySelector('#cell-1-1')
    console.log(checkedCell)

}

// Builds the board   Set mines at random locations Call setMinesNegsCount() Return the created board 
function buildBoard() {
    randomMinePos()
    var board = [];
    for (var i = 0; i < gLevels[gChosenLevelIdx].SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevels[gChosenLevelIdx].SIZE; j++) {
            board[i][j] = createCell(i, j);
            // if (!isPosOfMine()){
            // console.dir(board[i][j])
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
        // gBoard[mineI][mineJ].isMINE = true;
        var newMinePos = { iKey: mineI, jKey: mineJ }
        gMinesPoss.push(newMinePos)
        // renderCell(newMinePos, MINE)
    }
    // gRandomBallCount++
    return;
}

function createCell(i, j) {
    // var isIt=isPosOfMine(i, j)
    // console.log(isIt)
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
    // console.log(count)
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
            var cellContent = setCellContent(cellVal, i, j)
            var tdId = `cell-${i}-${j}`;
            // strHTML += '<td>' + cellVal + '</td>';
            // var className = (board[i][j] === LIFE) ? 'occupied' : '';
            strHTML += `<td  
                class="${className} " 
                id="${tdId}"
                data-minesAroundCount="${minesCount} "
                data-isShown="${isShownVal} "
                data-isMine="${isMineVal} "
                data-isMarked="${isMarkedVal} "
                onclick="cellClicked(this, ${i}, ${j}) "
                >${cellContent} </td>`;
        }
        strHTML += '</tr>'
        // console.log(strHTML)
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;




}

function setClassName(cellVal, i, j, ) {
    var strHTML = ''
    strHTML += `cell `
    if (cellVal.isMarked) cellVal.classList.add ("marked")
    if (cellVal.isShown) cellVal.classList.add ("shown")
    // console.log(cellVal.classList)
    return strHTML;
}

function setCellContent(cellVal, i, j) {
    var content;
    if (!cellVal.isShown) content = COVERED_IMG
    else if (cellVal.isMine) content = MINE_IMG
    else if (cellVal.minesAroundCount > 0) content = cellVal.minesAroundCount;
    else content = ''

    return content
}
function renderCell(tdId, value) {
    var cellSelector = `#${tdId}`
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

// function renderCell(el){
//     el.dataset.
// }


//Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    console.log('cell', i, j, 'isClicked')
    gBoard[i][j].isShown=true;
    elCell.dataset.isshown = true;
    var value=setCellContent(gBoard[i][j])
    // console.dir(elCell)
    // console.dir(gBoard[i][j])
    renderCell(elCell.id,value)


}


// Called on right click to mark a cell (suspected to be a mine) Search the web 
// (and implement) how to hide the context menu on right click 
function cellMarked(elCell) {


}

//me ends when all mines are marked and all the other cells are shown
function checkGameOver() {

}

// When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors.  

// NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors 

// BONUS: if you have the time later, try to work more like the real algorithm (see description at the Bonuses section below) 

function expandShown(board, elCell, i, j) {


}

// function cardClicked(elCard) {


//     start = Date.now()
//     // if we clicked 2 cards already- return
//     if (isProessing == true) {
//         return;
//     }

//     // If the user clicked an already flipped card - do nothing and return from the function
//     if (elCard.classList.contains('flipped')) {
//         return;
//     }

//     // Flip it
//     elCard.classList.add('flipped');

//     // This is a first card, only keep it in the global variable
//     if (elPreviousCard === null) {
//         elPreviousCard = elCard;
//     } else {
//         // get the data-card attribute's value from both cards
//         var card1 = elPreviousCard.getAttribute('data-card');
//         var card2 = elCard.getAttribute('data-card');

//         // No match, schedule to flip them back in 1 second
//         if (card1 !== card2) {
//             isProessing = true;
//             setTimeout(function () {
//                 audioNoMatch.play()
//                 setTimeout(function () {
//                     elCard.classList.remove('flipped');
//                     elPreviousCard.classList.remove('flipped');
//                     elPreviousCard = null;
//                     isProessing = false;
//                 }, 1000)

//             }, 500)

//         } else {
//             // Yes! a match!

//             flippedCouplesCount++;
//             elPreviousCard = null;
//             audioMatch.play();

//             // All cards flipped!
//             if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
//                 var end = Date.now()
//                 setTimeout(function () {
//                     audioWin.play();
//                     var time = (end - start);
//                     alert(" it took you " + (time) + " seconds to finish the game");
//                     localStorage.setItem('currentTime', time);
//                     if (localStorage.getItem('BestTime') == null) {
//                         localStorage.setItem('BestTime', best);
//                     }
//                     if ((localStorage.getItem('BestTime')) > (localStorage.getItem('currentTime'))) {
//                         localStorage.setItem('BestTime', localStorage.getItem('currentTime'));
//                         alert("this is a new record");
//                     } else {
//                         alert("time record is " + localStorage.getItem('BestTime'))
//                     }

//                     var vis1 = document.getElementsByClassName("resetBtn")[0];
//                     console.log(vis1);
//                     vis1.style.display = 'block';



//                 }, 2000)



//             }

//         }


//     }


// }


