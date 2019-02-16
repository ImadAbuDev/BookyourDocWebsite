export class Doctor {
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
  // slots: string;
  __v: string;
}
