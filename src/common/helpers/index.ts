export const loadResource = async (url: string, options?: Record<string, string|number>) => {
  try {
    const optionsString = options &&
      Object
        .entries(options)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    const response = await fetch(`${url}?${optionsString}`);
    return response.json();
  } catch (e) {
    console.error(e);
  }
}

export const classNames = (classnames: (string|[string, boolean])[]) =>
  classnames
    .reduce((classStrings, className) => {
      if (Array.isArray(className)) {
        return (className[1] && classStrings.concat(className[0])) || classStrings;
      }

      return classStrings.concat(className as string);
    }, [] as string[])
    .join(' ');

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
) => {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  }

  return debounced;
}

export const throttle = (fn: Function, wait: number = 300) => {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number;
  return function (this: any) {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
