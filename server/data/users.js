
const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    mobile: '9999999999',
    address: '123 Admin Street, Admin City - 123456',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    mobile: '8888888888',
    address: '456 User Lane, User City - 456789',
    password: bcrypt.hashSync('123456', 10),
    role: 'customer',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    mobile: '7777777777',
    address: '789 Customer Road, Customer City - 789012',
    password: bcrypt.hashSync('123456', 10),
    role: 'customer',
  },
];

module.exports = users;
