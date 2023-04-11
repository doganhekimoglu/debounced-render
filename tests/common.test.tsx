import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { DebouncedRender } from '../src';
import { useMemo } from 'react';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function Wrapper({ children, show }: { children: JSX.Element; show: boolean }) {
  return useMemo(() => {
    if (show) return children;
    else return <></>;
  }, [children, show]);
}

test('Children should be rendered after debounce delay passes', async () => {
  const debounceDelay = 1000;
  await waitFor(
    async () => {
      render(
        <DebouncedRender delay={debounceDelay} renderCondition={true}>
          loading
        </DebouncedRender>,
      );

      await wait(debounceDelay + 50);
    },
    { timeout: 100000 },
  );
  const el = screen.queryByText('loading');
  expect(el).toBeInTheDocument();
});

test('Debounce delay timer should be reset if the component unmounted and mounted', async () => {
  const debounceDelay = 1000;
  await waitFor(
    async () => {
      const { rerender } = render(
        <Wrapper show={true}>
          <DebouncedRender delay={debounceDelay} renderCondition={true}>
            loading
          </DebouncedRender>
        </Wrapper>,
      );

      await wait(debounceDelay - 50);

      rerender(
        <Wrapper show={false}>
          <DebouncedRender delay={debounceDelay} renderCondition={true}>
            loading
          </DebouncedRender>
        </Wrapper>,
      );

      rerender(
        <Wrapper show={true}>
          <DebouncedRender delay={debounceDelay} renderCondition={true}>
            loading
          </DebouncedRender>
        </Wrapper>,
      );

      await wait(100);
    },
    { timeout: 100000 },
  );
  const el = screen.queryByText('loading');
  expect(el).not.toBeInTheDocument();
});

test('Children should not be rendered before debounce delay passes', async () => {
  const debounceDelay = 1000;
  await waitFor(
    async () => {
      render(
        <Wrapper show={true}>
          <DebouncedRender delay={debounceDelay} renderCondition={true}>
            loading
          </DebouncedRender>
        </Wrapper>,
      );

      await wait(debounceDelay - 50);
    },
    { timeout: 100000 },
  );
  const el = screen.queryByText('loading');
  expect(el).not.toBeInTheDocument();
});

test('Children should be unmounted when renderCondition is set to false and after minDuration passes', async () => {
  const minDuration = 1000;
  await waitFor(
    async () => {
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
    },
    { timeout: 100000 },
  );
  const el = screen.queryByText('loading');
  expect(el).not.toBeInTheDocument();
});

test('Children should not be unmounted when renderCondition is set to false and before minDuration passes', async () => {
  const debounceDelay = 0;
  const minDuration = 500;
  await waitFor(
    async () => {
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
    },
    { timeout: 100000 },
  );
  const el = screen.queryByText('loading');
  expect(el).toBeInTheDocument();
});

test('onRender callback should be called after the children is mounted', async () => {
  const debounceDelay = 1000;
  const renderCallback = jest.fn(() => {
    return;
  });
  await waitFor(
    async () => {
      render(
        <DebouncedRender delay={debounceDelay} renderCondition={true} onRender={renderCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(debounceDelay + 50);
    },
    { timeout: 100000 },
  );
  expect(renderCallback).toHaveBeenCalledTimes(1);
});

test('onRender callback should not be called before the children is mounted', async () => {
  const debounceDelay = 1000;
  const renderCallback = jest.fn(() => {
    return;
  });
  await waitFor(
    async () => {
      render(
        <DebouncedRender delay={debounceDelay} renderCondition={true} onRender={renderCallback}>
          loading
        </DebouncedRender>,
      );

      await wait(debounceDelay - 50);
    },
    { timeout: 100000 },
  );
  expect(renderCallback).not.toHaveBeenCalled();
});

test('onHide callback should be called after the children is unmounted', async () => {
  const debounceDelay = 0;
  const minDuration = 1000;

  const hideCallback = jest.fn(() => {
    return;
  });
  await waitFor(
    async () => {
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
    },
    { timeout: 100000 },
  );
  expect(hideCallback).toHaveBeenCalledTimes(1);
});

test('onHide callback should not be called before the children is unmounted', async () => {
  const debounceDelay = 0;
  const minDuration = 1000;

  const hideCallback = jest.fn(() => {
    return;
  });
  await waitFor(
    async () => {
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
    },
    { timeout: 100000 },
  );
  expect(hideCallback).not.toHaveBeenCalled();
});
