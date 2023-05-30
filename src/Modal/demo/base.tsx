import { Modal } from 'ocean';
import React from 'react';

export default () => {
  const handleClick = () => {
    Modal({
      title: '共享屏幕',
      okText: '开始共享',
      cancelText: '取消',
      content: <div></div>,
    });
  };
  return <div onClick={handleClick}>点击</div>;
};
