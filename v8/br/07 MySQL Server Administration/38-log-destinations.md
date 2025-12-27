### 7.4.1 Selecionando destinos de saída do Log de Consultas Gerais e do Log de Consultas Lentas

O MySQL Server oferece controle flexível sobre o destino da saída escrita no log de consultas gerais e no log de consultas lentas, se esses logs estiverem habilitados. Os possíveis destinos para as entradas do log são arquivos de log ou as tabelas `general_log` e `slow_log` no banco de dados do sistema `mysql`. Pode ser selecionado a saída de arquivo, a saída de tabela ou ambas.

* Controle de Log ao Iniciar o Servidor
* Controle de Log em Tempo Real
* Benefícios e Características das Tabelas de Log

#### Controle de Log ao Iniciar o Servidor

A variável de sistema `log_output` especifica o destino para a saída do log. Definir essa variável não habilita os logs por si só; eles devem ser habilitados separadamente.

* Se `log_output` não for especificado ao iniciar, o destino de log padrão é `FILE`.
* Se `log_output` for especificado ao iniciar, seu valor é uma lista de uma ou mais palavras separadas por vírgula escolhidas entre `TABLE` (log em tabelas), `FILE` (log em arquivos) ou `NONE` (não log em tabelas ou arquivos). `NONE`, se presente, tem precedência sobre quaisquer outros especificadores.

A variável de sistema `general_log` controla o registro no log de consultas gerais para os destinos de log selecionados. Se especificada ao iniciar o servidor, `general_log` aceita um argumento opcional de 1 ou 0 para habilitar ou desabilitar o log. Para especificar um nome de arquivo diferente do padrão para o registro em arquivos, defina a variável `general_log_file`. Da mesma forma, a variável `slow_query_log` controla o registro no log de consultas lentas para os destinos selecionados e definir `slow_query_log_file` especifica um nome de arquivo para o registro em arquivos. Se qualquer um dos logs estiver habilitado, o servidor abre o arquivo de log correspondente e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre a menos que o destino de log `FILE` seja selecionado.

Exemplos:

* Para escrever entradas de log de consulta geral na tabela de log e no arquivo de log, use `--log_output=TABLE,FILE` para selecionar tanto os destinos de log quanto `--general_log` para habilitar o log de consulta geral.
* Para escrever apenas entradas de log de consulta geral e lenta nas tabelas de log, use `--log_output=TABLE` para selecionar tabelas como destino de log e `--general_log` e `--slow_query_log` para habilitar ambos os logs.
* Para escrever apenas entradas de log de consulta lenta no arquivo de log, use `--log_output=FILE` para selecionar arquivos como destino de log e `--slow_query_log` para habilitar o log de consulta lenta. Neste caso, como o destino de log padrão é `FILE`, você pode omitir a configuração `log_output`.

#### Controle de Log em Tempo Real

As variáveis de sistema associadas às tabelas e arquivos de log permitem o controle em tempo real sobre o registro:

* A variável `log_output` indica o destino atual de registro. Ela pode ser modificada em tempo real para alterar o destino.
* As variáveis `general_log` e `slow_query_log` indicam se o log de consulta geral e o log de consulta lenta estão habilitados (`ON`) ou desabilitados (`OFF`). Você pode definir essas variáveis em tempo real para controlar se os logs estão habilitados.
* As variáveis `general_log_file` e `slow_query_log_file` indicam os nomes dos arquivos de log de consulta geral e lento. Você pode definir essas variáveis no início do servidor ou em tempo real para alterar os nomes dos arquivos de log.
* Para desabilitar ou habilitar o registro de consulta geral para a sessão atual, defina a variável `sql_log_off` da sessão para `ON` ou `OFF`. (Isso assume que o log de consulta geral em si está habilitado.)

#### Benefícios e Características das Tabelas de Log

O uso de tabelas para saída de log oferece os seguintes benefícios:

* As entradas de log têm um formato padrão. Para exibir a estrutura atual das tabelas de log, use estas instruções:

```
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```
* O conteúdo dos logs é acessível por meio de instruções SQL. Isso permite o uso de consultas que selecionam apenas as entradas de log que satisfazem critérios específicos. Por exemplo, para selecionar o conteúdo do log associado a um cliente específico (o que pode ser útil para identificar consultas problemáticas desse cliente), é mais fácil fazer isso usando uma tabela de log do que um arquivo de log.
* Os logs são acessíveis remotamente por meio de qualquer cliente que possa se conectar ao servidor e emitir consultas (se o cliente tiver os privilégios apropriados para a tabela de log). Não é necessário fazer login no host do servidor e acessar diretamente o sistema de arquivos.

A implementação das tabelas de log tem as seguintes características:

* Em geral, o propósito principal das tabelas de log é fornecer uma interface para os usuários observarem a execução em tempo real do servidor, e não interferir em sua execução em tempo real.
* `CREATE TABLE`, `ALTER TABLE` e `DROP TABLE` são operações válidas em uma tabela de log. Para `ALTER TABLE` e `DROP TABLE`, a tabela de log não pode estar em uso e deve ser desabilitada, conforme descrito mais adiante.
* Por padrão, as tabelas de log usam o mecanismo de armazenamento `CSV`, que escreve os dados no formato de valores separados por vírgula. Para usuários que têm acesso aos arquivos `.CSV` que contêm dados da tabela de log, os arquivos são fáceis de importar em outros programas, como planilhas, que podem processar entrada CSV.

As tabelas de log podem ser alteradas para usar o mecanismo de armazenamento `MyISAM`. Não é possível usar `ALTER TABLE` para alterar uma tabela de log que esteja em uso. A log deve ser desabilitada primeiro. Nenhum mecanismo, além de `CSV` ou `MyISAM`, é legal para as tabelas de log.

**Tabelas de Log e Erros de “Muitos arquivos abertos”.**

Se você selecionar `TABLE` como destino de log e as tabelas de log usarem o mecanismo de armazenamento `CSV`, você pode encontrar que desabilitar e reativar o log de consultas gerais ou o log de consultas lentas repetidamente durante a execução resulta em vários descritores de arquivo abertos para o arquivo `.CSV`, possivelmente resultando em um erro de “Too many open files”. Para contornar esse problema, execute `FLUSH TABLES` ou garanta que o valor de `open_files_limit` seja maior que o valor de `table_open_cache_instances`.

* Para desabilitar o registro, para que você possa alterar (ou descartar) uma tabela de log, você pode usar a seguinte estratégia. O exemplo usa o log de consultas gerais; o procedimento para o log de consultas lentas é semelhante, mas usa a tabela `slow_log` e a variável de sistema `slow_query_log`.

  ```
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```VSwJDL5HW0
* `CHECK TABLE` é uma operação válida em uma tabela de log.
* `LOCK TABLES` não pode ser usado em uma tabela de log.
* `INSERT`, `DELETE` e `UPDATE` não podem ser usados em uma tabela de log. Essas operações são permitidas apenas internamente ao próprio servidor.
* `FLUSH TABLES WITH READ LOCK` e o estado da variável de sistema `read_only` não têm efeito em tabelas de log. O servidor sempre pode escrever nas tabelas de log.
* As entradas escritas nas tabelas de log não são escritas no log binário e, portanto, não são replicadas para réplicas.
* Para esvaziar as tabelas de log ou os arquivos de log, use `FLUSH TABLES` ou `FLUSH LOGS`, respectivamente.
* A partição de tabelas de log não é permitida.
* Um dump `mysqldump` inclui instruções para recriar essas tabelas para que não faltem após a recarga do arquivo de dump. O conteúdo das tabelas de log não é dumpado.