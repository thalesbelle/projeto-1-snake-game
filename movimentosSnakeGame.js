const botaoIniciar = document.getElementById('botaoIniciar');
const botaoCor = document.getElementById('botaoCor');
const botaoInstru = document.getElementById('botaoInstru');
const cabecalho = document.querySelector('.cabecalho');
const contornoTabuleiro = document.querySelector('.contornoTabuleiro');
const botao = document.querySelectorAll('.botao');
const iconeSom = document.getElementById('iconeSom');
const musicaLobby = document.getElementById("musicaLobby");
const gameOverScreen = document.getElementById('gameOverScreen');
const botaoReiniciar = document.getElementById('botaoReiniciar');

const totalTDs = 240;
const tdsPorLinha = 15;

let direction = 'right';
let gameLoop = null;
let snakeSpeed = 200;
let isSoundOn = true;
let snakeColor = 'yellow';
let score = 0;
let food = null;
let movementStarted = false;
let lobbyMusicStarted = false;

document.body.addEventListener('click', () => {
    if (!lobbyMusicStarted) {
        musicaLobby.volume = 1;
        musicaLobby.play().catch(err => {
            console.log("Erro ao tocar música do lobby:", err);
        });
        lobbyMusicStarted = true;
    }
});

contornoTabuleiro.setAttribute('hidden', 'hidden');
contornoTabuleiro.style.display = 'none';

cabecalho.classList.remove('cabecalhoMudanca');

botao.forEach(b => {
    b.removeAttribute('hidden');
    b.classList.add('contornoFadeIn');
});

const tabela = document.querySelector("#tabuleiro tbody");
tabela.innerHTML = '';

const eatSound = new Audio('Bite sound effect.mp3');
eatSound.volume = 1.0;

document.addEventListener('keydown', (e) => {
    if (!movementStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        movementStarted = true;
        gameLoop = setInterval(moverCobra, snakeSpeed);
        generateFood();
    }

    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

botaoIniciar.addEventListener('click', () => {
    criarGame();
});

iconeSom.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    iconeSom.src = isSoundOn ? './images/altoFalante.png' : './images/iconeSomMutado.png';

    const musicaLobby = document.getElementById("musicaLobby");
    const musicaFundo = document.getElementById("musicaFundo");

    if (!isSoundOn) {
        musicaLobby.volume = 0;
        if (musicaFundo) musicaFundo.volume = 0;
    } else {
        musicaLobby.volume = 1;
        if (musicaFundo) musicaFundo.volume = 1;
    }
});

botaoCor.addEventListener('click', () => {
    if (snakeColor === 'yellow') snakeColor = 'blue';
    else if (snakeColor === 'blue') snakeColor = 'red';
    else snakeColor = 'yellow';
    renderSnake();
});

botaoInstru.addEventListener('click', () => {
    alert('Instruções do Jogo da Cobra:\n- Use as teclas de seta para mover a cobra.\n- Coma a comida (vermelha) para crescer e ganhar pontos.\n- Evite bater nas bordas ou na própria cobra.\n- Botão COR: Alterna a cor da cobra.\n- Ícone de som: Liga/desliga o som.');
});

botaoReiniciar.addEventListener('click', () => {
    gameOverScreen.classList.remove('show');
    reiniciarGame();
});

const botaoFechar = document.getElementById('fecharJogo');

botaoFechar.addEventListener('click', () => {
    clearInterval(gameLoop);
    gameLoop = null;

    const musicaLobby = document.getElementById("musicaLobby");
    if (isSoundOn) {
        musicaLobby.play();
        musicaLobby.volume = 1;
    }
    menuIniciar();
});


let snake = [];

function reiniciarGame() {
    score = 0;
    updateScoreDisplay();
    cabecalho.classList.add('cabecalhoMudanca');
    contornoTabuleiro.classList.add('contornoFadeIn');
    botao.forEach(b => {
        setTimeout(() => {
            b.setAttribute('hidden', 'hidden');
        }, 800);
    });

    setTimeout(() => {
        contornoTabuleiro.removeAttribute('hidden');
        contornoTabuleiro.style.display = 'flex';

        const tabela = document.querySelector("#tabuleiro tbody");
        tabela.innerHTML = ''; 

        for (let i = 1; i <= totalTDs; i++) {
            if ((i - 1) % tdsPorLinha === 0) {
                var linha = document.createElement("tr");
                tabela.appendChild(linha);
            }
            const td = document.createElement("td");
            td.setAttribute("num", i);
            td.classList.add(i % 2 === 0 ? 'dark-purple' : 'light-purple');
            linha.appendChild(td);
        }

        direction = 'right';
        score = 0;
        snakeSpeed = 200;
        snake = [
            { num: 111 },
            { num: 112 },
            { num: 113 },
            { num: 114 }
        ];
        renderSnake();

        if (gameLoop) clearInterval(gameLoop);
        movementStarted = false;
    }, 0);
}

function criarGame() {
    score = 0;
    updateScoreDisplay();
    cabecalho.classList.add('cabecalhoMudanca');
    contornoTabuleiro.classList.add('contornoFadeIn');
    botao.forEach(b => {
        setTimeout(() => {
            b.setAttribute('hidden', 'hidden');
        }, 800);
    });

    setTimeout(() => {
        contornoTabuleiro.removeAttribute('hidden');
        contornoTabuleiro.style.display = 'flex';

        const tabela = document.querySelector("#tabuleiro tbody");
        tabela.innerHTML = ''; 

        for (let i = 1; i <= totalTDs; i++) {
            if ((i - 1) % tdsPorLinha === 0) {
                var linha = document.createElement("tr");
                tabela.appendChild(linha);
            }
            const td = document.createElement("td");
            td.setAttribute("num", i);
            td.classList.add(i % 2 === 0 ? 'dark-purple' : 'light-purple');
            linha.appendChild(td);
        }

        direction = 'right';
        score = 0;
        snakeSpeed = 200;
        snake = [
            { num: 111 },
            { num: 112 },
            { num: 113 },
            { num: 114 }
        ];
        renderSnake();

        if (gameLoop) clearInterval(gameLoop);
        movementStarted = false;
    }, 800);

    document.getElementById('fecharJogo').removeAttribute('hidden');
    document.getElementById('iconeSom').removeAttribute('hidden');
}

function renderSnake() {
    document.querySelectorAll("td").forEach(td => {
        td.classList.remove("cobra", "comida");
        td.style.backgroundColor = '';
    });

    snake.forEach(segmento => {
        const td = document.querySelector(`td[num="${segmento.num}"]`);
        if (td) {
            td.classList.add("cobra");
            td.style.backgroundColor = snakeColor;
        }
    });

    if (food) {
        const td = document.querySelector(`td[num="${food}"]`);
        if (td) {
            td.classList.add("comida");
            td.style.backgroundColor = 'red';
        }
    }
}

function generateFood() {
    let newFood;
    do {
        newFood = Math.floor(Math.random() * totalTDs) + 1;
    } while (snake.some(segment => segment.num === newFood));
    food = newFood;
    renderSnake(); 
}

function moverCobra() {
    let head = snake[snake.length - 1];
    let novoNum;

    switch (direction) {
        case 'right':
            novoNum = head.num + 1;
            if (!estaNaMesmaLinha(head.num, novoNum)) return gameOver();
            break;

        case 'left':
            novoNum = head.num - 1;
            if (!estaNaMesmaLinha(head.num, novoNum)) return gameOver();
            break;

        case 'up':
            novoNum = head.num - tdsPorLinha;
            if (novoNum < 1) return gameOver();
            break;

        case 'down':
            novoNum = head.num + tdsPorLinha;
            if (novoNum > totalTDs) return gameOver();
            break;
    }

    if (snake.some(segment => segment.num === novoNum)) {
        return gameOver();
    }

    snake.push({ num: novoNum });

    if (snake.length === totalTDs) {
        clearInterval(gameLoop);
        musicaLobby.pause();
        alert("🎉 Parabéns! Você preencheu todo o tabuleiro!\n\nObrigado por jogar o Snake Game!");
        menuIniciar();
        return;
    }

    if (novoNum === food) {
        score += 1;
        updateScoreDisplay();

        if (isSoundOn) {
            eatSound.pause();
            eatSound.currentTime = 0;
            eatSound.play();
        }

        generateFood();

        if (score % 50 === 0 && snakeSpeed > 50) {
            clearInterval(gameLoop);
            snakeSpeed -= 10;
            gameLoop = setInterval(moverCobra, snakeSpeed);
        }
    } else {
        snake.shift(); 
    }

    renderSnake();
}

function estaNaMesmaLinha(origem, destino) {
    return Math.floor((origem - 1) / tdsPorLinha) === Math.floor((destino - 1) / tdsPorLinha);
}

function gameOver() {
    clearInterval(gameLoop);

    musicaLobby.play();

    gameOverScreen.classList.add('show');
}

function menuIniciar() {
    contornoTabuleiro.setAttribute('hidden', 'hidden');
    contornoTabuleiro.style.display = 'none';

    cabecalho.classList.remove('cabecalhoMudanca');
    document.getElementById('fecharJogo').setAttribute('hidden', 'hidden');
    document.getElementById('iconeSom').setAttribute('hidden', 'hidden');

    botao.forEach(b => {
        b.removeAttribute('hidden');
        b.classList.add('contornoFadeIn');
    });

    const tabela = document.querySelector("#tabuleiro tbody");
    tabela.innerHTML = '';

    snake = [];
    food = null;
    score = 0;
    direction = 'right';
    snakeSpeed = 200;
    gameLoop = null;
    movementStarted = false;

    gameOverScreen.classList.remove('show');
}

function updateScoreDisplay() {
    const spanPontuacao = document.getElementById('pontuacao');
    if (spanPontuacao) {
        spanPontuacao.textContent = `Pontuação: ${score}`;
    }
}

window.onload = () => {
    musicaLobby.play();
};