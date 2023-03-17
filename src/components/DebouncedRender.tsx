import React, { useEffect, useRef, useState } from 'react';

interface DebouncedRenderProps {
  children: React.ReactNode;
  renderCondition: boolean;
  delay: number;
  minDuration?: number;
  onRender?: () => void;
}

const DebouncedRender: React.FC<DebouncedRenderProps> = ({
  children,
  renderCondition,
  delay,
  minDuration,
  onRender,
}) => {
  const [debounceTime] = useState<number>(delay || 0);
  const [hideDuration] = useState<number>(minDuration || 0);
  const [render, setRender] = useState(debounceTime === 0 && renderCondition);
  const timerRef = useRef<number>(0);
  const hideTimerRef = useRef<number>(0);

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    window.clearTimeout(hideTimerRef.current);
    if (!renderCondition) {
      if (hideDuration > 0) {
        hideTimerRef.current = window.setTimeout(() => {
          setRender(renderCondition);
        }, hideDuration);
      } else {
        setRender(renderCondition);
      }
    } else {
      if (debounceTime > 0) {
        timerRef.current = window.setTimeout(() => {
          setRender(renderCondition);
        }, debounceTime);
      } else {
        setRender(renderCondition);
      }
    }

    return () => {
      window.clearTimeout(timerRef.current);
      window.clearTimeout(hideTimerRef.current);
    };
  }, [renderCondition, debounceTime, hideDuration]);

  useEffect(() => {
    if (render && onRender) {
      onRender();
    }
  }, [render]);

  return <React.Fragment>{render ? children : null}</React.Fragment>;
};

export default DebouncedRender;
