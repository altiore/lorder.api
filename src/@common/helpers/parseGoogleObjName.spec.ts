import { parseGoogleObjName } from './parseGoogleObjName';

const imgUrl = 'https://farm4.staticflickr.com/3894/15008518202_c265dfa55f_h.jpg';
const imgUrl2 = 'https://altiore.storage.googleapis.com/bdbc859424f2c11741666dee6d267e88.jpg';

describe('parseGoogleObjName', () => {
  it('parseGoogleObjName', () => {
    expect(parseGoogleObjName(imgUrl)).toBe('15008518202_c265dfa55f_h.jpg');
  });

  it('parseGoogleObjName 2', () => {
    expect(parseGoogleObjName(imgUrl2)).toBe('bdbc859424f2c11741666dee6d267e88.jpg');
  });
});
