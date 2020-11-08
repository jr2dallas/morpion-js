


/**
 * demander au joueur où il veut jouer
 * 
 * @param {*} player 
 */
function askPlayer(player){
    
    var result = prompt("Joueur " + player + ", à votre tour ! Valeur exemple attendue: 1;2 ou 2;0 (min 0;0 et max "+(HEIGHT-1)+";"+(WIDTH-1)+")")

    if(result == null){
        console.warn("L'utilisateur souhaite quitter le programme")
        return null
    }

    // si l'utilisateur n'a pas donné une réponse avec 3 caractères, il doit recommencer
    if(result.length != 3)
        return askPlayer(player);
    
    // chercher s'il y a bien un point virgule comme demander, sinon il recommence
    index = result.indexOf(';');
    if(index == -1)
        return askPlayer(player)

    // extraire et convertir en Int les valeurs de l'utilisateur
    y = parseInt(result.substr(0, 1))
    x = parseInt(result.substr(2, 1))

    if(isNaN(x) || isNaN(y)){
        alert("Que des nombres svp")
        return askPlayer(player)
    }

    // vérifier que les valeurs sont bien dans la grille, sinon il recommence
    if(y < 0 || y >= HEIGHT || x < 0 || x >= WIDTH){
        alert("La hauteur doit être comprise entre 0 et " + (HEIGHT-1) + " et la largeur doit être comprise entre 0 et " + (WIDTH-1))
        return askPlayer(player)
    }

    // [debug]
    console.debug("Player " + player + " want play: ", {"x" : x, "y" : y})

    // renvoyer le résultat avec la position que l'utilisateur veut jouer
    return {"x" : x, "y" : y}
}

/******************************/
/* MAIN CLI (interface en console)
*******************************/


// assigner les symboles aux joueurs
var joueur1 = CROSS
var joueur2 = CIRCLE

// tour du joueur (pair = joueur1, impaire = joueur2) (@todo petit 'hack' pas très propre, il faudrait trouver autre chose)
var turn = 0

// gérer la possibilité de quitter le jeu quand on veut (sans ça c'est casse pieds pour debug ^^)
var exit = false

// initialiser la grille
var gameData = initializeData(gameData, WIDTH, HEIGHT)

// [debug] afficher la grille en console
displayGrid(gameData)

// boucle infinie tant que ce n'est pas la fin du jeu
do{

    
    // si turn est paire, c'est au tour du joueur 1
    if(turn%2 == 0){
        value = askPlayer(joueur1)

        // si la valeur est nulle, l'utilisateur souhaiter quitter le programme
        if(value == null){
            exit = true
            break
        }

        // si ce n'est pas une case vide, alors on revient au début de la boucle sur le même joueur
        if(!isFreePosition(gameData, value.x, value.y)){
            console.log("Cette position n'est pas disponible")
            // afficher la grille pour rappel
            displayGrid(gameData)
            continue
        }

        gameData = playThis(joueur1, gameData, value.x, value.y)

    // sinon au joueur 2
    }else{
        value = askPlayer(joueur2)

        // si la valeur est nulle, l'utilisateur souhaiter quitter le programme
        if(value == null){
            exit = true
            break
        }

        // si ce n'est pas une case vide, alors on revient au début de la boucle sur le même joueur
        if(!isFreePosition(gameData, value.x, value.y)){
            console.log("Cette position n'est pas disponible")
            // afficher la grille pour rappel
            displayGrid(gameData)
            continue
        }

        gameData = playThis(joueur2, gameData, value.x, value.y)
    }

    console.log("afficher la grille ...")
    // afficher la nouvelle grille
    displayGrid(gameData)


    // incrémenter turn pour passer au joueur suivant
    turn ++


}while(!isEndOfTheGame(gameData, joueur1, joueur2))


if(!exit){

    if(isWinner(gameData, joueur1))
    {
        alert("Bien joué joueur " + joueur1 + " !!!")

    }else if(isWinner(gameData, joueur2))
    {

        alert("Bien joué joueur " + joueur2 + " !!!")

    }else{

        alert("Match nul, Aucun gagnant :(")

    }

}