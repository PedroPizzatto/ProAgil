
import { DateFormatPipe } from './DateFormat.pipe';

describe('Pipe: DateFormat', () => {
  it('create an instance', () => {
    let pipe = new DateFormatPipe('pt-br');
    expect(pipe).toBeTruthy();
  });
});