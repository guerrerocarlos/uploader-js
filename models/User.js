import config from '../config.json'
import dynamoMapper from '../utils/dynamoMapper'
import NewModel from '../utils/NewModel'

const model = NewModel({
  tableName: config.dynamodb.tables.users,
  properties: {
    email: {
      type: 'String',
      keyType: 'HASH'
    },
    createdAt: {
      type: 'Date',
      defaultProvider: () => new Date()
    },
    passwordHash: { type: 'String' },
    passwordSalt: { type: 'String' },
    files: {
      type: 'String',
      defaultProvider: () => '[]'
    },
    verified: {
      type: 'Boolean',
      defaultProvider: () => false
    },
    verifyToken: { type: 'String' }
  }
})

export const User = model.Model

// Model Methods
// -------------

// findUser runs a DynamoDB query with the given
// map of properties and values (the given query).
export async function findUser(query) {
  let mapper = dynamoMapper()
  let found
  for await (const user of mapper.query(User, query)) {
    found = user
  }
  return found
}
