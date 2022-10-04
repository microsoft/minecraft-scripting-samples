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
  _scriptLibraryMainCode = "";
  _libraryCode = {};

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
    let filePathLower = filePath.toLowerCase();

    if (filePathLower.indexOf("samplemanager.") >= 0) {
      this._scriptLibraryMainCode = this.stripLinesContaining(content, "import * as mc from ");
      this._scriptLibraryMainCode = this.stripLinesContaining(this._scriptLibraryMainCode, "console.");
    } else if (filePathLower.endsWith("samplelibrary.ts")) {
      let lastSlash = Math.max(filePathLower.lastIndexOf("/"), filePathLower.lastIndexOf("\\"));

      if (lastSlash >= 0) {
        let libraryContent = content.replace(/sdf\d{1,4}\./g, "");
        libraryContent = libraryContent.replace(/sm\./g, "");
        libraryContent = this.stripLinesContaining(libraryContent, "import * as sdf");
        libraryContent = this.stripLinesContaining(libraryContent, "import * as mc ");
        libraryContent = this.stripLinesContaining(libraryContent, "import SampleManager from ");

        let moduleName = filePathLower.substring(lastSlash + 1, filePathLower.length - 16);

        this._libraryCode["@minecraft/" + moduleName] = libraryContent;
      }
    }

    let seeLinkStart = content.indexOf("@see ");

    while (seeLinkStart >= 0) {
      let endOfSeeLinkLine = content.indexOf("\n", seeLinkStart);

      if (endOfSeeLinkLine > seeLinkStart + 6) {
        let seeLinkContents = content
          .substring(seeLinkStart + 5, endOfSeeLinkLine)
          .trim()
          .toLowerCase();

        if (seeLinkContents.startsWith("https://learn.microsoft.com/minecraft/creator/scriptapi/")) {
          let urlLink = seeLinkContents.substring(56, seeLinkContents.length).replace("#", "/");

          let urlSegments = urlLink.split("/");

          if (urlSegments.length >= 2 && urlSegments[0].startsWith("@minecraft")) {
            let nextExport = content.indexOf("export ", endOfSeeLinkLine);

            if (nextExport >= 0) {
              let nextFunction = content.indexOf(" function", nextExport);

              if (nextFunction >= 0) {
                let firstParen = content.indexOf("(", nextFunction);
                let endOfFunction = content.indexOf("\r\n}", nextFunction);

                if (endOfFunction > firstParen && firstParen > nextFunction) {
                  let name = content.substring(nextFunction + 10, firstParen);
                  let functionCode = content.substring(nextExport, endOfFunction + 3);

                  let firstBrace = functionCode.indexOf("{");

                  if (firstBrace >= 0) {
                    let codeSampleCore = functionCode.substring(firstBrace + 3, functionCode.length - 3);

                    let cs = new CodeSnippet();
                    cs.name = name;
                    cs.segments = urlSegments;
                    cs.function = functionCode;
                    cs.codeSampleCore = codeSampleCore;

                    this._snippets.push(cs);

                    let moduleKey = urlSegments[0] + "/" + urlSegments[1];

                    if (!this._snippetsByModules[moduleKey]) {
                      this._snippetsByModules[moduleKey] = [];
                    }

                    this._snippetsByModules[moduleKey].push(cs);

                    console.log("Snippet '" + name + "' discovered for " + urlSegments.join(".") + " in " + moduleKey);

                    let localUrlSegments = Array.from(urlSegments);

                    if (localUrlSegments[0] === localUrlSegments[1]) {
                      localUrlSegments.shift();
                    }

                    this.writeFile(
                      "docsnips/" + localUrlSegments.join("/") + "/examples/" + name + ".ts",
                      codeSampleCore
                    );
                  }
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

      let tsTestFileMarkup =
        "/* eslint-disable  @typescript-eslint/no-unused-vars */\r\n" +
        'import * as mc from "@minecraft/server";\r\n\r\n' +
        moduleType.join("\r\n\r\n");

      tsTestFileMarkup += "\r\n" + this._scriptLibraryMainCode + "\r\n";

      if (this._libraryCode[moduleKey]) {
        tsTestFileMarkup += "\r\n" + this._libraryCode[moduleKey] + "\r\n";
      }

      let testFolder = "typescript/" + moduleKey + "/";

      if (!fs.existsSync(testFolder)) {
        fs.mkdirSync(testFolder, { recursive: true });
      }

      this.writeFile(testFolder + "tests.ts", tsTestFileMarkup);
    }

    return content;
  }

  getQuoteSafeContent(content) {
    content = content.replace(/"/g, '\\"');

    return content;
  }

  stripLinesContaining(content, containing) {
    let i = content.indexOf(containing);

    while (i >= 0) {
      let previousNewLine = content.lastIndexOf("\n", i);
      let nextNewLine = content.indexOf("\n", i);

      if (nextNewLine >= 0) {
        if (previousNewLine < 0) {
          previousNewLine = 0;
        }

        content = content.substring(0, previousNewLine) + content.substring(nextNewLine + 1, content.length);
        i = content.indexOf(containing, previousNewLine);
      } else {
        i++;
      }
    }

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
