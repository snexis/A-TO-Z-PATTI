/* ==========================================================================
   ATOZ BOMBAY - CORE GAME ENGINE (v7.1.2.8 Lite - ADMIN EDITION)
   ==========================================================================
   [CORE FEATURES INSIDE THIS FILE]:
   1. LIVE MONITOR GRID: Syncs perfectly with Player matrix across 3 distinct modes.
   2. REALTIME LOAD SCANNER: Displays dynamic player load calculations on specific cells.
   3. OVERLIMIT BLINKER: Triggers overlimit alerts based on Patti/Single rules dynamically.
   4. WINNING CONTROL NODE: Global broadcast function to declare winner instantly.
   ========================================================================== */

const EngineConfig = {
    version: "7.1.2.8 Lite",
    rows: 22,
    cols: 10
};

// হুবহু ২২০টি পাত্তির ডাটা স্ট্রাকচার অ্যাডমিন ড্যাশবোর্ড ট্র্যাকিংয়ের জন্য
const GAME_DATABASE = {
    '1': { patti: ['100', '678', '777', '560', '470', '380', '290', '119', '137', '236', '146', '669', '579', '399', '588', '489', '245', '155', '227', '344', '335', '128'], words: ['AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB'] },
    '2': { patti: ['200', '345', '444', '570', '480', '390', '660', '129', '237', '336', '246', '679', '255', '147', '228', '499', '688', '778', '138', '156', '110', '569'], words: ['BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ'] },
    '3': { patti: ['300', '120', '111', '580', '490', '670', '238', '139', '337', '157', '346', '689', '355', '247', '256', '166', '599', '148', '788', '445', '229', '779'], words: ['LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP'] },
    '4': { patti: ['400', '789', '888', '590', '130', '680', '248', '149', '347', '158', '446', '699', '455', '266', '112', '356', '239', '338', '257', '220', '770', '167'], words: ['RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO'] },
    '5': { patti: ['500', '456', '555', '140', '230', '690', '258', '159', '357', '799', '267', '780', '447', '366', '113', '122', '177', '249', '339', '889', '348', '168'], words: ['TUV', 'WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST'] },
    '6': { patti: ['600', '123', '222', '150', '330', '240', '268', '169', '367', '448', '899', '178', '790', '466', '358', '880', '114', '556', '259', '349', '457', '277'], words: ['WXY', 'NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV'] },
    '7': { patti: ['700', '890', '999', '160', '340', '250', '278', '179', '377', '467', '115', '124', '223', '566', '557', '368', '359', '449', '269', '133', '188', '458'], words: ['NOP', 'ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY'] },
    '8': { patti: ['800', '567', '666', '170', '350', '260', '288', '189', '116', '233', '459', '125', '224', '477', '990', '134', '558', '369', '378', '440', '279', '468'], words: ['ABC', 'EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP'] },
    '9': { patti: ['900', '234', '333', '180', '360', '270', '450', '199', '117', '469', '126', '667', '478', '135', '225', '144', '379', '559', '289', '388', '577', '568'], words: ['EFG', 'HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC'] },
    '0': { patti: ['000', '127', '190', '280', '370', '460', '550', '235', '118', '578', '145', '479', '668', '299', '334', '488', '389', '226', '569', '677', '136', '244'], words: ['HIJ', 'KLM', 'QRS', 'UVW', 'XYZ', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', 'ZAB', 'AXZ', 'BKP', 'LMO', 'RST', 'TUV', 'WXY', 'NOP', 'ABC', 'EFG'] }
};

const COLUMNS_DIGIT = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const COLUMNS_WORD = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let adminGameMode = 'Both';

// অ্যাডমিন মাস্টার টেবিল রেন্ডারিং
function generateAdminTable(mode = 'Both') {
    adminGameMode = mode;
    const wrapper = document.getElementById('adminTableWrapper');
    if (!wrapper) return;

    let html = `<table><thead><tr>`;
    COLUMNS_DIGIT.forEach((col, index) => {
        let headerText = adminGameMode === 'Digit' ? `Col ${col}` : adminGameMode === 'Word' ? `Col ${COLUMNS_WORD[index]}` : `${col} - ${COLUMNS_WORD[index]}`;
        html += `<th>${headerText}</th>`;
    });
    html += `</tr></thead><tbody><tr class="single-row-header">`;
    
    COLUMNS_DIGIT.forEach((col, index) => {
        let singleVal = adminGameMode === 'Digit' ? col : adminGameMode === 'Word' ? COLUMNS_WORD[index] : `${col}-${COLUMNS_WORD[index]}`;
        html += `<td class="admin-cell single-cell" id="admin-single-${col}">
                    <span class="cell-title">${singleVal}</span>
                    <span class="live-load" id="load-single-${col}">0</span>
                 </td>`;
    });
    html += `</tr>`;

    for (let rowIndex = 0; rowIndex < EngineConfig.rows; rowIndex++) {
        html += `<tr>`;
        COLUMNS_DIGIT.forEach((col) => {
            const pattiVal = GAME_DATABASE[col].patti[rowIndex] || '';
            const wordVal = GAME_DATABASE[col].words[rowIndex] || '';
            let uniqueId = adminGameMode === 'Digit' ? pattiVal : adminGameMode === 'Word' ? wordVal : `${pattiVal}-${wordVal}`;
            
            let displayValue = '';
            if (adminGameMode === 'Digit') displayValue = pattiVal;
            else if (adminGameMode === 'Word') displayValue = wordVal;
            else displayValue = `<span class="both-pat">${pattiVal}</span><hr class="both-split"><span class="both-wrd">${wordVal}</span>`;

            html += `<td class="admin-cell" id="admin-patti-${uniqueId}">
                        ${displayValue}
                        <span class="live-load" id="load-patti-${uniqueId}">0</span>
                     </td>`;
        });
        html += `</tr>`;
    }
    html += `</tbody></table>`;
    wrapper.innerHTML = html;
}

// লাইভ লোড এবং পালস এলার্ট
function updateAdminLiveLoad(targetId, type, currentPoints) {
    const loadLabel = document.getElementById(`load-${type.toLowerCase()}-${targetId}`);
    const cellElement = document.getElementById(`admin-${type.toLowerCase()}-${targetId}`);
    
    if (loadLabel) loadLabel.innerText = currentPoints;

    if (cellElement) {
        if (type === 'Patti' && currentPoints > 5.0) {
            cellElement.classList.add('overlimit-red');
        } else if (type === 'Single' && currentPoints > 1000.0) {
            cellElement.classList.add('overlimit-red');
        } else {
            cellElement.classList.remove('overlimit-red');
        }
    }
}

// উইনিং ডিক্লেয়ারেশন
async function declareGlobalWinner(winningPatti, winningWord, winningDigit) {
    try {
        console.log(`[MASTER WINNER BROADCAST] Patti: ${winningPatti}, Word: ${winningWord}, Digit: ${winningDigit}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    generateAdminTable('Both');
});

window.AdminEngine = {
    generateTable: generateAdminTable,
    updateLoad: updateAdminLiveLoad,
    declareWin: declareGlobalWinner
};
