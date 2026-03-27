function Main() {
    // On clicking the menu's navigation buttons, the user's tab will be switched to the respective game.
    $('#ttt').on('click', function(){location.assign("ticTacToe.html");});
    $('#checkers').on('click', function(){location.assign("checkers.html");});
    $('#mcm').on('click', function(){location.assign("memoryCardMatch.html");});
}

Main();