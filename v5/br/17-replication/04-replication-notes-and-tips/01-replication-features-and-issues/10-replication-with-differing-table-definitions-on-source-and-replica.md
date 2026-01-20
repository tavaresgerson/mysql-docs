#### 16.4.1.10 Replicação com definições de tabela diferentes na fonte e na réplica

As tabelas de origem e de destino para a replicação não precisam ser idênticas. Uma tabela na origem pode ter mais ou menos colunas do que a cópia da tabela da replica. Além disso, as colunas correspondentes das tabelas na origem e na replica podem usar tipos de dados diferentes, sujeito a certas condições.

Nota

A replicação entre tabelas que são particionadas de maneira diferente uma da outra não é suportada. Consulte Seção 16.4.1.23, “Replicação e Partição”.

Em todos os casos em que as tabelas de origem e destino não tenham definições idênticas, os nomes do banco de dados e das tabelas devem ser os mesmos tanto na origem quanto na replica. Condições adicionais são discutidas, com exemplos, nas duas seções seguintes.

##### 16.4.1.10.1 Replicação com mais colunas na fonte ou réplica

Você pode replicar uma tabela da fonte para a replica de forma que as cópias da fonte e da replica da tabela tenham números diferentes de colunas, desde que as seguintes condições sejam atendidas:

- As colunas comuns às duas versões da tabela devem ser definidas na mesma ordem na fonte e na replica.

  (Isso é verdade mesmo que ambas as tabelas tenham o mesmo número de colunas.)

- As colunas comuns às duas versões da tabela devem ser definidas antes de quaisquer colunas adicionais.

  Isso significa que a execução de uma instrução `ALTER TABLE` na replica onde uma nova coluna é inserida na tabela dentro do intervalo de colunas comuns a ambas as tabelas causa o fracasso da replicação, conforme mostrado no exemplo a seguir:

  Suponha que uma tabela `t`, existente na fonte e na replica, seja definida pela seguinte instrução `CREATE TABLE`:

  ```sql
  CREATE TABLE t (
      c1 INT,
      c2 INT,
      c3 INT
  );
  ```

  Suponha que a instrução `ALTER TABLE` mostrada aqui seja executada na replica:

  ```sql
  ALTER TABLE t ADD COLUMN cnew1 INT AFTER c3;
  ```

  O comando anterior `ALTER TABLE` é permitido na replica porque as colunas `c1`, `c2` e `c3`, que são comuns às duas versões da tabela `t`, permanecem agrupadas em ambas as versões da tabela, antes de quaisquer colunas que sejam diferentes.

  No entanto, a seguinte instrução `ALTER TABLE` não pode ser executada na replica sem causar a interrupção da replicação:

  ```sql
  ALTER TABLE t ADD COLUMN cnew2 INT AFTER c2;
  ```

  A replicação falha após a execução na replica da instrução `ALTER TABLE` que acabou de ser exibida, porque a nova coluna `cnew2` vem entre as colunas comuns às duas versões de `t`.

- Cada coluna "extra" na versão da tabela com mais colunas deve ter um valor padrão.

  O valor padrão de uma coluna é determinado por vários fatores, incluindo seu tipo, se ela é definida com a opção `DEFAULT`, se é declarada como `NULL` e o modo SQL do servidor em vigor no momento de sua criação; para mais informações, consulte Seção 11.6, “Valores padrão de tipo de dados”).

Além disso, quando a cópia da tabela da réplica tiver mais colunas do que a cópia da fonte, cada coluna comum às tabelas deve usar o mesmo tipo de dado em ambas as tabelas.

**Exemplos.** Os exemplos a seguir ilustram algumas definições de tabelas válidas e inválidas:

**Mais colunas na fonte.** As definições da tabela a seguir são válidas e replicadas corretamente:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

As seguintes definições de tabelas gerariam um erro porque as definições das colunas comuns às duas versões da tabela estão em uma ordem diferente na replica do que na fonte:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT);
```

As seguintes definições de tabelas também gerariam um erro, pois a definição da coluna extra na fonte aparece antes das definições das colunas comuns às duas versões da tabela:

```sql
source> CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

**Mais colunas na réplica.** As definições da tabela a seguir são válidas e replicam corretamente:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

As seguintes definições geram um erro porque as colunas comuns às duas versões da tabela não estão definidas na mesma ordem tanto na fonte quanto na replica:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT, c3 INT);
```

As seguintes definições de tabelas também geram um erro porque a definição da coluna extra na versão da tabela da replica aparece antes das definições das colunas que são comuns a ambas as versões da tabela:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
```

As seguintes definições de tabelas falham porque a versão da replica da tabela tem colunas adicionais em comparação com a versão da fonte, e as duas versões da tabela usam tipos de dados diferentes para a coluna comum `c2`:

```sql
source> CREATE TABLE t1 (c1 INT, c2 BIGINT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

##### 16.4.1.10.2 Replicação de Colunas com Diferentes Tipos de Dados

As colunas correspondentes nas cópias da mesma tabela do fonte e da réplica idealmente devem ter o mesmo tipo de dado. No entanto, isso nem sempre é rigorosamente aplicado, desde que certas condições sejam atendidas.

Geralmente é possível replicar de uma coluna de um determinado tipo de dado para outra coluna do mesmo tipo e tamanho ou largura, quando aplicável, ou maior. Por exemplo, você pode replicar de uma coluna `CHAR(10)` para outra `CHAR(10)` ou de uma coluna `CHAR(10)` para uma coluna `CHAR(25)` sem problemas. Em certos casos, também é possível replicar de uma coluna com um tipo de dado (na versão da fonte) para uma coluna com um tipo de dado diferente (na replica); quando o tipo de dado da versão da fonte da coluna é promovido para um tipo do mesmo tamanho ou maior na replica, isso é conhecido como promoção de atributo.

A promoção de atributos pode ser usada tanto com replicação baseada em declarações quanto em linhas, e não depende do mecanismo de armazenamento usado pelo banco de dados fonte ou da replica. No entanto, a escolha do formato de registro tem um efeito sobre os tipos de conversão permitidos; os detalhes são discutidos mais adiante nesta seção.

Importante

Se você usar a replicação baseada em declarações ou baseada em linhas, a cópia da tabela da replica não pode conter mais colunas do que a cópia da fonte, se você deseja usar a promoção de atributos.

**Replicação baseada em instruções.** Ao usar a replicação baseada em instruções, uma regra simples a seguir é: “Se a instrução executada na fonte também for executada com sucesso na réplica, ela também deve ser replicada com sucesso”. Em outras palavras, se a instrução usa um valor que é compatível com o tipo de uma coluna específica na réplica, a instrução pode ser replicada. Por exemplo, você pode inserir qualquer valor que se encaixe em uma coluna `TINYINT` em uma coluna `BIGINT` também; isso significa que, mesmo que você mude o tipo de uma coluna `TINYINT` na cópia da réplica de uma tabela para `BIGINT`, qualquer inserção nessa coluna na fonte que seja bem-sucedida também deve ser bem-sucedida na réplica, pois é impossível ter um valor legal `TINYINT` que seja grande o suficiente para exceder uma coluna `BIGINT`.

Antes do MySQL 5.7.1, ao usar a replicação baseada em instruções, as colunas `AUTO_INCREMENT` precisavam ser iguais tanto na fonte quanto na replica; caso contrário, as atualizações poderiam ser aplicadas na tabela errada na replica. (Bug #12669186)

**Replicação baseada em linhas: promoção e redução de atributos.** A replicação baseada em linhas suporta a promoção e redução de atributos entre tipos de dados menores e maiores. Também é possível especificar se permitir ou não conversões perdidas (truncadas) ou não perdidas de valores de colunas reduzidas, conforme explicado mais adiante nesta seção.

**Conversões sem perda e com perda.** No caso de o tipo de destino não conseguir representar o valor sendo inserido, é necessário tomar uma decisão sobre como lidar com a conversão. Se permitirmos a conversão, mas truncarmos (ou modificarmos de outra forma) o valor da fonte para obter um "ajuste" na coluna de destino, realizamos o que é conhecido como uma conversão com perda. Uma conversão que não requer truncação ou modificações semelhantes para ajustar o valor da coluna de origem na coluna de destino é uma conversão sem perda.

**Modos de conversão de tipos (variável slave_type_conversions).** A configuração da variável global do servidor `slave_type_conversions` controla o modo de conversão de tipos usado na replica. Essa variável aceita um conjunto de valores da seguinte tabela, que mostra os efeitos de cada modo no comportamento de conversão de tipos da replica:

<table summary="Modos de conversão de tipo para a variável global slave_type_conversions e os efeitos de cada modo no comportamento de conversão de tipo do escravo."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Modo</th> <th>Efeito</th> </tr></thead><tbody><tr> <td>PH_HTML_CODE_<code>TINYINT</code>]</td> <td><p>Nesse modo, as conversões de tipos que significam perda de informações são permitidas.</p><p>Isso não implica que as conversões sem perda sejam permitidas, apenas que apenas os casos que exigem conversões com perda ou nenhuma conversão são permitidos; por exemplo, habilitar<span><em>apenas</em></span>Esse modo permite que uma coluna PH_HTML_CODE_<code>TINYINT</code>] seja convertida para PH_HTML_CODE_<code>VARCHAR(20)</code>] (uma conversão com perda de dados), mas não uma coluna PH_HTML_CODE_<code>ALL_LOSSY,ALL_NON_LOSSY</code>] para uma coluna PH_HTML_CODE_<code>ALL_SIGNED</code>] (sem perda de dados). Tentar a conversão deste último caso causaria a parada da replicação com um erro na replica.</p></td> </tr><tr> <td>PH_HTML_CODE_<code>ALL_UNSIGNED</code>]</td> <td><p>Esse modo permite conversões que não exigem truncação ou outro tratamento especial do valor de origem; ou seja, permite conversões em que o tipo de destino tem uma faixa mais ampla do que o tipo de origem.</p><p>Definir este modo não afeta se as conversões com perda de dados são permitidas; isso é controlado com o modo PH_HTML_CODE_<code>ALL_SIGNED,ALL_UNSIGNED</code>]. Se apenas PH_HTML_CODE_<code>slave_type_conversions</code>] for definido, mas não <code>ALL_LOSSY</code>, então tentar uma conversão que resultaria na perda de dados (como <code>INT</code> para <code>TINYINT</code>, ou <code>INT</code><code>TINYINT</code>] para <code>VARCHAR(20)</code>) faz com que a replica pare com um erro.</p></td> </tr><tr> <td><code>ALL_LOSSY,ALL_NON_LOSSY</code></td> <td><p>Quando este modo estiver definido, todas as conversões de tipo suportadas serão permitidas, independentemente de serem ou não conversões com perda de dados.</p></td> </tr><tr> <td><code>ALL_SIGNED</code></td> <td><p>Trate os tipos inteiros promovidos como valores assinados (o comportamento padrão).</p></td> </tr><tr> <td><code>ALL_UNSIGNED</code></td> <td><p>Trate os tipos inteiros promovidos como valores não assinados.</p></td> </tr><tr> <td><code>ALL_SIGNED,ALL_UNSIGNED</code></td> <td><p>Trate os tipos inteiros promovidos como assinados, se possível, caso contrário, como não assinados.</p></td> </tr><tr> <td>[<span><em>vazio</em></span>]</td> <td><p>Quando <code>slave_type_conversions</code> não estiver definido, nenhuma promoção ou redução de atributo é permitida; isso significa que todas as colunas nas tabelas de origem e destino devem ser do mesmo tipo.</p><p>Esse modo é o padrão.</p></td> </tr></tbody></table>

Quando um tipo inteiro é promovido, sua sinalização não é preservada. Por padrão, a replica trata todos esses valores como sinalizados. A partir do MySQL 5.7.2, você pode controlar esse comportamento usando `ALL_SIGNED`, `ALL_UNSIGNED` ou ambos. (Bug#15831300) `ALL_SIGNED` indica que a replica deve tratar todos os tipos inteiros promovidos como sinalizados; `ALL_UNSIGNED` instrui-a a tratá-los como não sinalizados. Especificar ambos faz com que a replica trate o valor como sinalizado, se possível, caso contrário, como não sinalizado; a ordem em que eles são listados não é significativa. Nem `ALL_SIGNED` nem `ALL_UNSIGNED` têm efeito se pelo menos um dos `ALL_LOSSY` ou `ALL_NONLOSSY` não for usado também.

Para alterar o modo de conversão de tipo, é necessário reiniciar a replica com o novo ajuste `slave_type_conversions`.

**Conversões suportadas.** As conversões suportadas entre diferentes, mas semelhantes, tipos de dados estão listadas a seguir:

- Entre qualquer um dos tipos inteiros `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` e `BIGINT`.

  Isso inclui conversões entre as versões assinadas e não assinadas desses tipos.

  As conversões sem perda são feitas truncando o valor fonte para o máximo (ou mínimo) permitido pelo tipo da coluna de destino. Para garantir conversões sem perda ao passar de tipos não assinados para assinados, a coluna de destino deve ser grande o suficiente para acomodar a faixa de valores na coluna de origem. Por exemplo, você pode degradar `TINYINT UNSIGNED` sem perda para `SMALLINT`, mas não para `TINYINT`.

- Entre qualquer um dos tipos decimais `DECIMAL`, `FLOAT`, `DOUBLE` e `NUMERIC`.

  A conversão de `FLOAT` para `DOUBLE` é uma conversão sem perda; a conversão de `DOUBLE` para `FLOAT` só pode ser feita de forma prejudicial. Uma conversão de `DECIMAL(M, D)` para `DECIMAL(M', D')` onde `D' >= D` e `(M'- D') >= (M- D)` é sem perda; para qualquer caso em que `M' < M`, `D' < D` ou ambos, só pode ser feita uma conversão prejudicial.

  Para qualquer um dos tipos decimais, se um valor a ser armazenado não puder caber no tipo alvo, o valor é arredondado para baixo de acordo com as regras de arredondamento definidas para o servidor em outro lugar na documentação. Consulte Seção 12.21.4, “Comportamento de Arredondamento” para obter informações sobre como isso é feito para os tipos decimais.

- Entre qualquer um dos tipos de strings `CHAR`, `VARCHAR` e `TEXT`, incluindo conversões entre diferentes larguras.

  A conversão de uma coluna `CHAR`, `VARCHAR` ou `TEXT` para uma coluna `CHAR`, `VARCHAR` ou `TEXT` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é realizada inserindo apenas os primeiros *`N`* caracteres da string na replica, onde *`N`* é a largura da coluna de destino.

  Importante

  A replicação entre colunas usando diferentes conjuntos de caracteres não é suportada.

- Entre qualquer um dos tipos de dados binários `BINARY`, `VARBINARY` e `BLOB`, incluindo conversões entre diferentes larguras.

  A conversão de uma coluna `BINARY`, `VARBINARY` ou `BLOB` para uma coluna `BINARY`, `VARBINARY` ou `BLOB` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é realizada inserindo apenas os primeiros *`N`* bytes da string na replica, onde *`N`* é a largura da coluna de destino.

- Entre quaisquer duas colunas de qualquer dois tamanhos.

  Ao inserir um valor de uma coluna `BIT(M)` em uma coluna `BIT(M')`, onde `M' > M`, os bits mais significativos das colunas `BIT(M')` são zerados (definidos como zero) e os `M` bits do valor `BIT(M)` são definidos como os bits menos significativos da coluna `BIT(M')`.

  Ao inserir um valor de uma coluna de origem `BIT(M)` em uma coluna de destino `BIT(M')`, onde `M' < M`, o valor máximo possível para a coluna `BIT(M')` é atribuído; em outras palavras, um valor de "conjunto completo" é atribuído à coluna de destino.

As conversões entre tipos que não estão na lista anterior não são permitidas.
