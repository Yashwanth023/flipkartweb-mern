
const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters, at least one uppercase letter, one lowercase letter, and one number
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return re.test(password);
};

const validateMobile = (mobile) => {
  // 10 digit phone number
  const re = /^\d{10}$/;
  return re.test(mobile);
};

const validatePincode = (pincode) => {
  // 6 digit pincode
  const re = /^\d{6}$/;
  return re.test(pincode);
};

const validateProductPrice = (price) => {
  return price > 0;
};

const validateProductStock = (stock) => {
  return stock >= 0;
};

const validateDiscountPercentage = (discount) => {
  return discount >= 0 && discount <= 100;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateMobile,
  validatePincode,
  validateProductPrice,
  validateProductStock,
  validateDiscountPercentage,
};
