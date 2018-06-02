Crclrrr
=======

Creates an SVG circular progress indicator inside the element matching a container element.

While loading it adds the `loading` class to the element.

Install
-------

### With Bower

```bash
bower install crclrrr
```

### With NPM

```bash
npm install crclrrr
```

Example Setup
-------------

### Javascript

```javascript
import Crclrrr from 'crclrrr';

const element = document.querySelector('.element');

// create an instance passing options (defaults)
const crclrrr = new Crclrrr(element, {
  size: 40,
  border: 3,
  round: true,
  bg: 'ghostwhite',
  progress: 'lightgreen',
  duration: 1500,
  baseClass: 'crclrrr',
  initial: 0,
  easing: t => t,
});

// Set the value
crclrrr.value = 23; // from 0 to 100

// Reset the value
crclrrr.reset(); // resets to the initial value
crclrrr.reset(40); // resets to the specified value

// Destroy the instance
crclrrr.destroy()); // removes the SVG element

// Listen for the complete event on the instance
crclrrr.on('complete', function(instance) {});

// Listen for the complete event on the element
element.addEventListener('crclrrr-complete', function(e) {});
```

License
-------

[MIT License](LICENSE)
