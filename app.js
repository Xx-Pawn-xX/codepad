/*
  ============================
  CodePad v3
  Starter Workspace Edition
  ============================
*/

const STORAGE_KEY = "codepad-project-v3";

const fileList = document.getElementById("fileList");
const tabs = document.getElementById("tabs");
const editor = document.getElementById("editor");
const lineNumbers = document.getElementById("lineNumbers");
const editorWrapper = document.getElementById("editorWrapper");
const emptyState = document.getElementById("emptyState");
const projectNameElement = document.getElementById("projectName");
const fileStatus = document.getElementById("fileStatus");
const languageStatus = document.getElementById("languageStatus");
const cursorStatus = document.getElementById("cursorStatus");
const fileInput = document.getElementById("fileInput");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalInput = document.getElementById("modalInput");
const modalConfirm = document.getElementById("modalConfirm");
const modalCancel = document.getElementById("modalCancel");

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchCount = document.getElementById("searchCount");


/* ============================
   FILE TYPES
============================ */

const FILE_TYPES = {

  html: {
    language: "HTML",
    tag: "HTML",
    icon: "</>",
    color: "#ef4444",
    defaultName: "index",
    starter: `<!DOCTYPE html>
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
    language: "CSS",
    tag: "CSS",
    icon: "{}",
    color: "#3b82f6",
    defaultName: "style",
    starter: `* {
  box-sizing: border-box;
}

body {
  margin: 0;
}`
  },

  js: {
    language: "JavaScript",
    tag: "JS",
    icon: "JS",
    color: "#facc15",
    defaultName: "app",
    starter: `console.log("Hello from CodePad!");`
  },

  py: {
    language: "Python",
    tag: "PY",
    icon: "PY",
    color: "#22c55e",
    defaultName: "main",
    starter: `print("Hello from CodePad!")`
  },

  md: {
    language: "Markdown",
    tag: "README",
    icon: "MD",
    color: "#f97316",
    defaultName: "README",
    starter: `# My Project

Made with CodePad.

## About

Write your project description here.
`
  },

  json: {
    language: "JSON",
    tag: "JSON",
    icon: "{}",
    color: "#a855f7",
    defaultName: "data",
    starter: `{
  "name": "My Project"
}`
  },

  yaml: {
    language: "YAML",
    tag: "YAML",
    icon: "Y",
    color: "#ec4899",
    defaultName: "config",
    starter: `name: My Project`
  },

  java: {
    language: "Java",
    tag: "JAVA",
    icon: "J",
    color: "#fb7185",
    defaultName: "Main",
    starter: `public class Main {

  public static void main(String[] args) {

    System.out.println("Hello World");

  }

}`
  },

  cpp: {
    language: "C++",
    tag: "C++",
    icon: "C+",
    color: "#06b6d4",
    defaultName: "main",
    starter: `#include <iostream>

int main() {

  std::cout << "Hello World";

  return 0;

}`
  },

  c: {
    language: "C",
    tag: "C",
    icon: "C",
    color: "#14b8a6",
    defaultName: "main",
    starter: `#include <stdio.h>

int main() {

  printf("Hello World");

  return 0;

}`
  },

  cs: {
    language: "C#",
    tag: "C#",
    icon: "C#",
    color: "#8b5cf6",
    defaultName: "Program",
    starter: `Console.WriteLine("Hello World!");`
  },

  ts: {
    language: "TypeScript",
    tag: "TS",
    icon: "TS",
    color: "#2563eb",
    defaultName: "app",
    starter: `console.log("Hello from TypeScript!");`
  },

  php: {
    language: "PHP",
    tag: "PHP",
    icon: "PHP",
    color: "#818cf8",
    defaultName: "index",
    starter: `<?php

echo "Hello World";

?>`
  },

  sql: {
    language: "SQL",
    tag: "SQL",
    icon: "SQL",
    color: "#38bdf8",
    defaultName: "database",
    starter: `SELECT * FROM table_name;`
  },

  xml: {
    language: "XML",
    tag: "XML",
    icon: "</>",
    color: "#f43f5e",
    defaultName: "data",
    starter: `<?xml version="1.0"?>

<root>

</root>`
  },

  txt: {
    language: "Plain Text",
    tag: "TXT",
    icon: "TXT",
    color: "#a1a1aa",
    defaultName: "notes",
    starter: ``
  }

};


const DEFAULT_FILE_TYPE = {

  language: "Plain Text",
  tag: "TEXT",
  icon: "•",
  color: "#a1a1aa"

};


/* ============================
   PROJECT
============================ */

let project = {

  name: "My Project",

  files: [],

  activeFileId: null,

  openTabs: []

};


let modalAction = null;


/* ============================
   STARTER FILES
============================ */

function createStarterProject() {

  const starterFiles = [

    {
      extension: "html",
      name: "index.html"
    },

    {
      extension: "css",
      name: "style.css"
    },

    {
      extension: "js",
      name: "app.js"
    },

    {
      extension: "md",
      name: "README.md"
    },

    {
      extension: "py",
      name: "main.py"
    },

    {
      extension: "json",
      name: "data.json"
    },

    {
      extension: "yaml",
      name: "config.yaml"
    }

  ];


  project.files = starterFiles.map(item => {

    const type = FILE_TYPES[item.extension];

    return {

      id: createId(),

      name: item.name,

      content: type.starter

    };

  });


  project.activeFileId =
    project.files[0].id;


  project.openTabs = [

    project.files[0].id

  ];

}


/* ============================
   LOAD / SAVE
============================ */

function saveProject() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(project)
  );

}


function loadProject() {

  const saved =

    localStorage.getItem(STORAGE_KEY) ||

    localStorage.getItem("codepad-project-v2") ||

    localStorage.getItem("codepad-project-v1");


  if (!saved) {

    createStarterProject();

    return;

  }


  try {

    project = JSON.parse(saved);

  }

  catch {

    createStarterProject();

  }

}


/* ============================
   HELPERS
============================ */

function createId() {

  return (

    Date.now().toString(36) +

    Math.random()
      .toString(36)
      .slice(2)

  );

}


function getActiveFile() {

  return project.files.find(

    file =>

      file.id ===
      project.activeFileId

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

    DEFAULT_FILE_TYPE

  );

}


/* ============================
   ACCENT
============================ */

function updateAccent() {

  const file =
    getActiveFile();


  const root =
    document.documentElement;


  if (!file) {

    root.style.setProperty(
      "--accent",
      "#ffffff"
    );

    return;

  }


  const type =
    getFileType(file.name);


  root.style.setProperty(
    "--accent",
    type.color
  );

}


/* ============================
   FILE LIST
============================ */

function renderFileList() {

  fileList.innerHTML = "";


  for (const file of project.files) {

    const type =
      getFileType(file.name);


    const item =
      document.createElement("div");


    item.className =
      "file-item";


    item.style.setProperty(
      "--file-color",
      type.color
    );


    if (

      file.id ===
      project.activeFileId

    ) {

      item.classList.add("active");

    }


    const main =
      document.createElement("div");


    main.className =
      "file-main";


    main.innerHTML = `

      <span class="file-icon">
        ${escapeHtml(type.icon)}
      </span>

      <span class="file-name">
        ${escapeHtml(file.name)}
      </span>

      <span class="file-tag">
        ${escapeHtml(type.tag)}
      </span>

    `;


    main.addEventListener(
      "click",
      () => openFile(file.id)
    );


    const deleteButton =
      document.createElement("button");


    deleteButton.className =
      "delete-file";


    deleteButton.textContent = "×";


    deleteButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        deleteFile(file.id);

      }
    );


    item.appendChild(main);

    item.appendChild(deleteButton);

    fileList.appendChild(item);

  }

}


/* ============================
   TABS
============================ */

function renderTabs() {

  tabs.innerHTML = "";


  for (const id of project.openTabs) {

    const file =
      project.files.find(

        item => item.id === id

      );


    if (!file) continue;


    const type =
      getFileType(file.name);


    const tab =
      document.createElement("div");


    tab.className = "tab";


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
      document.createElement("span");


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


    close.textContent = "×";


    close.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        closeTab(file.id);

      }
    );


    tab.appendChild(name);

    tab.appendChild(close);

    tabs.appendChild(tab);

  }

}


/* ============================
   OPEN FILE
============================ */

function openFile(id) {

  const file =
    project.files.find(

      item => item.id === id

    );


  if (!file) return;


  project.activeFileId = id;


  if (

    !project.openTabs.includes(id)

  ) {

    project.openTabs.push(id);

  }


  editor.value =
    file.content;


  updateLineNumbers();

  updateStatus();

  updateAccent();

  renderFileList();

  renderTabs();

  updateEditorVisibility();

  updateCursorStatus();

  saveProject();

}


/* ============================
   CLOSE TAB
============================ */

function closeTab(id) {

  const index =
    project.openTabs.indexOf(id);


  if (index === -1) return;


  project.openTabs.splice(
    index,
    1
  );


  if (

    project.activeFileId === id

  ) {

    project.activeFileId =

      project.openTabs[index] ||

      project.openTabs[index - 1] ||

      null;


    const nextFile =
      getActiveFile();


    editor.value =
      nextFile
        ? nextFile.content
        : "";

  }


  updateLineNumbers();

  updateStatus();

  updateAccent();

  renderTabs();

  renderFileList();

  updateEditorVisibility();

  saveProject();

}


/* ============================
   DELETE
============================ */

function deleteFile(id) {

  const file =
    project.files.find(

      item => item.id === id

    );


  if (!file) return;


  if (

    !confirm(
      `Delete "${file.name}"?`
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


  updateLineNumbers();

  updateStatus();

  updateAccent();

  renderTabs();

  renderFileList();

  updateEditorVisibility();

  saveProject();

}


/* ============================
   EDITOR
============================ */

function updateLineNumbers() {

  const lines =
    editor.value
      .split("\n")
      .length;


  let numbers = "";


  for (

    let i = 1;

    i <= lines;

    i++

  ) {

    numbers += i + "\n";

  }


  lineNumbers.textContent =
    numbers;

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
    type.language;

}


function updateCursorStatus() {

  const beforeCursor =
    editor.value.slice(

      0,

      editor.selectionStart

    );


  const lines =
    beforeCursor.split("\n");


  const line =
    lines.length;


  const column =

    lines[
      lines.length - 1
    ].length + 1;


  cursorStatus.textContent =
    `Ln ${line}, Col ${column}`;

}


function updateEditorVisibility() {

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


editor.addEventListener(
  "input",
  () => {

    const file =
      getActiveFile();


    if (!file) return;


    file.content =
      editor.value;


    updateLineNumbers();

    updateCursorStatus();

    saveProject();

  }
);


editor.addEventListener(
  "click",
  updateCursorStatus
);


editor.addEventListener(
  "keyup",
  updateCursorStatus
);


editor.addEventListener(
  "scroll",
  () => {

    lineNumbers.scrollTop =
      editor.scrollTop;

  }
);


/* ============================
   KEYBOARD
============================ */

editor.addEventListener(
  "keydown",
  event => {

    if (

      event.key === "Tab"

    ) {

      event.preventDefault();


      const start =
        editor.selectionStart;


      const end =
        editor.selectionEnd;


      editor.value =

        editor.value.substring(0, start) +

        "  " +

        editor.value.substring(end);


      editor.selectionStart =

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


    if (

      (event.ctrlKey || event.metaKey) &&

      event.key.toLowerCase() === "f"

    ) {

      event.preventDefault();

      openSearch();

    }

  }
);


/* ============================
   MODAL
============================ */

function openModal(
  title,
  text,
  placeholder,
  confirmText,
  action
) {

  modalTitle.textContent = title;

  modalText.textContent = text;

  modalInput.value = "";

  modalInput.placeholder =
    placeholder;

  modalConfirm.textContent =
    confirmText;

  modalAction = action;

  modalOverlay.classList.remove(
    "hidden"
  );


  setTimeout(() => {

    modalInput.focus();

  }, 50);

}


function closeModal() {

  modalOverlay.classList.add(
    "hidden"
  );

  modalAction = null;

}


modalConfirm.addEventListener(
  "click",
  () => {

    const value =
      modalInput.value.trim();


    if (!value) return;


    if (modalAction) {

      modalAction(value);

    }


    closeModal();

  }
);


modalCancel.addEventListener(
  "click",
  closeModal
);


/* ============================
   NEW FILE TYPE PICKER
============================ */

function createNewFile() {

  const choices = Object.keys(FILE_TYPES)
    .map(extension => {

      const type =
        FILE_TYPES[extension];


      return `
        <button
          class="file-type-choice"
          data-extension="${extension}"
          style="--choice-color:${type.color}"
        >
          <span class="choice-icon">
            ${escapeHtml(type.icon)}
          </span>

          <span>
            ${escapeHtml(type.language)}
          </span>

          <span class="choice-extension">
            .${extension}
          </span>
        </button>
      `;

    })
    .join("");


  modalTitle.textContent =
    "New File";


  modalText.textContent =
    "Choose what kind of file you want to create.";


  modalInput.style.display =
    "none";


  modalConfirm.style.display =
    "none";


  const oldPicker =
    document.getElementById(
      "fileTypePicker"
    );


  if (oldPicker) {

    oldPicker.remove();

  }


  const picker =
    document.createElement("div");


  picker.id =
    "fileTypePicker";


  picker.className =
    "file-type-picker";


  picker.innerHTML =
    choices;


  modalText.after(picker);


  modalOverlay.classList.remove(
    "hidden"
  );


  picker
    .querySelectorAll(
      ".file-type-choice"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const extension =
            button.dataset.extension;


          chooseFileName(
            extension
          );

        }
      );

    });

}


function chooseFileName(extension) {

  const picker =
    document.getElementById(
      "fileTypePicker"
    );


  if (picker) {

    picker.remove();

  }


  const type =
    FILE_TYPES[extension];


  modalTitle.textContent =
    `New ${type.language} File`;


  modalText.textContent =
    `Choose a filename for your .${extension} file.`;


  modalInput.style.display =
    "block";


  modalInput.value =
    type.defaultName;


  modalConfirm.style.display =
    "inline-block";


  modalConfirm.textContent =
    "Create";


  modalAction =
    baseName => {

      let filename =
        baseName;


      if (

        !filename
          .toLowerCase()
          .endsWith(
            "." + extension
          )

      ) {

        filename +=
          "." + extension;

      }


      const exists =
        project.files.some(

          file =>
            file.name === filename

        );


      if (exists) {

        alert(
          "That file already exists."
        );

        return;

      }


      const file = {

        id: createId(),

        name: filename,

        content: type.starter

      };


      project.files.push(file);

      openFile(file.id);

    };


  setTimeout(() => {

    modalInput.focus();

    modalInput.select();

  }, 50);

}


/* ============================
   PROJECT NAME
============================ */

function renameProject() {

  openModal(

    "Rename Project",

    "Choose a name for this project.",

    project.name,

    "Rename",

    name => {

      project.name = name;

      projectNameElement.textContent =
        name;

      saveProject();

    }

  );

}


/* ============================
   IMPORT
============================ */

function importFiles() {

  fileInput.value = "";

  fileInput.click();

}


fileInput.addEventListener(
  "change",
  async () => {

    const files =
      Array.from(fileInput.files);


    for (const imported of files) {

      try {

        const content =
          await imported.text();


        project.files.push({

          id: createId(),

          name: imported.name,

          content

        });

      }

      catch {

        console.log(
          "Could not import:",
          imported.name
        );

      }

    }


    if (files.length) {

      openFile(
        project.files.at(-1).id
      );

    }


    renderFileList();

    saveProject();

  }
);


/* ============================
   EXPORT
============================ */

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

      [file.content],

      {
        type: "text/plain"
      }

    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    file.name;


  document.body.appendChild(link);

  link.click();

  link.remove();


  URL.revokeObjectURL(url);

}


function exportProject() {

  const data = {

    project: project.name,

    exportedAt:
      new Date().toISOString(),

    files: project.files.map(
      file => ({

        name: file.name,

        content: file.content

      })
    )

  };


  const blob =
    new Blob(

      [
        JSON.stringify(
          data,
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
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "codepad-project.json";


  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);

}


/* ============================
   SEARCH
============================ */

function openSearch() {

  if (!getActiveFile()) return;


  searchPanel.classList.remove(
    "hidden"
  );


  searchInput.focus();

}


function closeSearch() {

  searchPanel.classList.add(
    "hidden"
  );


  searchInput.value = "";


  searchCount.textContent =
    "0 results";

}


function searchCurrentFile() {

  const query =
    searchInput.value;


  if (!query) {

    searchCount.textContent =
      "0 results";

    return;

  }


  let count = 0;

  let position = 0;


  while (true) {

    position =
      editor.value.indexOf(
        query,
        position
      );


    if (position === -1) {

      break;

    }


    count++;

    position += query.length;

  }


  searchCount.textContent =
    `${count} result${
      count === 1 ? "" : "s"
    }`;

}


/* ============================
   BUTTONS
============================ */

document
  .getElementById("newFileButton")
  .addEventListener(
    "click",
    createNewFile
  );


document
  .getElementById("addFileButton")
  .addEventListener(
    "click",
    createNewFile
  );


document
  .getElementById("emptyNewFileButton")
  .addEventListener(
    "click",
    createNewFile
  );


document
  .getElementById("importButton")
  .addEventListener(
    "click",
    importFiles
  );


document
  .getElementById("exportButton")
  .addEventListener(
    "click",
    exportCurrentFile
  );


document
  .getElementById("exportProjectButton")
  .addEventListener(
    "click",
    exportProject
  );


document
  .getElementById("renameProjectButton")
  .addEventListener(
    "click",
    renameProject
  );


document
  .getElementById("closeSearchButton")
  .addEventListener(
    "click",
    closeSearch
  );


/* ============================
   ESCAPE HTML
============================ */

function escapeHtml(text) {

  return String(text)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* ============================
   INITIALIZE
============================ */

loadProject();

projectNameElement.textContent =
  project.name;


const active =
  getActiveFile();


if (active) {

  editor.value =
    active.content;

}


renderFileList();

renderTabs();

updateEditorVisibility();

updateLineNumbers();

updateStatus();

updateCursorStatus();

updateAccent();

saveProject();
