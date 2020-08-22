
import { DateFormatPipe } from './DateFormat.pipe';

describe('Pipe: DateFormat', () => {
  it('create an instance', () => {
    const pipe = new DateFormatPipe('pt-br');
    expect(pipe).toBeTruthy();
  });
});