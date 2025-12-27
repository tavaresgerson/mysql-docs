#### 19.5.1.9 Replicação com Definições de Tabelas Diferentes na Fonte e na Replicação

As tabelas de origem e destino para a replicação não precisam ser idênticas. Uma tabela na fonte pode ter mais ou menos colunas do que a cópia da tabela da replica. Além disso, as colunas correspondentes das tabelas na fonte e na replica podem usar tipos de dados diferentes, sujeito a certas condições.

Nota

A replicação entre tabelas que são particionadas de maneira diferente uma da outra não é suportada. Consulte a Seção 19.5.1.25, “Replicação e Particionamento”.

Em todos os casos em que as tabelas de origem e destino não têm definições idênticas, os nomes do banco de dados e das tabelas devem ser os mesmos na fonte e na replica. Condições adicionais são discutidas, com exemplos, nas seções a seguir.

##### 19.5.1.9.1 Replicação com Mais Colunas na Fonte ou na Replicação

Você pode replicar uma tabela da fonte para a replica de forma que as cópias da tabela na fonte e na replica tenham números diferentes de colunas, sujeito às seguintes condições:

* As colunas comuns a ambas as versões da tabela devem ser definidas na mesma ordem na fonte e na replica. (Isso é verdadeiro mesmo que ambas as tabelas tenham o mesmo número de colunas.)

* As colunas comuns a ambas as versões da tabela devem ser definidas antes de quaisquer colunas adicionais.

Isso significa que executar uma declaração `ALTER TABLE` na replica onde uma nova coluna é inserida na tabela dentro do intervalo de colunas comuns a ambas as tabelas causa a falha da replicação, como mostrado no exemplo a seguir:

Suponha que uma tabela `t`, existente na fonte e na replica, seja definida pela seguinte declaração `CREATE TABLE`:

```
  CREATE TABLE t (
      c1 INT,
      c2 INT,
      c3 INT
  );
  ```

Suponha que a declaração `ALTER TABLE` mostrada aqui seja executada na replica:

```
  ALTER TABLE t ADD COLUMN cnew1 INT AFTER c3;
  ```

A alteração anterior no `ALTER TABLE` é permitida na replica porque as colunas `c1`, `c2` e `c3`, que são comuns às duas versões da tabela `t`, permanecem agrupadas em ambas as versões da tabela, antes de quaisquer colunas que diferem.

No entanto, a seguinte instrução `ALTER TABLE` não pode ser executada na replica sem causar a interrupção da replicação:

```
  ALTER TABLE t ADD COLUMN cnew2 INT AFTER c2;
  ```

A replicação falha após a execução da instrução `ALTER TABLE` mostrada anteriormente, porque a nova coluna `cnew2` vem entre as colunas comuns às duas versões de `t`.

* Cada coluna "extra" na versão da tabela com mais colunas deve ter um valor padrão.

O valor padrão de uma coluna é determinado por vários fatores, incluindo seu tipo, se é definido com uma opção `DEFAULT`, se é declarado como `NULL` e o modo SQL do servidor em vigor no momento de sua criação; para mais informações, consulte a Seção 13.6, "Valores padrão de tipo de dados").

Além disso, quando a cópia da replica da tabela tem mais colunas do que a cópia da fonte, cada coluna comum às tabelas deve usar o mesmo tipo de dados em ambas as tabelas.

**Exemplos.** Os seguintes exemplos ilustram algumas definições de tabela válidas e inválidas:

**Mais colunas na fonte.** As seguintes definições de tabela são válidas e replicam corretamente:

```
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

As seguintes definições de tabela causariam um erro porque as definições das colunas comuns às duas versões da tabela estão em uma ordem diferente na replica do que na fonte:

```
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT);
```

As seguintes definições de tabela também causariam um erro porque a definição da coluna extra na fonte aparece antes das definições das colunas comuns às duas versões da tabela:

```
source> CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

**Mais colunas na replica.** As seguintes definições de tabela são válidas e replicam corretamente:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

As seguintes definições geram um erro porque as colunas comuns às duas versões da tabela não são definidas na mesma ordem tanto na versão de origem quanto na replica:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT, c3 INT);
```

As seguintes definições de tabela também geram um erro porque a definição da coluna extra na versão da tabela da replica aparece antes das definições das colunas que são comuns às duas versões da tabela:

```
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
```

As seguintes definições de tabela falham porque a versão da tabela da replica tem colunas adicionais em comparação com a versão de origem, e as duas versões da tabela usam tipos de dados diferentes para a coluna comum `c2`:

```
source> CREATE TABLE t1 (c1 INT, c2 BIGINT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

##### 19.5.1.9.2 Replicação de Colunas com Tipos de Dados Diferentes

Colunas correspondentes nas cópias da fonte e da replica da mesma tabela idealmente devem ter o mesmo tipo de dado. No entanto, isso nem sempre é rigorosamente aplicado, desde que certas condições sejam atendidas.

Geralmente é possível replicar de uma coluna de um tipo de dado específico para outra coluna do mesmo tipo e do mesmo tamanho ou largura, quando aplicável, ou maior. Por exemplo, você pode replicar de uma coluna `CHAR(10)` para outra `CHAR(10)`, ou de uma coluna `CHAR(10)` para uma coluna `CHAR(25)` sem problemas. Em certos casos, também é possível replicar de uma coluna com um tipo de dado (na versão de origem) para uma coluna com um tipo de dado diferente (na replica); quando o tipo de dado da versão de origem da coluna é promovido para um tipo que tem o mesmo tamanho ou maior na replica, isso é conhecido como promoção de atributo.

A promoção de atributos pode ser usada tanto com replicação baseada em declarações quanto em linhas, e não depende do motor de armazenamento usado pelo fonte ou pela replica. No entanto, a escolha do formato de registro tem um efeito nas conversões de tipo permitidas; os detalhes são discutidos mais adiante nesta seção.

Importante

Se você usar replicação baseada em declarações ou em linhas, a cópia da tabela da replica não pode conter mais colunas do que a cópia do fonte, se você deseja empregar a promoção de atributos.

**Replicação baseada em declarações.** Ao usar replicação baseada em declarações, uma regra simples a seguir é: “Se a declaração executada no fonte também executar com sucesso na replica, ela também deve se replicar com sucesso”. Em outras palavras, se a declaração usar um valor que seja compatível com o tipo de uma coluna dada na replica, a declaração pode ser replicada. Por exemplo, você pode inserir qualquer valor que se encaixe em uma coluna `TINYINT` em uma coluna `BIGINT` também; segue-se que, mesmo que você mude o tipo de uma coluna `TINYINT` na cópia da replica de uma tabela para `BIGINT`, qualquer inserção nessa coluna no fonte que tenha sucesso também deve ter sucesso na replica, uma vez que é impossível ter um valor legal `TINYINT` que seja grande o suficiente para exceder uma coluna `BIGINT`.

**Replicação baseada em linhas: promoção e redução de atributos.** A replicação baseada em linhas suporta a promoção e redução de atributos entre tipos de dados menores e maiores. Também é possível especificar se é permitido ou não a conversão perdida (truncada) ou não perdida de valores de colunas reduzidas, conforme explicado mais adiante nesta seção.

**Conversões com perda e sem perda de dados.** No caso de o tipo de destino não conseguir representar o valor sendo inserido, deve-se tomar uma decisão sobre como lidar com a conversão. Se permitirmos a conversão, mas truncar (ou modificar de outra forma) o valor de origem para obter um "ajuste" na coluna de destino, realizamos o que é conhecido como conversão com perda de dados. Uma conversão que não requer truncação ou modificações semelhantes para ajustar o valor da coluna de origem na coluna de destino é uma conversão sem perda de dados.

**Modos de conversão de tipo.** O valor global da variável de sistema `replica_type_conversions` controla o modo de conversão de tipo usado na replica. Essa variável aceita um conjunto de valores da seguinte lista, que descreve os efeitos de cada modo no comportamento de conversão de tipo da replica:

ALL\_LOSSY:   Neste modo, as conversões de tipo que significariam perda de informações são permitidas.

Isso não implica que conversões sem perda de dados sejam permitidas, apenas que apenas casos que requerem conversões com perda de dados ou nenhuma conversão são permitidos; por exemplo, habilitar *apenas* este modo permite que uma coluna `INT` seja convertida para `TINYINT` (uma conversão com perda de dados), mas não uma coluna `TINYINT` para uma coluna `INT` (sem perda de dados). Tentar a conversão deste último caso causaria a parada da replicação com um erro na replica.

ALL\_NON\_LOSSY:   Este modo permite conversões que não requerem truncação ou outro tratamento especial do valor de origem; ou seja, permite conversões onde o tipo de destino tem uma faixa mais ampla que o tipo de origem.

Definir este modo não afeta se as conversões com perda de dados são permitidas; isso é controlado pelo modo `ALL_LOSSY`. Se apenas `ALL_NON_LOSSY` for definido, mas não `ALL_LOSSY`, então tentar uma conversão que resultaria na perda de dados (como `INT` para `TINYINT` ou `CHAR(25)` para `VARCHAR(20)`) faz com que a replica pare com um erro.

ALL\_LOSSY,ALL\_NON\_LOSSY:   Quando este modo é definido, todas as conversões de tipos suportadas são permitidas, independentemente de serem conversões com perda de dados.

ALL\_SIGNED:   Trate os tipos de inteiro promovidos como valores assinados (o comportamento padrão).

ALL\_UNSIGNED:   Trate os tipos de inteiro promovidos como valores não assinados.

ALL\_SIGNED,ALL\_UNSIGNED:   Trate os tipos de inteiro promovidos como assinados, se possível; caso contrário, como não assinados.

[*empty*]:   Quando `replica_type_conversions` não é definido, nenhuma promoção ou despromoção de atributos é permitida; isso significa que todas as colunas nas tabelas de origem e destino devem ter os mesmos tipos.

Este modo é o padrão.

Quando um tipo inteiro é promovido, sua assinatura não é preservada. Por padrão, a replica trata todos esses valores como assinados. Você pode controlar esse comportamento usando `ALL_SIGNED`, `ALL_UNSIGNED` ou ambos. `ALL_SIGNED` indica à replica que trate todos os tipos de inteiro promovidos como assinados; `ALL_UNSIGNED` instrui-a a tratá-los como não assinados. Especificar ambos faz com que a replica trate o valor como assinado, se possível, caso contrário, como não assinado; a ordem em que eles são listados não é significativa. Nem `ALL_SIGNED` nem `ALL_UNSIGNED` têm efeito se pelo menos um de `ALL_LOSSY` ou `ALL_NONLOSSY` não for usado também.

Alterar o modo de conversão de tipo requer reiniciar a replica com o novo conjunto de configurações `replica_type_conversions`.

**Conversões suportadas.** As conversões suportadas entre tipos de dados diferentes, mas semelhantes, estão listadas na seguinte tabela:

* Entre qualquer um dos tipos inteiros `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

Isso inclui conversões entre as versões assinaladas e não assinaladas desses tipos.

Conversões não-perdedoras são feitas truncando o valor fonte para o máximo (ou mínimo) permitido pelo campo de destino. Para garantir conversões não-perdedoras ao passar de tipos não assinalados para assinalados, o campo de destino deve ser grande o suficiente para acomodar a faixa de valores no campo fonte. Por exemplo, você pode degradar `TINYINT UNSIGNED` não-perdedoramente para `SMALLINT`, mas não para `TINYINT`.

* Entre qualquer um dos tipos decimais `DECIMAL` - DECIMAL, NUMERIC"), `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), e `NUMERIC` - DECIMAL, NUMERIC").

A conversão de `FLOAT` para `DOUBLE` é uma conversão não-perdedora; a conversão de `DOUBLE` para `FLOAT` só pode ser feita de forma perdedora. Uma conversão de `DECIMAL(M,D)` para `DECIMAL(M',D')` onde `D' >= D` e `(M'-D') >= (M-D')` é não-perdedora; para qualquer caso em que `M' < M`, `D' < D`, ou ambos, apenas uma conversão perdedora pode ser feita.

Para qualquer um dos tipos decimais, se um valor a ser armazenado não puder ser encaixado no tipo de destino, o valor é arredondado para baixo de acordo com as regras de arredondamento definidas para o servidor em outro lugar na documentação. Consulte a Seção 14.25.4, “Comportamento de Arredondamento”, para informações sobre como isso é feito para tipos decimais.

* Entre qualquer um dos tipos de string `CHAR`, `VARCHAR` e `TEXT`, incluindo conversões entre diferentes larguras.

  A conversão de uma coluna `CHAR`, `VARCHAR` ou `TEXT` para uma coluna `CHAR`, `VARCHAR` ou `TEXT` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é realizada inserindo apenas os primeiros *`N`* caracteres da string na replica, onde *`N`* é a largura da coluna de destino.

  Importante

  A replicação entre colunas usando diferentes conjuntos de caracteres não é suportada.

* Entre qualquer um dos tipos de dados binários `BINARY`, `VARBINARY` e `BLOB`, incluindo conversões entre diferentes larguras.

  A conversão de uma coluna `BINARY`, `VARBINARY` ou `BLOB` para uma coluna `BINARY`, `VARBINARY` ou `BLOB` do mesmo tamanho ou maior nunca é perda de dados. A conversão perda de dados é realizada inserindo apenas os primeiros *`N`* bytes da string na replica, onde *`N`* é a largura da coluna de destino.

* Entre qualquer 2 colunas `BIT` de qualquer 2 tamanhos.

  Ao inserir um valor de uma coluna `BIT(M)` em uma coluna `BIT(M')`, onde `M' > M`, os bits mais significativos das colunas `BIT(M')` são apagados (definidos como zero) e os *`M`* bits do valor `BIT(M)` são definidos como os bits menos significativos da coluna `BIT(M')`.

  Ao inserir um valor de uma coluna `BIT(M)` de origem em uma coluna `BIT(M')` de destino, onde `M' < M`, o valor máximo possível para a coluna `BIT(M')` é atribuído; em outras palavras, um valor "todos definidos" é atribuído à coluna de destino.

Conversões entre tipos não na lista anterior não são permitidas.