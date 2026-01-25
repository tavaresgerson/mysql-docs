### 13.6.3 Statement DECLARE

O Statement [`DECLARE`](declare.html "13.6.3 DECLARE Statement") é usado para definir diversos itens locais a um programa:

*   Variáveis locais. Consulte [Seção 13.6.4, “Variáveis em Stored Programs”](stored-program-variables.html "13.6.4 Variáveis em Stored Programs").

*   Conditions e Handlers. Consulte [Seção 13.6.7, “Condition Handling”](condition-handling.html "13.6.7 Condition Handling").

*   Cursors. Consulte [Seção 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

O [`DECLARE`](declare.html "13.6.3 DECLARE Statement") é permitido apenas dentro de um Compound Statement [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") e deve estar no seu início, antes de quaisquer outros Statements.

As Declarações devem seguir uma ordem específica. As declarações de Cursor devem aparecer antes das declarações de Handler. As declarações de Variable e Condition devem aparecer antes das declarações de Cursor ou Handler.