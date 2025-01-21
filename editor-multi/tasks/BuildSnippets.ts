import fs from "fs";
import path from "path";

export class BuildSnippetsParameters {
  scriptPaths: string[];
  targetFolderPath: string;
}

class CodeSnippet {
  name: string;
  description: string;
  codeSampleFull: string;
}

class SnippetsBuilder {
  _targetFolderPath: string;
  _snippets: CodeSnippet[] = [];
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
      } else if (stat.isFile() && fileName.endsWith(".ts") && !fileName.startsWith("main")) {
        const content = fs.readFileSync(filePath, { encoding: "utf8" });
        this.resolve(fileName, content);
      }
    });
  }

  resolve(fileName: string, content: string) {
    const scriptLibraryMainCode = this.stripLinesContaining(content, "import * as mc from ");

    let cs = new CodeSnippet();
    cs.name = fileName;
    cs.description = fileName;
    cs.codeSampleFull;
    cs.codeSampleFull = scriptLibraryMainCode;

    this._snippets.push(cs);
  }

  writeCatalogFiles() {
    let jsonMarkup = "{" + "\r\n";

    for (const snippet of this._snippets) {
      if (jsonMarkup.length > 10) {
        jsonMarkup += ",\r\n";
      }

      let sample = '["' + this.getQuoteSafeContent(snippet.codeSampleFull).replace(/\r\n/g, '",\r\n"') + '"\r\n]';

      jsonMarkup +=
        '"' +
        snippet.name +
        '": {\r\n  "description": "' +
        (snippet.description ? snippet.description + " " : "") +
        '",\r\n  "prefix": ["mc"],\r\n  "body": ' +
        sample +
        "}";
    }

    jsonMarkup += "\r\n}";

    this.writeFile("samplejson/editor-samples.json", jsonMarkup);
  }

  getQuoteSafeContent(content: string) {
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

    newContent = newContent.replace(/  /g, "");

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

    snippetsBuilder.writeCatalogFiles();
  };
}
