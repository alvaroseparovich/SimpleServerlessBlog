# AWS AppSync Blog with GraphQL, AWS Lambda Resolvers, DynamoDB and Serverless Framework

This is a minimal structure.
### Benefits of this structure
  - Pay as you go (if no one use your app there is no charge, and your app is still available)
  - Scalable (there is not even one block resource)
  - Simple (if you already use serverless framework, there is nothing new here)

#### Future features
  - Authentication with Cognito
  - Authorization
  - Front-end

## CICD
Everything here has been made to be easily deployed and removed. 
No manual work.
No headache.
No Ops!

So if you want to give it a try, to deploy the whole application, you can simply run `sls deploy` and it is done, or even to remove `sls remove`.  

## GraphQL
There are so few mutations and queries:
```
type Query {
  GET_POST(id: ID!): Post!
  GET_LAST_POSTS: [Post]!
  GET_LAST_POST_VERSIONS(id: ID!): [PostVersion]!
}

type Mutation {
  CREATE_POST(post: PostInput): Post
  UPDATE_POST(id: ID! post: PostInput!): Post
  MINIMAL_UPDATE_POST(id: ID! post: PostInput!): Post
}
```

## DynamoDB
This is a **single table** application, to use all the power Dynamodb can provide, this means that all relations are done in the same table, by **composite keys** (partition key and sort key).
This is the cloud formation config for the Dynamodb:
```
DynamoTable:
  Type: "AWS::DynamoDB::Table"
  Properties:
    KeySchema:
      - AttributeName: PK
        KeyType: HASH
      - AttributeName: SK
        KeyType: RANGE
    AttributeDefinitions:
      - AttributeName: PK
        AttributeType: S
      - AttributeName: SK
        AttributeType: S
    BillingMode: PAY_PER_REQUEST
    ...
```