let laranjas = [];
let macas = [];
let laranjasNaCesta = [];
let saldo = 0;
let alturaGrama = 70;
let flores = [];
let nuvens = [];
let borboletas = [];
let timerLaranja = 0;
let timerMaca = 0;
let jogoEncerrado = false;
let vitoria = false;
let botaoReiniciar;

let tempoTotal = 60; // segundos
let tempoRestante = tempoTotal;
let tempoAnterior = 0;

function setup() {
  createCanvas(800, 500);
  textFont('Arial');
  gerarFlores();
  gerarNuvens();
  gerarBorboletas();
  gerarNovaLaranja();

  tempoAnterior = millis();

  botaoReiniciar = createButton('🔁 Tentar novamente');
  botaoReiniciar.position(width / 2 - 60, height / 2 + 80);
  botaoReiniciar.mousePressed(reiniciarJogo);
  botaoReiniciar.hide();
}

function draw() {
  if (jogoEncerrado) {
    background(20, 0, 30);
    fill(255, 60, 60);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("😢 Fim de Jogo!", width / 2, height / 2 - 60);
    fill(255);
    textSize(24);
    text("Você perdeu! Frutas demais ou tempo esgotado!", width / 2, height / 2 - 10);
    text("Tente novamente e clique mais rápido!", width / 2, height / 2 + 30);
    botaoReiniciar.show();
    return;
  }

  if (vitoria) {
    background(30, 100, 50);
    fill(255, 255, 100);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("🎉 Você venceu!", width / 2, height / 2 - 60);
    fill(255);
    textSize(24);
    text("Parabéns, você conquistou R$ " + saldo + "!", width / 2, height / 2 - 10);
    text("Tempo restante: " + tempoRestante + "s", width / 2, height / 2 + 30);
    botaoReiniciar.show();
    return;
  } else {
    botaoReiniciar.hide();
  }

  desenharCeuComNuvens();
  desenharBorboletas();
  desenharGramaComFlores();
  desenharArvore(250);

  if (saldo >= 30) {
    desenharArvore(600);
    if (macas.length === 0 && timerMaca <= 0) {
      gerarNovaMaca();
      timerMaca = int(random(60, 120));
    }
  }

  // Timer
  let agora = millis();
  if (agora - tempoAnterior >= 1000 && !jogoEncerrado && !vitoria) {
    tempoRestante--;
    tempoAnterior = agora;
    if (tempoRestante <= 0) {
      jogoEncerrado = true;
    }
  }

  // Interface
  fill(50);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Clique nas frutas que caem! Cada uma vale R$3 e a sua meta é R$150.", width / 2, 40);

  fill(30);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Cuidado: se acumular mais de 10 frutas de cada tipo, você perde!", 150, 65);

  fill(30);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Saldo: R$ " + saldo, 30, 80);

  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text("⏱ Tempo: " + tempoRestante + "s", width - 30, 20);

  atualizarEExibirFrutas(laranjas, color(255, 140, 0));
  atualizarEExibirFrutas(macas, color(200, 0, 0));

  // Cesta
  let x = width - 200;
  let y = 100;
  fill(160, 120, 60);
  rect(x, y, 60, 40, 8);

  for (let j = 0; j < laranjasNaCesta.length && j < 5; j++) {
    fill(255, 140, 0);
    ellipse(x + 15 + j * 8, y + 25, 10, 10);
  }

  if (laranjasNaCesta.length >= 5) {
    laranjasNaCesta = [];
  }

  // Geração de frutas
  if (timerLaranja <= 0 && laranjas.length < 10) {
    gerarNovaLaranja();
    timerLaranja = int(random(60, 120));
  }

  if (timerMaca > 0) timerMaca--;
  if (timerLaranja > 0) timerLaranja--;

  if (laranjas.length > 10 || macas.length > 10) {
    jogoEncerrado = true;
  }

  if (saldo >= 150) {
    vitoria = true;
  }
}

function mousePressed() {
  if (jogoEncerrado || vitoria) return;

  let todasFrutas = saldo >= 30 ? laranjas.concat(macas) : laranjas;

  for (let i = todasFrutas.length - 1; i >= 0; i--) {
    let f = todasFrutas[i];
    let d = dist(mouseX, mouseY, f.x, f.y);
    if (d < 20) {
      saldo += 3;
      laranjasNaCesta.push({});

      if (f.tipo === "laranja") {
        laranjas.splice(laranjas.indexOf(f), 1);
      } else if (f.tipo === "maca") {
        macas.splice(macas.indexOf(f), 1);
      }
      break;
    }
  }
}

function gerarNovaLaranja() {
  let centroX = 250;
  let centroY = height - alturaGrama - 180;

  let quantidade = int(random(1, 3));
  for (let i = 0; i < quantidade; i++) {
    laranjas.push({
      x: centroX + random(-60, 60),
      y: centroY + random(-30, 30),
      vy: random(0.3, 0.8),
      ay: 0.05,
      tipo: "laranja"
    });
  }
}

function gerarNovaMaca() {
  let centroX = 600;
  let centroY = height - alturaGrama - 180;

  let quantidade = int(random(1, 3));
  for (let i = 0; i < quantidade; i++) {
    macas.push({
      x: centroX + random(-60, 60),
      y: centroY + random(-30, 30),
      vy: random(0.3, 0.9),
      ay: 0.06,
      tipo: "maca"
    });
  }
}

function atualizarEExibirFrutas(lista, cor) {
  for (let i = lista.length - 1; i >= 0; i--) {
    let f = lista[i];
    if (f.y + 15 < height - alturaGrama) {
      f.vy += f.ay;
      f.y += f.vy;
    }

    fill(cor);
    ellipse(f.x, f.y, 30, 30);
    fill(34, 139, 34);
    triangle(f.x - 5, f.y - 10, f.x + 5, f.y - 10, f.x, f.y - 20);
  }
}

function desenharArvore(xBase) {
  let troncoY = height - alturaGrama - 200;

  fill(100, 50, 20);
  rect(xBase - 20, troncoY, 40, 200);

  fill(50, 140, 50);
  ellipse(xBase, troncoY, 200, 160);
  ellipse(xBase - 60, troncoY + 10, 120, 100);
  ellipse(xBase + 60, troncoY + 10, 120, 100);
  ellipse(xBase, troncoY - 50, 150, 100);
}

function desenharGramaComFlores() {
  fill(60, 160, 60);
  rect(0, height - alturaGrama, width, alturaGrama);

  for (let flor of flores) {
    fill(flor.cor);
    ellipse(flor.x, flor.y, 5, 5);
  }
}

function gerarFlores() {
  for (let i = 0; i < 150; i++) {
    flores.push({
      x: random(width),
      y: random(height - alturaGrama + 5, height - 5),
      cor: color(random(200, 255), random(100, 255), random(200, 255))
    });
  }
}

function gerarNuvens() {
  for (let i = 0; i < 5; i++) {
    nuvens.push({
      x: random(100, width - 100),
      y: random(40, 150),
      velocidade: random(0.2, 0.5)
    });
  }
}

function desenharCeuComNuvens() {
  background(135, 206, 235);
  for (let nuvem of nuvens) {
    desenharNuvem(nuvem.x, nuvem.y);
    nuvem.x += nuvem.velocidade;
    if (nuvem.x > width + 60) {
      nuvem.x = -60;
    }
  }
}

function desenharNuvem(x, y) {
  noStroke();
  fill(255, 255, 255, 230);
  ellipse(x, y, 60, 50);
  ellipse(x + 25, y - 10, 50, 40);
  ellipse(x - 25, y - 10, 50, 40);
  ellipse(x + 50, y, 40, 30);
  ellipse(x - 50, y, 40, 30);
  ellipse(x, y + 10, 60, 30);
}

function gerarBorboletas() {
  for (let i = 0; i < 8; i++) {
    borboletas.push({
      x: random(width),
      y: random(200),
      vx: random(0.5, 1),
      vy: random(-0.5, 0.5),
      cor: color(random(200, 255), random(100, 200), random(200, 255))
    });
  }
}

function desenharBorboletas() {
  for (let b of borboletas) {
    fill(b.cor);
    ellipse(b.x, b.y, 10, 8);
    ellipse(b.x - 5, b.y - 3, 10, 10);
    ellipse(b.x + 5, b.y - 3, 10, 10);
    b.x += b.vx;
    b.y += b.vy;

    if (b.x > width) b.x = -10;
    if (b.y < 50 || b.y > height - 100) b.vy *= -1;
  }
}

function reiniciarJogo() {
  laranjas = [];
  macas = [];
  laranjasNaCesta = [];
  saldo = 0;
  timerLaranja = 0;
  timerMaca = 0;
  jogoEncerrado = false;
  vitoria = false;
  tempoRestante = tempoTotal;
  tempoAnterior = millis();
  gerarNovaLaranja();
}
