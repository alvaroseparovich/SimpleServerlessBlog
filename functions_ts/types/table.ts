import { INDEX_TYPE, Table } from '@typedorm/common';

export const table = new Table({
  name: process.env.DYNAMO_TABLE,
  partitionKey: 'PK',
  sortKey: 'SK',
  indexes: {
    [process.env.FirstSecondaryIndex]: {
      partitionKey: 'SK',
      sortKey: 'PK',
      type: INDEX_TYPE.GSI,
    },
    [process.env.SecondSecondaryIndex]: {
      partitionKey: 'SK',
      sortKey: 'GSI-2-PK',
      type: INDEX_TYPE.GSI,
    },
  },
});