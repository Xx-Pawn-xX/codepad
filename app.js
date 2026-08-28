const STORAGE_KEY = "codepad-own-editor-v1";


/* DOM */

const fileList = document.getElementById("fileList");
const tabs = document.getElementById("tabs");

const editor = document.getElementById("editor");
const highlighting = document.getElementById("highlighting");
const highlightedCode = document.getElementById("highlightedCode");

const editorWrapper = document.getElementById("editorWrapper");
const suggestionsBox = document.getElementById("suggestions");

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


/* FILE TYPES */

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
    content: `console.log("Hello World!");`
  },

  md: {
    label: "Markdown",
    extension: "md",
    color: "#f97316",
    icon: "MD",
    defaultName: "README",
    content: `# My Project

Made with CodePad.`
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


/* AUTOCOMPLETE WORDS */

const SUGGESTIONS = {

  html: [
    "<html>", "<head>", "<body>", "<div>",
    "<span>", "<h1>", "<h2>", "<p>",
    "<button>", "<input>", "<img>",
    "<a>", "<script>", "<style>",
    "<section>", "<main>", "<header>",
    "<footer>", "<meta>", "<link>"
  ],

  css: [
    "display", "position", "background",
    "background-color", "color", "margin",
    "padding", "width", "height",
    "border", "border-radius", "font-size",
    "font-weight", "flex", "grid",
    "justify-content", "align-items",
    "transition", "transform", "opacity"
  ],

  js: [
    "console", "console.log",
    "const", "let", "var",
    "function", "return", "if",
    "else", "for", "while",
    "class", "new", "async",
    "await", "fetch", "document",
    "window", "addEventListener",
    "querySelector", "getElementById",
    "localStorage", "JSON",
    "Math", "Array", "Object"
  ],

  python: [
    "print", "def", "return",
    "if", "else", "elif",
    "for", "while", "import",
    "from", "class", "True",
    "False", "None", "range",
    "len", "list", "dict"
  ]

};


let project = {
  name: "Untitled Project",
  files: [],
  activeFileId: null,
  openTabs: []
};

let selectedType = null;
let selectedSuggestion = 0;


/* HELPERS */

function createId() {
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2);
}

function getExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1
    ? parts.pop().toLowerCase()
    : "";
}

function getFileType(filename) {
  return FILE_TYPES[getExtension(filename)] ||
    FALLBACK_TYPE;
}

function getActiveFile() {
  return project.files.find(
    file => file.id === project.activeFileId
  );
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}


/* PROJECT */

function createStarterProject() {

  const types = [
    "html",
    "css",
    "js",
    "md",
    "py",
    "json",
    "yaml"
  ];

  project.files = types.map(key => {

    const type = FILE_TYPES[key];

    return {
      id: createId(),
      name:
        type.defaultName +
        "." +
        type.extension,
      content: type.content
    };

  });

  project.activeFileId =
    project.files[0].id;

  project.openTabs = [
    project.files[0].id
  ];
}


function saveProject() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(project)
  );
}


function loadProject() {

  const saved =
    localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    createStarterProject();
    saveProject();
    return;
  }

  try {

    project = JSON.parse(saved);

    if (!project.files?.length) {
      createStarterProject();
    }

  } catch {

    createStarterProject();

  }
}


/* SYNTAX HIGHLIGHTING */

function highlightCode(code, filename) {

  const extension = getExtension(filename);

  let html = escapeHtml(code);

  if (extension === "html") {

    html = html
      .replace(
        /(&lt;!--[\s\S]*?--&gt;)/g,
        `<span class="token-comment">$1</span>`
      )
      .replace(
        /(&lt;\/?[a-zA-Z0-9-]+)/g,
        `<span class="token-tag">$1</span>`
      )
      .replace(
        /([a-zA-Z-]+)(=)/g,
        `<span class="token-attribute">$1</span>$2`
      )
      .replace(
        /("[^"]*"|'[^']*')/g,
        `<span class="token-string">$1</span>`
      );

  }

  else if (
    extension === "js" ||
    extension === "ts"
  ) {

    html = html
      .replace(
        /(\/\/.*)/g,
        `<span class="token-comment">$1</span>`
      )
      .replace(
        /(["'`])(?:\\.|(?!\1)[^\\])*\1/g,
        `<span class="token-string">$&</span>`
      )
      .replace(
        /\b(const|let|var|function|return|if|else|for|while|class|new|async|await|import|from|export|true|false|null|undefined)\b/g,
        `<span class="token-keyword">$1</span>`
      )
      .replace(
        /\b(\d+)\b/g,
        `<span class="token-number">$1</span>`
      );

  }

  else if (extension === "css") {

    html = html
      .replace(
        /(\/\*[\s\S]*?\*\/)/g,
        `<span class="token-comment">$1</span>`
      )
      .replace(
        /([a-zA-Z-]+)(:)/g,
        `<span class="token-property">$1</span>$2`
      )
      .replace(
        /("[^"]*"|'[^']*')/g,
        `<span class="token-string">$1</span>`
      )
      .replace(
        /(\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+)/g,
        `<span class="token-selector">$1</span>`
      );

  }

  else if (extension === "py") {

    html = html
      .replace(
        /(#.*)/g,
        `<span class="token-comment">$1</span>`
      )
      .replace(
        /(["'])(?:\\.|(?!\1)[^\\])*\1/g,
        `<span class="token-string">$&</span>`
      )
      .replace(
        /\b(def|return|if|else|elif|for|while|import|from|class|True|False|None|in)\b/g,
        `<span class="token-keyword">$1</span>`
      );

  }

  else if (extension === "json") {

    html = html
      .replace(
        /"([^"]+)"(?=\s*:)/g,
        `<span class="token-property">"$1"</span>`
      )
      .replace(
        /"([^"]*)"/g,
        `<span class="token-string">"$1"</span>`
      )
      .replace(
        /\b(true|false|null)\b/g,
        `<span class="token-keyword">$1</span>`
      )
      .replace(
        /\b\d+\b/g,
        `<span class="token-number">$&</span>`
      );
  }

  return html + "\n";
}


function updateHighlighting() {

  const file = getActiveFile();

  if (!file) {
    highlightedCode.innerHTML = "";
    return;
  }

  highlightedCode.innerHTML =
    highlightCode(
      editor.value,
      file.name
    );
}


/* EDITOR */

function loadActiveFile() {

  const file = getActiveFile();

  if (!file) {
    editor.value = "";
    return;
  }

  editor.value = file.content;

  updateHighlighting();

  editor.scrollTop = 0;
  editor.scrollLeft = 0;

  updateStatus();
}


editor.addEventListener("input", () => {

  const file = getActiveFile();

  if (!file) return;

  file.content = editor.value;

  updateHighlighting();
  updateCursor();

  saveProject();

  showSuggestions();
});


editor.addEventListener("scroll", () => {

  highlighting.scrollTop =
    editor.scrollTop;

  highlighting.scrollLeft =
    editor.scrollLeft;
});


editor.addEventListener("click", () => {
  updateCursor();
  showSuggestions();
});


editor.addEventListener("keyup", event => {

  if (
    ["ArrowUp", "ArrowDown", "Enter", "Escape"]
      .includes(event.key)
  ) return;

  updateCursor();
  showSuggestions();
});


/* AUTO BRACKETS */

editor.addEventListener("keydown", event => {

  if (
    !suggestionsBox.classList.contains("hidden")
  ) {

    const buttons =
      [...suggestionsBox.children];

    if (event.key === "ArrowDown") {

      event.preventDefault();

      selectedSuggestion =
        Math.min(
          selectedSuggestion + 1,
          buttons.length - 1
        );

      updateSuggestionSelection();

      return;
    }

    if (event.key === "ArrowUp") {

      event.preventDefault();

      selectedSuggestion =
        Math.max(
          selectedSuggestion - 1,
          0
        );

      updateSuggestionSelection();

      return;
    }

    if (
      event.key === "Enter" ||
      event.key === "Tab"
    ) {

      event.preventDefault();

      const button =
        buttons[selectedSuggestion];

      if (button) {
        insertSuggestion(
          button.dataset.value
        );
      }

      return;
    }

    if (event.key === "Escape") {
      hideSuggestions();
      return;
    }
  }


  const pairs = {
    "(": ")",
    "[": "]",
    "{": "}",
    '"': '"',
    "'": "'",
    "`": "`"
  };


  if (pairs[event.key]) {

    event.preventDefault();

    const start =
      editor.selectionStart;

    const end =
      editor.selectionEnd;

    const selected =
      editor.value.slice(start, end);

    const opening =
      event.key;

    const closing =
      pairs[event.key];

    editor.setRangeText(
      opening +
      selected +
      closing,
      start,
      end,
      "end"
    );

    if (!selected) {

      editor.selectionStart =
        start + 1;

      editor.selectionEnd =
        start + 1;
    }

    editor.dispatchEvent(
      new Event("input")
    );

    return;
  }


  if (event.key === "Tab") {

    event.preventDefault();

    const start =
      editor.selectionStart;

    editor.setRangeText(
      "  ",
      start,
      editor.selectionEnd,
      "end"
    );

    editor.dispatchEvent(
      new Event("input")
    );
  }

});


/* CURSOR */

function updateCursor() {

  const before =
    editor.value.slice(
      0,
      editor.selectionStart
    );

  const lines =
    before.split("\n");

  cursorStatus.textContent =
    `Ln ${lines.length}, Col ${lines.at(-1).length + 1}`;
}


/* AUTOCOMPLETE */

function getSuggestionLanguage() {

  const ext =
    getExtension(
      getActiveFile()?.name || ""
    );

  if (ext === "html") return "html";
  if (ext === "css") return "css";
  if (ext === "js" || ext === "ts") return "js";
  if (ext === "py") return "python";

  return null;
}


function getCurrentWord() {

  const before =
    editor.value.slice(
      0,
      editor.selectionStart
    );

  const match =
    before.match(/[a-zA-Z0-9_.<>/-]+$/);

  return match ? match[0] : "";
}


function showSuggestions() {

  const language =
    getSuggestionLanguage();

  if (!language) {
    hideSuggestions();
    return;
  }

  const word =
    getCurrentWord();

  if (word.length < 2) {
    hideSuggestions();
    return;
  }

  const options =
    SUGGESTIONS[language]
      .filter(item =>
        item
          .toLowerCase()
          .startsWith(
            word.toLowerCase()
          ) &&
        item.toLowerCase() !==
          word.toLowerCase()
      )
      .slice(0, 8);

  if (!options.length) {
    hideSuggestions();
    return;
  }

  selectedSuggestion = 0;

  suggestionsBox.innerHTML = "";

  options.forEach((item, index) => {

    const button =
      document.createElement("button");

    button.className = "suggestion";

    if (index === 0) {
      button.classList.add("active");
    }

    button.dataset.value = item;

    button.innerHTML = `
      <span>${item}</span>
      <span class="suggestion-type">
        ${language}
      </span>
    `;

    button.addEventListener(
      "mousedown",
      event => {

        event.preventDefault();

        insertSuggestion(item);

      }
    );

    suggestionsBox.appendChild(button);

  });


  const lineHeight = 22;

  const before =
    editor.value.slice(
      0,
      editor.selectionStart
    );

  const lines =
    before.split("\n");

  const line =
    lines.length - 1;

  suggestionsBox.style.top =
    Math.min(
      editorWrapper.clientHeight - 230,
      16 + (line + 1) * lineHeight -
      editor.scrollTop
    ) + "px";

  suggestionsBox.style.left =
    "18px";

  suggestionsBox.classList.remove("hidden");
}


function updateSuggestionSelection() {

  [...suggestionsBox.children]
    .forEach((button, index) => {

      button.classList.toggle(
        "active",
        index === selectedSuggestion
      );

    });
}


function hideSuggestions() {

  suggestionsBox.classList.add("hidden");

  suggestionsBox.innerHTML = "";
}


function insertSuggestion(value) {

  const word =
    getCurrentWord();

  const end =
    editor.selectionStart;

  const start =
    end - word.length;

  editor.setRangeText(
    value,
    start,
    end,
    "end"
  );

  editor.focus();

  editor.dispatchEvent(
    new Event("input")
  );

  hideSuggestions();
}


/* FILE LIST */

function renderFileList() {

  fileList.innerHTML = "";

  project.files.forEach(file => {

    const type =
      getFileType(file.name);

    const item =
      document.createElement("div");

    item.className = "file-item";

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

    const open =
      document.createElement("button");

    open.className = "file-open";

    open.innerHTML = `
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

    open.onclick = () =>
      openFile(file.id);

    const del =
      document.createElement("button");

    del.className = "delete-file";

    del.textContent = "×";

    del.onclick = event => {

      event.stopPropagation();

      deleteFile(file.id);

    };

    item.append(open, del);

    fileList.appendChild(item);

  });

}


/* TABS */

function renderTabs() {

  tabs.innerHTML = "";

  project.openTabs.forEach(id => {

    const file =
      project.files.find(
        f => f.id === id
      );

    if (!file) return;

    const type =
      getFileType(file.name);

    const tab =
      document.createElement("div");

    tab.className = "tab";

    if (
      id === project.activeFileId
    ) {
      tab.classList.add("active");
    }

    tab.style.setProperty(
      "--file-color",
      type.color
    );

    const name =
      document.createElement("button");

    name.className = "tab-name";
    name.textContent = file.name;

    name.onclick = () =>
      openFile(id);

    const close =
      document.createElement("button");

    close.className = "tab-close";
    close.textContent = "×";

    close.onclick = () =>
      closeTab(id);

    tab.append(name, close);

    tabs.appendChild(tab);

  });

}


/* FILE ACTIONS */

function openFile(id) {

  project.activeFileId = id;

  if (
    !project.openTabs.includes(id)
  ) {
    project.openTabs.push(id);
  }

  loadActiveFile();
  updateEverything();
  saveProject();

  editor.focus();
}


function closeTab(id) {

  project.openTabs =
    project.openTabs.filter(
      tab => tab !== id
    );

  if (
    project.activeFileId === id
  ) {

    project.activeFileId =
      project.openTabs[0] ||
      project.files[0]?.id ||
      null;

  }

  loadActiveFile();
  updateEverything();
  saveProject();
}


function deleteFile(id) {

  const file =
    project.files.find(
      f => f.id === id
    );

  if (!file) return;

  if (
    !confirm(
      `Delete ${file.name}?`
    )
  ) return;

  project.files =
    project.files.filter(
      f => f.id !== id
    );

  project.openTabs =
    project.openTabs.filter(
      tab => tab !== id
    );

  if (
    project.activeFileId === id
  ) {
    project.activeFileId =
      project.files[0]?.id || null;
  }

  loadActiveFile();
  updateEverything();
  saveProject();
}


/* STATUS */

function updateStatus() {

  const file = getActiveFile();

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

  document.documentElement
    .style.setProperty(
      "--accent",
      type.color
    );
}


function updateVisibility() {

  const hasFile =
    !!getActiveFile();

  editorWrapper.classList.toggle(
    "hidden",
    !hasFile
  );

  emptyState.classList.toggle(
    "hidden",
    hasFile
  );
}


function updateEverything() {

  renderFileList();
  renderTabs();
  updateStatus();
  updateVisibility();

}


/* NEW FILE */

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
    .querySelector(".file-type-picker")
    ?.remove();

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
        <span class="choice-icon">
          ${type.icon}
        </span>

        <span class="choice-name">
          ${type.label}
        </span>

        <span class="choice-extension">
          .${type.extension}
        </span>
      `;

      button.onclick = () =>
        chooseFileType(key);

      picker.appendChild(button);

    });

  modalText.after(picker);

  modalOverlay.classList.remove("hidden");
}


function chooseFileType(key) {

  selectedType = FILE_TYPES[key];

  document
    .querySelector(".file-type-picker")
    ?.remove();

  modalTitle.textContent =
    `New ${selectedType.label} File`;

  modalText.textContent =
    `Enter a filename for your .${selectedType.extension} file.`;

  modalInput.style.display =
    "block";

  modalConfirm.style.display =
    "inline-flex";

  modalInput.value =
    selectedType.defaultName;

  setTimeout(() => {
    modalInput.focus();
    modalInput.select();
  }, 50);
}


function createSelectedFile() {

  if (!selectedType) return;

  let name =
    modalInput.value.trim();

  if (!name) return;

  if (
    !name.toLowerCase().endsWith(
      "." + selectedType.extension
    )
  ) {
    name +=
      "." + selectedType.extension;
  }

  const exists =
    project.files.some(
      file =>
        file.name.toLowerCase() ===
        name.toLowerCase()
    );

  if (exists) {
    alert("That file already exists.");
    return;
  }

  const file = {
    id: createId(),
    name,
    content: selectedType.content
  };

  project.files.push(file);

  project.activeFileId = file.id;

  project.openTabs.push(file.id);

  closeModal();

  loadActiveFile();
  updateEverything();
  saveProject();

  editor.focus();
}


function closeModal() {

  document
    .querySelector(".file-type-picker")
    ?.remove();

  modalOverlay.classList.add("hidden");

  modalInput.style.display =
    "block";

  modalConfirm.style.display =
    "inline-flex";

  selectedType = null;
}


modalConfirm.onclick =
  createSelectedFile;

modalCancel.onclick =
  closeModal;

modalInput.onkeydown =
  event => {

    if (event.key === "Enter") {
      createSelectedFile();
    }

  };


/* IMPORT */

function openImport() {
  fileInput.value = "";
  fileInput.click();
}

fileInput.onchange =
  async () => {

    const files =
      [...fileInput.files];

    for (const imported of files) {

      const content =
        await imported.text();

      const exists =
        project.files.some(
          file =>
            file.name.toLowerCase() ===
            imported.name.toLowerCase()
        );

      if (!exists) {

        project.files.push({
          id: createId(),
          name: imported.name,
          content
        });

      }
    }

    const last =
      project.files.at(-1);

    if (last) {

      project.activeFileId =
        last.id;

      if (
        !project.openTabs.includes(
          last.id
        )
      ) {
        project.openTabs.push(last.id);
      }
    }

    loadActiveFile();
    updateEverything();
    saveProject();
  };


/* EXPORT */

function exportCurrentFile() {

  const file =
    getActiveFile();

  if (!file) return;

  const blob =
    new Blob(
      [file.content],
      { type: "text/plain" }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = file.name;

  link.click();

  URL.revokeObjectURL(url);
}


function exportProject() {

  const data = {
    name: project.name,
    files: project.files
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
    `${project.name}.json`;

  link.click();

  URL.revokeObjectURL(url);
}


/* BUTTONS */

[
  "newFileButton",
  "addFileButton",
  "emptyNewFileButton"
].forEach(id => {

  document
    .getElementById(id)
    .onclick =
      openNewFilePicker;

});


document
  .getElementById("importButton")
  .onclick =
    openImport;

document
  .getElementById("importSidebarButton")
  .onclick =
    openImport;

document
  .getElementById("exportButton")
  .onclick =
    exportCurrentFile;

document
  .getElementById("exportProjectButton")
  .onclick =
    exportProject;


document
  .getElementById("renameProjectButton")
  .onclick =
    () => {

      const name =
        prompt(
          "Project name:",
          project.name
        );

      if (name?.trim()) {

        project.name =
          name.trim();

        projectNameElement.textContent =
          project.name;

        saveProject();

      }

    };


/* START */

loadProject();

projectNameElement.textContent =
  project.name;

loadActiveFile();

updateEverything();

saveProject();
