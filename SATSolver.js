/*SAT Solver*/

exports.solve = function(fileName) {
  let formula = readFormula(fileName)
  let result = doSolve(formula.clauses, formula.variables)
  console.log(result) // two fields: isSat and satisfyingAssignment
}
var cont = 0;
var checker = true;
// Receives the current assignment and produces the next one
function nextAssignment(currentAssignment) {
  // implement here the code to produce the next assignment based on currentAssignment. 
  var curAssString = currentAssignment.join('');
  // Converte todo Array currentAssignment para uma única String currAssString
  var decimal = parseInt(curAssString, 2);
  // Converte para decimal
  var binario = (decimal + 1).toString(2);
  // Converte para binário
  var x = binario.length;
  // Auxiliar para usar dentro do for
  for (var i = curAssString.length-x; i > 0 ; i--) {
    // For usado para adicionar a quantidade de "0" necessários à esquerda, caso falte algum
    binario = '0' + binario;
  }

  if (cont == Math.pow(2, currentAssignment.length)) {
    checker = false;
  }
  var newAssignment = [];
  newAssignment = binario.split('');
  // Converte de volta para array
  return newAssignment
}

function doSolve(clauses, assignment) {
  let isSat = false;
  let boolean = false;
  var trier = [];
  while ((!isSat) && (checker)/* must check whether this is the last assignment or not*/) {
    // does this assignment satisfy the formula? If so, make isSat true.
    for (var i = 0; i <assignment.length; i++) {
     if  (assignment[i] == 0){
      trier[i] = false;
     } else if (assignment[i] == 1) {
      trier[i] = true;
     }
    }

    var booleanVar = true, bool1, bool2 = false;
    while (booleanVar){
      for (var i = 0; i < clauses.length; i++) {
        for (var j = 0; j < clauses[i].length; j++) {
          var arrayAux = [];
          arrayAux = clauses[i];
          if ((charAt(arrayAux[j]) < 0) && (trier[j] === true)) {
            // Se o número for negativo (negado), a booleana em trier[] é invertida
            trier[j] = false;
          } else if ((charAt(arrayAux[j]) < 0) && (trier[j] === false)){
            // Se o número for negativo (negado), a booleana em trier[] é invertida
            trier[j] = true;
          } else if ((charAt(arrayAux[j]) > 0)) {
            // Se não, apenas continua
            continue
          }
        }
        for (var k = 0; k < trier.length; k++) {
          if (trier[k] === true) {
            /* Se houver ao menos um true na expressão V (or), a booleana se mantém true
            E passa para a próxima cláusula de comparação */
            booleanVar = true;
            break;
          } else if (trier[k] === false) {
            // Porém se só houver false, a booleana muda para false e será pedido um novo assignment
            booleanVar = false;
          }
        }
        if (i == 0) {
          bool1 = true;
        } else {
          bool2 = true;
          
        }
        if (bool1 === bool2) {
          bool1 = bool2
          bool2 = false
        } else {
          booleanVar = false
        }

      }
      if (checker) {
        isSat = true;
      }
    }
    // if not, get the next assignment and try again.
    cont++; 
    assignment = nextAssignment(assignment)
  }
  assignment = trier;
  let result = {'isSat': isSat, satisfyingAssignment: null}
  if (isSat) {
    result.satisfyingAssignment = assignment
  }
  return result
}

function readClauses(text){
  // This funcition should read all the clauses ant put them together into an Array
  var clauses = [];
  var numberClauses, numberVariables,c = 0;

  for (var i = 0; i < text.length; i++) {
    if (text[i].indexOf("p") == 0) {
      continue
    } else if (text[i].indexOf("c") == 0) {
      continue
    } else if (text[i] !== null) {
      // Não faz nada se encontrar p ou c, qualquer coisa fora isso (e diferente de null) é pra ser armazenada
      clauses[i] = text[i];
    }
  }
  return clauses
} 

function readVariables(clauses){
  var numberVariables = [];
  var aux = " ";
  for (var i = 0; i < clauses.length; i++) {
    /* Isso aqui vai ser usado pra organizar o aray caso ele venha com quebra de linha
    Acho que só vou usar isso no checkProblemSpecification, mas tudo bem hehe 
    Aproveito e já uso aqui pra ter certeza que o array que eu vou devolver está do tamanho correto */
    if (clauses[i].indexOf(0) > 0) {
      // Se a linha do array terminar com 0, tudo bem
      numberVariables = clauses[i];
    } else if (clauses[i].indexOf(0) < 0) {
      // Se ela não terminar com zero, armazena em uma variável auxiliar
      aux = clauses[i];
    } else if ((clauses[i].indexOf(0) > 0) && (aux != " ")) {
      /* Se ela terminar com se ela terminar com zero mas a variável auxiliar não estiver vazia
      Significa que a linha anterior não estava correta, então eu junto a atual com a anterior */
      numberVariables = aux + clauses[i];
    }
  }
  for (var i = 0; i < numberVariables.length; i++) {
    // Aqui eu coloco todos os valores da array pra 0 (zero/falso)
    numberVariables[i] = 0;
  }
  return numberVariables
}

function checkProblemSpecification(text, clauses, variables){
  var arrayZ = [];
  var nV, nC;
  var boolean = true;

  for (var i = 0; i < text.length; i++) {
    if (text[i].indexOf("p") == 0) {
      arrayZ = text[i].split(" ", 4)
      nV = arrayZ[2];
      nC = arrayZ[3];
    } else if (text[i].indexOf("p") < 0) {
      boolean = false;
    }
  }
  // Aqui checa se o número de cláusulas bate
  if (nC == clauses.length) {
    continue
  } else {
    boolean = false
  }
  // Aqui checa se o número de variáveis bate
  if (nV == variables.length) {
    continue
  } else {
    boolean = false
  }
  return boolean
}

function readFormula(fileName) {
  // To read the file, it is possible to use the 'fs' module. 
  // Use function readFileSync and not readFile. 
  // First read the lines of text of the file and only afterward use the auxiliary functions.
  var fs = require('fs');
  var useless = ''+fs.readFileSync('./simple0.cnf');
  let text = useless.split('\n');// = ...  //  an array containing lines of text extracted from the file. 
  let clauses = readClauses(text);
  let variables = readVariables(clauses);
  // In the following line, text is passed as an argument so that the function
  // is able to extract the problem specification.
  let specOk = checkProblemSpecification(text, clauses, variables);
  let result = { 'clauses': [], 'variables': [] };

  if (specOk) {
    result.clauses = clauses;
    result.variables = variables;
  }
  return result
}