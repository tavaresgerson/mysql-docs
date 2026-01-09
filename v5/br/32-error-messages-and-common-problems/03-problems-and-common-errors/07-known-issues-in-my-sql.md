### B.3.7 Problemas Conhecidos no MySQL

Esta seção lista os problemas conhecidos nas versões recentes do MySQL.

Para obter informações sobre problemas específicos da plataforma, consulte as instruções de instalação e depuração na [Seção 2.1, “Orientações Gerais de Instalação”](general-installation-issues.html) e na [Seção 5.8, “Depuração do MySQL”](debugging-mysql.html).

Os seguintes problemas são conhecidos:

- A otimização de subconsultas para `IN` não é tão eficaz quanto para `=`.

- Mesmo que você use `lower_case_table_names=2` (o que permite que o MySQL lembre do caso usado para bancos de dados e nomes de tabelas), o MySQL não lembra do caso usado para nomes de bancos de dados para a função [`DATABASE()`](information-functions.html#function_database) ou nos vários logs (em sistemas que não fazem distinção de maiúsculas e minúsculas).

- A eliminação de uma restrição `FOREIGN KEY` não funciona na replicação porque a restrição pode ter outro nome na replica.

- A opção [`REPLACE`](replace.html) (e [`LOAD DATA`](load-data.html) com a opção [`REPLACE`](replace.html)) não dispara `ON DELETE CASCADE`.

- `DISTINCT` com `ORDER BY` não funciona dentro de [`GROUP_CONCAT()`](aggregate-functions.html#function_group-concat) se você não usar todas e apenas as colunas que estão na lista de `DISTINCT`.

- Ao inserir um valor inteiro grande (entre 263 e 264−1) em uma coluna decimal ou de string, ele é inserido como um valor negativo porque o número é avaliado em um contexto de inteiro assinado.

- Com o registro binário baseado em declarações, o servidor fonte escreve as consultas executadas no log binário. Esse é um método de registro muito rápido, compacto e eficiente que funciona perfeitamente na maioria dos casos. No entanto, é possível que os dados do servidor fonte e da replica se tornem diferentes se uma consulta for projetada de tal forma que a modificação dos dados seja não determinística (geralmente não é uma prática recomendada, mesmo fora da replicação).

  Por exemplo:

  - As instruções [`CREATE TABLE ... SELECT`](create-table-select.html) ou [`INSERT ... SELECT`](insert-select.html) que inserem valores nulos ou `NULL` em uma coluna `AUTO_INCREMENT`.

  - `DELETE` (apagar.html) se você estiver apagando linhas de uma tabela que possui chaves estrangeiras com propriedades `ON DELETE CASCADE`.

  - [`REPLACE ... SELECT`](replace.html), `INSERT IGNORE ... SELECT` se você tiver valores de chave duplicados nos dados inseridos.

  **Se e somente se as consultas anteriores não tiverem uma cláusula `ORDER BY` que garanta uma ordem determinística**.

  Por exemplo, para [`INSERT ... SELECT`](insert-select.html) sem `ORDER BY`, o [`SELECT`](select.html) pode retornar linhas em uma ordem diferente (o que resulta em uma linha com diferentes classificações, e, portanto, em um número diferente na coluna `AUTO_INCREMENT`), dependendo das escolhas feitas pelos otimizadores na fonte e na replica.

  Uma consulta é otimizada de maneira diferente na fonte e na replica apenas se:

  - A tabela é armazenada usando um mecanismo de armazenamento diferente na fonte do que na réplica. (É possível usar diferentes mecanismos de armazenamento na fonte e na réplica. Por exemplo, você pode usar `InnoDB` na fonte, mas `MyISAM` na réplica, se a réplica tiver menos espaço em disco disponível.)

  - Os tamanhos dos buffers do MySQL ([`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size), e assim por diante) são diferentes na fonte e na réplica.

  - A fonte e a replica executam versões diferentes do MySQL, e o código do otimizador difere entre essas versões.

  Esse problema também pode afetar a restauração de bancos de dados usando **mysqlbinlog|mysql**.

  A maneira mais fácil de evitar esse problema é adicionar uma cláusula `ORDER BY` às consultas não determinísticas mencionadas anteriormente para garantir que as linhas sejam sempre armazenadas ou modificadas na mesma ordem. O uso de um formato de registro baseado em linhas ou misto também evita o problema.

- Os nomes dos arquivos de log são baseados no nome do host do servidor, se você não especificar um nome de arquivo com a opção de inicialização. Para manter os mesmos nomes de arquivos de log se você mudar o nome do seu host para algo diferente, você deve usar explicitamente opções como [`--log-bin=old_host_name-bin`](replication-options-binary-log.html#option_mysqld_log-bin). Veja [Seção 5.1.6, “Opções de Comando do Servidor”](server-options.html). Alternativamente, renomeie os arquivos antigos para refletir a mudança do nome do seu host. Se esses forem logs binários, você deve editar o arquivo de índice do log binário e corrigir os nomes dos arquivos de log binários também. (O mesmo vale para os logs de retransmissão em uma replica.)

- [**mysqlbinlog**](mysqlbinlog.html) não exclui os arquivos temporários deixados após uma instrução de [`LOAD DATA`](load-data.html). Veja [Seção 4.6.7, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”](mysqlbinlog.html).

- O comando `RENAME` não funciona com tabelas `TEMPORARY` ou tabelas usadas em uma tabela `MERGE`.

- Ao usar `SET CHARACTER SET`, você não pode usar caracteres traduzidos em nomes de banco de dados, tabelas e colunas.

- Você não pode usar `_` ou `%` com `ESCAPE` em [`LIKE ... ESCAPE`](string-comparison-functions.html#operator_like).

- O servidor usa apenas os primeiros bytes de [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) ao comparar os valores dos dados. Isso significa que os valores não podem ser usados de forma confiável em `GROUP BY`, `ORDER BY` ou `DISTINCT` se eles diferirem apenas após os primeiros bytes de [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length). Para contornar isso, aumente o valor da variável. O valor padrão de [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) é 1024 e pode ser alterado no momento do início do servidor ou durante a execução.

- Os cálculos numéricos são feitos com [`BIGINT`](tipos-inteiros.html) ou [`DOUBLE`](tipos-de-ponto-flutuante.html) (ambos são normalmente de 64 bits de comprimento). A precisão que você obtém depende da função. A regra geral é que as funções de bits são realizadas com precisão de [`BIGINT`](tipos-inteiros.html), [`IF`](funções-de-controle-de-fluxo.html#função_if) e [`ELT`](funções-de-strings.html#função_elt) com precisão de [`BIGINT`](tipos-inteiros.html) ou [`DOUBLE`](tipos-de-ponto-flutuante.html), e o resto com precisão de [`DOUBLE`](tipos-de-ponto-flutuante.html). Você deve tentar evitar o uso de valores unsigned long long se eles forem maiores que 63 bits (9223372036854775807) para qualquer outra coisa além de campos de bits.

- Você pode ter até 255 colunas [`ENUM`](enum.html) e [`SET`](set.html) em uma única tabela.

- Em [`MIN()`](aggregate-functions.html#function_min), [`MAX()`](aggregate-functions.html#function_max) e outras funções agregadas, o MySQL atualmente compara as colunas [`ENUM`](enum.html) e [`SET`](set.html) pelo seu valor de string em vez da posição relativa da string no conjunto.

- Em uma declaração de [`UPDATE`](update.html), as colunas são atualizadas da esquerda para a direita. Se você se referir a uma coluna atualizada, você receberá o valor atualizado em vez do valor original. Por exemplo, a seguinte declaração incrementa `KEY` em `2`, **não** em `1`:

  ```sql
  mysql> UPDATE tbl_name SET KEY=KEY+1,KEY=KEY+1;
  ```

- Você pode referenciar várias tabelas temporárias na mesma consulta, mas não pode referenciar uma determinada tabela temporária mais de uma vez. Por exemplo, o seguinte não funciona:

  ```sql
  mysql> SELECT * FROM temp_table, temp_table AS t2;
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

- O otimizador pode lidar com `DISTINCT` de maneira diferente quando você está usando colunas "ocultas" em uma junção do que quando não está. Em uma junção, as colunas ocultas são contadas como parte do resultado (mesmo que não sejam mostradas), enquanto em consultas normais, as colunas ocultas não participam da comparação `DISTINCT`.

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

  No segundo caso, você pode obter duas linhas idênticas no conjunto de resultados (porque os valores na coluna oculta `id` podem diferir).

  Observe que isso acontece apenas para consultas que não possuem as colunas `ORDER BY` no resultado.

- Se você executar uma `PROCEDURE` em uma consulta que retorna um conjunto vazio, em alguns casos a `PROCEDURE` não transforma as colunas.

- A criação de uma tabela do tipo `MERGE` não verifica se as tabelas subjacentes são tipos compatíveis.

- Se você usar [`ALTER TABLE`](alter-table.html) para adicionar um índice `UNIQUE` a uma tabela usada em uma tabela `MERGE` e, em seguida, adicionar um índice normal na tabela `MERGE`, a ordem da chave será diferente para as tabelas se houvesse uma chave antiga, não `UNIQUE`, na tabela. Isso ocorre porque o [`ALTER TABLE`](alter-table.html) coloca índices `UNIQUE` antes dos índices normais para poder detectar duplicatas o mais cedo possível.

- Uma declaração de [`UPDATE`](update.html) que envolve uma tabela temporária com uma junção em uma tabela não temporária que possui um gatilho definido nela pode resultar em um erro, mesmo que a declaração de atualização leia apenas a tabela não temporária, nos seguintes casos:

  - Com o modo de leitura apenas habilitado (usando `SET GLOBAL`[`read_only`](server-system-variables.html#sysvar_read_only)\`= 1).

  - Com o nível de transação definido como `READ_ONLY` (ou seja, usando [`SET GLOBAL TRANSACTION READ ONLY`](set-transaction.html) ou `SET SESSION TRANSACTION READ ONLY`).
