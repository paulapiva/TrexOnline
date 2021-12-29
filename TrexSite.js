var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;
var rand, nuvem, imagemdanuvem, grupoNuvens;
var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, grupoObstaculos;
var pontuacao=0;
var reiniciar, restarImg, fimJogo, gameOver;
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

function preload(){
  trex_correndo = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_colidiu = loadImage("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOver = loadImage("finalJogo.PNG");
  
  somPulo = loadSound("mario-jump.mp3");
  somCheck = loadSound("mario-powerup.mp3");
  somMorte = loadSound("mario-death.mp3");
  
}

function setup() {

  createCanvas(windowWidth, 200)
  
  //criar um sprite do trex
  trex = createSprite(width/20,height-100,30,50);
  trex.addAnimation("running", trex_correndo); 
  trex.addAnimation("collided" , trex_colidiu)
  trex.scale = 0.5;
  
  //criar um sprite do solo
  solo = createSprite(200,height-10,width,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
  //creating invisible ground
  soloinvisivel = createSprite(100, height-2,width,20);
  soloinvisivel.visible = false;
    
  //criar fim do jogo
  fimJogo= createSprite(width/2,90);
  fimJogo.addImage(gameOver);
  fimJogo.scale = 0.3;
  
  //criar reiniciar
  reiniciar = createSprite(width/2,height/2+50);
  reiniciar.addImage(restartImg);
  reiniciar.scale = 0.5;
  
  //deixar imagens de fim invisiveis
  fimJogo.visible = false;
  reiniciar.visible = false;

  //Creando grupos
  grupoNuvens = new Group();
  grupoObstaculos = new Group();
  
  trex.debug = false
  //trex.setCollider("circle",0,0,40);
  trex.setCollider("rectangle", 60,0,100,250,90);
  //setCollider(type, xOffset, yOffset, width/radius, height, rotationOffset)
  
}


function draw() {
  //definir cor de fundo
  background("white");
  
  //Inseir texto pontução na tela
  text("Pontuação: "+ pontuacao, width-150,15);
  
  //impedir o trex de cair 
  trex.collide(soloinvisivel);
  
  //Separar os estados dos jogos
  //Estado do Jogo = jogar
  if(estadoJogo === JOGAR){
    
    solo.velocityX = -(4+3*pontuacao/100);
    
    //mostrar pontução na tela
    fill("white");
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    
    //som do checkpoint 
    if(pontuacao >0 && pontuacao %100 === 0){
      somCheck.play();
    }
    
    // pular quando a tecla espaço é acionada
    if(touches.length > 0 || keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -10;
      somPulo.play();//som do salto
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.8
  
    //movimentaçao solo
    if (solo.x < 0){
      solo.x = solo.width;
      solo.x = solo.width /2;
      
    }
    
    //chamada de funções
    gerarNuvens();
    gerarObstaculos();
    
    //mudar o estado do jogo quando toca obstaculos
    if(grupoObstaculos.isTouching(trex)){
      estadoJogo = ENCERRAR
      trex.velocityY  = 0;
      somMorte.play();//som da morte
    }
    
  //Estado do Jogo = encerrar
  }else if (estadoJogo === ENCERRAR){
    
    //parar velocidade do chão
    solo.velocityX = 0;
    trex.velocityX = 0;
    
    //deixar imagens de fim visiveis
    fimJogo.visible = true;
    reiniciar.visible = true;
    
    //altera a animação do Trex
    trex.changeAnimation("collided", trex_colidiu);
    
    //Não deixar os obstáculos sumirem quando colidir
    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    
    //Velocidade pára quando colide
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    
    //Resetar o jogo
    if(mousePressedOver(reiniciar)){
      console.log("reiniciar o jogo")
      reset();
    }
  }
  
  drawSprites();
}

//Funções do jogo

//Reiniciar o jogo
function reset(){
  estadoJogo = JOGAR;
  fimJogo.visible = false;
  reiniciar.visible = false;
  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
  trex.changeAnimation("running", trex_correndo);
  pontuacao=0;
}

//Criar nuvens
function gerarNuvens(){
  if(frameCount % 60 === 0) {
    //cria nuvem aleatoriamente com escala e velocidade
    nuvem = createSprite(width-50,100,40,10);
    nuvem.addImage("Nuvem",imagemdanuvem);
    nuvem.y = Math.round(random(10,90));
    nuvem.scale = 0.4;
    nuvem.velocityX = -3;
    
    //coloca nuvem atras do Trex
    nuvem.depth = trex.depth
    trex.depth = trex.depth + 1;// de todas
    
    //tempo de vida para nuvem
    nuvem.lifetime = width/30;
    
    //adicionar nuvens ao grupo
    grupoNuvens.add(nuvem);
  }
}
  
//Criar Obstáculos
function gerarObstaculos(){
  //gerar obstaculos a cada 60 quadros
  if (frameCount % 60 === 0){
   var obstaculo = createSprite(width-50,height-25,10,40);
    obstaculo.velocityX = -(6+pontuacao/100);
   
    
    //gerar obstaculos aleatoriamente
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
    
    //coloca obstaculo atras do Trex
    obstaculo.depth = trex.depth
    trex.depth = trex.depth + 1;// de todas
    
    //tempo de vida para obstaculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width/30;
    
    //adicionar obstáculos ao grupo
    grupoObstaculos.add(obstaculo);
  }
  
}

