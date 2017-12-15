
var MenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Fondo
                var spriteFondoTitulo= new cc.Sprite(res.menu_titulo_png);
                // Asigno posición central
                spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
                // Lo escalo porque es más pequeño que la pantalla
                spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
                // Añado Sprite a la escena
                this.addChild(spriteFondoTitulo);

                //MenuItemSprite para cada botón
                var menuNivel2 = new cc.MenuItemSprite(
                    new cc.Sprite(res.boton_nivel2_png), // IMG estado normal
                    new cc.Sprite(res.boton_nivel2_png), // IMG estado pulsado
                    this.pulsarBotonNivel2, this);


                // creo el menú pasándole los botones
                var nivel2 = new cc.Menu(menuNivel2);
                // Asigno posición central
                nivel2.setPosition(cc.p(size.width / 2, size.height * 0.25));
                // Añado el menú a la escena
                this.addChild(nivel2);

                var menuNivel1 = new cc.MenuItemSprite(
                new cc.Sprite(res.boton_nivel1_png),
                new cc.Sprite(res.boton_nivel1_png),
                this.pulsarBotonNivel1,this);

                var nivel1 = new cc.Menu(menuNivel1);
                nivel1.setPosition(cc.p(size.width / 2,size.height * 0.45));
                this.addChild(nivel1);

        return true;
    }, pulsarBotonNivel2 : function(){
               cc.director.runScene(new GameSceneNivel2());
    }, pulsarBotonNivel1 : function(){
                cc.director.runScene(new GameSceneNivel1());
    }

});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

