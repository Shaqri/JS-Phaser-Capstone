import 'phaser';
import Button from '../Objects/Button';

export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOver');
  }

  moveButtons() {
    this.tweens.add({
      targets: this.gameButton,
      y: 300,
      duration: 3000,
      ease: 'Power3'
    });

    this.tweens.add({
      targets: this.leaderButton,
      y: 400,
      duration: 3000,
      ease: 'Power3'
    });

    this.tweens.add({
      targets: this.titleButton,
      y: 500,
      duration: 3000,
      ease: 'Power3'
    });

  }

  setScoreInLeaderboard(name, score) {
    let url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/o6CKpBlLsn3JiOcASy7Z/scores';
    console.log(name);
    console.log(score);
    let requestParameters = {
      user: name,
      score: score
    }
    let leaderboardRequest = fetch(url, {
      method: 'POST',
      headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
      },
      body: JSON.stringify(requestParameters),
    });

    leaderboardRequest.then((response) => {
      console.log(response.json());
    });

  }

  create (data) {
    
    this.gameButton = new Button(this, this.sys.game.config.width/2, this.sys.game.config.height- 200, 'blueButton1', 'blueButton2', 'Play Again', 'Game');
    this.leaderButton = new Button(this, this.sys.game.config.width/2, this.sys.game.config.height- 140, 'blueButton1', 'blueButton2', 'Leaderboard', 'Game');
    this.titleButton = new Button(this, this.sys.game.config.width/2, this.sys.game.config.height- 80, 'blueButton1', 'blueButton2', 'Menu', 'Title');
    let text = this.add.text(this.sys.game.config.width / 2 - 406/2, 100, 'Game over manin', { color: 'white', fontSize: '45px'});

    let score = this.add.text(this.sys.game.config.width / 2 - 307/2, text.displayHeight + 110, `Your score was: ${data.score}`, { color: 'white', fontSize: '30px'});
    console.log(score.displayWidth);
    
    let element = this.add.dom(400, 0).createFromCache('nameform');
    element.addListener('click');
    element.on('click', function (event) {
      if(event.target.name === 'submitButton'){
        let inputText = element.node.firstChild;

        if(inputText.value !== '') {
          element.removeListener('click');
          element.visible = false; 
          this.moveButtons();
          this.setScoreInLeaderboard(inputText.value, data.score);
        }
          
      
      }
    }, this);

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 3000,
      ease: 'Power3'
    });

  }
};