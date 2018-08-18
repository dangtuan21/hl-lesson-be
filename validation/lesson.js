const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateClientInput(data) {
  let errors = {};
  
  data.name = !isEmpty(data.name) ? data.name : '';
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }  

  data.code = !isEmpty(data.code) ? data.code : '';
  if (Validator.isEmpty(data.code)) {
    errors.code = 'Code field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
