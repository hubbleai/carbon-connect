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

export function formatFileSize(sizeInBytes) {
  const sizeInKB = sizeInBytes / 1000;
  const sizeInMB = sizeInBytes / 1000000;

  if (sizeInMB >= 1) {
    return `${sizeInMB.toFixed(2)} MB`;
  } else if (sizeInKB >= 1) {
    return `${sizeInKB.toFixed(2)} KB`;
  } else {
    return `${sizeInBytes} bytes`;
  }
}
