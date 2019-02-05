import { colorInputDriverFactory as publicDriverFactory } from './ColorInput.driver';

export const colorInputPrivateDriverFactory = base => {
  return {
    ...publicDriverFactory(base),
  };
};
