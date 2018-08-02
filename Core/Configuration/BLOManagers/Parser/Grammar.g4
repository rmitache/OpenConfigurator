grammar Grammar;
 
@parser::members
{
    protected const int EOF = Eof;
}
 
@lexer::members
{
    protected const int EOF = Eof;
    protected const int HIDDEN = Hidden;
}
 

options {
    buildAST = true;   // uses CommonAST by default
}

/*Parser Rules**********************************************************************************************/
prog: lefthandexpr EQ righthandexpr;

// Left-hand
lefthandexpr: 
	composite_selector_simple 
;
composite_selector_simple: 
	feature_selector_abs DOT attribute_selector

;

// Right-hand
righthandexpr:
	 sumof_function
	 ;
sumof_function:
	'SumOf' LPAREN composite_selector_advanced RPAREN  
	;
//expr:
//     expr op=(ADD|SUB) expr								# AddSub
//     | INT												# int
//	 | SUMOF_KEYWORD LPAREN composite_selector_advanced RPAREN  # SumOf
//;

composite_selector_advanced: 
	feature_selector_abs DOT feature_selector_rel DOT attribute_selector
;
feature_selector_rel:
	 op = (DESCENDANTS_KEYWORD | ANCESTORS_KEYWORD) 
;


// Common
feature_selector_abs :
	IDENTIFIER
	| ROOTFEATURE
;
attribute_selector: 
	 IDENTIFIER 
;
/**********************************************************************************************************/



/*Lexer Rules**********************************************************************************************/


EQ :  '=';
ADD : '+';
SUB : '-';

SUMOF_KEYWORD
   : 'SumOf'
   ;
DESCENDANTS_KEYWORD: 
	'>descendants'
;
ANCESTORS_KEYWORD: 
	'>ancestors'
;
ROOTFEATURE: 
	'>root'
;
IDENTIFIER : 
	IDENTIFIERSTARTCHARACTER IDENTIFIERPARTCHARACTER*
;
IDENTIFIERSTARTCHARACTER
	: [a-z]
	| [A-Z]
	| '_'
	;
IDENTIFIERPARTCHARACTER
	: [a-z]
	| [A-Z]
	| [0-9]
	| '_'
	;





DOT : '.';
INT : [0-9]+;
LPAREN
   : '('
   ;
RPAREN
   : ')'
   ;
WS
    :   (' ' | '\r' | '\n') -> channel(HIDDEN)
    ;
/**********************************************************************************************************/