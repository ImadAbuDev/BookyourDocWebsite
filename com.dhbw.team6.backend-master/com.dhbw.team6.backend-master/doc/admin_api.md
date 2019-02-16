## Admin Manual

Some administration-related tasks must be done either inside the database or over the API.

A user performing Admin-Requests must have the role "ADMIN" - this upgrade must be performed manually trough the database.

The API-Requests must be performed as usual with an valid X-Auth-Token embedded as header.

POST /doctors as admin to create new doctor-listing
Body:
``{
​	"uid":"",// Enter User-ID of the doctor's account
​    "name":"Dr. Max Mustermann",
​    "field":"Zahnarzt",
​    "c_mail":"a@b.de",
​    "c_phone":"",
​    "a_name":"",
​    "a_street":"",
​    "a_number":"",
​    "a_zip":"",
​    "a_city":"",
​    "a_country":"DE",
​    "default_time":30
  }``