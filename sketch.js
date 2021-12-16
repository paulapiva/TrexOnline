
var trex ,trexCorrendo, trex_colidiu;
var solo, soloImagem, soloInvisivel;
var nuvem, imagemdanuvem;
var obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var pontuacao=0;
var grupoNuvens, grupoCactos;
var estadoJogo = "JOGAR"
var reiniciar, restarImg, fimJogo, gameOver;

/* várias maneiras de fazer
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
*/

function preload(){
  
  trexCorrendo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_colidiu = loadImage("trex_collided.png");

  soloImagem = loadImage("ground2.png")
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

function setup(){
  createCanvas(windowWidth,200)
  
  //crie um sprite de trex
  trex = createSprite(width/20,height-110,30,50);
  trex.addAnimation("running", trexCorrendo);
  trex.addImage("collided" , trex_colidiu);
  trex.scale = 0.5
  trex.x = 40;
 
  //criação chão
  solo = createSprite(200,height-10,width,20);
  //solo = createSprite(200,180,600,20);
  solo.addImage("solo",soloImagem)

  //chão Invisivel
  soloInvisivel = createSprite(100, height-2,width,20);
  soloInvisivel.visible = false

  //criar fim do jogo
  fimJogo= createSprite(width/2,height/2);
  fimJogo.addImage(gameOver);
  fimJogo.scale = 0.3;
  
  //criar reiniciar
  reiniciar = createSprite(width/2,height/2+50);
  reiniciar.addImage(restartImg);
  reiniciar.scale = 0.5;
  
  //deixar imagens de fim invisiveis
  fimJogo.visible = false;
  reiniciar.visible = false;

  
  //Criando grupos
  grupoNuvens = new Group();
  grupoCactos = new Group();
  
  trex.debug = false
  trex.setCollider("rectangle", 60,0,100,250,90);
  //setCollider(type, xOffset, yOffset, width/radius, height, rotationOffset)

}

function draw(){

  //usados no jogo todo
  background("white")

  text("Pontuação: "+ pontuacao, width-150,15);

  //som do checkpoint 
  if(pontuacao >0 && pontuacao %100 === 0){
    somCheck.play();
  }
  //colisao com chão
  trex.collide(soloInvisivel)
  console.log("estado do jogo: ", estadoJogo)

  drawSprites();
  
  //usados no JOGAR
  if(estadoJogo === "JOGAR"){
    
    //Inseir pontução na tela
    pontuacao = pontuacao + Math.round(getFrameRate()/60);

    //Pulo do Trex
    if(touches.length > 0 || keyDown("space")&& trex.y >= height-100) {
      trex.velocityY = -10;
      somPulo.play();//som do salto
      touches = [];
    }
    //gravidade
    trex.velocityY = trex.velocityY +0.8;

    //Movimento do solo
    solo.velocityX = -(4+3*pontuacao/100);

    if(solo.x<0){
      solo.x = solo.width/2;
    }

    //chamada funções
    gerarNuvens()
    gerarObstaculos();

    //condição de mudança de estado do jogo
    if(trex.isTouching(grupoCactos)){
      trex.velocityY = -12;
      //estadoJogo = "ENCERRAR"
      //som da morte
      //somMorte.play();
    }
  }

  //usados no ENCERRAR
  else if (estadoJogo === "ENCERRAR"){
    solo.velocityX = 0;
    trex.velocityX = 0;
    trex.velocityY = 0;
    //altera a animação do Trex
    trex.changeAnimation("collided", trex_colidiu);
    
    //deixar imagens de fim visiveis
    fimJogo.visible = true;
    reiniciar.visible = true;
    
    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

     //Resetar o jogo
     if(mousePressedOver(reiniciar)||touches.length>0){
      console.log("reiniciar o jogo")
      reset();
    }
  }
  
}

//funções
//Reiniciar o jogo
function reset(){
  console.log("funcao")
  estadoJogo = "JOGAR";
  fimJogo.visible = false;
  reiniciar.visible = false;
  grupoCactos.destroyEach();
  grupoNuvens.destroyEach();
  trex.changeAnimation("running", trexCorrendo);
  pontuacao=0;
}

function gerarNuvens(){
  if(frameCount % 60 === 0) {
    nuvem = createSprite(width-50,100,40,10);
    nuvem.addImage("Muven",imagemdanuvem);
    nuvem.y = Math.round(random(10,100));
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    nuvem.depth = trex.depth
    trex.depth++

    //tempo de vida para nuvens
    nuvem.lifetime = width/30;

    grupoNuvens.add(nuvem)
  }
  
}

function gerarObstaculos(){
  //gerar obstaculos a cada 60 quadros
  if (frameCount % 60 === 0){
   var obstaculo = createSprite(width-50,height-25,10,40);
   obstaculo.velocityX = -(6+pontuacao/100);
   obstaculo.scale = 0.5;
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
    obstaculo.lifetime = width/30;

    grupoCactos.add(obstaculo)
  }
  
}