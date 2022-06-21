module.exports = {
  LoginUser: {
    description: 'Updated quote data',
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/LoginUser' },       
      },
    },
  },
  ChangePassword: {
    description: 'Change Password',
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ChangePassword' }
      }
    }
  },
  SignupUser: {
    description: 'Sign up a new user ',
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/User' },       
      },
    },
  },
  VerifyEmail: {
    description: 'Verify a user\'s email address',
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/VerifyEmail' },       
      },
    },
  },
  UpdateUser: {
    description: 'Update User Profile',
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/User' },       
      },
    },
  }
}