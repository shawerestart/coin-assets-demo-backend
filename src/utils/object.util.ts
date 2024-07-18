import * as _ from 'lodash';
export const filterObject = (obj) =>
  _.omitBy(obj, _.overSome([_.isNil, _.isNaN]));
