/**
 * Express router paths go here.
 */

import { Immutable } from '@src/other/types';


const Paths = {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Appointments: {
    Base: '/appointments',
    Get: '/all',
    Id: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Doctor: {
    Base: '/doctor',
    Get: '/all',
    Id: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Patient: {
    Base: '/patient',
    Get: '/all',
    Id: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Service: {
    Base: '/service',
    Get: '/all',
    Id: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
};


// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;
