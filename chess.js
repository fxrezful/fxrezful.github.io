const main = document.getElementById("chessboard");

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        const tile = document.createElement("div");
        const color = ((i + j) % 2 === 0) ? "px; background-color: rgb(150, 150, 150);" : "px; background-color: rgb(60, 60, 60);"

        tile.style = "left: " + (j * 50).toString() + "px; top: " + (i * 50).toString() + color
        tile.className = "tile";

        main.appendChild(tile);
    }
}

let square = 0;

//const fen = "k888888K";

const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

const isWhite = function(piece) {
    return piece > 0
}   

const outOfBounds = function(piece, move, range) {
    if (Math.abs(piece % 8 - move % 8) > range || Math.abs(Math.floor(piece / 8) - Math.floor(move / 8)) > range) {
        return false
    } else if (move < 0 || move > 63) {
        return false
    } else {
        return true
    }
}

const mainGame = {
    board: [],
    kings: [],
    repetition: 0,
    lastCaptureOrPawnPush: 0,
}

const rangedMove = function(piece, position, directions, range) {
    const moves = []

    for (let direction of directions) {
        let previous = piece

        for (let move = piece + direction; move !== piece + direction * range; move += direction) {
            if (outOfBounds(previous, move, 1) === false) {
                break
            }

            if (!(position[move])) {
                moves.push([piece, move])
            } else {
                if (isWhite(position[move]) !== isWhite(position[piece])) {
                    moves.unshift([piece, move])
                }

                break
            }

            previous = move
        }
    }

    return moves
}

const pieces = {
    [1]: {
        name: "k",
        value: 20000,

        move: function(piece, position) {
            const moves = pieces[8].move(piece, position)

            /*

            for (let enemyPiece in position) {
                if (Math.abs(position[enemyPiece]) !== 1 && isWhite(position[enemyPiece]) !== isWhite(position[piece])) {
                    for (let move in pieces[Math.abs(position[piece])].move(enemyPiece, position)) {
                        if (move[1] == piece) {
                            return moves
                        }
                    }
                }
            }

            */

            for (let move of moves) {
                move[2] = 5
            }
            
            if (isWhite(position[piece])) {
                if (!(position[61] || position[62]) && position[63] == 5) {
                    moves.unshift(moves, [60, 62, 4, 63, 61])
                }

                if (!(position[57] || position[58] || position[59]) && position[56] == 5) {
                    moves.unshift(moves, [60, 58, 4, 56, 59])
                }
            } else {
                if (!(position[5] || position[6]) && position[7] == 5) {
                    moves.unshift(moves, [4, 6, 4, 5, 3])
                }

                if (!(position[1] || position[2] || position[3]) && position[0] == 5) {
                    moves.unshift(moves, [4, 2, 4, 0, 3])
                }
            }

            return moves
        }
    },

    [2]: {
        name: "q",
        value: 900,

        move: function(piece, position) {
            return rangedMove(piece, position, [-9, -8, -7, -1, 1, 7, 8, 9], 7)
        }
    },

    [3]: {
        name: "b",
        value: 320,

        move: function(piece, position) {
            return rangedMove(piece, position, [-9, -7, 7, 9], 7)
        }
    },

    [4]: {
        name: "n",
        value: 300,

        move: function(piece, position) {
            const moves = []

            for (let move of [-17, -15, -10, -6, 6, 10, 15, 17]) {
                if (outOfBounds(piece, piece + move, 2) === false) {
                    continue
                }

                if (!(position[piece + move])) {
                    moves.push([piece, piece + move])
                } else if (isWhite(position[piece]) !== isWhite(position[piece + move])) {
                    moves.unshift([piece, piece + move])
                }
            }

            return moves
        }
    },

    [5]: {
        name: "r",
        value: 500,

        move: function(piece, position) {
            return rangedMove(piece, position, [-8, -1, 1, 8], 7)
        }
    },

    [6]: {
        name: "p",
        value: 100,

        move: function(piece, position) {
            const moves = []
            const white = isWhite(position[piece])
            const inverted = white? 1 : -1
            const rank = Math.floor(piece / 8)

            const pawnMove = function(promotion) {
                if (!(position[piece + 8 * inverted])) {
                    moves.push([piece, piece + 8 * inverted, promotion? 1 : undefined, promotion])
    
                    if (!(position[piece + 16 * inverted]) && rank === (white? 1 : 6) && !promotion) {
                        moves.push([piece, piece + 16 * inverted, 2])
                    }
                }
    
                for (let diagonal of [-1, 1]) {
                    const move = piece + 8 * inverted + diagonal
                    
                    if (outOfBounds(piece, move, 1) === false) {
                        continue
                    }
    
                    if (position[piece + diagonal] == 7 && !promotion) {
                        moves.unshift([piece, move, 3, piece + diagonal])
    
                        continue
                    }
    
                    if (position[move] && isWhite(position[move]) !== white) {
                        moves.unshift([piece, move, promotion? 1 : undefined, promotion])
                    }
                }
            }

            if (rank === (white? 6 : 1)) {
                for (let promotionPiece of [2, 3, 4, 5]) {
                    pawnMove(promotionPiece)
                }
            } else {
                pawnMove()
            }

            return moves
        }
    }
}

pieces[7] = {
    value: 100,
    move: pieces[6].move
}

pieces[8] = {
    value: 20000,
    move: function(piece, position) {
        return rangedMove(piece, position, [-9, -8, -7, -1, 1, 7, 8, 9], 2)
    }
}

const squareTables = [
    [],

    [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
        20, 20,  0,  0,  0,  0, 20, 20,
        20, 30, 10,  0,  0, 10, 30, 20
    ],

    [
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
        -5,  0,  5,  5,  5,  5,  0, -5,
        0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20
    ],

    [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20,
    ],

    [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50,
    ],

    [
        0,  0,  0,  0,  0,  0,  0,  0,
        5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        0,  0,  0,  5,  5,  0,  0,  0
    ],

    [
        0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
         5,  5, 10, 25, 25, 10,  5,  5,
         0,  0,  0, 20, 20,  0,  0,  0,
         5, -5,-10,  0,  0,-10, -5,  5,
         5, 10, 10,-20,-20, 10, 10,  5,
         0,  0,  0,  0,  0,  0,  0,  0
    ],
]

squareTables[7] = squareTables[6]
squareTables[8] = squareTables[1]

const images = []

for (let i of fen) {
    if (Number(i)) {
        square += Number(i)
    } else if (i !== "/") {
        let pieceImage = document.createElement("img")

        pieceImage.className = "piece"

        for (let piece in pieces) {
            if (pieces[piece].name === i.toLowerCase()) {
                const white = i === i.toLowerCase()
                pieceImage.setAttribute("src", "chess-pieces/" + (white? "b" : "w") + i.toLowerCase() + ".png")
                mainGame.board[square] = white? Number(piece) : -Number(piece)
                pieceImage.style = "left:" + ((square % 8) * 50).toString() + "px; top: " + (Math.floor((square / 8)) * 50).toString() + "px;"
                images[square] = pieceImage

                if (piece == 1) {
                    mainGame.kings[white] = square
                }

                break
            }
        }

        main.appendChild(pieceImage)    

        square++
    }
}

const randomInt = function(max) {
    return Math.floor(Math.random() * max)
}

const playMove = function(game, move, replicate) {
    if (replicate === true) {
        // console.log(move)

        if (images[move[1]]) {
            images[move[1]].remove()
        }

        images[move[1]] = images[move[0]]
        images[move[0]].style = "left:" + ((move[1] % 8) * 50).toString() + "px; top: " + (Math.floor((move[1] / 8)) * 50).toString() + "px;"
        images[move[0]] = undefined
    }

    game.board[move[1]] = game.board[move[0]]
    game.board[move[0]] = undefined

    for (let piece in game.board) {
        if (game.board[piece] === 7) {
            game.board[piece] = 6
        } else if (game.board[piece] === -7) {
            game.board[piece] = -6
        }
    }

    if (Math.abs(game.board[move[1]]) == 1 || Math.abs(game.board[move[1]]) == 8) {
        game.kings[isWhite(game.board[move[1]])] = move[1]
    }

    if (move[2] === 1) {
        if (replicate === true) {
            const name = pieces[move[3]].name

            images[move[1]].setAttribute("src", "chess-pieces" + (isWhite(game.board[move[1]])? "b" : "w") + name + ".png")
        }

        game.board[move[1]] = isWhite(game.board[move[1]])? move[3] : -move[3]
    } else if (move[2] === 2) {
        game.board[move[1]] = isWhite(game.board[move[1]])? 7 : -7
    } else if (move[2] === 3) {
        if (images[move[3]] && replicate === true) {
            images[move[3]].remove()
        }

        game.board[move[3]] = undefined
    } else if (move[2] === 4) {
        playMove(game, [move[3], move[4]], replicate)
    } else if (move[2] === 5) {
        game.board[move[1]] = isWhite(game.board[move[1]])? 8 : -8
    }
}

const evaluate = function(game) {
    let evaluation = 0;

    for (let square in game.board) {
        if (game.board[square]) {
            if (isWhite(game.board[square])) {
                evaluation += squareTables[game.board[square]][63 - square]
                evaluation += pieces[game.board[square]].value
            } else {
                evaluation -= squareTables[-game.board[square]][square]
                evaluation -= pieces[-game.board[square]].value
            }
        }
    }

    return evaluation;
}

const createNode = function(game) {
    const node = {}

    node.board = []
    node.kings = []

    for (pieceCopy in game.board) {
        node.board[pieceCopy] = game.board[pieceCopy]
    }

    node.kings[true] = game.kings[true]
    node.kings[false] = game.kings[false]

    return node
}

const minimax = function(game, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0) {
        return [evaluate(game)]
    }

    let bestEvaluation = maximizingPlayer? -Infinity: Infinity;
    let bestMove;

    for (let move of getMoves(game, maximizingPlayer)) {
        const node = createNode(game);
        playMove(node, move);

        const evaluation = minimax(node, depth - 1, alpha, beta, !maximizingPlayer)[0]

        if (maximizingPlayer === true) {
            if (bestEvaluation < evaluation) {
                bestMove = move;
                bestEvaluation = evaluation;
            }

            alpha = Math.max(alpha, evaluation)
        } else {
            if (bestEvaluation > evaluation) {
                bestMove = move;
                bestEvaluation = evaluation;
            }

            beta = Math.min(beta, evaluation)
        }

        if (beta <= alpha) {
            break
        }
    }

    return [bestEvaluation, bestMove]
}

const getMoves = function(game, whiteToMove) {
    const moves = []

    for (let piece in game.board) {
        if (game.board[piece] && isWhite(game.board[piece]) === whiteToMove) {
            for (let move of pieces[Math.abs(game.board[piece])].move(Number(piece), game.board)) {
                const node = createNode(game)
                let legal = true

                playMove(node, move)

                for (enemyPiece in node.board) {
                    if (node.board[enemyPiece] && isWhite(node.board[enemyPiece]) !== whiteToMove) {
                        for (let response of pieces[Math.abs(node.board[enemyPiece])].move(Number(enemyPiece), node.board)) {
                            if (response[1] == node.kings[whiteToMove]) {
                                legal = false

                                break
                            }
                        }
                    }

                    if (legal === false) {
                        break
                    }
                }

                if (legal === true) {
                    moves.push(move)
                }
            }
        }
    }

    return moves
}

const playRandomMove = function(whiteToMove) {
    const evaluated = minimax(mainGame, 4, -Infinity, Infinity, whiteToMove)

    playMove(mainGame, evaluated[1], true)
    setTimeout(playRandomMove, 1000, !whiteToMove)
}

setTimeout(playRandomMove, 5000, false)