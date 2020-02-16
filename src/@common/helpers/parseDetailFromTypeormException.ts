export const parseDetail = (
  detail: string
): { property: string; value: any; constraints: { [key in string]: string } } => {
  const res = detail.match(/^Key \((\w+)\)=\(([\w\-@\.]+)\)\s(.*)\.$/);
  if (res && res[1] && res[2] && res[3]) {
    return {
      property: res[1],
      value: res[2],
      constraints: {
        isDatabaseConstraints: res[3],
      },
    };
  }

  return null;
};
