import 'phaser';
import Button from '../Objects/Button';

export default class Leaderboard extends Phaser.Scene {
  constructor () {
    super('Leaderboard');
  }

  requestScores() {
      let url = this.sys.game.globals.model.gameOptions.url;
      return fetch(url, {
          method: 'GET'
      });
  }

  displayScore(user, verticalSpace, i) {
      if(i > 10) return
      this.add.bitmapText(this.sys.game.config.width - 700, verticalSpace, 'gamma', `${i}. ${user.user.toUpperCase()}`);
      this.add.bitmapText(this.sys.game.config.width - 150, verticalSpace, 'gamma', `${user.score}`);
  }

  processRequest(request) {
    return request.then((response) => {
        return response.json();
    }).then((response) => {
        return response.result.sort((a, b) => {
            return b.score - a.score
        });
    }).then((response) => {
       return response
    });
  }

  createScoreList(list) {
    let i = 1
    let verticalSpace = 90
    list.forEach(user => {
       this.displayScore(user, verticalSpace, i);
        verticalSpace += 30;
        i += 1;
    });

  }

  create () {
    let config = this.cache.json.get('gamma_json');
    this.cache.bitmapFont.add('gamma', Phaser.GameObjects.RetroFont.Parse(this, config));
    this.text = this.add.bitmapText(this.sys.game.config.width/2 - 176/2, 10, 'gamma', 'LEADERBOARD');
    this.username = this.add.bitmapText(this.sys.game.config.width - 700, 50, 'gamma', 'USERNAME');
    this.score = this.add.bitmapText(this.sys.game.config.width - 150, 50, 'gamma', 'SCORE');
    
    let scoresRequest = this.requestScores();
    let scoreList= this.processRequest(scoresRequest)
    scoreList.then((list) => {
        this.createScoreList(list);
    });
    

    this.titleButton = new Button(this, this.sys.game.config.width/2, this.sys.game.config.height- 80, 'blueButton1', 'blueButton2', 'Menu', 'Title');


  }
};