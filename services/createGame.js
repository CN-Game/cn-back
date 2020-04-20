
createGame = (words) => {

    // res.setHeader('Access-Control-Allow-Origin', '*');
    var wordsList = [],
        length = words.length,
        index = 0

    while (index < 25) {
        var word = words[Math.trunc(Math.random() * (length - 0) + 0)];

        if (wordsList.indexOf(word) === -1) {
            wordsList.push(word);
            index++
        }
    }

    const cardNumber = 7;

    const gridLimit = 25;

    let redToWrite = cardNumber;
    let blueToWrite = cardNumber;
    let blackToWrite = 1;

    let wordIndex = 0;

    const colorsMap = {black: '#333', red: '#EB5757', blue: '#2F80ED', neutral: '#F2C94C'};

    const grid = []; // { value: Word, color: Blue, Red, Black}

    _fillGrid = () => {
        grid.forEach((caseItem, index) => {
            if (caseItem.color === colorsMap.neutral) {
                let r = Math.random();
                if (r < 0.20 && redToWrite > 0) {
                    grid[index].color = colorsMap.red;
                    grid[index].team = 'red';
                    redToWrite--;
                } else if (r < 0.4 && blueToWrite > 0) {
                    grid[index].color = colorsMap.blue;
                    grid[index].team = 'blue';
                    blueToWrite--;
                } else if (r < 0.6 && blackToWrite > 0) {
                    grid[index].color = colorsMap.black;
                    grid[index].team = 'black';
                    blackToWrite--;
                }
            }
        })
    }

    fillGrid = () => { // to fill grid with color if there are too few blue or red
        while (redToWrite > 0 || blueToWrite > 0 || blackToWrite > 0) {
            _fillGrid();
        }
    }

    _writeCase = (word, color, team = '') => {
        const caseItem = {color: color, word: word, team: team};
        grid.push(caseItem);
    }

    writeCase = () => {
        const word = wordsList[wordIndex];
        wordIndex++;

        let r = Math.random();
        if (r < 0.20 && redToWrite > 0) {
            _writeCase(word, colorsMap.red, 'red');
            redToWrite--;
        } else if (r < 0.4 && blueToWrite > 0) {
            _writeCase(word, colorsMap.blue, 'blue');
            blueToWrite--;
        } else if (r < 0.6 && blackToWrite > 0) {
            _writeCase(word, colorsMap.black, 'black');
            blackToWrite--;
        } else {
            _writeCase(word, colorsMap.neutral);
        }
    }

    mainProcess = () => {
        for (let i = 0; i < gridLimit; i++) {
            writeCase();
        }

        fillGrid();
    }

    mainProcess();

    return grid

    // var game = new db.models.Game({
    //     grid: grid
    // })
    //
    // db.models.Game.find({}, null, {sort: {_id: -1}, limit: 1}, async function (err, doc) {
    //     if (err) return handleError(err)
    //
    //     // console.log(doc.length)
    //     // console.log(typeof doc)
    //
    //     if (doc.length) {
    //         game.token = doc[0].token + 1
    //     } else {
    //         game.token = 1
    //     }
    //
    //     await game.save().catch(err => {
    //         console.error(err);
    //     });
    //
    //     res.redirect('/game/' + game.token + '/admin');
    // });
}

module.exports = createGame
