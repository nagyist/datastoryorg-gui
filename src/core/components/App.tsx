import React, { FC, useState, useEffect } from 'react';
import Header from './Header';
import Toolbar from './Toolbar';
import pages from './pages/factory';
import { observer } from 'mobx-react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EngineFactory from '../../core/EngineFactory';
import Cookie from '../utils/Cookie';
import { useStore } from '../store/StoreProvider';
import Mousetrap from 'mousetrap';
import { Store } from '../store';
import { showNotification } from '../utils/Notifications';

const App: FC = () => {
  const store = useStore();
  const [booted, setBooted] = useState(false);

  const renderActivePage = () => {
    let Page = pages(store.metadata.page);
    return <Page store={store} />;
  };

  useEffect(() => {
    boot();
    registerKeybindings(store);
    registerExitConfirmation();
  }, []);

  const boot = () => {
    store.metadata.client
      .boot({
        story: window.location.href
          .split('/datastory')
          .pop()
          .replace('/', ''),
      })
      .then((response) => {
        store.setEngine(
          EngineFactory.loadOrCreate(
            response.data.serializedModel ?? null,
          ),
        );

        bootDemos(store);

        store.setAvailableNodes(
          response.data.availableNodes,
        );
        store.setStories(Cookie.keys());

        setBooted(true);
      })
      .catch((error) => {
        console.error('Boot error', error);
        showNotification({
          message: 'Could not Boot! Check console.',
          type: 'success',
        });
      });
  };

  return (
    <div>
      <Header />
      <Toolbar store={store} />
      {booted && renderActivePage()}
      <ToastContainer style={{ paddingTop: '0px' }} />
    </div>
  );
};

const bootDemos = (store: Store) => {
  // for (const name of Object.keys(demos)) {
  //   //store.metadata.client.save(name, demos[name])
  // }
  // // store.metadata.client.save('With parameters', demos.WithParameters)
  // // store.metadata.client.save('Working with json', demos.WorkingWithJSON)
  // // store.metadata.client.save('Scraping a map service', demos.ScrapingAMapService)
  // // store.metadata.client.save('Cleanup old github repos', demos.CleanupOldGithubRepos)
};

const registerKeybindings = (store: Store) => {
  Mousetrap.bind('shift+d', (e) => {
    store.setPage('Workbench');
  });

  Mousetrap.bind('shift+t', (e) => {
    store.setPage('Inspector');
  });

  Mousetrap.bind('shift+l', (e) => {
    store.setPage('Log');
  });
};

const registerExitConfirmation = () => {
  window.onbeforeunload = function (e) {
    return 'Do you want to exit this page?';
  };
};

export default observer(App);