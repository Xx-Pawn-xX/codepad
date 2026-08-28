const STORAGE_KEY = "codepad-v4";

const fileList = document.getElementById("fileList");
const tabs = document.getElementById("tabs");
const editor = document.getElementById("editor");
const lineNumbers = document.getElementById("lineNumbers");
const editorWrapper = document.getElementById("editorWrapper");
const emptyState = document.getElementById("emptyState");

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
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

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
    content: `console.log("Hello from CodePad!");`
  },

  ts: {
    label: "TypeScript",
    extension: "ts",
    color: "#60a5fa",
    icon: "TS",
    defaultName: "app",
    content: `console.log("Hello from TypeScript!");`
  },

  md: {
    label: "Markdown",
    extension: "md",
    color: "#f97316",
    icon: "MD",
    defaultName: "README",
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
    content: `print("Hello World!")`
  },

  json: {
    label: "JSON",
    extension: "json",
    color: "#a855f7",
    icon: "{}",
    defaultName: "data",
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
    content: `name: My Project`
  },

  java: {
    label: "Java",
    extension: "java",
    color: "#fb7185",
    icon: "J",
    defaultName: "Main",
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
    content: `Console.WriteLine("Hello World!");`
  },

  php: {
    label: "PHP",
    extension: "php",
    color: "#818cf8",
    icon: "PHP",
    defaultName: "index",
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
    content: `SELECT * FROM table_name;`
  },

  xml: {
    label: "XML",
    extension: "xml",
    color: "#f43f5e",
    icon: "</>",
    defaultName: "data",
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
    content: ``
  }

};


const FALLBACK_TYPE = {
  label: "Text",
  color: "#a1a1aa",
  icon: "TXT"
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
   MIME TYPES
========================= */

function getMimeType(filename) {

  const extension =
    getExtension(filename);


  const mimeTypes = {

    html: "text/html",
    htm: "text/html",

    css: "text/css",

    js: "text/javascript",
    mjs: "text/javascript",

    ts: "text/plain",

    json: "application/json",

    md: "text/markdown",

    txt: "text/plain",

    py: "text/x-python",

    java: "text/x-java-source",

    c: "text/x-c",

    cpp: "text/x-c++src",

    cs: "text/plain",

    php: "application/x-httpd-php",

    sql: "application/sql",

    xml: "application/xml",

    yaml: "application/x-yaml",
    yml: "application/x-yaml"

  };


  return (
    mimeTypes[extension] ||
    "text/plain"
  );

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
    "yaml",
    "ts",
    "java",
    "cpp",
    "c",
    "cs",
    "php",
    "sql",
    "xml",
    "txt"
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

      <span
        class="file-icon"
      >
        ${escapeHtml(type.icon)}
      </span>

      <span
        class="file-name"
      >
        ${escapeHtml(file.name)}
      </span>

      <span
        class="file-tag"
      >
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
        item => item.id === id
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
      item => item.id === id
    );


  if (!file) return;


  project.activeFileId =
    id;


  if (
    !project.openTabs.includes(id)
  ) {

    project.openTabs.push(id);

  }


  editor.value =
    file.content;


  updateEverything();

  saveProject();

}


/* =========================
   CLOSE TAB
========================= */

function closeTab(id) {

  project.openTabs =
    project.openTabs.filter(
      tabId => tabId !== id
    );


  if (
    project.activeFileId === id
  ) {

    project.activeFileId =
      project.openTabs[0] ||
      project.files[0]?.id ||
      null;

  }


  const active =
    getActiveFile();


  editor.value =
    active
      ? active.content
      : "";


  updateEverything();

  saveProject();

}


/* =========================
   DELETE FILE
========================= */

function deleteFile(id) {

  const file =
    project.files.find(
      item => item.id === id
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
      item => item.id !== id
    );


  project.openTabs =
    project.openTabs.filter(
      item => item !== id
    );


  if (
    project.activeFileId === id
  ) {

    project.activeFileId =
      project.files[0]?.id ||
      null;

  }


  const active =
    getActiveFile();


  editor.value =
    active
      ? active.content
      : "";


  updateEverything();

  saveProject();

}


/* =========================
   EDITOR
========================= */

editor.addEventListener(
  "input",
  () => {

    const file =
      getActiveFile();


    if (!file) return;


    file.content =
      editor.value;


    updateLineNumbers();

    updateCursor();

    saveProject();

  }
);


editor.addEventListener(
  "scroll",
  () => {

    lineNumbers.scrollTop =
      editor.scrollTop;

  }
);


editor.addEventListener(
  "click",
  updateCursor
);


editor.addEventListener(
  "keyup",
  updateCursor
);


editor.addEventListener(
  "keydown",
  event => {

    if (event.key === "Tab") {

      event.preventDefault();


      const start =
        editor.selectionStart;

      const end =
        editor.selectionEnd;


      editor.value =
        editor.value.substring(
          0,
          start
        ) +

        "  " +

        editor.value.substring(
          end
        );


      editor.selectionStart =
        start + 2;

      editor.selectionEnd =
        start + 2;


      editor.dispatchEvent(
        new Event("input")
      );

    }


    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {

      event.preventDefault();

      exportCurrentFile();

    }

  }
);


/* =========================
   STATUS
========================= */

function updateLineNumbers() {

  const count =
    editor.value
      .split("\n")
      .length;


  lineNumbers.textContent =
    Array.from(
      { length: count },
      (_, index) =>
        index + 1
    ).join("\n");

}


function updateCursor() {

  const before =
    editor.value.slice(
      0,
      editor.selectionStart
    );


  const lines =
    before.split("\n");


  cursorStatus.textContent =
    `Ln ${lines.length}, Col ${
      lines[lines.length - 1].length + 1
    }`;

}


function updateStatus() {

  const file =
    getActiveFile();


  if (!file) {

    fileStatus.textContent =
      "No file open";

    languageStatus.textContent =
      "Plain Text";

    return;

  }


  const type =
    getFileType(file.name);


  fileStatus.textContent =
    file.name;


  languageStatus.textContent =
    type.label;

}


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

}


function updateEverything() {

  renderFileList();

  renderTabs();

  updateLineNumbers();

  updateStatus();

  updateCursor();

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
      element => element.remove()
    );


  const picker =
    document.createElement("div");


  picker.className =
    "file-type-picker";


  Object.entries(FILE_TYPES)
    .forEach(([key, type]) => {

      const button =
        document.createElement("button");


      button.className =
        "file-type-choice";


      button.style.setProperty(
        "--choice-color",
        type.color
      );


      button.innerHTML = `

        <span
          class="choice-icon"
        >
          ${escapeHtml(type.icon)}
        </span>

        <span
          class="choice-name"
        >
          ${escapeHtml(type.label)}
        </span>

        <span
          class="choice-extension"
        >
          .${type.extension}
        </span>

      `;


      button.addEventListener(
        "click",
        () => chooseFileType(key)
      );


      picker.appendChild(button);

    });


  modalText.after(
    picker
  );


  modalOverlay.classList.remove(
    "hidden"
  );

}


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
    id: createId(),
    name,
    content:
      selectedType.content
  };


  project.files.push(file);

  project.activeFileId =
    file.id;


  project.openTabs.push(
    file.id
  );


  editor.value =
    file.content;


  closeModal();

  updateEverything();

  saveProject();

}


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


modalCancel.addEventListener(
  "click",
  closeModal
);


modalOverlay.addEventListener(
  "click",
  event => {

    if (
      event.target === modalOverlay
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

document
  .getElementById(
    "importButton"
  )
  .addEventListener(
    "click",
    () => {

      fileInput.value = "";

      fileInput.click();

    }
);


fileInput.addEventListener(
  "change",
  async () => {

    const files =
      [...fileInput.files];


    for (const imported of files) {

      const content =
        await imported.text();


      project.files.push({
        id: createId(),
        name: imported.name,
        content
      });

    }


    if (files.length) {

      openFile(
        project.files.at(-1).id
      );

    }


    updateEverything();

    saveProject();

  }
);


/* =========================
   EXPORT HELPERS
========================= */

function downloadFile(file) {

  const mimeType =
    getMimeType(
      file.name
    );


  const blob =
    new Blob(
      [file.content],
      {
        type:
          mimeType +
          ";charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href =
    url;


  link.download =
    file.name;


  link.style.display =
    "none";


  document.body.appendChild(
    link
  );


  link.click();


  setTimeout(
    () => {

      link.remove();

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}


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


  downloadFile(file);

}


/* =========================
   EXPORT PROJECT
========================= */

function exportProject() {

  if (
    project.files.length === 0
  ) {

    alert(
      "This project has no files to export."
    );

    return;

  }


  const shouldExport =
    confirm(
      `Export ${project.files.length} file(s)?`
    );


  if (!shouldExport) {
    return;
  }


  project.files.forEach(
    (file, index) => {

      setTimeout(
        () => {

          downloadFile(file);

        },
        index * 500
      );

    }
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
.forEach(id => {

  document
    .getElementById(id)
    .addEventListener(
      "click",
      openNewFilePicker
    );

});


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
   START
========================= */

loadProject();


projectNameElement.textContent =
  project.name;


const active =
  getActiveFile();


if (active) {

  editor.value =
    active.content;

}


updateEverything();

saveProject();
