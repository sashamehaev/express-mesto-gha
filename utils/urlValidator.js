const regEx = /[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i;

module.exports.urlValidator = (link, helpers) => {
  if (regEx.test(link)) {
    return link;
  }
  return helpers.error('Неверный формат для ссылки');
};
