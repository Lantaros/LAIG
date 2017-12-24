
%------------PRINT BOARD-------------

printBoard(Board):-printRowSeparator, printBoardAux(Board).

printBoardAux([]).
printBoardAux([Head|Tail]) :-
		write('|'),
        printRow(Head),
        printBoard(Tail).


%------------PRINTS A ROW-------------

printRow([]) :- nl.
printRow([emptyCell|Tail]) :-
        write('  '),
        write('|'),
        printRow(Tail).

printRow([Head|Tail]) :-
		Head \= emptyCell,
        write(Head),
        write('|'),
        printRow(Tail).


%------------PRINTS A LINE SEPARATOR-------------

printLineSeparator(1):- write('|'), nl.
printLineSeparator(NLines):-
		write('|'),
		nl,
		Next is NLines-1,
		printLineSeparator(Next).

printRowSeparator:-
		write('------------------------'), nl.


%-----------PRINTS CURRENT INFO-------------

printCurrentInfo(Board, Player):-
		printBoard(Board),
		printCurrentPlayer(Player).


%-----------PRINTS WHOSE TURN IS IT-------------

printCurrentPlayer(Player):-
	write('It is your turn, '),
	(
		Player == 'X ' -> write('Black!'), nl;
		Player == 'O ' -> write('White!'), nl
	).
