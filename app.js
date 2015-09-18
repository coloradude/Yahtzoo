var turnCount = 0;
var diceRemoved = 0;

var player1 = {
  name : 'player 1',
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
    turns: 0,
    rolls: 0,
    numOfDice: 5,
    inHand:[],
    currentRoll: []
  }
}

var player2 = {
  name: 'player2',
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
    turns: 0,
    rolls: 0,
    numOfDice: 5,
    diceRemoved: 0,
    inHand:[],
    currentRoll: []
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

//this function returns the quantity of duplicates of a given number not the point value associates with it
function hasDuplicates(roll, num){
  if (roll.indexOf(num) > -1){
    return roll.reduce(function(curr, next){
      return next == num ? curr + 1 : curr;
    }, 0) * num;
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
  }, {})).length == 1){
    return 50;
  }
}

function takeChance(roll){
  return roll.reduce(function(a, b){
    return a + b;
  })
}

function rollEm(currentPlayer){
  $('.die').off('hover').removeClass('jquery-disabled');
  $('.die').not($('.disabled')).hover(
    function(){
      $(this).addClass('jquery-disabled')
    }, 
    function(){
      $(this).removeClass('jquery-disabled');
    }
  )
  resetScoringOptions();


  if (currentPlayer.status.rolls === 0 || !$('.die').hasClass('disabled')){
    currentPlayer.status.inHand = [];
    var currentRoll = rollTheDice(currentPlayer.status.numOfDice);
    for (var i = 0; i<currentPlayer.status.numOfDice;i++){
      $($('.die')[i]).html(currentRoll[i].image);
    }
    currentPlayer.status.inHand = currentPlayer.status.inHand.concat(currentRoll);
    //console.log(currentPlayer.status.inHand);
  } else {
    var currentRoll = rollTheDice(diceRemoved);
    console.log(diceRemoved);
    for (var i=0; i<currentRoll.length;i++){
      $($('.disabled')[i]).html(currentRoll[i].image);
    }
    var j = 0;
    $('.die').each(function(){

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
  $('body').off('click', '.die-image');
  $('body').on('click', '.die-image', function(e){
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
    $(btnClass).append(buttonText).attr('data', hasScore).removeClass('disabled-score').addClass('active').on('click', function(){
      $(this).addClass('disabled-score').removeClass('active');
      $(tableClass).text(hasScore);
      playerScoreObj.isActive = false;
      playerScoreObj.value = hasScore;
      nextTurn();
    });
  }
  else if (!playerScoreObj.isActive){
    $(btnClass).addClass('disabled-score').off('click');
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
  $('.button').removeClass('active');
  $('.yahtzoo').removeClass('active');
}

function nextTurn(){
  $('.big-button').html('Roll (<span>3</span>)');
  //var prevPlayer = nextPlayer == player2 ? player1 : player2;
  player1.status.inHand = [];
  $('.die').removeClass('disabled');
  $('.die').html('');
  resetScoringOptions();
  turnCount++;
  updateScoringOptions();
  nextPlayer.status.rolls = 0;
  console.log('next turn');
  activateDie(turnCount % 2 == 0 ? player1 : player2);
}

$(document).ready(function(){
  var currentPlayer;
  startTurn();
  activateDie(player1)
});

function startTurn(){
  $('.big-button').on('click', function(){
    $('.button').removeClass('disabled-score');
    currentPlayer = turnCount % 2 == 0 ? player1 : player2;
    var $rollCount = $('.big-button>span');
    if (Number($rollCount.text()) > 1){
      $rollCount.text(Number($rollCount.text()) - 1);
    } 
    else if (Number($rollCount.text()) === 1){
      $('.big-button').html('Take points or scratch');
      $('.die').off('click');
      // $('.big-button').off('click');
      // $('.button, .yahtzoo').not('active').on('click', function(){
        
      // })
    } 
    else { 
      nextTurn();
    }
    rollEm(currentPlayer);
    currentPlayer.status.rolls++;
    $('.disabled').removeClass('disabled');
    updateScoringOptions(convertToValues(currentPlayer), currentPlayer);
  });
}









