(function () {
    const DEFAULT_PATH = "README.md";

    const treeEl = document.getElementById("tree");
    const docEl = document.getElementById("doc");

    function buildTree(nodes, container) {
        const ul = document.createElement("ul");
        for (const node of nodes) {
            const li = document.createElement("li");
            if (node.type === "dir") {
                const details = document.createElement("details");
                details.open = false;
                const summary = document.createElement("summary");
                summary.textContent = node.name;
                details.appendChild(summary);
                buildTree(node.children, details);
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

    function setupSidebarToggle() {
        const toggleBtn = document.getElementById("sidebar-toggle");
        toggleBtn.addEventListener("click", () => {
            const collapsed = document.body.classList.toggle("sidebar-collapsed");
            toggleBtn.setAttribute("aria-expanded", String(!collapsed));
        });
    }

    buildTree(window.NOTES_DATA.tree, treeEl);
    setupSidebarToggle();
    window.addEventListener("hashchange", loadFromHash);
    loadFromHash();
})();
