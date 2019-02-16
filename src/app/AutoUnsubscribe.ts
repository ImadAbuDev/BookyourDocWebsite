export function AutoUnsubscribe(constructor) {

  const original = constructor.prototype.ngOnDestroy;

  constructor.prototype.ngOnDestroy = function () {
    for (const prop in this) {
      if (original && typeof original === 'function' && original.apply(this, arguments)) {
        const property = this[prop];
        if (property && (typeof property.unsubscribe === 'function')) {
          property.unsubscribe();
        }
      }
    }

  };

}
