### 5.4.1 Selecionando destinos de saída do Log de consulta geral e do Log de consulta lenta

O MySQL Server oferece controle flexível sobre o destino da saída escrita no log de consulta geral e no log de consultas lentas, se esses logs estiverem habilitados. Os possíveis destinos para as entradas do log são arquivos de log ou as tabelas `general_log` e `slow_log` no banco de dados do sistema `mysql`. Pode ser selecionado a saída de arquivo, a saída de tabela ou ambas.

- Controle de log no início do servidor
- Controle de log no tempo de execução
- Benefícios e características da tabela de logs

#### Controle de registro ao iniciar o servidor

A variável de sistema `log_output` especifica o destino para a saída de logs. Definir essa variável não habilita os logs por si só; eles devem ser habilitados separadamente.

- Se `log_output` não for especificado durante o início, o destino de registro padrão é `FILE`.

- Se `log_output` for especificado na inicialização, seu valor é uma lista de uma ou mais palavras separadas por vírgula escolhidas entre `TABLE` (logar em tabelas), `FILE` (logar em arquivos) ou `NONE` (não logar em tabelas ou arquivos). `NONE`, se presente, tem precedência sobre quaisquer outros especificadores.

A variável de sistema `general_log` controla o registro no log de consultas gerais para os destinos de registro selecionados. Se especificada na inicialização do servidor, `general_log` aceita um argumento opcional de 1 ou 0 para habilitar ou desabilitar o registro. Para especificar um nome de arquivo diferente do padrão para o registro de arquivos, defina a variável `general_log_file`. Da mesma forma, a variável `slow_query_log` controla o registro no log de consultas lentas para os destinos selecionados e a definição de `slow_query_log_file` especifica um nome de arquivo para o registro de arquivos. Se qualquer um dos logs estiver habilitado, o servidor abre o arquivo de log correspondente e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino de log `FILE` seja selecionado.

Exemplos:

- Para escrever entradas de log de consulta geral na tabela de log e no arquivo de log, use `--log_output=TABLE,FILE` para selecionar os dois destinos de log e `--general_log` para habilitar o log de consulta geral.

- Para escrever entradas de log de consultas gerais e lentas apenas nas tabelas de log, use `--log_output=TABLE` para selecionar tabelas como destino do log e `--general_log` e `--slow_query_log` para habilitar ambos os logs.

- Para escrever entradas de registro de consultas lentas apenas no arquivo de registro, use `--log_output=FILE` para selecionar arquivos como destino do log e `--slow_query_log` para habilitar o log de consultas lentas. Nesse caso, como o destino de log padrão é `FILE`, você poderia omitir a configuração `log_output`.

#### Controle de logs em tempo de execução

As variáveis de sistema associadas às tabelas e arquivos de registro permitem o controle de execução sobre o registro:

- A variável `log_output` indica o destino atual do registro. Ela pode ser modificada em tempo de execução para alterar o destino.

- As variáveis `general_log` e `slow_query_log` indicam se o log de consultas gerais e o log de consultas lentas estão habilitados (`ON`) ou desabilitados (`OFF`). Você pode definir essas variáveis em tempo de execução para controlar se os logs estão habilitados.

- As variáveis `general_log_file` e `slow_query_log_file` indicam os nomes dos arquivos de log de consultas gerais e de consultas lentas. Você pode definir essas variáveis no início do servidor ou durante o runtime para alterar os nomes dos arquivos de log.

- Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`. (Isso pressupõe que o próprio log de consulta geral esteja habilitado.)

#### Benefícios e características da tabela de registro

O uso de tabelas para saída de log oferece os seguintes benefícios:

- As entradas do log têm um formato padrão. Para exibir a estrutura atual das tabelas de log, use as seguintes instruções:

  ```sql
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```

- O conteúdo do log é acessível por meio de instruções SQL. Isso permite o uso de consultas que selecionam apenas as entradas do log que satisfazem critérios específicos. Por exemplo, para selecionar o conteúdo do log associado a um cliente específico (o que pode ser útil para identificar consultas problemáticas desse cliente), é mais fácil fazer isso usando uma tabela de log do que um arquivo de log.

- Os logs são acessíveis remotamente por qualquer cliente que possa se conectar ao servidor e emitir consultas (se o cliente tiver os privilégios apropriados para a tabela de logs). Não é necessário fazer login no host do servidor e acessar diretamente o sistema de arquivos.

A implementação da tabela de registro tem as seguintes características:

- Em geral, o principal objetivo das tabelas de logs é fornecer uma interface para que os usuários observem a execução em tempo real do servidor, e não interferir na execução em tempo real.

- `CREATE TABLE` (create-table.html), `ALTER TABLE` (alter-table.html) e `DROP TABLE` (drop-table.html) são operações válidas em uma tabela de log. Para `ALTER TABLE` (alter-table.html) e `DROP TABLE` (drop-table.html), a tabela de log não pode estar em uso e deve ser desativada, conforme descrito mais adiante.

- Por padrão, as tabelas de log utilizam o mecanismo de armazenamento `CSV`, que escreve os dados no formato de valores separados por vírgula. Para usuários que têm acesso aos arquivos `.CSV` que contêm dados das tabelas de log, os arquivos são fáceis de importar em outros programas, como planilhas que podem processar entradas CSV.

  As tabelas de log podem ser alteradas para usar o mecanismo de armazenamento `MyISAM`. Você não pode usar `ALTER TABLE` para alterar uma tabela de log que esteja em uso. O log deve ser desativado primeiro. Nenhum mecanismo, exceto `CSV` ou `MyISAM`, é legal para as tabelas de log.

  **Tabelas de log e erros de "Muitos arquivos abertos"**. Se você selecionar `TABLE` como destino de log e as tabelas de log utilizarem o mecanismo de armazenamento `CSV`, pode ocorrer que desabilitar e reativar repetidamente o log de consultas gerais ou o log de consultas lentas no tempo real resulte em vários descritores de arquivo abertos para o arquivo `.CSV`, possivelmente resultando em um erro de "Muitos arquivos abertos". Para contornar esse problema, execute `FLUSH TABLES` ou garanta que o valor de `open_files_limit` seja maior que o valor de `table_open_cache_instances`.

- Para desativar o registro, de modo que você possa alterar (ou descartar) uma tabela de registro, você pode usar a seguinte estratégia. O exemplo usa o log de consulta geral; o procedimento para o log de consulta lenta é semelhante, mas usa a tabela `slow_log` e a variável de sistema `[slow_query_log]` (server-system-variables.html#sysvar\_slow\_query\_log).

  ```sql
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```

- `TRUNCATE TABLE` é uma operação válida em uma tabela de log. Pode ser usada para expirar entradas de log.

- `RENAME TABLE` é uma operação válida em uma tabela de log. Você pode renomear uma tabela de log de forma atômica (para realizar a rotação de log, por exemplo) usando a seguinte estratégia:

  ```sql
  USE mysql;
  DROP TABLE IF EXISTS general_log2;
  CREATE TABLE general_log2 LIKE general_log;
  RENAME TABLE general_log TO general_log_backup, general_log2 TO general_log;
  ```

- `CHECK TABLE` é uma operação válida em uma tabela de log.

- `LOCK TABLES` não pode ser usado em uma tabela de log.

- As operações `INSERT`, `DELETE` e `UPDATE` não podem ser usadas em uma tabela de log. Essas operações são permitidas apenas internamente no próprio servidor.

- `FLUSH TABLES WITH READ LOCK` e o estado da variável de sistema `read_only` não têm efeito nas tabelas de log. O servidor sempre pode escrever nas tabelas de log.

- As entradas escritas nas tabelas de log não são escritas no log binário e, portanto, não são replicadas para as réplicas.

- Para limpar as tabelas de registro ou arquivos de registro, use `FLUSH TABLES` ou `FLUSH LOGS`, respectivamente.

- A partição de tabelas de log não é permitida.

- Um **mysqldump** dump inclui instruções para recriar essas tabelas, para que não faltem após a recarga do arquivo de dump. O conteúdo da tabela de log não é descarregado.
