import {SchemaDirectiveVisitor} from 'apollo-server-koa';
import {defaultFieldResolver} from 'graphql';

class UpperCaseDirective extends SchemaDirectiveVisitor{
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (...rest) => {
      const result = await resolve.apply(this, rest);
      if (typeof result === 'string') {
        return this.args.capitalize ?
          result[0].toUpperCase() + result.slice(1).toLowerCase() :
          result.toUpperCase();
      }
      return result;
    };
  }
}
module.exports = {
  UpperCaseDirective
};
