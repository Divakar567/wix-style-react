import tooltipDriverFactory from './Tooltip.driver';
import { delegateToReactDOM } from '../../test/utils/unidriver/delegatMethod';

const arrowDirection = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export const teskitTooltip = (base, body) => {
  const getContentRoot = async () => {
    const contentRootHook = await base.attr('data-content-hook');
    return body.$(`[data-hook="${contentRootHook}"]`);
  };

  const hasClassName = async cls =>
    new RegExp(cls).test(
      await (await getContentRoot()).$('.tooltip').attr('class'),
    );

  const getArrowPlacement = async () => {
    const classes = await (await getContentRoot())
      .$('[data-hook="tooltip-arrow"]')
      .attr('class');

    return arrowDirection[classes.split(' ')[2]];
  };

  const getContentStyleValue = async value => {
    const style = await (await getContentRoot()).$('.tooltip').attr('style');
    return style.includes(value)
      ? style
          .split(';')
          .find(css => new RegExp(value).test(css))
          .replace(`${value}: `, '')
          .replace(' ', '')
      : undefined;
  };

  return {
    click: async () => await base.click(),
    isShown: async () => (await getContentRoot()).exists(),
    getTooltipWrapper: async () =>
      await (await getContentRoot()).$('.tooltip').getNative(),
    mouseEnter: async () => await base.hover(base),
    mouseLeave: () =>
      delegateToReactDOM(base, 'mouseLeave', tooltipDriverFactory),
    hasErrorTheme: async () => await hasClassName('error'),
    hasDarkTheme: async () => await hasClassName('dark'),
    hasLightTheme: async () => await hasClassName('light'),
    hasAnimationClass: async () => await hasClassName('.fadeIn'),
    getChildren: async () => await base.text(),
    getContent: async () => await (await getContentRoot()).$('.tooltip').text(),
    getPlacement: async () => await getArrowPlacement(),
    getMaxWidth: async () => await getContentStyleValue('max-width'),
    getMinWidth: async () => await getContentStyleValue('min-width'),
    getAlignment: async () => await getContentStyleValue('text-align'),
    getPadding: async () => await getContentStyleValue('padding'),
    hasArrow: async () =>
      await (await getContentRoot()).$('[data-hook="tooltip-arrow"]').exists(),
    getContentHook: async () =>
      await body
        .$(`[data-hook="${await base.attr('data-content-hook')}"]`)
        .getNative(),
  };
};
