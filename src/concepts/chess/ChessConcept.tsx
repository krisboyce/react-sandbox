import { Button, makeStyles, TextField, useTheme } from '@material-ui/core';
import { ChessInstance, Square } from 'chess.js';
import { useState } from 'react';
import { ChessBoard } from './ChessBoard';
const ChessJs = require('chess.js')

const useStyles = makeStyles(theme => ({
    content: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    board: {
        width: '50%',
        display: 'flex'
    }
}));

export function ChessConcept() {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [chess] = useState<ChessInstance>(new ChessJs())
    const [move, setMove] = useState('');
    const [downSquare, setDown] = useState<Square>();
    const [board, setBoard] = useState(chess.board());
    
    function makeMove(move: string) {
        chess.move(move);
        setMove('');
        setBoard(chess.board);
        console.log(chess.history());
    }

    function mouseUp(rank: string, file: string) {
        if (downSquare) {
            let piece = chess.get(downSquare);
            let capture = chess.get((file + rank) as Square);
            let move = piece?.type !== 'p' ? piece?.type.toUpperCase() + (capture ? 'x' : '') + file + rank : (capture ? downSquare[0] + 'x' : '') + file + rank;
            console.log(move);
            makeMove(move);
        }
    }

    return <div className={classes.content}>
        <div className={classes.board}>
            <ChessBoard onMouseDown={(rank: string, file: string) => setDown((file + rank) as Square)} onMouseUp={mouseUp} boardState={board} />
        </div>
        <TextField value={move} onKeyDown={(e) => { if (e.key === 'Enter') makeMove(move) }} onChange={(e) => setMove(e.target.value)} />
        <Button onClick={() => makeMove(move)}>Move</Button>
        <pre>{chess.pgn()}</pre>
    </div>
}