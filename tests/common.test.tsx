import '@testing-library/jest-dom';
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { DebouncedRender } from '../src';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

test('Children should be rendered after debounceDelay passes', async () => {
  const debounceDelay = 1000;

  const { rerender } = render(
    <DebouncedRender delay={debounceDelay} renderCondition={false}>
      loading
    </DebouncedRender>,
  );

  await wait(50);
  rerender(
    <DebouncedRender delay={debounceDelay} renderCondition={true}>
      loading
    </DebouncedRender>,
  );

  await wait(debounceDelay + 50);
  await waitFor(
    () => {
      const linkElement = screen.queryByText('loading');
      expect(linkElement).toBeInTheDocument();
    },
    { timeout: 0 },
  );
});

test('Children should not be rendered before debounceDelay passes', async () => {
  const debounceDelay = 1000;

  const { rerender } = render(
    <DebouncedRender delay={debounceDelay} renderCondition={false}>
      loading
    </DebouncedRender>,
  );

  await wait(50);
  rerender(
    <DebouncedRender delay={debounceDelay} renderCondition={true}>
      loading
    </DebouncedRender>,
  );

  await wait(debounceDelay - 50);
  await waitFor(
    () => {
      const linkElement = screen.queryByText('loading');
      expect(linkElement).not.toBeInTheDocument();
    },
    { timeout: 0 },
  );
});

test('Children should be unmounted after minDuration passes', async () => {
  const debounceDelay = 0;
  const minDuration = 500;

  const { rerender } = render(
    <DebouncedRender delay={debounceDelay} renderCondition={true} minDuration={minDuration}>
      loading
    </DebouncedRender>,
  );

  await wait(50);
  rerender(
    <DebouncedRender delay={debounceDelay} renderCondition={false} minDuration={minDuration}>
      loading
    </DebouncedRender>,
  );

  await wait(minDuration + 50);
  await waitFor(
    () => {
      const linkElement = screen.queryByText('loading');
      expect(linkElement).not.toBeInTheDocument();
    },
    { timeout: 0 },
  );
});

test('Children should not be unmounted before minDuration passes', async () => {
  const debounceDelay = 0;
  const minDuration = 500;

  const { rerender } = render(
    <DebouncedRender delay={debounceDelay} renderCondition={true} minDuration={minDuration}>
      loading
    </DebouncedRender>,
  );

  await wait(50);
  rerender(
    <DebouncedRender delay={debounceDelay} renderCondition={false} minDuration={minDuration}>
      loading
    </DebouncedRender>,
  );

  await wait(minDuration - 50);
  await waitFor(
    () => {
      const linkElement = screen.queryByText('loading');
      expect(linkElement).toBeInTheDocument();
    },
    { timeout: 0 },
  );
});

test('onRender callback should be called after the children is mounted', async () => {
  const debounceDelay = 1000;

  const renderCallback = jest.fn(() => {
    return;
  });

  const { rerender } = render(
    <DebouncedRender delay={debounceDelay} renderCondition={false} onRender={renderCallback}>
      loading
    </DebouncedRender>,
  );

  await wait(50);
  rerender(
    <DebouncedRender delay={debounceDelay} renderCondition={true} onRender={renderCallback}>
      loading
    </DebouncedRender>,
  );

  await wait(debounceDelay + 50);
  await waitFor(
    () => {
      expect(renderCallback).toHaveBeenCalled();
    },
    { timeout: 0 },
  );
});

test('onRender callback should not be called before the children is mounted', async () => {
  const debounceDelay = 1000;

  const renderCallback = jest.fn(() => {
    return;
  });

  const { rerender } = render(
    <DebouncedRender delay={debounceDelay} renderCondition={false} onRender={renderCallback}>
      loading
    </DebouncedRender>,
  );

  await wait(50);
  rerender(
    <DebouncedRender delay={debounceDelay} renderCondition={true} onRender={renderCallback}>
      loading
    </DebouncedRender>,
  );

  await wait(debounceDelay - 50);
  await waitFor(
    () => {
      expect(renderCallback).not.toHaveBeenCalled();
    },
    { timeout: 0 },
  );
});
