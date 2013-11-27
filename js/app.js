/**
 * Puzzleクラス
 * @constructor
 */
var Puzzle = function() {
  this.rootEl = $('#main');
  this.colors = [];
  this.rows = null;
  this.cols = null;
  this.matrix = null;
};

/**
 * Puzzle画面をセットアップする
 * @param {number} colorVariation 色のバリエーション数
 * @param {number} rows           横の辺数
 * @param {number} cols           縦の辺数
 */
Puzzle.prototype.setup = function(colorVariation, rows, cols) {
  this.clearField();
  this.colors = this._getRgbColors(colorVariation);
  this.rows = rows;
  this.cols = cols;
  this.matrix = [];

  //縦の数だけ<tr>要素を作成
  for(var i = 0; i < rows; i++) {
    this.appendContainer(i);
  }
};

/**
 * 縦の数だけコンテナを作る
 */
Puzzle.prototype.appendContainer = function(y) {
  var trElement = $('<tr class="row"></tr>');
  this.rootEl.append(trElement);
  for(var x = 0; x < this.cols; x++) {
    this.appendBall(trElement, x, y);
  }
};

/**
 * 横の数だけボールを作ってコンテナに入れる
 * @param container
 */
Puzzle.prototype.appendBall = function(container, x, y) {
  var ballElement = $('<td class="ball" data-x="'+ x +'" data-y="'+ y +'"></td>');
  this.matrix[x] = this.matrix[x] || [];
  this.matrix[x][y] = ballElement;
  container.append(ballElement);

  //初期状態を定義
  var state = Math.floor(Math.random() * (this.colors.length));
  this.setState(ballElement, state);

  //クリックした際の挙動を定義
  ballElement.bind('click', this, function(e) {
    var that = e.data;

    that.setNextState($(this));

    //隣あう要素を取得
    var neighbors = that.getNeighbors(this);
    for(var i = 0; i < neighbors.length; i++) {
      that.setNextState(neighbors[i]);
    }

    //クリアがどうかチェック
    if (that.checkComplete()){
      alert('クリア');
      that.setup(that.colors.length, that.rows, that.cols);
    };
  });
};

/**
 * 全てクリアしてるかどうかチェックする
 * @returns {boolean}
 */
Puzzle.prototype.checkComplete = function() {
  var result = true;

  //x:0 y:0のstateを調査
  var state0 = this.matrix[0][0].data('state');

  for(var i = 0; i < this.matrix.length; i++) {
    for(var j = 0; j < this.matrix[i].length; j++) {
      if(state0 != this.matrix[i][j].data('state')) {
        result = false;
      }
    }
  }

  return result;
};

Puzzle.prototype.getNeighbors = function(el) {
  var x = $(el).data('x');
  var y = $(el).data('y');
  var neighbors = [];


  if(x > 0) {
    //左側は隣人
    neighbors.push(this.matrix[x - 1][y]);
  }

  if(x < this.cols - 1) {
    //右側は隣人
    neighbors.push(this.matrix[x + 1][y]);
  }

  if(y > 0) {
    //下側は隣人
    neighbors.push(this.matrix[x][y - 1]);
  }

  if(y < this.rows - 1) {
    //上側は隣人
    neighbors.push(this.matrix[x][y + 1]);
  }

  return neighbors;

};


/**
 *
 * @param el
 */
Puzzle.prototype.setState = function(el, state) {
  el.css('background-color', this.colors[state]);
  el.data('state', state);
};

/**
 *
 * @param el
 * @param state
 */
Puzzle.prototype.setNextState = function(el, state) {
  var nextState = el.data('state') + 1;
  if(nextState >= this.colors.length) {
    nextState = 0;
  }
  console.log(el, nextState);
  this.setState(el, nextState);
};


/**
 * Puzzle画面を空にする
 */
Puzzle.prototype.clearField = function() {
  this.rootEl.html('');
};

/**
 * パズルに使う色のバリエーション分、rgb値配列を返す
 * @param {number} variation バリエーション数
 * @private
 */
Puzzle.prototype._getRgbColors = function(variation) {
  var colors = [];

  for(var i = 0; i < variation; i++) {
    //0 ~ 255のランダムの値を入れる
    colors.push(this._getRgbColor());
  }

  return colors;
};

/**
 * 'rgb(255, 255, 255)'の形式でRGB値を返す
 * @returns {number} 0 ~ 255のランダムな値を返す
 * @private
 */
Puzzle.prototype._getRgbColor = function() {
  /**
   * 0~255のランダムな値を返す
   * @returns {number}
   */
  function getRandomValue() {
    return Math.floor(Math.random() * 256);
  }

  return 'rgb('+ [getRandomValue(), getRandomValue(), getRandomValue()] +')';
};

