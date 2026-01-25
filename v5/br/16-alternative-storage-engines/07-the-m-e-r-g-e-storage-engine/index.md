## 15.7 O Storage Engine MERGE

15.7.1 Vantagens e Desvantagens das Tabelas MERGE

15.7.2 Problemas com Tabelas MERGE

O `MERGE` storage engine, também conhecido como engine `MRG_MyISAM`, é uma coleção de tabelas `MyISAM` idênticas que podem ser usadas como uma única tabela. "Idênticas" significa que todas as tabelas possuem tipos de dados de coluna e informações de Index idênticos. Você não pode fazer o merge de tabelas `MyISAM` nas quais as colunas estão listadas em uma ordem diferente, não têm exatamente os mesmos tipos de dados nas colunas correspondentes ou têm os Indexes em ordem diferente. No entanto, qualquer uma ou todas as tabelas `MyISAM` podem ser compactadas com **myisampack**. Consulte a Seção 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”. Diferenças entre as tabelas, como as seguintes, não importam:

* Os nomes das colunas e Indexes correspondentes podem ser diferentes.
* Comentários para tabelas, colunas e Indexes podem ser diferentes.
* Opções de tabela, como `AVG_ROW_LENGTH`, `MAX_ROWS` ou `PACK_KEYS`, podem ser diferentes.

Uma alternativa a uma tabela `MERGE` é uma tabela particionada, que armazena partições de uma única tabela em arquivos separados. O Partitioning (Particionamento) permite que algumas operações sejam executadas de forma mais eficiente e não se limita ao `MyISAM` storage engine. Para mais informações, consulte o Capítulo 22, *Partitioning*.

Ao criar uma tabela `MERGE`, o MySQL cria dois arquivos no disco. Os arquivos têm nomes que começam com o nome da tabela e possuem uma extensão para indicar o tipo de arquivo. Um arquivo `.frm` armazena o formato da tabela, e um arquivo `.MRG` contém os nomes das tabelas `MyISAM` subjacentes que devem ser usadas como uma só. As tabelas não precisam estar no mesmo Database que a tabela `MERGE`.

Você pode usar `SELECT`, `DELETE`, `UPDATE` e `INSERT` em tabelas `MERGE`. Você deve ter privilégios `SELECT`, `DELETE` e `UPDATE` nas tabelas `MyISAM` que você mapeia para uma tabela `MERGE`.

Nota

O uso de tabelas `MERGE` implica na seguinte questão de segurança: Se um usuário tem acesso à tabela `MyISAM` *`t`*, esse usuário pode criar uma tabela `MERGE` *`m`* que acessa *`t`*. No entanto, se os privilégios do usuário em *`t`* forem subsequentemente revogados, o usuário poderá continuar acessando *`t`* fazendo-o através de *`m`*.

O uso de `DROP TABLE` com uma tabela `MERGE` descarta apenas a especificação `MERGE`. As tabelas subjacentes não são afetadas.

Para criar uma tabela `MERGE`, você deve especificar a opção `UNION=(list-of-tables)` que indica quais tabelas `MyISAM` usar. Opcionalmente, você pode especificar uma opção `INSERT_METHOD` para controlar como os inserts na tabela `MERGE` ocorrem. Use um valor de `FIRST` ou `LAST` para fazer com que os inserts sejam feitos na primeira ou na última tabela subjacente, respectivamente. Se você não especificar a opção `INSERT_METHOD` ou se a especificar com o valor `NO`, os inserts na tabela `MERGE` não serão permitidos, e as tentativas de fazê-lo resultarão em um erro.

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

A coluna `a` é indexada como uma `PRIMARY KEY` nas tabelas `MyISAM` subjacentes, mas não na tabela `MERGE`. Nela, ela é indexada, mas não como uma `PRIMARY KEY`, pois uma tabela `MERGE` não pode impor exclusividade sobre o conjunto de tabelas subjacentes. (Da mesma forma, uma coluna com um `UNIQUE Index` nas tabelas subjacentes deve ser indexada na tabela `MERGE`, mas não como um `UNIQUE Index`.)

Após criar a tabela `MERGE`, você pode usá-la para emitir Queries que operam no grupo de tabelas como um todo:

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

Para remapear uma tabela `MERGE` para uma coleção diferente de tabelas `MyISAM`, você pode usar um dos seguintes métodos:

* Usar `DROP` na tabela `MERGE` e recriá-la.

* Usar `ALTER TABLE tbl_name UNION=(...)` para alterar a lista de tabelas subjacentes.

  Também é possível usar `ALTER TABLE ... UNION=()` (isto é, com uma cláusula `UNION` vazia) para remover todas as tabelas subjacentes. No entanto, neste caso, a tabela fica efetivamente vazia e os inserts falham porque não há uma tabela subjacente para receber novas linhas. Uma tabela como essa pode ser útil como um template para criar novas tabelas `MERGE` com `CREATE TABLE ... LIKE`.

As definições das tabelas subjacentes e os Indexes devem estar em estrita conformidade com a definição da tabela `MERGE`. A conformidade é verificada quando uma tabela que faz parte de uma tabela `MERGE` é aberta, e não quando a tabela `MERGE` é criada. Se alguma tabela falhar nas verificações de conformidade, a operação que acionou a abertura da tabela falhará. Isso significa que alterações nas definições de tabelas dentro de um `MERGE` podem causar uma falha quando a tabela `MERGE` for acessada. As verificações de conformidade aplicadas a cada tabela são:

* A tabela subjacente e a tabela `MERGE` devem ter o mesmo número de colunas.

* A ordem das colunas na tabela subjacente e na tabela `MERGE` deve corresponder.

* Além disso, a especificação para cada coluna correspondente na tabela `MERGE` pai e nas tabelas subjacentes é comparada e deve satisfazer estas verificações:

  + O tipo de coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

  + O comprimento da coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

  + A coluna da tabela subjacente e da tabela `MERGE` podem ser `NULL`.

* A tabela subjacente deve ter pelo menos tantos Indexes quanto a tabela `MERGE`. A tabela subjacente pode ter mais Indexes do que a tabela `MERGE`, mas não pode ter menos.

  Nota

  Existe um problema conhecido em que os Indexes nas mesmas colunas devem estar em ordem idêntica, tanto na tabela `MERGE` quanto na tabela `MyISAM` subjacente. Consulte o Bug #33653.

  Cada Index deve satisfazer estas verificações:

  + O tipo de Index da tabela subjacente e da tabela `MERGE` deve ser o mesmo.

  + O número de partes do Index (isto é, várias colunas em um compound index) na definição de Index para a tabela subjacente e para a tabela `MERGE` deve ser o mesmo.

  + Para cada parte do Index:

    - Os comprimentos das partes do Index devem ser iguais.
    - Os tipos das partes do Index devem ser iguais.
    - As linguagens das partes do Index devem ser iguais.
    - Verificar se as partes do Index podem ser `NULL`.

Se uma tabela `MERGE` não puder ser aberta ou usada devido a um problema com uma tabela subjacente, `CHECK TABLE` exibirá informações sobre qual tabela causou o problema.

### Recursos Adicionais

* Um fórum dedicado ao `MERGE` storage engine está disponível em <https://forums.mysql.com/list.php?93>.
