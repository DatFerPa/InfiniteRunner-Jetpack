
var Enemigo = cc.Class.extend({
    tiempoUltimoSalto:0,
    tiempoEntreSaltos:0,
    gameLayer:null,
    sprite:null,
    shape:null,
ctor:function (gameLayer, posicion) {
    this.gameLayer = gameLayer;

    this.tiempoEntreSaltos= 2 + Math.floor(Math.random()*2);

    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 8; i++) {
        var str = "cuervo" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#cuervo1.png");
    // Cuerpo estática , no le afectan las fuerzas
    // Cuerpo dinámico, SI le afectan las fuerzas
    this.body = new cp.Body(5, cp.momentForBox(1,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height));

    this.body.setPos(posicion);
    this.body.setAngle(0);
    this.sprite.setBody(this.body);
    // Se añade el cuerpo al espacio
    gameLayer.space.addBody(this.body);

    // forma
    this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width - 16,
        this.sprite.getContentSize().height - 16);
    this.shape.setCollisionType(tipoEnemigo);
    // agregar forma dinamica
    gameLayer.space.addShape(this.shape);
    // añadir sprite a la capa

    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);

    gameLayer.addChild(this.sprite,10);
},update:function (dt, jugadorX) {

        // aumentar el tiempo que ha pasado desde el ultimo salto
        this.tiempoUtimoSalto = this.tiempoUtimoSalto + dt;

        // Saltan si el tiempo ha pasado y el jugador está cerca
        if(this.tiempoUtimoSalto > this.tiempoEntreSaltos &&
           Math.abs( this.body.p.x - jugadorX ) < 500){

            var impulsoX = 200 - Math.floor(Math.random() * 400);
            // - 600 a 600.
            var impulsoY = 800 + Math.floor(Math.random() * 1200);
            // 800 a 2000.

            // Colocar en angulo del cuerpo a 0
            this.body.setAngle(0);

            this.body.applyImpulse(cp.v(impulsoX, impulsoY), cp.v(0, 0));
            this.tiempoUtimoSalto = 0;
        }

        // Invertir o no sprite en funcion de la velocidad / orientación
        if(this.body.getVel().x > 0){
            this.sprite.flippedX = true;
        } else {
             this.sprite.flippedX = false;
        }
    }

});
