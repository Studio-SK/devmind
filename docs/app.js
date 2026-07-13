(function () {
    const DEFAULT_PATH = "README.md";

    const treeEl = document.getElementById("tree");
    const docEl = document.getElementById("doc");

    const STORAGE_KEY = "devmind-docs-ui-state";

    function loadUIState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { expanded: [], sidebarCollapsed: false };
            const parsed = JSON.parse(raw);
            return {
                expanded: Array.isArray(parsed.expanded) ? parsed.expanded : [],
                sidebarCollapsed: !!parsed.sidebarCollapsed,
            };
        } catch (e) {
            return { expanded: [], sidebarCollapsed: false };
        }
    }

    function saveUIState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            // localStorage unavailable (private mode / quota) — fail silently, non-critical
        }
    }

    function expandAncestors(relPath, expandedSet) {
        const segments = relPath.split("/");
        segments.pop(); // drop the filename itself
        let acc = "";
        for (const seg of segments) {
            acc = acc ? acc + "/" + seg : seg;
            expandedSet.add(acc);
        }
    }

    function buildTree(nodes, container, parentPath, expandedSet) {
        const ul = document.createElement("ul");
        for (const node of nodes) {
            const li = document.createElement("li");
            if (node.type === "dir") {
                const dirPath = parentPath ? parentPath + "/" + node.name : node.name;
                const details = document.createElement("details");
                details.open = expandedSet.has(dirPath);
                details.dataset.path = dirPath;
                const summary = document.createElement("summary");
                summary.textContent = node.name;
                details.appendChild(summary);
                details.addEventListener("toggle", () => {
                    const state = loadUIState();
                    const set = new Set(state.expanded);
                    if (details.open) set.add(dirPath); else set.delete(dirPath);
                    state.expanded = Array.from(set);
                    saveUIState(state);
                });
                buildTree(node.children, details, dirPath, expandedSet);
                li.appendChild(details);
            } else {
                const a = document.createElement("a");
                a.href = "#" + encodeURIComponent(node.path);
                a.textContent = node.name.replace(/\.md$/, "");
                a.dataset.path = node.path;
                a.addEventListener("click", (e) => {
                    e.preventDefault();
                    loadFile(node.path);
                });
                li.appendChild(a);
            }
            ul.appendChild(li);
        }
        container.appendChild(ul);
    }

    function setActiveLink(activePath) {
        const links = treeEl.querySelectorAll("a[data-path]");
        for (const link of links) {
            link.classList.toggle("active", link.dataset.path === activePath);
        }
    }

    function loadFile(relPath) {
        const raw = window.NOTES_DATA.files[relPath];
        if (raw === undefined) {
            docEl.innerHTML = "<p>Note not found: " + relPath + "</p>";
            return;
        }
        docEl.innerHTML = marked.parse(raw);
        setActiveLink(relPath);
        document.title = relPath.split("/").pop().replace(/\.md$/, "") + " — DevMind Notes";
        document.getElementById("content").scrollTo(0, 0);
        if (decodeURIComponent(location.hash.slice(1)) !== relPath) {
            history.replaceState(null, "", "#" + encodeURIComponent(relPath));
        }
    }

    function loadFromHash() {
        const hashPath = decodeURIComponent(location.hash.slice(1));
        loadFile(hashPath || DEFAULT_PATH);
    }

    function setupSidebarToggle(initialCollapsed) {
        const toggleBtn = document.getElementById("sidebar-toggle");
        if (initialCollapsed) {
            document.body.classList.add("sidebar-collapsed");
            toggleBtn.setAttribute("aria-expanded", "false");
        }
        toggleBtn.addEventListener("click", () => {
            const collapsed = document.body.classList.toggle("sidebar-collapsed");
            toggleBtn.setAttribute("aria-expanded", String(!collapsed));
            const state = loadUIState();
            state.sidebarCollapsed = collapsed;
            saveUIState(state);
        });
    }

    function init() {
        const uiState = loadUIState();
        const expandedSet = new Set(uiState.expanded);

        const initialHashPath = decodeURIComponent(location.hash.slice(1)) || DEFAULT_PATH;
        expandAncestors(initialHashPath, expandedSet);
        saveUIState({ expanded: Array.from(expandedSet), sidebarCollapsed: uiState.sidebarCollapsed });

        buildTree(window.NOTES_DATA.tree, treeEl, "", expandedSet);
        setupSidebarToggle(uiState.sidebarCollapsed);
        window.addEventListener("hashchange", loadFromHash);
        loadFromHash();
    }

    init();
})();
