import { Carousel } from 'ocean';
import React from 'react';

const style = {
  width: '90px',
  height: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#4787ac',
  margin: '0 3px',
};

export default () => {
  return (
    <div style={{ width: '400px', height: '52px', margin: '0 auto' }}>
      <Carousel panelWidth={96} height={50} initial={3}>
        <div style={style}>1</div>
        <div style={style}>2</div>
        <div style={style}>3</div>
        <div style={style}>4</div>
        <div style={style}>5</div>
        <div style={style}>6</div>
        <div style={style}>7</div>
        <div style={style}>8</div>
      </Carousel>
    </div>
  );
};
