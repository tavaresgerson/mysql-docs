## 19.5 Notas e dicas de replicação

### 19.5.1 Recursos e problemas de replicação

As seções a seguir fornecem informações sobre o que é suportado e o que não é suportado na replicação do MySQL, e sobre questões e situações específicas que podem ocorrer ao replicar determinadas declarações.

A replicação baseada em declarações depende da compatibilidade no nível SQL entre a fonte e a réplica. Em outras palavras, a replicação bem-sucedida baseada em declarações requer que quaisquer recursos SQL utilizados sejam suportados tanto pelo servidor fonte quanto pelo servidor réplica. Se você usar um recurso no servidor fonte que está disponível apenas na versão atual do MySQL, não poderá replicar para uma réplica que use uma versão anterior do MySQL. Tais incompatibilidades também podem ocorrer dentro de uma série de lançamentos, bem como entre versões.

Se você planeja usar replicação baseada em declarações entre MySQL 8.0 e uma série anterior de lançamentos do MySQL, é uma boa ideia consultar a edição do *Manual de Referência do MySQL* correspondente à série de lançamentos anterior para obter informações sobre as características de replicação dessa série.

Com a replicação baseada em declarações do MySQL, pode haver problemas na replicação de rotinas ou gatilhos armazenados. Você pode evitar esses problemas usando a replicação baseada em linhas do MySQL. Para uma lista detalhada dos problemas, consulte a Seção 27.7, “Registro binário de programas armazenados”. Para mais informações sobre o registro baseado em linhas e replicação baseada em linhas, consulte a Seção 7.4.4.1, “Formatos de registro binário”, e a Seção 19.2.1, “Formatos de replicação”.

Para informações adicionais específicas sobre replicação e `InnoDB`, consulte a Seção 17.19, “InnoDB e replicação do MySQL”. Para informações relacionadas à replicação com NDB Cluster, consulte a Seção 25.7, “Replicação do NDB Cluster”.

#### 19.5.1.1 Replicação e AUTO_INCREMENT

A replicação baseada em declarações dos valores de `AUTO_INCREMENT`, `LAST_INSERT_ID()` e `TIMESTAMP` é realizada sob as seguintes exceções:

* Uma declaração que invoca um gatilho ou função que causa uma atualização em uma coluna `AUTO_INCREMENT` não é replicada corretamente usando a replicação baseada em declaração. Essas declarações são marcadas como inseguras. (Bug #45677)

* Uma `INSERT` em uma tabela que possui uma chave primária composta que inclui uma coluna `AUTO_INCREMENT` que não é a primeira coluna dessa chave composta não é segura para registro baseado em declarações ou replicação. Essas declarações são marcadas como inseguras. (Bug #11754117, Bug #45670)

Este problema não afeta tabelas que utilizam o mecanismo de armazenamento `InnoDB`, uma vez que uma tabela `InnoDB` com uma coluna AUTO_INCREMENT requer pelo menos uma chave onde a coluna de auto-incremento é a única ou a coluna mais à esquerda.

* Adicionar uma coluna `AUTO_INCREMENT` a uma tabela com `ALTER TABLE` pode não produzir a mesma ordem das linhas na réplica e na fonte. Isso ocorre porque a ordem em que as linhas são numeradas depende do motor de armazenamento específico usado para a tabela e da ordem em que as linhas foram inseridas. Se é importante ter a mesma ordem na fonte e na réplica, as linhas devem ser ordenadas antes de atribuir um número `AUTO_INCREMENT`. Supondo que você queira adicionar uma coluna `AUTO_INCREMENT` a uma tabela `t1` que tem colunas `col1` e `col2`, as seguintes declarações produzem uma nova tabela `t2` idêntica a `t1`, mas com uma coluna `AUTO_INCREMENT`:

  ```
  CREATE TABLE t2 LIKE t1;
  ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
  INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
  ```

Importante

Para garantir a mesma ordenação tanto na fonte quanto na replica, a cláusula `ORDER BY` deve nomear *todas* as colunas de `t1`.

As instruções fornecidas acima estão sujeitas às limitações de `CREATE TABLE ... LIKE` (create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement"): As definições de chave estrangeira são ignoradas, assim como as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY`. Se uma definição de tabela incluir alguma dessas características, crie `t2` usando uma declaração [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") que seja idêntica àquela usada para criar `t1`, mas com a adição da coluna `AUTO_INCREMENT`.

Independentemente do método usado para criar e povoar a cópia com a coluna `AUTO_INCREMENT`, a etapa final é descartar a tabela original e, em seguida, renomear a cópia:

  ```
  DROP t1;
  ALTER TABLE t2 RENAME t1;
  ```

Veja também a Seção B.3.6.1, “Problemas com ALTER TABLE”.

#### 19.5.1.2 Replicação e tabelas BLACKHOLE

O motor de armazenamento `BLACKHOLE` aceita dados, mas os descarta e não os armazena. Ao realizar o registro binário, todas as inserções em tais tabelas são sempre registradas, independentemente do formato de registro utilizado. As atualizações e exclusões são tratadas de maneira diferente, dependendo se o registro baseado em declarações ou em linhas está sendo utilizado. Com o formato de registro baseado em declarações, todas as declarações que afetam as tabelas `BLACKHOLE` são registradas, mas seus efeitos são ignorados. Ao usar o registro baseado em linhas, as atualizações e exclusões em tais tabelas são simplesmente ignoradas — elas não são escritas no registro binário. Um aviso é registrado sempre que isso ocorre.

Por essa razão, recomendamos que, ao replicar tabelas usando o mecanismo de armazenamento `BLACKHOLE`, você defina a variável de servidor `binlog_format` para `STATEMENT`, e não para `ROW` ou `MIXED`.

#### 19.5.1.3 Replicação e Conjuntos de Caracteres

O que se segue se aplica à replicação entre servidores MySQL que utilizam diferentes conjuntos de caracteres:

* Se a fonte tiver bancos de dados com um conjunto de caracteres diferente do valor global `character_set_server`, você deve projetar suas declarações `CREATE TABLE`(create-table.html "15.1.20 CREATE TABLE Statement") para que elas não dependam implicitamente do conjunto de caracteres padrão do banco de dados. Uma boa solução é declarar explicitamente o conjunto de caracteres e a collation nas declarações `CREATE TABLE`.

#### 19.5.1.4 Replicação e CHECKSUM TABLE

`CHECKSUM TABLE` retorna um checksum que é calculado linha por linha, usando um método que depende do formato de armazenamento da linha da tabela. O formato de armazenamento não é garantido para permanecer o mesmo entre as versões do MySQL, então o valor do checksum pode mudar após uma atualização.

#### 19.5.1.5 Replicação de CREATE SERVER, ALTER SERVER e DROP SERVER

As declarações `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER` não são escritas no log binário, independentemente do formato de registro binário que está em uso.

#### 19.5.1.6 Replicação de declarações CREATE ... IF NOT EXISTS

O MySQL aplica essas regras quando várias declarações `CREATE ... IF NOT EXISTS` são replicadas:

* Cada declaração `CREATE DATABASE IF NOT EXISTS` (create-database.html "15.1.12 CREATE DATABASE Statement") é replicada, independentemente de a base de dados já existir na fonte.

* Da mesma forma, cada declaração `CREATE TABLE IF NOT EXISTS`(create-table.html "15.1.20 CREATE TABLE Statement") sem uma declaração `SELECT` é replicada, independentemente de a tabela já existir na fonte. Isso inclui `CREATE TABLE IF NOT EXISTS ... LIKE`(create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement"). A replicação de `CREATE TABLE IF NOT EXISTS ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") segue regras um pouco diferentes; consulte a Seção 19.5.1.7, “Replicação de Declarações CREATE TABLE ... SELECT”, para mais informações.

* `CREATE EVENT IF NOT EXISTS`](create-event.html "15.1.13 CREATE EVENT Statement") é sempre replicado, independentemente de o evento nomeado na declaração já existir na fonte.

* `CREATE USER` é escrito no log binário apenas se for bem-sucedido. Se a declaração incluir `IF NOT EXISTS`, é considerada bem-sucedida e é registrada, desde que pelo menos um usuário mencionado na declaração seja criado; nesses casos, a declaração é registrada como escrita; isso inclui referências a usuários existentes que não foram criados. Consulte o registro binário de CREATE USER para obter mais informações.

* (*MySQL 8.0.29 e posterior*:) `CREATE PROCEDURE IF NOT EXISTS` (create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements"), `CREATE FUNCTION IF NOT EXISTS` (create-function.html "15.1.14 CREATE FUNCTION Statement"), ou `CREATE TRIGGER IF NOT EXISTS` (create-trigger.html "15.1.22 CREATE TRIGGER Statement"), se bem-sucedido, é escrito na íntegra no log binário (incluindo a cláusula `IF NOT EXISTS`, independentemente de a declaração ter levantado um aviso ou não, porque o objeto (procedimento, função ou gatilho) já existia.

#### 19.5.1.7 Replicação de declarações CREATE TABLE ... SELECT

O MySQL aplica essas regras quando as declarações `CREATE TABLE ... SELECT`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") são replicadas:

* `CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") sempre realiza um compromisso implícito (Seção 15.3.3, “Declarações que Causam um Compromisso Implícito”).

* Se a tabela de destino não existir, o registro ocorre da seguinte forma. Não importa se o `IF NOT EXISTS` está presente.

+ `STATEMENT` ou `MIXED` formato: A declaração é registrada conforme escrito.

+ `ROW` formato: A declaração é registrada como uma declaração `CREATE TABLE` seguida por uma série de eventos de inserção de linha.

Antes do MySQL 8.0.21, a declaração é registrada como duas transações. A partir do MySQL 8.0.21, em motores de armazenamento que suportam DDL atômica, ela é registrada como uma transação. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

* Se a declaração `CREATE TABLE ... SELECT`(create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") falhar, nada é registrado. Isso inclui o caso em que a tabela de destino existe e `IF NOT EXISTS` não é fornecida.

* Se a tabela de destino existir e `IF NOT EXISTS` for fornecida, o MySQL 8.0 ignora completamente a declaração; nada é inserido ou registrado.

O MySQL 8.0 não permite que uma declaração `CREATE TABLE ... SELECT` faça quaisquer alterações em tabelas que não sejam as tabelas criadas pela declaração.

#### 19.5.1.8 Replicação de CURRENT_USER()

As seguintes declarações apoiam o uso da função `CURRENT_USER()` para substituir o nome de, e possivelmente o endereço de, um usuário afetado ou um definidor:

* `DROP USER`
* `RENAME USER`
* `GRANT`
* `REVOKE`
* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE TRIGGER`
* `CREATE EVENT`
* `CREATE VIEW`
* `ALTER EVENT`
* `ALTER VIEW`
* `SET PASSWORD`

Quando o registro binário está habilitado e `CURRENT_USER()` ou `CURRENT_USER` é usado como o definidor em qualquer uma dessas declarações, o MySQL Server garante que a declaração seja aplicada ao mesmo usuário tanto na fonte quanto na replica quando a declaração é replicada. Em alguns casos, como declarações que alteram senhas, a referência à função é expandida antes de ser escrita no log binário, para que a declaração inclua o nome do usuário. Para todos os outros casos, o nome do usuário atual na fonte é replicado para a replica como metadados, e a replica aplica a declaração ao usuário atual nomeado nos metadados, em vez do usuário atual na replica.

#### 19.5.1.9 Replicação com definições de tabela diferentes na fonte e na réplica

As tabelas de origem e de destino para replicação não precisam ser idênticas. Uma tabela na origem pode ter mais ou menos colunas do que a cópia da tabela da replica. Além disso, as colunas correspondentes das tabelas na origem e na replica podem usar tipos de dados diferentes, sob certas condições.

Nota

A replicação entre tabelas que são particionadas de maneira diferente uma da outra não é suportada. Consulte a Seção 19.5.1.24, “Replicação e Partição”.

Em todos os casos em que as tabelas de origem e destino não têm definições idênticas, os nomes do banco de dados e das tabelas devem ser os mesmos tanto na origem quanto na replica. Condições adicionais são discutidas, com exemplos, nas duas seções seguintes.

##### 19.5.1.9.1 Replicação com mais colunas na fonte ou réplica

Você pode replicar uma tabela da fonte para a replica de forma que as cópias da fonte e da replica da tabela tenham números diferentes de colunas, desde que as seguintes condições sejam atendidas:

* As colunas comuns às duas versões da tabela devem ser definidas na mesma ordem na fonte e na replica. (Isso é verdadeiro mesmo que ambas as tabelas tenham o mesmo número de colunas.)

* As colunas comuns às duas versões da tabela devem ser definidas antes de quaisquer colunas adicionais.

Isso significa que a execução de uma declaração `ALTER TABLE` (alter-table.html "15.1.9 ALTER TABLE Statement") na replica onde uma nova coluna é inserida na tabela dentro do intervalo de colunas comuns a ambas as tabelas faz com que a replicação falhe, conforme mostrado no exemplo a seguir:

Suponha que uma tabela `t`, existente na fonte e na replica, seja definida pela seguinte declaração `CREATE TABLE`:

  ```
  CREATE TABLE t (
      c1 INT,
      c2 INT,
      c3 INT
  );
  ```

Suponha que a declaração `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") mostrada aqui seja executada na réplica:

  ```
  ALTER TABLE t ADD COLUMN cnew1 INT AFTER c3;
  ```

O anterior `ALTER TABLE` é permitido na réplica porque as colunas `c1`, `c2` e `c3` que são comuns às duas versões da tabela `t` permanecem agrupadas juntas em ambas as versões da tabela, antes de quaisquer colunas que diferem.

No entanto, a seguinte declaração `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") não pode ser executada na réplica sem causar a quebra da replicação:

  ```
  ALTER TABLE t ADD COLUMN cnew2 INT AFTER c2;
  ```

A replicação falha após a execução na replica da declaração `ALTER TABLE` que acabou de ser mostrada, porque a nova coluna `cnew2` vem entre as colunas comuns a ambas as versões de `t`.

* Cada coluna "extra" na versão da tabela com mais colunas deve ter um valor padrão.

O valor padrão de uma coluna é determinado por vários fatores, incluindo seu tipo, se ela é definida com uma opção `DEFAULT`, se é declarada como `NULL` e o modo SQL do servidor em vigor no momento de sua criação; para mais informações, consulte a Seção 13.6, “Valores padrão de tipo de dados”).

Além disso, quando a cópia da tabela da réplica tiver mais colunas do que a cópia da fonte, cada coluna comum às tabelas deve usar o mesmo tipo de dados em ambas as tabelas.

**Exemplos.** Os exemplos a seguir ilustram algumas definições de tabela válidas e inválidas:

**Mais colunas na fonte.** As seguintes definições de tabela são válidas e replicam corretamente:

```
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

As seguintes definições de tabela gerariam um erro, porque as definições das colunas comuns às duas versões da tabela estão em uma ordem diferente na replica do que na fonte:

```
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT);
```

As seguintes definições de tabela também gerariam um erro, pois a definição da coluna extra na fonte aparece antes das definições das colunas comuns às duas versões da tabela:

```
source> CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

**Mais colunas na réplica.** As seguintes definições de tabela são válidas e replicam corretamente:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

As seguintes definições geram um erro porque as colunas comuns às duas versões da tabela não estão definidas na mesma ordem tanto na fonte quanto na replica:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT, c3 INT);
```

As seguintes definições de tabela também geram um erro porque a definição da coluna extra na versão da tabela da replica aparece antes das definições das colunas que são comuns a ambas as versões da tabela:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
```

As seguintes definições de tabela falham porque a versão da tabela da replica tem colunas adicionais em comparação com a versão da fonte, e as duas versões da tabela utilizam tipos de dados diferentes para a coluna comum `c2`:

```
source> CREATE TABLE t1 (c1 INT, c2 BIGINT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

##### 19.5.1.9.2 Replicação de colunas com tipos de dados diferentes

Colunas correspondentes nas cópias da mesma tabela do original e da réplica devem, idealmente, ter o mesmo tipo de dados. No entanto, isso não é sempre rigorosamente aplicado, desde que certas condições sejam atendidas.

Geralmente é possível replicar de uma coluna de um determinado tipo de dados para outra coluna do mesmo tipo e do mesmo tamanho ou largura, quando aplicável, ou maior. Por exemplo, é possível replicar de uma coluna `CHAR(10)` para outra `CHAR(10)`, ou de uma coluna `CHAR(10)` para uma coluna `CHAR(25)` sem problemas. Em certos casos, também é possível replicar de uma coluna que tem um tipo de dados (na versão da fonte) para uma coluna que tem um tipo de dados diferente (na replica); quando o tipo de dados da versão da fonte da coluna é promovido para um tipo que tem o mesmo tamanho ou maior na replica, isso é conhecido como promoção de atributo.

A atribuição de promoção pode ser usada com replicação baseada em declaração e baseada em linha, e não depende do mecanismo de armazenamento usado pelo banco de dados fonte ou da replica. No entanto, a escolha do formato de registro tem um efeito sobre os tipos de conversão permitidos; os detalhes são discutidos mais adiante nesta seção.

Importante

Se você usar replicação baseada em declarações ou baseada em linhas, a cópia da tabela da replica não pode conter mais colunas do que a cópia da fonte, se você deseja empregar promoção de atributos.

**Replicação baseada em declarações.** Ao usar a replicação baseada em declarações, uma regra simples a seguir é: “Se a declaração executada na fonte também executar com sucesso na réplica, ela também deve ser replicada com sucesso”. Em outras palavras, se a declaração usa um valor que é compatível com o tipo de uma coluna dada na réplica, a declaração pode ser replicada. Por exemplo, você pode inserir qualquer valor que se encaixe em uma coluna `TINYINT` em uma coluna `BIGINT` também; segue-se que, mesmo que você mude o tipo de uma coluna `TINYINT` na cópia da réplica de uma tabela para `BIGINT`, qualquer inserção nessa coluna na fonte que tenha sucesso também deve ter sucesso na réplica, uma vez que é impossível ter um valor legal `TINYINT` que seja grande o suficiente para exceder uma coluna `BIGINT`.

**Replicação baseada em linhas: promoção e demissão de atributos.** A replicação baseada em linhas suporta promoção e demissão de atributos entre tipos de dados menores e tipos maiores. Também é possível especificar se é permitido ou não a conversão não-perda (atrasada) ou perda (trunc) de valores de coluna demitida, conforme explicado mais adiante nesta seção.

**Conversões sem perdas e com perdas.** No caso em que o tipo de destino não possa representar o valor sendo inserido, deve-se tomar uma decisão sobre como lidar com a conversão. Se permitir a conversão, mas truncar (ou modificar de outra forma) o valor da fonte para obter um "ajuste" na coluna de destino, realizamos o que é conhecido como uma conversão com perdas. Uma conversão que não requer truncamento ou modificações semelhantes para ajustar o valor da coluna de origem na coluna de destino é uma conversão sem perdas.

**Modos de conversão de tipo.** O valor global da variável do sistema `replica_type_conversions` (do MySQL 8.0.26) ou `slave_type_conversions` (antes do MySQL 8.0.26) controla o modo de conversão de tipo usado na replica. Essa variável recebe um conjunto de valores da lista a seguir, que descreve os efeitos de cada modo no comportamento de conversão de tipo da replica:

ALL_LOSSY:   Neste modo, as conversões de tipo que significariam perda de informação são permitidas.

Isso não implica que as conversões não perdas sejam permitidas, apenas que apenas os casos que requerem conversões perdas ou nenhuma conversão são permitidos; por exemplo, habilitar *apenas* este modo permite que uma coluna `INT` seja convertida para `TINYINT` (uma conversão perdas), mas não uma coluna `TINYINT` para uma coluna `INT` (não perdas). Tentar a conversão deste último caso causaria a parada da replicação com um erro na replica.

ALL_NON_LOSSY: Este modo permite conversões que não exigem truncação ou outro tratamento especial do valor de origem; ou seja, permite conversões onde o tipo de destino tem uma faixa mais ampla do que o tipo de origem.

Definir este modo não afeta se as conversões sem perdas são permitidas; isso é controlado com o modo `ALL_LOSSY`. Se apenas `ALL_NON_LOSSY` for definido, mas não `ALL_LOSSY`, então tentar uma conversão que resultaria na perda de dados (como de `INT` para `TINYINT`, ou de `CHAR(25)` para `VARCHAR(20)`) faz com que a replica pare com um erro.

ALL_LOSSY, ALL_NON_LOSSY: Quando este modo é definido, todas as conversões de tipo suportadas são permitidas, independentemente de serem conversões não-perdas ou

ALL_SIGNED: Trate os tipos inteiros promovidos como valores assinados (o comportamento padrão).

ALL_UNSIGNED: Trate os tipos de inteiro promovidos como valores não assinados.

ALL_SIGNED, ALL_UNSIGNED: Trate os tipos de inteiro promovidos como assinados, se possível, caso contrário, como não assinados.

[*empty*] :   Quando `replica_type_conversions` ou `slave_type_conversions` não é definido, nenhuma promoção ou demissão de atributo é permitida; isso significa que todas as colunas nas tabelas de origem e destino devem ser do mesmo tipo.

Este modo é o padrão.

Quando um tipo inteiro é promovido, sua sinalização não é preservada. Por padrão, a replica trata todos esses valores como sinalizados. Você pode controlar esse comportamento usando `ALL_SIGNED`, `ALL_UNSIGNED` ou ambos. `ALL_SIGNED` indica à replica que trate todos os tipos inteiros promovidos como sinalizados; `ALL_UNSIGNED` instrui-a a tratá-los como não sinalizados. Especificar ambos faz com que a replica trate o valor como sinalizado, se possível, caso contrário, como não sinalizado; a ordem em que eles são listados não é significativa. Nem `ALL_SIGNED` nem `ALL_UNSIGNED` têm efeito se pelo menos um dos `ALL_LOSSY` ou `ALL_NONLOSSY` não for usado também.

Para alterar o modo de conversão de tipo, é necessário reiniciar a replica com o novo ajuste `replica_type_conversions` ou `slave_type_conversions`.

**Conversões suportadas.** As conversões suportadas entre diferentes, mas semelhantes, tipos de dados são mostradas na lista a seguir:

* Entre qualquer um dos tipos de número inteiro `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

Isso inclui conversões entre as versões assinadas e não assinadas desses tipos.

As conversões sem perda são feitas truncando o valor da fonte para o máximo (ou mínimo) permitido pelo campo de destino. Para garantir conversões não-sem perda ao passar de tipos não assinados para assinados, o campo de destino deve ser grande o suficiente para acomodar a faixa de valores na coluna de origem. Por exemplo, você pode demitir `TINYINT UNSIGNED` sem perda para `SMALLINT`, mas não para `TINYINT`.

* Entre qualquer um dos tipos decimais `DECIMAL` - DECIMAL, NUMERIC"), `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), e `NUMERIC` - DECIMAL, NUMERIC").

`FLOAT` a `DOUBLE` é uma conversão não-perda; `DOUBLE` a `FLOAT` só pode ser tratada de forma perda; uma conversão de `DECIMAL(M,D)` a `DECIMAL(M',D')` onde `D' >= D` e `(M'-D') >= (M-D`) é não-perda; para qualquer caso onde `M' < M`, `D' < D`, ou ambos, só pode ser feita uma conversão perda.

Para qualquer um dos tipos decimais, se um valor a ser armazenado não puder caber no tipo alvo, o valor é arredondado para baixo de acordo com as regras de arredondamento definidas para o servidor em outras partes da documentação. Consulte a Seção 14.24.4, “Comportamento de Arredondamento”, para informações sobre como isso é feito para os tipos decimais.

* Entre qualquer um dos tipos de cordas `CHAR`, `VARCHAR` e `TEXT`, incluindo conversões entre diferentes larguras.

A conversão de uma coluna `CHAR`, `VARCHAR` ou `TEXT` para uma coluna `CHAR`, `VARCHAR` ou `TEXT` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é tratada ao inserir apenas os primeiros *`N`* caracteres da string na réplica, onde *`N`* é a largura da coluna de destino.

Importante

A replicação entre colunas usando diferentes conjuntos de caracteres não é suportada.

* Entre qualquer um dos tipos de dados binários `BINARY`, `VARBINARY` e `BLOB`, incluindo conversões entre diferentes larguras.

A conversão de uma coluna `BINARY`, `VARBINARY` ou `BLOB` para uma coluna `BINARY`, `VARBINARY` ou `BLOB` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é tratada ao inserir apenas os primeiros *`N`* bytes da string na réplica, onde *`N`* é a largura da coluna de destino.

* Entre quaisquer 2 colunas `BIT` de qualquer tamanho.

Ao inserir um valor de uma coluna `BIT(M)` em uma coluna `BIT(M')`, onde `M' > M`, os bits mais significativos das colunas `BIT(M')` são limpos (definidos como zero) e os bits *`M`* do valor da coluna `BIT(M)` são definidos como os bits menos significativos da coluna `BIT(M')`.

Ao inserir um valor de uma coluna de origem `BIT(M)` em uma coluna de destino `BIT(M')`, onde `M' < M`, o valor máximo possível para a coluna `BIT(M')` é atribuído; em outras palavras, um valor "todos os itens" é atribuído à coluna de destino.

As conversões entre tipos que não estão na lista anterior não são permitidas.

#### 19.5.1.10 Opções de replicação e tabela de diretório

Se uma opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` for usada em uma declaração `CREATE TABLE` no servidor de origem, a opção de tabela também é usada na replica. Isso pode causar problemas se não houver um diretório correspondente no sistema de arquivos do host da replica ou se existir, mas não for acessível ao servidor MySQL da replica. Isso pode ser contornado usando o modo SQL do servidor `NO_DIR_IN_CREATE` na replica, o que faz com que a replica ignore as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` ao replicar declarações `CREATE TABLE`. O resultado é que os arquivos de dados e índice `MyISAM` são criados no diretório do banco de dados da tabela.

Para mais informações, consulte a Seção 7.1.11, “Modos SQL do servidor”.

#### 19.5.1.11 Replicação de declarações DROP ... IF EXISTS

As declarações `DROP DATABASE IF EXISTS`(drop-database.html "15.1.24 DROP DATABASE Statement"), `DROP TABLE IF EXISTS`(drop-table.html "15.1.32 DROP TABLE Statement") e `DROP VIEW IF EXISTS`(drop-view.html "15.1.35 DROP VIEW Statement") são sempre replicadas, mesmo que o banco de dados, a tabela ou a visão a serem excluídos não existam na fonte. Isso é para garantir que o objeto a ser excluído não exista mais na fonte ou na replica, uma vez que a replica tenha alcançado a fonte.

As declarações `DROP ... IF EXISTS` para programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) também são replicadas, mesmo que o programa armazenado que será removido não exista na fonte.

#### 19.5.1.12 Replicação e valores de ponto flutuante

Com a replicação baseada em declarações, os valores são convertidos de decimal para binário. Como as conversões entre as representações decimais e binárias deles podem ser aproximadas, as comparações que envolvem valores de ponto flutuante são inexatas. Isso é verdade para operações que usam explicitamente valores de ponto flutuante ou que usam valores que são convertidos implicitamente para ponto flutuante. As comparações de valores de ponto flutuante podem produzir resultados diferentes nos servidores de origem e replicação devido às diferenças na arquitetura do computador, no compilador usado para construir o MySQL, e assim por diante. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”, e a Seção B.3.4.8, “Problemas com Valores de Ponto Flutuante”.

#### 19.5.1.13 Replicação e FLUSH

Algumas formas da declaração `FLUSH` não são registradas porque poderiam causar problemas se replicadas para uma réplica: `FLUSH LOGS` e `FLUSH TABLES WITH READ LOCK`. Para um exemplo de sintaxe, consulte a Seção 15.7.8.3, “Declaração FLUSH”. As declarações `FLUSH TABLES`, `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE` são escritas no log binário e, portanto, replicadas para réplicas. Isso normalmente não é um problema, porque essas declarações não modificam os dados da tabela.

No entanto, esse comportamento pode causar dificuldades em determinadas circunstâncias. Se você replicar as tabelas de privilégios no banco de dados `mysql` e atualizar essas tabelas diretamente, sem usar `GRANT`, você deve emitir um `FLUSH PRIVILEGES` nas réplicas para colocar os novos privilégios em vigor. Além disso, se você usar `FLUSH TABLES` ao renomear uma tabela `MyISAM` que faz parte de uma tabela `MERGE`, você deve emitir manualmente `FLUSH TABLES` nas réplicas. Essas declarações são escritas no log binário, a menos que você especifique `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

#### 19.5.1.14 Replicação e funções do sistema

Algumas funções não se replicam bem em algumas condições:

As funções `USER()`, `CURRENT_USER()` (ou `CURRENT_USER`, `UUID()`, `VERSION()` e `LOAD_FILE()` são replicadas sem alterações e, portanto, não funcionam de forma confiável na replica, a menos que a replicação baseada em linha seja habilitada. (Veja a Seção 19.2.1, “Formatos de Replicação”).

`USER()` e `CURRENT_USER()` são replicados automaticamente usando replicação baseada em linha quando se usa o modo `MIXED`, e geram um aviso no modo `STATEMENT`. (Veja também a Seção 19.5.1.8, “Replicação de CURRENT_USER()”). Isso também é válido para `VERSION()` e `RAND()`.

* Para `NOW()`, o log binário inclui o timestamp. Isso significa que o valor *como retornado pela chamada a esta função na fonte* é replicado na replica. Para evitar resultados inesperados ao replicar entre servidores MySQL em diferentes fusos horários, defina o fuso horário tanto na fonte quanto na replica. Para mais informações, consulte a Seção 19.5.1.33, “Replicação e Fusos Horários”.

Para explicar os problemas potenciais ao replicar entre servidores que estão em diferentes fusos horários, suponha que a fonte esteja localizada em Nova York, a replica esteja localizada em Estocolmo e ambos os servidores estejam usando o horário local. Suponha ainda que, na fonte, você crie uma tabela `mytable`, realize uma declaração `INSERT` nesta tabela e, em seguida, selecione a partir da tabela, como mostrado aqui:

  ```
  mysql> CREATE TABLE mytable (mycol TEXT);
  Query OK, 0 rows affected (0.06 sec)

  mysql> INSERT INTO mytable VALUES ( NOW() );
  Query OK, 1 row affected (0.00 sec)

  mysql> SELECT * FROM mytable;
  +---------------------+
  | mycol               |
  +---------------------+
  | 2009-09-01 12:00:00 |
  +---------------------+
  1 row in set (0.00 sec)
  ```

A hora local em Estocolmo é 6 horas mais tarde que em Nova York; portanto, se você emitir `SELECT NOW()` na réplica nesse mesmo instante exato, o valor `2009-09-01 18:00:00` é retornado. Por essa razão, se você selecionar a cópia da réplica de `mytable` após as declarações `CREATE TABLE` e `INSERT` mostradas anteriormente terem sido replicadas, você pode esperar que `mycol` contenha o valor `2009-09-01 18:00:00`. No entanto, esse não é o caso; quando você seleciona a cópia da réplica de `mytable`, você obtém exatamente o mesmo resultado que na fonte:

  ```
  mysql> SELECT * FROM mytable;
  +---------------------+
  | mycol               |
  +---------------------+
  | 2009-09-01 12:00:00 |
  +---------------------+
  1 row in set (0.00 sec)
  ```

Ao contrário de `NOW()`, a função `SYSDATE()` não é segura para replicação, pois não é afetada por declarações `SET TIMESTAMP` no log binário e é não determinística se o registro baseado em declarações for usado. Isso não é um problema se o registro baseado em linhas for usado.

Uma alternativa é usar a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja um alias para `NOW()`. Isso deve ser feito na fonte e na replica para funcionar corretamente. Nesses casos, uma advertência ainda é emitida por essa função, mas pode ser ignorada com segurança, desde que `--sysdate-is-now` seja usado tanto na fonte quanto na replica.

`SYSDATE()` é automaticamente replicado usando replicação baseada em linha ao usar o modo `MIXED`, e gera um aviso no modo `STATEMENT`.

Veja também a Seção 19.5.1.33, “Replicação e Fuso Horário”.

*A restrição a seguir se aplica apenas à replicação baseada em declarações, e não à replicação baseada em linhas.* As funções `GET_LOCK()`, `RELEASE_LOCK()`, `IS_FREE_LOCK()` e `IS_USED_LOCK()` que lidam com bloqueios de nível de usuário são replicadas sem que a réplica saiba o contexto de concorrência na fonte. Portanto, essas funções não devem ser usadas para inserir em uma tabela de origem porque o conteúdo na réplica seria diferente. Por exemplo, não emita uma declaração como `INSERT INTO mytable VALUES(GET_LOCK(...))`.

Essas funções são replicadas automaticamente usando replicação baseada em linha quando se usa o modo `MIXED`, e geram um aviso no modo `STATEMENT`.

Como uma solução para as limitações anteriores quando a replicação baseada em declarações está em vigor, você pode usar a estratégia de salvar o resultado da função problemática em uma variável do usuário e referenciar a variável em uma declaração posterior. Por exemplo, o seguinte `INSERT` de uma única linha é problemático devido à referência à função `UUID()`:

```
INSERT INTO t VALUES(UUID());
```

Para contornar o problema, faça o seguinte:

```
SET @my_uuid = UUID();
INSERT INTO t VALUES(@my_uuid);
```

Essa sequência de declarações é repetida porque o valor de `@my_uuid` é armazenado no log binário como um evento de variável do usuário antes da declaração `INSERT` e está disponível para uso no `INSERT`.

A mesma ideia se aplica a inserções de várias linhas, mas é mais complicada de usar. Para uma inserção de duas linhas, você pode fazer o seguinte:

```
SET @my_uuid1 = UUID(); @my_uuid2 = UUID();
INSERT INTO t VALUES(@my_uuid1),(@my_uuid2);
```

No entanto, se o número de linhas for grande ou desconhecido, a solução é difícil ou inviável. Por exemplo, não é possível converter a seguinte declaração em uma em que uma variável de usuário específica é associada a cada linha:

```
INSERT INTO t2 SELECT UUID(), * FROM t1;
```

Dentro de uma função armazenada, `RAND()` se replica corretamente, desde que seja invocada apenas uma vez durante a execução da função. (Você pode considerar o timestamp de execução da função e a semente de número aleatório como entradas implícitas que são idênticas na fonte e na replica.)

As funções `FOUND_ROWS()` e `ROW_COUNT()` não são replicadas de forma confiável usando replicação baseada em declarações. Uma solução é armazenar o resultado da chamada de função em uma variável do usuário e, em seguida, usar essa variável na declaração `INSERT`. Por exemplo, se você deseja armazenar o resultado em uma tabela chamada `mytable`, você normalmente faria isso assim:

```
SELECT SQL_CALC_FOUND_ROWS FROM mytable LIMIT 1;
INSERT INTO mytable VALUES( FOUND_ROWS() );
```

No entanto, se você estiver replicando `mytable`, você deve usar `SELECT ... INTO` e, em seguida, armazenar a variável na tabela, assim:

```
SELECT SQL_CALC_FOUND_ROWS INTO @found_rows FROM mytable LIMIT 1;
INSERT INTO mytable VALUES(@found_rows);
```

Dessa forma, a variável do usuário é replicada como parte do contexto e aplicada corretamente na replica.

Essas funções são replicadas automaticamente usando replicação baseada em linha quando se usa o modo `MIXED`, e geram um aviso no modo `STATEMENT` (Bug #12092, Bug #30244).

#### 19.5.1.15 Suporte à replicação e segundos fracionários

O MySQL 8.0 permite segundos fracionários para os valores de `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microsegundos (6 dígitos). Veja a Seção 13.2.6, “Segundos Fracionários em Valores de Tempo”.

#### 19.5.1.16 Replicação de Recursos Invocados

A replicação de recursos invocados, como funções carregáveis e programas armazenados (procedimentos e funções armazenados, gatilhos e eventos), oferece as seguintes características:

* Os efeitos do recurso são sempre replicados.
* As seguintes declarações são replicadas usando replicação baseada em declarações:

+ `CREATE EVENT`
+ `ALTER EVENT`
+ `DROP EVENT`
+ `CREATE PROCEDURE`
+ `DROP PROCEDURE`
+ `CREATE FUNCTION`
+ `DROP FUNCTION`
+ `CREATE TRIGGER`
+ `DROP TRIGGER`

No entanto, os *efeitos* dos recursos criados, modificados ou descartados usando essas declarações são replicados usando replicação baseada em linha.

Nota

Tentar replicar recursos invocados usando replicação baseada em declarações produz o aviso "A declaração não é segura para ser registrada no formato de declaração". Por exemplo, ao tentar replicar uma função carregável com replicação baseada em declarações, gera-se esse aviso porque, atualmente, não pode ser determinado pelo servidor MySQL se a função é determinística. Se você tem certeza absoluta de que os efeitos do recurso invocado são determinísticos, pode ignorar esses avisos com segurança.

* No caso de `CREATE EVENT` e `ALTER EVENT`:

+ O status do evento está definido como `SLAVESIDE_DISABLED` na réplica, independentemente do estado especificado (isto não se aplica a `DROP EVENT`).

+ A fonte na qual o evento foi criado é identificada na replica por sua ID de servidor. A coluna `ORIGINATOR` em `INFORMATION_SCHEMA.EVENTS` armazena essas informações. Consulte a Seção 15.7.7.18, “Declaração SHOW EVENTS”, para mais informações.

* A implementação do recurso reside na replica em um estado renovável, para que, se a fonte falhar, a replica possa ser usada como fonte sem perda do processamento de eventos.

Para determinar se há algum evento agendado em um servidor MySQL que foi criado em outro servidor (que estava atuando como fonte), consulte a tabela do esquema de informações `EVENTS` de uma maneira semelhante àquela mostrada aqui:

```
SELECT EVENT_SCHEMA, EVENT_NAME
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Como alternativa, você pode usar a declaração `SHOW EVENTS` (show-events.html "15.7.7.18 SHOW EVENTS Statement"), assim:

```
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Ao promover uma réplica com tais eventos para uma fonte, você deve habilitar cada evento usando `ALTER EVENT event_name ENABLE`(alter-event.html "15.1.3 ALTER EVENT Statement"), onde *`event_name`* é o nome do evento.

Se mais de uma fonte estiver envolvida na criação de eventos nesta réplica e você deseja identificar eventos que foram criados apenas em uma fonte específica com o ID do servidor *`source_id`*, modifique a consulta anterior na tabela `EVENTS` para incluir a coluna `ORIGINATOR`, conforme mostrado aqui:

```
SELECT EVENT_SCHEMA, EVENT_NAME, ORIGINATOR
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Você pode usar `ORIGINATOR` com a declaração `SHOW EVENTS` de maneira semelhante:

```
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Antes de habilitar eventos que foram replicados a partir da fonte, você deve desabilitar o Cronograma de Eventos do MySQL na replica (usando uma declaração como `SET GLOBAL event_scheduler = OFF;`), executar quaisquer declarações necessárias `ALTER EVENT`(alter-event.html "15.1.3 ALTER EVENT Statement") (se necessário), reiniciar o servidor e, em seguida, reabilitar o Cronograma de Eventos na replica posteriormente (usando uma declaração como `SET GLOBAL event_scheduler = ON;`).

Se, posteriormente, você desvalorizar a nova fonte novamente como uma réplica, você deve desabilitar manualmente todos os eventos habilitados pelas declarações `ALTER EVENT`. Você pode fazer isso armazenando em uma tabela separada os nomes dos eventos da declaração `SELECT` mostrada anteriormente, ou usando declarações `ALTER EVENT` para renomear os eventos com um prefixo comum, como `replicated_`, para identificá-los.

Se você renomear os eventos, então, ao despromover esse servidor de volta a ser uma replica, você pode identificar os eventos fazendo uma consulta à tabela `EVENTS`, como mostrado aqui:

```
SELECT CONCAT(EVENT_SCHEMA, '.', EVENT_NAME) AS 'Db.Event'
      FROM INFORMATION_SCHEMA.EVENTS
      WHERE INSTR(EVENT_NAME, 'replicated_') = 1;
```

#### 19.5.1.17 Replicação de documentos JSON

Antes do MySQL 8.0, uma atualização em uma coluna JSON era sempre escrita no log binário como o documento completo. No MySQL 8.0, é possível registrar atualizações parciais em documentos JSON (veja Atualizações Parciais de Valores JSON), o que é mais eficiente. O comportamento de registro depende do formato usado, conforme descrito aqui:

**Replicação baseada em declarações.** As atualizações parciais do JSON são sempre registradas como atualizações parciais. Isso não pode ser desativado quando se usa o registro baseado em declarações.

**Replicação baseada em linhas.** Atualizações parciais do JSON não são registradas como tal por padrão, mas sim registradas como documentos completos. Para habilitar o registro de atualizações parciais, defina `binlog_row_value_options=PARTIAL_JSON`. Se uma fonte de replicação tiver essa variável definida, as atualizações parciais recebidas dessa fonte são manipuladas e aplicadas por uma réplica, independentemente da configuração própria da variável da réplica.

Os servidores que executam o MySQL 8.0.2 ou versões anteriores não reconhecem os eventos de log usados para atualizações parciais JSON. Por esse motivo, quando se replica para um servidor que executa o MySQL 8.0.3 ou versões posteriores, o `binlog_row_value_options` deve ser desativado na fonte, definindo essa variável como `''` (string vazia). Consulte a descrição dessa variável para obter mais informações.

#### 19.5.1.18 Replicação e LIMITE

A replicação baseada em declarações das cláusulas de `LIMIT` nas declarações de `DELETE`, `UPDATE` e `INSERT ... SELECT` [(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") é insegura, pois a ordem das linhas afetadas não é definida. (Tais declarações podem ser replicadas corretamente com replicação baseada em declarações apenas se elas também contiverem uma cláusula de `ORDER BY`. Quando tal declaração é encontrada:

* Ao usar o modo `STATEMENT`, um aviso é emitido de que a declaração não é segura para replicação baseada em declaração.

Quando se usa o modo `STATEMENT`, os avisos são emitidos para declarações DML que contêm `LIMIT`, mesmo quando elas também têm uma cláusula `ORDER BY` (e, portanto, são feitas determinísticas). Esse é um problema conhecido. (Bug #42851)

* Ao usar o modo `MIXED`, a declaração agora é automaticamente replicada usando o modo baseado em linha.

#### 19.5.1.19 Replicação e LOAD DATA

`LOAD DATA` é considerado inseguro para registro baseado em declarações (veja Seção 19.2.1.3, “Determinação de Declarações Seguras e Inseguras em Registro Binário”). Quando `binlog_format=MIXED` é definido, a declaração é registrada no formato baseado em linha. Quando `binlog_format=STATEMENT` é definido, observe que `LOAD DATA` não gera um aviso, ao contrário de outras declarações inseguras.

Se você usar `LOAD DATA` com `binlog_format=STATEMENT`, cada replica na qual as alterações devem ser aplicadas cria um arquivo temporário contendo os dados. A replica, em seguida, usa uma declaração `LOAD DATA` para aplicar as alterações. Este arquivo temporário não é criptografado, mesmo que a criptografia de log binário esteja ativa na fonte. Se a criptografia for necessária, use o formato de registro binário baseado em linha ou misto, para o qual as réplicas não criam o arquivo temporário.

Se uma conta `PRIVILEGE_CHECKS_USER` tiver sido usada para ajudar a garantir o canal de replicação (consulte a Seção 19.3.3, “Verificação de privilégios de replicação”), é altamente recomendável que você registre as operações `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement") usando o registro binário baseado em linha (`binlog_format=ROW`). Se `REQUIRE_ROW_FORMAT` estiver definido para o canal, o registro binário baseado em linha é necessário. Com este formato de registro, o privilégio `FILE` não é necessário para executar o evento, então não dê ao `PRIVILEGE_CHECKS_USER` conta este privilégio. Se você precisar recuperar de um erro de replicação envolvendo uma operação `LOAD DATA INFILE` registrada em formato de declaração, e o evento replicado é confiável, você pode conceder o privilégio `FILE` à conta `PRIVILEGE_CHECKS_USER` temporariamente, removendo-o após o evento replicado ter sido aplicado.

Quando o **mysqlbinlog** lê eventos de log para declarações `LOAD DATA` registradas em formato baseado em declaração, um arquivo local gerado é criado em um diretório temporário. Esses arquivos temporários não são removidos automaticamente pelo **mysqlbinlog** ou por qualquer outro programa do MySQL. Se você usar declarações `LOAD DATA` com registro binário baseado em declaração, você deve excluir os arquivos temporários você mesmo depois de não precisar mais do log da declaração. Para mais informações, consulte a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”.

#### 19.5.1.20 Replicação e max_allowed_packet

`max_allowed_packet` estabelece um limite superior para o tamanho de qualquer mensagem única entre o servidor MySQL e os clientes, incluindo réplicas. Se você estiver replicando valores de coluna grandes (como os encontrados nas colunas `TEXT` ou `BLOB`), e `max_allowed_packet` estiver muito pequeno na fonte, a fonte falha com um erro, e a réplica interrompe o fio de I/O (receptor) de replicação. Se `max_allowed_packet` estiver muito pequeno na réplica, isso também faz com que a réplica pare o fio de I/O.

A replicação baseada em linhas envia todas as colunas e os valores das colunas das linhas atualizadas da fonte para a replica, incluindo os valores das colunas que não foram realmente alterados pela atualização. Isso significa que, quando você está replicando grandes valores de coluna usando replicação baseada em linhas, você deve ter cuidado para definir `max_allowed_packet` grande o suficiente para acomodar a linha maior em qualquer tabela a ser replicada, mesmo que você esteja replicando atualizações apenas, ou esteja inserindo apenas valores relativamente pequenos.

Em uma replica multi-threaded (com `replica_parallel_workers > 0` ou (replication-options-replica.html#sysvar_slave_parallel_workers)`slave_parallel_workers > 0`), certifique-se de que a variável de sistema `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max` esteja definida com um valor igual ou maior que o da variável de sistema `max_allowed_packet` na fonte. O ajuste padrão para `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max`, 128M, é o dobro do ajuste padrão para `max_allowed_packet`, que é 64M. `max_allowed_packet` limita o tamanho do pacote que a fonte pode enviar, mas a adição de um cabeçalho de evento pode produzir um evento de log binário que excede esse tamanho. Além disso, na replicação baseada em linha, um único evento pode ser significativamente maior que o tamanho de `max_allowed_packet`, porque o valor de `max_allowed_packet` limita apenas cada coluna da tabela.

A réplica, na verdade, aceita pacotes até o limite definido por sua configuração `replica_max_allowed_packet` ou `slave_max_allowed_packet`, que por padrão configuram o máximo de 1 GB, para evitar uma falha de replicação devido a um pacote grande. No entanto, o valor de `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max` controla a memória que é disponibilizada na réplica para manter pacotes de entrada. A memória especificada é compartilhada entre todas as filas de trabalho da réplica.

O valor de `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max` é um limite flexível, e se um evento incomumente grande (constituído por um ou mais pacotes) exceder esse tamanho, a transação é mantida até que todas as réplicas tenham filas vazias, e então processada. Todas as transações subsequentes são mantidas até que a grande transação tenha sido concluída. Portanto, embora eventos incomuns maiores que `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max` possam ser processados, o atraso para limpar as filas de todas as réplicas e a espera para agendar transações subsequentes podem causar atraso na replica e diminuição da concorrência das réplicas. `replica_pending_jobs_size_max` ou `slave_pending_jobs_size_max` deve, portanto, ser definido com um valor suficientemente alto para acomodar a maioria dos tamanhos esperados dos eventos.

#### 19.5.1.21 Replicação e Tabelas de MEMÓRIA

Quando um servidor de fonte de replicação é desligado e reiniciado, suas tabelas `MEMORY` ficam vazias. Para replicar esse efeito nas réplicas, na primeira vez que a fonte usa uma tabela dada `MEMORY` após a inicialização, ela registra um evento que notifica as réplicas de que a tabela deve ser vazia, escrevendo uma declaração `DELETE` ou (a partir do MySQL 8.0.22) `TRUNCATE TABLE` para que a tabela seja escrita no log binário. Esse evento gerado é identificável por um comentário no log binário, e se GTIDs estão em uso no servidor, ele recebe um GTID atribuído. A declaração é sempre registrada no formato de declaração, mesmo que o formato de registro binário esteja configurado como `ROW`, e é escrita mesmo se o modo `read_only` ou `super_read_only` estiver configurado no servidor. Note que a réplica ainda tem dados desatualizados em uma tabela `MEMORY` durante o intervalo entre o reinício da fonte e seu primeiro uso da tabela. Para evitar esse intervalo quando uma consulta direta à réplica poderia retornar dados desatualizados, você pode configurar a variável de sistema `init_file` para nomear um arquivo que contenha declarações que preenchem a tabela `MEMORY` na fonte na inicialização.

Quando um servidor replicador é desligado e reiniciado, suas tabelas `MEMORY` ficam vazias. Isso faz com que a replica esteja fora de sincronia com a fonte e pode levar a outras falhas ou fazer com que a replica pare:

* As atualizações e exclusões em formato de linha recebidas da fonte podem falhar com `Can't find record in 'memory_table'`.

* Declarações como `INSERT INTO ... SELECT FROM memory_table`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement") podem inserir um conjunto diferente de linhas na fonte e na replica.

A replica também escreve uma declaração `DELETE` ou (a partir do MySQL 8.0.22) `TRUNCATE TABLE` (truncate-table.html "15.1.37 TRUNCATE TABLE Statement") em seu próprio log binário, que é passado para quaisquer réplicas subsequentes, fazendo com que elas limpem suas próprias tabelas `MEMORY`.

A maneira segura de reiniciar uma réplica que está replicando as tabelas `MEMORY` é primeiro descartar ou excluir todas as linhas das tabelas `MEMORY` na fonte e esperar até que essas alterações tenham sido replicadas para a réplica. Em seguida, é seguro reiniciar a réplica.

Um método alternativo de reinício pode ser aplicado em alguns casos. Quando `binlog_format=ROW`, você pode impedir que a replica pare se você definir `replica_exec_mode=IDEMPOTENT` (a partir do MySQL 8.0.26) ou `slave_exec_mode=IDEMPOTENT` (antes do MySQL 8.0.26) antes de reiniciar a replica. Isso permite que a replica continue a se replicar, mas suas tabelas `MEMORY` ainda diferem das da fonte. Isso é aceitável se a lógica da aplicação for tal que o conteúdo das tabelas `MEMORY` possa ser perdido com segurança (por exemplo, se as tabelas `MEMORY` forem usadas para cache). `replica_exec_mode=IDEMPOTENT` ou `slave_exec_mode=IDEMPOTENT` aplica-se globalmente a todas as tabelas, portanto, pode ocultar outros erros de replicação em tabelas que não são `MEMORY`.

(O método descrito acima não é aplicável no NDB Cluster, onde `replica_exec_mode` ou `slave_exec_mode` sempre é `IDEMPOTENT`, e não pode ser alterado.)

O tamanho das tabelas de `MEMORY` é limitado pelo valor da variável de sistema `max_heap_table_size`, que não é replicada (ver Seção 19.5.1.39, “Replicação e Variáveis”). Uma mudança em `max_heap_table_size` tem efeito para as tabelas de `MEMORY` que são criadas ou atualizadas usando [`ALTER TABLE ... ENGINE = MEMORY`](alter-table.html "15.1.9 ALTER TABLE Statement") ou [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement") após a mudança, ou para todas as tabelas de `MEMORY` após uma reinicialização do servidor. Se você aumentar o valor dessa variável na fonte sem fazer isso na replica, torna-se possível que uma tabela na fonte cresça mais do que sua contraparte na replica, levando a inserções que têm sucesso na fonte, mas falham na replica com erros de “Tabela cheia”. Esse é um problema conhecido (Bug #48666). Nesses casos, você deve definir o valor global de `max_heap_table_size` na replica, bem como na fonte, e então reiniciar a replicação. Também é recomendável que você reinicie os servidores MySQL da fonte e da replica, para garantir que o novo valor tenha efeito completo (global) em cada um deles.

Consulte a Seção 18.3, “O Motor de Armazenamento de MEMÓRIA”, para obter mais informações sobre as tabelas `MEMORY`.

#### 19.5.1.22 Replicação do esquema do sistema mysql

As declarações de modificação de dados feitas em tabelas no esquema `mysql` são replicadas de acordo com o valor de `binlog_format`; se esse valor for `MIXED`, essas declarações são replicadas usando o formato baseado em linha. No entanto, declarações que normalmente atualizariam essas informações indiretamente — como `GRANT`, `REVOKE` e declarações que manipulam gatilhos, rotinas armazenadas e visualizações — são replicadas para réplicas usando replicação baseada em declaração.

#### 19.5.1.23 Replicação e o Otimizador de Consulta

É possível que os dados da fonte e da replica se tornem diferentes se uma declaração for escrita de tal forma que a modificação dos dados seja não determinística; ou seja, deixada ao otimizador de consulta. (Em geral, essa não é uma boa prática, mesmo fora da replicação.) Exemplos de declarações não determinísticas incluem as declarações `DELETE` ou `UPDATE` que usam `LIMIT` sem a cláusula `ORDER BY`; veja a Seção 19.5.1.18, “Replicação e LIMIT”, para uma discussão detalhada sobre essas.

#### 19.5.1.24 Replicação e Partição

A replicação é suportada entre tabelas particionadas, desde que utilizem o mesmo esquema de particionamento e, de outra forma, tenham a mesma estrutura, exceto quando uma exceção é especificamente permitida (consulte Seção 19.5.1.9, “Replicação com Definições de Tabela Diferentes na Fonte e na Replicação”).

A replicação entre tabelas que possuem particionamento diferente geralmente não é suportada. Isso porque declarações (como `ALTER TABLE ... DROP PARTITION`(alter-table-partition-operations.html "15.1.9.1 ALTER TABLE Partition Operations")) que atuam diretamente em particionamentos nesses casos podem produzir resultados diferentes na fonte e na replica. No caso em que uma tabela é particionada na fonte, mas não na replica, quaisquer declarações que operem em particionamentos na cópia da fonte da replica falham na replica. Quando a cópia da tabela da replica é particionada, mas a cópia da fonte não, declarações que atuam diretamente em particionamentos não podem ser executadas na fonte sem causar erros nela. Para evitar a interrupção da replicação ou a criação de inconsistências entre a fonte e a replica, sempre certifique-se de que uma tabela na fonte e a tabela replicada correspondente na replica sejam particionadas da mesma maneira.

#### 19.5.1.25 Replicação e REPARO DE TÁBUA

Quando usado em uma tabela corrompida ou danificada, é possível que a declaração `REPAIR TABLE` elimine linhas que não podem ser recuperadas. No entanto, quaisquer modificações realizadas por esta declaração no dados da tabela não são replicadas, o que pode causar a perda de sincronização entre a fonte e a réplica. Por esse motivo, no caso de uma tabela na fonte ser danificada e você usar `REPAIR TABLE` para repará-la, você deve primeiro parar a replicação (se ainda estiver em execução) antes de usar `REPAIR TABLE`, e, em seguida, comparar as cópias da fonte e da réplica da tabela e estar preparado para corrigir quaisquer discrepâncias manualmente, antes de reiniciar a replicação.

#### 19.5.1.26 Replicação e Palavras Reservadas

Você pode encontrar problemas ao tentar replicar de uma fonte mais antiga para uma réplica mais recente e ao usar identificadores da fonte que são palavras reservadas na versão mais recente do MySQL que está sendo executada na réplica. Por exemplo, uma coluna de tabela com o nome `rank` em uma fonte MySQL 5.7 que está replicando para uma réplica MySQL 8.0 pode causar um problema porque `RANK` é uma palavra reservada que começa no MySQL 8.0.

A replicação pode falhar nesses casos com o Erro 1064 Você tem um erro na sintaxe do SQL..., *mesmo que um banco de dados ou uma tabela nomeada usando a palavra reservada ou uma tabela com uma coluna nomeada usando a palavra reservada seja excluída da replicação*. Isso ocorre porque cada evento SQL deve ser analisado pela replica antes da execução, para que a replica saiba quais objetos do banco de dados serão afetados. Somente após o evento ser analisado, a replica pode aplicar quaisquer regras de filtragem definidas por `--replicate-do-db`, `--replicate-do-table`, `--replicate-ignore-db` e `--replicate-ignore-table`.

Para contornar o problema de nomes de banco de dados, tabela ou coluna na fonte que seriam considerados palavras reservadas pela replica, faça um dos seguintes:

* Use uma ou mais declarações `ALTER TABLE` na fonte para alterar os nomes de quaisquer objetos do banco de dados onde esses nomes seriam considerados palavras reservadas na replica, e altere quaisquer declarações SQL que utilizem os nomes antigos para utilizar os novos nomes.

* Em quaisquer declarações SQL que utilizem esses nomes de objetos do banco de dados, escreva os nomes como identificadores citados usando caracteres de barra tildada (`` ` ``).

Para listas de palavras reservadas por versão do MySQL, consulte Palavras-chave e Palavras Reservadas no MySQL 8.0, no *Referência de Versão do Servidor MySQL*. Para regras de citação de identificadores, consulte Seção 11.2, “Nomes de Objetos do Esquema”.

#### 19.5.1.27 Replicação e Pesquisas de Linha

Quando uma réplica que utiliza o formato de replicação baseada em linha aplica uma operação `UPDATE` ou `DELETE`, ela deve procurar as linhas correspondentes na tabela relevante. O algoritmo usado para realizar esse processo utiliza um dos índices da tabela para realizar a pesquisa como a primeira escolha e uma tabela hash se não houver índices adequados.

O algoritmo primeiro avalia os índices disponíveis na definição da tabela para verificar se há algum índice adequado para usar, e se houver várias possibilidades, qual índice é o mais adequado para a operação. O algoritmo ignora os seguintes tipos de índice:

* Índices de texto completo. * Índices ocultos. * Índices gerados. * Índices de múltiplos valores. * Qualquer índice onde a imagem anterior do evento da linha não contém todas as colunas do índice.

Se não houver índices adequados após descartar esses tipos de índice, o algoritmo não utiliza um índice para a pesquisa. Se houver índices adequados, um índice é selecionado entre os candidatos, na seguinte ordem de prioridade:

1. Uma chave primária.  
2. Um índice único onde cada coluna do índice tem um atributo NOT NULL. Se houver mais de um índice disponível, o algoritmo escolhe o mais à esquerda desses índices.

3. Qualquer outro índice. Se houver mais de um índice disponível, o algoritmo escolhe o mais à esquerda desses índices.

Se o algoritmo conseguir selecionar uma chave primária ou um índice único onde cada coluna do índice possui o atributo `NOT NULL`, ele usa esse índice para iterar sobre as linhas na operação `UPDATE` ou `DELETE`. Para cada linha no evento de linha, o algoritmo procura a linha no índice para localizar o registro da tabela a ser atualizado. Se nenhum registro correspondente for encontrado, ele retorna o erro ER_KEY_NOT_FOUND e para o thread do aplicável de replicação.

Se o algoritmo não conseguiu encontrar um índice adequado ou conseguiu encontrar um índice que não era único ou continha nulos, uma tabela hash é usada para auxiliar na identificação dos registros da tabela. O algoritmo cria uma tabela hash contendo as linhas da operação `UPDATE` ou `DELETE`, com a chave como a imagem completa do registro. O algoritmo então itera sobre todos os registros na tabela alvo, usando o índice selecionado se encontrou um, ou, caso contrário, realiza uma varredura completa da tabela. Para cada registro na tabela alvo, ele determina se essa linha existe na tabela hash. Se a linha é encontrada na tabela hash, o registro na tabela alvo é atualizado e a linha é excluída da tabela hash. Quando todos os registros na tabela alvo foram verificados, o algoritmo verifica se a tabela hash agora está vazia. Se houver alguma linha não correspondente restante na tabela hash, o algoritmo retorna o erro ER_KEY_NOT_FOUND e para o thread do aplicável de replicação.

A variável de sistema `slave_rows_search_algorithms` era anteriormente usada para controlar como as linhas são pesquisadas em busca de correspondências. O uso dessa variável de sistema já é desaconselhado, porque o ajuste padrão, que usa uma varredura de índice seguida por uma varredura de hash, conforme descrito acima, é ótimo para o desempenho e funciona corretamente em todos os cenários.

#### 19.5.1.28 Replicação e interrupções de fonte ou réplica

É seguro desligar um servidor de fonte de replicação e reiniciá-lo mais tarde. Quando uma réplica perde sua conexão com a fonte, a réplica tenta reconectar imediatamente e tenta novamente periodicamente se isso falhar. O padrão é tentar novamente a cada 60 segundos. Isso pode ser alterado com a declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (de MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes de MySQL 8.0.23). Uma réplica também é capaz de lidar com interrupções de conectividade de rede. No entanto, a réplica só percebe a interrupção da rede após não receber dados da fonte por `replica_net_timeout` ou `slave_net_timeout` segundos. Se suas interrupções forem curtas, você pode querer diminuir o valor de `replica_net_timeout` ou `slave_net_timeout`. Veja a Seção 19.4.2, “Tratamento de um Parada Inesperada de uma Réplica”.

Um desligamento não limpo (por exemplo, um crash) no lado da fonte pode resultar no registro binário da fonte ter uma posição final menor que a posição mais recente lida pela réplica, devido ao arquivo de registro binário da fonte não ter sido esvaziado. Isso pode fazer com que a réplica não consiga replicar quando a fonte voltar a funcionar. Definir `sync_binlog=1` no arquivo `my.cnf` do servidor fonte ajuda a minimizar esse problema, pois faz com que a fonte esvazie seu registro binário com mais frequência. Para a maior durabilidade e consistência possível em uma configuração de replicação usando `InnoDB` com transações, você também deve definir `innodb_flush_log_at_trx_commit=1`. Com essa configuração, o conteúdo do buffer de registro redo `InnoDB` é escrito no arquivo de registro em cada commit de transação e o arquivo de registro é esvaziado para o disco. Note que a durabilidade das transações ainda não é garantida com essa configuração, porque sistemas operacionais ou hardware do disco podem informar ao **mysqld** que a operação de esvaziamento para disco ocorreu, mesmo que não tenha.

Fechar uma réplica de forma limpa é seguro, pois ela mantém o registro de onde parou. No entanto, tenha cuidado para que a réplica não tenha tabelas temporárias abertas; veja Seção 19.5.1.31, “Replicação e Tabelas Temporárias”. Fechas não limpas podem produzir problemas, especialmente se o cache do disco não foi descarregado no disco antes do problema ocorrer:

* Para as transações, a replica realiza os commits e, em seguida, atualiza `relay-log.info`. Se uma saída inesperada ocorrer entre essas duas operações, o processamento do log de relevo prossegue além do que o arquivo de informações indica e a replica reexecuta os eventos da última transação no log de relevo após ter sido reiniciado.

* Um problema semelhante pode ocorrer se a replica atualizar `relay-log.info`, mas o host do servidor falhar antes de a escrita ter sido enviada ao disco. Para minimizar a chance de isso ocorrer, defina `sync_relay_log_info=1` no arquivo de replica `my.cnf`. Definir `sync_relay_log_info` para 0 não faz com que as escritas sejam forçadas ao disco e o servidor depende do sistema operacional para limpar o arquivo de tempos em tempos.

A tolerância à falha do seu sistema para esses tipos de problemas é muito maior se você tiver uma boa fonte de alimentação ininterrupta.

#### 19.5.1.29 Erros de replicação durante a replicação

Se uma declaração produzir o mesmo erro (código de erro idêntico) tanto na fonte quanto na réplica, o erro é registrado, mas a replicação continua.

Se uma declaração produzir diferentes erros na fonte e na réplica, o fio de replicação SQL é encerrado e a réplica escreve uma mensagem em seu log de erro e espera que o administrador do banco de dados decida o que fazer com o erro. Isso inclui o caso em que uma declaração produz um erro na fonte ou na réplica, mas não em ambas. Para resolver o problema, conecte-se manualmente à réplica e determine a causa do problema. `SHOW REPLICA STATUS` (ou antes do MySQL 8.0.22, `SHOW SLAVE STATUS`)(show-slave-status.html "15.7.7.36 SHOW SLAVE | REPLICA STATUS Statement") é útil para isso. Em seguida, corrija o problema e execute `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`). Por exemplo, você pode precisar criar uma tabela inexistente antes de poder iniciar a réplica novamente.

Nota

Se um erro temporário for registrado no log de erros da replica, você não precisa necessariamente tomar nenhuma ação sugerida na mensagem de erro citada. Os erros temporários devem ser tratados pelo cliente que tenta novamente a transação. Por exemplo, se o thread de SQL de replicação registra um erro temporário relacionado a um bloqueio, você não precisa reiniciar a transação manualmente na replica, a menos que o thread de SQL de replicação termine posteriormente com uma mensagem de erro não temporária.

Se esse comportamento de validação de código de erro não for desejado, alguns ou todos os erros podem ser ocultados (ignorados) com a opção `--slave-skip-errors`.

Para motores de armazenamento não transacionais, como `MyISAM`, é possível ter uma declaração que atualiza apenas parcialmente uma tabela e retorna um código de erro. Isso pode acontecer, por exemplo, em uma inserção de várias linhas que tem uma linha que viola uma restrição de chave, ou se uma declaração de atualização longa é interrompida após a atualização de algumas das linhas. Se isso acontecer na fonte, a replica espera que a execução da declaração resulte no mesmo código de erro. Se não, o thread de SQL da replicação para de execução como descrito anteriormente.

Se você estiver replicando entre tabelas que usam diferentes motores de armazenamento na fonte e na replica, tenha em mente que a mesma declaração pode produzir um erro diferente quando executada contra uma versão da tabela, mas não a outra, ou pode causar um erro para uma versão da tabela, mas não a outra. Por exemplo, como o `MyISAM` ignora as restrições de chave estrangeira, uma declaração `INSERT` ou `UPDATE` acessando uma tabela `InnoDB` na fonte pode causar uma violação de chave estrangeira, mas a mesma declaração realizada em uma versão `MyISAM` da mesma tabela na replica não produziria tal erro, fazendo com que a replicação pare.

Começando com o MySQL 8.0.31, as regras do filtro de replicação são aplicadas primeiro, antes de realizar quaisquer verificações de privilégio ou formato de linha, o que permite filtrar quaisquer transações que falhem na validação; não são realizadas verificações e, portanto, não são gerados erros para transações que foram filtradas. Isso significa que a replicação pode aceitar apenas a parte do banco de dados para a qual um determinado usuário tenha sido concedido acesso (desde que quaisquer atualizações nesta parte do banco de dados utilizem o formato de replicação baseado em linha). Isso pode ser útil ao realizar uma atualização ou ao migrar para um sistema ou aplicativo que utiliza tabelas de administração para as quais o usuário de replicação de entrada não tem acesso. Veja também a Seção 19.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.

#### 19.5.1.30 Replicação e modo SQL do servidor

Usar diferentes configurações de modo SQL do servidor na fonte e na replica pode fazer com que as mesmas declarações `INSERT` sejam tratadas de maneira diferente na fonte e na replica, levando à divergência entre a fonte e a replica. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor na fonte e na replica. Esse conselho se aplica, independentemente de você estar usando replicação baseada em declarações ou baseada em linhas.

Se você estiver replicando tabelas particionadas, usar diferentes modos SQL na fonte e na replica provavelmente causará problemas. No mínimo, isso provavelmente fará com que a distribuição dos dados entre as partições nas cópias da fonte e da replica de uma determinada tabela seja diferente. Isso também pode causar inserções em tabelas particionadas que têm sucesso na fonte, mas falham na replica.

Para mais informações, consulte a Seção 7.1.11, “Modos SQL do servidor”.

#### 19.5.1.31 Replicação e tabelas temporárias

Em MySQL 8.0, quando `binlog_format` é definido como `ROW` ou `MIXED`, as declarações que utilizam exclusivamente tabelas temporárias não são registradas na fonte, e, portanto, as tabelas temporárias não são replicadas. As declarações que envolvem uma mistura de tabelas temporárias e não temporárias são registradas na fonte apenas para as operações nas tabelas não temporárias, e as operações nas tabelas temporárias não são registradas. Isso significa que nunca existem tabelas temporárias na replica que possam ser perdidas no caso de um desligamento não planejado pela replica. Para mais informações sobre o registro baseado em linhas e tabelas temporárias, consulte Registro baseado em linhas de tabelas temporárias.

Quando `binlog_format` está definido como `STATEMENT`, as operações em tabelas temporárias são registradas na fonte e replicadas na réplica, desde que as declarações que envolvem tabelas temporárias possam ser registradas com segurança usando o formato baseado em declarações. Nessa situação, a perda de tabelas temporárias replicadas na réplica pode ser um problema. No modo de replicação baseado em declarações, as declarações `CREATE TEMPORARY TABLE`(create-table.html "15.1.20 CREATE TABLE Statement") e `DROP TEMPORARY TABLE`(drop-table.html "15.1.32 DROP TABLE Statement") não podem ser usadas dentro de uma transação, procedimento, função ou gatilho quando GTIDs estão em uso no servidor (ou seja, quando a variável de sistema `enforce_gtid_consistency` está definida como `ON`). Elas podem ser usadas fora desses contextos quando GTIDs estão em uso, desde que `autocommit=1` esteja definido.

Devido às diferenças de comportamento entre o modo de replicação baseado em linha ou misto e o modo de replicação baseado em declarações em relação às tabelas temporárias, você não pode alternar o formato de replicação em tempo de execução, se a alteração se aplicar a um contexto (global ou de sessão) que contenha quaisquer tabelas temporárias abertas. Para mais detalhes, consulte a descrição da opção `binlog_format`.

**Desativação segura da replica quando se usa tabelas temporárias.** No modo de replicação baseado em declarações, as tabelas temporárias são replicadas, exceto no caso em que você interrompe o servidor de replicação (não apenas os threads de replicação) e você já replicou tabelas temporárias que estão abertas para uso em atualizações que ainda não foram executadas na replica. Se você interromper o servidor de replicação, as tabelas temporárias necessárias para essas atualizações não estarão mais disponíveis quando a replica for reiniciada. Para evitar esse problema, não desative a replica enquanto ela tiver tabelas temporárias abertas. Em vez disso, use o procedimento a seguir:

1. Emita uma declaração `STOP REPLICA SQL_THREAD`.

2. Use `SHOW STATUS` para verificar o valor da variável de status `Replica_open_temp_tables` ou `Slave_open_temp_tables`.

3. Se o valor não for 0, reinicie o fio de replicação SQL com `START REPLICA SQL_THREAD` e repita o procedimento mais tarde.

4. Quando o valor for 0, execute o comando [**mysqladmin shutdown**][(mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")] para parar a replica.

**Tabelas temporárias e opções de replicação. Por padrão, com replicação baseada em declarações, todas as tabelas temporárias são replicadas; isso acontece independentemente de haver ou não opções correspondentes `--replicate-do-db`, `--replicate-do-table` ou `--replicate-wild-do-table` em vigor. No entanto, as opções `--replicate-ignore-table` e `--replicate-wild-ignore-table` são respeitadas para tabelas temporárias. A exceção é que, para permitir a remoção correta de tabelas temporárias no final de uma sessão, uma replica sempre replica uma declaração `DROP TEMPORARY TABLE IF EXISTS`, independentemente de quaisquer regras de exclusão que normalmente seriam aplicadas para a tabela especificada.

Uma prática recomendada ao usar replicação baseada em declarações é designar um prefixo para uso exclusivo no nome de tabelas temporárias que você não deseja replicar, e, em seguida, empregar uma opção `--replicate-wild-ignore-table` para corresponder a esse prefixo. Por exemplo, você pode dar nomes a todas essas tabelas começando com `norep` (como `norepmytable`, `norepyourtable`, e assim por diante), e, em seguida, usar `--replicate-wild-ignore-table=norep%` para evitar que elas sejam replicadas.

#### 19.5.1.32 Retrias e Limites de Tempo de Replicação

O valor global da variável de sistema `replica_transaction_retries` (do MySQL 8.0.26) ou `slave_transaction_retries` (antes do MySQL 8.0.26) define o número máximo de vezes que os threads do aplicável em uma replica de thread único ou multithread podem tentar novamente as transações falhas antes de parar. As transações são automaticamente reatadas quando o thread SQL não as executa devido a um `InnoDB` travamento de deadlock, ou quando o tempo de execução da transação excede o valor de `InnoDB` `innodb_lock_wait_timeout`. Se uma transação tiver um erro não temporário que a impeça de ser bem-sucedida, ela não será reatada.

A configuração padrão para `replica_transaction_retries` ou `slave_transaction_retries` é 10, o que significa que uma transação falhando com um erro aparentemente temporário é repetida 10 vezes antes que o fio aplicador pare. Definir a variável para 0 desativa o reprocessamento automático das transações. Em uma replica multithread, o número especificado de repetições de transação pode ocorrer em todos os fios aplicadores de todos os canais. A tabela do Schema de Desempenho `replication_applier_status` mostra o número total de repetições de transação que ocorreram em cada canal de replicação, na coluna `COUNT_TRANSACTIONS_RETRIES`.

O processo de refazer transações pode causar atraso em uma replica ou em um membro do grupo de replicação em grupo, que pode ser configurado como uma replica monofila ou multifila. A tabela do Schema de desempenho `replication_applier_status_by_worker` mostra informações detalhadas sobre os refazes de transações pelos threads do aplicador em uma replica monofila ou multifila. Esses dados incluem timestamps que mostram quanto tempo levou o thread do aplicador para aplicar a última transação do início ao fim (e quando a transação atualmente em andamento foi iniciada) e quanto tempo isso ocorreu após o commit na fonte original e na fonte imediata. Os dados também mostram o número de refazes para a última transação e a transação atualmente em andamento, e permite que você identifique os erros transitórios que causaram os refazes de transações. Você pode usar essas informações para ver se os refazes de transações são a causa do atraso na replicação e investigar a causa raiz das falhas que levaram aos refazes.

#### 19.5.1.33 Replicação e Fuso Horário

Por padrão, os servidores fonte e replica assumem que estão no mesmo fuso horário. Se você estiver replicando entre servidores em diferentes fusos horários, o fuso horário deve ser definido tanto no servidor fonte quanto no replica. Caso contrário, as declarações que dependem da hora local no servidor fonte não serão replicadas corretamente, como as declarações que utilizam as funções `NOW()` ou `FROM_UNIXTIME()`.

Verifique se a combinação de configurações do fuso horário do sistema (`system_time_zone`), do fuso horário do servidor atual (o valor global de `time_zone`) e dos fusos horários por sessão (o valor da sessão de `time_zone`) no sistema de origem e réplica está produzindo os resultados corretos. Em particular, se a variável de sistema `time_zone` estiver definida para o valor `SYSTEM`, indicando que o fuso horário do servidor é o mesmo que o fuso horário do sistema, isso pode fazer com que a origem e a réplica apliquem diferentes fusos horários. Por exemplo, uma origem pode escrever a seguinte declaração no log binário:

```
SET @@session.time_zone='SYSTEM';
```

Se essa fonte e sua réplica tiverem um horário de sistema com configurações diferentes, essa declaração pode produzir resultados inesperados na réplica, mesmo que o valor global `time_zone` da réplica tenha sido configurado para corresponder ao da fonte. Para uma explicação sobre as configurações de fuso horário do MySQL Server e como configurá-las, consulte a Seção 7.1.15, “Suporte de fuso horário do MySQL Server”.

Veja também a Seção 19.5.1.14, “Replicação e Funções do Sistema”.

#### 19.5.1.34 Inconsistências na Replicação e Transações

Inconsistências na sequência das transações que foram executadas a partir do log de relevo podem ocorrer, dependendo da configuração de replicação. Esta seção explica como evitar inconsistências e resolver quaisquer problemas que elas causam.

Os seguintes tipos de inconsistências podem existir:

*Transações parcialmente aplicadas*. Uma transação que atualiza tabelas não transacionais aplicou algumas, mas não todas, de suas alterações.

* Lacunas. Uma lacuna no conjunto de transações externalizadas aparece quando, dada uma sequência ordenada de transações, uma transação que está mais tarde na sequência é aplicada antes de outra transação que está anterior na sequência. As lacunas só podem aparecer ao usar uma replica multithread.

Para evitar que lacunas ocorram em uma replica multithread, configure `replica_preserve_commit_order=ON` (do MySQL 8.0.26) ou `slave_preserve_commit_order=ON` (antes do MySQL 8.0.26). A partir do MySQL 8.0.27, essa configuração é a padrão, porque todas as réplicas são multithreadadas por padrão a partir desse lançamento.

Até e incluindo o MySQL 8.0.18, para preservar a ordem de commit, é necessário que o registro binário (`log_bin`) e o registro de atualização de replica (`log_replica_updates` ou `log_slave_updates`) também estejam habilitados, que são as configurações padrão do MySQL 8.0. A partir do MySQL 8.0.19, o registro binário e o registro de atualização de replica não são necessários na replica para definir `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON`, e podem ser desativados, se desejado.

Em todas as versões, definir `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` exige que `replica_parallel_type` (do MySQL 8.0.26) ou `slave_parallel_type` (antes do MySQL 8.0.26) seja definido como `LOGICAL_CLOCK`. A partir do MySQL 8.0.27 (mas não para versões anteriores), este é o ajuste padrão.

Em algumas situações específicas, conforme listado na descrição para `replica_preserve_commit_order` e `slave_preserve_commit_order`, definir `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` não preserva a ordem de commit no replica, portanto, nesses casos, lacunas ainda podem aparecer na sequência de transações que foram executadas a partir do log de relevo da replica.

A definição de `replica_preserve_commit_order=ON` ou `slave_preserve_commit_order=ON` não impede o atraso na posição do log binário da fonte.

*Lag de posição do log binário de origem*. Mesmo na ausência de lacunas, é possível que transações após `Exec_master_log_pos` tenham sido aplicadas. Ou seja, todas as transações até o ponto `N` foram aplicadas, e nenhuma transação após `N` foi aplicada, mas `Exec_master_log_pos` tem um valor menor que `N`. Nessa situação, `Exec_master_log_pos` é uma "marca de baixa água" das transações aplicadas e fica atrás da posição da transação mais recentemente aplicada. Isso só pode acontecer em réplicas multithread. Habilitar `replica_preserve_commit_order` ou `slave_preserve_commit_order` não impede o lag de posição do log binário de origem.

Os seguintes cenários são relevantes para a existência de transações parcialmente aplicadas, lacunas e atraso na posição do log binário de origem:

1. Enquanto os threads de replicação estão em execução, podem haver lacunas e transações meio aplicadas.

2. O **mysqld** é desligado. Tanto os desligamentos limpos quanto os não limpos abortam as transações em andamento e podem deixar lacunas e transações meio aplicadas.

3. `KILL` de threads de replicação (o thread SQL ao usar uma replicação de único fio, o thread do coordenador ao usar uma replicação multifilamentar). Isso interrompe as transações em andamento e pode deixar lacunas e transações meio aplicadas.

4. Erro nos threads do aplicador. Isso pode deixar lacunas. Se o erro estiver em uma transação mista, essa transação é parcialmente aplicada. Ao usar uma replica multithread, os trabalhadores que não receberam um erro completam suas filas, então pode levar algum tempo para parar todos os threads.

5. `STOP REPLICA` ao usar uma replica multithread. Após emitir `STOP REPLICA`, a replica aguarda que quaisquer lacunas sejam preenchidas e, em seguida, atualiza `Exec_master_log_pos`. Isso garante que ela nunca deixe lacunas ou atraso na posição do log binário de origem, a menos que algum dos casos acima se aplique, ou seja, antes de `STOP REPLICA` completar, ocorra um erro ou outro thread emita `KILL`, ou o servidor seja reiniciado. Nesses casos, `STOP REPLICA` retorna com sucesso.

6. Se a última transação no log do relé for apenas parcialmente recebida e o fio de coordenação da replica multithread tenha começado a agendar a transação para um trabalhador, então `STOP REPLICA` aguarda até 60 segundos para que a transação seja recebida. Após este tempo limite, o coordenador desiste e aborrece a transação. Se a transação for mista, ela pode ser deixada meio concluída.

7. `STOP REPLICA` quando a transação em andamento atualiza apenas as tabelas transacionais, nesse caso, ela é revertida e [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") para de imediatamente. Se a transação em andamento for mista, [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") aguarda até 60 segundos para que a transação seja concluída. Após esse tempo limite, ela aborta a transação, então ela pode ser deixada incompleta.

O ambiente global da variável do sistema `rpl_stop_replica_timeout` (do MySQL 8.0.26) ou `rpl_stop_slave_timeout` (antes do MySQL 8.0.26) não está relacionado ao processo de parada dos threads de replicação. Isso apenas faz com que o cliente que emite `STOP REPLICA` retorne ao cliente, mas os threads de replicação continuam a tentar parar.

Se um canal de replicação tiver lacunas, isso tem as seguintes consequências:

1. O banco de dados replicado está em um estado que nunca poderia ter existido na fonte.

2. O campo `Exec_master_log_pos` em `SHOW REPLICA STATUS` é apenas um "limite mínimo". Em outras palavras, as transações que aparecem antes da posição são garantidas como tendo sido realizadas, mas as transações que aparecem depois da posição podem ter sido realizadas ou

As declarações `CHANGE REPLICATION SOURCE TO` e `CHANGE MASTER TO` para esse canal falham com um erro, a menos que os fios do aplicador estejam em execução e a declaração apenas defina opções de receptor.

4. Se o **mysqld** for iniciado com `--relay-log-recovery`, não será realizada nenhuma recuperação para esse canal e será exibido um aviso.

5. Se o **mysqldump** for usado com `--dump-replica` ou `--dump-slave`, ele não registra a existência de lacunas; assim, ele imprime `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` com `RELAY_LOG_POS` definido na posição de “marca de baixa água” em `Exec_master_log_pos`.

Após aplicar o dump em outro servidor e iniciar os threads de replicação, as transações que aparecem após a posição são replicadas novamente. Note que isso é inofensivo se os GTIDs estiverem habilitados (no entanto, nesse caso, não é recomendado usar `--dump-replica` ou `--dump-slave`).

Se um canal de replicação tiver atraso na posição do log binário de origem, mas sem lacunas, os casos 2 a 5 acima se aplicam, mas o caso 1

As informações de posição do log binário de origem são persistidas em formato binário na tabela interna `mysql.slave_worker_info`. `START REPLICA [SQL_THREAD]`(start-replica.html "15.4.2.6 START REPLICA Statement") sempre consulta essas informações para que elas apliquem apenas as transações corretas. Isso permanece verdadeiro mesmo se `replica_parallel_workers` ou `slave_parallel_workers` tiver sido alterado para 0 antes de `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement"), e mesmo se `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") seja usado com cláusulas de `UNTIL`. `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`(start-replica.html "15.4.2.6 START REPLICA Statement") aplica apenas tantas transações quanto necessário para preencher as lacunas. Se `START REPLICA` for usado com cláusulas de `UNTIL` que lhe dizem parar antes de consumir todas as lacunas, então ele deixa as lacunas restantes.

Aviso

`RESET REPLICA` remove os registros do relé e redefre o posicionamento da replicação. Portanto, emitir `RESET REPLICA` em uma replica multithread com lacunas significa que a replica perde qualquer informação sobre as lacunas, sem corrigir as lacunas. Nessa situação, se a replicação com base na posição do log binário estiver em uso, o processo de recuperação falha.

Quando a replicação baseada em GTID está em uso (`GTID_MODE=ON`) e `SOURCE_AUTO_POSITION` está configurado para o canal de replicação usando a declaração [`CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")], os logs antigos do relé não são necessários para o processo de recuperação. Em vez disso, a replica pode usar a autoposição do GTID para calcular quais transações estão faltando em comparação com a fonte. A partir do MySQL 8.0.26, o processo usado para replicação com base na posição do log binário para resolver lacunas em uma replica multithread é ignorado completamente quando a replicação baseada em GTID está em uso. Quando o processo é ignorado, uma declaração [`START REPLICA UNTIL SQL_AFTER_MTS_GAPS`(start-replica.html "15.4.2.6 START REPLICA Statement") se comporta de maneira diferente e não tenta verificar lacunas na sequência de transações. Você também pode emitir declarações `CHANGE REPLICATION SOURCE TO`, que não são permitidas em uma replica não GTID onde há lacunas.

#### 19.5.1.35 Replicação e Transações

**Misturar declarações transacionais e não transacionais dentro da mesma transação.** Em geral, você deve evitar transações que atualizem tanto tabelas transacionais quanto não transacionais em um ambiente de replicação. Além disso, você deve evitar usar qualquer declaração que acesse tanto tabelas transacionais (ou temporárias) quanto não transacionais e escreva em qualquer uma delas.

O servidor utiliza essas regras para o registro binário:

* Se as declarações iniciais em uma transação não forem transacionais, elas são escritas no log binário imediatamente. As declarações restantes na transação são armazenadas em cache e não são escritas no log binário até que a transação seja comprometida. (Se a transação for revertida, as declarações armazenadas em cache são escritas no log binário apenas se elas fizerem alterações não transacionais que não possam ser revertidas. Caso contrário, elas são descartadas.)

* Para o registro baseado em declarações, o registro de declarações não transacionais é afetado pela variável de sistema `binlog_direct_non_transactional_updates`. Quando essa variável é `OFF` (a padrão), o registro ocorre conforme descrito acima. Quando essa variável é `ON`, o registro ocorre imediatamente para declarações não transacionais que ocorrem em qualquer lugar da transação (não apenas declarações não transacionais iniciais). Outras declarações são mantidas no cache da transação e registradas quando a transação é confirmada. `binlog_direct_non_transactional_updates` não tem efeito para o registro binário de formato de linha ou misto.

**Declarações transacionais, não transacionais e mistas.** Para aplicar essas regras, o servidor considera uma declaração não transacional se ela alterar apenas tabelas não transacionais, e transacional se ela alterar apenas tabelas transacionais. Uma declaração que faz referência tanto a tabelas não transacionais quanto a tabelas transacionais e atualiza *qualquer* das tabelas envolvidas é considerada uma declaração "mista". As declarações mistas, como as declarações transacionais, são armazenadas em cache e registradas quando a transação é confirmada.

Uma declaração mista que atualiza uma tabela transacional é considerada insegura se a declaração também realizar uma das seguintes ações:

* Atualiza ou lê uma tabela temporária. * Lê uma tabela não transacional e o nível de isolamento de transação é menor que REPEATABLE_READ.

Uma declaração mista após a atualização de uma tabela transacional dentro de uma transação é considerada insegura se ela realizar qualquer uma das seguintes ações:

* Atualiza qualquer tabela e lê de qualquer tabela temporária
* Atualiza uma tabela não transacional e `binlog_direct_non_transactional_updates` está DESATIVADA

Para mais informações, consulte a Seção 19.2.1.3, “Determinação de declarações seguras e inseguras em registro binário”.

Nota

Uma declaração mista não está relacionada ao formato de registro binário misto.

Em situações em que as transações misturam atualizações em tabelas transacionais e não transacionais, a ordem das declarações no log binário está correta e todas as declarações necessárias são escritas no log binário, mesmo em caso de uma `ROLLBACK`. No entanto, quando uma segunda conexão atualiza a tabela não transakcional antes da transação da primeira conexão ser concluída, as declarações podem ser registradas fora da ordem, porque a atualização da segunda conexão é escrita imediatamente após ser realizada, independentemente do estado da transação realizada pela primeira conexão.

**Usando diferentes motores de armazenamento na fonte e na replica.** É possível replicar tabelas transacionais na fonte usando tabelas não transacionais na replica. Por exemplo, você pode replicar uma tabela de fonte `InnoDB` como uma tabela de replica `MyISAM`. No entanto, se você fizer isso, haverá problemas se a replica for parada no meio de um bloco `BEGIN`... `COMMIT` porque a replica reinicia no início do bloco `BEGIN`.

Também é seguro replicar transações das tabelas `MyISAM` da fonte para tabelas transacionais, como tabelas que utilizam o mecanismo de armazenamento `InnoDB`, na replica. Nesses casos, uma declaração `AUTOCOMMIT=1` emitida na fonte é replicada, aplicando assim o modo `AUTOCOMMIT` na replica.

Quando o tipo de motor de armazenamento da replica não for transacional, as transações na fonte que misturam atualizações de tabelas transacionais e não transacionais devem ser evitadas, pois elas podem causar inconsistência no dados entre a tabela transacional da fonte e a tabela não transacional da replica. Isso significa que tais transações podem levar a um comportamento específico do motor de armazenamento da fonte, com o possível efeito de a replicação sair de sincronia. O MySQL não emite um aviso sobre isso, portanto, deve-se ter cuidado extra ao replicar tabelas transacionais da fonte para tabelas não transacionais nas réplicas.

**Mudando o formato de registro binário dentro das transações.** As variáveis de sistema `binlog_format` e `binlog_checksum` são somente de leitura enquanto uma transação estiver em andamento.

Cada transação (incluindo as transações `autocommit`) é registrada no log binário como se começasse com uma declaração `BEGIN`, e termina com uma declaração `COMMIT` ou `ROLLBACK`. Isso é verdadeiro mesmo para declarações que afetam tabelas que usam um motor de armazenamento não transacional (como `MyISAM`).

Nota

Para as restrições que se aplicam especificamente às transações XA, consulte a Seção 15.3.8.3, “Restrições às Transações XA”.

#### 19.5.1.36 Replicação e gatilhos

Com a replicação baseada em declarações, os gatilhos executados na fonte também são executados na replica. Com a replicação baseada em linhas, os gatilhos executados na fonte não são executados na replica. Em vez disso, as alterações de linha na fonte resultantes da execução do gatilho são replicadas e aplicadas na replica.

Esse comportamento é proposital. Se, na replicação baseada em linha, a replica aplicasse os gatilhos, bem como as alterações de linha causadas por eles, as alterações seriam, na verdade, aplicadas duas vezes na replica, levando a dados diferentes na fonte e na replica.

Se você deseja que os gatilhos sejam executados tanto na fonte quanto na replica, talvez porque você tenha gatilhos diferentes na fonte e na replica, você deve usar a replicação baseada em declarações. No entanto, para habilitar gatilhos no lado da replica, não é necessário usar a replicação baseada em declarações exclusivamente. É suficiente alternar para a replicação baseada em declarações apenas para as declarações onde você deseja esse efeito e usar a replicação baseada em linhas o resto do tempo.

Uma declaração que invoca um gatilho (ou função) que causa uma atualização em uma coluna `AUTO_INCREMENT` não é replicada corretamente usando a replicação baseada em declaração. O MySQL 8.0 marca tais declarações como inseguras. (Bug #45677)

Um gatilho pode ter gatilhos para diferentes combinações de evento de gatilho (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`), e múltiplos gatilhos são permitidos.

Por simplicidade, “múltiplos gatilhos” aqui é uma abreviação para “múltiplos gatilhos que têm o mesmo evento de gatilho e tempo de ação”.

**Atualizações.** Múltiplos gatilhos não são suportados em versões anteriores ao MySQL 5.7. Se você atualizar servidores em uma topologia de replicação que use uma versão anterior ao MySQL 5.7, atualize as réplicas primeiro e, em seguida, atualize a fonte. Se um servidor de fonte de replicação atualizado ainda tiver réplicas antigas usando versões do MySQL que não suportam múltiplos gatilhos, um erro ocorrerá nessas réplicas se um gatilho for criado na fonte para uma tabela que já tenha um gatilho com o mesmo evento de gatilho e hora de ação.

**Recadastros.** Se você fazer um recádastro em um servidor que suporta múltiplos gatilhos para uma versão mais antiga que não o faz, o recádastro tem esses efeitos:

* Para cada tabela que possui gatilhos, todas as definições de gatilho estão no arquivo `.TRG` para a tabela. No entanto, se houver vários gatilhos com o mesmo evento de gatilho e tempo de ação, o servidor executa apenas um deles quando o evento de gatilho ocorre. Para informações sobre os arquivos `.TRG`, consulte a seção Armazenamento de gatilho de tabela da documentação do MySQL Server Doxygen, disponível em https://dev.mysql.com/doc/index-other.html.

* Se forem adicionados ou removidos gatilhos para a tabela após a desvalorização, o servidor reescreve o arquivo `.TRG` da tabela. O arquivo reescrito retém apenas um gatilho por combinação de evento de gatilho e hora de ação; os outros são perdidos.

Para evitar esses problemas, modifique seus gatilhos antes de fazer a desativação. Para cada tabela que tem vários gatilhos por combinação de evento de gatilho e hora de ação, converta cada conjunto desses gatilhos em um único gatilho da seguinte forma:

1. Para cada gatilho, crie uma rotina armazenada que contenha todo o código do gatilho. Os valores acessados usando `NEW` e `OLD` podem ser passados para a rotina usando parâmetros. Se o gatilho precisar de um único valor de resultado do código, você pode colocar o código em uma função armazenada e fazer com que a função retorne o valor. Se o gatilho precisar de vários valores de resultado do código, você pode colocar o código em um procedimento armazenado e retornar os valores usando os parâmetros `OUT`.

2. Remova todos os gatilhos da tabela. 3. Crie um novo gatilho para a tabela que invoque as rotinas armazenadas que foram criadas. O efeito deste gatilho é, portanto, o mesmo que os múltiplos gatilhos que ele substitui.

#### 19.5.1.37 Replicação e TRUNCATE TABLE

Normalmente, `TRUNCATE TABLE` é considerado uma declaração DML, e, portanto, espera-se que seja registrada e replicada usando o formato baseado em linha quando o modo de registro binário é `ROW` ou `MIXED`. No entanto, isso causou problemas ao registrar ou replicar, no modo `STATEMENT` ou `MIXED`, tabelas que usavam motores de armazenamento transacional, como `InnoDB`, quando o nível de isolamento de transação era `READ COMMITTED` ou `READ UNCOMMITTED`, o que exclui o registro baseado em declaração.

`TRUNCATE TABLE` é tratado para fins de registro e replicação como DDL em vez de DML, para que possa ser registrado e replicado como uma declaração. No entanto, os efeitos da declaração, conforme aplicável a `InnoDB` e outras tabelas transacionais em réplicas, ainda seguem as regras descritas na Seção 15.1.37, “Declaração de TRUNCATE TABLE” que governam tais tabelas. (Bug #36763)

#### 19.5.1.38 Replicação e comprimento do nome do usuário

O comprimento máximo para nomes de usuário no MySQL 8.0 é de 32 caracteres. A replicação de nomes de usuário com mais de 16 caracteres falha quando a replicação executa uma versão do MySQL anterior à 5.7, porque essas versões suportam apenas nomes de usuário mais curtos. Isso ocorre apenas quando se replica de uma fonte mais nova para uma replica mais antiga, o que não é uma configuração recomendada.

#### 19.5.1.39 Replicação e Variáveis

As variáveis do sistema não são replicadas corretamente ao usar o modo `STATEMENT`, exceto pelas seguintes variáveis quando são usadas com escopo de sessão:

* `auto_increment_increment`
* `auto_increment_offset`
* `character_set_client`
* `character_set_connection`
* `character_set_database`
* `character_set_server`
* `collation_connection`
* `collation_database`
* `collation_server`
* `foreign_key_checks`
* `identity`
* `last_insert_id`
* `lc_time_names`
* `pseudo_thread_id`
* `sql_auto_is_null`
* `time_zone`
* `timestamp`
* `unique_checks`

Quando o modo `MIXED` é usado, as variáveis na lista anterior, quando usadas com escopo de sessão, causam uma mudança de registro baseado em declarações para registro baseado em linhas. Veja a Seção 7.4.4.3, “Formato de Registro Binário Misto”.

`sql_mode` também é replicado, exceto para o modo `NO_DIR_IN_CREATE`; a replica sempre preserva seu próprio valor para `NO_DIR_IN_CREATE`, independentemente das alterações nele realizadas na fonte. Isso é válido para todos os formatos de replicação.

No entanto, quando o **mysqlbinlog** analisa uma declaração `SET @@sql_mode = mode`, o valor completo *`mode`*, incluindo `NO_DIR_IN_CREATE`, é passado para o servidor receptor. Por essa razão, a replicação de uma declaração desse tipo pode não ser segura quando o modo `STATEMENT` está em uso.

A variável de sistema `default_storage_engine` não é replicada, independentemente do modo de registro; isso é destinado a facilitar a replicação entre diferentes motores de armazenamento.

A variável de sistema `read_only` não é replicada. Além disso, a ativação desta variável tem efeitos diferentes em relação a tabelas temporárias, bloqueio de tabelas e a declaração `SET PASSWORD` em diferentes versões do MySQL.

A variável de sistema `max_heap_table_size` não é replicada. Aumentar o valor desta variável na fonte sem fazer o mesmo na réplica pode, eventualmente, levar a erros de tabela cheia na réplica ao tentar executar instruções `INSERT` em uma tabela `MEMORY` na fonte que, assim, é permitida para crescer maior do que sua contraparte na réplica. Para mais informações, consulte a Seção 19.5.1.21, “Replicação e Tabelas de MEMÓRIA”.

Na replicação baseada em declarações, as variáveis de sessão não são replicadas corretamente quando usadas em declarações que atualizam tabelas. Por exemplo, a seguinte sequência de declarações não insere os mesmos dados na fonte e na replica:

```
SET max_join_size=1000;
INSERT INTO mytable VALUES(@@max_join_size);
```

Isso não se aplica à sequência comum:

```
SET time_zone=...;
INSERT INTO mytable VALUES(CONVERT_TZ(..., ..., @@time_zone));
```

A replicação de variáveis de sessão não é um problema quando a replicação baseada em linha está sendo usada, nesse caso, as variáveis de sessão são sempre replicadas com segurança. Veja a Seção 19.2.1, “Formatos de replicação”.

As seguintes variáveis de sessão são escritas no log binário e respeitadas pela replica ao analisar o log binário, independentemente do formato de registro:

* `sql_mode`
* `foreign_key_checks`
* `unique_checks`
* `character_set_client`
* `collation_connection`
* `collation_database`
* `collation_server`
* `sql_auto_is_null`

Importante

Embora as variáveis de sessão relacionadas a conjuntos de caracteres e codificações sejam escritas no log binário, a replicação entre diferentes conjuntos de caracteres não é suportada.

Para ajudar a reduzir possíveis confusões, recomendamos que você use sempre o mesmo ajuste para a variável de sistema `lower_case_table_names` tanto no sistema de origem quanto no replica, especialmente quando você está executando o MySQL em plataformas com sistemas de arquivos sensíveis ao caso. O ajuste `lower_case_table_names` só pode ser configurado durante a inicialização do servidor.

#### 19.5.1.40 Replicação e visualizações

As visualizações são sempre replicadas para réplicas. As visualizações são filtradas pelo seu próprio nome, não pelos tabelas a que se referem. Isso significa que uma visualização pode ser replicada para a réplica, mesmo que a visualização contenha uma tabela que normalmente seria filtrada pelas regras do `replication-ignore-table`. Portanto, deve-se ter cuidado para garantir que as visualizações não repliquem dados de tabela que normalmente seriam filtrados por razões de segurança.

A replicação de uma tabela para uma visão com o mesmo nome é suportada usando o registro baseado em declarações, mas não quando se usa o registro baseado em linhas. Tentar fazer isso quando o registro baseado em linhas está em vigor causa um erro.

### 19.5.2 Compatibilidade de replicação entre as versões do MySQL

O MySQL suporta a replicação de uma série de lançamentos para a série de lançamentos seguinte. Por exemplo, você pode replicar de uma fonte que executa o MySQL 5.6 para uma réplica que executa o MySQL 5.7, de uma fonte que executa o MySQL 5.7 para uma réplica que executa o MySQL 8.0, e assim por diante. No entanto, você pode encontrar dificuldades ao replicar de uma fonte mais antiga para uma réplica mais nova se a fonte usar declarações ou se basear em comportamento que não é mais suportado na versão do MySQL usada na réplica. Por exemplo, os nomes de chave estrangeira mais longos que 64 caracteres não são mais suportados a partir do MySQL 8.0.

O uso de mais de duas versões do MySQL Server não é suportado em configurações de replicação que envolvem múltiplas fontes, independentemente do número de servidores MySQL de origem ou replica. Esta restrição não se aplica apenas às séries de lançamento, mas também aos números de versão dentro da mesma série de lançamento. Por exemplo, se você estiver usando uma configuração de replicação em cadeia ou circular, não pode usar MySQL 8.0.22, MySQL 8.0.24 e MySQL 8.0.28 simultaneamente, embora você possa usar qualquer uma das duas versões juntas.

Importante

É fortemente recomendado usar a versão mais recente disponível dentro de uma série de lançamentos do MySQL, pois as capacidades de replicação (e outras) estão sendo continuamente aprimoradas. Também é recomendado atualizar fontes e réplicas que utilizam versões iniciais de uma série de lançamentos do MySQL para versões GA (produção) quando estas últimas se tornarem disponíveis para essa série de lançamentos.

A partir do MySQL 8.0.14, a versão do servidor é registrada no log binário para cada transação para o servidor que originalmente realizou a transação (`original_server_version`), e para o servidor que é a fonte imediata do servidor atual na topologia de replicação (`immediate_server_version`).

A replicação de fontes mais recentes para réplicas mais antigas pode ser possível, mas geralmente não é suportada. Isso ocorre devido a vários fatores:

* **Alterações no formato do log binário.** O formato do log binário pode mudar entre as versões principais. Embora tentemos manter a compatibilidade reversa, isso nem sempre é possível. Uma fonte também pode ter recursos opcionais habilitados que não são compreendidos por réplicas mais antigas, como a compressão de transações de log binário, onde os payloads de transação comprimidos resultantes não podem ser lidos por uma réplica em uma versão antes do MySQL 8.0.20.

Isso também tem implicações significativas para a atualização dos servidores de replicação; consulte a Seção 19.5.3, “Atualizando uma topologia de replicação”, para mais informações.

* Para mais informações sobre replicação baseada em linha, consulte a Seção 19.2.1, “Formatos de replicação”.

* **Incompatibilidades SQL.** Você não pode replicar de uma fonte mais recente para uma réplica mais antiga usando replicação baseada em declarações se as declarações a serem replicadas utilizarem recursos SQL disponíveis na fonte, mas não na réplica.

No entanto, se tanto a fonte quanto a réplica suportam replicação baseada em linha e não há declarações de definição de dados a serem replicadas que dependem de recursos SQL encontrados na fonte, mas não na réplica, você pode usar a replicação baseada em linha para replicar os efeitos das declarações de modificação de dados, mesmo que o DDL executado na fonte não seja suportado na réplica.

Em MySQL 8.0.26, foram feitas alterações incompatíveis nos nomes dos instrumentos de replicação, incluindo os nomes das etapas de thread, contendo os termos “master”, que é alterado para “source”, “slave”, que é alterado para “replica”, e “mts” (para “multithreaded slave”), que é alterado para “mta” (para “multithreaded applier”). Ferramentas de monitoramento que trabalham com esses nomes de instrumentação podem ser afetadas. Se as alterações incompatíveis tiverem impacto para você, defina a variável de sistema `terminology_use_previous` para `BEFORE_8_0_26` para fazer o MySQL Server usar as versões antigas dos nomes para os objetos especificados na lista anterior. Isso permite que as ferramentas de monitoramento que dependem dos nomes antigos continuem funcionando até que possam ser atualizadas para usar os novos nomes.

Para mais informações sobre possíveis problemas de replicação, consulte a Seção 19.5.1, “Recursos e problemas de replicação”.

### 19.5.3 Atualizando uma topologia de replicação

Quando você atualiza servidores que participam de uma topologia de replicação, é necessário levar em conta o papel de cada servidor na topologia e ficar atento a problemas específicos da replicação. Para informações gerais e instruções sobre atualização de uma instância do MySQL Server, consulte o Capítulo 3, *Atualizando o MySQL*.

Como explicado na Seção 19.5.2, “Compatibilidade de Replicação Entre Versões do MySQL”, o MySQL suporta a replicação de uma fonte que executa uma série de lançamentos para uma réplica que executa a série de lançamentos seguinte, mas não suporta a replicação de uma fonte que executa uma versão mais recente para uma réplica que executa uma versão anterior. Uma réplica em uma versão anterior pode não ter a capacidade necessária para processar transações que podem ser tratadas pela fonte em uma versão mais recente. Portanto, você deve atualizar todas as réplicas em uma topologia de replicação para a versão do servidor MySQL alvo, antes de atualizar o servidor de origem para a versão alvo. Dessa forma, você nunca estará na situação em que uma réplica ainda na versão anterior está tentando lidar com transações de uma fonte na versão mais recente.

Em uma topologia de replicação com múltiplas fontes (replicação de várias fontes), o uso de mais de duas versões do MySQL Server não é suportado, independentemente do número de servidores MySQL de origem ou replica. Essa restrição não se aplica apenas às séries de lançamento, mas também aos números de versão dentro da mesma série de lançamento. Por exemplo, não é possível usar MySQL 8.0.22, MySQL 8.0.24 e MySQL 8.0.28 simultaneamente em tal configuração, embora você possa usar qualquer uma das duas versões juntas.

Se você precisar desfazer os servidores em uma topologia de replicação, a fonte deve ser desfeita antes de as réplicas serem desfeitas. Nas réplicas, você deve garantir que o log binário e o log de relevo tenham sido totalmente processados e remova-os antes de prosseguir com a desfeita.

#### Alterações de comportamento entre as versões

Embora essa sequência de atualização seja correta, ainda é possível encontrar dificuldades de replicação ao replicar de uma fonte de uma versão anterior que ainda não foi atualizada para uma réplica de uma versão posterior que foi atualizada. Isso pode acontecer se a fonte usar declarações ou se basear em comportamentos que não são mais suportados na versão posterior instalada na réplica. Você pode usar o utilitário de verificação de atualização do MySQL Shell `util.checkForServerUpgrade()` para verificar instâncias de servidor MySQL 5.7 ou instâncias de servidor MySQL 8.0 para atualização para uma versão GA do MySQL 8.0. O utilitário identifica tudo o que precisa ser corrigido para aquela instância de servidor para que ela não cause um problema após a atualização, incluindo recursos e comportamentos que não estão mais disponíveis na versão posterior. Consulte o utilitário de verificação de atualização para obter informações sobre o utilitário de verificação de atualização.

Se você está atualizando uma configuração de replicação existente de uma versão do MySQL que não suporta identificadores de transação global (GTIDs) para uma versão que o faz, só habilite GTIDs na fonte e nas réplicas quando você tiver certeza de que a configuração atende a todos os requisitos para replicação baseada em GTIDs. Consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”, para obter informações sobre a conversão de configurações de replicação com base em posições de arquivo de registro binário para uso de replicação baseada em GTIDs.

Alterações que afetam as operações no modo SQL estrito (`STRICT_TRANS_TABLES` ou `STRICT_ALL_TABLES`) podem resultar em falha na replicação em uma replica atualizada. Se você usar o registro baseado em declarações (`binlog_format=STATEMENT`), se uma replica for atualizada antes da fonte, a fonte executa declarações que têm sucesso nela, mas que podem falhar na replica e, assim, causar o fim da replicação. Para lidar com isso, pare todas as novas declarações na fonte e espere até que as réplicas se atualizem, depois atualize as réplicas. Alternativamente, se você não pode parar novas declarações, mude temporariamente para o registro baseado em linhas na fonte (`binlog_format=ROW`) e espere até que todas as réplicas tenham processado todos os logs binários produzidos até o ponto desta mudança, depois atualize as réplicas.

O conjunto de caracteres padrão mudou de `latin1` para `utf8mb4` no MySQL 8.0. Em um ambiente replicado, ao fazer a atualização do MySQL 5.7 para 8.0, é aconselhável alterar o conjunto de caracteres padrão de volta ao conjunto de caracteres usado no MySQL 5.7 antes da atualização. Após a conclusão da atualização, o conjunto de caracteres padrão pode ser alterado para `utf8mb4`. Supondo que os padrões anteriores foram usados, uma maneira de preservá-los é iniciar o servidor com essas linhas no arquivo `my.cnf`:

```
[mysqld]
character_set_server=latin1
collation_server=latin1_swedish_ci
```

#### Procedimento Padrão de Atualização

Para atualizar uma topologia de replicação, siga as instruções do Capítulo 3, *Atualizando o MySQL*, para cada instância do servidor MySQL individual, usando este procedimento geral:

1. Atualize as réplicas primeiro. Em cada instância de réplica:

* Realize as verificações preliminares e os passos descritos na Seção 3.6, “Preparando sua instalação para atualização”.

* Desative o servidor MySQL.
* Atualize os binários ou pacotes do servidor MySQL.
* Reinicie o servidor MySQL.
* Se você atualizou para uma versão anterior ao MySQL 8.0.16, invocando manualmente **mysql_upgrade** para atualizar as tabelas e esquemas do sistema. Quando o servidor estiver em execução com identificadores de transação global (GTIDs) habilitados (`gtid_mode=ON`), não habilite o registro binário pelo **mysql_upgrade** (não use a opção `--write-binlog`). Em seguida, desative e reinicie o servidor.

* Se você atualizou para o MySQL 8.0.16 ou posterior, não invocue **mysql_upgrade**. A partir desse lançamento, o MySQL Server executa todo o procedimento de atualização do MySQL, desabilitando o registro binário durante a atualização.

* Reinicie a replicação usando uma declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement") ou `START SLAVE` (start-slave.html "15.4.2.7 START SLAVE Statement").

2. Quando todas as réplicas tiverem sido atualizadas, siga os mesmos passos para atualizar e reiniciar o servidor de origem, com exceção da declaração `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") ou `START SLAVE`(start-slave.html "15.4.2.7 START SLAVE Statement"). Se você fez uma mudança temporária na log de base de linha ou no conjunto de caracteres padrão, você pode reverter a mudança agora.

#### Procedimento de Atualização com Reparo ou Reestruturação de Tabela

Alguns upgrades podem exigir que você elimine e recrie objetos de banco de dados ao migrar de uma série do MySQL para outra. Por exemplo, as alterações de codificação podem exigir que os índices das tabelas sejam reconstruídos. Tais operações, se necessário, são detalhadas na Seção 3.5, “Alterações no MySQL 8.0”. É mais seguro realizar essas operações separadamente nas réplicas e na fonte e desativar a replicação dessas operações da fonte para a réplica. Para isso, use o seguinte procedimento:

1. Parar todas as réplicas e atualizar os binários ou pacotes. Reinicie-os com a opção `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`, para que eles não se conectem à fonte. Realize qualquer operação de reparo ou reconstrução de tabela necessária para recriar os objetos do banco de dados, como o uso de `REPAIR TABLE` ou `ALTER TABLE`, ou o descarte e recarga de tabelas ou gatilhos.

2. Desative o log binário na fonte. Para fazer isso sem reiniciar a fonte, execute uma declaração `SET sql_log_bin = OFF`. Alternativamente, pare a fonte e reinicie-a com a opção `--skip-log-bin`. Se você reiniciar a fonte, também pode querer impedir as conexões dos clientes. Por exemplo, se todos os clientes se conectam usando TCP/IP, habilite a variável de sistema `skip_networking` quando reiniciar a fonte.

3. Com o registro binário desativado, realize as operações de reparo ou reconstrução de tabela necessárias para recriar os objetos do banco de dados. O registro binário deve ser desativado durante essa etapa para evitar que essas operações sejam registradas e enviadas para as réplicas posteriormente.

4. Reative o log binário na fonte. Se você definiu `sql_log_bin` para `OFF` anteriormente, execute uma declaração `SET sql_log_bin = ON`. Se você reiniciou a fonte para desabilitar o log binário, reinicie-a sem `--skip-log-bin`, e sem habilitar a variável de sistema `skip_networking` para que clientes e réplicas possam se conectar.

5. Reinicie as réplicas, desta vez sem a opção `--skip-slave-start` ou a variável de sistema `skip_slave_start`.

### 19.5.4 Solução de problemas de replicação

Se você seguiu as instruções, mas a configuração de replicação não está funcionando, a primeira coisa a fazer é *verificar o log de erro em busca de mensagens*. Muitos usuários perderam tempo ao não fazer isso logo após encontrar problemas.

Se você não conseguir determinar, no registro de erros, qual foi o problema, experimente as seguintes técnicas:

* Verifique se a fonte tem o registro binário habilitado, emitindo uma declaração `SHOW MASTER STATUS`. O registro binário é habilitado por padrão. Se o registro binário estiver habilitado, `Position` não é nulo. Se o registro binário não estiver habilitado, verifique se você não está executando a fonte com qualquer configuração que desative o registro binário, como a opção `--skip-log-bin`.

* Verifique se a variável de sistema `server_id` foi definida na inicialização tanto no sistema de origem quanto na replica e que o valor de ID é único em cada servidor.

* Verifique se a replica está em execução. Use `SHOW REPLICA STATUS` para verificar se os valores dos `Replica_IO_Running` e `Replica_SQL_Running` são ambos `Yes`. Se não for o caso, verifique as opções que foram usadas ao iniciar o servidor de replicação. Por exemplo, a opção de linha de comando `--skip-slave-start`, ou a partir do MySQL 8.0.24, a variável de sistema `skip_slave_start`, impede que os threads de replicação comecem até que você emita uma declaração `START REPLICA`.

* Se a réplica estiver em execução, verifique se ela estabeleceu uma conexão com a fonte. Use `SHOW PROCESSLIST`(show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"), encontre as threads de I/O (receptor) e SQL (aplicador) e verifique sua coluna `State` para ver o que elas exibem. Veja a Seção 19.2.3, “Threads de Replicação”. Se o estado da thread do receptor disser `Connecting to master`, verifique o seguinte:

+ Verifique os privilégios do usuário de replicação na fonte.

+ Verifique se o nome do host da fonte está correto e se você está usando a porta correta para se conectar à fonte. A porta usada para replicação é a mesma usada para comunicação de rede do cliente (o padrão é `3306`). Para o nome do host, garanta que o nome resolva o endereço IP correto.

+ Verifique o arquivo de configuração para verificar se a variável de sistema `skip_networking` foi habilitada na fonte ou na réplica para desabilitar a rede. Se sim, comente a configuração ou remova-a.

+ Se a fonte tiver uma configuração de firewall ou filtragem de IP, certifique-se de que a porta de rede que está sendo usada para o MySQL não está sendo filtrada.

+ Verifique se você pode chegar à fonte usando `ping` ou `traceroute`/`tracert` para chegar ao hospedeiro.

* Se a réplica estava em execução anteriormente, mas parou, a razão geralmente é que alguma declaração que teve sucesso na fonte falhou na réplica. Isso nunca deve acontecer se você tiver feito um snapshot adequado da fonte e nunca modificado os dados na réplica fora dos threads de replicação. Se a réplica parar inesperadamente, é um bug ou você encontrou um dos limites de replicação conhecidos descritos na Seção 19.5.1, “Recursos e Problemas de Replicação”. Se for um bug, consulte a Seção 19.5.5, “Como Relatar Bugs ou Problemas de Replicação”, para instruções sobre como relatar isso.

* Se uma declaração que teve sucesso na fonte se recusar a ser executada na réplica, tente o procedimento a seguir se não for viável realizar uma ressonância completa do banco de dados, excluindo os bancos de dados da réplica e copiando um novo instantâneo da fonte:

1. Verifique se a tabela afetada na replica é diferente da tabela da fonte. Tente entender como isso aconteceu. Em seguida, faça a tabela da replica igual à da fonte e execute `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement").

2. Se a etapa anterior não funcionar ou não se aplicar, tente entender se seria seguro fazer a atualização manualmente (se necessário) e, em seguida, ignore a próxima declaração da fonte.

3. Se você decidir que a réplica pode pular a próxima declaração da fonte, emita as seguintes declarações:

     ```
     mysql> SET GLOBAL sql_slave_skip_counter = N;
     mysql> START SLAVE;

     Or from MySQL 8.0.26:
     mysql> SET GLOBAL sql_replica_skip_counter = N;
     mysql> START REPLICA;
     ```

O valor de *`N`* deve ser 1 se a próxima declaração da fonte não utilizar `AUTO_INCREMENT` ou `LAST_INSERT_ID()`. Caso contrário, o valor deve ser 2. A razão para usar um valor de 2 para declarações que utilizam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` é que elas levam em conta dois eventos no log binário da fonte.

Veja também a sintaxe SET GLOBAL sql_slave_skip_counter.

4. Se você tem certeza de que a réplica começou perfeitamente sincronizada com a fonte e que ninguém atualizou as tabelas envolvidas fora dos threads de replicação, então, presumivelmente, a discrepância é o resultado de um bug. Se você está executando a versão mais recente do MySQL, por favor, informe o problema. Se você está executando uma versão mais antiga, tente atualizar para o lançamento mais recente de produção para determinar se o problema persiste.

### 19.5.5 Como relatar bugs ou problemas de replicação

Quando você tiver determinado que não há erro do usuário envolvido e a replicação ainda não funcione ou seja instável, é hora de nos enviar um relatório de erro. Precisamos obter o máximo de informações possível de você para ser capaz de localizar o erro. Por favor, gaste algum tempo e esforço para preparar um bom relatório de erro.

Se você tiver um caso de teste repetiível que demonstre o bug, por favor, insira-o em nosso banco de dados de bugs usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”. Se você tiver um problema “fantasma” (um que você não pode duplicar à vontade), use o seguinte procedimento:

1. Verifique se não há erro do usuário envolvido. Por exemplo, se você atualizar a replicação fora dos fios de replicação, os dados saem de sincronia, e você pode ter violações de chave única em atualizações. Neste caso, o fio de replicação para e espera que você limpe as tabelas manualmente para trazê-las em sincronia. *Isto não é um problema de replicação. É um problema de interferência externa que faz com que a replicação falhe.*

2. Certifique-se de que a replica esteja em execução com o registro binário habilitado (a variável de sistema `log_bin`), e com a opção `--log-slave-updates` habilitada, o que faz com que a replica registre as atualizações que recebe da fonte em seus próprios registros binários. Esses ajustes são os padrões.

3. Salve todas as provas antes de redefinir o estado de replicação. Se não tivermos informações ou apenas informações vagas, torna-se difícil ou impossível para nós localizar o problema. As provas que você deve coletar são:

* Todos os arquivos de registro binários da fonte
* Todos os arquivos de registro binários da replica
* A saída de `SHOW MASTER STATUS`(show-master-status.html "15.7.7.23 SHOW MASTER STATUS Statement") da fonte no momento em que você descobriu o problema

* A saída de `SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") da réplica no momento em que você descobriu o problema

* Registros de erro da fonte e da réplica
4. Use **mysqlbinlog** para examinar os registros binários. O seguinte deve ser útil para encontrar a declaração do problema. *`log_file`* e *`log_pos`* são os valores `Master_Log_File` e `Read_Master_Log_Pos` de `SHOW REPLICA STATUS`.

   ```
   $> mysqlbinlog --start-position=log_pos log_file | head
   ```

Depois de ter coletado as evidências para o problema, tente isolá-lo como um caso de teste separado primeiro. Em seguida, insira o problema com o máximo de informações possível em nossa base de dados de bugs usando as instruções na Seção 1.5, “Como relatar bugs ou problemas”.