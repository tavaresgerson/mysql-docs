### 13.2.4 Declaração do Gestor

```sql
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

A sintaxe `HANDLER ... READ` recupera uma linha onde o índice especificado satisfaz os valores fornecidos e a condição `WHERE` é atendida. Se você tiver um índice de múltiplas colunas, especifique os valores da coluna do índice como uma lista separada por vírgula. Especifique valores para todas as colunas do índice ou para um prefixo da esquerda das colunas do índice. Suponha que um índice `my_idx` inclua três colunas chamadas `col_a`, `col_b` e `col_c`, nessa ordem. A instrução `HANDLER` pode especificar valores para todas as três colunas do índice ou para as colunas em um prefixo da esquerda. Por exemplo:

```sql
HANDLER ... READ my_idx = (col_a_val,col_b_val,col_c_val) ...
HANDLER ... READ my_idx = (col_a_val,col_b_val) ...
HANDLER ... READ my_idx = (col_a_val) ...
```

Para utilizar a interface `HANDLER` para referenciar a `PRIMARY KEY` de uma tabela, use o identificador citado `PRIMARY`:

```sql
HANDLER tbl_name READ `PRIMARY` ...
```

A segunda sintaxe `HANDLER ... READ` recupera uma linha da tabela na ordem de índice que corresponde à condição `WHERE`.

A sintaxe `HANDLER ... READ` do terceiro tipo recupera uma linha da tabela na ordem natural de linhas que corresponde à condição `WHERE`. Ela é mais rápida do que `HANDLER tbl_name READ index_name` quando se deseja uma varredura completa da tabela. A ordem natural de linhas é a ordem em que as linhas são armazenadas em um arquivo de dados de tabela `MyISAM`. Esta declaração também funciona para tabelas `InnoDB`, mas não há tal conceito porque não há um arquivo de dados separado.

Sem uma cláusula `LIMIT`, todas as formas de `HANDLER ... READ` obtêm uma única linha se estiver disponível. Para retornar um número específico de linhas, inclua uma cláusula `LIMIT`. Ela tem a mesma sintaxe que a instrução `SELECT`. Veja Seção 13.2.9, “Instrução SELECT”.

`HANDLER ... CLOSE` fecha uma tabela que foi aberta com `HANDLER ... OPEN`.

Há várias razões para usar a interface `HANDLER` em vez das instruções normais de `SELECT` (select.html):

- `HANDLER` é mais rápido que `SELECT`:

  - Um objeto de manipulador de motor de armazenamento designado é alocado para o `HANDLER ... OPEN`. O objeto é reutilizado para as declarações `HANDLER` subsequentes para essa tabela; ele não precisa ser reiniciado para cada uma.

  - Há menos análise envolvida.

  - Não há sobrecarga de otimização ou verificação de consultas.

  - A interface de manipulação não precisa fornecer uma aparência consistente dos dados (por exemplo, leitura suja é permitida), então o mecanismo de armazenamento pode usar otimizações que o `SELECT` normalmente não permite.

- O `HANDLER` facilita a migração para aplicações do MySQL que utilizam uma interface semelhante à `ISAM` de nível baixo. (Consulte Seção 14.21, “Plugin memcached InnoDB” para uma maneira alternativa de adaptar aplicações que utilizam o paradigma de armazenamento de chaves e valores.)

- O `HANDLER` permite que você navegue por um banco de dados de uma maneira que é difícil (ou até impossível) de realizar com `[SELECT]` (select.html). A interface `HANDLER` é uma maneira mais natural de visualizar os dados ao trabalhar com aplicativos que fornecem uma interface de usuário interativa para o banco de dados.

`HANDLER` é uma declaração de nível um pouco baixo. Por exemplo, ela não oferece consistência. Ou seja, `HANDLER ... OPEN` *não* captura uma instantânea da tabela e *não* bloqueia a tabela. Isso significa que, após a emissão de uma declaração `HANDLER ... OPEN`, os dados da tabela podem ser modificados (pela sessão atual ou por outras sessões) e essas modificações podem ser visíveis apenas parcialmente em varreduras `HANDLER ... NEXT` ou `HANDLER ... PREV`.

Um manipulador aberto pode ser fechado e marcado para ser reaberto, nesse caso, o manipulador perde sua posição na tabela. Isso ocorre quando ambas as seguintes circunstâncias forem verdadeiras:

- Qualquer sessão executa instruções `FLUSH TABLES` ou DDL na tabela do manipulador.

- A sessão em que o manipulador está aberto executa instruções que não são `HANDLER` e que utilizam tabelas.

A instrução `TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

Se uma tabela foi esvaziada com `FLUSH TABLES tbl_name WITH READ LOCK` aberta com `HANDLER`, o manipulador é esvaziado implicitamente e perde sua posição.
