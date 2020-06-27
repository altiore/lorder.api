import { get } from 'lodash';

export default function (rawReferer?: string): string | undefined {
  return typeof rawReferer === 'string' ? get(rawReferer.match(/^(http[s]?):\/\/[\w-\.:]*/), 0) : undefined;
}
