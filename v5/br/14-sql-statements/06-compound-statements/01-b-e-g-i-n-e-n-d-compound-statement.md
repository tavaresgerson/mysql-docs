### 13.6.1 COMEÇAR ... FIM Declaração composta

```sql
[begin_label:] BEGIN
    [statement_list]
END [end_label]
```

A sintaxe `BEGIN ... END` é usada para escrever instruções compostas, que podem aparecer dentro de programas armazenados (procedimentos e funções armazenados, gatilhos e eventos). Uma instrução composta pode conter várias instruções, encerradas pelas palavras-chave `BEGIN` e `END`. *`statement_list`* representa uma lista de uma ou mais instruções, cada uma terminada por um delimitador de instrução ponto-e-vírgula (`;`). O *`statement_list`* em si é opcional, portanto, a instrução composta vazia (`BEGIN END`) é legal.

Os blocos `BEGIN ... END` podem ser aninhados.

O uso de múltiplas instruções exige que um cliente seja capaz de enviar cadeias de instruções que contenham o delimitador de instrução `;`. No cliente de linha de comando **mysql**, isso é feito com o comando `delimiter`. Alterar o delimitador de fim de instrução `;` (por exemplo, para `//`) permite que a ` `;\` seja usada no corpo de um programa. Para um exemplo, consulte Seção 23.1, “Definindo Programas Armazenados”.

Um bloco `BEGIN ... END` pode ser rotulado. Veja Seção 13.6.2, “Rotulagem de Declarações”.

A cláusula opcional `[NOT] ATOMIC` não é suportada. Isso significa que nenhum ponto de salvamento transacional é definido no início do bloco de instruções e a cláusula `BEGIN` usada neste contexto não tem efeito na transação atual.

Nota

Dentro de todos os programas armazenados, o analisador trata `BEGIN [WORK]` como o início de um bloco `BEGIN ... END`. Para iniciar uma transação neste contexto, use `START TRANSACTION` em vez disso.
