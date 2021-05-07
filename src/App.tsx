import { createMuiTheme, Divider, Drawer, Link, List, ListItem, makeStyles, responsiveFontSizes, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import './App.css';
import { MatLayout } from './layout/MatLayout';

import { BrowserRouter as Router, Link as RouterLink, Route, Switch } from 'react-router-dom'
import { ChessConcept } from './concepts/chess/ChessConcept';
import { WebGLConcept } from './concepts/webGL/WebGLConcept';
import { ModSynthConcept } from './concepts/mod_synth/ModSynthConcept';


let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

type ConceptLink = {
  title: string;
  route: string;
  Component: React.ComponentType;
};

let links: ConceptLink[] = [
  {
    title: 'Chess',
    route: '/chess',
    Component: ChessConcept
  },
  {
    title: 'webGL',
    route: '/gl',
    Component: WebGLConcept
  },
  {
    title: 'modSynth',
    route: '/synth',
    Component: ModSynthConcept
  }
];

let useStyles = makeStyles(theme => ({
  App: {
    height: '100%',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  NavigationList: {
    padding: theme.spacing(2),
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }
}));

function App() {
  const classes = useStyles(theme)
  let [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={classes.App}>
      <Router>
        <MatLayout routes={ links } theme={theme} openMenu={() => setMenuOpen(true)}>
          <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
            <div className={classes.NavigationList}>
              <Typography variant="h4">Concepts</Typography>
              <Divider />
              <List>
                {links.map((x, i) => <ListItem key={i}>
                  <Link component={RouterLink} to={{ pathname: x.route, state: { title: x.title } }}>{x.title}</Link>
                </ListItem>)}
              </List>
            </div>
          </Drawer>
          <Switch>
            <Route exact path="/">Home</Route>
            {links.map((x, i) => <Route key={i} path={x.route} component={x.Component} />)}
            <Route path="*">Not Found</Route>
          </Switch>
        </MatLayout>
      </Router>
    </div>
  );
}

export default App;
