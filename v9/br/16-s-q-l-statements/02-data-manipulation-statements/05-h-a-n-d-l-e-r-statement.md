### 15.2.5 Declaração `HANDLER`

```
HANDLER tbl_name OPEN [ [AS] alias]

HANDLER tbl_name READ index_name { = | <= | >= | < | > } (value1,value2,...)
    [ WHERE where_condition ] [LIMIT ... ]
HANDLER tbl_name READ index_name { FIRST | NEXT | PREV | LAST }
    [ WHERE where_condition ] [LIMIT ... ]
HANDLER tbl_name READ { FIRST | NEXT }
    [ WHERE where_condition ] [LIMIT ... ]

HANDLER tbl_name CLOSE
```

A declaração `HANDLER` fornece acesso direto às interfaces do motor de armazenamento de tabelas. Está disponível para tabelas `InnoDB` e `MyISAM`.

A declaração `HANDLER ... OPEN` abre uma tabela, tornando-a acessível usando as declarações `HANDLER ... READ` subsequentes. Esse objeto de tabela não é compartilhado por outras sessões e não é fechado até que a sessão chame `HANDLER ... CLOSE` ou a sessão termine.

Se você abrir a tabela usando um alias, referências adicionais à tabela aberta com outras declarações `HANDLER` devem usar o alias em vez do nome da tabela. Se você não usar um alias, mas abrir a tabela usando o nome da tabela qualificado pelo nome do banco de dados, referências adicionais devem usar o nome da tabela não qualificado. Por exemplo, para uma tabela aberta usando `mydb.mytable`, referências adicionais devem usar `mytable`.

A sintaxe da primeira declaração `HANDLER ... READ` recupera uma linha onde o índice especificado satisfaz os valores fornecidos e a condição `WHERE` é atendida. Se você tiver um índice de várias colunas, especifique os valores da coluna do índice como uma lista de valores separados por vírgula. Especifique valores para todas as colunas do índice ou especifique valores para um prefixo da esquerda das colunas do índice. Suponha que um índice `my_idx` inclua três colunas nomeadas `col_a`, `col_b` e `col_c`, nessa ordem. A declaração `HANDLER` pode especificar valores para todas as três colunas do índice ou para as colunas em um prefixo da esquerda. Por exemplo:

```
HANDLER ... READ my_idx = (col_a_val,col_b_val,col_c_val) ...
HANDLER ... READ my_idx = (col_a_val,col_b_val) ...
HANDLER ... READ my_idx = (col_a_val) ...
```

Para empregar a interface `HANDLER` para referenciar o `PRIMARY KEY` de uma tabela, use o identificador citado `` `PRIMARY` ``:

```
HANDLER tbl_name READ `PRIMARY` ...
```

A sintaxe da segunda declaração `HANDLER ... READ` recupera uma linha da tabela em ordem de índice que corresponde à condição `WHERE`.

A sintaxe `HANDLER ... READ` do terceiro tipo recupera uma linha da tabela na ordem natural de exibição das linhas que corresponde à condição `WHERE`. Ela é mais rápida do que `HANDLER tbl_name READ index_name` quando se deseja realizar uma varredura completa da tabela. A ordem natural de exibição das linhas é a ordem em que as linhas são armazenadas em um arquivo de dados de tabela `MyISAM`. Essa instrução também funciona para tabelas `InnoDB`, mas não há tal conceito porque não há um arquivo de dados separado.

Sem uma cláusula `LIMIT`, todas as formas de `HANDLER ... READ` recuperam uma única linha se houver disponível. Para retornar um número específico de linhas, inclua uma cláusula `LIMIT`. Ela tem a mesma sintaxe que a da instrução `SELECT`. Veja a Seção 15.2.13, “Instrução SELECT”.

`HANDLER ... CLOSE` fecha uma tabela que foi aberta com `HANDLER ... OPEN`.

Há várias razões para usar a interface `HANDLER` em vez de instruções normais `SELECT`:

* `HANDLER` é mais rápido do que `SELECT`:

  + Um objeto de manipulador do motor de armazenamento designado é alocado para a `HANDLER ... OPEN`. O objeto é reutilizado para instruções `HANDLER` subsequentes para aquela tabela; ele não precisa ser reiniciado para cada uma.

  + Há menos análise envolvida.
  + Não há overhead de otimização ou verificação de consulta.
  + A interface do manipulador não precisa fornecer uma aparência consistente dos dados (por exemplo, leituras sujas são permitidas), então o motor de armazenamento pode usar otimizações que `SELECT` normalmente não permite.

* `HANDLER` facilita a migração para aplicações MySQL que usam uma interface semelhante a `ISAM` de nível baixo.

* `HANDLER` permite que você navegue por um banco de dados de uma maneira que é difícil (ou até impossível) de realizar com `SELECT`. A interface `HANDLER` é uma maneira mais natural de olhar para os dados ao trabalhar com aplicações que fornecem uma interface de usuário interativa para o banco de dados.

`HANDLER` é uma declaração de nível um pouco baixo. Por exemplo, ela não oferece consistência. Ou seja, `HANDLER ... OPEN` *não* captura uma instantânea da tabela e *não* bloqueia a tabela. Isso significa que, após a emissão de uma declaração `HANDLER ... OPEN`, os dados da tabela podem ser modificados (pela sessão atual ou por outras sessões) e essas modificações podem ser visíveis apenas parcialmente para as varreduras `HANDLER ... NEXT` ou `HANDLER ... PREV`.

Um manipulador aberto pode ser fechado e marcado para ser reaberto, nesse caso, o manipulador perde sua posição na tabela. Isso ocorre quando ambas as seguintes circunstâncias são verdadeiras:

* Qualquer sessão executa `FLUSH TABLES` ou declarações DDL na tabela do manipulador.

* A sessão na qual o manipulador está aberto executa declarações não `HANDLER` que utilizam tabelas.

`TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

Se uma tabela for esvaziada com `FLUSH TABLES tbl_name WITH READ LOCK` foi aberta com `HANDLER`, o manipulador é esvaziado implicitamente e perde sua posição.