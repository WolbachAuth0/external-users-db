let data = [
  {
    name: 'Auth',
    description: `Methods for authenticating and authorizing users.`,
    group: 'Users'
  },
  {
    name: 'Administration',
    description: `Methods for administrators who need to manage the user database.`,
    group: 'Users'
  }
]

module.exports = {
  tags: data.map(x => {
    return {
      name: x.name,
      description: x.description
    }
  }),
  'x-tagGroups': [
    {
      name: 'Users',
      tags: data.filter(x => x.group === 'Users').map(x => x.name)
    },
  ]
}