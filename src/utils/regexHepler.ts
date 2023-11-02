export const regexEditInput = (value: string) => {
  if (!value || value.trim().length <= 0) {
    return false;
  }
  return true;
};
