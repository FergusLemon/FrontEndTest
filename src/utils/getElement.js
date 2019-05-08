const getElement = wrapper => elementType => classToSearchFor => (
  wrapper
  .find(elementType)
  .filterWhere(n => n.hasClass(classToSearchFor))
);

export default getElement;
