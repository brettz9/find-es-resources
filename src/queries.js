'use strict';

const queries = {
  // Todo: For `TemplateLiteral`, grab multiple (unless a single)
  // Todo: For `BinaryExpression`, grab multiple
  // Todo: Handle plain `Identifier` inside array
  // Todo: Handle `Literal`

  // Array expression to get at `elements`
  [
  // `callee` -> `MemberExpression.object.ArrayExpression`
  // `arguments` -> `ArrowFunctionExpression`
  'CallExpression:matches(' +
    '[callee.type="MemberExpression"]' +
    '[callee.object.type="ArrayExpression"]' +
    '[arguments.0.type="ArrowFunctionExpression"]' +
    '[arguments.0.body.type="BlockStatement"]' +
    '[arguments.0.body.body.0.type="ReturnStatement"]' +
    '[arguments.0.body.body.0.argument.type="CallExpression"]' +
    '[arguments.0.body.body.0.argument.callee.type="Identifier"]' +
    '[arguments.0.body.body.0.argument.callee.name="fetch"]' +
  ') > MemberExpression > ArrayExpression'
  ] (node) {
    return node.elements.map((element) => {
      return element.value;
    });
  }
};

module.exports = queries;
