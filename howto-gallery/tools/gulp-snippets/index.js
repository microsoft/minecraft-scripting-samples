var snippetsBuilder = require("./SnippetsBuilder");
var through2 = require("through2");

module.exports = (targetFolder = "./build/snippets/") => {
  const snippetsObj = snippetsBuilder.create(targetFolder);

  return through2.obj((chunk, encoding, callback) => {
    try {
      const content = snippetsObj.resolve(chunk.history[0], chunk.contents.toString("utf-8"));

      chunk.contents = Buffer.from(content);

      callback(null, chunk);
    } catch (err) {
      callback(err);
    }
  });
};
