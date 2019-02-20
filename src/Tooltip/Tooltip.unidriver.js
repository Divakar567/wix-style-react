export const teskitTooltip = base => {
  return {
    isShown: async () => await !!base.attr('data-content-hook'),
    mouseEnter: async () => await base.hover(base),
    mouseLeave: async element => await base.hover(element),
  };
};
