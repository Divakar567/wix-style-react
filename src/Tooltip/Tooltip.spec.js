import React from 'react';
import eventually from '../../test/utils/eventually';
import {
  createRendererWithDriver,
  createRendererWithUniDriver,
  cleanup,
} from '../../test/utils/react';
import Tooltip from './Tooltip';
import { buttonTestkitFactory } from '../../testkit';
import Button from '../Button';

import tooltipDriverFactory from './Tooltip.driver';
import { teskitTooltip } from './Tooltip.unidriver';

describe('Tooltip', () => {
  describe('[sync]', () => {
    runTests(createRendererWithDriver(tooltipDriverFactory));
  });

  describe('[async]', () => {
    runTests(createRendererWithUniDriver(teskitTooltip));
  });

  function runTests(render) {
    afterEach(() => cleanup());
    const children = <div>Here there is a children</div>;
    const _props = {
      showDelay: 5,
      hideDelay: 5,
      content: "I'm the content",
    };

    it('should be hidden by default', async () => {
      const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
      expect(await driver.isShown()).toBe(false);
    });

    it('should show a tooltip once hovering', async () => {
      const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
      await driver.mouseEnter();
      await eventually(async () => {
        expect(await driver.isShown()).toBe(true);
      });
    });

    it('should hide when mouse leaving', async () => {
      const { driver } = render(
        <Tooltip dataHook="tooltip" {..._props}>
          {children}
        </Tooltip>,
      );

      await driver.mouseEnter();

      await eventually(async () => {
        expect(await driver.isShown()).toBe(true);
      });

      driver.mouseLeave();

      await eventually(async () => {
        expect(await driver.isShown()).toBe(false);
      });
    });

    it('should test inner component', async () => {
      const dataHook = 'button_data_hook';
      const buttonContent = (
        <div>
          Custom Content...&nbsp;
          <Button dataHook={dataHook} id="inner-button" height="small">
            Button content
          </Button>
        </div>
      );
      const { driver } = render(
        <Tooltip showDelay={5} hideDelay={5} content={buttonContent}>
          {children}
        </Tooltip>,
      );
      driver.mouseEnter();
      expect(await driver.isShown()).toBeFalsy();
      return resolveIn(30).then(async () => {
        expect(await driver.isShown()).toBeTruthy();
        const buttonTestkit = buttonTestkitFactory({
          wrapper: driver.getTooltipWrapper(),
          dataHook,
        });
        expect(await buttonTestkit.getButtonTextContent()).toBe(
          'Button content',
        );
      });
    });

    it('should not override focus event', async () => {
      const onFocus = jest.fn();
      const onFocusedChild = (
        <div onFocus={onFocus}>Here there is a children</div>
      );
      const { driver } = render(
        <Tooltip {..._props}>{onFocusedChild}</Tooltip>,
      );
      driver.focus();
      expect(onFocus).toBeCalled();
    });

    it('should not override blur event', async () => {
      const onBlur = jest.fn();
      const onBluredChild = <div onBlur={onBlur}>Here there is a children</div>;
      const { driver } = render(<Tooltip {..._props}>{onBluredChild}</Tooltip>);
      driver.blur();
      expect(onBlur).toBeCalled();
    });

    it('should not override click event', async () => {
      const onClick = jest.fn();
      const onClickedChild = (
        <div onClick={onClick}>Here there is a children</div>
      );
      const { driver } = render(
        <Tooltip {..._props}>{onClickedChild}</Tooltip>,
      );
      driver.click();
      expect(onClick).toBeCalled();
    });

    it('should not override mouse enter event', async () => {
      const onMouseEnter = jest.fn();
      const onMouseEnteredChild = (
        <div onMouseEnter={onMouseEnter}>Here there is a children</div>
      );
      const { driver } = render(
        <Tooltip {..._props}>{onMouseEnteredChild}</Tooltip>,
      );
      driver.mouseEnter();
      expect(onMouseEnter).toBeCalled();
    });

    it('should not override mouse leave event', async () => {
      const onMouseLeave = jest.fn();
      const onMouseLeavedChild = (
        <div onMouseLeave={onMouseLeave}>Here there is a children</div>
      );
      const { driver } = render(
        <Tooltip {..._props}>{onMouseLeavedChild}</Tooltip>,
      );
      driver.mouseLeave();
      expect(onMouseLeave).toBeCalled();
    });

    it('should support error theme', async () => {
      const { driver } = render(
        <Tooltip theme={'error'} {..._props}>
          {children}
        </Tooltip>,
      );
      driver.mouseEnter();
      expect(await driver.hasErrorTheme()).toBeFalsy();
      return resolveIn(30).then(async () => {
        expect(await driver.hasErrorTheme()).toBeTruthy();
      });
    });

    it('should support dark theme', async () => {
      const { driver } = render(
        <Tooltip theme={'dark'} {..._props}>
          {children}
        </Tooltip>,
      );
      driver.mouseEnter();
      expect(await driver.hasDarkTheme()).toBeFalsy();
      return resolveIn(30).then(async () => {
        expect(await driver.hasDarkTheme()).toBeTruthy();
      });
    });

    it('should support light theme', async () => {
      const { driver } = render(
        <Tooltip theme={'light'} {..._props}>
          {children}
        </Tooltip>,
      );
      driver.mouseEnter();
      expect(await driver.hasLightTheme()).toBeFalsy();
      return resolveIn(30).then(async () => {
        expect(await driver.hasLightTheme()).toBeTruthy();
      });
    });

    it('should have a children', async () => {
      const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
      expect(await driver.getChildren()).toBe('Here there is a children');
    });

    it('should have a content', async () => {
      const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
      driver.mouseEnter();
      return resolveIn(30).then(async () => {
        expect(await driver.getContent()).toBe("I'm the content");
      });
    });

    it('should cancel mouse leave, when followed by mouse enter immediately', async () => {
      const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
      driver.mouseEnter();
      driver.mouseLeave();
      driver.mouseEnter();
      return resolveIn(30).then(async () => {
        expect(await driver.isShown()).toBe(true);
      });
    });

    it('should call onShow when tooltip is shown', async () => {
      const onShow = jest.fn();
      const { driver } = render(
        <Tooltip {...{ ..._props, onShow }}>{children}</Tooltip>,
      );

      driver.mouseEnter();

      expect(onShow).not.toHaveBeenCalled();
      return resolveIn(30).then(async () => {
        expect(onShow).toHaveBeenCalled();
        expect(await driver.isShown()).toBeTruthy();
      });
    });

    it('should call onHide when tooltip is hidden', async () => {
      const onHide = jest.fn();
      const { driver } = render(
        <Tooltip {...{ ..._props, onHide }}>{children}</Tooltip>,
      );

      driver.mouseEnter();
      return resolveIn(30).then(async () => {
        expect(await driver.isShown()).toBeTruthy();

        driver.mouseLeave();

        return resolveIn(30).then(async () => {
          expect(await driver.isShown()).toBeFalsy();
          expect(onHide).toHaveBeenCalled();
        });
      });
    });

    it('should append to element selected', async () => {
      const el = document.createElement('div');
      const { driver } = render(
        <Tooltip {..._props} appendTo={el}>
          {children}
        </Tooltip>,
      );
      driver.mouseEnter();
      return resolveIn(30).then(() => {
        expect(el.childElementCount).toEqual(1);
      });
    });

    describe('custom triggers', () => {
      it('should hide tooltip', async () => {
        const props = {
          ..._props,
          hideTrigger: 'custom',
          showTrigger: 'custom',
          children,
        };
        const { driver, rerender } = render(<Tooltip {...props} />);
        driver.mouseEnter();
        await eventually(async () =>
          expect(await driver.isShown()).toBeFalsy(),
        );
        rerender(<Tooltip {...props} active />);

        await eventually(async () =>
          expect(await driver.isShown()).toBeTruthy(),
        );
        rerender(<Tooltip {...props} active={false} />);
        await eventually(async () =>
          expect(await driver.isShown()).toBeFalsy(),
        );
      });

      it('should not show tooltip when transitioned to both active and disabled', async () => {
        const props = {
          ..._props,
          hideTrigger: 'custom',
          showTrigger: 'custom',
          active: false,
          disabled: false,
          children,
        };
        const { driver, rerender } = render(<Tooltip {...props} />);
        expect(await driver.isShown()).toBeFalsy();
        await eventually(async () =>
          expect(await driver.isShown()).toBeFalsy(),
        );
        rerender(<Tooltip {...props} active disabled />);
        expect(await driver.isShown()).toBeFalsy();
      });

      it('should close tooltip when disabled changed to true when was active true before', async () => {
        const props = {
          ..._props,
          hideTrigger: 'custom',
          showTrigger: 'custom',
          active: true,
          disabled: false,
          children,
        };
        const { driver, rerender } = render(<Tooltip {...props} />);
        await eventually(async () =>
          expect(await driver.isShown()).toBeTruthy(),
        );
        rerender(<Tooltip {...props} disabled />);
        await eventually(async () =>
          expect(await driver.isShown()).toBeFalsy(),
        );
      });
    });

    describe('placement attribute', () => {
      it('should be top by default', async () => {
        const { driver } = render(
          <Tooltip {...{ ..._props }}>{children}</Tooltip>,
        );
        driver.mouseEnter();

        return resolveIn(30).then(async () => {
          expect(await driver.getPlacement()).toBe('top');
        });
      });

      it(`should be bottom`, async () => {
        const { driver } = render(
          <Tooltip {...{ ..._props }} placement="bottom">
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();

        return resolveIn(30).then(async () => {
          expect(await driver.getPlacement()).toBe('bottom');
        });
      });

      it(`should be top`, async () => {
        const { driver } = render(
          <Tooltip {...{ ..._props }} placement="top">
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();

        return resolveIn(30).then(async () => {
          expect(await driver.getPlacement()).toBe('top');
        });
      });

      it(`should be left`, async () => {
        const { driver } = render(
          <Tooltip {...{ ..._props }} placement="left">
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();

        return resolveIn(30).then(async () => {
          expect(await driver.getPlacement()).toBe('left');
        });
      });

      it(`should be right`, async () => {
        const { driver } = render(
          <Tooltip {...{ ..._props }} placement="right">
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();

        return resolveIn(30).then(async () => {
          expect(await driver.getPlacement()).toBe('right');
        });
      });
    });

    describe('maxWidth attribute', () => {
      it('should set default maxWidth 204', async () => {
        const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.getMaxWidth()).toBe('204px');
        });
      });

      it('should set custom maxWidth', async () => {
        const props = { ..._props, maxWidth: '400px' };
        const { driver } = render(<Tooltip {...props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.getMaxWidth()).toBe('400px');
        });
      });
    });

    describe('minWidth attribute', () => {
      it('should not have any min-width as default', async () => {
        const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.getMinWidth()).toBe(undefined);
        });
      });

      it('should set custom min-width', async () => {
        const props = { ..._props, minWidth: '150px' };
        const { driver } = render(<Tooltip {...props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.getMinWidth()).toBe('150px');
        });
      });
    });

    describe('alignment attribute', () => {
      it('should set default left', async () => {
        const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.getAlignment()).toBe('left');
        });
      });
    });

    describe('padding attribute', () => {
      it('should set default to none', async () => {
        const { driver } = render(<Tooltip {..._props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.getPadding()).toBe(undefined);
        });
      });
      it('should set custom padding', async () => {
        const props = { ..._props, padding: '5px' };
        const { driver } = render(<Tooltip {...props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.getPadding()).toBe('5px');
        });
      });
    });

    describe('showArrow prop', () => {
      const props = {
        ..._props,
        content: 'This is the content',
      };

      it('should have an arrow by default', async () => {
        const { driver } = render(<Tooltip {...props}>{children}</Tooltip>);
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.hasArrow()).toBeTruthy();
        });
      });

      it('should not show an arrow if `showArrow` is set to false', async () => {
        const { driver } = render(
          <Tooltip {...props} showArrow={false}>
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.hasArrow()).toBeFalsy();
        });
      });
    });

    describe('popover', () => {
      it('should show a tooltip on click', async () => {
        const { driver } = render(
          <Tooltip popover {..._props}>
            {children}
          </Tooltip>,
        );
        driver.click();
        expect(await driver.isShown()).toBeFalsy();
        return resolveIn(30).then(async () => {
          expect(await driver.isShown()).toBeTruthy();
        });
      });

      it('should hide a tooltip on click', async () => {
        const { driver } = render(
          <Tooltip popover {..._props}>
            {children}
          </Tooltip>,
        );
        driver.click();
        expect(await driver.isShown()).toBeFalsy();
        return resolveIn(30).then(async () => {
          expect(await driver.isShown()).toBeTruthy();
          driver.click();
          return resolveIn(30).then(async () => {
            expect(await driver.isShown()).toBeFalsy();
          });
        });
      });
    });

    it('should exist with default props when appendToParent', async () => {
      const { driver } = render(
        <Tooltip {..._props} appendToParent>
          {children}
        </Tooltip>,
      );
      driver.mouseEnter();
      expect(await driver.isShown()).toBeFalsy();
      return resolveIn(30).then(async () => {
        expect(await driver.isShown()).toBeTruthy();
        expect(await driver.getContent()).toBe("I'm the content");
        expect(await driver.hasLightTheme()).toBeTruthy();
        expect(await driver.getPlacement()).toBe('top');
      });
    });
    describe('themse', () => {
      it('should have dark theme when appendToParent', async () => {
        const { driver } = render(
          <Tooltip {..._props} appendToParent theme="dark">
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.hasDarkTheme()).toBeTruthy();
        });
      });

      it('should have error theme when appendToParent', async () => {
        const { driver } = render(
          <Tooltip {..._props} appendToParent theme="error">
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.hasErrorTheme()).toBeTruthy();
        });
      });
    });

    describe('contentHook', () => {
      const defaultProps = {
        showDelay: 5,
        hideDelay: 5,
        content: "I'm the content",
        children,
      };

      it('isShown should work when child is a Custom Component', async () => {
        const { driver } = render(
          <Tooltip
            showDelay={5}
            dataHook="my-tooltip"
            content="I'm the content"
          >
            <Button />
          </Tooltip>,
        );
        driver.mouseEnter();

        await eventually(async () => {
          expect(await driver.isShown()).toBeTruthy();
        });
      });

      it('isShown should differentiate between different tooltips given dataHooks provided', async () => {
        const { driver: firstTooltipDriver } = render(
          <Tooltip {...defaultProps} dataHook="firstTooltip" />,
        );
        const { driver: secondTooltipDriver } = render(
          <Tooltip {...defaultProps} dataHook="secondTooltip" />,
        );

        firstTooltipDriver.mouseEnter();

        await eventually(() => {
          expect(firstTooltipDriver.isShown()).toBeTruthy();
          expect(secondTooltipDriver.isShown()).toBeFalsy();
        });
      });

      it('isShown should differentiate between different tooltips given dataHooks NOT provided', async () => {
        const { driver: firstTooltipDriver } = render(
          <Tooltip {...defaultProps} />,
        );
        const { driver: secondTooltipDriver } = render(
          <Tooltip {...defaultProps} />,
        );

        firstTooltipDriver.mouseEnter();

        await eventually(() => {
          expect(firstTooltipDriver.isShown()).toBeTruthy();
          expect(secondTooltipDriver.isShown()).toBeFalsy();
        });
      });

      it('should keep contentHook when re-rendered', async () => {
        const { container, rerender } = render(<Tooltip {...defaultProps} />);
        const contentHook1 = container
          .querySelector(`[data-content-hook]`)
          .getAttribute('data-content-hook');

        rerender(<Tooltip {...defaultProps} showDelay={6} />);

        const contentHook2 = container
          .querySelector(`[data-content-hook]`)
          .getAttribute('data-content-hook');

        expect(contentHook1).toBe(contentHook2);
      });

      it('should update contentHook when dataHook changes', async () => {
        const { container, rerender, driver } = render(
          <Tooltip {...defaultProps} dataHook="firstDataHook" />,
        );

        driver.mouseEnter();
        await eventually(async () =>
          expect(await driver.isShown()).toBeTruthy(),
        );

        const contentHook1 = container
          .querySelector(`[data-content-hook]`)
          .getAttribute('data-content-hook');
        expect(contentHook1).toContain('firstDataHook');

        expect(
          document.body.querySelector(`[data-hook="${contentHook1}"]`),
        ).toBeTruthy();

        driver.mouseLeave();
        await eventually(async () =>
          expect(await driver.isShown()).toBeFalsy(),
        );

        rerender(<Tooltip {...defaultProps} dataHook="secondDataHook" />);
        driver.mouseEnter();
        await eventually(async () =>
          expect(await driver.isShown()).toBeTruthy(),
        );

        const contentHook2 = container
          .querySelector(`[data-content-hook]`)
          .getAttribute('data-content-hook');
        expect(contentHook2).toContain('secondDataHook');

        expect(
          document.body.querySelector(`[data-hook="${contentHook2}"]`),
        ).toBeTruthy();
      });

      it('should differentiate between different tooltips for all related driver methods', async () => {
        const { driver: firstDriver } = render(
          <Tooltip
            {...defaultProps}
            theme="error"
            showTrigger="click"
            placement="top"
          />,
        );
        const { driver: secondDriver } = render(
          <Tooltip
            {...defaultProps}
            theme="dark"
            showTrigger="click"
            placement="bottom"
          />,
        );

        const { driver: thirdDriver } = render(
          <Tooltip
            {...defaultProps}
            theme="light"
            showTrigger="click"
            showImmediately
            showArrow={false}
          />,
        );

        firstDriver.click();
        secondDriver.click();
        thirdDriver.click();

        await eventually(() => {
          expect(firstDriver.isShown()).toBeTruthy();
          expect(secondDriver.isShown()).toBeTruthy();
          expect(thirdDriver.isShown()).toBeTruthy();
        });

        expect(firstDriver.hasErrorTheme()).toBeTruthy();
        expect(firstDriver.hasDarkTheme()).toBeFalsy();
        expect(firstDriver.hasLightTheme()).toBeFalsy();
        expect(firstDriver.hasAnimationClass()).toBeTruthy();
        expect(firstDriver.hasArrow()).toBeTruthy();
        expect(firstDriver.getPlacement()).toBe('top');

        expect(secondDriver.hasErrorTheme()).toBeFalsy();
        expect(secondDriver.hasDarkTheme()).toBeTruthy();
        expect(secondDriver.hasLightTheme()).toBeFalsy();
        expect(secondDriver.getPlacement()).toBe('bottom');

        expect(thirdDriver.hasErrorTheme()).toBeFalsy();
        expect(thirdDriver.hasDarkTheme()).toBeFalsy();
        expect(thirdDriver.hasLightTheme()).toBeTruthy();
        expect(thirdDriver.hasAnimationClass()).toBeFalsy();
        expect(thirdDriver.hasArrow()).toBeFalsy();
      });
    });

    describe('enzyme testkit', () => {
      it('should remove a tooltip immediately once the component is destroyed', async () => {
        const { driver } = render(
          <Tooltip {..._props} hideDelay={1000}>
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();
        await eventually(async () =>
          expect(await driver.isShown()).toBeTruthy(),
        );
        cleanup();
        expect(await driver.isShown()).toBeFalsy();
      });

      it('should have fadeIn class and delay when showImmediately is unspecified', async () => {
        const { driver } = render(
          <Tooltip {..._props} content={<div>HELLO WORLD</div>}>
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.hasAnimationClass()).toBeTruthy();
        });
      });

      it('should have fadeIn class and delay when showImmediately is false', async () => {
        const { driver } = render(
          <Tooltip
            {..._props}
            content={<div>HELLO WORLD</div>}
            showImmediately={false}
          >
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();
        return resolveIn(30).then(async () => {
          expect(await driver.hasAnimationClass()).toBeTruthy();
        });
      });

      it('should not have fadeIn class and no delay when showImmediately is true', async () => {
        const { driver } = render(
          <Tooltip {..._props} content={<div>HELLO WORLD</div>} showImmediately>
            {children}
          </Tooltip>,
        );
        driver.mouseEnter();
        expect(await driver.hasAnimationClass()).toBeFalsy();
      });
    });

    describe('assertExistsWrapper', () => {
      it('should return exists false', async () => {
        const { driver } = tooltipDriverFactory({ element: null });
        expect(await driver.exists()).toBeFalsy();
      });

      it('should throw error', async () => {
        const { driver } = tooltipDriverFactory({ element: null });
        expect(() => driver.isShown()).toThrowError('Tooltip');
      });
    });
  }
});

function resolveIn(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({});
    }, timeout);
  });
}
