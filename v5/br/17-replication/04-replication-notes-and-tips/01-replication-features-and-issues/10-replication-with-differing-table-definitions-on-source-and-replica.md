#### 16.4.1.10 Replicação com Definições de Tabela Diferentes na Source e na Replica

As tabelas Source e target para replicação não precisam ser idênticas. Uma tabela na source pode ter mais ou menos colunas do que a cópia da tabela na replica. Além disso, as colunas de tabela correspondentes na source e na replica podem usar diferentes tipos de dados, sujeitas a certas condições.

Nota

A replicação entre tabelas que são particionadas de forma diferente não é suportada. Consulte [Seção 16.4.1.23, “Replicação e Particionamento”](replication-features-partitioning.html "16.4.1.23 Replicação e Particionamento").

Em todos os casos em que as tabelas source e target não têm definições idênticas, os nomes do Database e da tabela devem ser os mesmos tanto na source quanto na replica. Condições adicionais são discutidas, com exemplos, nas duas seções a seguir.

##### 16.4.1.10.1 Replicação com Mais Colunas na Source ou na Replica

Você pode replicar uma tabela da source para a replica de modo que as cópias da tabela na source e na replica tenham números diferentes de colunas, sujeitas às seguintes condições:

* As colunas comuns a ambas as versões da tabela devem ser definidas na mesma ordem na source e na replica.

  (Isto é verdade mesmo que ambas as tabelas tenham o mesmo número de colunas.)

* As colunas comuns a ambas as versões da tabela devem ser definidas antes de quaisquer colunas adicionais.

  Isso significa que a execução de uma instrução [`ALTER TABLE`] na replica onde uma nova coluna é inserida na tabela dentro do intervalo de colunas comuns a ambas as tabelas faz com que a replicação falhe, conforme mostrado no exemplo a seguir:

  Suponha que uma tabela `t`, existente na source e na replica, seja definida pela seguinte instrução [`CREATE TABLE`]:

  ```sql
  CREATE TABLE t (
      c1 INT,
      c2 INT,
      c3 INT
  );
  ```

  Suponha que a instrução [`ALTER TABLE`] mostrada aqui seja executada na replica:

  ```sql
  ALTER TABLE t ADD COLUMN cnew1 INT AFTER c3;
  ```

  O [`ALTER TABLE`] anterior é permitido na replica porque as colunas `c1`, `c2` e `c3` que são comuns a ambas as versões da tabela `t` permanecem agrupadas em ambas as versões da tabela, antes de quaisquer colunas que diferem.

  No entanto, a seguinte instrução [`ALTER TABLE`] não pode ser executada na replica sem causar a quebra da replicação:

  ```sql
  ALTER TABLE t ADD COLUMN cnew2 INT AFTER c2;
  ```

  A replicação falha após a execução na replica da instrução [`ALTER TABLE`] que acabou de ser mostrada, porque a nova coluna `cnew2` fica entre as colunas comuns a ambas as versões de `t`.

* Cada coluna “extra” na versão da tabela que tem mais colunas deve ter um valor default (padrão).

  O valor default de uma coluna é determinado por vários fatores, incluindo seu tipo, se é definida com uma opção `DEFAULT`, se é declarada como `NULL`, e o SQL mode do servidor em vigor no momento de sua criação; para mais informações, consulte [Seção 11.6, “Valores Default de Tipo de Dados”](data-type-defaults.html "11.6 Valores Default de Tipo de Dados").

Além disso, quando a cópia da tabela na replica tem mais colunas do que a cópia na source, cada coluna comum às tabelas deve usar o mesmo tipo de dados em ambas as tabelas.

**Exemplos.** Os seguintes exemplos ilustram algumas definições de tabela válidas e inválidas:

**Mais colunas na source.** As seguintes definições de tabela são válidas e replicam corretamente:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

As seguintes definições de tabela levantariam um erro porque as definições das colunas comuns a ambas as versões da tabela estão em uma ordem diferente na replica do que na source:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT);
```

As seguintes definições de tabela também levantariam um erro porque a definição da coluna extra na source aparece antes das definições das colunas comuns a ambas as versões da tabela:

```sql
source> CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

**Mais colunas na replica.** As seguintes definições de tabela são válidas e replicam corretamente:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

As seguintes definições levantam um erro porque as colunas comuns a ambas as versões da tabela não são definidas na mesma ordem tanto na source quanto na replica:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT, c3 INT);
```

As seguintes definições de tabela também levantam um erro porque a definição para a coluna extra na versão da tabela da replica aparece antes das definições para as colunas que são comuns a ambas as versões da tabela:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
```

As seguintes definições de tabela falham porque a versão da tabela da replica tem colunas adicionais em comparação com a versão da source, e as duas versões da tabela usam tipos de dados diferentes para a coluna comum `c2`:

```sql
source> CREATE TABLE t1 (c1 INT, c2 BIGINT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

##### 16.4.1.10.2 Replicação de Colunas com Tipos de Dados Diferentes

As colunas correspondentes nas cópias da mesma tabela na source e na replica, idealmente, devem ter o mesmo tipo de dado. No entanto, isso nem sempre é estritamente exigido, desde que certas condições sejam atendidas.

Geralmente, é possível replicar de uma coluna de um determinado tipo de dado para outra coluna do mesmo tipo e mesmo tamanho ou largura, onde aplicável, ou maior. Por exemplo, você pode replicar de uma coluna `CHAR(10)` para outra `CHAR(10)`, ou de uma coluna `CHAR(10)` para uma coluna `CHAR(25)` sem problemas. Em certos casos, também é possível replicar de uma coluna com um tipo de dado (na source) para uma coluna com um tipo de dado diferente (na replica); quando o tipo de dado da versão da coluna na source é promovido para um tipo que tem o mesmo tamanho ou é maior na replica, isso é conhecido como *attribute promotion* (promoção de atributo).

A promoção de atributo pode ser usada tanto com replicação baseada em declaração (statement-based) quanto com replicação baseada em linha (row-based), e não depende do Storage Engine usado pela source ou pela replica. No entanto, a escolha do formato de log tem um efeito sobre as conversões de tipo permitidas; os detalhes são discutidos mais adiante nesta seção.

Importante

Independentemente de você usar replicação baseada em declaração ou baseada em linha, a cópia da tabela na replica não pode conter mais colunas do que a cópia da source se você deseja empregar a promoção de atributo.

**Replicação baseada em declaração (Statement-based replication).** Ao usar a replicação baseada em declaração, uma regra prática simples a seguir é: “Se a declaração executada na source também fosse executada com sucesso na replica, ela também deve replicar com sucesso”. Em outras palavras, se a declaração usar um valor que seja compatível com o tipo de uma determinada coluna na replica, a declaração pode ser replicada. Por exemplo, você pode inserir qualquer valor que caiba em uma coluna `TINYINT` em uma coluna `BIGINT` também; segue-se que, mesmo que você altere o tipo de uma coluna `TINYINT` na cópia de uma tabela da replica para `BIGINT`, qualquer insert nessa coluna na source que seja bem-sucedido também deve ser bem-sucedido na replica, visto que é impossível ter um valor `TINYINT` legal que seja grande o suficiente para exceder uma coluna `BIGINT`.

Antes do MySQL 5.7.1, ao usar a replicação baseada em declaração, as colunas `AUTO_INCREMENT` eram obrigadas a ser as mesmas tanto na source quanto na replica; caso contrário, os updates poderiam ser aplicados à tabela errada na replica. (Bug #12669186)

**Replicação baseada em linha (Row-based replication): promoção e despromoção de atributos.** A replicação baseada em linha suporta a promoção e despromoção de atributos entre tipos de dados menores e tipos maiores. Também é possível especificar se deve ser permitida ou não a conversão com perda (truncada) ou sem perda (non-lossy) de valores de colunas despromovidas, conforme explicado mais adiante nesta seção.

**Conversões com e sem perda (Lossy e Non-Lossy).** No caso em que o tipo target não pode representar o valor sendo inserido, uma decisão deve ser tomada sobre como lidar com a conversão. Se permitirmos a conversão, mas truncarmos (ou modificarmos de outra forma) o valor da source para conseguir um “ajuste” na coluna target, fazemos o que é conhecido como *lossy conversion* (conversão com perda). Uma conversão que não requer truncamento ou modificações semelhantes para encaixar o valor da coluna da source na coluna target é uma *non-lossy conversion* (conversão sem perda).

**Modos de conversão de tipo (variável slave_type_conversions).** A configuração da variável global de servidor `slave_type_conversions` controla o modo de conversão de tipo usado na replica. Esta variável assume um conjunto de valores da tabela a seguir, que mostra os efeitos de cada modo no comportamento de conversão de tipo da replica:

<table summary="Modos de conversão de tipo para a variável global de servidor slave_type_conversions e os efeitos de cada modo no comportamento de conversão de tipo da replica."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Modo</th> <th>Efeito</th> </tr></thead><tbody><tr> <td><code>ALL_LOSSY</code></td> <td><p> Neste modo, conversões de tipo que implicariam perda de informação são permitidas. </p><p> Isto não implica que conversões sem perda (non-lossy) sejam permitidas, mas apenas que casos que exijam conversões com perda (lossy) ou nenhuma conversão são permitidos; por exemplo, habilitar <span><em>apenas</em></span> este modo permite que uma coluna <code>INT</code> seja convertida para <code>TINYINT</code> (uma conversão com perda), mas não uma coluna <code>TINYINT</code> para uma coluna <code>INT</code> (sem perda). Tentar a última conversão neste caso faria com que a replicação parasse com um erro na replica. </p></td> </tr><tr> <td><code>ALL_NON_LOSSY</code></td> <td><p> Este modo permite conversões que não exigem truncamento ou outro tratamento especial do valor da source; ou seja, permite conversões onde o tipo target tem um range (intervalo) mais amplo do que o tipo da source. </p><p> Configurar este modo não tem relação se conversões com perda são permitidas; isso é controlado pelo modo <code>ALL_LOSSY</code>. Se apenas <code>ALL_NON_LOSSY</code> estiver configurado, mas não <code>ALL_LOSSY</code>, tentar uma conversão que resultaria na perda de dados (como <code>INT</code> para <code>TINYINT</code>, ou <code>CHAR(25)</code> para <code>VARCHAR(20)</code>) fará com que a replica pare com um erro. </p></td> </tr><tr> <td><code>ALL_LOSSY,ALL_NON_LOSSY</code></td> <td><p> Quando este modo está configurado, todas as conversões de tipo suportadas são permitidas, sejam elas conversões com perda ou sem perda. </p></td> </tr><tr> <td><code>ALL_SIGNED</code></td> <td><p> Tratar tipos Integer promovidos como valores Signed (com sinal) (o comportamento default). </p></td> </tr><tr> <td><code>ALL_UNSIGNED</code></td> <td><p> Tratar tipos Integer promovidos como valores Unsigned (sem sinal). </p></td> </tr><tr> <td><code>ALL_SIGNED,ALL_UNSIGNED</code></td> <td><p> Tratar tipos Integer promovidos como signed, se possível, caso contrário, como unsigned. </p></td> </tr><tr> <td>[<span><em>vazio</em></span>]</td> <td><p> Quando <code>slave_type_conversions</code> não está configurado, nenhuma promoção ou despromoção de atributo é permitida; isso significa que todas as colunas nas tabelas source e target devem ser dos mesmos tipos. </p><p> Este modo é o default. </p></td> </tr></tbody></table>

Quando um tipo integer é promovido, seu atributo de signedness (sinalização) não é preservado. Por default, a replica trata todos esses valores como signed (com sinal). A partir do MySQL 5.7.2, você pode controlar este comportamento usando `ALL_SIGNED`, `ALL_UNSIGNED`, ou ambos. (Bug#15831300) `ALL_SIGNED` instrui a replica a tratar todos os tipos integer promovidos como signed; `ALL_UNSIGNED` a instrui a tratá-los como unsigned (sem sinal). Especificar ambos faz com que a replica trate o valor como signed, se possível, caso contrário, o trata como unsigned; a ordem em que são listados não é significante. Nem `ALL_SIGNED` nem `ALL_UNSIGNED` têm qualquer efeito se pelo menos um de `ALL_LOSSY` ou `ALL_NONLOSSY` não for usado também.

A alteração do modo de conversão de tipo requer a reinicialização da replica com a nova configuração de `slave_type_conversions`.

**Conversões suportadas.** Conversões suportadas entre tipos de dados diferentes, mas semelhantes, são mostradas na lista a seguir:

* Entre qualquer um dos tipos integer [`TINYINT`], [`SMALLINT`], [`MEDIUMINT`], [`INT`], e [`BIGINT`].

  Isso inclui conversões entre as versões signed e unsigned desses tipos.

  Conversões com perda (lossy) são feitas truncando o valor da source para o máximo (ou mínimo) permitido pela coluna target. Para garantir conversões sem perda (non-lossy) ao passar de tipos unsigned para signed, a coluna target deve ser grande o suficiente para acomodar o range de valores na coluna source. Por exemplo, você pode despromover `TINYINT UNSIGNED` sem perda para `SMALLINT`, mas não para `TINYINT`.

* Entre qualquer um dos tipos decimais [`DECIMAL`], [`FLOAT`], [`DOUBLE`], e [`NUMERIC`].

  `FLOAT` para `DOUBLE` é uma conversão sem perda (non-lossy); `DOUBLE` para `FLOAT` só pode ser tratada com perda (lossy). Uma conversão de `DECIMAL(M,D)` para `DECIMAL(M',D')` onde `D' >= D` e `(M'-D') >= (M-D`) é sem perda; para qualquer caso em que `M' < M`, `D' < D`, ou ambos, apenas uma conversão com perda pode ser feita.

  Para qualquer um dos tipos decimais, se um valor a ser armazenado não puder caber no tipo target, o valor é arredondado para baixo de acordo com as regras de arredondamento definidas para o servidor em outra parte da documentação. Consulte [Seção 12.21.4, “Comportamento de Arredondamento”](precision-math-rounding.html "12.21.4 Comportamento de Arredondamento"), para obter informações sobre como isso é feito para tipos decimais.

* Entre qualquer um dos tipos String [`CHAR`], [`VARCHAR`], e [`TEXT`], incluindo conversões entre diferentes larguras.

  A conversão de `CHAR`, `VARCHAR` ou `TEXT` para uma coluna `CHAR`, `VARCHAR` ou `TEXT` do mesmo tamanho ou maior nunca é com perda. A conversão com perda é tratada inserindo apenas os primeiros *`N`* caracteres da string na replica, onde *`N`* é a largura da coluna target.

  Importante

  Replicação entre colunas usando diferentes character sets não é suportada.

* Entre qualquer um dos tipos de dados binários [`BINARY`], [`VARBINARY`], e [`BLOB`], incluindo conversões entre diferentes larguras.

  A conversão de `BINARY`, `VARBINARY` ou `BLOB` para uma coluna `BINARY`, `VARBINARY` ou `BLOB` do mesmo tamanho ou maior nunca é com perda. A conversão com perda é tratada inserindo apenas os primeiros *`N`* bytes da string na replica, onde *`N`* é a largura da coluna target.

* Entre quaisquer 2 colunas [`BIT`] de quaisquer 2 tamanhos.

  Ao inserir um valor de uma coluna `BIT(M)` em uma coluna `BIT(M')`, onde `M' > M`, os bits mais significativos das colunas `BIT(M')` são limpos (definidos como zero) e os *`M`* bits do valor `BIT(M)` são definidos como os bits menos significativos da coluna `BIT(M')`.

  Ao inserir um valor de uma coluna `BIT(M)` da source em uma coluna `BIT(M')` target, onde `M' < M`, o valor máximo possível para a coluna `BIT(M')` é atribuído; em outras palavras, um valor "all-set" (todos definidos) é atribuído à coluna target.

Conversões entre tipos que não estão na lista anterior não são permitidas.