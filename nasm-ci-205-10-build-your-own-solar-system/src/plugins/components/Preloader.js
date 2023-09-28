import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import preloader from 'preloader';
import AudioDescription from '../../components/AudioDescription';
import ProgressBar from '../../plugins/components/preloader/ProgressBar';

import config from '../../config/config';
import {
  preloaderDone,
  getDynamicData,
  isPreloaderDone as isPreloaderDoneSelector,
  isDynamicContentDownloaded as isDynamicContentDownloadedSelector,
  getDynamicFilesToPreload,
} from '../../redux/app';
import {
  getAppConfig,
  isAppConfigLoaded as isAppConfigLoadedSelector,
} from '../../redux/config';
import { getExtensionLowerCase } from '../../utils/url';

const staticFilesToPreload = config.preload ? config.preload : [];
const modelsToPreload = config.preloadModels ? config.preloadModels : [];

export let loader = null;

export default function Preloader({ children }) {
  const [loadingBarVisible, setLoadingBarVisible] = useState(false);
  const isPreloadDone = useSelector(isPreloaderDoneSelector);
  const isDynamicContentDownloaded = useSelector(
    isDynamicContentDownloadedSelector
  );
  const isAppConfigLoaded = useSelector(isAppConfigLoadedSelector);
  const dynamicFilesToPreload = useSelector(getDynamicFilesToPreload);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(progress);
  const dispatch = useDispatch();
  progressRef.current = progress;

  useEffect(() => {
    if (!isAppConfigLoaded) {
      setLoadingBarVisible(true);
      dispatch(getAppConfig());
    }
  }, [dispatch, isAppConfigLoaded]);

  useEffect(() => {
    if (!isDynamicContentDownloaded && isAppConfigLoaded) {
      setLoadingBarVisible(true);
      dispatch(getDynamicData());
    }
  }, [dispatch, isDynamicContentDownloaded, isAppConfigLoaded]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isPreloadDone && isDynamicContentDownloaded && isAppConfigLoaded) {
        const modelsUrlsToPreload = modelsToPreload.map((model) => model.url);
        const filesToPreload = _.concat(
          staticFilesToPreload,
          dynamicFilesToPreload
        );
        const preloadedUrls = loader && loader.urls ? loader.urls : [];
        const hasNewAssetsToPreload =
          _.xor(_.concat(filesToPreload, modelsUrlsToPreload), preloadedUrls)
            .length !== 0;
        if (
          !hasNewAssetsToPreload ||
          !filesToPreload ||
          !filesToPreload.length
        ) {
          dispatch(preloaderDone());
          return;
        }
        setLoadingBarVisible(true);
        loader = preloader({ xhrImages: true });
        const handleProgress = (val) => {
          if (progressRef.current < val) setProgress(val);
        };

        const handleComplete = () => {
          dispatch(preloaderDone());
          setLoadingBarVisible(false);
        };

        loader.on('progress', handleProgress);
        loader.on('complete', handleComplete);
        filesToPreload.forEach((file) => {
          if (typeof file !== 'object') {
            if (getExtensionLowerCase(file) === 'svg') {
              loader.addImage(file);
            } else {
              loader.add(file);
            }
          }
        });
        loader.load();
      }
    }, 0);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    dispatch,
    setProgress,
    isPreloadDone,
    isDynamicContentDownloaded,
    dynamicFilesToPreload,
    isAppConfigLoaded,
  ]);

  return (
    <Root>
      {loadingBarVisible ? (
        <>
          <AudioDescription
            description="A loading screen appears. It may take a few seconds to complete."
            autoFocus={true}
          />
          <ProgressBar progress={progress} />
        </>
      ) : null}
    </Root>
  );
}

Preloader.propTypes = {
  children: PropTypes.func,
};

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: #000;
`;
