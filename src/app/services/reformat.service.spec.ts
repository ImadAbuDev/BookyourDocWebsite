import {ReformatService} from './reformat.service';

describe('reformat the date', function () {
  it('prints out the date with month and in german format', function () {
    const component = new ReformatService();
    const input = '2018-01-01T00:30:00.001Z';
    const sorted = component.beautifulizedate(input);
    expect(sorted).toEqual('01. January 2018 - 00:30');
  });
});


describe('return month as string', function () {
  it('return month', function () {
    const component = new ReformatService();
    const input = '03';
    const sorted = component.month(input);
    expect(sorted).toEqual('March');
  });
});

describe('convert state to userfriendly output', function () {
  it('return userfriendly state', function () {
    const component = new ReformatService();
    const input = 'BOOK_INT';
    const sorted = component.convertstate(input);
    expect(sorted).toEqual('Booked: ');
  });
});


describe('show state', function () {
  it('if name is inserted then show name, else --free--', function () {
    const component = new ReformatService();
    const input = 'Marta';
    const sorted = component.showstate(input);
    expect(sorted).toEqual('Marta');
  });
});
