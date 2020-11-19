
/******************************/
/* MAIN GUI
*******************************/

/////////////////
// Constantes
/////////////////

// id Html de la case
const HTML_CELL_ID_PREFIX = "cell_"

// signe Html Neutre (personne n'a encore joué)
const HTML_CELL_NEUTRAL = "!?"

/////////////////
// Variables globales
/////////////////

// assigner les symboles aux joueurs
var joueur1 = CROSS
var joueur2 = CIRCLE

// tour du joueur
var currentPlayer = joueur1

// tour du joueur (pair = joueur1, impaire = joueur2) 
// @todo petit 'hack' pas très propre, il faudrait peut-être trouver autre chose
var turn = 0

// déclarer en variable globale la grille du jeu (on l'initialise plus tard)
var gameData = []

// Optenir l'élément Html qui représente le joueur courant
var currentPlayerInsign = document.getElementById("currentPlayerInsign")

/////////////////
// MAIN 
////////////////
main(currentPlayer)



/**
 * on initialise et on créé un écouteur sur les cellules de la grille du jeu
 * 
 * @param {*} currentPlayer 
 */
function main(currentPlayer){

    // initialiser le jeu
    initialize(currentPlayer)

    // Binder les cellules
    // cf: écouter le click sur chaque cellule et lors du click déclencher la fonction onCellClick()
    bindAllCells();
}

/**
 * créer une fonction pour regrouper la logique d'initialisation
 * 
 * @param {*} currentPlayer 
 */
function initialize(currentPlayer){

    // réinitialiser la grille gameData
    gameData = initializeData(gameData, WIDTH, HEIGHT)

    // [debug] afficher la grille en console
    displayGrid(gameData)

    // réinitialiser la grille Html
    initializeHTML()

    // réinitialiser le numéro de tour
    turn = 0

    updatePlayerTurnHtml(currentPlayer)
}

/**
 * Evenement reçu lorsque l'utlisateur clic sur fermer la modal
 * On termine le jeu et on réinitialise tout
 */
$('#morpion-result-win, #morpion-result-no-winner').on('hidden.bs.modal', function () {

    // réinitialiser le jeu
    initialize(currentPlayer)
  })


/**
 * Lorsque l'utilisateur clique sur une case, on déclenche la fonction onCellClick()
 */
function bindAllCells(){
    for(i = 0; i < 9; i++){

        // obtenir l'element Html cell_i
        var id = HTML_CELL_ID_PREFIX + i
        var elt = document.getElementById(id)

        // dès que l'utilisateur clique sur la cellule, on appelle la fonction onCellClick()
        elt.onclick = onCellClick
    }
}

/**
 * Mettre à jour le symbole du joueur courant dans le Html
 * 
 * @param {String} currentPlayer Symbole du joueur courant
 */
function updatePlayerTurnHtml(currentPlayer){

    if(currentPlayer == CROSS){
        currentPlayerInsign.classList.remove('badge-success')
        currentPlayerInsign.classList.add('badge-warning')
    }

    if(currentPlayer == CIRCLE){
        currentPlayerInsign.classList.remove('badge-warning')
        currentPlayerInsign.classList.add('badge-success')
    }

    currentPlayerInsign.innerHTML = currentPlayer
}



/**
 * Afficher la modale Winner pour le joueur gagnant, sinon afficher la modal de partie Neutre
 */
function manageEndOfGame(){

    var joueurGagnant = NEUTRAL

    // Le joueur 1 a gagné ?
    if(hasWon(gameData, joueur1))
        joueurGagnant = joueur1
        
    // Le joueur 2 a gagné ?
    if(hasWon(gameData, joueur2))
        joueurGagnant = joueur2

    // Personne n'a gagné ?
    if(joueurGagnant == NEUTRAL){
        // Afficher la modal personne n'a gagné
        $('#morpion-result-no-winner').modal()

        return
    }

    // Obtenir les cellules gagnantes
    var values = getWinCellIndices(gameData, joueurGagnant)
    // Animer les cellules
    animateArrayElements(values, ANIMATION_TYPE_WIN)

    // Afficher une modal avec le joueur en gagnant
    $('#morpion-result-win .winnerInsign').text(joueurGagnant)
    $('#morpion-result-win').modal()
}

/**
 * Lorsqu'une Cellule e, a été cliquée alors:
 * 
 *  - On récupère le numéro de la cellule via son Id (ex: cell_3 => 3)
 *  - On convertit ce numéro de cellule en coordonnée [x,y] (ex: 3 = [0,1])
 *  - On vérifie si la position est disponible, sinon l'utilisateur recommence
 *  - Enregistrer le choix du joueur dans gameData
 *  - Mettre à jour la grille Html en fonction du choix du joueur
 *  - Passer au joueur suivant en incrémenant turn
 *  - Mettre à jour l'affichage Html de ce joueur suivant
 *  - Vérifier que c'est une fin de partie ou pas
 * 
 *  @todo fonction trop grosse
 * 
 * @param {Element} e Cellule Html cliquée
 */

function onCellClick(e){

    // Récupérer l'Id de la cellule (exemple cell_3)
    var cellId = e.srcElement.id

    // récupérer le joueur courant en fonction du numéro de tour (turn pair => joueur1, turn impaire => joueur2)
    currentPlayer = turn % 2 == 0 ? joueur1 : joueur2;

    // extraire le numéro de la cellule cliquée (entre 0 et 8, ex: cell_3 => 3)
    var cellNumber = extractCellNumber(cellId)

    // convertir en coordonnée [x,y]
    var value = indexToCoord(cellNumber)

    // [debug] Afficher en console le choix du joueur
    console.log("[debug] Player want to play: ", value)


    // est-ce que la case choisie est disponible ?
    // si ce n'est pas une case vide, alors on revient au début de la boucle sur le même joueur
    if(!isFreePosition(gameData, value.x, value.y)){

        console.log("Cette position n'est pas disponible ["+value.x+"]["+value.y+"]", gameData)

        // afficher la grille pour rappel
        displayGrid(gameData)


        // [gadget] faire clignoter la cellule cellNumber pour montrer à l'utilisateur qu'il s'est trompé
        animateElement(cellNumber, ANIMATION_TYPE_ERROR)

        // c'est toujours à lui de jouer
        return
    }

    // Enregistrer le choix du joueur 
    gameData = playThis(currentPlayer, gameData, value.x, value.y)

    // [debug] afficher la nouvelle grille
    console.log("[debug] afficher la grille ...")
    displayGrid(gameData)

    // mettre à jour la cellule HTML
    updateCellHTML(currentPlayer, cellId)

    // tour suivant
    turn ++

    // récupérer le joueur suivant en fonction du numéro de tour (turn pair => joueur1, turn impaire => joueur2)
    var nextPlayer = turn % 2 == 0 ? joueur1 : joueur2;

    // afficher le tour du joueur suivant
    updatePlayerTurnHtml(nextPlayer)

    // si la partie n'est pas terminée, on continue
    if(!isEndOfTheGame(gameData, joueur1, joueur2))
        return
    

    // la partie est terminée, on avertit le joueur gagnant ou le match null
    manageEndOfGame(gameData, joueur1, joueur2)
}


/**
 * RAZ de toutes les case + tour du joueur revient à joueur1 (X)
 */
function initializeHTML(){
    for(x = 0; x < WIDTH; x++){
        for(y = 0; y < HEIGHT; y++){
            var cell = document.getElementById(HTML_CELL_ID_PREFIX + coordToIndex(x, y))
            cell.innerHTML = HTML_CELL_NEUTRAL
            cell.classList.remove('badge-warning')
            cell.classList.remove('badge-success')
            cell.classList.add('badge-primary')
        }
    }

    currentPlayerInsign.innerHTML = joueur1
    currentPlayerInsign.classList.add('badge-warning')
}

/**
 * Met à jour le contenu et le CSS d'une cellule [x,y] pour le joueur 'player'
 * 
 * @param {String} player Symbole du joueur
 * @param {int} x Coordonnée X
 * @param {int} y Coordonnée Y
 */
function updateCellHTML(player, cellId){

    // Optenir l'élément Html via son Id (ex: cell_3)
    var cell = document.getElementById(cellId)

    // Mettre à jour le contenu de la cellule (symbole du joueur)
    cell.innerHTML = player

    // mettre à jour le CSS
    if(player == CROSS)
    {
        cell.classList.remove('badge-primary')
        cell.classList.add('badge-warning')

    }else{
        cell.classList.remove('badge-primary')
        cell.classList.add('badge-success')
        
    }
}



