/*
  ============================
  CodePad
  Local browser code editor
  ============================
*/


const STORAGE_KEY =
  "codepad-project-v1";


/* ELEMENTS */

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


/*
  PROJECT STATE

  Every file has:

  id
  name
  content
*/

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
    localStorage.getItem(
      STORAGE_KEY
    );


  if (!saved) {

    return;

  }


  try {

    project =
      JSON.parse(saved);

  }
  catch {

    localStorage.removeItem(
      STORAGE_KEY
    );

  }

}


/* ============================
   HELPERS
============================ */

function createId() {

  return (
    Date.now()
      .toString(36) +
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


function getLanguage(filename) {

  const ext =
    getExtension(filename);


  const languages = {

    html:
      "HTML",

    htm:
      "HTML",

    css:
      "CSS",

    js:
      "JavaScript",

    jsx:
      "JavaScript / JSX",

    ts:
      "TypeScript",

    tsx:
      "TypeScript / TSX",

    json:
      "JSON",

    md:
      "Markdown",

    txt:
      "Plain Text",

    py:
      "Python",

    java:
      "Java",

    c:
      "C",

    h:
      "C Header",

    cpp:
      "C++",

    cc:
      "C++",

    cs:
      "C#",

    php:
      "PHP",

    rb:
      "Ruby",

    go:
      "Go",

    rs:
      "Rust",

    sql:
      "SQL",

    xml:
      "XML",

    yml:
      "YAML",

    yaml:
      "YAML",

    sh:
      "Shell",

    bat:
      "Batch",

    ini:
      "Config",

    toml:
      "TOML"

  };


  return (
    languages[ext] ||
    "Plain Text"
  );

}


function getFileIcon(filename) {

  const ext =
    getExtension(filename);


  const icons = {

    html: "🌐",
    htm: "🌐",

    css: "🎨",

    js: "JS",
    jsx: "JS",

    ts: "TS",
    tsx: "TS",

    json: "{}",

    md: "M↓",

    py: "PY",

    java: "☕",

    c: "C",
    h: "H",

    cpp: "C++",

    txt: "TXT"

  };


  return (
    icons[ext] ||
    "•"
  );

}


/* ============================
   RENDER FILE LIST
============================ */

function renderFileList() {

  fileList.innerHTML =
    "";


  for (
    const file of project.files
  ) {

    const item =
      document.createElement("div");


    item.className =
      "file-item";


    if (
      file.id ===
      project.activeFileId
    ) {

      item.classList.add(
        "active"
      );

    }


    const main =
      document.createElement("div");


    main.className =
      "file-main";


    main.innerHTML = `

      <span class="file-icon">
        ${getFileIcon(file.name)}
      </span>

      <span class="file-name">
        ${escapeHtml(file.name)}
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
      document.createElement("button");


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


    item.appendChild(
      main
    );


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


    const tab =
      document.createElement("div");


    tab.className =
      "tab";


    if (
      file.id ===
      project.activeFileId
    ) {

      tab.classList.add(
        "active"
      );

    }


    const name =
      document.createElement("span");


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
      document.createElement("button");


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

    project.openTabs.push(id);

  }


  editor.value =
    file.content;


  updateLineNumbers();

  updateStatus();

  renderFileList();

  renderTabs();

  updateEditorVisibility();

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
      project.openTabs[
        index
      ] ||
      project.openTabs[
        index - 1
      ] ||
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

      editor.value = "";

    }

  }


  updateLineNumbers();

  updateStatus();

  renderTabs();

  renderFileList();

  updateEditorVisibility();

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


  const confirmed =
    confirm(
      `Delete "${file.name}"?`
    );


  if (!confirmed) {

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

    editor.value = "";

    updateLineNumbers();

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


  fileStatus.textContent =
    file.name;


  languageStatus.textContent =
    getLanguage(
      file.name
    );

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


/* TAB KEY */

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


    /*
      Ctrl/Cmd + S
      Export current file
    */

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


    /*
      Ctrl/Cmd + F
      Search
    */

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


editor.addEventListener(
  "scroll",
  () => {

    lineNumbers.scrollTop =
      editor.scrollTop;

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
    () => modalInput.focus(),
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


    if (
      !value
    ) {

      return;

    }


    if (
      modalAction
    ) {

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
   CREATE FILE
============================ */

function createNewFile() {

  openModal(

    "New File",

    "Choose any filename and extension.",

    "index.html",

    "Create",

    filename => {

      const alreadyExists =
        project.files.some(
          file =>
            file.name === filename
        );


      if (
        alreadyExists
      ) {

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


      saveProject();

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
   IMPORT FILES
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


        /*
          Avoid duplicate names
        */

        if (
          project.files.some(
            file =>
              file.name === name
          )
        ) {

          let counter = 2;

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


        const file = {

          id:
            createId(),

          name,

          content

        };


        project.files.push(
          file
        );

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

      const last =
        project.files.at(-1);


      openFile(
        last.id
      );

    }


    renderFileList();

    saveProject();

  }
);


/* ============================
   EXPORT CURRENT FILE
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


  setTimeout(
    () =>
      URL.revokeObjectURL(url),
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


  /*
    Browser-only version:

    Creates a project manifest.
    A later CodePad version can
    add ZIP export.
  */

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
    document.createElement("a");


  link.href =
    url;


  link.download =
    `${project.name
      .replace(
        /[^a-z0-9-_]/gi,
        "-"
      ) || "codepad-project"}.json`;


  document.body.appendChild(
    link
  );


  link.click();


  link.remove();


  setTimeout(
    () =>
      URL.revokeObjectURL(url),
    1000
  );

}


/* ============================
   SEARCH
============================ */

function openSearch() {

  if (
    !getActiveFile()
  ) {

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


  let count = 0;

  let position = 0;


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
    `${count} result${count === 1 ? "" : "s"}`;


  const first =
    content.indexOf(query);


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
  .getElementById("closeSearchButton")
  .addEventListener(
    "click",
    closeSearch
  );


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


/* ============================
   HTML ESCAPING
============================ */

function escapeHtml(text) {

  return text
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
