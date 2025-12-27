### B.3.7 Problemas Conhecidos no MySQL

Esta seção lista os problemas conhecidos nas versões recentes do MySQL.

Para informações sobre problemas específicos da plataforma, consulte as instruções de instalação e depuração na Seção 2.1, “Orientações Gerais de Instalação”, e na Seção 7.9, “Depuração do MySQL”.

Os seguintes problemas são conhecidos:

* A otimização de subconsultas para `IN` não é tão eficaz quanto para `=`.
* Mesmo que você use `lower_case_table_names=2` (o que permite que o MySQL lembre do caso usado para bancos de dados e nomes de tabelas), o MySQL não lembra do caso usado para nomes de banco de dados para a função `DATABASE()` ou dentro dos vários logs (em sistemas que não são sensíveis ao caso).
* A remoção de uma restrição `FOREIGN KEY` não funciona na replicação porque a restrição pode ter outro nome na replica.
* `REPLACE` (e `LOAD DATA` com a opção `REPLACE`) não dispara `ON DELETE CASCADE`.
* `DISTINCT` com `ORDER BY` não funciona dentro de `GROUP_CONCAT()` se você não usar todas e apenas aquelas colunas que estão na lista `DISTINCT`.
* Ao inserir um valor inteiro grande (entre 263 e 264−1) em uma coluna decimal ou de string, ele é inserido como um valor negativo porque o número é avaliado no contexto de inteiro assinado.
* Com o registro binário baseado em instruções, o servidor fonte escreve as consultas executadas no log binário. Esse é um método de registro muito rápido, compacto e eficiente que funciona perfeitamente na maioria dos casos. No entanto, é possível que os dados no servidor fonte e na replica se tornem diferentes se uma consulta for projetada de tal forma que a modificação de dados seja não determinística (geralmente não é uma prática recomendada, mesmo fora da replicação).

Por exemplo:

`CREATE TABLE ... SELECT` ou `INSERT ... SELECT` que inserem valores nulos ou `NULL` em uma coluna `AUTO_INCREMENT`.
`DELETE` se você estiver excluindo linhas de uma tabela que tem chaves estrangeiras com propriedades `ON DELETE CASCADE`.
`REPLACE ... SELECT`, `INSERT IGNORE ... SELECT` se você tiver valores de chave duplicados nos dados inseridos.

**Apenas se as consultas anteriores não tiverem uma cláusula `ORDER BY` que garanta uma ordem determinística**.

Por exemplo, para `INSERT ... SELECT` sem `ORDER BY`, o `SELECT` pode retornar linhas em uma ordem diferente (o que resulta em uma linha com diferentes classificações, portanto, recebendo um número diferente na coluna `AUTO_INCREMENT`), dependendo das escolhas feitas pelos otimizadores na fonte e na replica.

Uma consulta é otimizada de maneira diferente na fonte e na replica apenas se:
+ A tabela for armazenada usando um motor de armazenamento diferente na fonte do que na replica. (É possível usar diferentes motores de armazenamento na fonte e na replica. Por exemplo, você pode usar `InnoDB` na fonte, mas `MyISAM` na replica se a replica tiver menos espaço em disco disponível.)
+ Os tamanhos dos buffers do MySQL ( `key_buffer_size`, e assim por diante) são diferentes na fonte e na replica.
+ A fonte e a replica executam diferentes versões do MySQL, e o código do otimizador difere entre essas versões.

Esse problema também pode afetar a restauração do banco de dados usando **mysqlbinlog|mysql**.

A maneira mais fácil de evitar esse problema é adicionar uma cláusula `ORDER BY` às consultas não determinísticas mencionadas anteriormente para garantir que as linhas sejam sempre armazenadas ou modificadas na mesma ordem. O uso de um formato de registro baseado em linhas ou misto também evita o problema.
* Os nomes dos arquivos de log são baseados no nome do host do servidor se você não especificar um nome de arquivo com a opção de inicialização. Para manter os mesmos nomes de arquivos de log se você alterar o nome do seu host para algo diferente, você deve usar explicitamente opções como `--log-bin=old_host_name-bin`. Veja a Seção 7.1.7, “Opções de Comando do Servidor”. Alternativamente, renomeie os arquivos antigos para refletir a mudança no nome do seu host. Se esses forem logs binários, você deve editar o arquivo de índice do log binário e corrigir os nomes dos arquivos de log binário também. (O mesmo vale para os logs de retransmissão em uma replica.)
* `mysqlbinlog` não exclui arquivos temporários deixados após uma declaração `LOAD DATA`. Veja a Seção 6.6.9, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”.
* `RENAME` não funciona com tabelas `TEMPORARY` ou tabelas usadas em uma tabela `MERGE`.
* Ao usar `SET CHARACTER SET`, você não pode usar caracteres traduzidos em nomes de banco de dados, tabelas e colunas.
* O servidor usa apenas os primeiros  `max_sort_length` bytes ao comparar valores de dados. Isso significa que os valores não podem ser usados de forma confiável em `GROUP BY`, `ORDER BY` ou `DISTINCT` se diferirem apenas após os primeiros  `max_sort_length` bytes. Para contornar isso, aumente o valor da variável. O valor padrão de  `max_sort_length` é 1024 e pode ser alterado no momento do início do servidor ou em tempo de execução.
* Os cálculos numéricos são feitos com  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou  `DOUBLE` - FLOAT, DOUBLE") (ambos são normalmente de 64 bits de comprimento). A precisão que você obtém depende da função. A regra geral é que as funções de bits são realizadas com precisão  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para `IF()` e `ELT()` com precisão  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou  `DOUBLE` - FLOAT, DOUBLE") e o resto com precisão  `DOUBLE` - FLOAT, DOUBLE")). Você deve tentar evitar usar valores de unsigned long long se eles forem maiores que 63 bits (9223372036854775807) para qualquer coisa além de campos de bits.
* Você pode ter até 255 colunas `ENUM` e `SET` em uma única tabela.
* Em `MIN()`, `MAX()`, e outras funções agregadas, o MySQL atualmente compara colunas `ENUM` e `SET` pelo seu valor de string em vez da posição relativa da string no conjunto.
* Em uma declaração `UPDATE`, as colunas são atualizadas da esquerda para a direita. Se você se referir a uma coluna atualizada, você obtém o valor atualizado em vez do valor original. Por exemplo, a seguinte declaração incrementa `KEY` por `2`, **não** `1`:

* Você pode referenciar múltiplas tabelas temporárias na mesma consulta, mas não pode referenciar nenhuma tabela temporária específica mais de uma vez. Por exemplo, o seguinte não funciona:

  ```
  mysql> UPDATE tbl_name SET KEY=KEY+1,KEY=KEY+1;
  ```
* O otimizador pode tratar o `DISTINCT` de maneira diferente quando você está usando colunas "ocultas" em uma junção do que quando não está. Em uma junção, as colunas ocultas são contadas como parte do resultado (mesmo que não sejam mostradas), enquanto em consultas normais, as colunas ocultas não participam da comparação `DISTINCT`.

  Um exemplo disso é:

  ```
  mysql> SELECT * FROM temp_table, temp_table AS t2;
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

  e

  ```
  SELECT DISTINCT mp3id FROM band_downloads
         WHERE userid = 9 ORDER BY id DESC;
  ```

  No segundo caso, você pode obter duas linhas idênticas no conjunto de resultados (porque os valores na coluna `id` oculta podem diferir).

  Note que isso acontece apenas para consultas que não têm as colunas `ORDER BY` no resultado.
* Se você executar um `PROCEDURE` em uma consulta que retorna um conjunto vazio, em alguns casos, o `PROCEDURE` não transforma as colunas.
* A criação de uma tabela do tipo `MERGE` não verifica se as tabelas subjacentes são tipos compatíveis.
* Se você usar  `ALTER TABLE` para adicionar um índice `UNIQUE` a uma tabela usada em uma tabela `MERGE` e depois adicionar um índice normal na tabela `MERGE`, a ordem da chave é diferente para as tabelas se houvesse uma chave antiga, não `UNIQUE` na tabela. Isso ocorre porque  `ALTER TABLE` coloca índices `UNIQUE` antes dos índices normais para poder detectar chaves duplicadas o mais cedo possível.
* Uma declaração `UPDATE` envolvendo uma tabela temporária com uma junção em uma tabela não temporária com um gatilho definido nela pode resultar em um erro, mesmo que a declaração de atualização leia apenas a tabela não temporária, nos seguintes casos:

  + Com o modo de leitura habilitado (usando `SET GLOBAL read_only``= 1).
  + Com o nível de transação definido como `READ_ONLY` (ou seja, usando  `SET GLOBAL TRANSACTION READ ONLY` ou `SET SESSION TRANSACTION READ ONLY`).