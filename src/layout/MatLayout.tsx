import './MatLayout.css';
import 'fontsource-roboto';
import { AppBar, Container, CssBaseline, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu'
import { FunctionComponent } from 'react';
import { useLocation } from 'react-router';

export type MatLayoutProps = {
    theme: any,
    routes: any[],
    openMenu?: React.MouseEventHandler
}

const useStyles = makeStyles(theme => ({
    Header: {

    },
    MainContent: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        padding: theme.spacing(5)
    },
    Footer: {
        top: 'auto',
        bottom: 0
    }
}));

export const MatLayout: FunctionComponent<MatLayoutProps> = ({ theme, routes, openMenu, children }) => {
    const location = useLocation();
    const classes = useStyles(theme);

    return <>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" className={classes.Header}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={openMenu}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5">{routes.find(x => x.route === location.pathname)?.title}</Typography>
                </Toolbar>
            </AppBar>
            <Container className={classes.MainContent}>
                <>{children}</>
            </Container>
            <AppBar className={classes.Footer} position="fixed">
            </AppBar>
        </ThemeProvider>
    </>;
}