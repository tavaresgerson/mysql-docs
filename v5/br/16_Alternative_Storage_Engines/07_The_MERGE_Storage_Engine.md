## 15.7 O Motor de Armazenamento MERGE

O motor de armazenamento `MERGE`, também conhecido como o motor `MRG_MyISAM`, é uma coleção de tabelas `MyISAM` idênticas que podem ser usadas como uma única unidade. “Idênticas” significa que todas as tabelas têm tipos de dados de coluna idênticos e informações de índice. Não é possível mesclar tabelas `MyISAM` nas quais as colunas estão listadas em uma ordem diferente, não têm exatamente os mesmos tipos de dados nas colunas correspondentes ou têm os índices em ordem diferente. No entanto, qualquer ou todas as tabelas `MyISAM` podem ser comprimidas com **myisampack**. Veja a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM comprimidas, somente de leitura”. As diferenças entre tabelas como essas não importam:

* Os nomes das colunas e índices correspondentes podem diferir.
* Os comentários para tabelas, colunas e índices podem diferir.
* As opções de tabela, como `AVG_ROW_LENGTH`, `MAX_ROWS` ou `PACK_KEYS`, podem diferir.

Uma alternativa a uma tabela `MERGE` é uma tabela dividida, que armazena partições de uma única tabela em arquivos separados. A partição permite que algumas operações sejam realizadas de forma mais eficiente e não é limitada ao motor de armazenamento `MyISAM`. Para mais informações, consulte o Capítulo 22, *Partição*.

Quando você cria uma tabela `MERGE`, o MySQL cria dois arquivos no disco. Os arquivos têm nomes que começam com o nome da tabela e têm uma extensão para indicar o tipo de arquivo. Um arquivo `.frm` armazena o formato da tabela, e um arquivo `.MRG` contém os nomes das tabelas subjacentes `MyISAM` que devem ser usadas como uma única tabela. As tabelas não precisam estar no mesmo banco de dados que a tabela `MERGE`.

Você pode usar `SELECT`, `DELETE`, `UPDATE` e `INSERT` nas tabelas `MERGE`. Você deve ter privilégios de `SELECT`, `DELETE` e `UPDATE` nas tabelas `MyISAM` que você mapeia para uma tabela `MERGE`.

Nota

O uso das tabelas `MERGE` implica a seguinte questão de segurança: se um usuário tem acesso à tabela `MyISAM` *`t`*, esse usuário pode criar uma tabela `MERGE` *`m`* que acesse *`t`*. No entanto, se os privilégios do usuário em *`t`* forem posteriormente revogados, o usuário pode continuar a acessar *`t`* fazendo isso através de *`m`*.

O uso de `DROP TABLE` com uma tabela `MERGE` exclui apenas a especificação `MERGE`. As tabelas subjacentes não são afetadas.

Para criar uma tabela `MERGE`, você deve especificar uma opção `UNION=(list-of-tables)` que indique quais tabelas `MyISAM` devem ser usadas. Opcionalmente, você pode especificar uma opção `INSERT_METHOD` para controlar como as inserções na tabela `MERGE` são realizadas. Use um valor de `FIRST` ou `LAST` para fazer as inserções na primeira ou última tabela subjacente, respectivamente. Se você não especificar nenhuma opção `INSERT_METHOD` ou se especificar com um valor de `NO`, as inserções na tabela `MERGE` não são permitidas e as tentativas de fazer isso resultam em um erro.

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

A coluna `a` é indexada como uma `PRIMARY KEY` nas tabelas subjacentes `MyISAM`, mas não na tabela `MERGE`. Lá, ela é indexada, mas não como uma `PRIMARY KEY`, porque uma tabela `MERGE` não pode impor a unicidade sobre o conjunto de tabelas subjacentes. (Da mesma forma, uma coluna com um índice `UNIQUE` nas tabelas subjacentes deve ser indexada na tabela `MERGE`, mas não como um índice `UNIQUE`.

Depois de criar a tabela `MERGE`, você pode usá-la para emitir consultas que operam no grupo de tabelas como um todo:

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

* `DROP` a tabela `MERGE` e recriá-la.

* Use `ALTER TABLE tbl_name UNION=(...)` para alterar a lista de tabelas subjacentes.

É também possível usar `ALTER TABLE ... UNION=()` (ou seja, com uma cláusula `UNION` vazia) para remover todas as tabelas subjacentes. No entanto, neste caso, a tabela está efetivamente vazia e as inserções falham porque não há uma tabela subjacente para receber novas strings. Tal tabela pode ser útil como um modelo para criar novas tabelas `MERGE` com [`CREATE TABLE ... LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement").

As definições e índices subjacentes da tabela devem estar de acordo com a definição da tabela `MERGE`. A conformidade é verificada quando uma tabela que faz parte de uma tabela `MERGE` é aberta, e não quando a tabela `MERGE` é criada. Se qualquer tabela não atender às verificações de conformidade, a operação que desencadeou a abertura da tabela falha. Isso significa que as alterações nas definições das tabelas dentro de uma tabela `MERGE` podem causar uma falha quando a tabela `MERGE` é acessada. As verificações de conformidade aplicadas a cada tabela são:

* A tabela subjacente e a tabela `MERGE` devem ter o mesmo número de colunas.

* A ordem da coluna na tabela subjacente e na tabela `MERGE` deve corresponder.

* Além disso, a especificação para cada coluna correspondente na tabela principal `MERGE` e nas tabelas subjacentes é comparada e deve satisfazer essas verificações:

+ O tipo de coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

+ O comprimento da coluna na tabela subjacente e na tabela `MERGE` deve ser igual.

+ A coluna da tabela subjacente e a tabela `MERGE` podem ser `NULL`.

* A tabela subjacente deve ter pelo menos tantos índices quanto a tabela `MERGE`. A tabela subjacente pode ter mais índices do que a tabela `MERGE`, mas não pode ter menos.

Nota

Existe um problema conhecido onde os índices nas mesmas colunas devem estar na mesma ordem, tanto na tabela `MERGE` quanto na tabela subjacente `MyISAM`. Veja o Bug #33653.

Cada índice deve satisfazer esses controles:

+ O tipo de índice da tabela subjacente e da tabela `MERGE` devem ser os mesmos.

+ O número de partes do índice (ou seja, várias colunas dentro de um índice composto) na definição do índice para a tabela subjacente e na tabela `MERGE` deve ser o mesmo.

+ Para cada parte do índice:

- As partes do índice devem ter comprimentos iguais.
- Os tipos de partes do índice devem ser iguais.
- As línguas das partes do índice devem ser iguais.
- Verifique se as partes do índice podem ser `NULL`.

Se uma tabela `MERGE` não puder ser aberta ou usada devido a um problema com uma tabela subjacente, `CHECK TABLE`[(check-table.html "13.7.2.2 CHECK TABLE Statement")] exibe informações sobre qual tabela causou o problema.

### Recursos adicionais

* Um fórum dedicado ao motor de armazenamento `MERGE` está disponível em <https://forums.mysql.com/list.php?93>.

### 15.7.1 Vantagens e Desvantagens da Tabela MERGE

As tabelas `MERGE` podem ajudá-lo a resolver os seguintes problemas:

* Gerencie facilmente um conjunto de tabelas de registro. Por exemplo, você pode colocar dados de diferentes meses em tabelas separadas, comprimir algumas delas com **myisampack** e, em seguida, criar uma tabela `MERGE` para usá-las como uma única.

* Obtenha mais velocidade. Você pode dividir uma tabela de leitura somente de leitura grande com base em alguns critérios e, em seguida, colocar tabelas individuais em diferentes discos. Uma tabela `MERGE` estruturada dessa maneira poderia ser muito mais rápida do que usar uma única tabela grande.

* Realize pesquisas mais eficientes. Se você sabe exatamente o que está procurando, pode pesquisar em apenas uma das tabelas subjacentes para algumas consultas e usar uma tabela `MERGE` para outras. Você pode até ter muitas tabelas diferentes `MERGE` que utilizam conjuntos sobrepostos de tabelas.

* Realize reparos mais eficientes. É mais fácil reparar tabelas menores individuais que estão mapeadas para uma tabela `MERGE` do que reparar uma única tabela grande.

* Mapea imediatamente muitas tabelas como uma única. Uma tabela `MERGE` não precisa manter um índice próprio, pois utiliza os índices das tabelas individuais. Como resultado, as coleções de tabelas `MERGE` são *muito* rápidas de criar ou remapeamento. (Você ainda deve especificar as definições de índice ao criar uma tabela `MERGE`, mesmo que nenhum índice seja criado.)

* Se você tem um conjunto de tabelas a partir das quais você cria uma tabela grande sob demanda, você pode, em vez disso, criar uma tabela `MERGE` a partir delas sob demanda. Isso é muito mais rápido e economiza muito espaço em disco.

* Exceder o limite de tamanho do arquivo para o sistema operacional. Cada tabela `MyISAM` é limitada por esse limite, mas uma coleção de tabelas `MyISAM` não o é.

* Você pode criar um alias ou sinônimo para uma tabela `MyISAM` definindo uma tabela `MERGE` que mapeia para essa única tabela. Não deve haver um impacto de desempenho realmente notável ao fazer isso (apenas alguns chamados indiretos e chamados `memcpy()` para cada leitura).

As desvantagens das tabelas `MERGE` são:

* Você pode usar apenas tabelas `MyISAM` idênticas para uma tabela `MERGE`.

* Algumas funcionalidades do `MyISAM` não estão disponíveis nas tabelas do `MERGE`. Por exemplo, você não pode criar índices `FULLTEXT` nas tabelas do `MERGE`. (Você pode criar índices `FULLTEXT` nas tabelas subjacentes do `MyISAM`, mas não pode pesquisar a tabela `MERGE` com uma pesquisa de texto completo.)

* Se a tabela `MERGE` não for temporária, todas as tabelas subjacentes `MyISAM` também devem ser não temporárias. Se a tabela `MERGE` for temporária, as tabelas `MyISAM` podem ser uma mistura de temporárias e não temporárias.

As tabelas `MERGE` utilizam mais descritores de arquivo do que as tabelas `MyISAM`. Se 10 clientes estão usando uma tabela `MERGE` que mapeia para 10 tabelas, o servidor utiliza (10 × 10) + 10 descritores de arquivo. (10 descritores de arquivo de dados para cada um dos 10 clientes e 10 descritores de arquivo de índice compartilhados entre os clientes.)

* As leituras do índice são mais lentas. Quando você lê um índice, o mecanismo de armazenamento `MERGE` precisa emitir uma leitura em todas as tabelas subjacentes para verificar qual delas mais se alinha com um valor de índice dado. Para ler o próximo valor do índice, o mecanismo de armazenamento `MERGE` precisa procurar nos buffers de leitura para encontrar o próximo valor. Somente quando um buffer de índice é esgotado, o mecanismo de armazenamento precisa ler o próximo bloco do índice. Isso torna os índices `MERGE` muito mais lentos nas pesquisas de `eq_ref`, mas não muito mais lentos nas pesquisas de `ref`. Para mais informações sobre `eq_ref` e `ref`, consulte a Seção 13.8.2, “Declaração EXPLAIN”.

### 15.7.2 Problemas com a tabela MERGE

Os problemas conhecidos com as tabelas `MERGE` são os seguintes:

* As tabelas de crianças `MERGE` são bloqueadas através da tabela pai. Se o pai for uma tabela temporária, ela não é bloqueada, e, portanto, as tabelas de crianças também não são bloqueadas; isso significa que o uso paralelo das tabelas subjacentes `MyISAM` as corrompe.

* Se você usar `ALTER TABLE` para alterar uma tabela `MERGE` para outro mecanismo de armazenamento, o mapeamento para as tabelas subjacentes é perdido. Em vez disso, as strings das tabelas subjacentes `MyISAM` são copiadas para a tabela alterada, que então usa o mecanismo de armazenamento especificado.

* A opção de tabela `INSERT_METHOD` para uma tabela `MERGE` indica qual tabela subjacente `MyISAM` deve ser usada para inserções na tabela `MERGE`. No entanto, o uso da opção de tabela `AUTO_INCREMENT` para aquela tabela `MyISAM` não tem efeito para inserções na tabela `MERGE` até que pelo menos uma string tenha sido inserida diretamente na tabela `MyISAM`.

* Uma tabela `MERGE` não pode manter restrições de unicidade sobre toda a tabela. Quando você realiza uma `INSERT`, os dados vão para a primeira ou última tabela `MyISAM` (conforme determinado pela opção `INSERT_METHOD`). O MySQL garante que os valores de chave únicos permaneçam únicos dentro daquela tabela `MyISAM`, mas não sobre todas as tabelas subjacentes na coleção.

* Como o motor `MERGE` não pode impor a unicidade sobre o conjunto de tabelas subjacentes, o `REPLACE` não funciona conforme o esperado. Os dois fatos principais são:

+ `REPLACE` pode detectar violações de chave única apenas na tabela subjacente para a qual ele vai escrever (que é determinada pela opção `INSERT_METHOD`). Isso difere das violações na própria tabela `MERGE`.

+ Se o `REPLACE` detectar uma violação de chave única, ele altera apenas a string correspondente na tabela subjacente para a qual está escrevendo; ou seja, a primeira ou a última tabela, conforme determinado pela opção `INSERT_METHOD`.

Considerações semelhantes se aplicam para `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

* As tabelas `MERGE` não suportam particionamento. Isso significa que você não pode particionar uma tabela `MERGE`, nem nenhuma das tabelas `MyISAM` subjacentes de uma tabela `MERGE` pode ser particionada.

* Você não deve usar `ANALYZE TABLE`(analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), `REPAIR TABLE`, `OPTIMIZE TABLE`, `ALTER TABLE`, `DROP TABLE`, `DELETE` sem uma cláusula `WHERE`, ou `TRUNCATE TABLE` em qualquer uma das tabelas que são mapeadas em uma tabela aberta `MERGE`. Se você fizer isso, a tabela `MERGE` ainda pode se referir à tabela original e produzir resultados inesperados. Para contornar esse problema, garanta que nenhuma tabela `MERGE` permaneça aberta, emitindo uma declaração `FLUSH TABLES` antes de realizar qualquer uma das operações nomeadas.

Os resultados inesperados incluem a possibilidade de que a operação na tabela `MERGE` informe corrupção de tabela. Se isso ocorrer após uma das operações nomeadas nas tabelas subjacentes `MyISAM`, a mensagem de corrupção é falsa. Para lidar com isso, emita uma declaração `FLUSH TABLES` após modificar as tabelas `MyISAM`.

* `DROP TABLE` em uma tabela que está sendo usada por uma tabela `MERGE` não funciona no Windows porque o mapeamento de tabela do mecanismo de armazenamento `MERGE` é oculto para a camada superior do MySQL. O Windows não permite a exclusão de arquivos abertos, então você deve primeiro esvaziar todas as tabelas `MERGE` (com `FLUSH TABLES`) ou descartar a tabela `MERGE` antes de descartar a tabela.

* A definição das tabelas `MyISAM` e a definição da tabela `MERGE` são verificadas quando as tabelas são acessadas (por exemplo, como parte de uma declaração `SELECT` ou `INSERT`). As verificações garantem que as definições das tabelas e a definição da tabela pai `MERGE` correspondam, comparando a ordem das colunas, os tipos, os tamanhos e os índices associados. Se houver uma diferença entre as tabelas, um erro é retornado e a declaração falha. Como essas verificações ocorrem quando as tabelas são abertas, quaisquer alterações na definição de uma única tabela, incluindo alterações de coluna, ordenação de coluna e alterações no motor, fazem com que a declaração falhe.

* A ordem dos índices na tabela `MERGE` e em suas tabelas subjacentes deve ser a mesma. Se você usar `ALTER TABLE` para adicionar um índice `UNIQUE` a uma tabela usada em uma tabela `MERGE`, e depois usar `ALTER TABLE` para adicionar um índice não exclusivo na tabela `MERGE`, a ordem dos índices das tabelas é diferente se já houvesse um índice não exclusivo na tabela subjacente. (Isso acontece porque `ALTER TABLE` coloca índices `UNIQUE` antes dos índices não exclusivos para facilitar a rápida detecção de chaves duplicadas.) Consequentemente, as consultas em tabelas com tais índices podem retornar resultados inesperados.

* Se você encontrar uma mensagem de erro semelhante ao ERRO 1017 (HY000): Não é possível encontrar o arquivo: '*`tbl_name`*.MRG' (errno: 2), geralmente isso indica que algumas das tabelas subjacentes não utilizam o mecanismo de armazenamento `MyISAM`. Confirme que todas essas tabelas são `MyISAM`.

* O número máximo de strings em uma tabela `MERGE` é de 264 (~1,844E+19; o mesmo que para uma tabela `MyISAM`). Não é possível combinar várias tabelas `MyISAM` em uma única tabela `MERGE` que teria mais do que este número de strings.

* O uso de tabelas subjacentes `MyISAM` com formatos de string diferentes, com uma tabela `MERGE` pai, atualmente é conhecido por falhar. Veja o Bug #32364.

* Não é possível alterar a lista de união de uma tabela não temporária `MERGE` quando o [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") está em vigor. O seguinte *não* funciona:

  ```sql
  CREATE TABLE m1 ... ENGINE=MRG_MYISAM ...;
  LOCK TABLES t1 WRITE, t2 WRITE, m1 WRITE;
  ALTER TABLE m1 ... UNION=(t1,t2) ...;
  ```

No entanto, você pode fazer isso com uma tabela temporária `MERGE`.

* Não é possível criar uma tabela `MERGE` com `CREATE ... SELECT`, nem como uma tabela temporária `MERGE`, nem como uma tabela não temporária `MERGE`. Por exemplo:

  ```sql
  CREATE TABLE m1 ... ENGINE=MRG_MYISAM ... SELECT ...;
  ```

Tentar fazer isso resulta em um erro: *`tbl_name`* não é `BASE TABLE`.

* Em alguns casos, valores diferentes das opções da tabela `PACK_KEYS` entre as tabelas `MERGE` e as tabelas subjacentes causam resultados inesperados se as tabelas subjacentes contiverem colunas `CHAR` ou `BINARY`. Como solução alternativa, use `ALTER TABLE` para garantir que todas as tabelas envolvidas tenham o mesmo valor `PACK_KEYS`. (Bug #50646)