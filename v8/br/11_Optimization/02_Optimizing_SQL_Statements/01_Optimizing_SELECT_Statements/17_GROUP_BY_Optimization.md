#### 10.2.1.17 Otimização por GRUPO

A maneira mais geral de satisfazer uma cláusula `GROUP BY` é percorrer toda a tabela e criar uma nova tabela temporária onde todas as linhas de cada grupo estejam consecutivas, e, em seguida, usar essa tabela temporária para descobrir grupos e aplicar funções agregadas (se houver). Em alguns casos, o MySQL consegue fazer muito melhor do que isso e evitar a criação de tabelas temporárias usando o acesso a índices.

As condições prévias mais importantes para o uso de índices para `GROUP BY` são que todas as colunas `GROUP BY` façam referência a atributos do mesmo índice e que o índice armazene suas chaves em ordem (como é o caso, por exemplo, de um índice `BTREE`, mas não de um índice `HASH`). Se o uso de tabelas temporárias pode ser substituído pelo acesso ao índice também depende de quais partes de um índice são usadas em uma consulta, das condições especificadas para essas partes e das funções agregadas selecionadas.

Existem duas maneiras de executar uma consulta `GROUP BY` por meio do acesso ao índice, conforme detalhado nas seções a seguir. O primeiro método aplica a operação de agrupamento junto com todos os predicados de intervalo (se houver). O segundo método executa primeiro uma varredura de intervalo e, em seguida, agrupa os tuplos resultantes.

- Índice deslocado
- Índice de verificação apertado

O varredura de índice deslocada também pode ser usado na ausência de `GROUP BY` sob certas condições. Veja o método de acesso à faixa de varredura ignorada.

##### Índice deslocado

A maneira mais eficiente de processar `GROUP BY` é quando um índice é usado para recuperar diretamente as colunas de agrupamento. Com esse método de acesso, o MySQL utiliza a propriedade de alguns tipos de índice de que as chaves estão ordenadas (por exemplo, `BTREE`). Essa propriedade permite o uso de grupos de busca em um índice sem ter que considerar todas as chaves no índice que satisfazem todas as condições de `WHERE`. Esse método de acesso considera apenas uma fração das chaves em um índice, então é chamado de varredura de índice solta. Quando não há cláusula `WHERE`, uma varredura de índice solta lê tantas chaves quanto o número de grupos, o que pode ser um número muito menor do que o de todas as chaves. Se a cláusula `WHERE` contém predicados de intervalo (veja a discussão do tipo de junção `range` na Seção 10.8.1, “Otimizando Consultas com EXPLAIN”), uma varredura de índice solta procura a primeira chave de cada grupo que satisfaça as condições de intervalo e, novamente, lê o menor número possível de chaves. Isso é possível sob as seguintes condições:

- A consulta é sobre uma única tabela.

- Os nomes `GROUP BY` indicam apenas as colunas que formam um prefixo à esquerda do índice e nenhuma outra coluna. (Se, em vez de `GROUP BY`, a consulta tiver uma cláusula `DISTINCT`, todos os atributos distintos referem-se a colunas que formam um prefixo à esquerda do índice.) Por exemplo, se uma tabela `t1` tiver um índice em `(c1,c2,c3)`, o Scan de Índice Lento é aplicável se a consulta tiver `GROUP BY c1, c2`. Não é aplicável se a consulta tiver `GROUP BY c2, c3` (as colunas não formam um prefixo à esquerda) ou `GROUP BY c1, c2, c4` (`c4` não está no índice).

- As únicas funções agregadas usadas na lista de seleção (se houver) são `MIN()` e `MAX()`, e todas elas se referem à mesma coluna. A coluna deve estar no índice e deve seguir imediatamente as colunas na `GROUP BY`.

- Quaisquer outras partes do índice, além das referenciadas no `GROUP BY` na consulta, devem ser constantes (ou seja, devem ser referenciadas em igualdades com constantes), exceto o argumento das funções `MIN()` ou `MAX()`.

- Para colunas no índice, os valores completos da coluna devem ser indexados, não apenas um prefixo. Por exemplo, com `c1 VARCHAR(20), INDEX (c1(10))`, o índice usa apenas um prefixo dos valores `c1` e não pode ser usado para varredura de índice livre.

Se o varredura de índice solto for aplicável a uma consulta, a saída `EXPLAIN` mostra `Using index for group-by` na coluna `Extra`.

Suponha que exista um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso ao varredura de índice deslocado pode ser usado para as seguintes consultas:

```
SELECT c1, c2 FROM t1 GROUP BY c1, c2;
SELECT DISTINCT c1, c2 FROM t1;
SELECT c1, MIN(c2) FROM t1 GROUP BY c1;
SELECT c1, c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT MAX(c3), MIN(c3), c1, c2 FROM t1 WHERE c2 > const GROUP BY c1, c2;
SELECT c2 FROM t1 WHERE c1 < const GROUP BY c1, c2;
SELECT c1, c2 FROM t1 WHERE c3 = const GROUP BY c1, c2;
```

As seguintes consultas não podem ser executadas com este método de seleção rápida, pelas razões apresentadas:

- Existem funções agregadas além de `MIN()` ou `MAX()`:

  ```
  SELECT c1, SUM(c2) FROM t1 GROUP BY c1;
  ```

- As colunas na cláusula `GROUP BY` não formam um prefixo da esquerda do índice:

  ```
  SELECT c1, c2 FROM t1 GROUP BY c2, c3;
  ```

- A consulta refere-se a uma parte de uma chave que vem após a parte `GROUP BY`, e para a qual não há igualdade com uma constante:

  ```
  SELECT c1, c3 FROM t1 GROUP BY c1, c2;
  ```

  Se a consulta incluir `WHERE c3 = const`, o Scan de Índice Solto pode ser usado.

O método de acesso ao varredura de índice deslocado pode ser aplicado a outras formas de referências de função agregada na lista de seleção, além das referências `MIN()` e `MAX()` já suportadas:

- Os códigos `AVG(DISTINCT)`, `SUM(DISTINCT)` e `COUNT(DISTINCT)` são suportados. Os códigos `AVG(DISTINCT)` e `SUM(DISTINCT)` aceitam um único argumento. O código `COUNT(DISTINCT)` pode ter mais de um argumento de coluna.

- Não deve haver nenhuma cláusula `GROUP BY` ou `DISTINCT` na consulta.

- As limitações do varredura do índice solto descritas anteriormente ainda se aplicam.

Suponha que exista um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. O método de acesso ao varredura de índice deslocado pode ser usado para as seguintes consultas:

```
SELECT COUNT(DISTINCT c1), SUM(DISTINCT c1) FROM t1;

SELECT COUNT(DISTINCT c1, c2), COUNT(DISTINCT c2, c1) FROM t1;
```

##### Índice de verificação apertado

Um varredura de índice apertado pode ser uma varredura de índice completa ou uma varredura de índice de intervalo, dependendo das condições da consulta.

Quando as condições para um varredura de índice solto não são atendidas, ainda é possível evitar a criação de tabelas temporárias para consultas do `GROUP BY`. Se houver condições de intervalo na cláusula `WHERE`, este método lê apenas as chaves que satisfazem essas condições. Caso contrário, ele realiza uma varredura de índice. Como este método lê todas as chaves em cada intervalo definido pela cláusula `WHERE`, ou varre todo o índice se não houver condições de intervalo, ele é chamado de varredura de índice apertada. Com uma varredura de índice apertada, a operação de agrupamento é realizada apenas após todas as chaves que satisfazem as condições de intervalo terem sido encontradas.

Para que esse método funcione, é suficiente que haja uma condição de igualdade constante para todas as colunas em uma consulta que faça referência a partes da chave que vêm antes ou entre partes da chave `GROUP BY`. As constantes das condições de igualdade preenchem quaisquer “lacunas” nas chaves de pesquisa para que seja possível formar prefixos completos do índice. Esses prefixos de índice podem então ser usados para buscas no índice. Se o resultado `GROUP BY` exigir ordenação, e for possível formar chaves de pesquisa que sejam prefixos do índice, o MySQL também evita operações de ordenação extras porque a busca com prefixos em um índice ordenado já recupera todas as chaves em ordem.

Suponha que exista um índice `idx(c1,c2,c3)` na tabela `t1(c1,c2,c3,c4)`. As seguintes consultas não funcionam com o método de acesso de varredura de índice solto descrito anteriormente, mas ainda funcionam com o método de acesso de varredura de índice apertado.

- Há uma lacuna no `GROUP BY`, mas ela é coberta pela condição `c2 = 'a'`:

  ```
  SELECT c1, c2, c3 FROM t1 WHERE c2 = 'a' GROUP BY c1, c3;
  ```

- O `GROUP BY` não começa com a primeira parte da chave, mas há uma condição que fornece uma constante para essa parte:

  ```
  SELECT c1, c2, c3 FROM t1 WHERE c1 = 'a' GROUP BY c2, c3;
  ```
