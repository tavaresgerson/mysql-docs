### 15.2.5 Declaração do Gestor

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

A declaração `HANDLER` fornece acesso direto às interfaces do motor de armazenamento de tabelas. Está disponível para as tabelas `InnoDB` e `MyISAM`.

A declaração `HANDLER ... OPEN` abre uma tabela, tornando-a acessível usando as declarações subsequentes `HANDLER ... READ`. Esse objeto de tabela não é compartilhado por outras sessões e não é fechado até que a sessão chame `HANDLER ... CLOSE` ou a sessão termine.

Se você abrir a tabela usando um alias, referências adicionais à tabela aberta com outras declarações `HANDLER` devem usar o alias em vez do nome da tabela. Se você não usar um alias, mas abrir a tabela usando um nome de tabela qualificado pelo nome do banco de dados, referências adicionais devem usar o nome da tabela não qualificado. Por exemplo, para uma tabela aberta usando `mydb.mytable`, referências adicionais devem usar `mytable`.

A sintaxe `HANDLER ... READ` recupera uma linha onde o índice especificado satisfaz os valores fornecidos e a condição `WHERE` é atendida. Se você tiver um índice de várias colunas, especifique os valores da coluna do índice separados por vírgula. Especifique valores para todas as colunas do índice ou para um prefixo da esquerda das colunas do índice. Suponha que um índice `my_idx` inclua três colunas chamadas `col_a`, `col_b` e `col_c`, nessa ordem. A instrução `HANDLER` pode especificar valores para todas as três colunas do índice ou para as colunas de um prefixo da esquerda. Por exemplo:

```
HANDLER ... READ my_idx = (col_a_val,col_b_val,col_c_val) ...
HANDLER ... READ my_idx = (col_a_val,col_b_val) ...
HANDLER ... READ my_idx = (col_a_val) ...
```

Para utilizar a interface `HANDLER` para referenciar a tabela `PRIMARY KEY`, use o identificador citado `` `PRIMARY` ``:

```
HANDLER tbl_name READ `PRIMARY` ...
```

A sintaxe `HANDLER ... READ` busca uma linha da tabela em ordem de índice que corresponda à condição `WHERE`.

A sintaxe `HANDLER ... READ` recupera uma linha da tabela em ordem natural de linhas que correspondem à condição `WHERE`. É mais rápida que `HANDLER tbl_name READ index_name` quando se deseja uma varredura completa da tabela. A ordem natural de linhas é a ordem em que as linhas são armazenadas em um arquivo de dados de tabela `MyISAM`. Esta declaração também funciona para tabelas `InnoDB`, mas não há tal conceito porque não há um arquivo de dados separado.

Sem uma cláusula `LIMIT`, todas as formas de `HANDLER ... READ` buscam uma única linha se estiver disponível. Para retornar um número específico de linhas, inclua uma cláusula `LIMIT`. Ela tem a mesma sintaxe que a declaração `SELECT`. Veja a Seção 15.2.13, “Instrução SELECT”.

`HANDLER ... CLOSE` fecha uma tabela que foi aberta com `HANDLER ... OPEN`.

Há várias razões para usar a interface `HANDLER` em vez das instruções normais `SELECT`:

- `HANDLER` é mais rápido que `SELECT`:

  - Um objeto de manipulador de motor de armazenamento designado é alocado para o `HANDLER ... OPEN`. O objeto é reutilizado para as instruções subsequentes `HANDLER` para aquela tabela; ele não precisa ser reiniciado para cada uma.

  - Há menos análise envolvida.

  - Não há sobrecarga de otimização ou verificação de consultas.

  - A interface de manipulação não precisa fornecer uma aparência consistente dos dados (por exemplo, leituras sujas são permitidas), então o mecanismo de armazenamento pode usar otimizações que o `SELECT` normalmente não permite.

- `HANDLER` facilita a migração para aplicativos que utilizam uma interface semelhante a um `ISAM` de nível baixo para aplicativos que utilizam um paradigma de armazenamento de chaves e valores (ver Seção 17.20, “Plugin memcached InnoDB” para uma maneira alternativa de adaptar aplicativos que utilizam o paradigma de armazenamento de chaves e valores).

- O `HANDLER` permite que você navegue por um banco de dados de uma maneira que é difícil (ou até impossível) de realizar com o `SELECT`. A interface `HANDLER` é uma maneira mais natural de visualizar os dados ao trabalhar com aplicativos que fornecem uma interface de usuário interativa para o banco de dados.

`HANDLER` é uma declaração de nível bastante baixo. Por exemplo, ela não oferece consistência. Ou seja, `HANDLER ... OPEN` *não* captura uma instantânea da tabela e *não* bloqueia a tabela. Isso significa que, após a emissão de uma declaração `HANDLER ... OPEN`, os dados da tabela podem ser modificados (pela sessão atual ou por outras sessões) e essas modificações podem ser visíveis apenas parcialmente para as varreduras de `HANDLER ... NEXT` ou `HANDLER ... PREV`.

Um manipulador aberto pode ser fechado e marcado para ser reaberto, nesse caso, o manipulador perde sua posição na tabela. Isso ocorre quando ambas as seguintes circunstâncias forem verdadeiras:

- Qualquer sessão executa as instruções `FLUSH TABLES` ou DDL na tabela do manipulador.

- A sessão em que o manipulador está aberto executa instruções que não utilizam tabelas, como as instruções que contêm `HANDLER`.

`TRUNCATE TABLE` para uma tabela fecha todos os manipuladores da tabela que foram abertos com `HANDLER OPEN`.

Se uma tabela foi esvaziada com `FLUSH TABLES tbl_name WITH READ LOCK` e foi aberta com `HANDLER`, o manipulador é implicitamente esvaziado e perde sua posição.
