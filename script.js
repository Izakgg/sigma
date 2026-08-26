// Lista de conceitos de IA
const aiConcepts = [
    { text: 'Machine Learning', icon: '🧠' },
    { text: 'Deep Learning', icon: '🔗' },
    { text: 'Neural Networks', icon: '⚡' },
    { text: 'Natural Language Processing', icon: '💬' },
    { text: 'Computer Vision', icon: '👁️' },
    { text: 'Algoritmos', icon: '📊' },
    { text: 'Big Data', icon: '📈' },
    { text: 'Redes Neurais Convolucionais', icon: '🖼️' },
    { text: 'Processamento de Dados', icon: '⚙️' },
    { text: 'Reconhecimento de Padrões', icon: '🔍' },
    { text: 'Classificação', icon: '🏷️' },
    { text: 'Regressão', icon: '📉' },
    { text: 'Clustering', icon: '🎯' },
    { text: 'Validação Cruzada', icon: '✅' },
    { text: 'Overfitting', icon: '⚠️' },
];

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initializeKeywords();
    setupCanvasDropZone();
});

// Inicializar caixas de palavras na sidebar
function initializeKeywords() {
    const keywordsList = document.getElementById('keywords-list');
    keywordsList.innerHTML = '';

    aiConcepts.forEach((concept, index) => {
        const box = document.createElement('div');
        box.className = 'keyword-box';
        box.draggable = true;
        box.textContent = `${concept.icon} ${concept.text}`;
        box.dataset.concept = concept.text;
        box.dataset.icon = concept.icon;
        box.dataset.inCanvas = 'false';

        // Eventos de drag
        box.addEventListener('dragstart', handleDragStart);
        box.addEventListener('dragend', handleDragEnd);
        box.addEventListener('touchstart', handleTouchStart);
        box.addEventListener('touchmove', handleTouchMove);
        box.addEventListener('touchend', handleTouchEnd);

        keywordsList.appendChild(box);
    });
}

// Setup da zona de drop
function setupCanvasDropZone() {
    const dropZone = document.getElementById('drop-zone');

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);
    dropZone.addEventListener('dragleave', handleDragLeave);
}

// Handlers de Desktop Drag & Drop
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
    }
    draggedElement = null;
    document.getElementById('drop-zone').classList.remove('active');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('active');
}

function handleDragLeave(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const dropZone = document.getElementById('drop-zone');
    dropZone.classList.remove('active');

    if (!draggedElement) return;

    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    addKeywordToCanvas(draggedElement, x, y);
    updatePlaceholder();
}

// Handlers Touch para Mobile
let touchStartX = 0;
let touchStartY = 0;
let touchElement = null;

function handleTouchStart(e) {
    touchElement = this;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(e) {
    if (!touchElement) return;
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!touchElement) return;

    const touch = e.changedTouches[0];
    const dropZone = document.getElementById('drop-zone');
    const rect = dropZone.getBoundingClientRect();

    // Verificar se o elemento foi solto dentro da zona
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        addKeywordToCanvas(touchElement, x, y);
        updatePlaceholder();
    }

    touchElement = null;
}

// Adicionar keyword ao canvas
function addKeywordToCanvas(sourceElement, x, y) {
    const concept = sourceElement.dataset.concept;
    const icon = sourceElement.dataset.icon;

    // Verificar se já existe
    if (document.querySelector(`[data-keyword-id="${concept}"]`)) {
        return;
    }

    const dropZone = document.getElementById('drop-zone');
    const canvasKeyword = document.createElement('div');
    canvasKeyword.className = 'canvas-keyword';
    canvasKeyword.textContent = `${icon} ${concept}`;
    canvasKeyword.draggable = true;
    canvasKeyword.dataset.keywordId = concept;

    // Posicionar
    let posX = Math.max(0, Math.min(x, dropZone.offsetWidth - canvasKeyword.offsetWidth));
    let posY = Math.max(0, Math.min(y, dropZone.offsetHeight - canvasKeyword.offsetHeight));

    canvasKeyword.style.left = posX + 'px';
    canvasKeyword.style.top = posY + 'px';

    // Eventos
    canvasKeyword.addEventListener('dragstart', handleCanvasDragStart);
    canvasKeyword.addEventListener('dragend', handleCanvasDragEnd);
    canvasKeyword.addEventListener('touchstart', handleCanvasTouchStart);
    canvasKeyword.addEventListener('touchmove', handleCanvasTouchMove);
    canvasKeyword.addEventListener('touchend', handleCanvasTouchEnd);

    // Duplo clique para remover
    canvasKeyword.addEventListener('dblclick', () => removeFromCanvas(canvasKeyword, concept));

    dropZone.appendChild(canvasKeyword);
    sourceElement.dataset.inCanvas = 'true';
}

// Handlers para mover items no canvas - Desktop
let canvasDraggedElement = null;
let canvasOffsetX = 0;
let canvasOffsetY = 0;

function handleCanvasDragStart(e) {
    canvasDraggedElement = this;
    const rect = this.getBoundingClientRect();
    canvasOffsetX = e.clientX - rect.left;
    canvasOffsetY = e.clientY - rect.top;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleCanvasDragEnd(e) {
    if (canvasDraggedElement) {
        canvasDraggedElement.classList.remove('dragging');
    }
    canvasDraggedElement = null;
}

// Handlers para mover items no canvas - Touch
let canvasTouchElement = null;
let canvasTouchOffsetX = 0;
let canvasTouchOffsetY = 0;

function handleCanvasTouchStart(e) {
    canvasTouchElement = this;
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();
    canvasTouchOffsetX = touch.clientX - rect.left;
    canvasTouchOffsetY = touch.clientY - rect.top;
    this.classList.add('dragging');
}

function handleCanvasTouchMove(e) {
    if (!canvasTouchElement) return;
    e.preventDefault();

    const touch = e.touches[0];
    const dropZone = document.getElementById('drop-zone');
    const rect = dropZone.getBoundingClientRect();

    let x = touch.clientX - rect.left - canvasTouchOffsetX;
    let y = touch.clientY - rect.top - canvasTouchOffsetY;

    // Limites
    x = Math.max(0, Math.min(x, dropZone.offsetWidth - canvasTouchElement.offsetWidth));
    y = Math.max(0, Math.min(y, dropZone.offsetHeight - canvasTouchElement.offsetHeight));

    canvasTouchElement.style.left = x + 'px';
    canvasTouchElement.style.top = y + 'px';
}

function handleCanvasTouchEnd(e) {
    if (canvasTouchElement) {
        canvasTouchElement.classList.remove('dragging');
    }
    canvasTouchElement = null;
}

// Fazer o canvas aceitar drop para reposicionar items
document.addEventListener('dragover', (e) => {
    if (canvasDraggedElement) {
        const dropZone = document.getElementById('drop-zone');
        const rect = dropZone.getBoundingClientRect();

        let x = e.clientX - rect.left - canvasOffsetX;
        let y = e.clientY - rect.top - canvasOffsetY;

        x = Math.max(0, Math.min(x, dropZone.offsetWidth - canvasDraggedElement.offsetWidth));
        y = Math.max(0, Math.min(y, dropZone.offsetHeight - canvasDraggedElement.offsetHeight));

        canvasDraggedElement.style.left = x + 'px';
        canvasDraggedElement.style.top = y + 'px';
    }
});

// Remover do canvas
function removeFromCanvas(element, concept) {
    element.remove();
    
    const sidebarBox = document.querySelector(`[data-concept="${concept}"]`);
    if (sidebarBox) {
        sidebarBox.dataset.inCanvas = 'false';
    }

    updatePlaceholder();
}

// Atualizar placeholder
function updatePlaceholder() {
    const dropZone = document.getElementById('drop-zone');
    const items = dropZone.querySelectorAll('.canvas-keyword');
    const placeholder = dropZone.querySelector('.placeholder');

    if (items.length === 0) {
        placeholder.classList.remove('hidden');
    } else {
        placeholder.classList.add('hidden');
    }
}

// Resetar layout
function resetLayout() {
    const dropZone = document.getElementById('drop-zone');
    const items = dropZone.querySelectorAll('.canvas-keyword');
    
    items.forEach(item => {
        const concept = item.dataset.keywordId;
        const sidebarBox = document.querySelector(`[data-concept="${concept}"]`);
        if (sidebarBox) {
            sidebarBox.dataset.inCanvas = 'false';
        }
        item.remove();
    });

    updatePlaceholder();
}