import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export {mongoose} ;

export { Admin } from './admin.model.js';
export { Role } from './role.model.js';
export { UserProfile } from './user.model.js';
export { Company } from './company.model.js';
