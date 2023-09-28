export const customFetch = (...props) => {
  return fetch(...props).catch((error) => {
    console.error('Error:', error);
  });
};

export const fetchJson = (url, options) => {
  return customFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  }).then((response) => response.json());
};
