var SiguienteNivel = cc.LayerColor.extend({
    ctor:function () {
         this._super();
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
         cc.director.runScene(new GameScene());
       }
  });