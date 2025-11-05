  const ROWS = 28;
        const COLS = 25;
        const TOTAL_CELLS = ROWS * COLS;

        function createGrid() {
            const paper = document.getElementById('writingPaper');
            paper.innerHTML = '';

            const markers = {
                3: '100',   
                7: '200',   
                11: '300',  
                15: '400',  
                19: '500',  
                23: '600',  
                27: '700'  
            };

            for (let row = 0; row < ROWS; row++) {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'writing-grid';
                
                for (let col = 0; col < COLS; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.id = `cell-${row}-${col}`;
                    
                    if (col === COLS - 1 && markers[row]) {
                        const marker = document.createElement('span');
                        marker.className = 'row-marker';
                        marker.textContent = markers[row];
                        cell.appendChild(marker);
                    }
                    
                    rowDiv.appendChild(cell);
                }
                
                paper.appendChild(rowDiv);
            }
        }

        function fillGrid() {
            const text = document.getElementById('inputText').value;
            clearGrid();

            if (!text.trim()) {
                showWarning('Vui lòng nhập văn bản trước!');
                return;
            }

            let cellIndex = 0;
            let charCount = 0;
            let isStartOfParagraph = true;

            for (let i = 0; i < text.length && cellIndex < TOTAL_CELLS; i++) {
                const char = text[i];
                if (/[.,!?;:~\-\)\]]/.test(char) && text[i + 1] === ' ') {
                    i++; 
                }
                if (char === '\n') {
                    const currentCol = cellIndex % COLS;
                    if (currentCol !== 0) {
                        cellIndex += COLS - currentCol;
                    }
                    isStartOfParagraph = true;
                    continue;
                }
                if (isStartOfParagraph && char.trim() !== '') {
                    cellIndex++; 
                    isStartOfParagraph = false;
                }

                const currentCol = cellIndex % COLS;
                
                if (currentCol === 0 && char === ' ') {
                    continue;
                }
                
                if (currentCol === 0 && /[.,!?;:~\-()"""'']/.test(char)) {
                    if (cellIndex > 0) {
                        const prevRow = Math.floor((cellIndex - 1) / COLS);
                        const prevCol = COLS - 1;
                        const prevCell = document.getElementById(`cell-${prevRow}-${prevCol}`);
                        
                        if (prevCell) {
                            prevCell.textContent += char;
                            prevCell.classList.add('filled');
                            prevCell.classList.add('punctuation');
                            charCount++;
                        }
                    }
                    continue;
                }

                if (/[0-9]/.test(char)) {
                    if (i + 2 < text.length && text[i + 1] === '.' && /[0-9]/.test(text[i + 2])) {
                        const row1 = Math.floor(cellIndex / COLS);
                        const col1 = cellIndex % COLS;
                        const cell1 = document.getElementById(`cell-${row1}-${col1}`);
                        
                        if (cell1) {
                            const marker1 = cell1.querySelector('.row-marker');
                            cell1.textContent = char + '.';
                            cell1.classList.add('filled');
                            if (marker1) {
                                cell1.appendChild(marker1);
                            }
                            cellIndex++;
                            charCount += 2;
                        }
                        
                        i++;
                        
                        i++;
                        const nextChar = text[i];
                        const row2 = Math.floor(cellIndex / COLS);
                        const col2 = cellIndex % COLS;
                        const cell2 = document.getElementById(`cell-${row2}-${col2}`);
                        
                        if (cell2) {
                            const marker2 = cell2.querySelector('.row-marker');
                            cell2.textContent = nextChar;
                            cell2.classList.add('filled');
                            if (marker2) {
                                cell2.appendChild(marker2);
                            }
                            cellIndex++;
                            charCount++;
                        }
                        continue;
                    }
                    
                
                    if (i + 1 < text.length && /[0-9]/.test(text[i + 1])) {
                        const row = Math.floor(cellIndex / COLS);
                        const col = cellIndex % COLS;
                        const cell = document.getElementById(`cell-${row}-${col}`);
                        
                        if (cell) {
                            const marker = cell.querySelector('.row-marker');
                            cell.textContent = char + text[i + 1];
                            cell.classList.add('filled');
                            if (marker) {
                                cell.appendChild(marker);
                            }
                            cellIndex++;
                            charCount += 2;
                        }
                        i++; 
                        continue;
                    }
                }

                const row = Math.floor(cellIndex / COLS);
                const col = cellIndex % COLS;
                const cell = document.getElementById(`cell-${row}-${col}`);

                if (cell) {
                    const marker = cell.querySelector('.row-marker');
                    cell.textContent = char;
                    cell.classList.add('filled');

                    if (char === ' ') {
                        cell.classList.add('space');
                    } else if (/[.,!?;:~\-()"""'']/.test(char)) {
                        cell.classList.add('punctuation');
                    }

                    if (marker) {
                        cell.appendChild(marker);
                    }

                    cellIndex++;
                    charCount++;
                }
            }

            updateStats(charCount, cellIndex);

            if (cellIndex >= TOTAL_CELLS) {
                showWarning('⚠️ Cảnh báo: Văn bản vượt quá số ô cho phép! Một số nội dung không được hiển thị.');
            } else if (cellIndex > 700) {
                showWarning('⚠️ Chú ý: Bạn đã sử dụng hơn 700 ô (giới hạn đề nghị cho TOPIK).');
            } else {
                showInfo('✓ Văn bản đã được điền thành công vào giấy thi!');
            }
        }

        function clearGrid() {
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const cell = document.getElementById(`cell-${row}-${col}`);
                    if (cell) {
                        const marker = cell.querySelector('.row-marker');
                        cell.textContent = '';
                        cell.className = 'grid-cell';
                        if (marker) {
                            cell.appendChild(marker);
                        }
                    }
                }
            }
            updateStats(0, 0);
            document.getElementById('warningMsg').innerHTML = '';
        }

        function resetAll() {
            document.getElementById('inputText').value = '';
            clearGrid();
        }

        function updateStats(chars, cells) {
            document.getElementById('totalChars').textContent = chars;
            document.getElementById('usedCells').textContent = cells;
            document.getElementById('usedLines').textContent = Math.ceil(cells / COLS);
            document.getElementById('remainingCells').textContent = TOTAL_CELLS - cells;
        }

        function showWarning(message) {
            const warningDiv = document.getElementById('warningMsg');
            warningDiv.innerHTML = `<div class="warning">${message}</div>`;
        }

        function showInfo(message) {
            const warningDiv = document.getElementById('warningMsg');
            warningDiv.innerHTML = `<div class="info">${message}</div>`;
        }

        createGrid();
        async function saveAsDocx() {
    const text = document.getElementById('inputText').value.trim();
    if (!text) {
        showWarning('⚠️ Vui lòng nhập văn bản trước khi lưu!');
        return;
    }

    const { Document, Packer, Paragraph, TextRun } = window.docx;
    const paragraphs = text.split('\n').map(line =>
        new Paragraph({
            children: [new TextRun(line)],
        })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bai_viet.docx';
    link.click();

    showInfo('📄 File đã được lưu thành công!');
}
