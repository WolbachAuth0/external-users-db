module.exports = {
  tags: [
    {
      name: 'Custom DB Action',
      description: `Methods for authenticating and authorizing users.`,
    },
    {
      name: 'Administration',
      description: `Methods for administrators who need to manage the user database.`,
    }
  ],
  'x-tagGroups': [
    {
      name: 'Users',
      tags: [ 'Custom DB Action', 'Administration' ]
    },
  ]
}