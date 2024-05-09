import fs from "fs";
import path from "path";

export class BuildSnippetsParameters {
  scriptPaths: string[];
  targetFolderPath: string;
}

class CodeSnippet {
  name: string;
  description?: string;
  segments: string[];
  function: string;
  codeSampleFull: string;
  codeSampleInterior: string;
}

class SnippetsBuilder {
  _targetFolderPath: string;
  _snippets: CodeSnippet[] = [];
  _snippetsByModules: { [moduleName: string]: { [snippetName: string]: CodeSnippet[] } } = {};
  _scriptLibraryMainCode = "";
  _libraryCode: object = {};

  constructor(targetFolderPath: string) {
    if (!targetFolderPath.endsWith("/") && !targetFolderPath.endsWith("\\")) {
      targetFolderPath += "/";
    }

    this._targetFolderPath = path.join(path.resolve(targetFolderPath));
  }

  processFolder(folderPath: string, depth?: number) {
    if (!fs.existsSync(folderPath)) {
      return;
    }

    console.log("Processing folder '" + folderPath + "'");

    if (!depth) {
      depth = 1;
    }

    const results = fs.readdirSync(folderPath);

    results.forEach((fileName: string) => {
      const filePath = path.join(folderPath, fileName);

      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && depth < 4) {
        this.processFolder(filePath, depth + 1);
      } else if (stat.isFile() && fileName.endsWith(".ts")) {
        const content = fs.readFileSync(filePath, { encoding: "utf8" });
        this.resolve(filePath, content);
      }
    });
  }

  fixupScriptCode(code: string) {
    code = code.replace(/mcui\./gi, "");
    code = code.replace(/mcnet\./gi, "");
    code = code.replace(/mcadmin\./gi, "");
    code = code.replace(/mcgt\./gi, "");
    code = code.replace(/mc\./gi, "");

    return code;
  }

  resolve(filePath: string, content: string) {
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
          let description: string | undefined;

          let thisCommentAreaStart = content.lastIndexOf("/**", seeLinkStart);

          if (thisCommentAreaStart >= 0) {
            let firstAsterisk = content.indexOf("* ", thisCommentAreaStart + 5);

            if (firstAsterisk > thisCommentAreaStart) {
              let endOfFirstCommentLine = content.indexOf("\n", firstAsterisk);

              if (endOfFirstCommentLine > firstAsterisk) {
                endOfFirstCommentLine--;
                if (content[endOfFirstCommentLine] === "\r") {
                  endOfFirstCommentLine--;
                }

                description = content.substring(firstAsterisk + 2, endOfFirstCommentLine);
              }
            }
          }

          let urlLink = seeLinkContents.substring(56, seeLinkContents.length).replace("#", "/");

          let urlSegments = urlLink.split("/");

          if (urlSegments.length >= 2 && urlSegments[0].startsWith("minecraft")) {
            const nextExport = content.indexOf("export ", endOfSeeLinkLine);

            if (nextExport >= 0) {
              const nextFunction = content.indexOf(" function", nextExport);

              if (nextFunction >= 0) {
                const firstParen = content.indexOf("(", nextFunction);
                const endOfFunction = content.indexOf("\r\n}", nextFunction);

                if (endOfFunction > firstParen && firstParen > nextFunction) {
                  const name = content.substring(nextFunction + 10, firstParen);
                  const functionCode = content.substring(nextExport, endOfFunction + 3);

                  const firstBrace = functionCode.indexOf("{");

                  if (firstBrace >= 0) {
                    let codeSampleInterior = functionCode.substring(firstBrace + 3, functionCode.length - 3);

                    let codeSampleFull = "";

                    if (codeSampleInterior.indexOf("log(") > 0) {
                      codeSampleFull = content.substring(nextFunction + 1, endOfFunction + 3);
                    } else {
                      codeSampleFull = this.stripLinesContaining(
                        content.substring(nextFunction + 1, endOfFunction + 3),
                        "log("
                      )
                        .replace("log: (message: string, status?: number) => void, ", "")
                        .replace("log: (message: string, status?: number) => void,\r\n", "");
                    }

                    codeSampleFull = this.fixupScriptCode(codeSampleFull);
                    codeSampleInterior = this.fixupScriptCode(codeSampleInterior);

                    let cs = new CodeSnippet();
                    cs.name = name;
                    cs.description = description;
                    cs.segments = urlSegments;
                    cs.function = functionCode;
                    cs.codeSampleFull = codeSampleFull;
                    cs.codeSampleInterior = codeSampleInterior;

                    this._snippets.push(cs);

                    let moduleKey = urlSegments[0] + "/" + urlSegments[1];

                    if (!this._snippetsByModules[moduleKey]) {
                      this._snippetsByModules[moduleKey] = {};
                    }

                    if (!this._snippetsByModules[moduleKey][name]) {
                      this._snippetsByModules[moduleKey][name] = [];
                    }

                    this._snippetsByModules[moduleKey][name].push(cs);

                    console.log("Snippet '" + name + "' discovered for " + urlSegments.join(".") + " in " + moduleKey);
                  }
                }
              }
            }
          }
        }

        seeLinkStart = content.indexOf("@see ", seeLinkStart + 5);
      }
    }
  }

  writeSnippetFiles() {
    for (let moduleKey in this._snippetsByModules) {
      let snippetsByName = this._snippetsByModules[moduleKey];

      for (let snippetKey in snippetsByName) {
        const snippets = snippetsByName[snippetKey];

        if (snippets.length <= 1) {
          let snippet = snippets[0];

          let localUrlSegments = Array.from(snippet.segments);

          if (localUrlSegments[0] === localUrlSegments[1]) {
            localUrlSegments.shift();
          }

          this.writeFile(
            "docsnips/" + localUrlSegments.join("/") + "/_examples/" + snippet.name + ".ts",
            snippet.codeSampleFull
          );
        } else {
          let snippet = snippets[0];

          let localUrlSegments = Array.from(snippet.segments);

          if (localUrlSegments[0] === localUrlSegments[1]) {
            localUrlSegments.shift();
          }

          if (localUrlSegments.length >= 2) {
            this.writeFile(
              "docsnips/" +
                localUrlSegments[0] +
                "/" +
                localUrlSegments[1] +
                "/_shared_examples/" +
                snippet.name +
                ".ts",
              snippet.codeSampleFull
            );
          } else {
            this.writeFile(
              "docsnips/" + localUrlSegments[0] + "/_shared_examples/" + snippet.name + ".ts",
              snippet.codeSampleFull
            );
          }
        }
      }
    }
  }

  writeCatalogFiles() {
    for (let moduleKey in this._snippetsByModules) {
      let moduleType: string[] = [];
      let samplesWritten: { [snippetName: string]: CodeSnippet } = {};
      let snippetsByName = this._snippetsByModules[moduleKey];

      for (let snippetKey in snippetsByName) {
        const snippets = snippetsByName[snippetKey];
        for (let i = 0; i < snippets.length; i++) {
          let snippet = snippets[i];

          if (!samplesWritten[snippet.name]) {
            samplesWritten[snippet.name] = snippet;
            moduleType.push(snippets[i].function);
          }
        }
      }

      let jsonMarkup = "{" + "\r\n";

      for (let snippetKey in samplesWritten) {
        let snippet = samplesWritten[snippetKey];

        if (jsonMarkup.length > 10) {
          jsonMarkup += ",\r\n";
        }

        let sample = '["' + this.getQuoteSafeContent(snippet.codeSampleInterior).replace(/\r\n/g, '",\r\n"') + '"\r\n]';

        jsonMarkup +=
          '"' +
          snippet.name +
          '": {\r\n  "description": "' +
          (snippet.description ? snippet.description + " " : "") +
          "See https://learn.microsoft.com/minecraft/creator/scriptapi/" +
          snippet.segments.join("/") +
          '",\r\n  "prefix": ["mc"],\r\n  "body": ' +
          sample +
          "}";
      }

      jsonMarkup += "\r\n}";

      this.writeFile("samplejson/" + moduleKey + "-samples.json", jsonMarkup);

      let tsTestFileMarkup =
        "/* eslint-disable  @typescript-eslint/no-unused-vars */\r\n" +
        'import * as mc from "@minecraft/server";\r\n\r\n' +
        moduleType.join("\r\n\r\n");

      tsTestFileMarkup += "\r\n" + this._scriptLibraryMainCode + "\r\n";

      if (this._libraryCode[moduleKey]) {
        tsTestFileMarkup += "\r\n" + this._libraryCode[moduleKey] + "\r\n";
      }

      this.writeFile("typescript/" + moduleKey + "/tests.ts", tsTestFileMarkup);
    }
  }

  getQuoteSafeContent(content : string) {
    var newContent = "";

    for (const chr of content) {
      if (chr === "\\") {
        newContent += "/";
      } else if (chr === '"') {
        newContent += "'";
      } else {
        newContent += chr;
      }
    }

    // eslint-disable-next-line no-control-regex
    newContent = newContent.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, '",\n"');
    return newContent;
  }


  stripLinesContaining(content: string, containing: string) {
    let i = content.indexOf(containing);

    while (i >= 0) {
      let previousNewLine = content.lastIndexOf("\n", i);

      let nextNewLine = content.indexOf("\n", i);

      if (previousNewLine < 0) {
        previousNewLine = 0;
      }

      if (previousNewLine > 0 && content[previousNewLine - 1] === "\r") {
        previousNewLine--;
      }

      if (nextNewLine < 0) {
        nextNewLine = content.length - 1;
      }

      content = content.substring(0, previousNewLine) + content.substring(nextNewLine + 1, content.length);
      i = content.indexOf(containing, previousNewLine);
    }

    return content;
  }

  writeFile(relativePath: string, contents: string) {
    const fullPath = path.join(this._targetFolderPath, relativePath);
    const dirName = path.dirname(fullPath);

    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, { recursive: true });
    }

    fs.writeFileSync(fullPath, contents);
  }
}

export function buildSnippets(params: BuildSnippetsParameters) {
  return () => {
    const snippetsBuilder = new SnippetsBuilder(params.targetFolderPath);

    for (const scriptPath of params.scriptPaths) {
      console.log("Processing " + scriptPath);
      snippetsBuilder.processFolder(scriptPath);
    }

    snippetsBuilder.writeSnippetFiles();
    snippetsBuilder.writeCatalogFiles();
  };
}
