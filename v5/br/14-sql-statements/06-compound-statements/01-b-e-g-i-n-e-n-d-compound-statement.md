### 13.6.1 Declaração Composta BEGIN ... END

```sql
[begin_label:] BEGIN
    [statement_list]
END [end_label]
```

A sintaxe `BEGIN ... END` é usada para escrever declarações compostas, que podem aparecer dentro de *stored programs* (*stored procedures* e *functions*, *triggers* e *events*). Uma declaração composta pode conter múltiplas declarações, delimitadas pelas palavras-chave `BEGIN` e `END`. *`statement_list`* representa uma lista de uma ou mais declarações, cada uma terminada por um delimitador de declaração de ponto e vírgula (`;`). O próprio *`statement_list`* é opcional, portanto, a declaração composta vazia (`BEGIN END`) é legal.

Blocos `BEGIN ... END` podem ser aninhados.

O uso de múltiplas declarações exige que o cliente seja capaz de enviar strings de declaração contendo o delimitador de declaração `;`. No cliente de linha de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), isso é tratado com o comando `delimiter`. Alterar o delimitador de fim de declaração `;` (por exemplo, para `//`) permite que `;` seja usado no corpo de um programa. Para um exemplo, consulte [Seção 23.1, “Definindo Stored Programs”](stored-programs-defining.html "23.1 Defining Stored Programs").

Um bloco `BEGIN ... END` pode ser rotulado. Consulte [Seção 13.6.2, “Statement Labels”](statement-labels.html "13.6.2 Statement Labels").

A cláusula opcional `[NOT] ATOMIC` não é suportada. Isso significa que nenhum *savepoint* transacional é definido no início do bloco de instrução e a cláusula `BEGIN` usada neste contexto não tem efeito na transação atual.

Nota

Dentro de todos os *stored programs*, o *parser* trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`. Para iniciar uma transação neste contexto, use `START TRANSACTION` em vez disso.