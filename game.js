$(document).ready(function() {
    const socket = io();

    let currentPlayerId = null;
    let gameState = {
        questions: [],
        answers: [],
        currentQuestion: '',
        currentAnswer: ''
    };

    socket.on('connect', function() {
        console.log('Connected to server');
        currentPlayerId = socket.id;
    });

    socket.on('updateGameState', function(state) {
        gameState = state;
        updateGameUI();
    });

    socket.on('gameOver', function(finalDialog) {
        alert('Игра окончена!');
        window.location.href = 'results.html?dialog=' + encodeURIComponent(finalDialog);
    });

    function updateGameUI() {
        const gameArea = $('#gameArea');
        gameArea.empty();

        if (gameState.currentQuestion) {
            gameArea.append(`<div class="form-group">
                                <label for="answer">Вопрос:</label>
                                <input type="text" class="form-control" id="question" value="${gameState.currentQuestion}" readonly>
                            </div>`);
        }

        gameArea.append(`<div class="form-group">
                            <label for="answer">Ответ:</label>
                            <input type="text" class="form-control" id="answer">
                        </div>
                        <div class="form-group">
                            <label for="myQuestion">Мой вопрос:</label>
                            <input type="text" class="form-control" id="myQuestion">
                        </div>
                        <button type="button" class="btn btn-primary" onclick="submitResponse()">Отправить</button>`);
    }

    window.submitResponse = function() {
        const answer = $('#answer').val();
        const myQuestion = $('#myQuestion').val();
        socket.emit('submitResponse', { answer: answer, question: myQuestion });
    };
});
