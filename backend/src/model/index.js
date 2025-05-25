const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Admin } = require('./admin.model.js');
const { Role } = require('./role.model.js');
const { UserProfile } = require('./user.model.js');
const { Company } = require('./company.model.js');
const { Log } = require('./log.model.js');
const { PropertyType } = require('./property-type.js');

module.exports = {
  mongoose,
  Admin,
  Role,
  UserProfile,
  Company,
  Log,
  PropertyType
};
