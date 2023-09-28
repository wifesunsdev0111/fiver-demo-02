/**
 * Processes an input object or array and returns a new object or array with the following transformations:
 * 1. For each property of type "object" that has a sub-property of type array called "children", creates another property
 *    with the same name as the original property, but the value of it is the same as the "children" array.
 * 2. For each property of type "object" that has a sub-property called "en", creates another property with the same name
 *    as the original property but the value of "en". Then deletes the original property.
 * 3. For each property called "image" of type "object" that has a nested "image" property, gets the value of the deepest
 *    "image" sub-property and assigns it to a new property that has the name "image". Then deletes the original "image"
 *    property of type "object".
 * 4. Deletes properties called "id" or "query_id".
 *
 * @param {object|array} input - The input object or array to process.
 * @returns {object|array} The processed object or array.
 */

export function contentProcessor(input) {
  if (Array.isArray(input)) {
    return input.map(contentProcessor);
  }

  if (typeof input !== 'object' || input === null) {
    return input;
  }

  const result = {};

  for (const [key, value] of Object.entries(input)) {
    if (key === 'id' || key === 'query_id') {
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      if ('children' in value && Array.isArray(value.children)) {
        result[key] = value.children.map(contentProcessor);
      } else if ('en' in value) {
        result[key] = value.en;
      } else if ('image' in value) {
        let nestedImage = value.image;
        while (typeof nestedImage === 'object' && nestedImage !== null && 'image' in nestedImage) {
          nestedImage = nestedImage.image;
        }
        result[key] = nestedImage;
      } else {
        result[key] = contentProcessor(value);
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}


export function removeFocusOutline() {
  document.addEventListener('mousedown', function() {
    const el = document.getElementById('outline-none');

    if (el == null) {
      const css = '* { outline: none !important; }';

      const style = document.createElement('style');
      style.id = 'outline-none';
      style.appendChild(document.createTextNode(css));

      document.body.appendChild(style);
    }
  });

  document.addEventListener('keydown', function() {
    const el = document.getElementById('outline-none');

    if (el != null) {
      el.remove();
    }
  });
}
