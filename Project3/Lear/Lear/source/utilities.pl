
%------------NOT PREDICATE--------

not(X) :- X, !, fail.
not(_).


%------------IF ELSE---------------

it(If, Then):- If, !, Then.
it(_,_).


%------------IF THEN ELSE---------------

ite(If, Then, _):- If, !, Then.
ite(_, _, Else):- Else.


%------------GET LINE-------------

getLine([H|_],1,H).
getLine([_|T],I,X) :-
    I1 is I-1,
    getLine(T,I1,X).


%------------GET PIECE-------------

getPiece(Board, NLine, NColumn, Piece):-
		getElemPos(NLine, Board, Line),
		getElemPos(NColumn, Line, Piece).


%-------GET ELEMENT POSITION ON A LIST---

getElemPos(1,[Element|_], Element).
getElemPos(Pos,[_|Tail], Element):-
		Pos > 1,
		Next is Pos-1,
		getElemPos(Next, Tail, Element).


%------------SET PIECE-------------

setPiece(PrevBoard, NLine, NColumn, Piece, Board):-
		setNLine(NLine, PrevBoard, NColumn, Piece, Board).


%------------SET PIECE ON LINE-------------

setNLine(1, [Line|Tail], NColumn, Piece, [NewLine| Tail]):-
		setNColumn(NColumn, Line, Piece, NewLine).
setNLine(Pos, [Line|Tail], NColumn, Piece, [Line| NewTail]):-
		Pos > 1, Next is Pos-1,
		setNLine(Next, Tail, NColumn, Piece, NewTail).


%------------SET PIECE ON COLUMN-----------------

setNColumn(1, [_|Tail], Piece, [Piece| Tail]).
setNColumn(Pos, [X|Tail], Piece, [X|NewTail]):-
		Pos > 1,
		Next is Pos-1,
		setNColumn(Next, Tail, Piece, NewTail).


%--------COUNT NUMBER OF OCCURRENCES IN MATRIX-------

countScore([] , Player, 0).
countScore([Head | Tail], Player, NTotal):-
	countScore(Tail, Player, NextNTotal),
	countScoreLine(Head, Player, N),
	NTotal is NextNTotal + N.


%--------COUNT NUM OF OCCURRENCES IN LIST----------

countScoreLine([], Player, 0).
countScoreLine([Head | Tail], Player, N) :-
	(
		Head == Player -> countScoreLine(Tail, Player, NextN), N is NextN + 1;
		Head \= Player -> countScoreLine(Tail, Player, N)
	).


%------------WAIT FOR <ENTER> INPUT----------

pressEnterToContinue:-
	write('Press <Enter> to continue.'), nl,
	waitForEnter, !.

waitForEnter:-
	get_char(_).


%------------CLEARS THE CONSOLE----------

clearTheConsole:-
	clearTheConsole(40), !.

clearTheConsole(0).
clearTheConsole(N):-
	nl,
	N1 is N-1,
  clearTheConsole(N1).


%------------GETS THE INPUT----------

getChar(Input):-
	get_char(Input),
	get_char(_).
