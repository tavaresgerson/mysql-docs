### B.3.7 Problemas Conhecidos no MySQL

Esta seção lista problemas conhecidos em versões recentes do MySQL.

Para informações sobre problemas específicos de plataforma, consulte as instruções de instalação e debugging em Seção 2.1, “Orientações Gerais de Instalação”, e Seção 5.8, “Debugging MySQL”.

Os seguintes problemas são conhecidos:

* A otimização de Subquery para `IN` não é tão eficaz quanto para `=`.

* Mesmo que você use `lower_case_table_names=2` (o que permite ao MySQL lembrar o uso de caixa para nomes de Database e table), o MySQL não lembra o uso de caixa para nomes de Database na função `DATABASE()` ou dentro dos vários logs (em sistemas case-insensitive).

* Fazer o DROP de uma `FOREIGN KEY` constraint não funciona na replication porque a constraint pode ter outro nome na replica.

* `REPLACE` (e `LOAD DATA` com a opção `REPLACE`) não aciona `ON DELETE CASCADE`.

* `DISTINCT` com `ORDER BY` não funciona dentro de `GROUP_CONCAT()` se você não usar todas e apenas as colunas que estão na lista `DISTINCT`.

* Ao inserir um valor integer grande (entre 2^63 e 2^64−1) em uma coluna decimal ou string, ele é inserido como um valor negativo porque o número é avaliado em contexto de signed integer.

* Com o binary logging baseado em statement, o source server escreve as Queries executadas no binary log. Este é um método de logging muito rápido, compacto e eficiente que funciona perfeitamente na maioria dos casos. No entanto, é possível que os dados no source e na replica se tornem diferentes se uma Query for projetada de tal forma que a modificação de dados seja não determinística (geralmente uma prática não recomendada, mesmo fora da replication).

  Por exemplo:

  + `CREATE TABLE ... SELECT` ou `INSERT ... SELECT` statements que inserem valores zero ou `NULL` em uma coluna `AUTO_INCREMENT`.

  + `DELETE` se você estiver deletando linhas de uma table que possui foreign keys com propriedades `ON DELETE CASCADE`.

  + `REPLACE ... SELECT`, `INSERT IGNORE ... SELECT` se você tiver duplicate key values nos dados inseridos.

  **Se e somente se as Queries precedentes não tiverem uma cláusula `ORDER BY` garantindo uma ordem determinística**.

  Por exemplo, para `INSERT ... SELECT` sem `ORDER BY`, o `SELECT` pode retornar linhas em uma ordem diferente (o que resulta em uma linha com ranks diferentes, consequentemente obtendo um número diferente na coluna `AUTO_INCREMENT`), dependendo das escolhas feitas pelos optimizers no source e na replica.

  Uma Query é otimizada de forma diferente no source e na replica somente se:

  + A table é armazenada usando um storage engine diferente no source do que na replica. (É possível usar storage engines diferentes no source e na replica. Por exemplo, você pode usar `InnoDB` no source, mas `MyISAM` na replica se a replica tiver menos espaço em disco disponível.)

  + Os tamanhos dos buffers do MySQL (`key_buffer_size`, e assim por diante) são diferentes no source e na replica.

  + O source e a replica executam versões diferentes do MySQL, e o código do optimizer difere entre essas versões.

  Este problema também pode afetar a restauração de Database usando **mysqlbinlog|mysql**.

  A maneira mais fácil de evitar este problema é adicionar uma cláusula `ORDER BY` às Queries não determinísticas mencionadas para garantir que as linhas sejam sempre armazenadas ou modificadas na mesma ordem. Usar o formato de logging row-based ou mixed também evita o problema.

* Os nomes dos arquivos de log são baseados no host name do server se você não especificar um nome de arquivo com a opção de startup. Para manter os mesmos nomes de arquivos de log se você mudar seu host name para outro, você deve usar explicitamente opções como `--log-bin=old_host_name-bin`. Consulte Seção 5.1.6, “Opções de Comando do Server”. Alternativamente, renomeie os arquivos antigos para refletir a mudança do seu host name. Se forem binary logs, você deve editar o arquivo index do binary log e corrigir os nomes dos arquivos de binary log ali também. (O mesmo é verdade para os relay logs em uma replica.)

* **mysqlbinlog** não deleta arquivos temporários restantes após um statement `LOAD DATA`. Consulte Seção 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”.

* `RENAME` não funciona com tables `TEMPORARY` ou tables usadas em uma table `MERGE`.

* Ao usar `SET CHARACTER SET`, você não pode usar caracteres traduzidos em nomes de Database, table e column.

* Você não pode usar `_` ou `%` com `ESCAPE` em `LIKE ... ESCAPE`.

* O server usa apenas os primeiros `max_sort_length` bytes ao comparar valores de dados. Isso significa que os valores não podem ser usados de forma confiável em `GROUP BY`, `ORDER BY` ou `DISTINCT` se eles diferirem apenas após os primeiros `max_sort_length` bytes. Para contornar isso, aumente o valor da variável. O valor default de `max_sort_length` é 1024 e pode ser alterado no momento do startup do server ou em runtime.

* Cálculos numéricos são feitos com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DOUBLE` - FLOAT, DOUBLE") (ambos são normalmente de 64 bits). A precisão que você obtém depende da função. A regra geral é que as funções bit são executadas com precisão `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `IF()` e `ELT()` com precisão `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DOUBLE` - FLOAT, DOUBLE"), e o restante com precisão `DOUBLE` - FLOAT, DOUBLE"). Você deve tentar evitar o uso de unsigned long long values se eles resultarem em valores maiores que 63 bits (9223372036854775807) para qualquer coisa além de bit fields.

* Você pode ter até 255 colunas `ENUM` e `SET` em uma única table.

* Em `MIN()`, `MAX()` e outras aggregate functions, o MySQL atualmente compara colunas `ENUM` e `SET` pelo seu valor string, em vez da posição relativa da string no set.

* Em um statement `UPDATE`, as colunas são atualizadas da esquerda para a direita. Se você referenciar uma coluna atualizada, você obtém o valor atualizado em vez do valor original. Por exemplo, o seguinte statement incrementa `KEY` por `2`, **não** `1`:

  ```sql
  mysql> UPDATE tbl_name SET KEY=KEY+1,KEY=KEY+1;
  ```

* Você pode referenciar múltiplas temporary tables na mesma Query, mas você não pode referenciar nenhuma temporary table específica mais de uma vez. Por exemplo, o seguinte não funciona:

  ```sql
  mysql> SELECT * FROM temp_table, temp_table AS t2;
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

* O optimizer pode tratar `DISTINCT` de forma diferente quando você está usando colunas "hidden" em um JOIN do que quando não está. Em um JOIN, colunas hidden são contadas como parte do resultado (mesmo que não sejam exibidas), enquanto em Queries normais, colunas hidden não participam da comparação `DISTINCT`.

  Um exemplo disso é:

  ```sql
  SELECT DISTINCT mp3id FROM band_downloads
         WHERE userid = 9 ORDER BY id DESC;
  ```

  e

  ```sql
  SELECT DISTINCT band_downloads.mp3id
         FROM band_downloads,band_mp3
         WHERE band_downloads.userid = 9
         AND band_mp3.id = band_downloads.mp3id
         ORDER BY band_downloads.id DESC;
  ```

  No segundo caso, você pode obter duas linhas idênticas no result set (porque os valores na coluna `id` hidden podem diferir).

  Note que isso acontece apenas para Queries que não têm as colunas `ORDER BY` no resultado.

* Se você executar uma `PROCEDURE` em uma Query que retorna um empty set, em alguns casos a `PROCEDURE` não transforma as colunas.

* A criação de uma table do tipo `MERGE` não verifica se as tables subjacentes são de tipos compatíveis.

* Se você usar `ALTER TABLE` para adicionar um `UNIQUE` Index a uma table usada em uma table `MERGE` e, em seguida, adicionar um Index normal na table `MERGE`, a ordem da Key é diferente para as tables se houver uma Key antiga, não `UNIQUE`, na table. Isso ocorre porque `ALTER TABLE` coloca Indexes `UNIQUE` antes dos Indexes normais para poder detectar chaves duplicadas o mais cedo possível.

* Um statement `UPDATE` envolvendo uma temporary table com um JOIN em uma non-temporary table que tenha um trigger definido pode resultar em um erro, mesmo que o statement UPDATE leia apenas a non-temporary table, nos seguintes casos:

  + Com o modo read-only habilitado (usando `SET GLOBAL``read_only``= 1`).

  + Com o nível da transaction definido como `READ_ONLY` (ou seja, usando `SET GLOBAL TRANSACTION READ ONLY` ou `SET SESSION TRANSACTION READ ONLY`).