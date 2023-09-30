class Bridge {
  constructor(el = 'body') {
    this.element = typeof el === 'string' ? document.querySelector(el) : el;
    this.prevData = {};

    const selected = this.element.querySelectorAll('[data-crossing]');

    this.destinations = Array.from(selected)
      .map((el) => {
        const name = el.getAttribute('data-crossing');

        if (!name) {
          return null;
        }

        return {
          name,
          el,
        };
      })
      .filter(Boolean);

    return new Proxy(this, {
      set: this.set.bind(this),
    });
  }

  cross(data, prop = 'textContent') {
    this.destinations.forEach(({ el, name }) => {
      const item = data[name];

      if (item === undefined || this.prevData[name] === item) {
        return;
      }

      el[prop] = item;
    });

    Object.assign(this.prevData, data);
  }

  set(_, prop, value) {
    this.cross({
      [prop]: value,
    });
  }
}
