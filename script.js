// Toda a página
const html = document.querySelector('html');
// Cor de Fundo
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
// Imagem ao lado do título
const banner = document.querySelector('.app__image');
// Título ao lado da imagem
const titulo = document.querySelector('.app__title');
// Botões seleção
const botoes = document.querySelectorAll('.app__card-button');
// Botão música de foco
const musicaFocoInput = document.querySelector('#alternar-musica');
// Música de foco
const musica = new Audio('/sons/luna-rise-part-one.mp3'); // Métodp usado para carregar arquivo no meio do projeto: readFile() (não recomendado porque pode demorar para carregar)
musica.loop = true;
// Som de play
const iniciarSom = new Audio('/sons/play.wav');
// Som de pause
const pausarSom = new Audio('/sons/pause.mp3');
// Som de fim
const fimSom = new Audio('/sons/beep.mp3');
// Botão para iniciar contagem
const startPauseBt = document.querySelector('#start-pause');
// Botão para iniciar e pausar contagem
const iniciarOuPausarBt = document.querySelector('#start-pause span');
// Imagem para iniciar e pausar contagem
const imagemPausarBt = document.querySelector('#start-pause img');
// Campo do temporizador
const tempoNaTela = document.querySelector('#timer');


let tempoDecorridoEmSegundo = 1500;
let intervaloId = null;

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundo = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundo = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundo = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto){
        contexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundo <= 0) {
        fimSom.play();
        alert('Tempo finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundo -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        pausarSom.play();
        zerar();
        return;
    }
    iniciarSom.play();
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = "Pausar";
    imagemPausarBt.setAttribute('src', '/imagens/pause.png');
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = "Começar";
    imagemPausarBt.setAttribute('src', '/imagens/play_arrow.png')
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundo * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
