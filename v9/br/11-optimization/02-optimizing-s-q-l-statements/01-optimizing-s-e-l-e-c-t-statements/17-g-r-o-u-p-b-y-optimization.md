#### 10.2.1.17 Otimização por GROUP BY

A maneira mais geral de satisfazer uma cláusula `GROUP BY` é percorrer toda a tabela e criar uma nova tabela temporária onde todas as linhas de cada grupo estão consecutivas, e então usar essa tabela temporária para descobrir grupos e aplicar funções agregadas (se houver). Em alguns casos, o MySQL consegue fazer muito melhor do que isso e evitar a criação de tabelas temporárias usando o acesso a índices.

As condições mais importantes para usar índices para `GROUP BY` são que todas as colunas `GROUP BY` referenciam atributos do mesmo índice e que o índice armazene suas chaves em ordem (como é o caso, por exemplo, de um índice `BTREE`, mas não de um índice `HASH`). Se o uso de tabelas temporárias pode ser substituído pelo acesso a índices também depende de quais partes de um índice são usadas em uma consulta, das condições especificadas para essas partes e das funções agregadas selecionadas.

Existem duas maneiras de executar uma consulta `GROUP BY` por meio do acesso a índices, conforme detalhado nas seções seguintes. O primeiro método aplica a operação de agrupamento junto com todos os predicados de intervalo (se houver). O segundo método primeiro realiza uma varredura de intervalo e, em seguida, agrupa os tuplos resultantes.

* Varredura de Índice Solto
* Varredura de Índice Fechado

A varredura de índice solto também pode ser usada na ausência de `GROUP BY` sob algumas condições. Veja o Método de Acesso ao Intervalo de Varredura Descartável.

##### Varredura de Índice Solto

A maneira mais eficiente de processar `GROUP BY` é quando um índice é usado para recuperar diretamente as colunas de agrupamento. Com esse método de acesso, o MySQL utiliza a propriedade de alguns tipos de índice de que as chaves estão ordenadas (por exemplo, `BTREE`). Essa propriedade permite o uso de grupos de busca em um índice sem precisar considerar todas as chaves no índice que satisfazem todas as condições `WHERE`. Esse método de acesso considera apenas uma fração das chaves em um índice, então é chamado de Scan de Índice Solto. Quando não há uma cláusula `WHERE`, um Scan de Índice Solto lê tantas chaves quanto o número de grupos, o que pode ser um número muito menor do que o de todas as chaves. Se a cláusula `WHERE` contém predicados de intervalo (veja a discussão do tipo de junção `range` na Seção 10.8.1, “Otimizando Consultas com EXPLAIN”), um Scan de Índice Solto procura a primeira chave de cada grupo que satisfaça as condições de intervalo, e lê novamente o menor número possível de chaves. Isso é possível sob as seguintes condições:

* A consulta é sobre uma única tabela.
* Os nomes dos `GROUP BY` referem-se apenas a colunas que formam um prefixo da esquerda do índice e nenhuma outra coluna. (Se, em vez de `GROUP BY`, a consulta tiver uma cláusula `DISTINCT`, todos os atributos distintos referem-se a colunas que formam um prefixo da esquerda do índice.) Por exemplo, se uma tabela `t1` tiver um índice em `(c1, c2, c3),` o Scan de Índice Solto é aplicável se a consulta tiver `GROUP BY c1, c2`. Não é aplicável se a consulta tiver `GROUP BY c2, c3` (as colunas não formam um prefixo da esquerda) ou `GROUP BY c1, c2, c4` (`c4` não está no índice).

* As únicas funções agregadas usadas na lista de seleção (se houver) são `MIN()` e `MAX()`, e todas elas referem-se à mesma coluna. A coluna deve estar no índice e deve seguir imediatamente as colunas no `GROUP BY`.

* Todas as partes do índice, exceto as referenciadas no `GROUP BY` na consulta, devem ser constantes (ou seja, devem ser referenciadas em igualdades com constantes), exceto o argumento das funções `MIN()` ou `MAX()`.

* Para as colunas no índice, os valores completos da coluna devem ser indexados, não apenas um prefixo. Por exemplo, com `c1 VARCHAR(20), INDEX (c1(10))`, o índice usa apenas um prefixo dos valores de `c1` e não pode ser usado para varredura de índice flexível.

Se a varredura de índice flexível for aplicável a uma consulta, a saída do `EXPLAIN` mostra `Usando índice para grupo por` na coluna `Extra`.

Suponha que haja um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso da varredura de índice flexível pode ser usado para as seguintes consultas:

```
SELECT c1, c2 FROM t1 GROUP BY c1, c2;
SELECT DISTINCT c1, c2 FROM t1;
SELECT c1, MIN(c2) FROM t1 GROUP BY c1;
SELECT c1, c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT MAX(c3), MIN(c3), c1, c2 FROM t1 WHERE c2 > const GROUP BY c1, c2;
SELECT c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT c1, c2 FROM t1 WHERE c3 = const GROUP BY c1, c2;
```

As seguintes consultas não podem ser executadas com esse método de seleção rápida, pelas razões dadas:

* Há funções agregadas diferentes de `MIN()` ou `MAX()`:

  ```
  SELECT c1, SUM(c2) FROM t1 GROUP BY c1;
  ```

* As colunas na cláusula `GROUP BY` não formam um prefixo da esquerda do índice:

  ```
  SELECT c1, c2 FROM t1 GROUP BY c2, c3;
  ```

* A consulta refere-se a uma parte de uma chave que vem após a parte `GROUP BY` e para a qual não há igualdade com uma constante:

  ```
  SELECT c1, c3 FROM t1 GROUP BY c1, c2;
  ```

Se a consulta incluir `WHERE c3 = const`, a varredura de índice flexível poderia ser usada.

O método de acesso da varredura de índice flexível pode ser aplicado a outras formas de referências de funções agregadas na lista de seleção, além das referências `MIN()` e `MAX()` já suportadas:

* `AVG(DISTINCT)`, `SUM(DISTINCT)`, e `COUNT(DISTINCT)` são suportados. `AVG(DISTINCT)` e `SUM(DISTINCT)` aceitam um único argumento. `COUNT(DISTINCT)` pode ter mais de um argumento de coluna.

* Não deve haver cláusula `GROUP BY` ou `DISTINCT` na consulta.

* As limitações da varredura de índice flexível descritas anteriormente ainda se aplicam.

Suponha que exista um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso de varredura de índice apertado pode ser usado para as seguintes consultas:

```
SELECT COUNT(DISTINCT c1), SUM(DISTINCT c1) FROM t1;

SELECT COUNT(DISTINCT c1, c2), COUNT(DISTINCT c2, c1) FROM t1;
```

##### Varredura de Índice Apertado

Uma varredura de índice apertado pode ser uma varredura de índice completo ou uma varredura de índice de intervalo, dependendo das condições da consulta.

Quando as condições para uma varredura de índice apertado não são atendidas, ainda é possível evitar a criação de tabelas temporárias para consultas `GROUP BY`. Se houver condições de intervalo na cláusula `WHERE`, esse método lê apenas as chaves que satisfazem essas condições. Caso contrário, ele realiza uma varredura de índice. Como esse método lê todas as chaves em cada intervalo definido pela cláusula `WHERE`, ou varre todo o índice se não houver condições de intervalo, ele é chamado de varredura de índice apertado. Com uma varredura de índice apertado, a operação de agrupamento é realizada apenas após todas as chaves que satisfazem as condições de intervalo terem sido encontradas.

Para que esse método funcione, é suficiente que haja uma condição de igualdade constante para todas as colunas em uma consulta que faça referência a partes da chave que vêm antes ou entre partes da chave `GROUP BY`. As constantes das condições de igualdade preenchem quaisquer "lacunas" nas chaves de busca para que seja possível formar prefixos completos do índice. Esses prefixos de índice podem então ser usados para buscas de índice. Se o resultado do `GROUP BY` requer ordenação, e é possível formar chaves de busca que são prefixos do índice, o MySQL também evita operações de ordenação extras porque a busca com prefixos em um índice ordenado já recupera todas as chaves em ordem.

Suponha que exista um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. As seguintes consultas não funcionam com o método de acesso de varredura de índice apertado descrito anteriormente, mas ainda funcionam com o método de acesso de varredura de índice apertado.

* Há uma lacuna no `GROUP BY`, mas ela é coberta pela condição `c2 = 'a'`:

  ```
  SELECT c1, c2, c3 FROM t1 WHERE c2 = 'a' GROUP BY c1, c3;
  ```

* O `GROUP BY` não começa com a primeira parte da chave, mas há uma condição que fornece uma constante para essa parte:

  ```
  SELECT c1, c2, c3 FROM t1 WHERE c1 = 'a' GROUP BY c2, c3;
  ```