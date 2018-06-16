export const parseDetail = (detail: string) => {
  return detail.match(/^Key \((\w+)\)\=\(([\w@\._]+)\)\s(.*)\.$/);
};