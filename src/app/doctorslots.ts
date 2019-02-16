export class Doctorslots {
  _id: string;
  contact: {
    mail: string,
    phone: string;
  };
  address: {
    country: string,
    name: string;
    street: string,
    number: string;
    zip: string,
    city: string;
  };
  name: string;
  field: string;
  slots: [{
    state: string;
    _id: string;
    start: string;
    end: string;
    __v: string;
  }];
}
