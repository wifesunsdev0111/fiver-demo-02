import _ from 'lodash';

export const getExtensionLowerCase = (url) => {
  return _.toLower(_.last(_.split(url, '.')));
};
