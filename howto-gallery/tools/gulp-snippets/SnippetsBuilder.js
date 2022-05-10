const Vinyl = require("vinyl");
var fs = require("fs");

class CodeSnippet {
  name;
  segments;
  function;
  codeSampleCore;
}

class SnippetsBuilder {
  _targetFolderPath;
  _snippets = [];
  _snippetsByModules = {};

  constructor(targetFolderPath) {
    if (!targetFolderPath.endsWith("/") && !targetFolderPath.endsWith("\\")) {
      targetFolderPath += "/";
    }

    this._targetFolderPath = targetFolderPath;
  }

  static create(targetFolder) {
    return new SnippetsBuilder(targetFolder);
  }

  resolve(filePath, content) {
    let seeLinkStart = content.indexOf("@see ");

    while (seeLinkStart >= 0) {
      let endOfSeeLinkLine = content.indexOf("\n", seeLinkStart);

      if (endOfSeeLinkLine > seeLinkStart + 6) {
        let seeLinkContents = content
          .substring(seeLinkStart + 5, endOfSeeLinkLine)
          .trim()
          .toLowerCase();

        if (seeLinkContents.startsWith("https://docs.microsoft.com/minecraft/creator/scriptapi/")) {
          let urlLink = seeLinkContents.substring(55, seeLinkContents.length).replace("#", "/");

          let urlSegments = urlLink.split("/");

          if (urlSegments.length >= 2 && urlSegments[0].startsWith("mojang-")) {
            let nextFunction = content.indexOf("export function", endOfSeeLinkLine);

            if (nextFunction >= 0) {
              let firstParen = content.indexOf("(", nextFunction);
              let endOfFunction = content.indexOf("\r\n}", nextFunction);

              if (endOfFunction > firstParen && firstParen > nextFunction) {
                let name = content.substring(nextFunction + 16, firstParen);
                let functionCode = content.substring(nextFunction, endOfFunction + 3);

                let firstBrace = functionCode.indexOf("{");

                if (firstBrace >= 0) {
                  let codeSampleCore = functionCode.substring(firstBrace + 3, functionCode.length - 3);

                  let cs = new CodeSnippet();
                  cs.name = name;
                  cs.segments = urlSegments;
                  cs.function = functionCode;
                  cs.codeSampleCore = codeSampleCore;

                  this._snippets.push(cs);

                  if (!this._snippetsByModules[urlSegments[0]]) {
                    this._snippetsByModules[urlSegments[0]] = [];
                  }

                  this._snippetsByModules[urlSegments[0]].push(cs);

                  console.log("Snippet '" + name + "' discovered for " + urlSegments.join("."));

                  this.writeFile("docsnips/" + urlSegments.join("/") + "/examples/" + name + ".ts", codeSampleCore);
                }
              }
            }
          }
        }
      }

      seeLinkStart = content.indexOf("@see ", seeLinkStart + 5);
    }

    for (let moduleKey in this._snippetsByModules) {
      let snippets = this._snippetsByModules[moduleKey];
      let moduleType = [];
      let samplesWritten = {};

      for (let i = 0; i < snippets.length; i++) {
        let snippet = snippets[i];

        if (!samplesWritten[snippet.name]) {
          samplesWritten[snippet.name] = snippet;
          moduleType.push(snippets[i].function);
        }
      }

      let jsonMarkup = "[";

      for (let snippetKey in samplesWritten) {
        let snippet = samplesWritten[snippetKey];

        if (jsonMarkup.length > 2) {
          jsonMarkup += ",\r\n";
        }

        let sample = '["' + this.getQuoteSafeContent(snippet.codeSampleCore).replace(/\r\n/g, '",\r\n"') + '"\r\n]';

        jsonMarkup +=
          '{\r\n  "name": "' +
          snippet.name +
          '",\r\n  "path": "' +
          snippet.segments.join("/") +
          '",\r\n  "snippet": ' +
          sample +
          "}";
      }

      jsonMarkup += "\r\n]";

      this.writeFile("samplejson/" + moduleKey + "-samples.json", jsonMarkup);

      this.writeFile(
        "typescript/" + moduleKey + "/" + moduleKey + "-tests.ts",
        'import * as mc from "mojang-minecraft";\r\n\r\nconst overworld = mc.world.getDimension("overworld");\r\n\r\n' +
          moduleType.join("\r\n\r\n")
      );
    }

    return content;
  }

  getQuoteSafeContent(content) {
    content = content.replace(/"/g, '\\"');

    return content;
  }

  writeFile(relativePath, contents) {
    // use gulp's vinyl file descriptor for path canonicalization
    const file = new Vinyl({
      base: this._targetFolderPath,
      path: this._targetFolderPath + relativePath,
      contents: Buffer.from(contents),
    });

    if (!fs.existsSync(file.dirname)) {
      fs.mkdirSync(file.dirname, { recursive: true });
    }

    fs.writeFileSync(file.path, file.contents);
  }
}

module.exports = SnippetsBuilder;
