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
