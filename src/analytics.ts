import * as $ from 'jquery';

function  createAnalytics(): Object {
  let counter:number = 0;
  let isDestroyed:boolean = false;
  const listener:Function = () => counter++;

  $(document).on('click', listener);

  return {
    destroy() {
      $(document).off('click', listener);
      isDestroyed = true;
    },
    getClicks() {
      if (isDestroyed) return 'Analytics is destroyed';
      return counter;
    },
  };
}

window['analytics'] = createAnalytics();
