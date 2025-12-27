### 15.6.1 Declaração Composta `BEGIN ... END`

```
[begin_label:] BEGIN
    [statement_list]
END [end_label]
```

A sintaxe `BEGIN ... END` é usada para escrever declarações compostas, que podem aparecer dentro de programas armazenados (procedimentos e funções armazenados, gatilhos e eventos). Uma declaração composta pode conter várias declarações, encerradas pelas palavras-chave `BEGIN` e `END`. *`lista_de_declarações`* representa uma lista de uma ou mais declarações, cada uma terminada por um delimitador de declaração ponto-e-vírgula (`;`). A *`lista_de_declarações`* em si é opcional, portanto, a declaração composta vazia (`BEGIN END`) é legal.

Os blocos `BEGIN ... END` podem ser aninhados.

O uso de várias declarações exige que um cliente seja capaz de enviar strings de declaração que contenham o delimitador de declaração ponto-e-vírgula (`;`). No cliente de linha de comando **mysql**, isso é tratado com o comando `delimiter`. Alterar o delimitador de fim de declaração (por exemplo, para `//`) permite que a ``;` seja usada em um corpo de programa. Para um exemplo, veja a Seção 27.1, “Definindo Programas Armazenados”.

Um bloco `BEGIN ... END` pode ser rotulado. Veja a Seção 15.6.2, “Rotulagem de Declarações”.

A cláusula opcional `[NOT] ATOMIC` não é suportada. Isso significa que nenhum ponto de salvamento transacional é definido no início do bloco de instruções e a cláusula `BEGIN` usada neste contexto não tem efeito na transação atual.

Nota

Dentro de todos os programas armazenados, o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`. Para iniciar uma transação neste contexto, use `START TRANSACTION` em vez disso.