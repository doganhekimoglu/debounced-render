import React, { useEffect, useRef, useState } from 'react';

interface DebouncedRenderProps {
  children: React.ReactNode;
  renderCondition: boolean;
  delay?: number;
  minDuration?: number;
  onRender?: () => void;
  onHide?: () => void;
}

const DebouncedRender: React.FC<DebouncedRenderProps> = ({
  children,
  renderCondition,
  delay,
  minDuration,
  onRender,
  onHide,
}) => {
  const [renderedOnce, setRenderedOnce] = useState(false);

  const [minDurationPassed, setMinDurationPassed] = useState(false);
  const [debounceTimePassed, setDebounceTimePassed] = useState(false);

  const minDurationTimer = useRef<number>(0);
  const debounceTimer = useRef<number>(0);

  const [debounceTime] = useState<number>(delay || 0);
  const [hideDuration] = useState<number>(minDuration || 0);

  const [render, setRender] = useState(debounceTime === 0 && renderCondition);

  useEffect(() => {
    if (!renderCondition && !render) {
      window.clearTimeout(minDurationTimer.current);
      window.clearTimeout(debounceTimer.current);
      setMinDurationPassed(false);
      setDebounceTimePassed(false);
    }
  }, [renderCondition, render]);

  // Invoke related callbacks if they are provided
  useEffect(() => {
    if (render) {
      setRenderedOnce(true);
      if (onRender) {
        onRender();
      }
    } else if (renderedOnce && onHide) {
      onHide();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  useEffect(() => {
    if (
      // If children is already shown, wanted to be hidden and minDurationPassed, hide it
      (render && !renderCondition && ((minDurationPassed && hideDuration) || !hideDuration)) ||
      // If children is hidden, wanted to be shown and debounceTimePassed, show it
      (!render && renderCondition && ((debounceTime && debounceTimePassed) || !debounceTime))
    ) {
      setRender(renderCondition);
    }
  }, [render, renderCondition, minDurationPassed, debounceTimePassed, hideDuration, debounceTime]);

  useEffect(() => {
    // Start timer to measure min duration time after the children is mounted
    if (render && hideDuration) {
      window.clearTimeout(minDurationTimer.current);
      setMinDurationPassed(false);
      minDurationTimer.current = window.setTimeout(() => {
        setMinDurationPassed(true);
      }, hideDuration);
    }
  }, [render, hideDuration]);

  useEffect(() => {
    // Start timer to measure debounce time after renderCondition is set to true while render is false
    if (renderCondition && debounceTime && !render) {
      window.clearTimeout(debounceTimer.current);
      setDebounceTimePassed(false);
      debounceTimer.current = window.setTimeout(() => {
        setDebounceTimePassed(true);
      }, debounceTime);
    }
  }, [renderCondition, debounceTime, render]);

  return <React.Fragment>{render ? children : null}</React.Fragment>;
};

export default DebouncedRender;
