module.exports = {
  loginUser: {
    description: 'Updated quote data',
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/User' },       
      },
    },
  },
  getUser: {
    description: 'Get a user ',
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/User' },       
      },
    },
  }
}