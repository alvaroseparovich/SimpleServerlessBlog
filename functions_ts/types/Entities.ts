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
const SecondSecondaryIndex = process.env.SecondSecondaryIndex

export enum POST_STATUS {
  published = 'published',
  open_to_contribution = 'open_to_contribution',
  draft = 'draft',
  deleted = 'deleted',
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
    [SecondSecondaryIndex]: {
      type: INDEX_TYPE.GSI,
      partitionKey: 'POST#SLUG',
      sortKey: 'POST#{{slug}}',
    },
  },
})
export class POST {
  @AutoGenerateAttribute({ strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4 })
  id: string;

  @Attribute()
  title: string;

  @Attribute()
  content: string;

  @Attribute()
  imgUrl: string;

  @Attribute()
  author: string;

  @Attribute()
  authorSlug: string;

  @Attribute()
  creator: string;

  @Attribute()
  creatorSub: string;

  @Attribute()
  slug: string;

  @Attribute({isEnum:true})
  status: POST_STATUS;
}

// @Entity({
//   name: 'POST_STATUS_SLUG',
//   primaryKey: {
//     // {{}} is the special syntax that TypeDORM understands and will automatecally replace the placeholder within it with actual value at run time 
//     partitionKey: 'POST#{{id}}', 
//     sortKey: 'POST#STATUS#SLUG#{{status}}#{{slug}}',
//   },
//   indexes: {
//     [FirstSecondaryIndex]: {
//       type: INDEX_TYPE.GSI,
//       partitionKey: 'POST#STATUS#SLUG',
//       sortKey: '{{status}}#{{slug}}',
//     },
//   },
// })
// export class SLUG {
//   @Attribute()
//   id: string;
  
//   @Attribute()
//   status: string;
  
//   @Attribute()
//   slug: string;
// }

import {createConnection} from '@typedorm/core';

// initialize with specifying list of entities
createConnection({
  table: table,
  entities: [POST],
});