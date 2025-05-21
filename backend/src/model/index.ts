import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export {mongoose} ;

export { Admin } from './admin.model';
export { Role } from './role.model';
export { UserProfile } from './user.model';
export { Company } from './company.model';
