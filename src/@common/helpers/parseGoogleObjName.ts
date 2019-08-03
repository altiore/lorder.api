export const parseGoogleObjName = (imgUrl: string): string => {
  return imgUrl.match(/\/([a-zA-Z_\-0-9]*\.(jpg|jpeg|gif|png))$/)[1];
};
