# NFA To DFA Converter
Transform Non-Deterministic Finite Automata (NFA) to Deterministic Finite Automata (DFA) via the Subset Construction Algorithm. https://kotaksempit.github.io/NFA-to-DFA-converter/

This is an assignment for TIC2151-Theory Of Computations subject. Multimedia University. 

Mohammad Syuhada Bin Abd Rahman - 1131122416. 

## User Input

The input is a formal definition of NFA, represented in an array form. The example as below: 
```
[
  ['z0','z1'],                       # Set of states
  ['0','1'],                         # Set of input symbols
  [                                  
    [['z0'],'0',['z0','z1']],        # Transitions Functions
    [['z0'],'1',['z1']],             # [[Input State], Input Symbol, [Output State]]
    [['z1'],'0',[]],
    [['z1'],'1',['z0','z1']]
  ],
  'z0',                              # Initial state
  ['z1']                             # Set of accepting states
]
```

## Built With

* Using [vis.js](https://github.com/mdaines/viz.js) - library (Javascript wrapper for Graphviz)
