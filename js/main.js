$(document).ready(function() {

  //Initi tooltip
  $(function() {
    $('.inittooltip').tooltip()
  });

/*
[['a','b','c'],['0','1'],[[['a'],'0',['b']],[['a'],'1',['a']],[['b'],'0',['a','c']],[['c'],'0',['c']],[['c'],'1',['a']]],'b',['c']]
*/

  //Parse input string and return an array of transitions object
  /*Transition Object Format
  {
    "name": <State Name>,
    <First Alphabet> : <Array of Output States Based On First Alphabet Input>,
    <First Alphabet> : <Array of Output States Based On Second Alphabet Input>,
    <Subsequent Alphabet> : <Array of Output States Based On Subsequent Alphabet Input>,
  }
  */
  function parseTransitions(states, alphabets, input) {
    let transitions = [];

    states.forEach(function(state) {
      let tempState = {
        name: state
      };
      alphabets.forEach(function(item) {
        tempState[item] = [];
        input.forEach(function(array) {
          if (array[0] == state && array[1] == item) {
            tempState[item] = array[2];
          }
        })
      })
      transitions.push(tempState);
    });
    console.log(transitions);
    return transitions;
  }


  //Generate automation graph, type can be NFA or DFA
  //Using vis.js library (Javascript wrapper for Graphviz)
  //https://github.com/mdaines/viz.js
  //https://graphviz.gitlab.io/about/
  function renderGraph(type, startState, finalStates, transitions) {

    let graphString = "rankdir=LR;bgcolor=transparent;  start [shape=circle,color=white,fontcolor=white]; start ->" + startState + " ;";

    transitions.forEach(function(transition) {
      if (finalStates.includes(transition.name)) {
        graphString = graphString + '"' + transition.name + '" [shape=doublecircle];';
      } else {
        graphString = graphString + '"' + transition.name + '" [shape=circle];';
      };
      for (var key in transition) {
        if (transition.hasOwnProperty(key) && key != "name") {
          transition[key].forEach(function(output) {
            if ( output == "" ){
              output = "Ø";
            }
            graphString = graphString + '"' + transition.name + '" -> "' + output + '" [label = "' + key + '"];';
          });
        }
      };
    });

    let viz = new Viz();
    viz.renderSVGElement('digraph G {' + graphString + '}')
      .then(function(element) {
        $('#' + type + 'Container').html(element);
      });
    console.log(graphString);
  };


  //Generate HTML Table for transitions
  //Type can be "NFA" or "DFA".
  function generateTable(type, startState, finalStates, transitions, alphabets) {
    let alphabetHeader = '<th scope="col">#</th>';
    alphabets.forEach(function(alphabet) {
      alphabetHeader = alphabetHeader + '<th scope="col">' + alphabet + '</th>';
    });
    alphabetHeader = alphabetHeader + '<th scope="col">Start State</th><th scope="col">Accept State</th>'
    let tableBody = "";
    transitions.forEach(function(trans) {
      tableBody = tableBody + '<tr><th scope="row">' + trans.name + '</th>';
      alphabets.forEach(function(alphabet) {
        tableBody = tableBody + '<td>{' + trans[alphabet].toString() + '}</td>';
      });
      let isAccept = "";
      if (trans.name == startState){
        isAccept = '<img src="images/approve.png" alt="">';
      }
      tableBody = tableBody + '<td class="center">'+isAccept+'</td>';
      let isFinal = "";
      finalStates.forEach(function(final){
        if (trans.name.match(new RegExp(final.toString(), 'g'))){
          isFinal = '<img src="images/approve.png" alt="">';
        }
      })
      tableBody = tableBody + '<td class="center">'+isFinal+'</td>';
    });
    tableBody = tableBody.replace(/{}/g, "&Oslash;");
    $('#' + type + 'TableContainer').html(
      '<table class="table table-bordered">' +
      '<thead>' +
      '<tr>' +
      alphabetHeader +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      tableBody +
      '</tbody>' +
      '</table>'
    );
  };

  //Generate Powerset array for the states
  function generatePowerSet(array) {
    let result = [];
    result.push(["Ø"]);

    for (var i = 1; i < (1 << array.length); i++) {
      let subset = [];
      for (var j = 0; j < array.length; j++)
        if (i & (1 << j))
          subset.push(array[j]);
      result.push(subset);
    }
    return result;
  }

  function getTransition (state, transitions, targetAlphabet){
    let result = [];
    transitions.forEach(function(transition){
      if (transition.name == state){
        result = transition[targetAlphabet];
      }
    })
    return result;
  }

  //Convert NFA To DFA
  //Add additional states to the transitions array and return the array
  function convertNFAToDFA(states, transitions, alphabets) {
    let newTransition = [];

    states.forEach(function(item){
      let tempState = {
        name: item.toString()
      }
      alphabets.forEach(function(alphabet){
        let outputArray = [];
        item.forEach(function(state){
            let tempArray = getTransition (state, transitions, alphabet);
            outputArray = outputArray.concat(tempArray);
        })
        tempState[alphabet] = [[ ...new Set(outputArray) ].sort().toString()];
      })
      newTransition.push(tempState);
    });
    console.log(newTransition);
    return newTransition;
  }



  //Determine new final state based on the newly generated transition table
  function determineNewFinalState(newStates, finalStates) {
    console.log(newStates);
    let output = [];
    newStates.forEach(function(item){
      finalStates.forEach(function(state){
        if (item.toString().match(new RegExp(state, 'g'))){
          output.push(item.toString());
        }
      })
    })
    return output;
  }


  //Main Function
  function main(input) {

    let states = input[0];
    let alphabets = input[1];
    let startState = input[3];
    let finalStates = input[4];
    let transitions = parseTransitions(states, alphabets, input[2]);

    renderGraph("NFA", startState, finalStates, transitions);
    generateTable("NFA", startState, finalStates, transitions, alphabets);
    let newStates = generatePowerSet(states);
    let newTransitions = convertNFAToDFA(newStates, transitions, alphabets);
    let newFinalStates = determineNewFinalState(newStates, finalStates);
    generateTable("DFA", startState, newFinalStates, newTransitions, alphabets);
    renderGraph("DFA", startState, newFinalStates, newTransitions);

  }


  //Bind HTML elements to JS functions.
  $('#btn-reset').click(function() {
    location.reload();
  });

  $('#btn-convert').click(function() {
    let input = JSON.parse($('#txt-input').val().replace(/'/g, '"'));
    console.log(input);
    main(input);
  });

});
