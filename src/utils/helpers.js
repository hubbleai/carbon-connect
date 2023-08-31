export function darkenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    '#' +
    ((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1).toUpperCase()
  );
}

// Utility function to set the flag
export function setFlag(flagName, flagValue) {
  try {
    localStorage.setItem(flagName, flagValue);
  } catch (e) {
    document.cookie = `${flagName}=${flagValue}; path=/`;
  }
}

// Utility function to get the flag
export function getFlag(flagName) {
  try {
    return localStorage.getItem(flagName);
  } catch (e) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.indexOf(flagName) === 0) {
        console.log(
          'cookie.substring(flagName.length + 1)',
          cookie.substring(flagName.length + 1)
        );
        return cookie.substring(flagName.length + 1);
      }
    }
    return '';
  }
}

// Utility function to increment the flag
export function incrementOAuthCounter(flagName) {
  try {
    const currentValue = localStorage.getItem(flagName);
    console.log('currentValue', currentValue);
    const newValue = currentValue ? parseInt(currentValue) + 1 : 1;
    localStorage.setItem(flagName, newValue);
  } catch (e) {
    const cookies = document.cookie.split(';');
    let currentValue;
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.indexOf(flagName) === 0) {
        currentValue = cookie.substring(flagName.length + 1);
      }
    }
    const newValue = currentValue ? parseInt(currentValue) + 1 : 1;
    document.cookie = `${flagName}=${newValue}; path=/`;
  }
}

// Utility function to decrement the flag
export function decrementOAuthCounter(flagName) {
  try {
    const currentValue = localStorage.getItem(flagName);
    if (currentValue) {
      const newValue = parseInt(currentValue) - 1;
      localStorage.setItem(flagName, newValue);
    }
  } catch (e) {
    const cookies = document.cookie.split(';');
    let currentValue;
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.indexOf(flagName) === 0) {
        currentValue = cookie.substring(flagName.length + 1);
      }
    }
    if (currentValue) {
      const newValue = parseInt(currentValue) - 1;
      document.cookie = `${flagName}=${newValue}; path=/`;
    }
  }
}

// Utility function to get the flag
export function getOAuthCounter(flagName) {
  try {
    const flagValue = localStorage.getItem(flagName);
    console.log('flagValue', flagValue);
    return flagValue ? parseInt(flagValue) : 0;
  } catch (e) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.indexOf(flagName) === 0) {
        const flagValue = cookie.substring(flagName.length + 1);
        return flagValue ? parseInt(flagValue) : 0;
      }
    }
    return 0;
  }
}

// Utility function to delete all cookies
export function deleteAllCookies() {
  const cookies = document.cookie.split(';');
  console.log('cookies', cookies);
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
