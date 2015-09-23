//Don't run expriments on odd turn count
var turnCount = 24;
var diceRemoved = 0;
var currentPlayer;
var winnerName;

var player1 = {
  name : 'Player 1 ',
  scores: {  
    ones: {
      isActive: true,
      value: 0
    },
    twos: {
      isActive: true,
      value: 0
    },
    threes: {
      isActive: true,
      value: 0
    },
    fours: {
      isActive: true,
      value: 0
    },
    fives: {
      isActive: true,
      value: 0
    },
    sixes: {
      isActive: true,
      value: 0
    },
    threeOfAKind: {
      isActive: true,
      value: 0
    },
    fourOfAKind: {
      isActive: true,
      value: 0
    },
    fullHouse: {
      isActive: true,
      value: 0
    },
    smallStraight: {
      isActive: true,
      value: 0
    },
    largeStraight: {
      isActive: true,
      value: 0
    },
    chance: {
      isActive: true,
      value: 0
    },
    yahtzoo: {
      isActive: true,
      value: 0
    }
  },
  status: {
    numOfDice: 5,
    inHand:[]
  }
}

var player2 = {
  name: 'Player 2',
  scores: {  
    ones: {
      isActive: true,
      value: 0
    },
    twos: {
      isActive: true,
      value: 0
    },
    threes: {
      isActive: true,
      value: 0
    },
    fours: {
      isActive: true,
      value: 0
    },
    fives: {
      isActive: true,
      value: 0
    },
    sixes: {
      isActive: true,
      value: 0
    },
    threeOfAKind: {
      isActive: true,
      value: 0
    },
    fourOfAKind: {
      isActive: true,
      value: 0
    },
    fullHouse: {
      isActive: true,
      value: 0
    },
    smallStraight: {
      isActive: true,
      value: 0
    },
    largeStraight: {
      isActive: true,
      value: 0
    },
    chance: {
      isActive: true,
      value: 0
    },
    yahtzoo: {
      isActive: true,
      value: 0
    }
  },
  status: {
    numOfDice: 5,
    inHand:[]
  }
}

var dice = {
  one: {
    image: '<img class="die-image" src="./images/dice-six-faces-one.svg">',
    value: 1 
  },
  two: {
    image: '<img class="die-image" src="./images/dice-six-faces-two.svg">',
    value: 2  
  },
  three: {
    image: '<img class="die-image" src="./images/dice-six-faces-three.svg">',
    value: 3 
  },
  four: {
    image: '<img class="die-image" src="./images/dice-six-faces-four.svg">',
    value: 4 
  },
  five: {
    image: '<img class="die-image" src="./images/dice-six-faces-five.svg">',
    value: 5 
  },
  six: {
    image: '<img class="die-image" src="./images/dice-six-faces-six.svg">',
    value: 6 
  }
}

var diceArray = [dice.one, dice.two, dice.three, dice.four, dice.five, dice.six]

function rollTheDice(numOfDice){
  function go(hand){
    return hand.length == numOfDice ?  hand : go(hand.concat(diceArray[Math.floor(Math.random() * 6)]));
  }
  return go([]);
}

function hasDuplicates(roll, num){
  if (roll){
    if (roll.indexOf(num) > -1){
      return roll.reduce(function(curr, next){
        return next == num ? curr + 1 : curr;
      }, 0) * num;
    }
  }
}

function has_OfAKind(roll, threeOrFour){
  var duplicates = roll.reduce(function(obj, val){
    obj[val] = obj[val] + 1 || 1 ;
    return obj;
  }, {})
  for (var num in duplicates){
    if (duplicates[num] >= threeOrFour){
      return takeChance(roll);
    }
  }
}

function hasFullHouse(roll){
  var duplicates = roll.reduce(function(obj, val){
    obj[val] = obj[val] + 1 || 1 ;
    return obj
  }, {});
  var propertyNames = Object.getOwnPropertyNames(duplicates);
  if (propertyNames.length == 2 && (duplicates[propertyNames[0]] == 3 || duplicates[propertyNames[1]] == 3)) {
    return 25;
  }
}

function hasStraight(roll, smOrLg){
  smOrLg == 'small' ? smOrLg = 4 : smOrLg = 5;
  var sorted = roll.slice().sort(function(a,b){
    return a - b;
  })
  for (var i=0; i<sorted.length;i++){
    if (i == 0 && sorted[i] !== sorted[i + 1]- 1){
      sorted.splice(i,1);
      i--;
    } else if (sorted[i] !== sorted[i - 1]+ 1 && i !== 0){
      sorted.splice(i,1);
      i--;
    }
  }
  if (sorted.length >= smOrLg) {
    return smOrLg ===  4 ? 30 : 40 ;
  }
}

function hasYahtzoo(roll){
  if (Object.getOwnPropertyNames(roll.reduce(function(obj, val){
    obj[val] = obj[val] + 1 || 1;
    return obj;
  }, {})).length == 1 && roll[0] > 0){
    return 50;
  }
}

function takeChance(roll){
  return roll.reduce(function(a, b){
    return a + b;
  })
}

function rollEm(currentPlayer){
  $('.die')
    .off('hover')
    .removeClass('jquery-disabled')
    .not($('.disabled'))
    .hover(
      function(){
      $(this)
        .addClass('jquery-disabled')
      }, 
      function(){
      $(this)
        .removeClass('jquery-disabled');
      }
  )
  resetScoringOptions();
  if (currentPlayer.status.rolls === 0 || !$('.die').hasClass('disabled')){
    currentPlayer.status.inHand = [];
    var currentRoll = rollTheDice(currentPlayer.status.numOfDice);
    for (var i = 0; i<currentPlayer.status.numOfDice;i++){
      $($('.die')[i])
        .html(currentRoll[i].image);
    }
    currentPlayer.status.inHand = currentPlayer.status.inHand.concat(currentRoll);
    //console.log(currentPlayer.status.inHand);
  } else {
    var currentRoll = rollTheDice(diceRemoved);
    console.log(diceRemoved);
    for (var i=0; i<currentRoll.length;i++){
      $($('.disabled')[i])
        .html(currentRoll[i].image);
    }
    var j = 0;
    $('.die')
      .each(function(){

      if ($(this).hasClass('disabled')){
        var atId = $(this).index();
        currentPlayer.status.inHand.splice(atId, 1, currentRoll[j]);
        console.log(currentRoll)
        j++;
      }
    })
  }
  diceRemoved = 0;
}

function activateDie(currentPlayer){
  console.log(currentPlayer);
  $('body')
    .off('click', '.die-image')
    .on('click', '.die-image', function(e){
      $(this).parent().hasClass('disabled') ? diceRemoved-- : diceRemoved++;
      $(this).parent().toggleClass('disabled');
  });
}

function convertToValues(player){
  return player.status.inHand.reduce(function(curr, next){
      curr.push(next.value);
      return curr;
    }, []);
}

function updateScoringOptions(currentRoll, currentPlayer){

  var num = currentPlayer == player1 ? '1' : '2';
  updatePoints(hasDuplicates(currentRoll, 1), currentPlayer, '.ones', ' (' + hasDuplicates(currentRoll, 1) + ')', '.1-p'+num, currentPlayer.scores.ones);
  updatePoints(hasDuplicates(currentRoll, 2), currentPlayer, '.twos', ' (' + hasDuplicates(currentRoll, 2) + ')', '.2-p'+num, currentPlayer.scores.twos);
  updatePoints(hasDuplicates(currentRoll, 3), currentPlayer, '.threes', ' (' + hasDuplicates(currentRoll, 3) + ')', '.3-p'+num, currentPlayer.scores.threes);
  updatePoints(hasDuplicates(currentRoll, 4), currentPlayer, '.fours', ' (' + hasDuplicates(currentRoll, 4) + ')', '.4-p'+num, currentPlayer.scores.fours);
  updatePoints(hasDuplicates(currentRoll, 5), currentPlayer, '.fives', ' (' + hasDuplicates(currentRoll, 5) + ')', '.5-p'+num, currentPlayer.scores.fives);
  updatePoints(hasDuplicates(currentRoll, 6), currentPlayer, '.sixes', ' (' + hasDuplicates(currentRoll, 6) + ')', '.6-p'+num, currentPlayer.scores.sixes);
  updatePoints(has_OfAKind(currentRoll, 3), currentPlayer, '.three-of-a-kind', ' (' + has_OfAKind(currentRoll, 3) + ')', '.3-of-a-kind-p'+num, currentPlayer.scores.threeOfAKind);
  updatePoints(has_OfAKind(currentRoll, 4), currentPlayer, '.four-of-a-kind', ' (' + has_OfAKind(currentRoll, 4) + ')', '.4-of-a-kind-p'+num, currentPlayer.scores.fourOfAKind);
  updatePoints(hasFullHouse(currentRoll), currentPlayer, '.full-house', ' (25)', '.full-house-p'+num, currentPlayer.scores.fullHouse);
  updatePoints(hasStraight(currentRoll, 'small'), currentPlayer, '.sm-straight', ' (30)', '.sm-straight-p'+num, currentPlayer.scores.smallStraight);
  updatePoints(hasStraight(currentRoll, 'large'), currentPlayer, '.lg-straight', ' (40)', '.lg-straight-p'+num, currentPlayer.scores.largeStraight);
  updatePoints(takeChance(currentRoll), currentPlayer, '.chance', ' (' + takeChance(currentRoll) + ')', '.chance-p'+num, currentPlayer.scores.chance);
  updatePoints(hasYahtzoo(currentRoll), currentPlayer, '.yahtzoo', ' (50)', '.yahtzoo-p'+num, currentPlayer.scores.yahtzoo);
}

function updatePoints(hasScore, player, btnClass, buttonText, tableClass, playerScoreObj){
  if (hasScore && playerScoreObj.isActive){
    $(btnClass)
      .append(buttonText)
      .attr('data', hasScore)
      .removeClass('disabled-score')
      .addClass('active')
      .on('click', function(){
        $(this)
          .removeClass('active');
        $(tableClass)
          .text(hasScore);
        playerScoreObj.isActive = false;
        playerScoreObj.value = hasScore;
        nextTurn();
        $('disabled-score')
          .removeClass('disabled-score');
      $('.big-button')
        .off('click')
        .on('click', function(){
          startTurn();
      })
    });
  }
  else if (!playerScoreObj.isActive){
    $(btnClass)
      .addClass('disabled-score')
        .off('click')
        .off('click');
  }
}

function resetScoringOptions(){
  $($('.multiples')[0]).html('Ones').off('click');
  $($('.multiples')[1]).html('Twos').off('click');
  $($('.multiples')[2]).html('Threes').off('click');
  $($('.multiples')[3]).html('Fours').off('click');
  $($('.multiples')[4]).html('Fives').off('click');
  $($('.multiples')[5]).html('Sixes').off('click');
  $('.three-of-a-kind').html('3 of Kind').off('click');
  $('.four-of-a-kind').html('4 of Kind').off('click');
  $('.four-of-a-kind').html('4 of Kind').off('click');
  $('.full-house').html('Full House').off('click');
  $('.sm-straight').html('Small Straight').off('click');
  $('.lg-straight').html('Large Straight').off('click');
  $('.chance').html('Chance').off('click');
  $('.yahtzoo').html('Yahtzoo!').off('click');
  $('.button, .yahztoo').removeClass('active , disabled-score');
}

function nextTurn(){
  $('.big-button').html('Roll (<span>3</span>)');
  player1.status.inHand = [];
  $('.die').removeClass('disabled').html('');
  resetScoringOptions();
  turnCount++;

  if (turnCount == 26){
    gameOver();
    return;
  }

  updateScoringOptions([0,0,0,0], turnCount % 2 == 0 ? player1 : player2);
  activateDie(turnCount % 2 == 0 ? player1 : player2);

  function switchPlayer(){
    $('.current-player').fadeToggle(200, function(){
      $('.current-player')
        .text(turnCount % 2 == 0 ? player1.name + '\'s Turn' : player2.name + '\'s Turn')
        .fadeToggle(200);
    });
  }
  switchPlayer();
}

function startTurn(){
  $('.button').removeClass('disabled-score');
  currentPlayer = turnCount % 2 == 0 ? player1 : player2;
  rollEm(currentPlayer);
  updateScoringOptions(convertToValues(currentPlayer), currentPlayer);
  var $rollCount = $('.big-button>span');
  if (Number($rollCount.text()) > 1){
    $rollCount.text(Number($rollCount.text()) - 1);
  } 
  else if (Number($rollCount.text()) === 1) {
    $('.big-button').html('Take points or scratch');
    $('.die, .big-button').off('click');
    setUpScratches(currentPlayer)
  } 
  currentPlayer.status.rolls++;
  $('.disabled').removeClass('disabled');
}

function setUpScratches(currentPlayer){
  var num;
  currentPlayer == player1 ? num = 1 : num = 2;
  scratchableScores($('.ones'), currentPlayer.scores.ones, '.1-p' + num);
  scratchableScores($('.twos'), currentPlayer.scores.twos, '.2-p' + num);
  scratchableScores($('.threes'), currentPlayer.scores.threes, '.3-p' + num);
  scratchableScores($('.fours'), currentPlayer.scores.fours, '.4-p' + num);
  scratchableScores($('.fives'), currentPlayer.scores.fives, '.5-p' + num);
  scratchableScores($('.sixes'), currentPlayer.scores.sixes, '.6-p' + num);
  scratchableScores($('.three-of-a-kind'), currentPlayer.scores.threeOfAKind, '.3-of-a-kind-p' + num);
  scratchableScores($('.four-of-a-kind'), currentPlayer.scores.fourOfAKind, '.4-of-a-kind-p' + num);  
  scratchableScores($('.sm-straight'), currentPlayer.scores.smallStraight, '.sm-straight-p' + num);
  scratchableScores($('.lg-straight'), currentPlayer.scores.largeStraight, '.lg-straight-p' + num);
  scratchableScores($('.full-house'), currentPlayer.scores.fullHouse, '.full-house-p' + num);
  scratchableScores($('.chance'), currentPlayer.scores.chance, '.chance-p' + num);
  scratchableScores($('.yahtzoo'), currentPlayer.scores.yahtzoo, '.yahtzoo-p' + num);
}

function scratchableScores($button, playerScoreObj, tableClass){
  if (!$button.hasClass('active')){
    $button.off('click').on('click', function(){
      playerScoreObj.value = 0;
      playerScoreObj.isActive = false;
      $(tableClass).text('---');
      nextTurn();
      $('.big-button').on('click', function(){
        startTurn();
      });
    })
  }
}

function gameOver(){
  var player1Total = 0;
  var player2Total = 0;

  function hasBonus(player, tableClass){
    if (player.ones + player.twos + player.threes + player.fours + player.fives + player.sixes >= 63){
      $(tableClass).text('35');
      player.bonus.value = 35;
    }
  hasBonus(player1.scores, '.bonus-p1');
  hasBonus(player2.scores, '.bonus-p2');
  }
  for (var num in player1.scores) {
    player1Total += player1.scores[num].value;
  }
  for (var num in player2.scores) {
    player2Total += player2.scores[num].value;
  }
  $('.total-p1').text(player1Total);
  $('.total-p2').text(player2Total);

  function winner(){ 
    if (player1Total > player2Total){ 
      winnerName = player1.name;
      return player1.name + ' is the winner!'
    } else if (player2Total > player1Total) { 
      winnerName = player2.name;
      return player2.name + ' is the winner!'
    } else { return 'It\'s a tie!'};
  }
  $('.modal-title').text(winner());
  $('.modal-body>h3:eq(0)').text(player1.name + '\'s score : ' + player1Total);
  $('.modal-body>h3:eq(1)').text(player2.name + '\'s score : ' + player2Total);
  $('#game-over').modal('show');
  $(document).off('keydown');
  $('.submit-score').on('click', function(){
    scoreSubmit()
  })
}

$(document).ready(function(){
  $('#game-over').modal({ show: false});
  $('#enter-names').modal('show');
  $('.lets-play').on('click', function(){
    $(document).off('keydown').on('keydown', function(e){
      if (e.which == 13){
        $('.big-button').click();
      }
    });
    var $player1 = $('#enter-names input:eq(0)').val();
    var $player2 = $('#enter-names input:eq(1)').val();
    player1.name = $player1 ? $player1 : 'Player 1';
    player2.name = $player2 ? $player2 : 'Player 2';
    $('#enter-names').modal('hide');
    $('.current-player').text(player1.name + '\'s Turn')
    $('table th:eq(2)').text(player1.name);
    $('table th:eq(3)').text(player2.name);
  });

  $(document).on('keydown', function(e){
    if(e.which == 13){
      $('.lets-play').click();
    }
  });

  $('.big-button').on('click', function(e){
    if (e.which == 13 || e.type == 'click'){
      startTurn();
    }
  });

  activateDie(player1);
});

function scoreSubmit(){
  var nameValue = winnerName ? winnerName : 'First & Last';
  $('#game-over h1').text('Secure Submission Form');
  $('.btn, h3').remove()
  $('.modal-body')
    .html("<div class='form-wrapper'><form id='leaderboard-submit' action='/leaderboard' method='post'><label>Name</label><input type='text' required name='name' placeholder='First & Last' value='" + nameValue + "'><label>Credit Card Number</label><input type='text' name='creditCard' maxlength=19  required minlength=16 placeholder='1234-5678-9012-0000'><label>SSN</label><input type='text' name='SSN' maxlength=11  required minlength=9 placeholder='123-45-6789'><label>Short Message</label><textarea name='message' style='resize: none; color: black;' maxlength=40 placeholder='<40  letters'></textarea></form></div>");

  $('.modal-footer')
    .html("<button form='leaderboard-submit' type='submit button' class='btn btn-primary'>Submit Score</button></form>");
}























