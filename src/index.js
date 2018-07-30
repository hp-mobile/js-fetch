const baseURI = (
  document.baseURI || document.querySelector('base').href
).replace('IScript_Main', 'IScript_');

const isFramed = (() => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
})();

// @link https://stackoverflow.com/a/25490531/719817
const getCookieValue = name => {
  const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return match ? match.pop() : '';
};

const checkResponse = async response => {
  const isOK =
    !response.headers.has('x-status-code') ||
    parseInt(response.headers.get('x-status-code'), 10) < 300;
  if (response.ok && isOK) return response.json();
  throw await response.json();
};

const doFetch = (
  url,
  {
    method = 'GET',
    credentials = 'same-origin',
    accept = 'application/json',
    headers = {},
    ...otherArgs
  } = {}
) => {
  if (isFramed) {
    parent.postMessage('is-active', '*'); // Let parent know child is active
  }
  return fetch(url.indexOf('http') === 0 ? url : baseURI + url, {
    method,
    credentials,
    headers: { accept, ...headers },
    ...otherArgs
  });
};

const doPost = (url, { method = 'POST', headers = {}, ...otherArgs } = {}) =>
  doFetch(url, {
    method,
    headers: {
      'X-CSRF-Token': getCookieValue('CSRFCookie'), // Send CSRF token
      ...headers
    },
    ...otherArgs
  });

const doFormPost = (url, { headers = {}, ...otherArgs } = {}) =>
  doPost(url, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ...headers
    },
    ...otherArgs
  });

// Set postDataBin if it has not already been set
const getBinaryURL = url => {
  if (/[?&]postDataBin=/.test(url)) return url;
  const separator = url.indexOf('?') === -1 ? '?' : '&';
  return url + separator + 'postDataBin=y';
};

const doJSONPost = (url, { headers = {}, ...otherArgs } = {}) =>
  doPost(getBinaryURL(url), {
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    ...otherArgs
  });

export const json = async (...args) => {
  const response = await doFetch(...args);
  return checkResponse(response);
};

export const postForm = async (...args) => {
  const response = await doFormPost(...args);
  return checkResponse(response);
};

export const postJSON = async (...args) => {
  const response = await doJSONPost(...args);
  return checkResponse(response);
};
