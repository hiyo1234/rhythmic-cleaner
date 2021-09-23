phina.globalize();

phina.define('TitleScene', {
  superClass: 'DisplayScene',

  init: function(params) {
    this.superInit(params);
    this.backgroundColor = params.backgroundColor;
    params_global = params;
    SoundManager.volume = 0.15;
    SoundManager.musicVolume = 0.15;
    const self = this;

    bg = Sprite('bg').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
    bg.alpha = 0.5;

    Sprite('logo').addChildTo(this).setPosition(90, 80).setScale(0.4, 0.4);

    PathShape({
      stroke: "magenta",
      strokeWidth: 1,
      paths: [Vector2(this.gridX.span(8), this.gridY.span(16)), 
        Vector2(this.gridX.span(8), this.gridY.span(5))]
    }).addChildTo(this);
    PathShape({
      stroke: "magenta",
      strokeWidth: 5,
      paths: [Vector2(this.gridX.span(0), this.gridY.span(16)), 
        Vector2(this.gridX.span(7.5), this.gridY.span(5))]
    }).addChildTo(this);
    PathShape({
      stroke: "magenta",
      strokeWidth: 5,
      paths: [Vector2(this.gridX.span(16), this.gridY.span(16)), 
        Vector2(this.gridX.span(8.5), this.gridY.span(5))]
    }).addChildTo(this);


    Label({
      text: "リズム De! 掃除機",
      fill: "white",
      fontSize: 70,
      stroke: "cyan",
      strokeWidth: 3,
    })
    .setPosition(this.gridX.center(), this.gridY.span(3) + 25)
    .addChildTo(this);

    const playMethodGroup = DisplayElement().setPosition(this.gridX.span(13) - 10, this.gridY.span(1) + 15).addChildTo(this);
    const playMethodButton = RectangleShape({
      width: 220,
      height: 80,
      fill: 'black',
      stroke: 'cyan',
      strokeWidth: 7,
      cornerRadius: 16
    }).addChildTo(playMethodGroup).setInteractive(true);
    Label({
      text: "遊び方",
      fontSize: 48,
      fill: "white",
      stroke: "cyan",
      strokeWidth: 3,
    }).addChildTo(playMethodGroup);
    playMethodButton.onpointstart = function() {   
      self.exit({nexLabel: 'playMethod'})
    };

    const touchLabelGroup = DisplayElement().setPosition(this.gridX.center(), this.gridY.span(14)- 30).addChildTo(this);
    const nextButton = RectangleShape({
      width: 450,
      height: 150,
      fill: 'black',
      stroke: 'cyan',
      strokeWidth: 15,
      cornerRadius: 70,
    }).addChildTo(touchLabelGroup).setInteractive(true);
    const touchLabel = Label({
      text: "Tap to start",
      fontSize: 60,
      fill: "white",
      stroke: "cyan",
      strokeWidth: 3,
    }).addChildTo(touchLabelGroup);
    touchLabel.tweener.clear()
    .setLoop(true)
    .to({alpha: 0}, 900)
    .to({alpha: 1}, 900);

    //センサ使用許可要求
    this.setInteractive(true);
    this.onclick = function() {
      devicemotionRequest();
    };

    // モバイルでの再生制限アンロックのため、画面タッチ時にSoundを無音再生
    // enterイベント自体は1つのみしか発火されていない
    nextButton.on('pointstart', function() {
      var event = "touchstart";
      var dom = self.app.domElement;
      dom.addEventListener(event, (function() {
        return function f() {
          var context = phina.asset.Sound.getAudioContext();
          var buf = context.createBuffer(1, 1, 22050);
          var src = context.createBufferSource();
          src.buffer = buf;
          src.connect(context.destination);
          src.start(0);
          dom.removeEventListener(event, f, false);
        }
      }()), false);
      // シーン遷移
      SoundManager.play('point');
      self.exit({nextLabel: 'selectMusic'});
    });
  },
});