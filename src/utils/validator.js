const { isEmail, isStrongPassword } = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required!");
  } else if (firstName.length < 3 || lastName.length < 3) {
    throw new Error("First and last name must be at least 3 characters long!");
  } else if (!isEmail(email)) {
    throw new Error("Invalid email!");
  } else if (!isStrongPassword(password)) {
    throw new Error("Password must be at least 8 characters long!");
  }
};

const validateLogin = (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("All fields are required!");
  } else if (!isEmail(email)) {
    throw new Error("Invalid email!");
  }
};

const validateEditProfile = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const fieldsToUpdate = req.body;

  const isAllowed = Object.keys(fieldsToUpdate).every((field) =>
    allowedEditFields.includes(field)
  );

  return isAllowed;
};

module.exports = { validateSignUp, validateLogin, validateEditProfile };
