
%------------STATE MACHINE-------------

:- dynamic matrixList/1.   % List to be changed
:- dynamic analiseList/1.  % Auxiliar List with indexes


%-----------TRANSITION ARCS FOR BLACK TEAM--------------------

arcX(_,emptyCell, 1).

arcX(1,'O ',2).
arcX(2,'X ',1).
arcX(2,'O ',3).
arcX(3,'O ',3).
arcX(3,'X ',4).
arcX(4,'O ',1).
arcX(4,'X ',5).
arcX(5,'O ',2).
arcX(5,'X ',6).

arcX(1,'X ',6).
arcX(6,'X ',7).
arcX(7,'X ',7).
arcX(7,'O ',8).
arcX(8,'O ',9).
arcX(8,'X ',6).
arcX(9,'O ',9).
arcX(9,'X ',6).

arcX(6,'O ',10).
arcX(10,'X ', 1).
arcX(10,'O ',11).
arcX(11,'O ',11).
arcX(11,'X ',12).
arcX(12,'X ', 6).
arcX(12,'O ', 2).


%-----------TRANSITION ARCS FOR WHITE TEAM--------------------

arcO(_,emptyCell, 1).

arcO(1,'X ',2).
arcO(2,'O ',1).
arcO(2,'X ',3).
arcO(3,'X ',3).
arcO(3,'O ',4).
arcO(4,'X ',1).
arcO(4,'O ',5).
arcO(5,'X ',2).
arcO(5,'O ',6).

arcO(1,'O ',6).
arcO(6,'O ',7).
arcO(7,'O ',7).
arcO(7,'X ',8).
arcO(8,'X ',9).
arcO(8,'O ',6).
arcO(9,'X ',9).
arcO(9,'O ',6).

arcO(6,'X ',10).
arcO(10,'O ', 1).
arcO(10,'X ',11).
arcO(11,'X ',11).
arcO(11,'O ',12).
arcO(12,'O ', 6).
arcO(12,'X ', 2).


%-----------FINAL NODES--------------------

final(5).  %CASE A
final(9).  %CASE B
final(12). %CASE C


%-----------------INITIATES THE STATE MACHINE--------------------

testState(List, NewList, CurrPlayer):- assert(matrixList(List)), assert(analiseList([])),
		finite_state(1, List, Result, 0, CurrPlayer), retract(matrixList(NewList)), emptyList.


%-----------------STATE MACHINE--------------------

finite_state(Start, [], Start, _, _).
finite_state(done, _, done, _, _) :- !.
finite_state(Start, [Input | Inputs], Finish, Index, Player) :-
		 ite(Player == 'X ',  arcX(Start, Input, Next), arcO(Start, Input, Next)),
		 (
			 Input \= emptyCell,
			 analiseList(AuxList),
			 length(AuxList, Length),
			 (
			 		Length > 0 ->	 verifyState(AuxList, Next, Index, State);
					Length == 0 -> addToEmptyList(AuxList, Input, Index)
			 ),
			 it( checkCaseB(Start, Input,Player, Index), capturePiecesOnList(Player)),
			 processNext(Next, Player)
			 ;
			 true
		 ),
		 it(checkCaptureB(Start, Next, Input), capturePiecesOnList(Player)),
		 Ind is Index+1,
     finite_state(Next, Inputs, Finish, Ind, Player).


%-----------------ADDS INDEX TO AN EMPTY LIST--------------------

addToEmptyList(AuxList, Input, Index):-
		(
			Input \= emptyCell -> addToList(AuxList, Index);
			Input == emptyCell -> emptyList
		).


%-----------------CHECKS CASE B OF FINAL NODES--------------------

checkCaseB(State, Input,Player, Index):-
	  ite(Player == 'X ',  checkCaseBX(State, Input, Index), checkCaseBO(State, Input, Index)).

%-----------------CHECKS CASE B OF FINAL NODES FOR BLACK TEAM-------------------

checkCaseBX(State, Input, Index):-
	  State == 9, (Input \= 'O ' ; Index == 7).

%-----------------CHECKS CASE B OF FINAL NODES FOR WHITE TEAM-------------------

checkCaseBO(State, Input, Index):-
	  State == 9, (Input \= 'X '; Index == 7).


%-----------------CHECKS CAPTURE OF CASE B-------------------

checkCaptureB(Start, Next, Input):-
	 Start == 9, Next == 1, Input == emptyCell.


%-----------------VERIFIES IF CAN ADD INDEX TO LIST--------------------

verifyState(AuxList, Next, Index,CurrentState):-
	addToList(AuxList, Index),
	it(checkState(CurrentState, Next), emptyList).


%-----------------CHECKS IF CURRENT STATE IS NOT FINAL AND THE NEXT IS 1--------------------

checkState(CurrentState, Next):-
	Next == 1, not(final(CurrentState)).


%----------------EMPTIES THE AUXILIAR LIST--------------------

emptyList:-
		asserta(analiseList([])).


%----------------ADDS INDEX TO THE AUXILIAR LIST--------------------

addToList(AuxList, Index):-
		append(AuxList, [Index], NewAuxList),
		asserta(analiseList(NewAuxList)).


%----------------CHECKS CASE A AND C-----------------------

processNext(Next,Player):-
		 Next == 5, capturePiecesOnList(Player).
processNext(Next,Player):-
		 Next == 12, capturePiecesOnList(Player).
processNext(Next, Player).


%----------------GETS THE 2 LISTS AND CALLS CAPTUREPIECES----

capturePiecesOnList(Player):-
	retract(matrixList(MatrixList)),
	retract(analiseList(CurrentList)),
	capturePieces(CurrentList, MatrixList,Player),
	emptyList.


%-------REPLACES THE CORRESPONDING INDEXES ON THE MATRIX LIST WITH THE CURRENT PLAYER PIECE--------

capturePieces([], MatrixList, _) :- asserta(matrixList(MatrixList)).
capturePieces([H|T], MatrixList, Player):-
	replace(MatrixList, H, Player, TheMatrixList),
	capturePieces(T, TheMatrixList,Player).


%-------REPLACES AN ELEMENT ON A GIVEN INDEX OF LIST WITH ANOTHER ELEMENT--------

replace([_|T], 0, PlayerPiece, [PlayerPiece|T]).
replace([H|T], I, PlayerPiece, [H|R]):-
		I > -1,
		NI is I-1,
		replace(T, NI, PlayerPiece, R), !.
replace(L, _, _, L).
