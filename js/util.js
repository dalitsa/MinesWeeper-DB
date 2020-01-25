'use strict';



function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  function isEmpty(i,j){
	return gBoard[i][j].gameElement===null;
}  




function stopTimer() {
    clearInterval(gInterval)
}


function startTimer() {
    var startTime = new Date().getTime();
    gInterval = setInterval(timer, 2, startTime);

}

function timer(startTime) {
    var time = document.querySelector('.timer')
    var updateTime = new Date().getTime();
    var difference = updateTime - startTime;
    var seconds = difference / 1000
    time.innerText = seconds;
    gGame.secsPassed=seconds;

}

function resetTimer() {
    var elTimer = document.querySelector('.timer')
    stopTimer()
    elTimer.innerText = '00:00'

}
