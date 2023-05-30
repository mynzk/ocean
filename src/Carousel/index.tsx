/* eslint-disable no-param-reassign */
import React, { memo, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useRect } from '../ObserveRect';
import { Animate, easeInOutQuart, transform } from '../utils/tool';
import './styles/index.less';

interface Props {
  children?: React.ReactNode;
  panelWidth: number;
  initial?: number;
  height?: number;
  hidden?: boolean;
}

const Carousel: React.FC<Props> = ({
  children,
  panelWidth,
  initial = 6,
  height,
  hidden = false,
}) => {
  const contentWrapper = useRef<HTMLDivElement>(null);
  const pageInfo = useRef<{ current: number; direction: string; pre: number }>({
    current: 0,
    direction: 'stop',
    pre: 0,
  });
  const contentRect = useRect(contentWrapper);
  const [, forceUpdate] = useState({});
  const childrenArray = useMemo(
    () => React.Children.toArray(children),
    [children],
  );
  const renderedItems = useRef<{ count: number; page: number; total: number }>({
    count: initial,
    page: Math.floor(childrenArray.length / initial),
    total: childrenArray.length,
  });
  const isScrolling = useRef(false);

  useLayoutEffect(() => {
    if (contentRect) {
      const { width, height } = contentRect;
      if (width && height) {
        let renderCount = renderedItems.current.count;
        renderCount = Math.floor(width / panelWidth);
        if (
          renderCount !== renderedItems.current.count ||
          renderedItems.current.total !== childrenArray.length
        ) {
          renderedItems.current.count = renderCount;
          renderedItems.current.total = childrenArray.length;
          const renderPage = Math.floor(childrenArray.length / renderCount);
          renderedItems.current.page =
            childrenArray.length % renderCount > 0
              ? renderPage
              : renderPage - 1;
          if (renderedItems.current.page === 0) {
            pageInfo.current.current = 0;
          }
          forceUpdate({});
        }
      }
    }
  }, [contentRect, childrenArray.length]);

  const moveTo = (next: number) => {
    const { current } = pageInfo.current;
    if (next === current) return;
    if (isScrolling.current) return;
    isScrolling.current = true;
    let direction = next > current ? 'forward' : 'backward';
    if (next > renderedItems.current.page) {
      direction = 'forward';
      next = renderedItems.current.page;
    }
    if (next < 0) {
      direction = 'backward';
      next = 0;
    }
    pageInfo.current = {
      current: next,
      pre: current,
      direction,
    };
    if (direction === 'forward') {
      const rest =
        (childrenArray.length - next * renderedItems.current.count) /
        renderedItems.current.count;
      const during = rest >= 1 ? 1 : rest;
      Animate(
        100 * during,
        0,
        300,
        transform.bind(null, contentWrapper.current, 100 * during),
        easeInOutQuart,
      ).then(() => (isScrolling.current = false));
    } else {
      const rest =
        (childrenArray.length - current * renderedItems.current.count) /
        renderedItems.current.count;
      const during = rest >= 1 ? 1 : rest;
      Animate(
        -100 * during,
        0,
        300,
        transform.bind(null, contentWrapper.current, -100 * during),
        easeInOutQuart,
      ).then(() => (isScrolling.current = false));
    }
    forceUpdate({});
  };

  const { current, direction } = pageInfo.current;

  let start = current * renderedItems.current.count;

  if (direction === 'forward') {
    if (
      renderedItems.current.page > 0 &&
      current >= renderedItems.current.page
    ) {
      start = childrenArray.length - renderedItems.current.count;
    }
  }

  if (direction === 'backward') {
    if (renderedItems.current.page > 0 && current === 0) start = 0;
  }

  return (
    <div className="container" style={{ display: hidden ? 'none' : 'block' }}>
      <div
        className="contentWrapper"
        style={{ height: height ? `${height}px` : 'auto' }}
      >
        <div ref={contentWrapper} className="content">
          {childrenArray.slice(start, start + renderedItems.current.count)}
        </div>
      </div>
      {current > 0 && (
        <div className={`icon icon-left`} onClick={() => moveTo(current - 1)}>
          <svg viewBox="0 0 1024 1024" width="20" height="20">
            <path
              d="M631.168 183.168a42.666667 42.666667 0 0 1 62.826667 57.621333l-2.496 2.709334L423.04 512l268.48 268.501333a42.666667 42.666667 0 0 1 2.496 57.621334l-2.496 2.709333a42.666667 42.666667 0 0 1-57.621333 2.496l-2.709334-2.496-298.666666-298.666667a42.666667 42.666667 0 0 1-2.496-57.621333l2.496-2.709333 298.666666-298.666667z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      )}
      {renderedItems.current.page > 0 &&
        current < renderedItems.current.page && (
          <div
            className={`icon icon-right`}
            onClick={() => moveTo(current + 1)}
          >
            <svg viewBox="0 0 1024 1024" width="20" height="20">
              <path
                d="M332.501333 183.168a42.666667 42.666667 0 0 1 57.621334-2.496l2.709333 2.496 298.666667 298.666667a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333-298.666667 298.666667a42.666667 42.666667 0 0 1-62.826667-57.621333l2.496-2.709334L600.96 512 332.501333 243.498667a42.666667 42.666667 0 0 1-2.496-57.621334l2.496-2.709333z"
                fill="#ffffff"
              ></path>
            </svg>
          </div>
        )}
    </div>
  );
};

export default memo(Carousel);
