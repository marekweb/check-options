var test = require('tape');
var checkOptions = require('.');

function throws(t, message, f) {
  try {
    f();
    t.fail('Throw error');
  } catch (e) {
    t.equals(e.message, message);
  }
}

test('should work requiring no fields', function (t) {
  checkOptions({}, []);
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
  checkOptions(options, ['name'], {width: 7, height: 9}, 'myFunction');

  t.equals(options.name, 'chandler');
  t.equals(options.height, 5);
  t.equals(options.width, 7);

  t.end();
});

test('should work without defaults and with context ', function (t) {
  var options = {name: 'chandler'};
  checkOptions(options, ['name'], 'myFunction');

  t.equals(options.name, 'chandler');

  t.end();
});
