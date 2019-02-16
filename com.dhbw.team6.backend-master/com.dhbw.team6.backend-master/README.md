# API Doc

"authRequired" means this session has to be authenticated

Dokumentation für CI/Entwicker: CI.md

GET /init  
RES: `{token: jwt-token}`  

POST /login  
REQ: `{mail: mail, password: pw}`  
RES: `{error: "Errormessage"}` or  
`{okay: true, message: ""}`

GET /doctors authRequired
RES: All doctors available

GET /status
RES: State of user (authenticated) and session

GET /user authRequired
RES: mail, firstname and lastname of user

POST /register
REQ: `{"type": "DOCTOR","gender": "MALE","first_name": "Max","last_name": "Mustermann","mail": "asd@example.com","password": "****"}`
RES: `{okay: true OR error: "Fehlermeldung"}`

POST /login
REQ: {mail, password}
RES: okay OR error

POST /logout authRequired
REQ: -
RES: okay OR error

GET /doctors/my authRequired
RES: All doctors the current user is allowed to manage

GET /doctor/:id authRequired
RES details & Slots of doctor :id

POST /doctors authRequired adminOnly
Creates new doctor

POST /slot authRequired doctorOnly
REQ: start, end, docid
RES: Creates new timeslots in 30m-space for doctor docid between start and end

POST /slot/:id authRequired
RES: Books slot with id :id for current user

GET /slots authRequired
RES: all slots booked for current user

GET /slots/:docid authRequired doctorOnly
RES: all slots for doctor
