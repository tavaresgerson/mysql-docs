## 15.7 O Motor de Armazenamento MERGE

15.7.1 Vantagens e desvantagens da tabela MERGE

15.7.2 Problemas com a tabela MERGE

O mecanismo de armazenamento `MERGE`, também conhecido como o mecanismo `MRG_MyISAM`, é uma coleção de tabelas `MyISAM` idênticas que podem ser usadas como uma única. “Idênticas” significa que todas as tabelas têm tipos de dados de coluna idênticos e informações de índice. Você não pode mesclar tabelas `MyISAM` nas quais as colunas estão listadas em uma ordem diferente, não têm exatamente os mesmos tipos de dados nas colunas correspondentes ou têm os índices em uma ordem diferente. No entanto, qualquer ou todas as tabelas `MyISAM` podem ser compactadas com **myisampack**. Veja a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM compactadas e somente leitura”. As diferenças entre tabelas como essas não importam:

- Os nomes das colunas e índices correspondentes podem diferir.
- Os comentários para tabelas, colunas e índices podem variar.
- As opções da tabela, como `AVG_ROW_LENGTH`, `MAX_ROWS` ou `PACK_KEYS`, podem variar.

Uma alternativa à tabela `MERGE` é uma tabela particionada, que armazena partições de uma única tabela em arquivos separados. A partição permite que algumas operações sejam realizadas de forma mais eficiente e não está limitada ao motor de armazenamento `MyISAM`. Para mais informações, consulte o Capítulo 22, *Partição*.

Quando você cria uma tabela `MERGE`, o MySQL cria dois arquivos no disco. Os arquivos têm nomes que começam com o nome da tabela e têm uma extensão para indicar o tipo de arquivo. Um arquivo `.frm` armazena o formato da tabela, e um arquivo `.MRG` contém os nomes das tabelas `MyISAM` subjacentes que devem ser usadas como uma única tabela. As tabelas não precisam estar no mesmo banco de dados que a tabela `MERGE`.

Você pode usar `SELECT`, `DELETE`, `UPDATE` e `INSERT` em tabelas `MERGE`. Você deve ter privilégios de `SELECT`, `DELETE` e `UPDATE` nas tabelas `MyISAM` que você mapeia para uma tabela `MERGE`.

Nota

O uso de tabelas `MERGE` implica no seguinte problema de segurança: se um usuário tem acesso à tabela `MyISAM` *`t`*, esse usuário pode criar uma tabela `MERGE` *`m`* que acesse *`t`*. No entanto, se os privilégios do usuário em *`t`* forem revogados posteriormente, o usuário pode continuar a acessar *`t`* fazendo isso através de *`m`*.

O uso de `DROP TABLE` com uma tabela `MERGE` exclui apenas a especificação `MERGE`. As tabelas subjacentes não são afetadas.

Para criar uma tabela `MERGE`, você deve especificar uma opção `UNION=(lista-de-tabelas)` que indica quais tabelas `MyISAM` usar. Você pode opcionalmente especificar uma opção `INSERT_METHOD` para controlar como as inserções na tabela `MERGE` ocorrem. Use um valor de `FIRST` ou `LAST` para fazer as inserções na primeira ou última tabela subjacente, respectivamente. Se você não especificar nenhuma opção `INSERT_METHOD` ou se especificar com um valor de `NO`, as inserções na tabela `MERGE` não são permitidas e as tentativas de fazê-lo resultam em um erro.

O exemplo a seguir mostra como criar uma tabela `MERGE`:

```sql
mysql> CREATE TABLE t1 (
    ->    a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->    message CHAR(20)) ENGINE=MyISAM;
mysql> CREATE TABLE t2 (
    ->    a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->    message CHAR(20)) ENGINE=MyISAM;
mysql> INSERT INTO t1 (message) VALUES ('Testing'),('table'),('t1');
mysql> INSERT INTO t2 (message) VALUES ('Testing'),('table'),('t2');
mysql> CREATE TABLE total (
    ->    a INT NOT NULL AUTO_INCREMENT,
    ->    message CHAR(20), INDEX(a))
    ->    ENGINE=MERGE UNION=(t1,t2) INSERT_METHOD=LAST;
```

A coluna `a` é indexada como `PRIMARY KEY` nas tabelas `MyISAM` subjacentes, mas não na tabela `MERGE`. Lá, ela está indexada, mas não como `PRIMARY KEY`, porque uma tabela `MERGE` não pode impor a unicidade sobre o conjunto de tabelas subjacentes. (Da mesma forma, uma coluna com um índice `UNIQUE` nas tabelas subjacentes deve ser indexada na tabela `MERGE`, mas não como um índice `UNIQUE`.)

Depois de criar a tabela `MERGE`, você pode usá-la para emitir consultas que operam sobre o grupo de tabelas como um todo:

```sql
mysql> SELECT * FROM total;
+---+---------+
| a | message |
+---+---------+
| 1 | Testing |
| 2 | table   |
| 3 | t1      |
| 1 | Testing |
| 2 | table   |
| 3 | t2      |
+---+---------+
```

Para remapeamento de uma tabela `MERGE` para uma coleção diferente de tabelas `MyISAM`, você pode usar um dos seguintes métodos:

- `DROP` a tabela `MERGE` e recrie-a.

- Use `ALTER TABLE tbl_name UNION=(...)` para alterar a lista de tabelas subjacentes.

  Também é possível usar `ALTER TABLE ... UNION=()` (ou seja, com uma cláusula `UNION` vazia) para remover todas as tabelas subjacentes. No entanto, nesse caso, a tabela fica efetivamente vazia e as inserções falham porque não há uma tabela subjacente para receber novas linhas. Uma tabela desse tipo pode ser útil como um modelo para criar novas tabelas `MERGE` com `CREATE TABLE ... LIKE`.

As definições e índices das tabelas subjacentes devem estar em conformidade com a definição da tabela `MERGE`. A conformidade é verificada quando uma tabela que faz parte de uma tabela `MERGE` é aberta, e não quando a tabela `MERGE` é criada. Se qualquer tabela falhar nas verificações de conformidade, a operação que desencadeou a abertura da tabela falhará. Isso significa que alterações nas definições das tabelas dentro de uma `MERGE` podem causar falhas quando a tabela `MERGE` é acessada. As verificações de conformidade aplicadas a cada tabela são:

- A tabela subjacente e a tabela `MERGE` devem ter o mesmo número de colunas.

- A ordem das colunas na tabela subjacente e na tabela `MERGE` deve ser a mesma.

- Além disso, a especificação de cada coluna correspondente na tabela principal `MERGE` e nas tabelas subjacentes é comparada e deve satisfazer essas verificações:

  - O tipo de coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

  - O comprimento da coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

  - A coluna da tabela subjacente e a tabela `MERGE` podem ser `NULL`.

- A tabela subjacente deve ter pelo menos tantos índices quanto a tabela `MERGE`. A tabela subjacente pode ter mais índices do que a tabela `MERGE`, mas não pode ter menos.

  Nota

  Existe um problema conhecido em que os índices nas mesmas colunas devem estar na mesma ordem, tanto na tabela `MERGE` quanto na tabela subjacente `MyISAM`. Veja o bug #33653.

  Cada índice deve satisfazer esses controles:

  - O tipo de índice da tabela subjacente e da tabela `MERGE` devem ser os mesmos.

  - O número de partes do índice (ou seja, múltiplas colunas dentro de um índice composto) na definição do índice para a tabela subjacente e a tabela `MERGE` deve ser o mesmo.

  - Para cada parte do índice:

    - As partes do índice devem ter comprimentos iguais.
    - Os tipos de partes do índice devem ser iguais.
    - As línguas das partes do índice devem ser iguais.
    - Verifique se as partes do índice podem ser `NULL`.

Se uma tabela `MERGE` não puder ser aberta ou usada devido a um problema com uma tabela subjacente, a `CHECK TABLE` exibe informações sobre qual tabela causou o problema.

### Recursos adicionais

- Um fórum dedicado ao motor de armazenamento `MERGE` está disponível em <https://forums.mysql.com/list.php?93>.
