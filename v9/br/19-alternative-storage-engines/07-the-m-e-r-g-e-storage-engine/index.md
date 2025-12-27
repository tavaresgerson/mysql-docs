## O Motor de Armazenamento MERGE

18.7.1 Vantagens e Desvantagens da Tabela MERGE

18.7.2 Problemas com a Tabela MERGE

O motor de armazenamento `MERGE`, também conhecido como o motor `MRG_MyISAM`, é uma coleção de tabelas `MyISAM` idênticas que podem ser usadas como uma única. “Idênticas” significa que todas as tabelas têm tipos de dados de coluna idênticos e informações de índice. Você não pode mesclar tabelas `MyISAM` nas quais as colunas estão listadas em uma ordem diferente, não têm exatamente os mesmos tipos de dados nas colunas correspondentes ou têm os índices em uma ordem diferente. No entanto, qualquer ou todas as tabelas `MyISAM` podem ser compactadas com **myisampack**. Veja a Seção 6.6.6, “myisampack — Gerar Tabelas MyISAM Compactadas e Apenas de Leitura”. Diferenças entre tabelas como essas não importam:

* Os nomes das colunas e índices correspondentes podem diferir.
* Os comentários para tabelas, colunas e índices podem diferir.
* Opções de tabela como `AVG_ROW_LENGTH`, `MAX_ROWS` ou `PACK_KEYS` podem diferir.

Uma alternativa a uma tabela `MERGE` é uma tabela particionada, que armazena particionamentos de uma única tabela em arquivos separados e permite que algumas operações sejam realizadas de forma mais eficiente. Para mais informações, consulte o Capítulo 26, *Partitioning*.

Ao criar uma tabela `MERGE`, o MySQL cria um arquivo `.MRG` no disco que contém os nomes das tabelas `MyISAM` subjacentes que devem ser usadas como uma única. O formato da tabela `MERGE` é armazenado no dicionário de dados do MySQL. As tabelas subjacentes não precisam estar na mesma base de dados que a tabela `MERGE`.

Você pode usar `SELECT`, `DELETE`, `UPDATE` e `INSERT` em tabelas `MERGE`. Você deve ter privilégios de `SELECT`, `DELETE` e `UPDATE` nas tabelas `MyISAM` que você mapeia para uma tabela `MERGE`.

Nota

O uso de tabelas `MERGE` implica o seguinte problema de segurança: se um usuário tem acesso à tabela `MyISAM` *`t`*, esse usuário pode criar uma tabela `MERGE` *`m`* que acesse *`t`*. No entanto, se os privilégios do usuário em *`t`* forem revogados posteriormente, o usuário pode continuar a acessar *`t`* fazendo isso através de *`m`*.

O uso de `DROP TABLE` com uma tabela `MERGE` exclui apenas a especificação `MERGE`. As tabelas subjacentes não são afetadas.

Para criar uma tabela `MERGE`, você deve especificar uma opção `UNION=(lista-de-tabelas)` que indica quais tabelas `MyISAM` usar. Opcionalmente, você pode especificar uma opção `INSERT_METHOD` para controlar como as inserções na tabela `MERGE` ocorrem. Use um valor de `FIRST` ou `LAST` para fazer as inserções ocorrerem na primeira ou última tabela subjacente, respectivamente. Se você não especificar a opção `INSERT_METHOD` ou se especificar com um valor de `NO`, as inserções na tabela `MERGE` não são permitidas e as tentativas de fazê-lo resultam em um erro.

O exemplo seguinte mostra como criar uma tabela `MERGE`:

```
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

A coluna `a` é indexada como `PRIMARY KEY` nas tabelas `MyISAM` subjacentes, mas não na tabela `MERGE`. Lá, ela é indexada, mas não como `PRIMARY KEY`, porque uma tabela `MERGE` não pode impor a unicidade sobre o conjunto de tabelas subjacentes. (Da mesma forma, uma coluna com um índice `UNIQUE` nas tabelas subjacentes deve ser indexada na tabela `MERGE`, mas não como um índice `UNIQUE`.)

Após criar a tabela `MERGE`, você pode usá-la para emitir consultas que operam sobre o grupo de tabelas como um todo:

```
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

Para remappear uma tabela `MERGE` para uma coleção diferente de tabelas `MyISAM`, você pode usar um dos seguintes métodos:

* `DROP` a tabela `MERGE` e recriá-la.

* Use `ALTER TABLE tbl_name UNION=(...)` para alterar a lista de tabelas subjacentes.

Também é possível usar `ALTER TABLE ... UNION=()` (ou seja, com uma cláusula `UNION` vazia) para remover todas as tabelas subjacentes. No entanto, nesse caso, a tabela é efetivamente vazia e as inserções falham porque não há uma tabela subjacente para receber novas linhas. Tal tabela pode ser útil como um modelo para criar novas tabelas `MERGE` com `CREATE TABLE ... LIKE`.

As definições e índices das tabelas subjacentes devem estar de acordo com a definição da tabela `MERGE`. A conformidade é verificada quando uma tabela que faz parte de uma tabela `MERGE` é aberta, e não quando a tabela `MERGE` é criada. Se qualquer tabela falhar nas verificações de conformidade, a operação que desencadeou a abertura da tabela falha. Isso significa que alterações nas definições das tabelas dentro de uma `MERGE` podem causar um erro quando a tabela `MERGE` é acessada. As verificações de conformidade aplicadas a cada tabela são:

* A tabela subjacente e a tabela `MERGE` devem ter o mesmo número de colunas.

* A ordem das colunas na tabela subjacente e na tabela `MERGE` deve corresponder.

* Além disso, a especificação de cada coluna correspondente na tabela `MERGE` pai e nas tabelas subjacentes é comparada e deve satisfazer essas verificações:

  + O tipo de coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

  + A largura da coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

  + A coluna da tabela subjacente e da tabela `MERGE` pode ser `NULL`.

* A tabela subjacente deve ter pelo menos tantas tabelas de índice quanto a tabela `MERGE`. A tabela subjacente pode ter mais índices do que a tabela `MERGE`, mas não pode ter menos.

Nota

Existe um problema conhecido em que os índices em colunas iguais devem estar na mesma ordem, tanto na tabela `MERGE` quanto na tabela `MyISAM` subjacente. Veja o Bug
#33653.

Cada índice deve satisfazer os seguintes critérios:

+ O tipo de índice da tabela subjacente e da tabela `MERGE` deve ser o mesmo.

+ O número de partes do índice (ou seja, múltiplas colunas dentro de um índice composto) na definição do índice para a tabela subjacente e para a tabela `MERGE` deve ser o mesmo.

+ Para cada parte do índice:

    - As comprimentos das partes do índice devem ser iguais.
    - Os tipos das partes do índice devem ser iguais.
    - As linguagens das partes do índice devem ser iguais.
    - Verifique se as partes do índice podem ser `NULL`.

Se uma tabela `MERGE` não puder ser aberta ou usada devido a um problema com uma tabela subjacente, o `CHECK TABLE` exibe informações sobre qual tabela causou o problema.

### Recursos Adicionais

* Um fórum dedicado ao motor de armazenamento `MERGE` está disponível em <https://forums.mysql.com/list.php?93>.