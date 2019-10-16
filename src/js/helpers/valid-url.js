export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  }
  
  catch {
    return false;  
  }
}