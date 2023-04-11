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
  const mounted = useRef<boolean>(false);

  const [debounceTime] = useState<number>(delay || 0);
  const [hideDuration] = useState<number>(minDuration || 0);

  const [render, setRender] = useState(debounceTime === 0 && renderCondition);

  useEffect(() => {
    mounted.current = true;
    if (!renderCondition && !render) {
      window.clearTimeout(minDurationTimer.current);
      window.clearTimeout(debounceTimer.current);
      setMinDurationPassed(false);
      setDebounceTimePassed(false);
    }
    return () => {
      mounted.current = false;
    };
  }, [renderCondition, render]);

  // Invoke related callbacks if they are provided
  useEffect(() => {
    mounted.current = true;
    if (render) {
      setRenderedOnce(true);
      if (onRender) {
        onRender();
      }
    } else if (renderedOnce && onHide) {
      onHide();
    }
    return () => {
      mounted.current = false;
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);

  useEffect(() => {
    mounted.current = true;
    if (
      // If children is already shown, wanted to be hidden and minDurationPassed, hide it
      (render && !renderCondition && ((minDurationPassed && hideDuration) || !hideDuration)) ||
      // If children is hidden, wanted to be shown and debounceTimePassed, show it
      (!render && renderCondition && ((debounceTime && debounceTimePassed) || !debounceTime))
    ) {
      setRender(renderCondition);
    }
    return () => {
      mounted.current = false;
    };
  }, [render, renderCondition, minDurationPassed, debounceTimePassed, hideDuration, debounceTime]);

  useEffect(() => {
    mounted.current = true;
    // Start timer to measure min duration time after the children is mounted
    if (render && hideDuration) {
      window.clearTimeout(minDurationTimer.current);
      setMinDurationPassed(false);
      minDurationTimer.current = window.setTimeout(() => {
        if (mounted.current) setMinDurationPassed(true);
      }, hideDuration);
    }
    return () => {
      mounted.current = false;
    };
  }, [render, hideDuration]);

  useEffect(() => {
    mounted.current = true;
    // Start timer to measure debounce time after renderCondition is set to true while render is false
    if (renderCondition && debounceTime && !render) {
      window.clearTimeout(debounceTimer.current);
      setDebounceTimePassed(false);
      debounceTimer.current = window.setTimeout(() => {
        if (mounted.current) setDebounceTimePassed(true);
      }, debounceTime);
    }
    return () => {
      mounted.current = false;
    };
  }, [renderCondition, debounceTime, render]);

  return <React.Fragment>{render ? children : null}</React.Fragment>;
};

export default DebouncedRender;
