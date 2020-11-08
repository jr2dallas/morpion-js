/*********************************************************************************/
/* PARTIE OUTILS / TOOLS */
/*********************************************************************************/

var ANIMATION_TYPE_ERROR = 1
var ANIMATION_TYPE_WIN = 2

/**
 * Convertir une position en une coordonnée [x,y]
 * 
 * @param {int} index Index dans la grille
 */
function indexToCoord(index){

    var result = index / HEIGHT

    var x = Math.floor(result)

    var y = Math.round((result - x) * HEIGHT)

    return {"x" : parseInt(x), "y" : parseInt(y)}
}

/**
 * Convertir une coordonnée [x,y] en une position
 * 
 * @param {int} x Coordonnée X
 * @param {int} y Coordonnée Y
 */
function coordToIndex(x, y){

    return (x * (WIDTH)) + y
}

 /**
  * Extraire le numéro de la cellule id (entre 0 et 8, ex: id=cell_3 => la fonction retourne 3)
  * 
  * @param {String} id Cellule Id
  */
 function extractCellNumber(id){
    // retire le prefixe 'cell_' (HTML_CELL_ID_PREFIX)
   return parseInt(id.substr(HTML_CELL_ID_PREFIX.length))
}


function animateArrayElements(data, animationType){
    for (i = 0; i < data.length; i++){
        animateElement(data[i], animationType)
    }
}

/**
 * Faire clignoter la cellule cellNumber avec la classe badge-danger
 * 
 * @param {int} cellNumber  index d'une cellule
 */
function animateElement(cellNumber, animationType){

    var element = $('#' + HTML_CELL_ID_PREFIX + cellNumber)
    if(element == undefined)
        return

    
    var animationClass = animationType == ANIMATION_TYPE_ERROR ? "danger" : "info"

    console.log("Animation element " + cellNumber + ", type: " + animationClass)


    element
        .fadeOut(200)
        .fadeIn(200)
        .toggleClass("badge-" + animationClass)
        .fadeOut(200)
        .fadeIn(200, function (){
            element.removeClass("badge-" + animationClass)
        })


}