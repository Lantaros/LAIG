:- include('prints.pl').
:- include('logic.pl').
:- include('stateMachine.pl').
:- include('utilities.pl').
:- include('ia.pl').
:- include('menu.pl').
:- use_module(library(clpfd)).
:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(library(aggregate)).
:- use_module(library(random)).
:- use_module(library(system)).

:- dynamic state/3.
:- dynamic bestMoveScore/4.


initialBoardForTesting([
	[emptyCell, emptyCell, emptyCell, emptyCell, 'X ', emptyCell, emptyCell, emptyCell],
	[emptyCell, 'X ', 'O ', 'O ', 'X ', emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, 'X ', 'X ', emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, 'O ', 'O ', emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, 'O ', 'O ', emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, 'O ', emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell]]).


%-----------INITIATES AN EMPTY BOARD-----------

initialBoard([
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell],
	[emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell, emptyCell]]).


%-----------STARTS THE GAME-----------

startGame:-
	 initialBoard(Board),
	 assert(state(Board, 64, 'X ')),
	 play.

%------PREDICATE THAT STARTS THE PROGRAM--------

%lear:- initialBoardForTesting(Board), printBoard(Board), countScore(Board, 'O ', Num), write(Num), nl, getCoordsFromUser(NLine, NCol).

%lear:- initialBoard(Board), startGame(Board).


lear:- mainMenuLear.
