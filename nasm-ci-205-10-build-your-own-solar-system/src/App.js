import React, { useCallback } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { hot } from 'react-hot-loader';
import IdleTimer from 'react-idle-timer';
import { removeFocusOutline } from './nasm-utils';
import useReloadApp from './plugins/hooks/useReloadApp';
import Preloader from './plugins/components/Preloader';
import LiveMessages from './plugins/components/LiveMessages';
import useKeypadAudioDetect from './plugins/hooks/useKeypadAudioDetect';
import useKeypadoDetect from './plugins/hooks/useKeypadDetect';
import useResetHook from './plugins/hooks/useResetHook';
import TimeOutPopup from './components/TimeOutPopup';
import ErrorScreen from './components/ErrorScreen';
import { ErrorBoundary } from 'react-error-boundary';
import config from './config/config';
import store from './redux/store';
import { useDispatch } from 'react-redux';
import {
  wasKeypadUsed as wasKeypadUsedSelector,
  isPreloaderDone as isPreloaderDoneSelector,
  isDynamicContentDownloaded as isDynamicContentDownloadedSelector,
  setPopUpActive,
} from './redux/app';
import { isAppConfigLoaded as isAppConfigLoadedSelector } from './redux/config';
import theme from './styles/theme';
import GlobalStyle from './styles/global';
import routes from './routes';

const generateRoutes = () => {
  return routes.map((route, index) => {
    const { path, component } = route;
    const Component = require(`./${component}`).default;
    return <Route exact path={path} component={Component} key={index} />;
  });
};

function App() {
  removeFocusOutline();
  useReloadApp();

  return (
    <Provider store={store}>
      <LiveMessages />
      <ThemeProvider theme={theme}>
        <Router basename={process.env.PUBLIC_URL}>
          <>
            <GlobalStyleComponent />
            <Root />
          </>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

function GlobalStyleComponent() {
  const wasKeypadUsed = useSelector(wasKeypadUsedSelector);
  return <GlobalStyle wasKeypadUsed={wasKeypadUsed} />;
}

function RootComponent() {
  const dispatch = useDispatch();
  const history = useHistory();

  if (history.action == 'POP') {
    history.push('/');
  }
  const isPreloaderDone = useSelector(isPreloaderDoneSelector);
  const isDynamicContentDownloaded = useSelector(
    isDynamicContentDownloadedSelector
  );
  const isAppConfigLoaded = useSelector(isAppConfigLoadedSelector);
  const isAppReady =
    isPreloaderDone && isDynamicContentDownloaded && isAppConfigLoaded;
  const reset = useResetHook();
  const wasKeypadUsed = useSelector(wasKeypadUsedSelector);

  const onIdle = useCallback(() => {
    history.location.pathname !== '/' ||
    (history.location.pathname === '/' && wasKeypadUsed)
      ? dispatch(setPopUpActive(true))
      : dispatch(setPopUpActive(false));
  }, [dispatch, history, wasKeypadUsed]);

  const sendErrorsToServerLog = async (error) => {
    try {
      const response = await fetch('/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([`${error}`]),
      });

      if (!response.ok) {
        throw new Error('Error sending error to server.');
      }
    } catch (error) {
      console.error('Error sending error to server: ', error);
      // Handle the error in an appropriate way, e.g., show a user-friendly error message
    }
  };
  useKeypadAudioDetect();
  useKeypadoDetect();

  return (
    <Route
      render={({ location }) => (
        <ErrorBoundary
          FallbackComponent={ErrorScreen}
          onReset={reset}
          onError={sendErrorsToServerLog}
        >
          <AppWrapper>
            {config.resetOnIdle && (
              <IdleTimer
                element={document}
                onIdle={onIdle}
                debounce={250}
                timeout={config.idleTime}
              />
            )}
            <TransitionGroup component={null}>
              <CSSTransition
                key={`preload-${isAppReady}`}
                timeout={500}
                classNames="page-fade"
              >
                {!isAppReady ? <Preloader /> : <></>}
              </CSSTransition>
              {isAppReady && (
                <CSSTransition
                  key={location.key}
                  timeout={500}
                  classNames="page-fade"
                >
                  <Switch location={location}>{generateRoutes()}</Switch>
                </CSSTransition>
              )}
              <TimeOutPopup reset={reset} tabIndex={1} />
            </TransitionGroup>
          </AppWrapper>
        </ErrorBoundary>
      )}
    />
  );
}

const Root = React.memo(RootComponent);

const AppWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  .page-fade-enter {
    opacity: 0;
  }
  .page-fade-enter.page-fade-enter-active {
    opacity: 1;
    transition: all 0.5s;
  }
  .page-fade-exit {
    opacity: 1;
  }
  .page-fade-exit.page-fade-exit-active {
    opacity: 0;
    transition: all 0.5s;
  }
`;

export default process.env.NODE_ENV === 'development' ? hot(module)(App) : App;
