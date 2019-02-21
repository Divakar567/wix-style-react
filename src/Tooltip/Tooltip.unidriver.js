import tooltipDriverFactory from './Tooltip.driver';
import { delegateToReactDOM } from '../../test/utils/unidriver/delegatMethod';

export const teskitTooltip = (base, body) => {
  const getContentRoot = async () => {
    const contentRootHook = await base.attr('data-content-hook');
    if (!contentRootHook) {
      throw new Error(
        `Tooltip.driver: contentRootHook attribute must exist on the Tooltip's root element`,
      );
    }
    return body.$(`[data-hook="${contentRootHook}"]`);
  };

  const hasTheme = async theme =>
    new RegExp(theme).test(
      await (await getContentRoot()).$('.tooltip').attr('class'),
    );

  return {
    click: async () => await base.click(),
    isShown: async () => (await getContentRoot()).exists(),
    getTooltipWrapper: async () =>
      await (await getContentRoot()).$('.tooltip').getNative(),
    mouseEnter: () => base.hover(base),
    mouseLeave: () =>
      delegateToReactDOM(base, 'mouseLeave', tooltipDriverFactory),
    hasErrorTheme: async () => await hasTheme('error'),
    hasDarkTheme: async () => await hasTheme('dark'),
    hasLightTheme: async () => await hasTheme('light'),
    getChildren: async () => await base.text(),
  };
};
