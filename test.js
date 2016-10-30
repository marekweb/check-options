var test = require('tape');
var checkOptions = require('./index');

function throws(t, message, f) {
  try {
    f();
    t.fail('Throw error');
  } catch (e) {
    t.equals(e.message, message);
  }
}

test('should do nothing with no arguments', function (t) {
  var output = checkOptions();

  t.deepEquals(output, {});
  t.end();
});

test('should work with empty required fields', function (t) {
  var input = {};
  var output = checkOptions(input, []);

  t.deepEquals(output, {});
  t.notEquals(input, output);
  t.end();
});

test('should not modify the input object', function (t) {
  var input = {name: 'maximus', size: 10};
  var output = checkOptions(input, ['name'], {color: 'red', size: null});

  t.notEqual(input, output);
  t.deepEquals(output, {name: 'maximus', size: 10, color: 'red'});
  t.end();
});

test('should not throw with all fields present', function (t) {
  var options = {name: 'maximus', age: 30};
  checkOptions(options, ['name', 'age']);
  t.end();
});

test('should throw with one missing field and one present field', function (t) {
  throws(t, 'Missing field (status)', function () {
    var options = {name: 'maximus', age: 20};
    checkOptions(options, ['name', 'status'], {age: 23});
  });
  t.end();
});

test('should throw with one missing field and one invalid field', function (t) {
  throws(t, 'Missing field (status); Invalid field (age)', function () {
    var options = {name: 'maximus', age: 20};
    checkOptions(options, ['name', 'status']);
  });
  t.end();
});

test('should throw with one missing field and one invalid field with context', function (t) {
  throws(t, 'myContext: Missing field (status); Invalid field (age)', function () {
    var options = {name: 'maximus', age: 20};
    checkOptions(options, ['name', 'status'], 'myContext');
  });
  t.end();
});

test('should throw with multiple missing and invalid fiends', function (t) {
  throws(t, 'Missing fields (depth, speed); Invalid fields (height, width)', function () {
    var options = {height: 5, width: 5, size: 10};
    checkOptions(options, ['depth', 'speed', 'size'], {weight: 10});
  });
  t.end();
});

test('should throw with multiple missing and invalid fields with context', function (t) {
  throws(t, 'myFunction: Missing fields (depth, speed); Invalid fields (height, width)', function () {
    var options = {height: 5, width: 5, size: 10};
    checkOptions(options, ['depth', 'speed', 'size'], {weight: 10}, 'myFunction');
  });
  t.end();
});

test('should throw with a missing field', function (t) {
  throws(t, 'Missing field (count)', function () {
    checkOptions({}, ['count']);
  });
  t.end();
});

test('should throw with a missing field with context', function (t) {
  throws(t, 'myFunction: Missing field (count)', function () {
    checkOptions({}, ['count'], 'myFunction');
  });
  t.end();
});

test('should throw with multiple missing fields', function (t) {
  throws(t, 'Missing fields (height, width)', function () {
    checkOptions({}, ['width', 'height']);
  });
  t.end();
});

test('should throw with multiple missing fields with context', function (t) {
  throws(t, 'myFunction: Missing fields (height, width)', function () {
    checkOptions({}, ['width', 'height'], null, 'myFunction');
  });
  t.end();
});

test('should throw with multiple missing fields', function (t) {
  throws(t, 'Invalid fields (height, width)', function () {
    checkOptions({width: 2, height: 3}, []);
  });
  t.end();
});

test('should throw with multiple invalid fields with context', function (t) {
  throws(t, 'myFunction: Invalid fields (height, width)', function () {
    checkOptions({width: 2, height: 3}, [], null, 'myFunction');
  });
  t.end();
});

test('should apply defaults', function (t) {
  var options = {name: 'chandler', height: 5};
  var output = checkOptions(options, ['name'], {width: 7, height: 9}, 'myFunction');

  t.deepEquals(output, {name: 'chandler', height: 5, width: 7});
  t.notEqual(options, output);
  t.end();
});

test('should work without defaults and with context ', function (t) {
  t.plan(2);
  var options = {name: 'chandler'};
  var output = checkOptions(options, ['name'], 'myFunction');

  t.deepEquals(output, {name: 'chandler'});
  t.notEqual(options, output);
  t.end();
});

test('should work with defaults without required fields', function (t) {
  var options = {color: 'red'};

  var output = checkOptions(options, {color: null});

  t.deepEqual(output, {color: 'red'});
  t.notEqual(options, output);
  t.end();
});

test('should throw with defaults, no required fields, and invalid field', function (t) {
  var options = {size: 'large', color: 'red'};

  throws(t, 'Invalid field (size)', function () {
    checkOptions(options, {color: null});
  });

  t.end();
});
