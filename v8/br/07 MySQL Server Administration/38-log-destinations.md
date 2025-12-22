### 7.4.1 Selecionar os destinos de saída do registo de consulta geral e do registo de consulta lenta

O MySQL Server fornece controle flexível sobre o destino da saída escrita para o log de consulta geral e o log de consulta lenta, se esses logs estiverem habilitados. Possíveis destinos para entradas de log são arquivos de log ou as tabelas `general_log` e `slow_log` no banco de dados do sistema `mysql`.

- Controle de logs na inicialização do servidor
- Controle de logs em tempo de execução
- Benefícios e características da tabela de madeira

#### Controle de logs na inicialização do servidor

A variável de sistema `log_output` especifica o destino para a saída de log. A definição desta variável não permite em si os logs; eles devem ser habilitados separadamente.

- Se `log_output` não for especificado na inicialização, o destino de registro padrão é `FILE`.
- Se `log_output` for especificado no início, seu valor é uma lista de uma ou mais palavras separadas por vírgula escolhidas de `TABLE` (log para tabelas), `FILE` (log para arquivos), ou `NONE` (não faça log para tabelas ou arquivos). `NONE`, se presente, tem precedência sobre quaisquer outros especificadores.

A variável do sistema `general_log` controla o registro do registro de consulta geral para os destinos de registro selecionados. Se especificado na inicialização do servidor, `general_log` leva um argumento opcional de 1 ou 0 para habilitar ou desativar o registro. Para especificar um nome de arquivo diferente do padrão para o registro de arquivos, defina a variável `general_log_file`. Da mesma forma, a variável `slow_query_log` controla o registro do registro de consulta lenta para os destinos selecionados e a configuração `slow_query_log_file` especifica um nome para o registro de arquivos. Se qualquer um dos registros estiver habilitado, o servidor abre o arquivo de registro correspondente e escreve mensagens de inicialização para ele. No entanto, o registro adicional de consultas para o arquivo de registro de destino `FILE` não ocorre a menos que o arquivo de registro de destino `FILE` seja selecionado.

Exemplos:

- Para escrever entradas de registro de consulta geral na tabela de registro e no arquivo de registro, use `--log_output=TABLE,FILE` para selecionar os destinos de registro e `--general_log` para ativar o registro de consulta geral.
- Para escrever entradas de registro de consultas gerais e lentas apenas nas tabelas de registro, use `--log_output=TABLE` para selecionar tabelas como destino de registro e `--general_log` e `--slow_query_log` para habilitar ambos os registros.
- Para escrever entradas de log de consulta lenta apenas no arquivo de log, use `--log_output=FILE` para selecionar arquivos como destino de log e `--slow_query_log` para ativar o log de consulta lenta. Neste caso, como o destino de log padrão é `FILE`, você pode omitir a configuração `log_output`.

#### Controle de logs em tempo de execução

As variáveis do sistema associadas às tabelas e arquivos de log permitem o controle de tempo de execução sobre o registro:

- A variável `log_output` indica o destino de registro atual. Ela pode ser modificada no tempo de execução para alterar o destino.
- As variáveis `general_log` e `slow_query_log` indicam se o log de consulta geral e o log de consulta lenta estão ativados (`ON`) ou desativados (`OFF`).
- As variáveis `general_log_file` e `slow_query_log_file` indicam os nomes dos arquivos de registro de consulta geral e de registro de consulta lenta. Você pode definir essas variáveis na inicialização do servidor ou no tempo de execução para alterar os nomes dos arquivos de registro.
- Para desativar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`. (Isto assume que o próprio registro de consultas gerais está habilitado.)

#### Benefícios e características da tabela de madeira

A utilização de tabelas para a produção de registos oferece os seguintes benefícios:

- As entradas de log têm um formato padrão. Para exibir a estrutura atual das tabelas de log, use estas instruções:

  ```
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```
- Os conteúdos de log são acessíveis através de instruções SQL. Isso permite o uso de consultas que selecionam apenas as entradas de log que satisfazem critérios específicos. Por exemplo, para selecionar conteúdos de log associados a um determinado cliente (que pode ser útil para identificar consultas problemáticas desse cliente), é mais fácil fazer isso usando uma tabela de log do que um arquivo de log.
- Os registros são acessíveis remotamente por meio de qualquer cliente que possa se conectar ao servidor e emitir consultas (se o cliente tiver os privilégios de tabela de registro apropriados). Não é necessário fazer login no host do servidor e acessar diretamente o sistema de arquivos.

A implementação da tabela de registo tem as seguintes características:

- Em geral, o objetivo principal das tabelas de log é fornecer uma interface para que os usuários observem a execução em tempo de execução do servidor, não para interferir com sua execução em tempo de execução.
- `CREATE TABLE`, `ALTER TABLE`, e `DROP TABLE` são operações válidas em uma tabela de log. Para `ALTER TABLE` e `DROP TABLE`, a tabela de log não pode estar em uso e deve ser desativada, como descrito mais adiante.
- Por padrão, as tabelas de log usam o motor de armazenamento `CSV` que escreve dados em formato de valores separados por vírgula. Para usuários que têm acesso aos arquivos `.CSV` que contêm dados de tabela de log, os arquivos são fáceis de importar para outros programas, como planilhas que podem processar a entrada de CSV.

  As tabelas de log podem ser alteradas para usar o motor de armazenamento `MyISAM`. Você não pode usar `ALTER TABLE` para alterar uma tabela de log que esteja em uso. O log deve ser desativado primeiro. Nenhum motor além de `CSV` ou `MyISAM` é legal para as tabelas de log.

  \*\*Tabelas de registro e Demasiados arquivos abertos Erros. \*\*

  Se você selecionar `TABLE` como destino de registro e as tabelas de registro usarem o `CSV` motor de armazenamento, você pode achar que desativar e habilitar o registro de consulta geral ou o registro de consulta lenta repetidamente no tempo de execução resulta em vários descritores de arquivo aberto para o arquivo `.CSV`, possivelmente resultando em um erro de "muitos arquivos abertos". Para resolver este problema, execute `FLUSH TABLES` ou certifique-se de que o valor de `open_files_limit` é maior do que o valor de `table_open_cache_instances`.
- Para desativar o registro para que você possa alterar (ou soltar) uma tabela de registro, você pode usar a seguinte estratégia. O exemplo usa o registro de consulta geral; o procedimento para o registro de consulta lenta é semelhante, mas usa a tabela `slow_log` e a variável de sistema `slow_query_log`.

  ```
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```
- `TRUNCATE TABLE` é uma operação válida em uma tabela de log. Pode ser usada para expirar entradas de log.
- `RENAME TABLE` é uma operação válida em uma tabela de log. Você pode renomear atomicamente uma tabela de log (para executar rotação de log, por exemplo) usando a seguinte estratégia:

```
USE mysql;
DROP TABLE IF EXISTS general_log2;
CREATE TABLE general_log2 LIKE general_log;
RENAME TABLE general_log TO general_log_backup, general_log2 TO general_log;
```

- `CHECK TABLE` é uma operação válida em uma tabela de log.
- `LOCK TABLES` não pode ser usado numa tabela de log.
- `INSERT`, `DELETE`, e `UPDATE` não podem ser usados em uma tabela de log. Estas operações são permitidas apenas internamente no próprio servidor.
- O `FLUSH TABLES WITH READ LOCK` e o estado da variável do sistema `read_only` não têm efeito nas tabelas de log. O servidor sempre pode escrever nas tabelas de log.
- As entradas escritas nas tabelas de log não são escritas no log binário e, portanto, não são replicadas em réplicas.
- Para limpar as tabelas de log ou arquivos de log, use `FLUSH TABLES` ou `FLUSH LOGS`, respectivamente.
- Não é permitida a partição das tabelas de registo.
- Um despejo `mysqldump` inclui instruções para recriar essas tabelas para que elas não estejam faltando após o recarregamento do arquivo de despejo. O conteúdo da tabela de log não é despejado.
