const AttackList = {
    List : ["CV","Portfolio","CDD","Heure supp.","SMIC","Primes","Diplomes","Experience"],
    "CV" : {
        damage : 10,
        type : 'Projet',
        name : "CV"
    },
    "Portfolio" : {
        damage : 20,
        type : 'Projet',
        name : "Portfolio"
    },
    "CDD" : {
        damage : 25,
        type : 'Précarité',
        name : "CDD"
    },
    "Heure supp." : {
        damage : 25,
        type : 'Avantage',
        name : "Heure supp."
    },
    "SMIC" : {
        damage : 30,
        type : 'Précarité',
        name : "SMIC"
    },
    "Primes" : {
        damage : 25,
        type : 'Avantage',
        name : "Primes"
    },
    "Diplomes" : {
        damage : 5,
        type : 'Scolaire',
        name : "Diplomes"
    },
    "Experience" : {
        damage : 10,
        type : 'Travail',
        name : "Experience"
    },
}
  
const Types = {
    "Recruteur" : {
        0 : ["Scolaire","Précarité"],
        1 : ["Avantage"],
        2 : ["Projet","Travail"]
    },
    "Employé" : {
        0 : ["Précarité","Scolaire"],
        1 : ["Travail"],
        2 : ["Avantage","Projet"]
    },
    "Scolaire" : {
        0 : ["Travail","Recruteur"],
        1 : ["Scolaire","Avantage","Employé"],
        2 : ["Projet","Précarité"]
    },
    "Travail" : {
        0 : ["Précarité","Scolaire"],
        1 : ["Projet","Travail","Employé","Recruteur"],
        2 : ["Avantage",]
    },
    "Projet" : {
        0 : ["Scolaire","Précarité"],
        1 : ["Travail","Projet",],
        2 : ["Avantage","Recruteur","Employé"]
    },
    "Précarité" : {
        0 : ["Avantage","Recruteur","Employé"],
        1 : ["Précarité","Projet"],
        2 : ["Scolaire","Travail",]
    },
    "Avantage" : {
        0 : ["Scolaire","Recruteur"],
        1 : ["Projet","Avantage",],
        2 : ["Travail","Précarité","Employé"]
    },
}



const Effective = {
    0 : "cela n'a aucun effet...",
    1 : "ce n'est pas très efficace.",
    2 : "c'est super efficace !"
}

const Monsters = {    
    Character : {
        position : {
            x : 120,
            y : 400
        },
        image : {
            src : "assets/img/CharacterBattle.png"
        },
        animate : true,
        name : "Lucas Pires",
        type : "Employé",
        frames : {
            max : 5,
            hold : 40
        },
        attacks : [AttackList['CV'], AttackList['Portfolio'],AttackList['Experience'],AttackList['Diplomes']],
        PV : 160,
        Level : 10
    },
    EnemyChara : {
        position : {
            x : 485,
            y : 60
        },
        image : {
            src : "assets/img/EnemySprite.png"
        },
        animate : true,
        name : "Recruteur",
        type : "Recruteur",
        frames : {
            max : 3,
            hold : 40
        },
        attacks : [AttackList['CDD'], AttackList['Primes'],AttackList['SMIC'],AttackList['Heure supp.']],
        PV : 100,
        isEnemy : true,
        Level : 5
    },
    Enemy : {
        position : {
            x : 745,
            y : 90
        },
        image : {
            src : "assets/img/draggleSprite.png"
        },
        animate : true,
        isEnemy : true,
        type : "Back",
        name : "Enemy",
        frames : {
            max : 4,
            hold : 40
        },
        attacks : [AttackList['Charge']],
        PV : 120,
        Level : 7
    },
    Pokemon : {
        position : {
            x : 220,
            y : 360
        },
        image : {
            src : "assets/img/embySprite.png"
        },
        animate : true,
        name : "Pokemon",
        type : "Front",
        frames : {
            max : 4,
            hold : 40
        },
        attacks : [AttackList['Charge'], AttackList['Boule de Feu']],
        PV : 100,
        Level : 5
    },
}

const Inventory = [];

const MessageList = {
    "POKEBALL_CS01" : {
        message : "Vous avez trouvé la CS01 !"
    },
    "POKEBALL_CS02" : {
        message : "Vous avez trouvé la CS02 !"
    },
    "POKEBALL_CS03" : {
        message : "Vous avez trouvé la CS03 !"
    },
    "POKEBALL_CS04" : {
        message : "Vous avez trouvé la CS04 !"
    },
    "POKEBALL_CS05" : {
        message : "Vous avez trouvé la CS05 !"
    },
    "POKEBALL_CS06" : {
        message : "Vous avez trouvé la CS06 !"
    },
    "POKEBALL_CS07" : {
        message : "Vous avez trouvé la CS07 !"
    },
    "1" : {
        message : "Je ne peux pas aller par la."
    },
    "Nothing" : {
        message : "Je dois trouver les 7 CS (capacité spéciale) cachée sur la carte. J'en ai déjà trouvé "
    },
    "BZ" : {
        message : "Attention aux hautes herbes !"
    }
}