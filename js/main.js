const artyom = new Artyom();
$("#pokemon-spinner").hide();

$(document).ready(() => {
    inicializaPokemon();
    artyom.addCommands(
        {
            indexes: ["buscar Pokémon *", "*"],
            smart: true,
            action: function (i, wildcard) {
                switch (i) {
                    case 0:
                        var pokemonName = wildcard.trim().split(' ');
                        artyom.say(`Buscando pokémon ${pokemonName[pokemonName.length-1]}`, {
                            lang:"es-ES"
                        });
                        $("#pokemon").val('');
                        $("#pokemon").val(pokemonName[pokemonName.length-1]);
                        buscarPokemon(pokemonName[pokemonName.length-1], true);
                        artyom.fatality().then(() => {
                            console.log("Artyom succesfully stopped !");
                        });
                        break;
                    case 1:
                        artyom.say("Comando no reconocido");
                        break;            
                }
            }
        }
    );
});

$("#buscar").on("click", function () {
    var nombrePokemon = $("#pokemon").val().trim();
    if (nombrePokemon.length != 0) {
        $("#error").text("");
        $("#pokemon-spinner").show();
        buscarPokemon(nombrePokemon, false);
    } else {
        $("#error").text("Por favor ingrese el nombre del pokémon.");
    }
});

$("#voz").on("click", function () {
    $("#error").text("");
    $("#pokemon-spinner").show();
    if(!artyom.isRecognizing()) {
        artyom.initialize({
            lang: "es-ES",
            continuous: true,
            soundex: true,
            debug: true,
            listen: true,
            name: "Nata" 
        }).then(() => {
            artyom.say(`Comienza a hablar ahora`, {
                lang:"es-ES"
            });
        }).catch((_) => {
            artyom.say(`Error activando el reconocimiento de voz`, {
                lang:"es-ES"
            });
        });
    }
});

function buscarPokemon(nombre, voz) {
    $.ajax({
        url: "https://pokeapi.co/api/v2/pokemon/" + nombre.toLowerCase(),
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            if (voz) {
                artyom.say(`Pokémon ${nombre} encontrado`, {
                    lang:"es-ES"
                });
            }
            inicializaPokemon();
            $("#pokemon-img").attr("src", data.sprites.other.home.front_default);
            $("#pokemon-img").attr("alt", data.name);
            $("#pokemon-name").text(data.name.toUpperCase());

            var tiposPokemon = '';
            data.types.forEach(function (type) {
                tiposPokemon += `<li class="list-group-item">${type.type.name}</li>`;
            });
            $("#pokemon-tipos").append(tiposPokemon);

            var habilidadesPokemon = '';
            data.abilities.forEach(function (ability) {
                habilidadesPokemon += `<li class="list-group-item">${ability.ability.name}</li>`;
            });
            $("#pokemon-habilidades").append(habilidadesPokemon);

            $("#pokemon-info").show();
            $("#pokemon-spinner").hide();
        },
        error: function () {
            inicializaPokemon();
            $("#error").text("Ocurrió un error al buscar el Pokémon, por favor valide el nombre ingresado.");
            if (voz) {
                artyom.say(`Pokémon ${nombre} no encontrado`, {
                    lang:"es-ES"
                });
            }
            $("#pokemon-spinner").hide();
        }
    });
}

function inicializaPokemon() {
    $("#error").text("");
    $("#pokemon-img").attr("src", "...");
    $("#pokemon-img").attr("alt", "...");
    $("#pokemon-name").text("");
    $("#pokemon-tipos").empty();
    $("#pokemon-habilidades").empty();
    $("#pokemon-info").hide();
}