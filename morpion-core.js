/******************************/
/* CORE 
*******************************/


// Largeur et hauteur de la grille
WIDTH = 3
HEIGHT = 3

// Symboles des joueurs + le neutre
CROSS = "X"
CIRCLE = "O"
NEUTRAL = "-"


/**
 * Initialiser le tableau du morpion avec des valeurs Neutre (= NEUTRAL)
 * 
 * @param {Array} data Grille morpion
 * @param {int} width Largeur de la grille
 * @param {int} height Hauteur de la grille
 */
function initializeData(data, width, height){
    console.debug("[debug] initialiser la grille ...")
    data = new Array()
    for(x = 0; x < height; x++){
        data[x] = new Array()
        for(y = 0; y < width; y++){
            data[x][y] = NEUTRAL;
        }
    }
    return data;
}

/**
 * Afficher le tableau dans la console
 * 
 * @param {Array} data Grille morpion
 */
function displayGrid(data){
    console.debug("[debug] afficher la grille ...")
    for(x = 0; x < data.length; x++){
        row = "";
        for(y = 0; y < data[x].length; y++){
            row += "[" + data[x][y] + "]"
        }
        console.debug(row)
    }
}

/**
 * Est-ce que la case aux coordonnées [x,y] est disponible ?
 * 
 * @param {Array} data Grille morpion
 * @param {int} x Coordonée X
 * @param {int} y Coordonée Y
 */
function isFreePosition(data, x, y){

    // renvoyer true si la case est libre (contenu de la case == NEUTRAL)
    return data[x][y] == NEUTRAL;
}

/**
 * Est-ce qu'il y a au moins une place libre dans la grille ?
 * 
 * Retourne true si au moins une case est disponible
 * 
 * @param {Array} data Grille morpion
 */
function hasFreePosition(data){
    for(x = 0; x < data.length; x++){
        for(y = 0; y < data[x].length; y++){
            if(isFreePosition(data, x, y)){
                return true
            }
        }
    }
    return false
}

/**
 * L'utilisateur 'joueur' joue la case [x, y] dans la grille 'data'
 * 
 * @param {String} joueur CROSS ou CIRCLE
 * @param {Array} data Grille morpion
 * @param {int} x Coordonée X
 * @param {int} y Coordonée Y
 */
function playThis(joueur, data, x, y){
    
    // Afficher un debug 
    console.debug("Joueur " + joueur + ", play [" + x + "][" + y + "]")

    // enregistrer le choix du joueur
    data[x][y] = joueur

    // renvoyer la grille mise à jour
    return data
}

/**
 * Est-ce que le symbole du Joueur [X, O] est trouvé consécutivement dans toute la ligne 'row' ?
 * Exemple row['X','X','X'] et joueur = 'X' alors retourne Vrai
 * 
 * Retourne false si un symbole autre que 'joueur' est trouvé sur la ligne 'row', sinon renvoie true
 * 
 * @param {Array} row Ligne de la grille
 * @param {String} joueur Symbole du joueur
 */
function isConsecutive(row, joueur){
    for(i = 0; i < row.length; i++){
        if(row[i] != joueur)
            return false
    }
    return true
}

/**
 * Le joueur a-t-il gagné sur une ligne ?
 * 
 * @param {Array} data Grille morpion
 * @param {String} joueur Symbole du joueur
 * 
 * return Liste des numéros de cellules gagnantes, vide si le joueur n'a pas gagné sur la ligne
 */
function hasWonInRow(data, joueur){

    var values = []
    for(x = 0; x < data.length; x++){
        // 3 cases consécutives sur l'axe X est c'est gagné
        if(isConsecutive(data[x], joueur)){

            // convertir une coordonnée en index, exemple Colonne 2, Ligne 3 = 7)
            var index = coordToIndex(x, 0)

            // stocker les cellules gagnantes
            for(y = 0; y < HEIGHT; y++){
                values[y] = index + y
            }

            return values
        }
    }
    return values
}

/**
 * Le joueur a-t-il gagné sur une colonne ?
 * 
 * @param {Array} data Grille morpion
 * @param {String} joueur Symbole du joueur
 */
function hasWonInColumn(data, joueur){
    var values = []
    for(y = 0; y < data.length; y++){
        var column = new Array()
        for(x = 0; x < data[y].length; x++){
            column += data[x][y]
        }
        // 3 cases consécutives sur l'axe Y et c'est gagné
        if(isConsecutive(column, joueur)){

            // stocker les cellules gagnantes
            for(x = 0; x < WIDTH; x++){
                // convertir une coordonnée en index, exemple Colonne 2, Ligne 3 = 7)
                values[x] = coordToIndex(x, y)
            }
            
            return values
        }
    }
    return values
}

/**
 * Le joueur a-t-il gagné sur une diagonale ?
 * 
 * @todo à améliorer ..
 * 
 * @param {Array} data Grille morpion
 * @param {String} joueur Symbole du joueur
 */
function hasWonInDiagonal(data, joueur){

    var values = []

    // Diagonale 1
    if(data[0][0] == data[1][1] && data[1][1] == data[2][2] && data[2][2] == joueur){
        // stocker les cellules gagnantes
        for(y = 0; y < HEIGHT; y++){
            values[y] = coordToIndex(y, y)
        }
        return values
    }

    // Diagonale 2
    if(data[2][0] == data[1][1] && data[1][1] == data[0][2] && data[0][2] == joueur){
        // stocker les cellules gagnantes
        for(y = 0; y < HEIGHT; y++){
            values[y] = coordToIndex((HEIGHT-1) - y, y)
        }
        return values
    }

    return values
}

/**
 * Renvoie les numéro des cellules gagnantes
 * 
 * @param {Array} data 
 * @param {String} joueur 
 */
function getWinCellIndices(data, joueur){

    var result = hasWonInRow(data, joueur)
    if(result.length > 0)
        return result

    result = hasWonInColumn(data, joueur)
    if(result.length > 0)
        return result

    result = hasWonInDiagonal(data, joueur)
    if(result.length > 0)
        return result

    return []
}

/**
 * Est-ce que le joueur 'joueur' a gagné ?
 * 
 * - 3 cases horizontales séquentielles = gagné sur l'axe horizontal
 * - 3 cases verticales séquentielles = gagné sur l'axe vertical
 * - 3 cases alignée en diagonale == gagné sur la diagonale
 * 
 * @param {Array} data 
 * @param {String} joueur 
 */
function hasWon(data, joueur){
    

    // test sur l'axe X
    var result = hasWonInRow(data, joueur)
    if(result.length > 0){
        console.log("player " + joueur + " won on the X axis !!!")
        return true
    }

    // test sur l'axe Y
    result = hasWonInColumn(data, joueur)
    if(result.length > 0){
        console.log("player " + joueur + " won on the Y axis !!!")
        return true
    }

    // test sur l'axe X
    result = hasWonInDiagonal(data, joueur)
    if(result.length > 0){
        console.log("player " + joueur + " won on the Diagonal !!!")
        return true
    }

    // le joueur n'a pas gagné
    return false
}


/**
 * Permet de savoir si la partie est terminée
 * 
 * @param {Array} data 
 * 
 * return Boolean true s'il y a un gagnant ou fin de partie, false si la partie doit continuer
 */
function isEndOfTheGame(data, joueur1, joueur2){

    // si il y a un gagnant, alors on arrête
    if(hasWon(data, joueur1) || hasWon(data, joueur2)){

        return true
    }

    // si aucune case disponible, alors on arrête
    if(!hasFreePosition(data)){

        return true
    }

    return false
}