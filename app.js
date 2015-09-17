var turnCount = 0;

var player1 = {
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

var player2 = {
  score: {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    threeOfAKind: 0,
    fourOfAKind: 0,
    fullHouse: 0,
    smallStraight: 0,
    largeStraight: 0,
    chance: 0,
    yahtzoo: 0
  },
  status: {
    turns: 0,
    rolls: 3,
    numOfDice: 5,
    inHand: [],
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
  return roll.reduce(function(curr, next){
    return next == num ? curr + 1 : curr;
  }, 0) * num;
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
  return Object.getOwnPropertyNames(roll.reduce(function(obj, val){
    obj[val] = obj[val] + 1 || 1;
    return obj;
  }, {})).length == 1;
}

function takeChance(roll){
  return roll.reduce(function(a, b){
    return a + b;
  })
}

function rollEm(){
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
  if (player1.status.rolls === 0 || !$('.die').hasClass('disabled')){
    player1.status.inHand = [];
    var currentRoll = rollTheDice(player1.status.numOfDice);
    for (var i = 0; i<player1.status.numOfDice;i++){
      $($('.die')[i]).html(currentRoll[i].image);
    }
    player1.status.inHand = player1.status.inHand.concat(currentRoll);
  } else {
    var currentRoll = rollTheDice(player1.status.diceRemoved);
    for (var i=0; i<currentRoll.length;i++){
      $($('.disabled')[i]).html(currentRoll[i].image);
    }
    var j = 0;
    $('.die').each(function(){
      if ($(this).hasClass('disabled')){
        var atId = $(this).index();
        player1.status.inHand.splice(atId, 1, currentRoll[j]);
        j++;
      }
    })
  }
  player1.status.diceRemoved = 0;
}

function activateDie(){
  $('body').on('click', '.die-image', function(e){
    $(this).parent().hasClass('disabled') ? player1.status.diceRemoved-- : player1.status.diceRemoved++;
    $(this).parent().toggleClass('disabled');
  });
}

function convertToValues(player){
  return player.status.inHand.reduce(function(curr, next){
      curr.push(next.value);
      return curr;
    }, []);
}

function updateScoringOptions(currentRoll){
 
  updatePoints(hasDuplicates(currentRoll, 1), player1, '.ones', ' (' + hasDuplicates(currentRoll, 1) + ')', '.1-p1', player1.scores.ones);
  updatePoints(hasDuplicates(currentRoll, 2), player1, '.twos', ' (' + hasDuplicates(currentRoll, 2) + ')', '.2-p1', player1.scores.twos);
  updatePoints(hasDuplicates(currentRoll, 3), player1, '.threes', ' (' + hasDuplicates(currentRoll, 3) + ')', '.3-p1', player1.scores.threes);
  updatePoints(hasDuplicates(currentRoll, 4), player1, '.fours', ' (' + hasDuplicates(currentRoll, 4) + ')', '.4-p1', player1.scores.fours);
  updatePoints(hasDuplicates(currentRoll, 5), player1, '.fives', ' (' + hasDuplicates(currentRoll, 5) + ')', '.5-p1', player1.scores.fives);
  updatePoints(hasDuplicates(currentRoll, 6), player1, '.sixes', ' (' + hasDuplicates(currentRoll, 6) + ')', '.6-p1', player1.scores.sixes);
  updatePoints(has_OfAKind(currentRoll, 3), player1, '.three-of-a-kind', ' (' + has_OfAKind(currentRoll, 3) + ')', '.3-of-a-kind-p1', player1.scores.threeOfAKind);
  updatePoints(has_OfAKind(currentRoll, 4), player1, '.four-of-a-kind', ' (' + has_OfAKind(currentRoll, 4) + ')', '.4-of-a-kind-p1', player1.scores.fourOfAKind);
  updatePoints(hasFullHouse(currentRoll), player1, '.full-house', ' (25)', '.full-house-p1', player1.scores.fullHouse);
  updatePoints(hasStraight(currentRoll, 'small'), player1, '.sm-straight', ' (30)', '.sm-straight-p1', player1.scores.smallStraight);
  updatePoints(hasStraight(currentRoll, 'large'), player1, '.lg-straight', ' (40)', '.lg-straight-p1', player1.scores.largeStraight);
  updatePoints(takeChance(currentRoll), player1, '.chance', ' (' + takeChance(currentRoll) + ')', '.chance-p1', player1.scores.chance);
  updatePoints(hasYahtzoo(currentRoll), player1, '.yahtzoo', ' (50)', '.yahtzoo-p1', player1.scores.yahtzoo);

}

function updatePoints(hasScore, player, btnClass, buttonText, tableClass, playerScoreObj){
  if (hasScore && playerScoreObj.isActive){
    $(btnClass).append(buttonText).attr('data', hasScore).addClass('active').on('click', function(){
      $(this).addClass('disabled-score').removeClass('active');
      $(tableClass).text(hasScore);
      playerScoreObj.isActive = false;
      playerScoreObj.value = 50;
      nextTurn();
    });
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
  player1.status.inHand = [];
  $('.die').removeClass('disabled');
  $('.die').html('');
  resetScoringOptions();
  turnCount++;
}

$(document).ready(function(){

  $('.big-button').on('click', function(){
    var $rollCount = $('.big-button>span');
    if (Number($rollCount.text()) > 1){
      $rollCount.text(Number($rollCount.text()) - 1);
    } 
    else if (Number($rollCount.text()) === 1){
      $('.big-button').html('Next turn');
      $('.die').off('click');
    } 
    else { 
      nextTurn();
    }

    rollEm();
    console.log(player1.status.inHand)
    player1.status.rolls++;
    $('.disabled').removeClass('disabled');
    updateScoringOptions(convertToValues(player1));
  });
  activateDie();
});











