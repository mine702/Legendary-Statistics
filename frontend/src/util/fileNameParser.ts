export const getExt = (fileName: string): string | undefined => {
  return fileName.split('.').pop();
}

export const isImage = (fileName: string): boolean => {
  const ext = getExt(fileName);
  return ['jpg', 'jpeg', 'png', 'gif'].includes(<string>ext);
}
