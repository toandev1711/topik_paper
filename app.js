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
                showWarning('경고: 글이 허용된 칸 수를 초과했습니다! 일부 내용이 표시되지 않았습니다.');
            } else if (cellIndex > 700) {
                showWarning('주의: 이미 700칸 이상을 사용했습니다.');
            } else {
                showInfo('글이 시험지에 성공적으로 입력되었습니다');
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
      async function saveAsPDF() {
    const paper = document.getElementById('writingPaper');
    if (!paper.querySelector('.filled')) {
        window.alert(' PDF로 저장하기 전에 먼저 글을 입력하세요!');
        return;
    }

    const fileName = prompt('PDF 파일 이름을 입력하세요 (확장자 제외):', '쓰기_연습');
    if (!fileName) {
        showInfo('PDF 저장이 취소되었습니다.');
        return;
    }

    showInfo('PDF 파일을 생성 중입니다. 잠시만 기다려 주세요...');
    const tempContainer = document.createElement('div');
    tempContainer.style.background = '#ffffff';
    tempContainer.style.padding = '12px';
    tempContainer.style.display = 'inline-block'; 
    const titleEl = document.createElement('div');
    titleEl.textContent = `작성글: ${fileName}`;
    titleEl.style.textAlign = 'center';
    titleEl.style.fontWeight = '700';
    titleEl.style.fontSize = '16px';
    titleEl.style.marginBottom = '8px';
    titleEl.style.fontFamily = 'Nanum Gothic, "Noto Sans KR", "Malgun Gothic", sans-serif';
    const paperClone = paper.cloneNode(true);
    paperClone.style.transformOrigin = 'top left';

    tempContainer.appendChild(titleEl);
    tempContainer.appendChild(paperClone);
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '50%';
    tempContainer.style.paddingRight = '30px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
    });
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth * 0.82;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const marginX = (pdfWidth - imgWidth) / 2;
    const startY = 20;

    pdf.addImage(imgData, 'PNG', marginX, startY, imgWidth, imgHeight);

    pdf.save(`${fileName}.pdf`);

    showInfo(`"${fileName}.pdf" 파일이 성공적으로 저장되었습니다!`);
}

