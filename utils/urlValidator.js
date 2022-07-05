const regEx = /https?:\/\/(www)?(\S+)([\w#!:.?+=&%@!\-/])?/;

module.exports.urlValidator = (link, helpers) => {
  if (regEx.test(link)) {
    return link;
  }
  return helpers.error('Неверный формат для ссылки');
};
