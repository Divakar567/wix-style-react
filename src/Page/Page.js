import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ResizeSensor } from 'css-element-queries';
import { allValidators, extendPropTypes } from '../utils/propTypes';
import { mergeClassAndStyleProps } from './utils';
import s from './Page.scss';
import WixComponent from '../BaseComponents/WixComponent';
import PageHeader from '../PageHeader';
import Content from './Content';
import Tail from './Tail';
import {
  SCROLL_TOP_THRESHOLD,
  SHORT_SCROLL_TOP_THRESHOLD,
  TAIL_TOP_PADDING_PX,
  PAGE_SIDE_PADDING_PX,
} from './constants';
import {
  mainContainerMinWidthPx as GRID_MIN_WIDTH,
  mainContainerMaxWidthPx as GRID_MAX_WIDTH,
} from '../Grid/constants';
import deprecationLog from '../utils/deprecationLog';

/*
 * Page structure is as follows:
 *
 * + PageWrapper --------------
 * | +- Page --------------------
 * | | +-- FixedContainer ---------
 * | | | +-- HeaderContainer ------
 * | | | |  header-content:padding-top
 * | | | | +-- Page.Header --------
 * | | | | |
 * | | | | |
 * | | | | +-----------------------
 * | | | |  tail:padding-top
 * | | | | +-- Page.Tail ----------
 * | | | | |
 * | | | | |
 * | | | | +-----------------------
 * | | | |  header-content:padding-bottom
 * | | | +-------------------------
 * | | | +-- Page.FixedContent ----   ==+
 * | | | |                              |
 * | | | +-------------------------     |
 * | | +---------------------------     | Content (Virtual)
 * | | +--  ScrollableContainer ---     |
 * | | | +-- Page.Content ---------     |
 * | | | |                              |
 * | | | +-------------------------     |
 * | | +---------------------------   ==+
 * | +-----------------------------
 * +-------------------------------
 *
 * -  ScrollableContainer is called in the code scrollable-content, and should NOT be renamed, since
 * Tooltip is hard-coded-ly using a selector like this: [data-class="page-scrollable-content"]
 */

/**
 * A page container which contains a header and scrollable content
 */
class Page extends WixComponent {
  static defaultProps = {
    gradientCoverTail: true,
    minWidth: GRID_MIN_WIDTH,
    maxWidth: GRID_MAX_WIDTH,
  };

  constructor(props) {
    super(props);

    this._setContainerScrollTopThreshold(false);
    this._handleScroll = this._handleScroll.bind(this);
    this._handleResize = this._handleResize.bind(this);

    this.state = {
      fixedContainerHeight: 0,
      tailHeight: 0,
      fixedContentHeight: 0,
      scrollBarWidth: 0,
      minimized: false,
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this.contentResizeListener = new ResizeSensor(
      this._getScrollContainer().childNodes[0],
      this._handleResize,
    );
    this._calculateComponentsHeights();
    this._handleResize();
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    // Do not trigger height calculation if the component is minimized
    if (!this.state.minimized) {
      this._calculateComponentsHeights();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.contentResizeListener.detach(this._handleResize);
  }

  _calculateComponentsHeights() {
    const { fixedContainerHeight, tailHeight, fixedContentHeight } = this.state;
    const newFixedContainerHeight = this.fixedContainerRef
      ? this.fixedContainerRef.offsetHeight
      : 0;
    const newTailHeight = this.pageHeaderTailRef
      ? this.pageHeaderTailRef.offsetHeight
      : 0;
    const newFixedContentHeight = this.pageHeaderFixedContentRef
      ? this.pageHeaderFixedContentRef.offsetHeight
      : 0;
    if (
      fixedContainerHeight !== newFixedContainerHeight ||
      tailHeight !== newTailHeight ||
      fixedContentHeight !== newFixedContentHeight
    ) {
      this.setState({
        fixedContainerHeight: newFixedContainerHeight,
        tailHeight: newTailHeight,
        fixedContentHeight: newFixedContentHeight,
      });
    }
  }

  _setContainerScrollTopThreshold({ shortThreshold }) {
    this.containerScrollTopThreshold = shortThreshold
      ? SHORT_SCROLL_TOP_THRESHOLD
      : SCROLL_TOP_THRESHOLD;
  }

  _setScrollContainer(scrollContainer) {
    this.scrollableContentRef = scrollContainer;
    this.props.scrollableContentRef &&
      this.props.scrollableContentRef(scrollContainer);
  }

  _getScrollContainer() {
    return this.scrollableContentRef;
  }

  _shouldBeMinimized(containerScrollTop) {
    return containerScrollTop > this.containerScrollTopThreshold;
  }

  _handleScroll() {
    const scrollContainer = this._getScrollContainer();
    const containerScrollTop = scrollContainer.scrollTop;
    const nextMinimized = this._shouldBeMinimized(containerScrollTop);
    const { minimized } = this.state;

    if (minimized !== nextMinimized) {
      this.setState({
        minimized: nextMinimized,
      });
    }
  }

  _handleResize() {
    // Fixes width issues when scroll bar is present in windows
    const scrollContainer = this._getScrollContainer();
    const scrollBarWidth =
      scrollContainer &&
      scrollContainer.offsetWidth - scrollContainer.clientWidth;

    if (this.state.scrollBarWidth !== scrollBarWidth) {
      this.setState({ scrollBarWidth });
    }
  }

  _safeGetChildren(element) {
    if (!element || !element.props || !element.props.children) {
      return [];
    }

    return element.props.children;
  }

  _calculatePageDimensionsStyle() {
    const { maxWidth, sidePadding } = this.props;
    if (!maxWidth && !sidePadding && sidePadding !== 0) {
      return null;
    }

    const styles = {};
    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    if (sidePadding || sidePadding === 0) {
      styles.paddingLeft = `${sidePadding}px`;
      styles.paddingRight = `${sidePadding}px`;
    }

    return styles;
  }

  _fixedContainerStyle() {
    const { scrollBarWidth } = this.state;
    if (scrollBarWidth) {
      return { width: `calc(100% - ${scrollBarWidth}px` };
    }
    return null;
  }

  /**
   * See diagram in class documentation to better understand this method.
   */
  _calculateHeaderMeasurements({ PageTail }) {
    const { gradientCoverTail } = this.props;
    // fixedContainerHeight (and other heights) are calculated only when the Page is NOT minimized
    const { fixedContainerHeight, tailHeight, fixedContentHeight } = this.state;

    const minimizedFixedContainerHeight = PageTail
      ? fixedContainerHeight - 78
      : fixedContainerHeight - (78 - TAIL_TOP_PADDING_PX);
    const headerContainerHeight = fixedContainerHeight - fixedContentHeight;
    const imageHeight = `${headerContainerHeight +
      (PageTail ? -tailHeight : 39)}px`;
    const gradientHeight = gradientCoverTail
      ? `${headerContainerHeight + (PageTail ? -SCROLL_TOP_THRESHOLD : 39)}px`
      : imageHeight;

    return {
      imageHeight,
      gradientHeight,
      fixedContainerHeight,
      minimizedFixedContainerHeight,
    };
  }

  _getScrollableBackground({ gradientHeight, imageHeight }) {
    if (this.hasBackgroundImage()) {
      return (
        <div
          className={s.imageBackgroundContainer}
          style={{ height: imageHeight }}
          data-hook="page-background-image"
        >
          <div
            className={s.imageBackground}
            style={{ backgroundImage: `url(${this.props.backgroundImageUrl})` }}
          />
        </div>
      );
    }

    if (this.hasGradientClassName()) {
      return (
        <div
          data-hook="page-gradient-class-name"
          className={`${s.gradientBackground} ${this.props.gradientClassName}`}
          style={{ height: gradientHeight }}
        />
      );
    }
  }

  _getContent({
    contentHorizontalLayoutProps,
    fixedContainerHeight,
    minimizedFixedContainerHeight,
    PageContent,
  }) {
    const minimizeDiff = fixedContainerHeight - minimizedFixedContainerHeight;

    const classAndStyleProps = mergeClassAndStyleProps(
      contentHorizontalLayoutProps,
      {
        className: classNames({
          [s.contentWrapper]: this.props.upgrade,
        }),
        style: {
          minHeight: `calc(100% + ${minimizeDiff}px + ${SCROLL_TOP_THRESHOLD}px)`,
        },
      },
    );

    return (
      <div {...classAndStyleProps}>
        {this._safeGetChildren(PageContent)}
        <div className={s.pageBottomPadding} />
      </div>
    );
  }

  hasBackgroundImage() {
    return !!this.props.backgroundImageUrl;
  }

  hasGradientClassName() {
    return !!this.props.gradientClassName && !this.props.backgroundImageUrl;
  }

  render() {
    const { className, children, minWidth, upgrade } = this.props;
    const { minimized } = this.state;
    const childrenObject = getChildrenObject(children);
    const { PageContent, PageFixedContent, PageTail } = childrenObject;
    this._setContainerScrollTopThreshold({
      shortThreshold: PageTail && this.hasGradientClassName(),
    });
    const contentFullScreen = PageContent && PageContent.props.fullScreen;
    const pageDimensionsStyle = this._calculatePageDimensionsStyle();
    const {
      imageHeight,
      gradientHeight,
      fixedContainerHeight,
      minimizedFixedContainerHeight,
    } = this._calculateHeaderMeasurements({ PageTail });

    const classNameStretchVertically = upgrade ? s.stretchVertically : '';

    const contentHorizontalLayoutProps = {
      className: classNames(s.contentHorizontalLayout, {
        [s.contentFullWidth]: contentFullScreen,
      }),
      style: contentFullScreen ? null : pageDimensionsStyle,
    };

    return (
      <div
        className={classNames(
          upgrade ? s.pageWrapper : s.deprecatedPageWrapper,
          className,
        )}
      >
        <div
          className={upgrade ? s.page : s.deprecatedPage}
          style={{
            minWidth: minWidth + 2 * PAGE_SIDE_PADDING_PX,
          }}
        >
          <div
            data-hook="page-fixed-container"
            style={this._fixedContainerStyle()}
            className={classNames(s.fixedContainer)}
            ref={r => (this.fixedContainerRef = r)}
            onWheel={event => {
              this._getScrollContainer().scrollTop =
                this._getScrollContainer().scrollTop + event.deltaY;
            }}
          >
            <div
              className={classNames(s.pageHeaderContainer, {
                [s.minimized]: minimized,
                [s.withoutBottomPadding]: PageTail && minimized,
              })}
            >
              {childrenObject.PageHeader && (
                <div className={s.pageHeader} style={pageDimensionsStyle}>
                  {React.cloneElement(childrenObject.PageHeader, {
                    minimized,
                    hasBackgroundImage: this.hasBackgroundImage(),
                  })}
                </div>
              )}
              {PageTail && (
                <div
                  data-hook="page-tail"
                  className={classNames(s.tail, { [s.minimized]: minimized })}
                  style={pageDimensionsStyle}
                  ref={r => (this.pageHeaderTailRef = r)}
                >
                  {React.cloneElement(PageTail, { minimized })}
                </div>
              )}
            </div>
            {PageFixedContent && (
              <div
                data-hook="page-fixed-content"
                {...contentHorizontalLayoutProps}
                ref={r => (this.pageHeaderFixedContentRef = r)}
              >
                {React.cloneElement(PageFixedContent)}
              </div>
            )}
          </div>
          <div
            className={s.scrollableContainer}
            onScroll={this._handleScroll}
            data-hook="page-scrollable-content"
            data-class="page-scrollable-content"
            style={{ paddingTop: `${fixedContainerHeight}px` }}
            ref={r => this._setScrollContainer(r)}
          >
            {this._getScrollableBackground({
              gradientHeight,
              imageHeight,
            })}
            {this._getContent({
              contentHorizontalLayoutProps,
              fixedContainerHeight,
              minimizedFixedContainerHeight,
              PageContent,
            })}
          </div>
        </div>
      </div>
    );
  }
}

const FixedContent = props => props.children;
FixedContent.displayName = 'Page.FixedContent';
FixedContent.propTypes = {
  children: PropTypes.element.isRequired,
};

Page.displayName = 'Page';
Page.Header = PageHeader;
Page.Content = Content;
Page.FixedContent = FixedContent;
Page.Tail = Tail;

Page.propTypes = {
  /** Background image url of the header beackground */
  backgroundImageUrl: PropTypes.string,
  /** Sets the max width of the content (Both in header and body) NOT including the page padding */
  maxWidth: PropTypes.number,
  /** Sets the min width of the content (Both in header and body) NOT including the page padding */
  minWidth: PropTypes.number,
  /** Sets padding of the sides of the page */
  sidePadding: PropTypes.number,
  /** A css class to be applied to the component's root element */
  className: PropTypes.string,
  /** Header background color class name, allows to add a gradient to the header */
  gradientClassName: PropTypes.string,
  /** If false Gradient will not cover Page.Tail */
  gradientCoverTail: PropTypes.bool,
  /** Is called with the Page's scrollable content ref **/
  scrollableContentRef: PropTypes.func,

  /** Accepts these components as children: `Page.Header`, `Page.Tail`, `Page.Content`, `Page.FixedContent`. Order is insignificant. */
  children: PropTypes.arrayOf((children, key) => {
    const childrenObj = getChildrenObject(children);

    if (!childrenObj.PageHeader) {
      return new Error(`Page: Invalid Prop children, must contain Page.Header`);
    }

    if (!childrenObj.PageContent) {
      return new Error(
        `Page: Invalid Prop children, must contain Page.Content`,
      );
    }

    if (
      children[key].type.displayName !== Page.Header.displayName &&
      children[key].type.displayName !== Page.Content.displayName &&
      children[key].type.displayName !== Page.FixedContent.displayName &&
      children[key].type.displayName !== Page.Tail.displayName
    ) {
      return new Error(
        `Page: Invalid Prop children, unknown child ${children[key].type}`,
      );
    }
  }).isRequired,
  /** When true the page will use height: 100% and not require a parent of `display: flex;flex-flow: column;`. Also Page.Content's may grow using `height: 100%`.*/
  upgrade: PropTypes.bool,
};

extendPropTypes(Page, {
  upgrade: allValidators(PropTypes.bool, (props, propName, componentName) => {
    if (!props[propName]) {
      deprecationLog(
        `
${componentName}: New Layout API ! Please set upgrade=true prop to use new Layout API.
When enabled, the page will use height: 100% and not require a parent of 'display: flex;flex-flow: column;'.
Also Page.Content's may grow using 'height: 100%'. See docs for more info: https://github.com/wix/wix-style-react/blob/master/src/Page/README.MIGRATION.md`,
      );
    }
  }),
});

function getChildrenObject(children) {
  return React.Children.toArray(children).reduce((acc, child) => {
    switch (child.type.displayName) {
      case 'Page.Header': {
        acc.PageHeader = child;
        break;
      }
      case 'Page.Content': {
        acc.PageContent = child;
        break;
      }
      case 'Page.FixedContent': {
        acc.PageFixedContent = child;
        break;
      }
      case 'Page.Tail': {
        acc.PageTail = child;
        break;
      }
      default: {
        break;
      }
    }
    return acc;
  }, {});
}

export default Page;
