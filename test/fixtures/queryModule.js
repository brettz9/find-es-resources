const queryModule = {
  [
  'VariableDeclarator:matches(' +
    '[id.type="Identifier"]' +
    '[id.name="resources"]' +
    '[init.type="ArrayExpression"]' +
  ') > ArrayExpression'
  ] (node) {
    return node.elements.map((element) => {
      return element.value;
    });
  }
};

export default queryModule;
