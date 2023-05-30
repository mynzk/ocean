/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useLayoutEffect } from 'react';
import observeRect from './observeRect';

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: any): value is Function {
  // eslint-disable-next-line eqeqeq
  return !!(value && {}.toString.call(value) == '[object Function]');
}

/**
 * Rect
 *
 * @param props
 */
const Rect: React.FC<RectProps> = ({ onChange, observe = true, children }) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const rect = useRect(ref, { observe, onChange });
  return children({ ref, rect });
};

type RectProps = UseRectOptions & {
  // eslint-disable-next-line no-undef
  children(args: {
    rect: PRect | null;
    ref: React.RefObject<any>;
  }): JSX.Element;
};

function useRect<T extends Element = HTMLElement>(
  nodeRef: React.RefObject<T | undefined | null>,
  options?: UseRectOptions,
): null | DOMRect;

function useRect<T extends Element = HTMLElement>(
  nodeRef: React.RefObject<T | undefined | null>,
  observe?: UseRectOptions['observe'],
  onChange?: UseRectOptions['onChange'],
): null | DOMRect;

/**
 * useRect
 *
 * @param nodeRef
 * @param observe
 * @param onChange
 */
function useRect<T extends Element = HTMLElement>(
  nodeRef: React.RefObject<T | undefined | null>,
  observeOrOptions?: boolean | UseRectOptions,
  deprecated_onChange?: UseRectOptions['onChange'],
): null | DOMRect {
  let observe: boolean;
  let onChange: UseRectOptions['onChange'];
  if (isBoolean(observeOrOptions)) {
    observe = observeOrOptions;
  } else {
    observe = observeOrOptions?.observe ?? true;
    onChange = observeOrOptions?.onChange;
  }
  if (isFunction(deprecated_onChange)) {
    onChange = deprecated_onChange;
  }

  const [element, setElement] = React.useState(nodeRef.current);
  const initialRectIsSet = React.useRef(false);
  const initialRefIsSet = React.useRef(false);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const onChangeRef = React.useRef(onChange);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    onChangeRef.current = onChange;
    if (nodeRef.current !== element) {
      setElement(nodeRef.current);
    }
  });

  useLayoutEffect(() => {
    if (element && !initialRectIsSet.current) {
      initialRectIsSet.current = true;
      setRect(element.getBoundingClientRect());
    }
  }, [element]);

  useLayoutEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!observe) return;

    let elem = element;
    if (!initialRefIsSet.current) {
      initialRefIsSet.current = true;
      elem = nodeRef.current;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!elem) return;

    const observer = observeRect(elem, (rect) => {
      onChangeRef.current?.(rect);
      setRect(rect);
    });
    observer.observe();
    return () => {
      observer.unobserve();
    };
  }, [observe, element, nodeRef]);

  return rect;
}

type UseRectOptions = {
  observe?: boolean;
  onChange?: (rect: PRect) => void;
};

type PRect = Partial<DOMRect> & {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
};

export default Rect;
export { Rect, useRect };
