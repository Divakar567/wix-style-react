import { colorInputDriverFactory as publicDriverFactory } from './ColorInput.driver';
import { getStylableState } from '../../test/utils/stylable-uni-testkit';
import hashStyles from './components/Hash.st.css';

export const colorInputPrivateDriverFactory = base => {
  const isHashDisabled = async () =>
    (await getStylableState(
      base.$('[data-hook="colorinput-hash"]'),
      hashStyles,
      'disabled',
    )) === 'true';
  return {
    ...publicDriverFactory(base),
    isHashDisabled: async () => await isHashDisabled(),
  };
};
