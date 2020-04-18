const sinon = require('sinon');
const assert = require('assert');

function greaterThanTwenty(num) {
  return num > 20;
}

describe('Sample Sinon Stub', () => {
  it('should pass', (done) => {
    const greaterThanTwenty = sinon.stub().returns('something');
    console.log(greaterThanTwenty(0));
    greaterThanTwenty.withArgs(0).returns('something');
    assert.notEqual(greaterThanTwenty(0), false);
    done();
  });
});

function Person(givenName, familyName) {
  this.givenName = givenName;
  this.familyName = familyName;
}

Person.prototype.getFullName = function() {
  return `${this.givenName} ${this.familyName}`;
};

describe('Sample Sinon Stub Take 2', () => {
  it('should pass', (done) => {
    const name = new Person('Michael', 'Herman');
    assert.equal(name.getFullName(), 'Michael Herman');
    sinon.stub(Person.prototype, 'getFullName').returns('John Doe');
    assert.equal(name.getFullName(), 'John Doe');
    done();
  });
});
