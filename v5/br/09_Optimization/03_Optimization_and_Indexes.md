## 8.3 Otimização e índices

A melhor maneira de melhorar o desempenho das operações do `SELECT` é criar índices em uma ou mais das colunas que são testadas na consulta. As entradas do índice atuam como ponteiros para as strings da tabela, permitindo que a consulta determine rapidamente quais strings correspondem a uma condição na cláusula do `WHERE`, e retorne os outros valores das colunas para essas strings. Todos os tipos de dados do MySQL podem ser indexados.

Embora possa ser tentador criar índices para cada coluna possível usada em uma consulta, índices desnecessários desperdiçam espaço e perdem tempo para o MySQL determinar quais índices usar. Os índices também aumentam o custo de inserções, atualizações e exclusões, pois cada índice deve ser atualizado. Você deve encontrar o equilíbrio certo para obter consultas rápidas usando o conjunto ótimo de índices.

### 8.3.1 Como o MySQL usa índices

Os índices são usados para encontrar strings com valores específicos de coluna rapidamente. Sem um índice, o MySQL deve começar com a primeira string e, em seguida, ler toda a tabela para encontrar as strings relevantes. Quanto maior a tabela, mais isso custa. Se a tabela tiver um índice para as colunas em questão, o MySQL pode determinar rapidamente a posição a ser procurada no meio do arquivo de dados sem ter que olhar para todos os dados. Isso é muito mais rápido do que ler todas as strings sequencialmente.

A maioria dos índices do MySQL (`PRIMARY KEY`, `UNIQUE`, `INDEX` e `FULLTEXT`) são armazenados em árvores B. Exceções: índices em tipos de dados espaciais usam árvores R; as tabelas `MEMORY` também suportam índices de hash; `InnoDB` usa listas invertidas para índices de `FULLTEXT`.

Em geral, os índices são usados conforme descrito na discussão a seguir. As características específicas dos índices de hash (como os usados nas tabelas `MEMORY` são descritos na Seção 8.3.8, “Comparação de índices B-Tree e índices de hash”.

O MySQL utiliza índices para essas operações:

* Para encontrar as strings que correspondem a uma cláusula `WHERE` rapidamente.

* Para eliminar strings da consideração. Se houver uma escolha entre vários índices, o MySQL normalmente usa o índice que encontra o menor número de strings (o índice mais seletivo).

* Se a tabela tiver um índice de múltiplas colunas, qualquer prefixo à esquerda do índice pode ser usado pelo otimizador para procurar strings. Por exemplo, se você tiver um índice de três colunas em `(col1, col2, col3)`, você terá capacidades de busca indexadas em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`. Para mais informações, consulte a Seção 8.3.5, “Indicações de Múltiplas Colunas”.

* Para recuperar strings de outras tabelas ao realizar junções. O MySQL pode usar índices em colunas de forma mais eficiente se eles forem declarados como o mesmo tipo e tamanho. Neste contexto, `VARCHAR` e `CHAR` são considerados iguais se forem declarados com o mesmo tamanho. Por exemplo, `VARCHAR(10)` e `CHAR(10)` têm o mesmo tamanho, mas `VARCHAR(10)` e `CHAR(15)`

Para comparações entre colunas de texto não binárias, ambas as colunas devem usar o mesmo conjunto de caracteres. Por exemplo, comparar uma coluna `utf8` com uma coluna `latin1` impede o uso de um índice.

A comparação de colunas diferentes (comparando uma coluna de texto com uma coluna temporal ou numérica, por exemplo) pode impedir o uso de índices, pois os valores não podem ser comparados diretamente sem conversão. Para um valor específico, como `1` na coluna numérica, pode ser comparado com qualquer número de valores na coluna de texto, como `'1'`, `' 1'`, `'00001'` ou `'01.e1'`. Isso exclui o uso de quaisquer índices para a coluna de texto.

* Para encontrar o valor `MIN()` ou `MAX()` para uma coluna indexada específica *`key_col`*. Isso é otimizado por um pré-processador que verifica se você está usando `WHERE key_part_N = constant` em todas as partes-chave que ocorrem antes de *`key_col`* no índice. Neste caso, o MySQL faz uma única busca de chave para cada expressão `MIN()` ou `MAX()` e a substitui por uma constante. Se todas as expressões forem substituídas por constantes, a consulta retorna de uma só vez. Por exemplo:

  ```sql
  SELECT MIN(key_part2),MAX(key_part2)
    FROM tbl_name WHERE key_part1=10;
  ```

* Para ordenar ou agrupar uma tabela se a ordenação ou agregação for feita em um prefixo à esquerda de um índice utilizável (por exemplo, `ORDER BY key_part1, key_part2`). Se todas as partes da chave forem seguidas por `DESC`, a chave é lida em ordem inversa. Veja Seção 8.2.1.14, “Otimização de ORDER BY”, e Seção 8.2.1.15, “Otimização de GROUP BY”.

* Em alguns casos, uma consulta pode ser otimizada para recuperar valores sem consultar as strings de dados. (Um índice que fornece todos os resultados necessários para uma consulta é chamado de índice coberto.) Se uma consulta usa apenas colunas de uma tabela que estão incluídas em algum índice, os valores selecionados podem ser recuperados da árvore de índice para maior velocidade:

  ```sql
  SELECT key_part3 FROM tbl_name
    WHERE key_part1=1
  ```

Os índices são menos importantes para consultas em tabelas pequenas ou grandes, onde as consultas de relatório processam a maioria ou todas as strings. Quando uma consulta precisa acessar a maioria das strings, a leitura sequencial é mais rápida do que trabalhar através de um índice. As leituras sequenciais minimizam os buscas no disco, mesmo que nem todas as strings sejam necessárias para a consulta. Veja a Seção 8.2.1.20, “Evitando varreduras completas da tabela”, para detalhes.

### 8.3.2 Otimização da Chave Primária

A chave primária de uma tabela representa a coluna ou conjunto de colunas que você usa em suas consultas mais importantes. Ela tem um índice associado, para desempenho de consulta rápida. O desempenho da consulta se beneficia da otimização do `NOT NULL`, porque não pode incluir quaisquer valores do `NULL`. Com o mecanismo de armazenamento `InnoDB`, os dados da tabela são organizados fisicamente para fazer buscas e ordenamentos ultra-rápidos com base na coluna ou colunas da chave primária.

Se a sua tabela for grande e importante, mas não tiver uma coluna ou um conjunto de colunas óbvias para usar como chave primária, você pode criar uma coluna separada com valores de auto-incremento para usar como chave primária. Esses IDs únicos podem servir como ponteiros para as strings correspondentes em outras tabelas quando você realiza uma junção de tabelas usando chaves estrangeiras.

### 8.3.3 Otimização da Chave Estrangeira

Se uma tabela tiver muitas colunas e você fizer consultas em muitas combinações diferentes de colunas, pode ser eficiente dividir os dados menos frequentemente usados em tabelas separadas com algumas colunas cada, e relacioná-las de volta à tabela principal, duplicando a coluna de ID numérica da tabela principal. Dessa forma, cada pequena tabela pode ter uma chave primária para buscas rápidas de seus dados, e você pode fazer consultas apenas no conjunto de colunas que você precisa, usando uma operação de junção. Dependendo de como os dados estão distribuídos, as consultas podem realizar menos I/O e ocupar menos memória de cache, porque as colunas relevantes estão compactadas juntas no disco. (Para maximizar o desempenho, as consultas tentam ler o menor número possível de blocos de dados do disco; tabelas com apenas algumas colunas podem caber mais strings em cada bloco de dados.)

### 8.3.4 Índices de coluna

O tipo mais comum de índice envolve uma única coluna, armazenando cópias dos valores dessa coluna em uma estrutura de dados, permitindo pesquisas rápidas para as strings com os valores correspondentes da coluna. A estrutura de dados B-tree permite que o índice encontre rapidamente um valor específico, um conjunto de valores ou uma faixa de valores, correspondendo a operadores como `=`, `>`, `≤`, `BETWEEN`, `IN`, e assim por diante, em uma cláusula `WHERE`.

O número máximo de índices por tabela e o comprimento máximo do índice são definidos por motor de armazenamento. Veja o Capítulo 14, *O motor de armazenamento InnoDB*, e o Capítulo 15, *Motores de armazenamento alternativos*. Todos os motores de armazenamento suportam pelo menos 16 índices por tabela e um comprimento total de índice de pelo menos 256 bytes. A maioria dos motores de armazenamento tem limites mais altos.

Para obter informações adicionais sobre índices de coluna, consulte a Seção 13.1.14, “Instrução CREATE INDEX”.

* Prefixos de índice
* Índices FULLTEXT
* Índices espaciais
* Índices no motor de armazenamento de MEMÓRIA

#### Prefixos do índice

Com a sintaxe `col_name(N)` em uma especificação de índice para uma coluna de texto, você pode criar um índice que use apenas os primeiros caracteres *`N`* da coluna. Indicar apenas um prefixo dos valores da coluna dessa maneira pode tornar o arquivo de índice muito menor. Quando você indexa uma coluna `BLOB` ou `TEXT`, você *deve* especificar um comprimento de prefixo para o índice. Por exemplo:

```sql
CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
```

Os prefixos podem ter até 1000 bytes de comprimento (767 bytes para as tabelas `InnoDB`, a menos que você tenha `innodb_large_prefix` definido).

Nota

Os limites de prefixo são medidos em bytes, enquanto o comprimento do prefixo nas declarações de `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` é interpretado como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tome isso em consideração ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

Se um termo de busca exceder o comprimento do prefixo do índice, o índice é usado para excluir as strings que não correspondem, e as strings restantes são examinadas quanto a possíveis correspondências.

Para informações adicionais sobre prefixos de índice, consulte a Seção 13.1.14, “Instrução CREATE INDEX”.

#### Índices FULLTEXT

Os índices `FULLTEXT` são usados para pesquisas de texto completo. Apenas os motores de armazenamento `InnoDB` e `MyISAM` suportam índices `FULLTEXT` e apenas para as colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna e a indexação de prefixo de coluna não é suportada. Para detalhes, consulte a Seção 12.9, “Funções de Pesquisa de Texto Completo”.

As otimizações são aplicadas a certos tipos de consultas `FULLTEXT` contra tabelas únicas `InnoDB`. As consultas com essas características são particularmente eficientes:

* `FULLTEXT` consultas que retornam apenas o ID do documento, ou o ID do documento e o ranking de pesquisa.

* `FULLTEXT` solicita que as strings correspondentes sejam ordenadas em ordem decrescente de pontuação e aplique uma cláusula `LIMIT` para obter as N primeiras strings correspondentes. Para que essa otimização seja aplicada, não deve haver cláusulas `WHERE` e apenas uma única cláusula `ORDER BY` em ordem decrescente.

* `FULLTEXT` consultas que recuperam apenas o valor `COUNT(*)` das strings que correspondem a um termo de pesquisa, sem cláusulas adicionais de `WHERE`. O código da cláusula `WHERE` como `WHERE MATCH(text) AGAINST ('other_text')`, sem qualquer operador de comparação `> 0`.

Para consultas que contêm expressões de texto completo, o MySQL avalia essas expressões durante a fase de otimização da execução da consulta. O otimizador não apenas analisa expressões de texto completo e faz estimativas, ele as avalia na verdade no processo de desenvolvimento de um plano de execução.

Uma implicação desse comportamento é que `EXPLAIN` para consultas de texto completo é, tipicamente, mais lenta do que para consultas sem texto completo, nas quais nenhuma avaliação de expressão ocorre durante a fase de otimização.

Para consultas de texto completo, o `EXPLAIN` pode exibir `Select tables optimized away` na coluna `Extra` devido à correspondência que ocorre durante a otimização; nesse caso, não é necessário que haja acesso à tabela durante a execução posterior.

#### Índices Espaciais

Você pode criar índices em tipos de dados espaciais. `MyISAM` e `InnoDB` suportam índices de árvore R em tipos espaciais. Outros motores de armazenamento usam árvores B para indexação de tipos espaciais (exceto `ARCHIVE`, que não suporta indexação de tipos espaciais).

#### Índices no Motor de Armazenamento de MEMÓRIA

O motor de armazenamento `MEMORY` usa índices `HASH` por padrão, mas também suporta índices `BTREE`.

### 8.3.5 Índices de múltiplos colunas

O MySQL pode criar índices compostos (ou seja, índices em múltiplos colunas). Um índice pode consistir em até 16 colunas. Para certos tipos de dados, você pode indexar um prefixo da coluna (consulte Seção 8.3.4, “Índices de coluna”).

O MySQL pode usar índices de múltiplos colunas para consultas que testam todas as colunas do índice, ou consultas que testam apenas a primeira coluna, as primeiras duas colunas, as primeiras três colunas, e assim por diante. Se você especificar as colunas na ordem correta na definição do índice, um único índice composto pode acelerar vários tipos de consultas na mesma tabela.

Um índice de múltiplos colunas pode ser considerado um array ordenado, cujas strings contêm valores que são criados concatenando os valores das colunas indexadas.

Nota

Como alternativa a um índice composto, você pode introduzir uma coluna que seja "hashada" com base em informações de outras colunas. Se essa coluna for curta, razoavelmente única e indexada, ela pode ser mais rápida do que um índice "amplo" em muitas colunas. No MySQL, é muito fácil usar essa coluna extra:

```sql
SELECT * FROM tbl_name
  WHERE hash_col=MD5(CONCAT(val1,val2))
  AND col1=val1 AND col2=val2;
```

Suponha que uma tabela tenha as seguintes especificações:

```sql
CREATE TABLE test (
    id         INT NOT NULL,
    last_name  CHAR(30) NOT NULL,
    first_name CHAR(30) NOT NULL,
    PRIMARY KEY (id),
    INDEX name (last_name,first_name)
);
```

O índice `name` é um índice sobre as colunas `last_name` e `first_name`. O índice pode ser usado para consultas que especificam valores em um intervalo conhecido para combinações de valores de `last_name` e `first_name`. Também pode ser usado para consultas que especificam apenas um valor de `last_name`, porque essa coluna é um prefixo da esquerda do índice (como descrito mais adiante nesta seção). Portanto, o índice `name` é usado para consultas nas seguintes consultas:

```sql
SELECT * FROM test WHERE last_name='Jones';

SELECT * FROM test
  WHERE last_name='Jones' AND first_name='John';

SELECT * FROM test
  WHERE last_name='Jones'
  AND (first_name='John' OR first_name='Jon');

SELECT * FROM test
  WHERE last_name='Jones'
  AND first_name >='M' AND first_name < 'N';
```

No entanto, o índice `name` *não* é utilizado em consultas nos seguintes casos:

```sql
SELECT * FROM test WHERE first_name='John';

SELECT * FROM test
  WHERE last_name='Jones' OR first_name='John';
```

Suponha que você emita a seguinte declaração `SELECT`:

```sql
SELECT * FROM tbl_name
  WHERE col1=val1 AND col2=val2;
```

Se um índice de múltiplas colunas existir em `col1` e `col2`, as strings apropriadas podem ser obtidas diretamente. Se índices separados de uma única coluna existirem em `col1` e `col2`, o otimizador tenta usar a otimização de junção de índices (ver Seção 8.2.1.3, “Otimização de Junção de Índices”), ou tenta encontrar o índice mais restritivo, decidindo qual índice exclui mais strings e usando esse índice para obter as strings.

Se a tabela tiver um índice de múltiplas colunas, qualquer prefixo à esquerda do índice pode ser usado pelo otimizador para procurar strings. Por exemplo, se você tiver um índice de três colunas em `(col1, col2, col3)`, você terá capacidades de busca indexadas em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`.

O MySQL não pode usar o índice para realizar pesquisas se as colunas não formarem um prefixo à esquerda do índice. Suponha que você tenha as declarações `SELECT` mostradas aqui:

```sql
SELECT * FROM tbl_name WHERE col1=val1;
SELECT * FROM tbl_name WHERE col1=val1 AND col2=val2;

SELECT * FROM tbl_name WHERE col2=val2;
SELECT * FROM tbl_name WHERE col2=val2 AND col3=val3;
```

Se um índice existir em `(col1, col2, col3)`, apenas as duas primeiras consultas utilizam o índice. As terceira e quarta consultas envolvem colunas indexadas, mas não utilizam um índice para realizar consultas porque `(col2)` e `(col2, col3)` não são prefixos mais à esquerda de `(col1, col2, col3)`.

### 8.3.6 Verificação do uso do índice

Sempre verifique se todas as suas consultas realmente utilizam os índices que você criou nas tabelas. Use a declaração `EXPLAIN`, conforme descrito na Seção 8.8.1, “Otimizando consultas com EXPLAIN”.

### 8.3.7 Coleta de estatísticas de índices InnoDB e MyISAM

Os motores de armazenamento coletam estatísticas sobre as tabelas para uso pelo otimizador. As estatísticas da tabela são baseadas em grupos de valores, onde um grupo de valores é um conjunto de strings com o mesmo valor de prefixo de chave. Para fins de otimizador, uma estatística importante é o tamanho médio do grupo de valores.

O MySQL utiliza o tamanho médio do grupo de valores das seguintes maneiras:

* Para estimar quantas strings devem ser lidas para cada acesso ao `ref`

* Para estimar quantas strings uma junção parcial produz; ou seja, o número de strings que uma operação desse tipo produz:

  ```sql
  (...) JOIN tbl_name ON tbl_name.key = expr
  ```

À medida que o tamanho médio do grupo de valores para um índice aumenta, o índice é menos útil para esses dois propósitos, porque o número médio de strings por busca aumenta: para que o índice seja útil para fins de otimização, é melhor que cada valor do índice atenda a um pequeno número de strings na tabela. Quando um determinado valor do índice gera um grande número de strings, o índice é menos útil e é menos provável que o MySQL o use.

O tamanho médio do grupo de valores está relacionado à cardinalidade da tabela, que é o número de grupos de valores. A declaração `SHOW INDEX` exibe um valor de cardinalidade com base em *`N/S`*, onde *`N`* é o número de strings na tabela e *`S`* é o tamanho médio do grupo de valores. Essa proporção fornece um número aproximado de grupos de valores na tabela.

Para uma junção baseada no operador de comparação `<=>`, `NULL` não é tratado de forma diferente de qualquer outro valor: `NULL <=> NULL`, assim como `N <=> N` para qualquer outro *`N`*.

No entanto, para uma junção baseada no operador `=`, `NULL` é diferente dos valores não `NULL`: `expr1 = expr2` não é verdadeiro quando *`expr1`* ou *`expr2`* (ou ambos) são `NULL`. Isso afeta os acessos de `ref` para comparações da forma `tbl_name.key = expr`: o MySQL não acessa a tabela se o valor atual de *`expr`* for `NULL`, porque a comparação não pode ser verdadeira.

Para as comparações de `=`, não importa quantos valores de `NULL` estejam na tabela. Para fins de otimização, o valor relevante é o tamanho médio dos grupos de valores que não são `NULL`. No entanto, o MySQL atualmente não permite que esse tamanho médio seja coletado ou usado.

Para as tabelas `InnoDB` e `MyISAM`, você tem algum controle sobre a coleta de estatísticas da tabela por meio das variáveis de sistema `innodb_stats_method` e `myisam_stats_method`, respectivamente. Essas variáveis têm três valores possíveis, que diferem da seguinte forma:

* Quando a variável está definida como `nulls_equal`, todos os valores de `NULL` são tratados como idênticos (ou seja, todos eles formam um único grupo de valores).

Se o grupo de tamanho do valor `NULL` for muito maior que o tamanho médio do grupo de valores não `NULL`, esse método desvia o tamanho médio do grupo de valores para cima. Isso faz com que o índice pareça para o otimizador ser menos útil do que realmente é para junções que procuram valores não `NULL`. Consequentemente, o método `nulls_equal` pode fazer com que o otimizador não use o índice para acessos `ref` quando deveria.

* Quando a variável está definida como `nulls_unequal`, os valores de `NULL` não são considerados iguais. Em vez disso, cada valor de `NULL` forma um grupo de valores separado com tamanho 1.

Se você tiver muitos valores de `NULL`, esse método desvia o tamanho médio do grupo de valores para baixo. Se o tamanho médio do grupo de valores que não são `NULL` for grande, contar os valores de `NULL` como um grupo de tamanho 1 faz com que o otimizador sobreestime o valor do índice para junções que buscam valores que não são `NULL`. Consequentemente, o método `nulls_unequal` pode fazer com que o otimizador use esse índice para pesquisas de `ref`, quando outros métodos podem ser melhores.

* Quando a variável está definida como `nulls_ignored`, os valores de `NULL` são ignorados.

Se você tende a usar muitas junções que utilizam `<=>` em vez de `=`, os valores de `NULL` não são especiais em comparações e um `NULL` é igual a outro. Neste caso, `nulls_equal` é o método estatístico apropriado.

A variável de sistema `innodb_stats_method` tem um valor global; a variável de sistema `myisam_stats_method` tem valores globais e de sessão. Definir o valor global afeta a coleta de estatísticas para tabelas do motor de armazenamento correspondente. Definir o valor de sessão afeta apenas a coleta de estatísticas para a conexão atual do cliente. Isso significa que você pode forçar a regeneração das estatísticas de uma tabela com um método específico sem afetar outros clientes, definindo o valor de sessão de `myisam_stats_method`.

Para regenerar as estatísticas da tabela `MyISAM`, você pode usar qualquer um dos seguintes métodos:

* Execute **myisamchk --stats_method=*`method_name`* --analyze**

* Altere a tabela para fazer com que suas estatísticas deixem de ser atualizadas (por exemplo, insira uma string e depois exclua-a), e, em seguida, defina `myisam_stats_method` e emita uma declaração `ANALYZE TABLE`

Algumas ressalvas sobre o uso de `innodb_stats_method` e `myisam_stats_method`:

* Você pode forçar a coleta explícita de estatísticas de tabela, como descrito acima. No entanto, o MySQL também pode coletar estatísticas automaticamente. Por exemplo, se, durante a execução de instruções para uma tabela, algumas dessas instruções modificarem a tabela, o MySQL pode coletar estatísticas. (Isso pode ocorrer em inserções ou exclusões em massa ou em algumas instruções `ALTER TABLE`, por exemplo.) Se isso acontecer, as estatísticas são coletadas usando qualquer valor que `innodb_stats_method` ou `myisam_stats_method` tenha naquela época. Assim, se você coletar estatísticas usando um método, mas a variável do sistema estiver definida para o outro método quando as estatísticas de uma tabela são coletadas automaticamente posteriormente, o outro método é usado.

* Não é possível determinar qual método foi usado para gerar estatísticas para uma tabela específica.

* Essas variáveis se aplicam apenas às tabelas `InnoDB` e `MyISAM`. Outros motores de armazenamento têm apenas um método para coletar estatísticas de tabela. Geralmente, está mais próximo do método `nulls_equal`.

### 8.3.8 Comparação de índices B-Tree e Hash

Entender as estruturas de dados B-tree e hash pode ajudar a prever como diferentes consultas se comportam em diferentes motores de armazenamento que utilizam essas estruturas de dados em seus índices, especialmente para o motor de armazenamento `MEMORY`, que permite que você escolha índices B-tree ou hash.

* Características do índice de árvore B
* Características do índice de hash

#### Características do índice B-Tree

Um índice de árvore B pode ser usado para comparações de coluna em expressões que utilizam os operadores `=`, `>`, `>=`, `<`, `<=` ou `BETWEEN`. O índice também pode ser usado para comparações de `LIKE`, se o argumento de `LIKE` for uma string constante que não comece com um caractere de comodinho. Por exemplo, as seguintes declarações de `SELECT` utilizam índices:

```sql
SELECT * FROM tbl_name WHERE key_col LIKE 'Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE 'Pat%_ck%';
```

Na primeira declaração, apenas as strings com `'Patrick' <= key_col < 'Patricl'` são consideradas. Na segunda declaração, apenas as strings com `'Pat' <= key_col < 'Pau'` são consideradas.

As seguintes declarações `SELECT` não utilizam índices:

```sql
SELECT * FROM tbl_name WHERE key_col LIKE '%Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE other_col;
```

Na primeira declaração, o valor `LIKE` começa com um caractere de sinal de interrogação. Na segunda declaração, o valor `LIKE` não é uma constante.

Se você usar `... LIKE '%string%'` e *`string`* tiver mais de três caracteres, o MySQL usa o algoritmo Turbo Boyer-Moore para inicializar o padrão da string e, em seguida, usa esse padrão para realizar a pesquisa de forma mais rápida.

Uma pesquisa usando `col_name IS NULL` utiliza índices se *`col_name`* estiver indexado.

Qualquer índice que não abranja todos os níveis de `AND` na cláusula `WHERE` não é usado para otimizar a consulta. Em outras palavras, para poder usar um índice, um prefixo do índice deve ser usado em cada grupo de `AND`.

As seguintes cláusulas `WHERE` utilizam índices:

```sql
... WHERE index_part1=1 AND index_part2=2 AND other_column=3

    /* index = 1 OR index = 2 */
... WHERE index=1 OR A=10 AND index=2

    /* optimized like "index_part1='hello'" */
... WHERE index_part1='hello' AND index_part3=5

    /* Can use index on index1 but not on index2 or index3 */
... WHERE index1=1 AND index2=2 OR index1=3 AND index3=3;
```

Essas cláusulas `WHERE` *não* usam índices:

```sql
    /* index_part1 is not used */
... WHERE index_part2=1 AND index_part3=2

    /*  Index is not used in both parts of the WHERE clause  */
... WHERE index=1 OR A=10

    /* No index spans all rows  */
... WHERE index_part1=1 OR index_part2=10
```

Às vezes, o MySQL não usa um índice, mesmo que um esteja disponível. Uma circunstância em que isso ocorre é quando o otimizador estima que o uso do índice exigiria que o MySQL acessasse uma porcentagem muito grande das strings da tabela. (Neste caso, uma varredura da tabela provavelmente será muito mais rápida, pois requer menos buscas.) No entanto, se tal consulta usa `LIMIT` para recuperar apenas algumas das strings, o MySQL usa um índice de qualquer forma, porque pode encontrar muito mais rapidamente as poucas strings a serem devolvidas no resultado.

#### Características do Índice de Hash

Os índices de hash têm características um pouco diferentes das que foram discutidas anteriormente:

* Eles são usados apenas para comparações de igualdade que utilizam os operadores `=` ou `<=>` (mas são *muito* rápidos). Eles não são usados para operadores de comparação, como `<` que encontram uma faixa de valores. Os sistemas que dependem desse tipo de busca de um único valor são conhecidos como "armazenamento de chave-valor"; para usar o MySQL para tais aplicações, use índices hash sempre que possível.

* O otimizador não pode usar um índice de hash para acelerar as operações de `ORDER BY`. (Esse tipo de índice não pode ser usado para procurar a próxima entrada na ordem.)

* O MySQL não pode determinar aproximadamente quantas strings existem entre dois valores (isso é usado pelo otimizador de intervalo para decidir qual índice usar). Isso pode afetar algumas consultas se você alterar uma tabela `MyISAM` ou `InnoDB` para uma tabela indexada por hash `MEMORY`.

* Apenas chaves inteiras podem ser usadas para pesquisar uma string. (Com um índice de árvore B, qualquer prefixo mais à esquerda da chave pode ser usado para encontrar strings.)

### 8.3.9 Uso de extensões de índice

`InnoDB` estende automaticamente cada índice secundário, anexando as colunas da chave primária. Considere esta definição de tabela:

```sql
CREATE TABLE t1 (
  i1 INT NOT NULL DEFAULT 0,
  i2 INT NOT NULL DEFAULT 0,
  d DATE DEFAULT NULL,
  PRIMARY KEY (i1, i2),
  INDEX k_d (d)
) ENGINE = InnoDB;
```

Esta tabela define a chave primária nas colunas `(i1, i2)`. Também define um índice secundário `k_d` na coluna `(d)`, mas internamente `InnoDB` estende este índice e o trata como colunas `(d, i1, i2)`.

O otimizador leva em consideração as colunas da chave primária do índice secundário estendido ao determinar como e se usar esse índice. Isso pode resultar em planos de execução de consulta mais eficientes e melhor desempenho.

O otimizador pode usar índices secundários extensos para o acesso ao índice `ref`, `range` e `index_merge`, para acesso ao varredura de índice solto, para otimização de junção e ordenação, e para otimização de `MIN()`/`MAX()`.

O exemplo a seguir mostra como os planos de execução são afetados pelo fato de o otimizador usar índices secundários extensos. Suponha que `t1` esteja preenchido com essas strings:

```sql
INSERT INTO t1 VALUES
(1, 1, '1998-01-01'), (1, 2, '1999-01-01'),
(1, 3, '2000-01-01'), (1, 4, '2001-01-01'),
(1, 5, '2002-01-01'), (2, 1, '1998-01-01'),
(2, 2, '1999-01-01'), (2, 3, '2000-01-01'),
(2, 4, '2001-01-01'), (2, 5, '2002-01-01'),
(3, 1, '1998-01-01'), (3, 2, '1999-01-01'),
(3, 3, '2000-01-01'), (3, 4, '2001-01-01'),
(3, 5, '2002-01-01'), (4, 1, '1998-01-01'),
(4, 2, '1999-01-01'), (4, 3, '2000-01-01'),
(4, 4, '2001-01-01'), (4, 5, '2002-01-01'),
(5, 1, '1998-01-01'), (5, 2, '1999-01-01'),
(5, 3, '2000-01-01'), (5, 4, '2001-01-01'),
(5, 5, '2002-01-01');
```

Agora, considere esta consulta:

```sql
EXPLAIN SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01'
```

O plano de execução depende de se o índice estendido for utilizado.

Quando o otimizador não considera extensões de índice, ele trata o índice `k_d` como apenas `(d)`. Para a consulta, o índice `EXPLAIN` produz este resultado:

```sql
mysql> EXPLAIN SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ref
possible_keys: PRIMARY,k_d
          key: k_d
      key_len: 4
          ref: const
         rows: 5
        Extra: Using where; Using index
```

Quando o otimizador leva em consideração as extensões de índice, ele trata `k_d` como `(d, i1, i2)`. Neste caso, ele pode usar o prefixo de índice mais à esquerda `(d, i1)` para produzir um plano de execução melhor:

```sql
mysql> EXPLAIN SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ref
possible_keys: PRIMARY,k_d
          key: k_d
      key_len: 8
          ref: const,const
         rows: 1
        Extra: Using index
```

Em ambos os casos, `key` indica que o otimizador utiliza o índice secundário `k_d`, mas a saída do `EXPLAIN` mostra essas melhorias ao usar o índice estendido:

* `key_len` passa de 4 bytes para 8 bytes, indicando que as pesquisas de chave utilizam as colunas `d` e `i1`, e não apenas `d`.

* O valor `ref` muda de `const` para `const,const`, porque a pesquisa de chave usa duas partes de chave, não uma.

* O contagem `rows` diminui de 5 para 1, indicando que `InnoDB` deve precisar examinar menos strings para produzir o resultado.

* O valor `Extra` muda de `Using where; Using index` para `Using index`. Isso significa que as strings podem ser lidas usando apenas o índice, sem consultar as colunas na string de dados.

Diferenças no comportamento do otimizador para o uso de índices extensos também podem ser observadas com `SHOW STATUS`:

```sql
FLUSH TABLE t1;
FLUSH STATUS;
SELECT COUNT(*) FROM t1 WHERE i1 = 3 AND d = '2000-01-01';
SHOW STATUS LIKE 'handler_read%'
```

As declarações anteriores incluem `FLUSH TABLES` e `FLUSH STATUS` para limpar o cache da tabela e limpar os contadores de status.

Sem extensões de índice, `SHOW STATUS` produz este resultado:

```sql
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 0     |
| Handler_read_key      | 1     |
| Handler_read_last     | 0     |
| Handler_read_next     | 5     |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 0     |
| Handler_read_rnd_next | 0     |
+-----------------------+-------+
```

Com extensões de índice, `SHOW STATUS` produz esse resultado. O valor `Handler_read_next` diminui de 5 para 1, indicando um uso mais eficiente do índice:

```sql
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 0     |
| Handler_read_key      | 1     |
| Handler_read_last     | 0     |
| Handler_read_next     | 1     |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 0     |
| Handler_read_rnd_next | 0     |
+-----------------------+-------+
```

A bandeira `use_index_extensions` da variável de sistema `optimizer_switch` permite controlar se o otimizador leva em consideração as colunas da chave primária ao determinar como usar os índices secundários de uma tabela `InnoDB`. Por padrão, `use_index_extensions` está habilitado. Para verificar se a desabilitação do uso de extensões de índice melhora o desempenho, use esta declaração:

```sql
SET optimizer_switch = 'use_index_extensions=off';
```

O uso de extensões de índice pelo otimizador está sujeito aos limites habituais sobre o número de partes de chave em um índice (16) e o comprimento máximo da chave (3072 bytes).

### 8.3.10 Otimizador Uso de Índices de Coluna Gerados

O MySQL suporta índices em colunas geradas. Por exemplo:

```sql
CREATE TABLE t1 (f1 INT, gc INT AS (f1 + 1) STORED, INDEX (gc));
```

A coluna gerada, `gc`, é definida como a expressão `f1 + 1`. A coluna também é indexada e o otimizador pode levar esse índice em consideração durante a construção do plano de execução. Na seguinte consulta, a cláusula `WHERE` refere-se a `gc` e o otimizador considera se o índice naquela coluna produz um plano mais eficiente:

```sql
SELECT * FROM t1 WHERE gc > 9;
```

O otimizador pode usar índices em colunas geradas para gerar planos de execução, mesmo na ausência de referências diretas em consultas a essas colunas pelo nome. Isso ocorre se a cláusula `WHERE`, `ORDER BY` ou `GROUP BY` se referir a uma expressão que corresponde à definição de alguma coluna gerada indexada. A consulta a seguir não se refere diretamente a `gc`, mas usa uma expressão que corresponde à definição de `gc`:

```sql
SELECT * FROM t1 WHERE f1 + 1 > 9;
```

O otimizador reconhece que a expressão `f1 + 1` corresponde à definição de `gc` e que `gc` está indexado, portanto, considera esse índice durante a construção do plano de execução. Você pode ver isso usando `EXPLAIN`:

```sql
mysql> EXPLAIN SELECT * FROM t1 WHERE f1 + 1 > 9\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
   partitions: NULL
         type: range
possible_keys: gc
          key: gc
      key_len: 5
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: Using index condition
```

Na verdade, o otimizador substituiu a expressão `f1

+ 1` with the name of the generated column that matches the expression. That is also apparent in the rewritten query available in the extended `EXPLAIN` information displayed by `SHOW WARNINGS`:

```sql
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select `test`.`t1`.`f1` AS `f1`,`test`.`t1`.`gc`
         AS `gc` from `test`.`t1` where (`test`.`t1`.`gc` > 9)
```

As seguintes restrições e condições se aplicam ao uso de índices de coluna gerados pelo otimizador:

* Para que uma expressão de consulta corresponda a uma definição de coluna gerada, a expressão deve ser idêntica e deve ter o mesmo tipo de resultado. Por exemplo, se a expressão de coluna gerada for `f1 + 1`, o otimizador não reconhece uma correspondência se a consulta usar `1 + f1`, ou se `f1 + 1` (uma expressão numérica) for comparada com uma string.

* A otimização se aplica a estes operadores: `=`, `<`, `<=`, `>`, `>=`, `BETWEEN` e `IN()`.

Para operadores que não são `BETWEEN` e `IN()`, qualquer dos operandos pode ser substituído por uma coluna gerada correspondente. Para `BETWEEN` e `IN()`, apenas o primeiro argumento pode ser substituído por uma coluna gerada correspondente, e os outros argumentos devem ter o mesmo tipo de resultado. `BETWEEN` e `IN()` ainda não são suportados para comparações envolvendo valores JSON.

* A coluna gerada deve ser definida como uma expressão que contenha pelo menos uma chamada de função ou um dos operadores mencionados no item anterior. A expressão não pode consistir em uma simples referência a outra coluna. Por exemplo, `gc INT AS (f1) STORED` consiste apenas em uma referência de coluna, portanto, índices em `gc` não são considerados.

* Para comparações de cadeias com colunas indexadas geradas que calculam um valor a partir de uma função JSON que retorna uma cadeia citada, é necessário `JSON_UNQUOTE()` na definição da coluna para remover as citações extras do valor da função. (Para comparação direta de uma cadeia com o resultado da função, o comparador JSON remove as citações, mas isso não ocorre para pesquisas de índice. Por exemplo, em vez de escrever uma definição de coluna assim:

  ```sql
  doc_name TEXT AS (JSON_EXTRACT(jdoc, '$.name')) STORED
  ```

Escreva assim:

  ```sql
  doc_name TEXT AS (JSON_UNQUOTE(JSON_EXTRACT(jdoc, '$.name'))) STORED
  ```

Com a última definição, o otimizador pode detectar uma correspondência para ambas as comparações:

  ```sql
  ... WHERE JSON_EXTRACT(jdoc, '$.name') = 'some_string' ...
  ... WHERE JSON_UNQUOTE(JSON_EXTRACT(jdoc, '$.name')) = 'some_string' ...
  ```

Sem `JSON_UNQUOTE()` na definição da coluna, o otimizador detecta uma correspondência apenas para a primeira dessas comparações.

* Se o otimizador não conseguir escolher o índice desejado, uma dica de índice pode ser usada para forçar o otimizador a fazer uma escolha diferente.

### 8.3.11 Busca indexada a partir de colunas TIMESTAMP

Os valores temporais são armazenados nas colunas `TIMESTAMP` como valores em UTC, e os valores inseridos e recuperados nas colunas `TIMESTAMP` são convertidos entre o fuso horário da sessão e o UTC. (Este é o mesmo tipo de conversão realizada pela função `CONVERT_TZ()`. Se o fuso horário da sessão for UTC, não há efetivamente nenhuma conversão de fuso horário.)

Devido às convenções para mudanças de fuso horário local, como o Horário de Verão (DST), as conversões entre UTC e fusos horários não-UTC não são um para um em ambas as direções. Valores UTC distintos podem não ser distintos em outro fuso horário. O exemplo a seguir mostra valores UTC distintos que se tornam idênticos em um fuso horário não-UTC:

```sql
mysql> CREATE TABLE tstable (ts TIMESTAMP);
mysql> SET time_zone = 'UTC'; -- insert UTC values
mysql> INSERT INTO tstable VALUES
       ('2018-10-28 00:30:00'),
       ('2018-10-28 01:30:00');
mysql> SELECT ts FROM tstable;
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 00:30:00 |
| 2018-10-28 01:30:00 |
+---------------------+
mysql> SET time_zone = 'MET'; -- retrieve non-UTC values
mysql> SELECT ts FROM tstable;
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 02:30:00 |
| 2018-10-28 02:30:00 |
+---------------------+
```

Nota

Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fuso horário devem ser configuradas corretamente. Para obter instruções, consulte a Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

Você pode ver que os dois valores distintos do UTC são os mesmos quando convertidos para o fuso horário `'MET'`. Esse fenômeno pode levar a resultados diferentes para uma consulta específica da coluna `TIMESTAMP`, dependendo se o otimizador usa um índice para executar a consulta.

Suponha que uma consulta selecione valores da tabela mostrada anteriormente usando uma cláusula `WHERE` para pesquisar a coluna `ts` por um único valor específico, como um literal de timestamp fornecido pelo usuário:

```sql
SELECT ts FROM tstable
WHERE ts = 'literal';
```

Suponha que a consulta seja executada nessas condições:

* O fuso horário da sessão não é UTC e tem uma mudança de horário de verão. Por exemplo:

  ```sql
  SET time_zone = 'MET';
  ```

* Os valores únicos de UTC armazenados na coluna `TIMESTAMP` não são únicos no fuso horário da sessão devido aos deslocamentos do DST. (O exemplo mostrado anteriormente ilustra como isso pode ocorrer.)

* A consulta especifica um valor de pesquisa que está dentro da hora de entrada no DST no fuso horário da sessão.

Nestas condições, a comparação na cláusula `WHERE` ocorre de maneiras diferentes para pesquisas não indexadas e indexadas e resulta em resultados diferentes:

* Se não houver um índice ou se o otimizador não puder usá-lo, as comparações ocorrem no fuso horário da sessão. O otimizador realiza uma varredura na tabela, na qual recupera cada valor da coluna `ts`, o converte do UTC para o fuso horário da sessão e o compara ao valor de pesquisa (também interpretado no fuso horário da sessão):

  ```sql
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

Como os valores armazenados do `ts` são convertidos para o fuso horário da sessão, é possível que a consulta retorne dois valores de marcação de tempo que são distintos como valores UTC, mas iguais no fuso horário da sessão: um valor que ocorre antes da mudança do DST quando os relógios são alterados e um valor que ocorre após a mudança do DST.

* Se houver um índice utilizável, as comparações ocorrem em UTC. O otimizador realiza uma varredura de índice, convertendo primeiro o valor de pesquisa do fuso horário da sessão para UTC, e então comparando o resultado com as entradas do índice em UTC:

  ```sql
  mysql> ALTER TABLE tstable ADD INDEX (ts);
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

Neste caso, o valor de busca (convertido) é correspondido apenas às entradas do índice, e, como as entradas do índice para os valores UTC distintos também são distintos, o valor de busca pode corresponder apenas a um deles.

Devido à operação de otimizador diferente para buscas não indexadas e indexadas, a consulta produz resultados diferentes em cada caso. O resultado da busca não indexada retorna todos os valores que correspondem ao fuso horário da sessão. A busca indexada não pode fazer isso:

* É realizada dentro do motor de armazenamento, que conhece apenas valores em UTC.

* Para os dois valores distintos do fuso horário da sessão que correspondem ao mesmo valor UTC, a pesquisa indexada corresponde apenas à entrada correspondente do índice UTC e retorna apenas uma única string.

Na discussão anterior, o conjunto de dados armazenado em `tstable` por acaso consiste em valores distintos do UTC. Nesses casos, todas as consultas que utilizam índices na forma mostrada correspondem, no máximo, a uma entrada de índice.

Se o índice não for `UNIQUE`, é possível que a tabela (e o índice) armazene múltiplas instâncias de um determinado valor UTC. Por exemplo, a coluna `ts` pode conter múltiplas instâncias do valor UTC `'2018-10-28 00:30:00'`. Neste caso, a consulta que utiliza o índice retornaria cada uma delas (convertida para o valor MET `'2018-10-28 02:30:00'` no conjunto de resultados). Resta claro que as consultas que utilizam o índice correspondem ao valor de pesquisa convertido a um único valor nas entradas de índice UTC, em vez de corresponder a múltiplos valores UTC que se convertem ao valor de pesquisa no fuso horário da sessão.

Se for importante retornar todos os valores `ts` que correspondem ao fuso horário da sessão, a solução é suprimir o uso do índice com uma dica `IGNORE INDEX`:

```sql
mysql> SELECT ts FROM tstable
       IGNORE INDEX (ts)
       WHERE ts = '2018-10-28 02:30:00';
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 02:30:00 |
| 2018-10-28 02:30:00 |
+---------------------+
```

A mesma falta de mapeamento um para um para conversões de fuso horário em ambas as direções ocorre também em outros contextos, como as conversões realizadas com as funções `FROM_UNIXTIME()` e `UNIX_TIMESTAMP()`. Veja a Seção 12.7, “Funções de Data e Hora”.