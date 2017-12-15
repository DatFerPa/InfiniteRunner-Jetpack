var SiguienteNivel = cc.LayerColor.extend({

    numeroNivel: null,
    ctor:function (nivel) {
         this._super();
         this.numeroNivel = nivel
         this.init();
       },
       init:function () {
         this._super(cc.color(0, 0, 0, 180));

         var winSize = cc.director.getWinSize();

         var botonSiguiente = new cc.MenuItemSprite(
             new cc.Sprite(res.boton_siguiente_png),
             new cc.Sprite(res.boton_siguiente_png),
             this.pulsarSiguiente, this);

         var menu = new cc.Menu(botonSiguiente);
         menu.setPosition(winSize.width / 2, winSize.height / 2);

         this.addChild(menu);
       },
       pulsarSiguiente:function (sender) {
         // Volver a ejecutar la escena Prinicpal
         //cc.director.runScene(new GameScene());
         console.log(this.numeroNivel);
         if(this.numeroNivel == 1){
            cc.director.runScene(new GameSceneNivel2());
         }else{
            cc.director.runScene(new GameSceneNivel1());
         }
       }
  });