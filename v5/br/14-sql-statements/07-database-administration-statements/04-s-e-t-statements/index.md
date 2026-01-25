### 13.7.4 Instruções SET

[13.7.4.1 Sintaxe SET para Atribuição de Variáveis](set-variable.html)

[13.7.4.2 Instrução SET CHARACTER SET](set-character-set.html)

[13.7.4.3 Instrução SET NAMES](set-names.html)

A instrução [`SET`](set-statement.html "13.7.4 SET Statements") possui várias formas. As descrições para aquelas formas que não estão associadas a uma capacidade específica do server aparecem nas subseções desta seção:

* [`SET var_name = value`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis") permite que você atribua valores a variáveis que afetam a operação do server ou dos clients. Consulte [Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis").

* [`SET CHARACTER SET`](set-character-set.html "13.7.4.2 Instrução SET CHARACTER SET") e [`SET NAMES`](set-names.html "13.7.4.3 Instrução SET NAMES") atribuem valores a variáveis de *character set* e *collation* associadas à conexão atual com o server. Consulte [Seção 13.7.4.2, “Instrução SET CHARACTER SET”](set-character-set.html "13.7.4.2 Instrução SET CHARACTER SET"), e [Seção 13.7.4.3, “Instrução SET NAMES”](set-names.html "13.7.4.3 Instrução SET NAMES").

As descrições para as outras formas aparecem em outro lugar, agrupadas com outras instruções relacionadas à capacidade que elas ajudam a implementar:

* [`SET PASSWORD`](set-password.html "13.7.1.7 Instrução SET PASSWORD") atribui *passwords* de account. Consulte [Seção 13.7.1.7, “Instrução SET PASSWORD”](set-password.html "13.7.1.7 Instrução SET PASSWORD").

* [`SET TRANSACTION ISOLATION LEVEL`](set-transaction.html "13.3.6 Instrução SET TRANSACTION") define o *isolation level* para processamento de *transaction*. Consulte [Seção 13.3.6, “Instrução SET TRANSACTION”](set-transaction.html "13.3.6 Instrução SET TRANSACTION").