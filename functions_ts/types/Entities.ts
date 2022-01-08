import {
  Attribute,
  AutoGenerateAttribute,
  AUTO_GENERATE_ATTRIBUTE_STRATEGY,
  Entity,
  INDEX_TYPE,
} from '@typedorm/common';
import { table } from './table'
import 'reflect-metadata'
const FirstSecondaryIndex = process.env.FirstSecondaryIndex

export enum PRODUCT_STATUS {
  ACTIVE = 'ACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

@Entity({
  name: 'POST',
  primaryKey: {
    // {{}} is the special syntax that TypeDORM understands and will automatecally replace the placeholder within it with actual value at run time 
    partitionKey: 'POST#{{id}}', 
    sortKey: 'POST#{{id}}',
  },
  indexes: {
    [FirstSecondaryIndex]: {
      type: INDEX_TYPE.GSI,
      partitionKey: 'POST#{{id}}',
      sortKey: 'POST#{{id}}',
    },
  },
})
export class POST {
  @AutoGenerateAttribute({ strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE })
  id: string;

  @Attribute()
  title: string;

  @Attribute()
  content: string;

  @Attribute()
  image: string;

  @Attribute()
  author: string;

  @Attribute()
  creator: string;
}

import {createConnection} from '@typedorm/core';

// initialize with specifying list of entities
createConnection({
  table: table,
  entities: [POST],
});