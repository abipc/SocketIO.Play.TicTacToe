var tictactoe = {

    matrix: [11, 12, 13, 14, 15, 16, 17, 18, 19],

    codeWin: {},
    
    /*
     *  array at any point of time holds a max of 2 entries
     *  entry 1 is player1 - marks 0        
     *  entry 2 is player2 - marks 1
     */

    players: [],

    waitingSocket: {},

    isValidMove: function (index, code) {
        var indexInMatrix = index - 1;
        if(tictactoe.matrix[indexInMatrix] > 10) {
            return true;
        } else {
            return false;
        }

    },

    isMatchOver: function() {
        var result = true;
        for(var i =0; i<tictactoe.matrix.length; i++) {
            if(tictactoe.matrix[i] < 10) {
                result = false;
                break;
            }
        }
        return result;
    },

    isMatchWon: function() {
        var winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        var numWin = winningCombinations.length;
        var result = false;
        for(var idx=0; idx<numWin; idx++) {
            if(tictactoe.matrix[winningCombinations[idx][0]] === tictactoe.matrix[winningCombinations[idx][1]] && 
                    tictactoe.matrix[winningCombinations[idx][0]]===tictactoe.matrix[winningCombinations[idx][2]]) {
                tictactoe.codeWin = tictactoe.matrix[winningCombinations[idx][0]];
                result = true;
            }                        
        }
        return result;
    },

    toggleSockets: function (soc) {
        tictactoe.waitingSocket = soc;
    }

};

exports.game = function() {
    return tictactoe;
};




