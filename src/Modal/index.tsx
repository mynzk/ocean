/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/button-has-type */
import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { createRoot, Root } from 'react-dom/client';
import './styles/index.less';

type CreateRootFnType = (container: Element | DocumentFragment) => Root & {
  _unmount: () => void;
};

interface ConfirmProps {
  title?: string | ReactNode;
  content?: ReactNode;
  icon?: ReactNode | null;
  onCancel?: () => void;
  onOk?: (e?: MouseEvent) => Promise<any> | void;
  visible?: boolean;
  loading?: boolean;
  okText?: string;
  cancelText?: string;
  style?: CSSProperties;
  wrapStyle?: CSSProperties;
}

const copyRender = (
  app: ReactElement,
  container: Element | DocumentFragment,
) => {
  const root = (createRoot as CreateRootFnType)(container);

  root.render(app);

  root._unmount = function () {
    setTimeout(() => {
      root?.unmount?.();
    });
  };
  return root;
};

export function ConfirmModal(props: ConfirmProps) {
  if (!props.visible) return null;
  return createPortal(
    <div className={'modal-mask'} onWheel={(e) => e.stopPropagation()}>
      <div className={`modal-wrapper modal-align-center`}>
        <div className={'modal'} style={props.wrapStyle}>
          <div className={'modal-header'}>
            <div className={'modal-title'}>{props.title || ''}</div>
          </div>
          <div className={'modal-content'} style={props.style}>
            {props.content}
          </div>
          <div className={'modal-footer'}>
            <button className={'btn-normal'} onClick={() => props.onCancel?.()}>
              {props.cancelText || 'cancel'}
            </button>
            <button
              className={'btn-primary'}
              onClick={(e: any) => {
                props.onOk?.(e);
              }}
            >
              {props.okText || 'ok'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function confirm(config: ConfirmProps) {
  let root: (Root & { _unmount: () => void }) | undefined = undefined;
  const div = document.createElement('div');
  document.body.appendChild(div);
  function render(props: ConfirmProps) {
    const dom = <ConfirmModal {...props} onCancel={onCancel} />;
    if (root) {
      root.render(dom);
    } else {
      root = copyRender(dom, div);
    }
  }
  const renderFunction = render;
  let modalConfig: ConfirmProps = {
    ...config,
    visible: false,
  };
  const onOk = () => {
    let ret;
    const _onOk = config.onOk;
    if (_onOk) {
      ret = _onOk();
    }
    if (ret && ret.then) {
      modalConfig.loading = true;
      renderFunction(modalConfig);
      ret.then(
        () => {
          onCancel(true);
        },
        (e: Error) => {
          console.error(e);
          modalConfig.loading = false;
          renderFunction(modalConfig);
        },
      );
    }
    if (!ret) {
      onCancel(true);
    }
  };

  modalConfig.onOk = onOk;
  modalConfig.visible = true;
  renderFunction(modalConfig);

  function destroy() {
    root?._unmount();
    root = undefined;
    if (div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  function onCancel(isOnOk?: boolean) {
    !isOnOk && config.onCancel && config.onCancel();
    modalConfig.visible = false;
    renderFunction(modalConfig);
    destroy();
  }

  function update(newConfig: ConfirmProps) {
    modalConfig = {
      ...modalConfig,
      title: config.title, // 避免 newConfig 未传递 title 时，icon 出现多个的问题
      ...newConfig,
    };
    renderFunction(modalConfig);
  }

  function close() {
    modalConfig.visible = false;
    renderFunction(modalConfig);
    destroy();
  }

  return {
    close,
    update,
  };
}

export default confirm;
