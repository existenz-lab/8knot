const io = require('socket.io')(3000);
let players = [];
let gameState = {
    questions: [],
    answers: [],
    currentQuestion: '',
    currentAnswer: ''
};

io.on('connection', (socket) => {
    players.push(socket.id);
    if (players.length === 8) {
        startGame();
    }

    socket.on('submitResponse', (data) => {
        gameState.answers.push(data.answer);
        gameState.questions.push(data.question);
        gameState.currentQuestion = data.question;
        io.emit('updateGameState', gameState);

        if (players.indexOf(socket.id) === 7) {
            endGame();
        }
    });

    socket.on('disconnect', () => {
        players = players.filter(player => player !== socket.id);
    });
});

function startGame() {
    gameState.currentQuestion = 'Первый вопрос';
    io.emit('updateGameState', gameState);
}

function endGame() {
    const finalDialog = gameState.questions.map((q, i) => `Вопрос: ${q}\nОтвет: ${gameState.answers[i]}`).join('\n\n');
    io.emit('gameOver', finalDialog);
}
