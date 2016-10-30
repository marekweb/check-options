/* eslint no-eq-null:0, eqeqeq:0 */

var pluralize = require('pluralize');
var _ = require('lodash');

function jumpStack(error) {
  var stackParts = error.stack.split('\n');
  stackParts.splice(1, 2);
  error.stack = stackParts.join('\n');
}

module.exports = function requiredFields(options, required, defaults, context) {
  options = options || {};
  if (!context && typeof (defaults) === 'string') {
    context = defaults;
  }

  var optionKeys = _.keys(options);
  var missing = _.difference(required, optionKeys);
  missing = _.sortBy(missing);

  var invalid = _.difference(_.difference(optionKeys, _.keys(defaults)), required);
  invalid = _.sortBy(invalid);

  if (!missing.length && !invalid.length) {
    var result = {};
    if (defaults) {
      _.assign(result, defaults, options);
    }
    return result;
  }

  var message = '';
  if (context) {
    message += context + ': ';
  }

  if (missing.length) {
    message += 'Missing ' + pluralize('field', missing.length) + ' (' + missing.join(', ') + ')';
  }

  if (invalid.length) {
    if (missing.length) {
      message += '; ';
    }
    message += 'Invalid ' + pluralize('field', invalid.length) + ' (' + invalid.join(', ') + ')';
  }
  var error = new Error(message);
  jumpStack(error, 2);
  throw error;
};
