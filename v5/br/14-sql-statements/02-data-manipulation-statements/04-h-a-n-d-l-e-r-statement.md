### 13.2.4 Comando HANDLER

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

O comando `HANDLER` fornece acesso direto às interfaces do *storage engine* da tabela. Ele está disponível para tabelas `InnoDB` e `MyISAM`.

O comando `HANDLER ... OPEN` abre uma tabela, tornando-a acessível usando comandos `HANDLER ... READ` subsequentes. Este objeto de tabela não é compartilhado por outras *sessions* e não é fechado até que a *session* chame `HANDLER ... CLOSE` ou a *session* seja encerrada.

Se você abrir a tabela usando um *alias*, referências futuras à tabela aberta com outros comandos `HANDLER` devem usar o *alias* em vez do nome da tabela. Se você não usar um *alias*, mas abrir a tabela usando um nome de tabela qualificado pelo nome do *Database*, referências futuras devem usar o nome da tabela não qualificado. Por exemplo, para uma tabela aberta usando `mydb.mytable`, referências futuras devem usar `mytable`.

A primeira sintaxe de `HANDLER ... READ` busca uma linha onde o *Index* especificado satisfaz os valores fornecidos e a condição `WHERE` é atendida. Se você tiver um *Index* de múltiplas colunas, especifique os valores das colunas do *Index* como uma lista separada por vírgulas. Especifique valores para todas as colunas no *Index*, ou especifique valores para um prefixo mais à esquerda das colunas do *Index*. Suponha que um *Index* `my_idx` inclua três colunas nomeadas `col_a`, `col_b` e `col_c`, nessa ordem. O comando `HANDLER` pode especificar valores para todas as três colunas no *Index*, ou para as colunas em um prefixo mais à esquerda. Por exemplo:

```sql
HANDLER ... READ my_idx = (col_a_val,col_b_val,col_c_val) ...
HANDLER ... READ my_idx = (col_a_val,col_b_val) ...
HANDLER ... READ my_idx = (col_a_val) ...
```

Para empregar a interface `HANDLER` para se referir à `PRIMARY KEY` de uma tabela, use o identificador entre aspas `` `PRIMARY` ``:

```sql
HANDLER tbl_name READ `PRIMARY` ...
```

A segunda sintaxe de `HANDLER ... READ` busca uma linha da tabela na ordem do *Index* que corresponde à condição `WHERE`.

A terceira sintaxe de `HANDLER ... READ` busca uma linha da tabela na ordem natural das linhas (*natural row order*) que corresponde à condição `WHERE`. Ela é mais rápida do que `HANDLER tbl_name READ index_name` quando um *full table scan* é desejado. A ordem natural das linhas é a ordem em que as linhas são armazenadas em um arquivo de dados de tabela `MyISAM`. Este comando também funciona para tabelas `InnoDB`, mas não existe tal conceito, pois não há um arquivo de dados separado.

Sem uma cláusula `LIMIT`, todas as formas de `HANDLER ... READ` buscam uma única linha, se disponível. Para retornar um número específico de linhas, inclua uma cláusula `LIMIT`. Ela tem a mesma sintaxe que a do comando [`SELECT`](select.html "13.2.9 SELECT Statement"). Consulte [Seção 13.2.9, “Comando SELECT”](select.html "13.2.9 SELECT Statement").

`HANDLER ... CLOSE` fecha uma tabela que foi aberta com `HANDLER ... OPEN`.

Existem várias razões para usar a interface `HANDLER` em vez dos comandos [`SELECT`](select.html "13.2.9 SELECT Statement") normais:

* `HANDLER` é mais rápido que [`SELECT`](select.html "13.2.9 SELECT Statement"):

  + Um objeto *handler* designado do *storage engine* é alocado para o `HANDLER ... OPEN`. O objeto é reutilizado para comandos `HANDLER` subsequentes para essa tabela; ele não precisa ser reinicializado para cada um.

  + Há menos *parsing* envolvido.
  + Não há sobrecarga de *Optimizer* ou de verificação de *Query*.
  + A interface *handler* não precisa fornecer uma visão consistente dos dados (por exemplo, [*dirty reads*](glossary.html#glos_dirty_read "dirty read") são permitidas), de modo que o *storage engine* pode usar otimizações que o [`SELECT`](select.html "13.2.9 SELECT Statement") normalmente não permite.

* `HANDLER` torna mais fácil a portabilidade para o MySQL de aplicações que usam uma interface de baixo nível semelhante ao `ISAM`. (Consulte [Seção 14.21, “Plugin InnoDB memcached”](innodb-memcached.html "14.21 InnoDB memcached Plugin") para uma forma alternativa de adaptar aplicações que usam o paradigma de armazenamento chave-valor (*key-value store*).)

* `HANDLER` permite que você percorra um *Database* de uma maneira que é difícil (ou mesmo impossível) de realizar com [`SELECT`](select.html "13.2.9 SELECT Statement"). A interface `HANDLER` é uma forma mais natural de visualizar dados ao trabalhar com aplicações que fornecem uma interface de usuário interativa para o *Database*.

`HANDLER` é um comando de nível um tanto baixo. Por exemplo, ele não fornece consistência. Ou seja, `HANDLER ... OPEN` *não* tira um *snapshot* da tabela e *não* faz um *Lock* na tabela. Isso significa que, após a emissão de um comando `HANDLER ... OPEN`, os dados da tabela podem ser modificados (pela *session* atual ou por outras *sessions*), e essas modificações podem ser apenas parcialmente visíveis para varreduras `HANDLER ... NEXT` ou `HANDLER ... PREV`.

Um *handler* aberto pode ser fechado e marcado para reabertura, caso em que o *handler* perde sua posição na tabela. Isso ocorre quando ambas as seguintes circunstâncias são verdadeiras:

* Qualquer *session* executa [`FLUSH TABLES`](flush.html#flush-tables) ou comandos DDL na tabela do *handler*.

* A *session* na qual o *handler* está aberto executa comandos que não são `HANDLER` e que usam tabelas.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") para uma tabela fecha todos os *handlers* para a tabela que foram abertos com [`HANDLER OPEN`](handler.html "13.2.4 HANDLER Statement").

Se uma tabela que foi aberta com `HANDLER` for liberada (*flushed*) com [`FLUSH TABLES tbl_name WITH READ LOCK`](flush.html#flush-tables-with-read-lock-with-list), o *handler* é implicitamente liberado e perde sua posição.