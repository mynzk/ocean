/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
export function easeInOutQuart(t: any) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}

/**
 *  执行补间动画方法
 *
 * @param      {Number}    start     开始数值
 * @param      {Number}    end       结束数值
 * @param      {Number}    time      补间时间
 * @param      {Function}  callback  每帧回调
 * @param      {Function}  timing    速度曲线，默认匀速
 */

export function Animate(
  start: number,
  end: number,
  time: number,
  callback: (val: any) => void,
  timing = (t: any) => t,
) {
  const startTime = performance.now(); // 设置开始的时间戳
  const differ = end - start; // 拿到数值差值
  return new Promise<void>((resolve, reject) => {
    // 创建每帧之前要执行的函数
    function loop() {
      raf = requestAnimationFrame(loop); // 下一阵调用每帧之前要执行的函数
      const passTime = performance.now() - startTime; // 获取当前时间和开始时间差
      let per = passTime / time; // 计算当前已过百分比
      if (per >= 1) {
        // 判读如果已经执行
        per = 1; // 设置为最后的状态
        cancelAnimationFrame(raf); // 停掉动画
        resolve();
      }
      const pass = differ * timing(per); // 通过已过时间百分比*开始结束数值差得出当前的数值
      callback(pass);
    }
    let raf = requestAnimationFrame(loop); // 下一阵调用每帧之前要执行的函数
  });
}

export function transform(box: any, transform: number, value: number) {
  box.style.transform = `translateX(${transform + value}%)`;
}

export function getDeviceType() {
  const agent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  let deviceType = '';
  if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
    deviceType = 'win';
  }
  if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
    deviceType = 'win';
  }
  if (isMac) {
    deviceType = 'mac';
  }
  return deviceType;
}

export const emitter = (() => {
  const subscriptions = new Map();
  return {
    emit: (v: any) => subscriptions.forEach((fn) => fn(v)),
    subscribe: (fn: (v: any) => void) => {
      const key = Symbol();
      subscriptions.set(key, fn);
      return () => subscriptions.delete(key);
    },
  };
})();
