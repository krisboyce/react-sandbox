import { makeStyles, useTheme } from "@material-ui/core";
import { FunctionComponent } from "react"

export type BoardProps = {
    boardState: ({ type: string; color: string } | null)[][];
    onMouseDown?: (rank: string, file: string) => void
    onMouseUp?: (rank: string, file: string) => void
}

const useStyles = makeStyles(theme => (
    {
        Board: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        Rank: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: 100 / 8 + "%"
        },
        Square: {
            display: 'flex',
            width: 100 / 8 + "%",
            justifyContent: 'center',
            alignItems: 'center',
            userSelect: 'none',
            fontWeight: theme.typography.fontWeightBold,
            fontSize: theme.typography.fontSize * 4,
            '&:before': {
                content: "''",
                display: 'block',
                paddingBottom: '100%'
            }
        },
        Dark: {
            background: '#864'
        },
        Light: {
            background: '#ED9'
        },
        WhitePeice: {
            color: '#FFF'
        },
        BlackPeice: {
            color: '#000'
        }
    }
))



export const ChessBoard: FunctionComponent<BoardProps> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    function getFileString(file: number) {
        return String.fromCharCode('a'.charCodeAt(0) + (file-1))
    }

    function mouseDown(rank: number, file: number) {
        console.log(getFileString(file) + rank);
        if (props.onMouseDown) props.onMouseDown(rank.toString(), getFileString(file))
    }

    function mouseUp(rank: number, file: number) {
        if (props.onMouseUp) props.onMouseUp(rank.toString(), getFileString(file))
    }

    function getSquareClassname(rank: number, file: number, piece: { type: string; color: string } | null) {
        return classes.Square + ' '
            + ((rank + file) % 2 === 0 ? classes.Light : classes.Dark)
            + ' ' + (piece
                ? piece.color === 'w'
                ? classes.WhitePeice
                : classes.BlackPeice
            : '')
    }

    function getAsciiChessPiece(isWhite: boolean, type: string | undefined) {
        switch (type) {
            case 'k': return isWhite ? <> &#9812;</> : <>&#9818;</>
            case 'q': return isWhite ? <> &#9813;</> : <>&#9819;</>
            case 'r': return isWhite ? <> &#9814;</> : <>&#9820;</>
            case 'b': return isWhite ? <> &#9815;</> : <>&#9821;</>
            case 'n': return isWhite ? <> &#9816;</> : <>&#9822;</>
            case 'p': return isWhite ? <> &#9817;</> : <>&#9823;</>
            default: return <></>
        }
    }

    function buildRank(rankNumber: number, rank: ({ type: string; color: string } | null)[]) {
        let squares = [];
        let file = 0;
        for (let square of rank) {
            let f = file + 1;
            squares.push(
                <div
                    onMouseDown={() => mouseDown(rankNumber, f)}
                    onMouseUp={() => mouseUp(rankNumber, f)}
                    className={getSquareClassname(rankNumber, file, rank[file])}>
                    {getAsciiChessPiece(square?.color === 'w', square?.type)}
                </div>)
            file++;
        }

        return squares;
    }

    function board() {
        let ranks = [];
        let rankNumber = 8;
        for (let rank of props.boardState) {
            ranks.push(<div className={classes.Rank}>{buildRank(rankNumber, rank)}</div>)
            rankNumber--;
        }
        return ranks;
    }

    return <div className={classes.Board}>
        {board()}
    </div>
}