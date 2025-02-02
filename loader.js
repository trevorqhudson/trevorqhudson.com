async function loadComponent(url, targetId) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
}

async function loadHead() {
    try {
        const response = await fetch('header.html');
        const html = await response.text();
        const temp = document.createElement('div');
        temp.innerHTML = html;
        Array.from(temp.children).forEach(element => {
            document.head.appendChild(element.cloneNode(true));
        });
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

async function loadContent(markdownFile = 'bio.md') {
    try {
        const contentElement = document.getElementById('content-placeholder');
        if (!contentElement) {
            console.error('Content placeholder not found');
            return;
        }
        
        const response = await fetch(`content/${markdownFile}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        const html = marked.parse(markdown);
        contentElement.innerHTML = html;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Get the current page from URL or default to bio
function getCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
        return 'bio.md';
    }
    // Remove leading slash and .html extension
    const page = path.replace(/^\//, '').replace('.html', '');
    return `${page}.md`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadHead();
    await loadComponent('nav.html', 'nav-placeholder');
    await loadContent(getCurrentPage());
});