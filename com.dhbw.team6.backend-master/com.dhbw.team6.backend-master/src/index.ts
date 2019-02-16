import express = require("express");
const app = express();

// Configuration
const mongoUrl = "mongodb://10.1.1.7:27017/byd";

import bcrypt = require("bcrypt");
import bodyParser = require("body-parser");
import * as EmailValidator from "email-validator";
import hateoasLinker = require("express-hateoas-links");
import pretty = require("express-prettify");
import fs = require("fs");
import jwt = require("jsonwebtoken");
import moment = require("moment");
import mongoose = require("mongoose");
import morgan = require("morgan");

// Mongoose definitions
import model_doc = require("./models/doctor");
import model_session = require("./models/session");
import model_slot = require("./models/timeslot");
import model_user = require("./models/user");

// Handle the data
let buildV = { build: -1 };
const handleJSONFile = (err: any, data: any) => {
  if (err) {
    throw err;
  }
  buildV = JSON.parse(data);
};

// Load Build Data
fs.readFile("./build.json", handleJSONFile);

mongoose.connect(mongoUrl).then(
  () => { console.log("MongoDB connected"); },
  (err) => { console.error("MongoDB error:" + err); process.exit(1); },
);

// Type Definitons
// ToDo: other file
declare global {
  namespace Express {
    interface Request {
      user: any;
      ssid: any;
    }
  }
}
interface UserObject {
  [key: string]: any;
}

const intervalFromNow = () => {
  const timeObject = new Date();
  timeObject.setTime(timeObject.getTime() + 1000 * 60 * 60 * 24 * 7);
  return timeObject;
};
// ToDo: Load Secret from external file
const secret = "jwt-secret";

// Use express body parser
app.use(bodyParser());
// Error Handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.log(err.stack);
  res.status(500).json({ error: "Internal server error, please contact admin!" });
});
// use logging-middleware
app.use(morgan("dev"));
// use prettify-middleware
app.use(pretty({ query: "pretty" }));
// Verify JWT if existing
const jwtMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Create new User property
  req.user = { authenticated: false };
  if (req.header("X-Auth-Token")) {
    console.log("Auth Token found");
    jwt.verify(req.header("X-Auth-Token") as string, secret, (err: any, decoded: any) => {
      console.log(decoded);
      if (err) {
        res.status(401).json({ error: "invalid token" });
        res.end();
        return;
      } else {
        req.user.ssid = decoded.ssid;
        next();
      }
    });
  } else {
    next();
  }
};
app.use(jwtMiddleware);

// Middleware for authorization requirements
const authRequired = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  sessionRequired(req, res, () => {
    // Try to create session
    model_session.findOne({ _id: req.ssid }, (err: any, result: any) => {
      if (err) {
        res.status(500).end();
        console.error("MongoDB query session error:" + err);
      } else {
        if (result) {
          console.log("Session found: " + result._id);
          if (result.expires && result.expires >= Date.now()) {
            // Check if user is authenticated
            if (result.authenticated && (result.authenticated === true)) {
              req.user.authenticated = true;
              if (result.userid) {
                model_user.findOne({ _id: result.userid }, (userErr: any, userRes: any) => {
                  if (userErr) {
                    res.status(500).end();
                    console.error("MongoDB query session error:" + userErr);
                  }
                  req.user = userRes;
                  console.log(req.user);
                  next();
                });
              } else {
                res.status(500).end();
                console.error("Session has no userid");
              }
            } else {
              res.status(401).json({ error: "User not authenticated" });
            }
          } else {
            console.log("Session expired: " + result.expires);
            res.status(401).json({ error: "Session expired" });
          }
        } else {
          res.status(401).json({ error: "Session not existing" });
        }
      }

    });
  });
};

// Middleware for session requirements
const sessionRequired = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.user.ssid) {
    res.status(401).json({ error: "No Token found" });
    res.end();
  } else {
    // Try to create session
    model_session.findOne({ _id: req.user.ssid }, (err: any, result: any) => {
      if (err) {
        res.status(500).end();
        console.error("MongoDB query session error:" + err);
      } else {
        if (result) {
          console.log("Session found: " + result._id);
          if (result.expires && result.expires >= Date.now()) {
            // Return session id inside jwt
            console.log(result);
            req.ssid = result._id;
            // Update Expirement of session
            console.log("Update expires");
            console.log(result._id);
            model_session.updateOne({ _id: new mongoose.Types.ObjectId(result._id) },
              { expires: intervalFromNow() }, (updErr, updRes) => {
                if (updErr) {
                  console.log(updErr);
                }
              });
            next();
          } else {
            console.log("Session expired: " + result.expires);
            res.status(401).json({ error: "Session expired" });
          }
        } else {
          res.status(401).json({ error: "Session not existing" });
        }
      }

    });
  }
};

const arrayContains = (needle: string, arrhaystack: string[]) => {
  if (arrhaystack.length < 1) {
    return false;
  }
  return (arrhaystack.indexOf(needle) > -1);
};
// use hateoas-middleware
app.use(hateoasLinker);

// CORS-header
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Auth-Token, X-Requested-With, Content-Type, Accept");
  next();
});

// Router-Section
// Default
app.get("/", (req: any, res: any) => {
  res.json({ build: buildV.build }, [
    { rel: "self", method: "GET", href: "/" },
    { rel: "session", method: "GET", title: "Initialize Session", href: "/init" },
    { rel: "session", method: "GET", title: "Get Session Status", href: "/status" },
    { rel: "user", method: "POST", title: "Register new user", href: "/register" },
    { rel: "user", method: "POST", title: "Authenticate user", href: "/login" },
    { rel: "user", method: "POST", title: "Deauth user", href: "/logout" },
  ]);
});

// Endpoint /init: Initialize new Session
app.get("/init", (req: any, res: any) => {
  // Try to create session
  model_session.create({ expires: intervalFromNow() }, (err: any, result: any) => {
    if (err) {
      res.status(500).json({ error: "Database Error" });
      console.error("MongoDB new session error:" + err);
    } else {
      console.log("New session: " + result._id);
      // Return session id inside jwt
      res.json({ token: jwt.sign({ ssid: result._id }, secret) }, [
        { rel: "self", method: "GET", href: "/init" },
      ]);
    }
  });

});

// Endpoint /status: get Session status
app.get("/status", (req: any, res: any) => {
  if (!req.user.ssid) {
    res.status(401).json({ error: "No Token found" });
    res.end();
  } else {
    // Try to create session
    model_session.findOne({ _id: req.user.ssid }, (err: any, result: any) => {
      if (err) {
        res.return(500).end();
        console.error("MongoDB query session error:" + err);
      } else {
        if (result) {
          console.log("Session found: " + result._id);
          if (result.expires && result.expires >= Date.now()) {
            // Return session id inside jwt
            console.log(result);
            res.json({ valid: true, data: result }, [
              { rel: "self", method: "GET", href: "/status" },
            ]);
          } else {
            console.log("Session expired: " + result.expires);
            res.json({ valid: false, error: "Session expired" }, [
              { rel: "self", method: "GET", href: "/status" },
            ]);
          }
        } else {
          res.json({ valid: false }, [
            { rel: "self", method: "GET", href: "/status" },
          ]);
        }
      }

    });
  }

});
// endpoint /user : GET user details
app.get("/user", authRequired, (req: any, res: any) => {
  res.json({ type: req.user.type, first_name: req.user.first_name, last_name: req.user.last_name });
});

// endpoint register: registers user
app.post("/register", sessionRequired, (req: any, res: any) => {
  if (req.body) {
    const userObj: UserObject = {};
    // Validate user type, internal not allowed
    if (typeof req.body.type !== "undefined" && arrayContains(req.body.type, ["DOCTOR", "PATIENT"])) {
      console.log("type: " + req.body.type);
      userObj.type = req.body.type;
    } else {
      res.status(400).json({ error: "Invalid user type" });
      return;
    }
    // Validate gender
    if (typeof req.body.gender !== "undefined" && arrayContains(req.body.gender, ["MALE", "FEMALE", "OTHER"])) {
      console.log("gender: " + req.body.gender);
      userObj.gender = req.body.gender;
    } else {
      res.status(400).json({ error: "Invalid gender" });
      return;
    }
    // Validate first name
    if (typeof req.body.first_name !== "undefined") {
      console.log("first_name: " + req.body.first_name);
      userObj.first_name = req.body.first_name;
    } else {
      res.status(400).json({ error: "Invalid first_name" });
      return;
    }
    // Validate last name
    if (typeof req.body.last_name !== "undefined") {
      console.log("last_name: " + req.body.last_name);
      userObj.last_name = req.body.last_name;
    } else {
      res.status(400).json({ error: "Invalid last_name" });
      return;
    }
    // Validate mail
    if (typeof req.body.mail !== "undefined" && EmailValidator.validate(req.body.mail)) {
      console.log("mail: " + req.body.mail);
      userObj.mail = req.body.mail;
    } else {
      res.status(400).json({ error: "Invalid mail" });
      return;
    }
    // Validate password
    if (typeof req.body.password !== "undefined") {
      console.log("last_name: " + req.body.password);
      userObj.password_hash = bcrypt.hashSync(req.body.password, 10);
    } else {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    // Check if user with mail exists
    model_user.findOne({ mail: req.body.mail }, (findErr: any, findResult: any) => {
      if (findErr) {
        console.log(findErr);
        res.status(500).json({ error: "Internal server error" });
        return;
      } else {
        if (findResult) {
          res.status(400).json({ error: "User with this mail address already existing." });
          return;
        }
        // Create user in db
        model_user.create(userObj, (err: any, result: any) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
            return;
          } else {
            console.log("User created");
            res.status(201).json({ success: true });
          }
        });
      }
    });

  } else {
    res.status(400).json({ error: "No body" });
  }
});

// endpoint login: authenticates user
app.post("/login", sessionRequired, (req: any, res: any) => {
  if (req.body) {
    // Validate mail
    if (typeof req.body.mail !== "undefined" && EmailValidator.validate(req.body.mail)) {
      console.log("Login attemp with mail: " + req.body.mail);
    } else {
      res.status(400).json({ error: "Invalid mail" });
      return;
    }
    // Validate password
    if (typeof req.body.password !== "undefined") {
      // continue
    } else {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    // Check if user with mail exists
    model_user.findOne({ mail: req.body.mail }, (findErr: any, findResult: any) => {
      if (findErr) {
        console.log(findErr);
        res.status(500).json({ error: "Internal server error" });
        return;
      } else {
        if (findResult) {
          console.log(findResult);
          // Check password
          if (bcrypt.compareSync(req.body.password, findResult.password_hash)) {
            console.log("Valid Password");

            console.log("Update SSID: " + req.ssid);
            model_session.updateOne({ _id: req.ssid },
              { authenticated: true, userid: findResult._id }, (updErr: any, updResult: any) => {
                if (updErr) {
                  console.log(updErr);
                  res.status(500).json({ error: "Internal server error" });
                  return;
                }
                res.status(200).json({ okay: true, message: "Authentication succeeded" });
              });
            return;
          } else {
            console.log("Invalid/Wrong password");
            res.status(400).json({ error: "Wrong password" });
            return;
          }
        } else {
          res.status(400).json({ error: "This user doesn't exist." });
          return;
        }
      }
    });

  } else {
    res.status(400).json({ error: "No body" });
  }
});
app.post("/logout", authRequired, (req: any, res: any) => {
  model_session.updateOne({ _id: req.ssid },
    { authenticated: false, userid: undefined }, (updErr: any, updResult: any) => {
      if (updErr) {
        console.log(updErr);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      res.status(200).json({ okay: true, message: "Logout succeeded" });
    });
});
// GET all doctors, session is required
app.get("/doctors", authRequired, (req: any, res: any) => {
  model_doc.find({ visible: true }, (err: any, docs: any) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    const docReturn = Array();
    docs.forEach((element: any) => {
      element = element.toObject();
      // Remove some propertys
      if (element.visible) {
        delete element.visible;
      }
      if (element.user) {
        delete element.user;
      }
      if (element.default_time) {
        delete element.default_time;
      }
      docReturn.push(element);
    });

    res.json(docReturn);
  });
});
// GET all doctors the current user owns, session is required
app.get("/doctors/my", authRequired, (req: any, res: any) => {
  if (!(req.user && req.user.type && req.user.type === "DOCTOR")) {
    res.status(403).json({ error: "Must be a doctor" });
    return;
  }
  model_doc.find({ visible: true, user: req.user._id }, (err: any, docs: any) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    const docReturn = Array();
    docs.forEach((element: any) => {
      element = element.toObject();
      // Remove some propertys
      if (element.visible) {
        delete element.visible;
      }
      if (element.user) {
        delete element.user;
      }
      if (element.default_time) {
        delete element.default_time;
      }
      docReturn.push(element);
    });

    res.json(docReturn);
  });
});
// GET doctor details
app.get("/doctor/:_id", authRequired, (req: any, res: any) => {
  if (!req.params._id) {
    // Return bad request if doctor's id is not submitted
    res.status(400).json({ error: "Missing id" });
    return;
  }
  // Get doctor from mongodb by submitted id
  model_doc.findOne({ _id: req.params._id, visible: true }, (err: any, doc: any) => {
    if (!doc) {
      // Exit with 404 when no doctor is found
      res.status(404).json({ error: "No doctor with this id!" });
      return;
    }
    if (err) {
      // Exit with 500 if another error occured
      res.status(500).json({ error: "Internal server error" });
      console.log(err);
      return;
    }
    // Everything is okay, now cleanup the doc-Object
    // Convert mongoose-doc to js object
    doc = doc.toObject();
    if (doc.visible) {
      delete doc.visible;
    }
    if (doc.user) {
      delete doc.user;
    }
    if (doc.default_time) {
      delete doc.default_time;
    }
    // Now get all timeslots
    model_slot.find({ docid: doc._id }).sort('start').exec((slotErr: any, docs: any) => {
      if (slotErr) {
        console.log(slotErr);
        res.status(500).json({ error: "Internal Server error" });
        return;
      }
      doc.slots = Array();
      // Loop trough all docs and cleanup
      docs.forEach((element: any) => {
        element = element.toObject();
        // Remove userid for privacy reasons
        if (element.userid) {
          delete element.userid;
        }
        // Remove docid for redundancy reasons
        if (element.docid) {
          delete element.docid;
        }
        doc.slots.push(element);
      });
      // Return the document.
      res.json(doc);
    });

  });
});
// POST to create doctor
app.post("/doctors", authRequired, (req: any, res: any) => {
  if (req.user.role !== "ADMIN") {
    res.status(403).json({ error: "Must be an admin" });
    return;
  }
  const newDoc = new model_doc({
    user: req.body.uid,
    name: req.body.name,
    field: req.body.field,
    contact: {
      mail: req.body.c_mail,
      phone: req.body.c_phone,
    },
    address: {
      name: req.body.a_name,
      street: req.body.a_street,
      number: req.body.a_number,
      zip: req.body.a_zip,
      city: req.body.a_city,
      country: req.body.a_country,
    },
    default_time: req.body.default_time,
  });
  newDoc.save((err: any) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: err });
      return;
    } else {
      res.status(200);
    }
  });
  res.status(200);
});
// Create new timeslots
app.post("/slot", authRequired, (req: any, res: any) => {
  if (!req.user || !req.user.type) {
    res.status(403).json({ error: "Must be logged in as DOCTOR" });
    return;
  }
  if (req.user.type !== "DOCTOR") {
    res.status(403).json({ error: "Must be logged in as DOCTOR" });
    return;
  }
  // Validate input
  if (!req.body.start) {
    res.status(400).json({ error: "Missing start time" });
    return;
  }
  if (!req.body.end) {
    res.status(400).json({ error: "Missing end time" });
    return;
  }
  if (!req.body.docid) {
    res.status(400).json({ error: "Missing docid" });
    return;
  }
  // create moment.js-objects
  const startTime = moment(req.body.start);
  const endTime = moment(req.body.end);
  const docid = req.body.docid;
  // Check if current user is allowed to create slots for this doc
  model_doc.findOne({ _id: docid, user: req.user._id }, (err: any, doc: any) => {
    if (!doc) {
      res.status(403).json({ error: "Not allowed to use this doc" });
      return;
    }
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Error retrieving data" });
      return;
    }
    // Calculate how much timeslots
    const time = doc.default_time || 30;
    const timediff = moment.duration(endTime.diff(startTime)).asMinutes();
    // Helper for asynchronous for-loop
    let saveErr = false;
    let savedSlots = 0;
    // Loop for every new slot
    for (let i = 0; i < Math.floor((timediff / time)); i++) {
      // if we had an error in the prev. Slot created abort here
      if (saveErr !== false) {
        return;
      }
      let startTimeTemp = moment(startTime);
      console.log(startTimeTemp.toDate());
      // Create new slot Data
      const newSlot = new model_slot({
        start: startTimeTemp.add(time * i, "m").toDate(),
        end: startTimeTemp.add(time, "m").toDate(),
        docid,
      });
      // Save new timeslot
      newSlot.save((serr: any, sdoc: any) => {
        // if we have an error: Exit and set Flag
        if (serr) {
          console.log(serr);
          res.status(400).json({ error: serr });
          saveErr = true;
          return;
        }
        // increase saved slots
        savedSlots++;
        // if all slots are saved exit here with 201
        if (savedSlots === Math.floor(timediff / time)) {
          res.status(201).json({ message: (i + 1) + " timeslots created" });
        }
        return;
      });
    }

  });
});
// Post to book timeslot
app.post("/slot/:_id", authRequired, (req: any, res: any) => {
  if (!req.params._id) {
    // Return bad request if doctor's id is not submitted
    res.status(400).json({ error: "Missing slot id" });
    return;
  }
  if (!req.user.authenticated) {
    model_slot.findOne({ _id: req.params._id }, (fErr: any, doc: any) => {
      if (fErr) {
        console.log(fErr);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (!doc) {
        res.status(404).json({ error: "Invalid slot" });
        return;
      }
      if (doc.state !== "FREE") {
        res.status(403).json({ error: "Slot already taken" });
        return;
      }
      doc.state = "BOOK_INT";
      doc.userid = req.user._id;
      doc.save((saveErr: any, updSuccess: any) => {
        if (saveErr) {
          console.log(saveErr);
          res.status(400).json({ error: saveErr });
          return;
        }
        res.status(200).json({ message: "Slot reserved" });
      });
    });
  }

});
// GET all slots for this user
app.get("/slots", authRequired, (req: any, res: any) => {
  // Check if userid is present
  if (!req.user._id) {
    res.status(500).json({ error: "Missing user-id" });
    return;
  }
  model_slot.find({ userid: req.user._id }).sort('start').exec((err: any, docs: any) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Error retrieving data" });
      return;
    }
    res.json(docs);
  });
});
// GET all slots booked by doctor
app.get("/slots/:docid", authRequired, (req: any, res: any) => {
  if (!req.params.docid) {
    // Return bad request if doctor's id is not submitted
    res.status(400).json({ error: "Missing doc id" });
    return;
  }
  // Check if current user is doctor
  if (req.user.type !== "DOCTOR") {
    res.status(403).json({ error: "Forbidden: Only Doctor-accounts allowed." });
  }
  // Check if current user is allowed
  model_doc.findOne({ _id: req.params.docid, user: req.user._id }, (err: any, doc: any) => {
    if (!doc) {
      res.status(403).json({ error: "Not allowed to use this doc" });
      return;
    }
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Error retrieving data" });
      return;
    }
    // Get all booked slots for this docid
    model_slot.find({ docid: req.params.docid }).sort('start').exec((serr: any, docs: any) => {
      if (serr) {
        console.log(serr);
        res.status(500).json({ error: "Error retrieving data" });
        return;
      }
      let itemsProcessed = 0;
      let lerr = false;
      if(docs.length<1) {
        res.json(docs);
        return;
      }
      const newDocs = Array();
      docs.forEach((element: any) => {
        element = element.toObject();
        if (element.userid) {
          model_user.findOne({ _id: element.userid }, (uerr: any, udoc: any) => {
            if (lerr !== false) {
              return;
            }
            if (uerr) {
              console.log(uerr);
              res.status(500).json({ error: "Error retrieving data" });
              lerr = true;
              return;
            }
            if (!udoc) {
              res.status(500).json({ error: "Invalid user" });
              lerr = true;
              return;
            }
            element.last_name = udoc.last_name;
            element.first_name = udoc.first_name;
            element.mail = udoc.mail;
            itemsProcessed++;
            newDocs.push(element);
            if ((itemsProcessed === docs.length) && (lerr === false)) {
              res.json(newDocs);
            }
            return element;
          });
        } else {
          // No user id = other state
          newDocs.push(element);
          itemsProcessed++;
          if ((itemsProcessed === docs.length) && (lerr === false)) {
            res.json(newDocs);
          }
        }
      });

    });
  });
});

// Start webserver on 8081
app.listen(8081);

// Garbage collector
const collectGarbage = () => {
  model_session.deleteMany({ $or: [{ expires: { $lt: Date() } }, { expires: undefined }] }, (delErr: any) => {
    console.log("Garbage Collector Errors: " + delErr);
  });
};
collectGarbage();
// Periodically run Garbage collector
setInterval(collectGarbage, 10000);

module.exports = { app, arrayContains };
