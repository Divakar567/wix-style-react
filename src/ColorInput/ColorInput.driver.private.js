import { colorInputDriverFactory as publicDriverFactory } from './ColorInput.driver';
import { getStylableState } from '../../test/utils/stylable-uni-testkit';
import hashStyles from './components/Hash.st.css';
import viewerStyles from './components/ColorViewer.st.css';

export const colorInputPrivateDriverFactory = base => {
  const isHashDisabled = async () =>
    (await getStylableState(
      base.$('[data-hook="colorinput-hash"]'),
      hashStyles,
      'disabled',
    )) === 'true';

  const isViewerNull = async () =>
    (await getStylableState(
      base.$('[data-hook="colorinput-viewer"]'),
      viewerStyles,
      'empty',
    )) === 'true';

  const getViewerSize = async () =>
    await getStylableState(
      base.$('[data-hook="colorinput-viewer"]'),
      viewerStyles,
      'size',
    );
  return {
    ...publicDriverFactory(base),
    isHashDisabled: async () => await isHashDisabled(),
    isViewerNull: async () => await isViewerNull(),
    getViewerSize: async () => await getViewerSize(),
  };
};
