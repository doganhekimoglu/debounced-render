import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { DebouncedRender } from '../src';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

test('Children should be rendered after debounce delay passes', async () => {
  await waitFor(
    async () => {
      const debounceDelay = 1000;

      //await act(() => {
      render(
        <DebouncedRender delay={debounceDelay} renderCondition={true}>
          loading
        </DebouncedRender>,
      );
      //});

      await wait(debounceDelay + 50);

      const linkElement = screen.queryByText('loading');
      expect(linkElement).toBeInTheDocument();
    },
    { timeout: 100000 },
  );
});

test('Children should not be rendered before debounce delay passes', async () => {
  await waitFor(
    async () => {
      const debounceDelay = 1000;

      render(
        <DebouncedRender delay={debounceDelay} renderCondition={true}>
          loading
        </DebouncedRender>,
      );

      await wait(debounceDelay - 50);

      const linkElement = screen.queryByText('loading');
      expect(linkElement).not.toBeInTheDocument();
    },
    { timeout: 100000 },
  );
});

test('Children should be unmounted when renderCondition is set to false and after minDuration passes', async () => {
  await waitFor(
    async () => {
      const minDuration = 1000;

      const { rerender } = render(
        <DebouncedRender renderCondition={true} minDuration={minDuration}>
          loading
        </DebouncedRender>,
      );

      await wait(minDuration - 50);
      rerender(
        <DebouncedRender renderCondition={false} minDuration={minDuration}>
          loading
        </DebouncedRender>,
      );

      await wait(100);

      const linkElement = screen.queryByText('loading');
      expect(linkElement).not.toBeInTheDocument();
    },
    { timeout: 100000 },
  );
});

test('Children should not be unmounted when renderCondition is set to false and before minDuration passes', async () => {
  await waitFor(
    async () => {
      const debounceDelay = 0;
      const minDuration = 500;

      const { rerender } = render(
        <DebouncedRender delay={debounceDelay} renderCondition={true} minDuration={minDuration}>
          loading
        </DebouncedRender>,
      );

      await wait(minDuration - 100);

      rerender(
        <DebouncedRender delay={debounceDelay} renderCondition={false} minDuration={minDuration}>
          loading
        </DebouncedRender>,
      );

      await wait(50);

      const linkElement = screen.queryByText('loading');
      expect(linkElement).toBeInTheDocument();
    },
    { timeout: 100000 },
  );
});

test('onRender callback should be called after the children is mounted', async () => {
  await waitFor(
    async () => {
      const debounceDelay = 1000;

      const renderCallback = jest.fn(() => {
        return;
      });

      render(
        <DebouncedRender delay={debounceDelay} renderCondition={true} onRender={renderCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(debounceDelay + 50);

      expect(renderCallback).toHaveBeenCalledTimes(1);
    },
    { timeout: 100000 },
  );
});

test('onRender callback should not be called before the children is mounted', async () => {
  await waitFor(
    async () => {
      const debounceDelay = 1000;

      const renderCallback = jest.fn(() => {
        return;
      });

      render(
        <DebouncedRender delay={debounceDelay} renderCondition={true} onRender={renderCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(debounceDelay - 50);

      expect(renderCallback).not.toHaveBeenCalled();
    },
    { timeout: 100000 },
  );
});

test('onHide callback should be called after the children is unmounted', async () => {
  await waitFor(
    async () => {
      const debounceDelay = 0;
      const minDuration = 1000;

      const hideCallback = jest.fn(() => {
        return;
      });

      const { rerender } = render(
        <DebouncedRender delay={debounceDelay} renderCondition={true} minDuration={minDuration} onHide={hideCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(minDuration - 50);

      rerender(
        <DebouncedRender delay={debounceDelay} renderCondition={false} minDuration={minDuration} onHide={hideCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(100);

      expect(hideCallback).toHaveBeenCalledTimes(1);
    },
    { timeout: 100000 },
  );
});

test('onHide callback should not be called before the children is unmounted', async () => {
  await waitFor(
    async () => {
      const debounceDelay = 0;
      const minDuration = 1000;

      const hideCallback = jest.fn(() => {
        return;
      });

      const { rerender } = render(
        <DebouncedRender delay={debounceDelay} renderCondition={true} minDuration={minDuration} onHide={hideCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(minDuration - 100);

      rerender(
        <DebouncedRender delay={debounceDelay} renderCondition={false} minDuration={minDuration} onHide={hideCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(50);

      expect(hideCallback).not.toHaveBeenCalled();
    },
    { timeout: 100000 },
  );
});
