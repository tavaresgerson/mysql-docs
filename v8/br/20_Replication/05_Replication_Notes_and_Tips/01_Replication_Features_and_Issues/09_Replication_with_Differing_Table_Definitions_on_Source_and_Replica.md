#### 19.5.1.9 Replicação com definições de tabela diferentes na fonte e na réplica

As tabelas de origem e de destino para a replicação não precisam ser idênticas. Uma tabela na origem pode ter mais ou menos colunas do que a cópia da tabela da replica. Além disso, as colunas correspondentes das tabelas na origem e na replica podem usar tipos de dados diferentes, sujeito a certas condições.

Nota

A replicação entre tabelas que são particionadas de maneira diferente uma da outra não é suportada. Consulte a Seção 19.5.1.24, “Replicação e Particionamento”.

Em todos os casos em que as tabelas de origem e destino não tenham definições idênticas, os nomes do banco de dados e das tabelas devem ser os mesmos tanto na origem quanto na replica. Condições adicionais são discutidas, com exemplos, nas duas seções seguintes.

##### 19.5.1.9.1 Replicação com mais colunas na fonte ou réplica

Você pode replicar uma tabela da fonte para a replica de forma que as cópias da fonte e da replica da tabela tenham números diferentes de colunas, desde que as seguintes condições sejam atendidas:

- As colunas comuns às duas versões da tabela devem ser definidas na mesma ordem na fonte e na replica. (Isso vale mesmo que ambas as tabelas tenham o mesmo número de colunas.)

- As colunas comuns às duas versões da tabela devem ser definidas antes de quaisquer colunas adicionais.

  Isso significa que a execução de uma instrução `ALTER TABLE` na replica onde uma nova coluna é inserida na tabela dentro do intervalo de colunas comuns a ambas as tabelas faz com que a replicação falhe, conforme mostrado no exemplo a seguir:

  Suponha que uma tabela `t`, existente na fonte e na replica, seja definida pela seguinte declaração `CREATE TABLE`:

  ```
  CREATE TABLE t (
      c1 INT,
      c2 INT,
      c3 INT
  );
  ```

  Suponha que a declaração `ALTER TABLE` mostrada aqui seja executada na réplica:

  ```
  ALTER TABLE t ADD COLUMN cnew1 INT AFTER c3;
  ```

  O código anterior `ALTER TABLE` é permitido na replica porque as colunas `c1`, `c2` e `c3` que são comuns às duas versões da tabela `t` permanecem agrupadas juntas em ambas as versões da tabela, antes de quaisquer colunas que diferem.

  No entanto, a seguinte declaração `ALTER TABLE` não pode ser executada na réplica sem causar a interrupção da replicação:

  ```
  ALTER TABLE t ADD COLUMN cnew2 INT AFTER c2;
  ```

  A replicação falha após a execução na replica da declaração `ALTER TABLE` que acabou de ser exibida, porque a nova coluna `cnew2` vem entre as colunas comuns às duas versões de `t`.

- Cada coluna "extra" na versão da tabela com mais colunas deve ter um valor padrão.

  O valor padrão de uma coluna é determinado por vários fatores, incluindo seu tipo, se ela é definida com a opção `DEFAULT`, se é declarada como `NULL` e o modo SQL do servidor em vigor no momento de sua criação; para mais informações, consulte a Seção 13.6, “Valores padrão de tipo de dados”).

Além disso, quando a cópia da tabela da réplica tiver mais colunas do que a cópia da fonte, cada coluna comum às tabelas deve usar o mesmo tipo de dado em ambas as tabelas.

**Exemplos.** Os exemplos a seguir ilustram algumas definições de tabelas válidas e inválidas:

**Mais colunas na fonte.** As definições da tabela a seguir são válidas e replicadas corretamente:

```
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

As seguintes definições de tabelas gerariam um erro porque as definições das colunas comuns às duas versões da tabela estão em uma ordem diferente na replica do que na fonte:

```
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT);
```

As seguintes definições de tabelas também gerariam um erro, pois a definição da coluna extra na fonte aparece antes das definições das colunas comuns às duas versões da tabela:

```
source> CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

**Mais colunas na réplica.** As definições da tabela a seguir são válidas e replicam corretamente:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

As seguintes definições geram um erro porque as colunas comuns às duas versões da tabela não estão definidas na mesma ordem tanto na fonte quanto na replica:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT, c3 INT);
```

As seguintes definições de tabelas também geram um erro porque a definição da coluna extra na versão da tabela da replica aparece antes das definições das colunas que são comuns a ambas as versões da tabela:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
```

As seguintes definições de tabelas falham porque a versão da replica da tabela tem colunas adicionais em comparação com a versão da fonte, e as duas versões da tabela usam tipos de dados diferentes para a coluna comum `c2`:

```
source> CREATE TABLE t1 (c1 INT, c2 BIGINT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

##### 19.5.1.9.2 Replicação de Colunas com Diferentes Tipos de Dados

As colunas correspondentes nas cópias da mesma tabela do fonte e da réplica idealmente devem ter o mesmo tipo de dado. No entanto, isso nem sempre é rigorosamente aplicado, desde que certas condições sejam atendidas.

Geralmente é possível replicar de uma coluna de um determinado tipo de dados para outra coluna do mesmo tipo e tamanho ou largura, quando aplicável, ou maior. Por exemplo, você pode replicar de uma coluna `CHAR(10)` para outra `CHAR(10)`, ou de uma coluna `CHAR(10)` para uma coluna `CHAR(25)` sem problemas. Em certos casos, também é possível replicar de uma coluna com um tipo de dados (na versão da fonte) para uma coluna com um tipo de dados diferente (na replica); quando o tipo de dados da versão da fonte da coluna é promovido para um tipo que tenha o mesmo tamanho ou maior na replica, isso é conhecido como promoção de atributo.

A promoção de atributos pode ser usada tanto com replicação baseada em declarações quanto em linhas, e não depende do mecanismo de armazenamento usado pelo banco de dados fonte ou da replica. No entanto, a escolha do formato de registro tem um efeito sobre os tipos de conversão permitidos; os detalhes são discutidos mais adiante nesta seção.

Importante

Se você usar a replicação baseada em declarações ou baseada em linhas, a cópia da tabela da replica não pode conter mais colunas do que a cópia da fonte, se você deseja usar a promoção de atributos.

**Replicação baseada em instruções.** Ao usar a replicação baseada em instruções, uma regra prática a seguir é: “Se a instrução executada na fonte também for executada com sucesso na réplica, ela também deve ser replicada com sucesso”. Em outras palavras, se a instrução usar um valor compatível com o tipo de uma coluna específica na réplica, a instrução pode ser replicada. Por exemplo, você pode inserir qualquer valor que se encaixe em uma coluna `TINYINT` em uma coluna `BIGINT` também; segue-se que, mesmo que você mude o tipo de uma coluna `TINYINT` na cópia da tabela da réplica para `BIGINT`, qualquer inserção nessa coluna na fonte que seja bem-sucedida também deve ser bem-sucedida na réplica, uma vez que é impossível ter um valor legal `TINYINT` grande o suficiente para exceder uma coluna `BIGINT`.

**Replicação baseada em linhas: promoção e redução de atributos.** A replicação baseada em linhas suporta a promoção e redução de atributos entre tipos de dados menores e maiores. Também é possível especificar se permitir ou não conversões perdidas (truncadas) ou não perdidas de valores de colunas reduzidas, conforme explicado mais adiante nesta seção.

**Conversões sem perda e com perda.** No caso de o tipo de destino não conseguir representar o valor sendo inserido, é necessário tomar uma decisão sobre como lidar com a conversão. Se permitirmos a conversão, mas truncarmos (ou modificarmos de outra forma) o valor da fonte para obter um "ajuste" na coluna de destino, realizamos o que é conhecido como uma conversão com perda. Uma conversão que não requer truncação ou modificações semelhantes para ajustar o valor da coluna de origem na coluna de destino é uma conversão sem perda.

**Modos de conversão de tipos.** O valor global da variável de sistema `replica_type_conversions` (a partir do MySQL 8.0.26) ou `slave_type_conversions` (antes do MySQL 8.0.26) controla o modo de conversão de tipos usado na replica. Essa variável aceita um conjunto de valores da seguinte lista, que descreve os efeitos de cada modo no comportamento de conversão de tipos da replica:

ALL\_LOSSY: Nesse modo, as conversões de tipos que significam perda de informações são permitidas.

```
This does not imply that non-lossy conversions are permitted, merely that only cases requiring either lossy conversions or no conversion at all are permitted; for example, enabling *only* this mode permits an `INT` column to be converted to `TINYINT` (a lossy conversion), but not a `TINYINT` column to an `INT` column (non-lossy). Attempting the latter conversion in this case would cause replication to stop with an error on the replica.
```

ALL\_NON\_LOSSY: Este modo permite conversões que não exigem truncação ou outro tratamento especial do valor de origem; ou seja, permite conversões onde o tipo de destino tem uma faixa mais ampla do que o tipo de origem.

```
Setting this mode has no bearing on whether lossy conversions are permitted; this is controlled with the `ALL_LOSSY` mode. If only `ALL_NON_LOSSY` is set, but not `ALL_LOSSY`, then attempting a conversion that would result in the loss of data (such as `INT` to `TINYINT`, or `CHAR(25)` to `VARCHAR(20)`) causes the replica to stop with an error.
```

ALL\_LOSSY, ALL\_NON\_LOSSY: Quando este modo estiver definido, todas as conversões de tipos suportadas serão permitidas, independentemente de serem conversões sem perda ou com perda.

ALL\_SIGNED:   Trate os tipos inteiros promovidos como valores assinados (o comportamento padrão).

ALL\_UNSIGNED:   Trate os tipos inteiros promovidos como valores não assinados.

ALL\_SIGNED, ALL\_UNSIGNED: Trate os tipos inteiros promovidos como assinados, se possível, caso contrário, como não assinados.

\[*vazio*] : Quando `replica_type_conversions` ou `slave_type_conversions` não estiver definido, não é permitido promover ou demitir atributos; isso significa que todas as colunas das tabelas de origem e destino devem ter os mesmos tipos.

```
This mode is the default.
```

Quando um tipo inteiro é promovido, sua sinalização não é preservada. Por padrão, a replica trata todos esses valores como sinalizados. Você pode controlar esse comportamento usando `ALL_SIGNED`, `ALL_UNSIGNED` ou ambos. `ALL_SIGNED` indica à replica que trate todos os tipos inteiros promovidos como sinalizados; `ALL_UNSIGNED` instrui-a a tratá-los como não sinalizados. Especificar ambos faz com que a replica trate o valor como sinalizado, se possível, caso contrário, como não sinalizado; a ordem em que eles são listados não é significativa. Nem `ALL_SIGNED` nem `ALL_UNSIGNED` têm efeito se pelo menos um de `ALL_LOSSY` ou `ALL_NONLOSSY` não for usado também.

Para alterar o modo de conversão de tipo, é necessário reiniciar a replica com o novo ajuste `replica_type_conversions` ou `slave_type_conversions`.

**Conversões suportadas.** As conversões suportadas entre diferentes, mas semelhantes, tipos de dados estão listadas a seguir:

- Entre qualquer um dos tipos inteiros `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  Isso inclui conversões entre as versões assinadas e não assinadas desses tipos.

  As conversões sem perda são feitas truncando o valor fonte para o máximo (ou mínimo) permitido pelo tipo da coluna de destino. Para garantir conversões sem perda ao passar de tipos não assinados para assinados, a coluna de destino deve ser grande o suficiente para acomodar a faixa de valores na coluna de origem. Por exemplo, você pode degradar `TINYINT UNSIGNED` sem perda para `SMALLINT`, mas não para `TINYINT`.

- Entre qualquer um dos tipos decimais `DECIMAL` - DECIMAL, NUMERIC"), `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), e `NUMERIC` - DECIMAL, NUMERIC").

  A conversão de `FLOAT` a `DOUBLE` é uma conversão sem perda; a conversão de `DOUBLE` a `FLOAT` só pode ser feita com perda; uma conversão de `DECIMAL(M,D)` a `DECIMAL(M',D')` onde `D' >= D` e `(M'-D') >= (M-D`) é sem perda; para qualquer caso onde `M' < M`, `D' < D` ou ambos, só pode ser feita uma conversão com perda.

  Para qualquer um dos tipos decimais, se um valor a ser armazenado não puder caber no tipo alvo, o valor é arredondado para baixo de acordo com as regras de arredondamento definidas para o servidor em outro lugar na documentação. Consulte a Seção 14.24.4, “Comportamento de Arredondamento”, para obter informações sobre como isso é feito para os tipos decimais.

- Entre qualquer um dos tipos de cordas `CHAR`, `VARCHAR` e `TEXT`, incluindo conversões entre diferentes larguras.

  A conversão de uma coluna `CHAR`, `VARCHAR` ou `TEXT` para uma coluna `CHAR`, `VARCHAR` ou `TEXT` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é realizada inserindo apenas os primeiros `N` caracteres da string na replica, onde `N` é a largura da coluna de destino.

  Importante

  A replicação entre colunas usando diferentes conjuntos de caracteres não é suportada.

- Entre qualquer um dos tipos de dados binários `BINARY`, `VARBINARY` e `BLOB`, incluindo conversões entre diferentes larguras.

  A conversão de uma coluna `BINARY`, `VARBINARY` ou `BLOB` para uma coluna `BINARY`, `VARBINARY` ou `BLOB` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é realizada inserindo apenas os primeiros `N` bytes da string na replica, onde `N` é a largura da coluna de destino.

- Entre quaisquer 2 colunas `BIT` de quaisquer 2 tamanhos.

  Ao inserir um valor de uma coluna `BIT(M)` em uma coluna `BIT(M')`, onde `M' > M`, os bits mais significativos das colunas `BIT(M')` são zerados (definidos como zero) e os bits `M` do valor `BIT(M)` são definidos como os bits menos significativos da coluna `BIT(M')`.

  Ao inserir um valor de uma coluna de origem `BIT(M)` em uma coluna de destino `BIT(M')`, onde `M' < M`, o valor máximo possível para a coluna `BIT(M')` é atribuído; em outras palavras, um valor "tudo pronto" é atribuído à coluna de destino.

As conversões entre tipos que não estão na lista anterior não são permitidas.
