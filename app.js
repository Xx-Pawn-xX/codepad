const STORAGE_KEY = "codepad-v5";


/* =========================
   DOM
========================= */

const fileList =
  document.getElementById("fileList");

const tabs =
  document.getElementById("tabs");

const editorContainer =
  document.getElementById("editor");

const editorWrapper =
  document.getElementById("editorWrapper");

const emptyState =
  document.getElementById("emptyState");

const projectNameElement =
  document.getElementById("projectName");

const fileStatus =
  document.getElementById("fileStatus");

const languageStatus =
  document.getElementById("languageStatus");

const cursorStatus =
  document.getElementById("cursorStatus");

const fileInput =
  document.getElementById("fileInput");

const modalOverlay =
  document.getElementById("modalOverlay");

const modalTitle =
  document.getElementById("modalTitle");

const modalText =
  document.getElementById("modalText");

const modalInput =
  document.getElementById("modalInput");

const modalConfirm =
  document.getElementById("modalConfirm");

const modalCancel =
  document.getElementById("modalCancel");


/* =========================
   FILE TYPES
========================= */

const FILE_TYPES = {

  html: {
    label: "HTML",
    extension: "html",
    color: "#ff3b3b",
    icon: "</>",
    defaultName: "index",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>My Project</title>

</head>

<body>

  <h1>Hello World</h1>

</body>

</html>`
  },


  css: {
    label: "CSS",
    extension: "css",
    color: "#3b82f6",
    icon: "{}",
    defaultName: "style",
    language: "css",
    content: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
}`
  },


  js: {
    label: "JavaScript",
    extension: "js",
    color: "#facc15",
    icon: "JS",
    defaultName: "app",
    language: "javascript",
    content: `console.log("Hello from CodePad!");`
  },


  ts: {
    label: "TypeScript",
    extension: "ts",
    color: "#60a5fa",
    icon: "TS",
    defaultName: "app",
    language: "typescript",
    content: `console.log("Hello from TypeScript!");`
  },


  md: {
    label: "Markdown",
    extension: "md",
    color: "#f97316",
    icon: "MD",
    defaultName: "README",
    language: "markdown",
    content: `# My Project

Made with CodePad.

## About

Write something about your project here.
`
  },


  py: {
    label: "Python",
    extension: "py",
    color: "#22c55e",
    icon: "PY",
    defaultName: "main",
    language: "python",
    content: `print("Hello World!")`
  },


  json: {
    label: "JSON",
    extension: "json",
    color: "#a855f7",
    icon: "{}",
    defaultName: "data",
    language: "json",
    content: `{
  "name": "My Project"
}`
  },


  yaml: {
    label: "YAML",
    extension: "yaml",
    color: "#ec4899",
    icon: "YML",
    defaultName: "config",
    language: "yaml",
    content: `name: My Project`
  },


  yml: {
    label: "YAML",
    extension: "yml",
    color: "#ec4899",
    icon: "YML",
    defaultName: "config",
    language: "yaml",
    content: `name: My Project`
  },


  java: {
    label: "Java",
    extension: "java",
    color: "#fb7185",
    icon: "J",
    defaultName: "Main",
    language: "java",
    content: `public class Main {

  public static void main(String[] args) {

    System.out.println("Hello World!");

  }

}`
  },


  cpp: {
    label: "C++",
    extension: "cpp",
    color: "#06b6d4",
    icon: "C+",
    defaultName: "main",
    language: "cpp",
    content: `#include <iostream>

int main() {

  std::cout << "Hello World!";

  return 0;

}`
  },


  c: {
    label: "C",
    extension: "c",
    color: "#14b8a6",
    icon: "C",
    defaultName: "main",
    language: "c",
    content: `#include <stdio.h>

int main() {

  printf("Hello World!");

  return 0;

}`
  },


  cs: {
    label: "C#",
    extension: "cs",
    color: "#8b5cf6",
    icon: "C#",
    defaultName: "Program",
    language: "csharp",
    content: `Console.WriteLine("Hello World!");`
  },


  php: {
    label: "PHP",
    extension: "php",
    color: "#818cf8",
    icon: "PHP",
    defaultName: "index",
    language: "php",
    content: `<?php

echo "Hello World!";

?>`
  },


  sql: {
    label: "SQL",
    extension: "sql",
    color: "#38bdf8",
    icon: "SQL",
    defaultName: "database",
    language: "sql",
    content: `SELECT * FROM table_name;`
  },


  xml: {
    label: "XML",
    extension: "xml",
    color: "#f43f5e",
    icon: "</>",
    defaultName: "data",
    language: "xml",
    content: `<?xml version="1.0"?>

<root>

</root>`
  },


  txt: {
    label: "Text",
    extension: "txt",
    color: "#a1a1aa",
    icon: "TXT",
    defaultName: "notes",
    language: "plaintext",
    content: ``
  }

};


const FALLBACK_TYPE = {
  label: "Text",
  color: "#a1a1aa",
  icon: "TXT",
  language: "plaintext"
};


/* =========================
   PROJECT
========================= */

let project = {
  name: "Untitled Project",
  files: [],
  activeFileId: null,
  openTabs: []
};


let selectedType = null;

let editor = null;

let currentModel = null;

let monacoReady = false;


/* =========================
   HELPERS
========================= */

function createId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2)
  );

}


function getExtension(filename) {

  const parts =
    filename.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts
    .pop()
    .toLowerCase();

}


function getFileType(filename) {

  const extension =
    getExtension(filename);

  return (
    FILE_TYPES[extension] ||
    FALLBACK_TYPE
  );

}


function getActiveFile() {

  return project.files.find(
    file =>
      file.id ===
      project.activeFileId
  );

}


function escapeHtml(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   STARTER PROJECT
========================= */

function createStarterProject() {

  const starterTypes = [
    "html",
    "css",
    "js",
    "md",
    "py",
    "json",
    "yaml"
  ];


  project.files =
    starterTypes.map(key => {

      const type =
        FILE_TYPES[key];

      return {
        id: createId(),

        name:
          type.defaultName +
          "." +
          type.extension,

        content:
          type.content
      };

    });


  project.activeFileId =
    project.files[0].id;


  project.openTabs = [
    project.files[0].id
  ];

}


/* =========================
   SAVE / LOAD
========================= */

function saveProject() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(project)
  );

}


function loadProject() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {

    createStarterProject();

    saveProject();

    return;

  }


  try {

    project =
      JSON.parse(saved);


    if (
      !project.files ||
      project.files.length === 0
    ) {

      createStarterProject();

      saveProject();

    }

  }

  catch {

    createStarterProject();

    saveProject();

  }

}


/* =========================
   FILE LIST
========================= */

function renderFileList() {

  fileList.innerHTML = "";


  project.files.forEach(file => {

    const type =
      getFileType(file.name);


    const item =
      document.createElement("div");


    item.className =
      "file-item";


    if (
      file.id ===
      project.activeFileId
    ) {

      item.classList.add("active");

    }


    item.style.setProperty(
      "--file-color",
      type.color
    );


    const openButton =
      document.createElement("button");


    openButton.className =
      "file-open";


    openButton.innerHTML = `
      <span class="file-icon">
        ${escapeHtml(type.icon)}
      </span>

      <span class="file-name">
        ${escapeHtml(file.name)}
      </span>

      <span class="file-tag">
        ${escapeHtml(type.label)}
      </span>
    `;


    openButton.addEventListener(
      "click",
      () => openFile(file.id)
    );


    const deleteButton =
      document.createElement("button");


    deleteButton.className =
      "delete-file";


    deleteButton.textContent =
      "×";


    deleteButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        deleteFile(file.id);

      }
    );


    item.appendChild(openButton);

    item.appendChild(deleteButton);

    fileList.appendChild(item);

  });

}


/* =========================
   TABS
========================= */

function renderTabs() {

  tabs.innerHTML = "";


  project.openTabs.forEach(id => {

    const file =
      project.files.find(
        item =>
          item.id === id
      );


    if (!file) return;


    const type =
      getFileType(file.name);


    const tab =
      document.createElement("div");


    tab.className =
      "tab";


    tab.style.setProperty(
      "--file-color",
      type.color
    );


    if (
      file.id ===
      project.activeFileId
    ) {

      tab.classList.add("active");

    }


    const name =
      document.createElement("button");


    name.className =
      "tab-name";


    name.textContent =
      file.name;


    name.addEventListener(
      "click",
      () => openFile(file.id)
    );


    const close =
      document.createElement("button");


    close.className =
      "tab-close";


    close.textContent =
      "×";


    close.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        closeTab(id);

      }
    );


    tab.appendChild(name);

    tab.appendChild(close);

    tabs.appendChild(tab);

  });

}


/* =========================
   OPEN FILE
========================= */

function openFile(id) {

  const file =
    project.files.find(
      item =>
        item.id === id
    );


  if (!file) return;


  project.activeFileId =
    id;


  if (
    !project.openTabs.includes(id)
  ) {

    project.openTabs.push(id);

  }


  loadFileIntoEditor();

  updateEverything();

  saveProject();

}


/* =========================
   LOAD FILE INTO MONACO
========================= */

function loadFileIntoEditor() {

  if (
    !editor ||
    !monacoReady
  ) {
    return;
  }


  const file =
    getActiveFile();


  if (!file) {

    editor.setModel(null);

    currentModel = null;

    return;

  }


  const type =
    getFileType(file.name);


  if (currentModel) {

    currentModel.dispose();

    currentModel = null;

  }


  currentModel =
    monaco.editor.createModel(
      file.content,
      type.language
    );


  editor.setModel(
    currentModel
  );


  editor.focus();

}


/* =========================
   CLOSE TAB
========================= */

function closeTab(id) {

  project.openTabs =
    project.openTabs.filter(
      tabId =>
        tabId !== id
    );


  if (
    project.activeFileId === id
  ) {

    project.activeFileId =
      project.openTabs[0] ||
      project.files[0]?.id ||
      null;

  }


  loadFileIntoEditor();

  updateEverything();

  saveProject();

}


/* =========================
   DELETE FILE
========================= */

function deleteFile(id) {

  const file =
    project.files.find(
      item =>
        item.id === id
    );


  if (!file) return;


  if (
    !confirm(
      `Delete ${file.name}?`
    )
  ) {
    return;
  }


  project.files =
    project.files.filter(
      item =>
        item.id !== id
    );


  project.openTabs =
    project.openTabs.filter(
      item =>
        item !== id
    );


  if (
    project.activeFileId === id
  ) {

    project.activeFileId =
      project.files[0]?.id ||
      null;

  }


  loadFileIntoEditor();

  updateEverything();

  saveProject();

}


/* =========================
   MONACO
========================= */

function initializeMonaco() {

  require.config({
    paths: {
      vs:
        "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs"
    }
  });


  window.MonacoEnvironment = {

    getWorkerUrl() {

      const workerCode = `
        self.MonacoEnvironment = {
          baseUrl:
            "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/"
        };

        importScripts(
          "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs/base/worker/workerMain.js"
        );
      `;


      const blob =
        new Blob(
          [workerCode],
          {
            type:
              "text/javascript"
          }
        );


      return URL.createObjectURL(
        blob
      );

    }

  };


  require(
    [
      "vs/editor/editor.main"
    ],

    function () {

      monacoReady = true;


      /* =========================
         CUSTOM CODEPAD THEME
      ========================== */

      monaco.editor.defineTheme(
        "codepad-dark",

        {
          base: "vs-dark",

          inherit: true,

          rules: [

            {
              token: "comment",
              foreground: "6A9955"
            },

            {
              token: "keyword",
              foreground: "C586C0"
            },

            {
              token: "string",
              foreground: "CE9178"
            },

            {
              token: "number",
              foreground: "B5CEA8"
            },

            {
              token: "type",
              foreground: "4EC9B0"
            },

            {
              token: "function",
              foreground: "DCDCAA"
            },

            {
              token: "variable",
              foreground: "9CDCFE"
            },

            {
              token: "tag",
              foreground: "569CD6"
            },

            {
              token: "attribute.name",
              foreground: "9CDCFE"
            }

          ],

          colors: {

            "editor.background":
              "#0B0B0B",

            "editor.foreground":
              "#E9E9E9",

            "editorLineNumber.foreground":
              "#505050",

            "editorLineNumber.activeForeground":
              "#A0A0A0",

            "editorCursor.foreground":
              "#FFFFFF",

            "editor.selectionBackground":
              "#264F78",

            "editor.inactiveSelectionBackground":
              "#1C3A5C",

            "editor.lineHighlightBackground":
              "#101010",

            "editorIndentGuide.background":
              "#202020",

            "editorIndentGuide.activeBackground":
              "#3A3A3A",

            "editorBracketMatch.background":
              "#2B2B2B",

            "editorBracketMatch.border":
              "#666666",

            "editorWidget.background":
              "#171717",

            "editorWidget.border":
              "#333333",

            "editorSuggestWidget.background":
              "#171717",

            "editorSuggestWidget.border":
              "#333333",

            "editorSuggestWidget.selectedBackground":
              "#262626",

            "editorHoverWidget.background":
              "#171717",

            "editorHoverWidget.border":
              "#333333",

            "editorGutter.background":
              "#0B0B0B"

          }

        }

      );


      monaco.editor.setTheme(
        "codepad-dark"
      );


      editor =
        monaco.editor.create(

          editorContainer,

          {

            value: "",

            language:
              "plaintext",

            theme:
              "codepad-dark",

            automaticLayout:
              true,

            fontSize:
              14,

            lineHeight:
              22,

            fontFamily:
              'SFMono-Regular, Consolas, "Liberation Mono", monospace',

            tabSize:
              2,

            insertSpaces:
              true,

            minimap: {
              enabled: false
            },

            scrollBeyondLastLine:
              false,

            smoothScrolling:
              true,

            cursorSmoothCaretAnimation:
              "on",

            cursorBlinking:
              "smooth",

            roundedSelection:
              true,

            wordWrap:
              "on",

            wrappingIndent:
              "same",

            automaticLayout:
              true,

            suggest: {

              showKeywords:
                true,

              showSnippets:
                true,

              showMethods:
                true,

              showFunctions:
                true,

              showConstructors:
                true,

              showFields:
                true,

              showVariables:
                true,

              showClasses:
                true,

              showInterfaces:
                true,

              showModules:
                true,

              showProperties:
                true

            },

            quickSuggestions: {

              other:
                true,

              comments:
                false,

              strings:
                false

            },

            suggestOnTriggerCharacters:
              true,

            acceptSuggestionOnEnter:
              "on",

            acceptSuggestionOnCommitCharacter:
              true,

            parameterHints: {
              enabled:
                true
            },

            autoClosingBrackets:
              "always",

            autoClosingQuotes:
              "always",

            autoSurround:
              "languageDefined",

            bracketPairColorization: {
              enabled:
                true
            },

            guides: {

              bracketPairs:
                true,

              indentation:
                true

            },

            formatOnPaste:
              true,

            formatOnType:
              true,

            folding:
              true,

            lineNumbers:
              "on",

            glyphMargin:
              false,

            contextmenu:
              true,

            renderWhitespace:
              "selection",

            padding: {
              top: 16,
              bottom: 16
            }

          }

        );


      /* =========================
         SAVE CHANGES
      ========================== */

      editor.onDidChangeModelContent(
        () => {

          const file =
            getActiveFile();


          if (!file) return;


          file.content =
            editor.getValue();


          saveProject();

        }
      );


      /* =========================
         CURSOR STATUS
      ========================== */

      editor.onDidChangeCursorPosition(
        event => {

          cursorStatus.textContent =
            `Ln ${event.position.lineNumber}, Col ${event.position.column}`;

        }
      );


      loadFileIntoEditor();

      updateEverything();

    }

  );

}


/* =========================
   STATUS
========================= */

function updateStatus() {

  const file =
    getActiveFile();


  if (!file) {

    fileStatus.textContent =
      "No file open";

    languageStatus.textContent =
      "Plain Text";

    cursorStatus.textContent =
      "Ln 1, Col 1";

    return;

  }


  const type =
    getFileType(file.name);


  fileStatus.textContent =
    file.name;


  languageStatus.textContent =
    type.label;

}


/* =========================
   ACCENT
========================= */

function updateAccent() {

  const file =
    getActiveFile();


  const color =
    file
      ? getFileType(file.name).color
      : "#ffffff";


  document.documentElement
    .style.setProperty(
      "--accent",
      color
    );

}


/* =========================
   VISIBILITY
========================= */

function updateVisibility() {

  const hasFile =
    !!getActiveFile();


  emptyState.classList.toggle(
    "hidden",
    hasFile
  );


  editorWrapper.classList.toggle(
    "hidden",
    !hasFile
  );


  if (
    hasFile &&
    editor
  ) {

    setTimeout(
      () => {

        editor.layout();

      },
      0
    );

  }

}


/* =========================
   UPDATE EVERYTHING
========================= */

function updateEverything() {

  renderFileList();

  renderTabs();

  updateStatus();

  updateAccent();

  updateVisibility();

}


/* =========================
   FILE TYPE PICKER
========================= */

function openNewFilePicker() {

  selectedType = null;


  modalTitle.textContent =
    "Create New File";


  modalText.textContent =
    "Choose a file type.";


  modalInput.style.display =
    "none";


  modalConfirm.style.display =
    "none";


  document
    .querySelectorAll(
      ".file-type-picker"
    )
    .forEach(
      element =>
        element.remove()
    );


  const picker =
    document.createElement("div");


  picker.className =
    "file-type-picker";


  Object.entries(FILE_TYPES)
    .forEach(
      ([key, type]) => {

        const button =
          document.createElement("button");


        button.className =
          "file-type-choice";


        button.style.setProperty(
          "--choice-color",
          type.color
        );


        button.innerHTML = `
          <span class="choice-icon">
            ${escapeHtml(type.icon)}
          </span>

          <span class="choice-name">
            ${escapeHtml(type.label)}
          </span>

          <span class="choice-extension">
            .${type.extension}
          </span>
        `;


        button.addEventListener(
          "click",
          () =>
            chooseFileType(key)
        );


        picker.appendChild(
          button
        );

      }
    );


  modalText.after(
    picker
  );


  modalOverlay.classList.remove(
    "hidden"
  );

}


/* =========================
   CHOOSE FILE TYPE
========================= */

function chooseFileType(key) {

  selectedType =
    FILE_TYPES[key];


  document
    .querySelector(
      ".file-type-picker"
    )
    ?.remove();


  modalTitle.textContent =
    `New ${selectedType.label} File`;


  modalText.textContent =
    `Enter a filename for your .${selectedType.extension} file.`;


  modalInput.style.display =
    "block";


  modalConfirm.style.display =
    "inline-flex";


  modalConfirm.textContent =
    "Create";


  modalInput.value =
    selectedType.defaultName;


  setTimeout(
    () => {

      modalInput.focus();

      modalInput.select();

    },
    50
  );

}


/* =========================
   CREATE FILE
========================= */

function createSelectedFile() {

  if (!selectedType) return;


  let name =
    modalInput.value.trim();


  if (!name) return;


  if (
    !name
      .toLowerCase()
      .endsWith(
        "." +
        selectedType.extension
      )
  ) {

    name +=
      "." +
      selectedType.extension;

  }


  const exists =
    project.files.some(
      file =>
        file.name
          .toLowerCase() ===
        name.toLowerCase()
    );


  if (exists) {

    alert(
      "A file with that name already exists."
    );

    return;

  }


  const file = {

    id:
      createId(),

    name,

    content:
      selectedType.content

  };


  project.files.push(
    file
  );


  project.activeFileId =
    file.id;


  project.openTabs.push(
    file.id
  );


  closeModal();

  loadFileIntoEditor();

  updateEverything();

  saveProject();

}


/* =========================
   CLOSE MODAL
========================= */

function closeModal() {

  document
    .querySelector(
      ".file-type-picker"
    )
    ?.remove();


  modalOverlay.classList.add(
    "hidden"
  );


  modalInput.style.display =
    "block";


  modalConfirm.style.display =
    "inline-flex";


  selectedType = null;

}


modalConfirm.addEventListener(
  "click",
  createSelectedFile
);


modalInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      createSelectedFile();

    }

  }
);


modalCancel.addEventListener(
  "click",
  closeModal
);


modalOverlay.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      modalOverlay
    ) {

      closeModal();

    }

  }
);


/* =========================
   RENAME PROJECT
========================= */

document
  .getElementById(
    "renameProjectButton"
  )
  .addEventListener(
    "click",
    () => {

      const name =
        prompt(
          "Project name:",
          project.name
        );


      if (
        name &&
        name.trim()
      ) {

        project.name =
          name.trim();


        projectNameElement.textContent =
          project.name;


        saveProject();

      }

    }
);


/* =========================
   IMPORT
========================= */

function openImport() {

  fileInput.value = "";

  fileInput.click();

}


document
  .getElementById(
    "importButton"
  )
  .addEventListener(
    "click",
    openImport
  );


document
  .getElementById(
    "importSidebarButton"
  )
  .addEventListener(
    "click",
    openImport
  );


fileInput.addEventListener(
  "change",
  async () => {

    const files =
      [...fileInput.files];


    for (
      const imported
      of files
    ) {

      const content =
        await imported.text();


      const alreadyExists =
        project.files.some(
          file =>
            file.name
              .toLowerCase() ===
            imported.name
              .toLowerCase()
        );


      if (
        alreadyExists
      ) {

        continue;

      }


      project.files.push({

        id:
          createId(),

        name:
          imported.name,

        content

      });

    }


    if (
      files.length
    ) {

      const lastFile =
        project.files.at(-1);


      if (lastFile) {

        project.activeFileId =
          lastFile.id;


        if (
          !project.openTabs.includes(
            lastFile.id
          )
        ) {

          project.openTabs.push(
            lastFile.id
          );

        }

      }

    }


    loadFileIntoEditor();

    updateEverything();

    saveProject();

  }
);


/* =========================
   EXPORT CURRENT FILE
========================= */

function exportCurrentFile() {

  const file =
    getActiveFile();


  if (!file) {

    alert(
      "Open a file first."
    );

    return;

  }


  const blob =
    new Blob(

      [
        file.content
      ],

      {
        type:
          "text/plain"
      }

    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement("a");


  link.href =
    url;


  link.download =
    file.name;


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  URL.revokeObjectURL(
    url
  );

}


/* =========================
   EXPORT PROJECT
========================= */

function exportProject() {

  const exportData = {

    name:
      project.name,

    files:
      project.files.map(
        file => ({

          name:
            file.name,

          content:
            file.content

        })
      )

  };


  const blob =
    new Blob(

      [
        JSON.stringify(
          exportData,
          null,
          2
        )
      ],

      {
        type:
          "application/json"
      }

    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement("a");


  link.href =
    url;


  link.download =
    `${project.name}.json`;


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  URL.revokeObjectURL(
    url
  );

}


/* =========================
   BUTTONS
========================= */

[
  "newFileButton",
  "addFileButton",
  "emptyNewFileButton"
]
.forEach(
  id => {

    const button =
      document.getElementById(
        id
      );


    if (!button) return;


    button.addEventListener(
      "click",
      openNewFilePicker
    );

  }
);


document
  .getElementById(
    "exportButton"
  )
  .addEventListener(
    "click",
    exportCurrentFile
  );


document
  .getElementById(
    "exportProjectButton"
  )
  .addEventListener(
    "click",
    exportProject
  );


/* =========================
   KEYBOARD SAVE
========================= */

window.addEventListener(
  "keydown",
  event => {

    if (
      (event.ctrlKey ||
        event.metaKey) &&
      event.key.toLowerCase() ===
        "s"
    ) {

      event.preventDefault();

      exportCurrentFile();

    }

  }
);


/* =========================
   START
========================= */

loadProject();


projectNameElement.textContent =
  project.name;


updateEverything();


initializeMonaco();


saveProject();
