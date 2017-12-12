
%------------GAME LOOP-------------

play :-
	repeat,
		retract(state(Board, Count, Player)),
			printCurrentInfo(Board, Player),
			format('Count = ~p', [Count]), nl,
			once(move(Board, Player, FinalBoard)),
			changePlayer(Player, NextPlayer),
			Counter is Count - 1,
		assert(state(FinalBoard, Counter, NextPlayer)),
		endGame(Counter).


%------------HANDLES THE PLAY-------------

move(Board, Player, FinalBoard):-
		repeat,
			getCoordsFromUser(NLine, NCol),
			check(Board, NLine, NCol, NextBoard, Player, false),
			verifyRule(NextBoard, NLine, NCol, Player, FinalBoard).


%------------HANDLES THE COMPUTER PLAY-------------

moveComputer(Board, Player, Dif, FinalBoard):-
		(
			Dif == 0 -> randomMove(Board, Player, NLine, NCol);
			Dif == 1 -> predict(Board, Player, Dif, NLine, NCol)
		),
		check(Board, NLine, NCol, NextBoard, Player, true),
		verifyRule(NextBoard, NLine, NCol, Player, FinalBoard).


%------------GETS COORDS FROM USER-------------

getCoordsFromUser(NLine, NCol):-
		write('Type Board Coordinates: (Line. <enter> Column.)'), nl,
		read(NLine), nl, read(NCol).


%------------CHECKS IF CELL IS EMPTY-------------

check(Board, NLine, NCol, NextBoard, Player, Computer) :-
	getPiece(Board, NLine, NCol, X),
	(
		X == emptyCell -> setPiece(Board, NLine, NCol, Player, NextBoard);
		X \= emptyCell -> it(not(Computer), (write('There is already a piece there! Try again!'), nl)),
							fail
	).


%------------TRIES TO CAPTURE PIECES-------------

verifyRule(Board, NLine, NCol, Player, FinalBoard):-
		getLine(Board, NLine, Line),
		testState(Line, NewLine, Player),
		replace(Board, NLine-1, NewLine, NewBoard),
		transpose(NewBoard, TBoard),
		getLine(TBoard, NCol, Col),
		testState(Col, NewCol, Player),
		replace(TBoard, NCol-1, NewCol, NewBoard2),
		transpose(NewBoard2, FinalBoard).


%------------CHANGES CURRENT PLAYER-------------

changePlayer('O ', 'X ').
changePlayer('X ', 'O ').


%------------CHECKS FOR END GAME-------------

endGame(Count) :-
	Count == 0,
	retract(state(FBoard, Count, Player)),
	checkWinner(FBoard).


%------------CHECKS THE WINNER-------------

checkWinner(FBoard):-
		countScore(FBoard, 'X ', XCount),
		countScore(FBoard, 'O ', OCount),
		(
				XCount > OCount -> write('Congratulations, Black Team! You win the game!'), nl;
				OCount > XCount -> write('Congratulations, White Team! You win the game!'), nl;
				XCount == OCount -> write('The game ended in a draw!'), nl
		).


%------------PLAYS PLAYER VS AI---------------
playPvBGame(Dif):-
	repeat,
		retract(state(Board, Count, Player)),
			printCurrentInfo(Board, Player),
			format('Count = ~p', [Count]), nl,
			ite(Player == 'X ', once(move(Board, Player, FinalBoard)), (once(moveComputer(Board, Player, Dif, FinalBoard)), sleep(1))),
			changePlayer(Player, NextPlayer),
			Counter is Count - 1,
		assert(state(FinalBoard, Counter, NextPlayer)),
		endGame(Counter).


%------------PREPARES BOARD ADD 2 RANDOM PIECES---------------
prepareBoardBvB:-
	retract(state(Board, Count, Player)),
	moveComputer(Board, 'X ', 0, Board2),
	moveComputer(Board2, 'O ', 0, FinalBoard),
	Counter is Count - 2,
	assert(state(FinalBoard, Counter, Player)).

%------------PLAYS AI VS AI---------------
playBvBGame(Dif):-
	it(Dif == 1, prepareBoardBvB),
	repeat,
		retract(state(Board, Count, Player)),
			printCurrentInfo(Board, Player),
			format('Count = ~p', [Count]), nl,
			once(moveComputer(Board, Player, Dif, FinalBoard)),
			sleep(1),
			changePlayer(Player, NextPlayer),
			Counter is Count - 1,
		assert(state(FinalBoard, Counter, NextPlayer)),
		endGame(Counter).
