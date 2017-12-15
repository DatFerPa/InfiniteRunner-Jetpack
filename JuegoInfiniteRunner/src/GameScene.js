var tipoSuelo = 1;
var tipoJugador = 2;
var tipoMoneda = 3;
var tipoEnemigo = 4;
var tipoJugadorExt = 5;
var tipoMeta = 6;

var GameLayer = cc.Layer.extend({
    space:null,
    _emitter: null,
    tiempoEfecto:0,
    monedas: [],
    enemigos:[],
    formasEliminar: [],
    jugador: null,
    mapa: null,
    mapaAncho: null,
    mapaAlto:null,
    numeroNivel:null,

    ctor:function (numeroNivel) {

        this._super();
        var size = cc.winSize;

        console.log(size.height);
        this.numeroNivel = numeroNivel;

        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_subiendo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_avanzando_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);


        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        this.jugador = new Jugador(this, cc.p(50,150));

        this.cargarMapa();
        this.scheduleUpdate();

        // suelo y jugador
        this.space.addCollisionHandler(tipoSuelo, tipoJugador,
              null, null, this.collisionSueloConJugador.bind(this), null);

         this.space.addCollisionHandler(tipoMeta,tipoJugador,
            null,this.colisionMetaConJugador.bind(this),null,null);

        //jugador y enemigos
         this.space.addCollisionHandler(tipoJugadorExt,tipoEnemigo,
         null, this.collisionJugadorConenemigo.bind(this),null, null);

        // jugador y moneda
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión por la propiedad SENSOR de la Moneda).
        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
              null, this.collisionJugadorConMoneda.bind(this), null, null);



        // Declarar emisor de particulas (parado)
            this._emitter =  new cc.ParticleGalaxy.create();
            this._emitter.setEmissionRate(0);
            //this._emitter.texture = cc.textureCache.addImage(res.fire_png);
            this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
            this.addChild(this._emitter,10);

        this.addChild(this.jugador._emitterTurbo,10);



        return true;

    },update:function (dt) {
         this.jugador.estado = estadoSaltando;
         this.space.step(dt);

         for (var i = 0; i < this.enemigos.length; i++) {
                  this.enemigos[i].update(dt, this.jugador.body.p.x);
              }

         // Control de emisor de partículas
             if (this.tiempoEfecto > 0){
                  this.tiempoEfecto = this.tiempoEfecto - dt;
                  this._emitter.x =  this.jugador.body.p.x;
                  this._emitter.y =  this.jugador.body.p.y;

             }
             if (this.tiempoEfecto < 0) {
                  this._emitter.setEmissionRate(0);
                  this.tiempoEfecto = 0;
             }

            this.jugador.turboUpdater(dt);


         // Controlar el angulo (son radianes) max y min.
          if ( this.jugador.body.a > 0.44 ){
              this.jugador.body.a = 0.44;
          }
          if ( this.jugador.body.a < -0.44){
              this.jugador.body.a = -0.44;
          }
          // controlar la velocidad X , max y min
          if (this.jugador.body.vx < 250){
              this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
          }
          if (this.jugador.body.vx > 400){
              this.jugador.body.vx = 400;
          }
          // controlar la velocidad Y , max
          if (this.jugador.body.vy > 450){
              this.jugador.body.vy = 450;
          }

           // actualizar cámara (posición de la capa).
           var posicionXJugador = this.jugador.body.p.x - 100;
          // var posicionYJugador = this.jugador.body.p.y - 50;


           var posicionYJugador = 0;

           var jugadorY = this.jugador.body.p.y;
           var tamWin = cc.winSize.height;


           this.setPosition(cc.p( -posicionXJugador,-posicionYJugador));

           // Caída, sí cae vuelve a la posición inicial
            if( this.jugador.body.p.y < -100){
               this.jugador.body.p = cc.p(100,100);
               this.jugador.turbos = 3;
            }

        // Eliminar formas:
             for(var i = 0; i < this.formasEliminar.length; i++) {
                var shape = this.formasEliminar[i];

                for (var i = 0; i < this.monedas.length; i++) {
                  if (this.monedas[i].shape == shape) {
                      this.monedas[i].eliminar();
                      this.monedas.splice(i, 1);
                  }
                }
            }
            this.formasEliminar = [];
    },collisionJugadorConenemigo:function(arbiter, space){

             this.jugador.body.p = cc.p(100,100);
             this.jugador.turbos = 3;


    },colisionMetaConJugador:function(arbiter,space){

        console.log("meta");
        cc.director.pause();
        this.getParent().addChild(new SiguienteNivel(this.numeroNivel));

    },collisionJugadorConMoneda:function (arbiter, space) {
                this._emitter.setEmissionRate(5);
                            this.tiempoEfecto = 3;

                // Impulso extra
                this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));

                // Marcar la moneda para eliminarla
                var shapes = arbiter.getShapes();
                // shapes[0] es el jugador
                this.formasEliminar.push(shapes[1]);

                var capaControles = this.getParent().getChildByTag(idCapaControles);
                capaControles.agregarMoneda();


    },collisionSueloConJugador:function (arbiter, space) {

            this.jugador.tocaSuelo(this.numeroNivel);

    },cargarMapa:function () {
        if(this.numeroNivel == 1){
            this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
        }else{
            this.mapa = new cc.TMXTiledMap(res.mapa2_tmx);
        }

          // Añadirlo a la Layer
          this.addChild(this.mapa);
          // Ancho del mapa
          this.mapaAncho = this.mapa.getContentSize().width;

          // Solicitar los objeto dentro de la capa Suelos
          var grupoSuelos = this.mapa.getObjectGroup("Suelos");
          var suelosArray = grupoSuelos.getObjects();

          // Los objetos de la capa suelos se transforman a
          // formas estáticas de Chipmunk ( SegmentShape ).
          for (var i = 0; i < suelosArray.length; i++) {
              var suelo = suelosArray[i];
              var puntos = suelo.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodySuelo = new cp.StaticBody();

                  var shapeSuelo = new cp.SegmentShape(bodySuelo,
                      cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                          parseInt(suelo.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                          parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                      10);
                  shapeSuelo.setCollisionType(tipoSuelo);

                  this.space.addStaticShape(shapeSuelo);
              }
          }

          var grupoMetas = this.mapa.getObjectGroup("Meta");
          var metasArray = grupoMetas.getObjects();

          for(var i = 0; i < metasArray.length; i++){
                var meta = metasArray[i];
                var bodyMeta = new cp.StaticBody();
                bodyMeta.setPos(cc.p(meta.x+meta.width/2,meta.y+meta.height/2));
                bodyMeta.setAngle(0);
                var shapeMeta = new cp.BoxShape(bodyMeta,meta.width,meta.height);
                shapeMeta.setSensor(true);
                shapeMeta.setCollisionType(tipoMeta);
                this.space.addStaticShape(shapeMeta);
          }



          var grupoMonedas = this.mapa.getObjectGroup("Monedas");
          var monedasArray = grupoMonedas.getObjects();
          for (var i = 0; i < monedasArray.length; i++) {
            var moneda = new Moneda(this,
                cc.p(monedasArray[i]["x"],monedasArray[i]["y"]));
            this.monedas.push(moneda);
          }

          var grupoEnemigos = this.mapa.getObjectGroup("Enemigos");
          var enemigosArray = grupoEnemigos.getObjects();
          for (var i = 0; i < enemigosArray.length; i++) {
              var enemigo = new Enemigo(this,
                  cc.p(enemigosArray[i]["x"],enemigosArray[i]["y"]));

              this.enemigos.push(enemigo);
          }


    }

});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameSceneNivel1 = cc.Scene.extend({
    onEnter:function () {
        this._super();
        console.log();
        cc.director.resume();

        var layer = new GameLayer(1);
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);

    }
});

var GameSceneNivel2 = cc.Scene.extend({
    onEnter:function () {
        this._super();
        console.log();
        cc.director.resume();

        var layer = new GameLayer(2);
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);

    }
});
