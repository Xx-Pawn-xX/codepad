/*
  ============================
  CodePad v2
  Dark Edition
  ============================
*/


const STORAGE_KEY =
  "codepad-project-v2";


const fileList =
  document.getElementById("fileList");

const tabs =
  document.getElementById("tabs");

const editor =
  document.getElementById("editor");

const lineNumbers =
  document.getElementById("lineNumbers");

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

const searchPanel =
  document.getElementById("searchPanel");

const searchInput =
  document.getElementById("searchInput");

const searchCount =
  document.getElementById("searchCount");


let project = {

  name:
    "Untitled Project",

  files:
    [],

  activeFileId:
    null,

  openTabs:
    []

};


let modalAction =
  null;


/* ============================
   FILE TYPE COLORS
============================ */

const FILE_TYPES = {

  html: {
    language: "HTML",
    tag: "HTML",
    icon: "</>",
    color: "#f97316"
  },

  htm: {
    language: "HTML",
    tag: "HTML",
    icon: "</>",
    color: "#f97316"
  },

  css: {
    language: "CSS",
    tag: "CSS",
    icon: "{}",
    color: "#3b82f6"
  },

  js: {
    language: "JavaScript",
    tag: "JS",
    icon: "JS",
    color: "#facc15"
  },

  jsx: {
    language: "JavaScript / JSX",
    tag: "JSX",
    icon: "JS",
    color: "#facc15"
  },

  ts: {
    language: "TypeScript",
    tag: "TS",
    icon: "TS",
    color: "#3178c6"
  },

  tsx: {
    language: "TypeScript / TSX",
    tag: "TSX",
    icon: "TS",
    color: "#3178c6"
  },

  py: {
    language: "Python",
    tag: "PY",
    icon: "PY",
    color: "#22c55e"
  },

  java: {
    language: "Java",
    tag: "JAVA",
    icon: "J",
    color: "#fb923c"
  },

  c: {
    language: "C",
    tag: "C",
    icon: "C",
    color: "#06b6d4"
  },

  h: {
    language: "C Header",
    tag: "H",
    icon: "H",
    color: "#06b6d4"
  },

  cpp: {
    language: "C++",
    tag: "C++",
    icon: "C+",
    color: "#3b82f6"
  },

  cc: {
    language: "C++",
    tag: "C++",
    icon: "C+",
    color: "#3b82f6"
  },

  cs: {
    language: "C#",
    tag: "C#",
    icon: "C#",
    color: "#a855f7"
  },

  json: {
    language: "JSON",
    tag: "JSON",
    icon: "{}",
    color: "#a855f7"
  },

  md: {
    language: "Markdown",
    tag: "MD",
    icon: "M↓",
    color: "#ec4899"
  },

  txt: {
    language: "Plain Text",
    tag: "TXT",
    icon: "TXT",
    color: "#a1a1aa"
  },

  xml: {
    language: "XML",
    tag: "XML",
    icon: "</>",
    color: "#f43f5e"
  },

  yaml: {
    language: "YAML",
    tag: "YAML",
    icon: "Y",
    color: "#eab308"
  },

  yml: {
    language: "YAML",
    tag: "YAML",
    icon: "Y",
    color: "#eab308"
  },

  php: {
    language: "PHP",
    tag: "PHP",
    icon: "PHP",
    color: "#818cf8"
  },

  rb: {
    language: "Ruby",
    tag: "RB",
    icon: "RB",
    color: "#ef4444"
  },

  go: {
    language: "Go",
    tag: "GO",
    icon: "GO",
    color: "#22d3ee"
  },

  rs: {
    language: "Rust",
    tag: "RS",
    icon: "RS",
    color: "#f97316"
  },

  sql: {
    language: "SQL",
    tag: "SQL",
    icon: "SQL",
    color: "#38bdf8"
  },

  sh: {
    language: "Shell",
    tag: "SH",
    icon: "$_",
    color: "#22c55e"
  },

  bat: {
    language: "Batch",
    tag: "BAT",
    icon: ">_",
    color: "#a1a1aa"
  },

  ini: {
    language: "Config",
    tag: "INI",
    icon: "⚙",
    color: "#14b8a6"
  },

  toml: {
    language: "TOML",
    tag: "TOML",
    icon: "T",
    color: "#f59e0b"
  }

};


const DEFAULT_FILE_TYPE = {

  language:
    "Plain Text",

  tag:
    "TEXT",

  icon:
    "•",

  color:
    "#a1a1aa"

};


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

  const v2 =
    localStorage.getItem(
      STORAGE_KEY
    );


  const old =
    localStorage.getItem(
      "codepad-project-v1"
    );


  const saved =
    v2 || old;


  if (!saved) {

    return;

  }


  try {

    project =
      JSON.parse(saved);

  }
  catch {

    console.log(
      "Could not load project."
    );

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


  if (
    parts.length < 2
  ) {

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
   DYNAMIC ACCENT
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


    root.style.setProperty(
      "--accent-text",
      "#09090b"
    );

    return;

  }


  const type =
    getFileType(
      file.name
    );


  root.style.setProperty(
    "--accent",
    type.color
  );


  root.style.setProperty(
    "--accent-text",
    "#09090b"
  );

}


/* ============================
   FILE LIST
============================ */

function renderFileList() {

  fileList.innerHTML =
    "";


  for (
    const file of project.files
  ) {

    const type =
      getFileType(
        file.name
      );


    const item =
      document.createElement(
        "div"
      );


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

      item.classList.add(
        "active"
      );

    }


    const main =
      document.createElement(
        "div"
      );


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
      () => {

        openFile(
          file.id
        );

      }
    );


    const deleteButton =
      document.createElement(
        "button"
      );


    deleteButton.className =
      "delete-file";


    deleteButton.textContent =
      "×";


    deleteButton.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        deleteFile(
          file.id
        );

      }
    );


    item.appendChild(main);

    item.appendChild(
      deleteButton
    );


    fileList.appendChild(
      item
    );

  }

}


/* ============================
   TABS
============================ */

function renderTabs() {

  tabs.innerHTML =
    "";


  for (
    const id of project.openTabs
  ) {

    const file =
      project.files.find(
        item =>
          item.id === id
      );


    if (!file) {

      continue;

    }


    const type =
      getFileType(
        file.name
      );


    const tab =
      document.createElement(
        "div"
      );


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

      tab.classList.add(
        "active"
      );

    }


    const name =
      document.createElement(
        "span"
      );


    name.textContent =
      file.name;


    name.addEventListener(
      "click",
      () => {

        openFile(
          file.id
        );

      }
    );


    const close =
      document.createElement(
        "button"
      );


    close.className =
      "tab-close";


    close.textContent =
      "×";


    close.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        closeTab(
          file.id
        );

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
      item =>
        item.id === id
    );


  if (!file) {

    return;

  }


  project.activeFileId =
    id;


  if (
    !project.openTabs.includes(id)
  ) {

    project.openTabs.push(
      id
    );

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


  if (
    index === -1
  ) {

    return;

  }


  project.openTabs.splice(
    index,
    1
  );


  if (
    project.activeFileId === id
  ) {

    const nextId =
      project.openTabs[index] ||
      project.openTabs[index - 1] ||
      null;


    project.activeFileId =
      nextId;


    if (nextId) {

      const file =
        project.files.find(
          item =>
            item.id === nextId
        );


      editor.value =
        file.content;

    }
    else {

      editor.value =
        "";

    }

  }


  updateLineNumbers();

  updateStatus();

  updateAccent();

  renderTabs();

  renderFileList();

  updateEditorVisibility();

  updateCursorStatus();

  saveProject();

}


/* ============================
   DELETE FILE
============================ */

function deleteFile(id) {

  const file =
    project.files.find(
      item =>
        item.id === id
    );


  if (!file) {

    return;

  }


  if (
    !confirm(
      `Delete "${file.name}"?`
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
      project.openTabs[0] ||
      null;

  }


  if (
    project.activeFileId
  ) {

    openFile(
      project.activeFileId
    );

  }
  else {

    editor.value =
      "";

    updateLineNumbers();

    updateStatus();

    updateAccent();

    updateEditorVisibility();

    renderTabs();

    renderFileList();

  }


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


  let numbers =
    "";


  for (
    let i = 1;
    i <= lines;
    i++
  ) {

    numbers +=
      i + "\n";

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
    getFileType(
      file.name
    );


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


  if (hasFile) {

    emptyState.classList.add(
      "hidden"
    );


    editorWrapper.classList.remove(
      "hidden"
    );

  }
  else {

    emptyState.classList.remove(
      "hidden"
    );


    editorWrapper.classList.add(
      "hidden"
    );

  }

}


editor.addEventListener(
  "input",
  () => {

    const file =
      getActiveFile();


    if (!file) {

      return;

    }


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


/* TAB KEY + SHORTCUTS */

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
        editor.value.substring(
          0,
          start
        ) +
        "  " +
        editor.value.substring(
          end
        );


      editor.selectionStart =
        editor.selectionEnd =
          start + 2;


      editor.dispatchEvent(
        new Event("input")
      );

    }


    if (
      (
        event.ctrlKey ||
        event.metaKey
      ) &&
      event.key.toLowerCase() === "s"
    ) {

      event.preventDefault();

      exportCurrentFile();

    }


    if (
      (
        event.ctrlKey ||
        event.metaKey
      ) &&
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

  modalTitle.textContent =
    title;


  modalText.textContent =
    text;


  modalInput.value =
    "";


  modalInput.placeholder =
    placeholder;


  modalConfirm.textContent =
    confirmText;


  modalAction =
    action;


  modalOverlay.classList.remove(
    "hidden"
  );


  setTimeout(
    () => {

      modalInput.focus();

    },
    50
  );

}


function closeModal() {

  modalOverlay.classList.add(
    "hidden"
  );


  modalAction =
    null;

}


modalConfirm.addEventListener(
  "click",
  () => {

    const value =
      modalInput.value.trim();


    if (!value) {

      return;

    }


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


modalInput.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      modalConfirm.click();

    }

  }
);


/* ============================
   NEW FILE
============================ */

function createNewFile() {

  openModal(

    "New File",

    "Choose any filename and extension.",

    "index.html",

    "Create",

    filename => {

      const exists =
        project.files.some(
          file =>
            file.name === filename
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

        name:
          filename,

        content:
          ""

      };


      project.files.push(
        file
      );


      openFile(
        file.id
      );

    }

  );

}


/* ============================
   RENAME PROJECT
============================ */

function renameProject() {

  openModal(

    "Rename Project",

    "Choose a name for this project.",

    project.name,

    "Rename",

    name => {

      project.name =
        name;


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

  fileInput.value =
    "";

  fileInput.click();

}


fileInput.addEventListener(
  "change",
  async () => {

    const files =
      Array.from(
        fileInput.files
      );


    for (
      const imported of files
    ) {

      try {

        const content =
          await imported.text();


        let name =
          imported.name;


        if (
          project.files.some(
            file =>
              file.name === name
          )
        ) {

          let counter =
            2;


          const extension =
            name.includes(".")
              ? "." +
                name.split(".").pop()
              : "";


          const base =
            extension
              ? name.slice(
                  0,
                  -extension.length
                )
              : name;


          while (
            project.files.some(
              file =>
                file.name ===
                `${base}-${counter}${extension}`
            )
          ) {

            counter++;

          }


          name =
            `${base}-${counter}${extension}`;

        }


        project.files.push({

          id:
            createId(),

          name,

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


    if (
      files.length &&
      project.files.length
    ) {

      openFile(
        project.files.at(-1).id
      );

    }


    renderFileList();

    saveProject();

  }
);


/* ============================
   EXPORT FILE
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
        type:
          "text/plain"
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    file.name;


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  setTimeout(
    () => {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}


/* ============================
   EXPORT PROJECT
============================ */

function exportProject() {

  if (
    project.files.length === 0
  ) {

    alert(
      "There are no files to export."
    );

    return;

  }


  const data = {

    project:
      project.name,

    exportedAt:
      new Date()
        .toISOString(),

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
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href =
    url;


  link.download =
    `${
      project.name
        .replace(
          /[^a-z0-9-_]/gi,
          "-"
        ) ||
      "codepad-project"
    }.json`;


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  setTimeout(
    () => {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}


/* ============================
   SEARCH
============================ */

function openSearch() {

  if (!getActiveFile()) {

    return;

  }


  searchPanel.classList.remove(
    "hidden"
  );


  searchInput.focus();

}


function closeSearch() {

  searchPanel.classList.add(
    "hidden"
  );


  searchInput.value =
    "";


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


  const content =
    editor.value;


  let count =
    0;


  let position =
    0;


  while (true) {

    position =
      content.indexOf(
        query,
        position
      );


    if (
      position === -1
    ) {

      break;

    }


    count++;

    position +=
      query.length;

  }


  searchCount.textContent =
    `${count} result${
      count === 1
        ? ""
        : "s"
    }`;


  const first =
    content.indexOf(
      query
    );


  if (
    first !== -1
  ) {

    editor.focus();


    editor.setSelectionRange(
      first,
      first + query.length
    );

  }

}


searchInput.addEventListener(
  "input",
  searchCurrentFile
);


document
  .getElementById(
    "closeSearchButton"
  )
  .addEventListener(
    "click",
    closeSearch
  );


/* ============================
   BUTTONS
============================ */

document
  .getElementById(
    "newFileButton"
  )
  .addEventListener(
    "click",
    createNewFile
  );


document
  .getElementById(
    "addFileButton"
  )
  .addEventListener(
    "click",
    createNewFile
  );


document
  .getElementById(
    "emptyNewFileButton"
  )
  .addEventListener(
    "click",
    createNewFile
  );


document
  .getElementById(
    "importButton"
  )
  .addEventListener(
    "click",
    importFiles
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


document
  .getElementById(
    "renameProjectButton"
  )
  .addEventListener(
    "click",
    renameProject
  );


/* ============================
   HTML ESCAPING
============================ */

function escapeHtml(text) {

  return String(text)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


/* ============================
   INITIALIZE
============================ */

loadProject();


projectNameElement.textContent =
  project.name;


renderFileList();

renderTabs();

updateEditorVisibility();

updateLineNumbers();

updateStatus();

updateCursorStatus();

updateAccent();
