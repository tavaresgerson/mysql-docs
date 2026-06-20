## 5.4 Registros do MySQL Server

O MySQL Server tem vários logs que podem ajudá-lo a descobrir quais atividades estão ocorrendo.

<table summary="MySQL Server log types and the information written to each log.">
<col style="width: 30%"/>
<col style="width: 70%"/>
<thead>
<tr>
<th>Tipo de registro</th>
<th>Informações escritas no log</th>
</tr>
</thead>
<tbody>
<tr>
<td>Diário de erros</td>
<td>Problemas encontrados ao iniciar, executar ou parar<strong>mysqld</strong></td>
</tr>
<tr>
<td>Registro de consulta geral</td>
<td>Conexões com clientes estabelecidas e declarações recebidas dos clientes</td>
</tr>
<tr>
<td>Registro binário</td>
<td>Declarações que alteram dados (também utilizadas para replicação)</td>
</tr>
<tr>
<td>Registro de relé</td>
<td>Alterações de dados recebidas de um servidor de fonte de replicação</td>
</tr>
<tr>
<td>Registro de consultas lentas</td>
<td>Consultas que levaram mais de<code>long_query_time</code>segundos para executar</td>
</tr>
<tr>
<td>Registro do DDL (registro de metadados)</td>
<td>Operações de metadados realizadas por declarações DDL</td>
</tr>
</tbody>
</table>

Por padrão, nenhum registro é habilitado, exceto o registro de erro no Windows. (O registro DDL é sempre criado quando necessário e não possui opções configuráveis pelo usuário; consulte Seção 5.4.6, “O registro DDL”.) As seções específicas de log a seguir fornecem informações sobre as opções do servidor que habilitam o registro.

Por padrão, o servidor escreve arquivos para todos os logs habilitados no diretório de dados. Você pode forçar o servidor a fechar e reabrir os arquivos de log (ou, em alguns casos, alternar para um novo arquivo de log) ao limpar os logs. A limpeza de logs ocorre quando você emite uma declaração `FLUSH LOGS`; execute **mysqladmin** com um argumento `flush-logs` ou `refresh`; ou execute **mysqldump** com uma opção `--flush-logs`. Veja a Seção 13.7.6.3, “Declaração FLUSH”, Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”, e Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”. Além disso, o log binário é limpo quando seu tamanho atinge o valor da variável de sistema `max_binlog_size`.

Você pode controlar os registros de consulta geral e de consulta lenta durante a execução. Você pode habilitar ou desabilitar o registro, ou alterar o nome do arquivo de registro. Você pode informar ao servidor que escreva as entradas de consulta geral e de consulta lenta em tabelas de registro, arquivos de registro ou em ambos. Para obter detalhes, consulte a Seção 5.4.1, “Selecionando destinos de saída de registro de consulta geral e de consulta lenta”, a Seção 5.4.3, “O registro de consulta geral”, e a Seção 5.4.5, “O registro de consulta lenta”.

O registro de relevo é usado apenas em réplicas, para manter as alterações de dados do servidor de origem de replicação que também devem ser feitas na réplica. Para discussão sobre o conteúdo e a configuração do registro de relevo, consulte a Seção 16.2.4.1, “O Registro de Relevo”.

Para informações sobre operações de manutenção de logs, como a expiração de arquivos antigos de log, consulte a Seção 5.4.7, “Manutenção de logs do servidor”.

Para informações sobre como manter os registros seguros, consulte a Seção 6.1.2.3, “Senhas e Registro”.

### 5.4.1 Selecionando destinos de saída do Log de consulta geral e do Log de consulta lenta

O MySQL Server oferece controle flexível sobre o destino do resultado escrito no log de consulta geral e no log de consultas lentas, se esses logs estiverem habilitados. Os possíveis destinos para as entradas do log são arquivos de registro ou as tabelas `general_log` e `slow_log` no banco de dados do sistema `mysql`. Pode-se selecionar saída de arquivo, saída de tabela ou ambas.

* Controle de registro no início da inicialização do servidor
* Controle de registro no runtime
* Benefícios e características da tabela de registro

#### Controle de registro no início do servidor

A variável de sistema `log_output` especifica o destino para a saída de log. Definir essa variável não habilita os logs por si só; eles devem ser habilitados separadamente.

* Se `log_output` não for especificado na inicialização, o destino de registro padrão é `FILE`.

* Se `log_output` for especificado na inicialização, seu valor é uma lista com uma ou mais palavras separadas por vírgula escolhidas de `TABLE` (registro em tabelas), `FILE` (registro em arquivos) ou `NONE` (não registre em tabelas ou arquivos). `NONE`, se presente, tem precedência sobre qualquer outro especificador.

A variável de sistema `general_log` controla o registro no log de consulta geral para os destinos de registro selecionados. Se especificada na inicialização do servidor, `general_log` aceita um argumento opcional de 1 ou 0 para habilitar ou desabilitar o registro. Para especificar um nome de arquivo diferente do padrão para o registro de arquivos, defina a variável `general_log_file`. Da mesma forma, a variável `slow_query_log` controla o registro no log de consulta lenta para os destinos selecionados e a definição de `slow_query_log_file` especifica um nome de arquivo para o registro de arquivos. Se qualquer um dos logs estiver habilitado, o servidor abre o arquivo de registro correspondente e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre a menos que o destino de registro `FILE` seja selecionado.

Exemplos:

* Para escrever entradas de registro de consulta geral na tabela de registro e no arquivo de registro, use `--log_output=TABLE,FILE` para selecionar ambos os destinos de registro e `--general_log` para habilitar o registro de consulta geral.

* Para escrever entradas de registro de consulta geral e lenta apenas nas tabelas de registro, use `--log_output=TABLE` para selecionar as tabelas como destino do registro e `--general_log` e `--slow_query_log` para habilitar ambos os registros.

* Para escrever entradas de registro de consulta lenta apenas no arquivo de registro, use `--log_output=FILE` para selecionar os arquivos como destino do registro e `--slow_query_log` para habilitar o registro de consulta lenta. Nesse caso, como o destino de registro padrão é `FILE`, você pode omitir a configuração `log_output`.

#### Controle de registro em tempo de execução

As variáveis do sistema associadas às tabelas e arquivos de registro permitem o controle de execução sobre o registro:

* A variável `log_output` indica o destino atual de registro. Ela pode ser modificada em tempo real para alterar o destino.

* As variáveis `general_log` e `slow_query_log` indicam se o log de consulta geral e o log de consulta lenta estão habilitados (`ON`) ou desabilitados (`OFF`). Você pode definir essas variáveis no momento da execução para controlar se os logs estão habilitados.

* As variáveis `general_log_file` e `slow_query_log_file` indicam os nomes dos arquivos de log de consulta geral e de consulta lenta. Você pode definir essas variáveis no início do servidor ou no runtime para alterar os nomes dos arquivos de log.

* Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`. (Isso pressupõe que o próprio registro de consulta geral esteja habilitado.)

#### Benefícios e características da tabela de registro

O uso de tabelas para saída de log oferece os seguintes benefícios:

* As entradas do log têm um formato padrão. Para exibir a estrutura atual das tabelas do log, use essas declarações:

  ```sql
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```

* O conteúdo do log é acessível por meio de declarações SQL. Isso permite o uso de consultas que selecionam apenas as entradas do log que satisfazem critérios específicos. Por exemplo, para selecionar o conteúdo do log associado a um cliente em particular (o que pode ser útil para identificar consultas problemáticas desse cliente), é mais fácil fazer isso usando uma tabela de log do que um arquivo de log.

* Os logs são acessíveis remotamente por qualquer cliente que possa se conectar ao servidor e emitir consultas (se o cliente tiver os privilégios apropriados para a tabela de logs). Não é necessário fazer login no host do servidor e acessar diretamente o sistema de arquivos.

A implementação da tabela de registro tem as seguintes características:

* Em geral, o propósito principal das tabelas de registro é fornecer uma interface para que os usuários observem a execução em tempo real do servidor, e não interferir na sua execução em tempo real.

* `CREATE TABLE`, `ALTER TABLE` e `DROP TABLE` são operações válidas em uma tabela de registro. Para `ALTER TABLE` e `DROP TABLE`, a tabela de registro não pode ser usada e deve ser desativada, conforme descrito mais adiante.

* Por padrão, as tabelas de registro utilizam o mecanismo de armazenamento `CSV`, que escreve os dados no formato de valores separados por vírgula. Para os usuários que têm acesso aos arquivos `.CSV` que contêm dados de tabela de registro, os arquivos são fáceis de importar em outros programas, como planilhas que podem processar entrada CSV.

As tabelas de log podem ser alteradas para usar o mecanismo de armazenamento `MyISAM`. Não é possível usar `ALTER TABLE` para alterar uma tabela de log que esteja em uso. O log deve ser desativado primeiro. Outros motores, além de `CSV` ou `MyISAM`, não são legais para as tabelas de log.

**Tabelas de registro e erros de "Demasiados arquivos abertos". Se você selecionar `TABLE` como destino de registro e as tabelas de registro utilizarem o mecanismo de armazenamento `CSV`, pode ocorrer que desabilitar e reabilitar o registro de consultas gerais ou o registro de consultas lentas repetidamente durante a execução resulte em vários descritores de arquivo abertos para o arquivo `.CSV`, possivelmente resultando em um erro de "Demasiados arquivos abertos". Para resolver esse problema, execute `FLUSH TABLES` ou garanta que o valor de `open_files_limit` seja maior que o valor de `table_open_cache_instances`.

* Para desativar o registro, de modo que você possa alterar (ou descartar) uma tabela de registro, você pode usar a seguinte estratégia. O exemplo usa o registro de consulta geral; o procedimento para o registro de consulta lenta é semelhante, mas usa a tabela `slow_log` e a variável de sistema `slow_query_log`.

  ```sql
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```

* `TRUNCATE TABLE` é uma operação válida em uma tabela de log. Pode ser usada para expirar entradas de log.

* `RENAME TABLE` é uma operação válida em uma tabela de registro. Você pode renomear atômica e silenciosamente uma tabela de registro (para realizar rotação de registro, por exemplo) usando a seguinte estratégia:

  ```sql
  USE mysql;
  DROP TABLE IF EXISTS general_log2;
  CREATE TABLE general_log2 LIKE general_log;
  RENAME TABLE general_log TO general_log_backup, general_log2 TO general_log;
  ```

* `CHECK TABLE` é uma operação válida em uma tabela de registro.

* `LOCK TABLES` não pode ser usado em uma tabela de registro.

* `INSERT`, `DELETE` e `UPDATE` não podem ser usados em uma tabela de registro. Essas operações são permitidas apenas internamente no próprio servidor.

* `FLUSH TABLES WITH READ LOCK` e o estado da variável de sistema `read_only` não afetam as tabelas de log. O servidor sempre pode escrever nas tabelas de log.

* As entradas escritas nas tabelas de log não são escritas no log binário e, portanto, não são replicadas para réplicas.

* Para limpar as tabelas de registro ou arquivos de registro, use `FLUSH TABLES` ou `FLUSH LOGS`, respectivamente.

* A partição de tabelas de log não é permitida.
  
* O **mysqldump** inclui declarações para recriar essas tabelas, para que não faltem após a recarga do arquivo de dump. O conteúdo das tabelas de log não é descarregado.

### 5.4.2 O Diálogo de Erros

Esta seção discute como configurar o servidor MySQL para registro de mensagens de diagnóstico no log de erro. Para informações sobre a seleção do conjunto de caracteres e idioma da mensagem de erro, consulte a Seção 10.6, “Conjunto de caracteres da mensagem de erro”, e a Seção 10.12, “Definindo o idioma da mensagem de erro”.

O log de erro contém um registro dos tempos de inicialização e desligamento do `mysqld`. Também contém mensagens de diagnóstico, como erros, avisos e notas que ocorrem durante a inicialização e o desligamento do servidor, e enquanto o servidor está em execução. Por exemplo, se o `mysqld` perceber que uma tabela precisa ser verificada ou reparada automaticamente, ele escreve uma mensagem no log de erro.

Em alguns sistemas operacionais, o log de erro contém uma traçada de pilha se o `mysqld` sair anormalmente. A traçada pode ser usada para determinar onde o `mysqld` saiu. Veja a Seção 5.8, “Depuração do MySQL”.

Se usado para iniciar `mysqld`, `mysqld_safe` pode escrever mensagens no log de erro. Por exemplo, quando `mysqld_safe` detecta saídas anormais de `mysqld`, ele reinicia `mysqld` e escreve uma mensagem de `mysqld restarted` no log de erro.

As seções a seguir discutem aspectos da configuração do registro de erros. Na discussão, “console” significa `stderr`, a saída padrão de erro. Este é seu terminal ou janela de console, a menos que a saída padrão de erro tenha sido redirecionada para um destino diferente.

O servidor interpreta as opções que determinam onde escrever mensagens de erro de maneira um tanto diferente para sistemas Windows e Unix. Certifique-se de configurar o registro de erros usando as informações apropriadas para sua plataforma.

#### 5.4.2.1 Registro de erros no Windows

Em Windows, `mysqld` usa as opções `--log-error`, `--pid-file` e `--console` para determinar se `mysqld` escreve o log de erro no console ou em um arquivo, e, se em um arquivo, o nome do arquivo:

* Se `--console` for fornecido, `mysqld` escreve o log de erro no console. (`--console` tem precedência sobre `--log-error` se ambos forem fornecidos, e os seguintes itens em relação a `--log-error` não se aplicam. Antes do MySQL 5.7, isso é invertido: `--log-error` tem precedência sobre `--console`.))

* Se `--log-error` não for fornecido, ou for fornecido sem nomear um arquivo, `mysqld` escreve o log de erro em um arquivo denominado `host_name.err` no diretório de dados, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo PID com um sufixo de `.err` no diretório de dados.

* Se `--log-error` for fornecido para nomear um arquivo, `mysqld` escreve o log de erro nesse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

Se o servidor escrever o log de erro no console, ele define a variável de sistema `log_error` para `stderr`. Caso contrário, o servidor escreve o log de erro em um arquivo e define `log_error` para o nome do arquivo.

Além disso, o servidor, por padrão, escreve eventos e mensagens de erro no Registro de eventos do Windows dentro do log de Aplicação:

* As entradas marcadas como `Error`, `Warning` e `Note` são escritas no Diário de eventos, mas não as mensagens, como as declarações de informações dos motores de armazenamento individuais.

* As entradas do Diário de eventos têm uma fonte de `MySQL`.
* As informações escritas no Diário de eventos são controladas usando a variável de sistema `log_syslog`, que, no Windows, é ativada por padrão. Veja a Seção 5.4.2.3, “Registro de erro no Diário de sistema”.

#### 5.4.2.2 Registro de erros em sistemas Unix e Unix-like

Em sistemas Unix e Unix-like, `mysqld` usa a opção `--log-error` para determinar se `mysqld` escreve o log de erro na consola ou num ficheiro, e, se para um ficheiro, o nome do ficheiro:

* Se `--log-error` não for fornecido, `mysqld` escreve o log de erro no console.

* Se `--log-error` for fornecido sem nomear um arquivo, `mysqld` escreve o log de erro em um arquivo denominado `host_name.err` no diretório de dados.

* Se `--log-error` for fornecido para nomear um arquivo, `mysqld` escreve o log de erro nesse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar uma localização diferente.

* Se `--log-error` for fornecido em um arquivo de opções em uma seção de `[mysqld]`, `[server]` ou `[mysqld_safe]`, em sistemas que usam `mysqld_safe` para iniciar o servidor, `mysqld_safe` encontra e usa a opção e a passa para `mysqld`.

Nota

É comum que as instalações de pacotes Yum ou APT configurem um local de arquivo de registro de erro em `/var/log` com uma opção como `log-error=/var/log/mysqld.log` em um arquivo de configuração do servidor. A remoção do nome do caminho da opção faz com que o arquivo `host_name.err` no diretório de dados seja usado.

Se o servidor escrever o log de erro no console, ele define a variável de sistema `log_error` para `stderr`. Caso contrário, o servidor escreve o log de erro em um arquivo e define `log_error` com o nome do arquivo.

#### 5.4.2.3 Registro de erros no log do sistema

É possível fazer com que `mysqld` escreva o log de erro no log do sistema (o Diálogo de Eventos no Windows e `syslog` em sistemas Unix e Unix-like). Para fazer isso, use essas variáveis do sistema:

* `log_syslog`: Ative esta variável para enviar o log de erro ao log do sistema. (Em Windows, `log_syslog` é ativado por padrão.)

Se `log_syslog` estiver habilitado, as seguintes variáveis do sistema também podem ser usadas para um controle mais preciso.

* `log_syslog_facility`: A instalação padrão para as mensagens de `syslog` é `daemon`. Estabeleça essa variável para especificar uma instalação diferente.

* `log_syslog_include_pid`: Se deve incluir o ID do processo do servidor em cada string do `syslog` de saída.

* `log_syslog_tag`: Esta variável define uma etiqueta a ser adicionada ao identificador do servidor (`mysqld`) nas mensagens de `syslog`. Se definida, a etiqueta é anexada ao identificador com um hífen inicial.

Nota

O registro de erros no log do sistema pode exigir configuração adicional do sistema. Consulte a documentação do log do sistema para sua plataforma.

Em sistemas Unix e semelhantes, o controle de saída para `syslog` também está disponível usando `mysqld_safe`, que pode capturar a saída de erro do servidor e passá-la para `syslog`.

Nota

O uso de `mysqld_safe` para registro de erros de `syslog` é desaconselhado; você deve usar as variáveis do sistema do servidor em vez disso.

`mysqld_safe` tem três opções de registro de erros, `--syslog`, `--skip-syslog` e `--log-error`. A opção padrão sem opções de registro ou com `--skip-syslog` é usar o arquivo de registro padrão. Para especificar explicitamente o uso de um arquivo de registro de erros, especifique `--log-error=file_name` a `mysqld_safe`, que, em seguida, organiza para que `mysqld` escreva mensagens em um arquivo de registro. Para usar `syslog`, especifique a opção `--syslog`. Para a saída de `syslog`, uma tag pode ser especificada com `--syslog-tag=tag_val`; isso é anexado ao identificador do servidor `mysqld` com um hífen na frente.

#### 5.4.2.4 Filtragem do Log de Erro

A variável de sistema `log_error_verbosity` controla a verbosidade do servidor para escrever mensagens de erro, aviso e nota no log de erro. Os valores permitidos são 1 (erros apenas), 2 (erros e avisos), 3 (erros, avisos e notas), com um valor padrão de 3. Se o valor for maior que 2, o servidor registra conexões abortadas e erros de negação de acesso para novas tentativas de conexão. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

#### 5.4.2.5 Formato do registro de erro

O ID incluído nas mensagens do log de erro é o do thread dentro de `mysqld` responsável por escrever a mensagem. Isso indica qual parte do servidor produziu a mensagem, e é consistente com as mensagens gerais do log de consulta e do log de consulta lenta, que incluem o ID do thread de conexão.

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps em mensagens escritas no log de erro (assim como nos arquivos de log de consulta geral e log de consulta lenta).

Os valores permitidos `log_timestamps` são `UTC` (padrão) e `SYSTEM` (fuso horário do sistema local). Os timestamps são escritos usando o formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` que indica o horário Zulu (UTC) ou `±hh:mm` (um deslocamento que indica o ajuste do fuso horário do sistema local em relação ao UTC). Por exemplo:

```sql
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```

#### 5.4.2.6 Limpeza e renomeação do arquivo de registro de erro

Se você limpar o log de erro usando uma declaração `FLUSH ERROR LOGS` ou `FLUSH LOGS`, ou um comando **mysqladmin flush-logs**, o servidor fecha e reabre qualquer arquivo de log de erro para o qual está escrevendo. Para renomear um arquivo de log de erro, faça isso manualmente antes de limpar. A limpeza dos logs então abre um novo arquivo com o nome do arquivo original. Por exemplo, assumindo um nome de arquivo de log de `host_name.err`, use os seguintes comandos para renomear o arquivo e criar um novo:

```sql
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

Em Windows, use **rename** em vez de **mv**.

Se o local do arquivo de registro de erro não for legível pelo servidor, a operação de limpeza do log não cria um novo arquivo de registro. Por exemplo, no Linux, o servidor pode escrever o log de erro no arquivo `/var/log/mysqld.log`, onde o diretório `/var/log` é de propriedade de `root` e não é legível por `mysqld`. Para obter informações sobre como lidar com esse caso, consulte a Seção 5.4.7, “Manutenção do Log do Servidor”.

Se o servidor não estiver escrevendo em um arquivo de registro de erro nomeado, não ocorrerá renomeamento de arquivo de registro de erro quando o registro de erro for esvaziado.

### 5.4.3 O Log de Consulta Geral

O log de consulta geral é um registro geral do que o `mysqld` está fazendo. O servidor escreve informações neste log quando os clientes se conectam ou desconectam, e ele registra cada declaração SQL recebida dos clientes. O log de consulta geral pode ser muito útil quando você suspeita de um erro em um cliente e quer saber exatamente o que o cliente enviou para o `mysqld`.

Cada string que mostra quando um cliente se conecta também inclui `using connection_type` para indicar o protocolo usado para estabelecer a conexão. *`connection_type`* é um dos `TCP/IP` (conexão TCP/IP estabelecida sem SSL), `SSL/TLS` (conexão TCP/IP estabelecida com SSL), `Socket` (conexão de arquivo de soquete Unix), `Named Pipe` (conexão de canal nomeado do Windows), ou `Shared Memory` (conexão de memória compartilhada do Windows).

`mysqld` escreve declarações no log de consulta na ordem em que as recebe, o que pode diferir da ordem em que são executadas. Esse registro em ordem é em contraste com o log binário, para o qual as declarações são escritas após serem executadas, mas antes de quaisquer bloqueios serem liberados. Além disso, o log de consulta pode conter declarações que selecionam apenas dados, enquanto essas declarações nunca são escritas no log binário.

Ao usar o registro binário baseado em declarações em um servidor de fonte de replicação, as declarações recebidas por suas réplicas são escritas no log de consulta de cada réplica. As declarações são escritas no log de consulta da fonte se um cliente ler eventos com o utilitário **mysqlbinlog** e os passar para o servidor.

No entanto, ao usar o registro binário baseado em strings, as atualizações são enviadas como alterações de string, em vez de declarações SQL, e, portanto, essas declarações nunca são escritas no registro de consulta quando `binlog_format` está em `ROW`. Uma atualização dada também pode não ser escrita no registro de consulta quando essa variável está definida em `MIXED`, dependendo da declaração usada. Consulte a Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Strings”, para mais informações.

Por padrão, o log de consulta geral é desativado. Para especificar explicitamente o estado inicial do log de consulta geral, use `--general_log[={0|1}]`. Sem argumento ou com um argumento de 1, `--general_log` habilita o log. Com um argumento de 0, esta opção desativa o log. Para especificar o nome do arquivo de log, use `--general_log_file=file_name`. Para especificar o destino do log, use a variável de sistema `log_output` (como descrito na Seção 5.4.1, “Selecionando destinos de saída de log de consulta geral e log de consulta lenta”).

Nota

Se você especificar o destino do log `TABLE`, consulte Tabelas de log e Erros de “Existem muitos arquivos abertos”.

Se você não especificar um nome para o arquivo de registro de consulta geral, o nome padrão é `host_name.log`. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o log de consulta geral ou alterar o nome do arquivo de registro no tempo real, use as variáveis de sistema globais `general_log` e `general_log_file`. Defina `general_log` para 0 (ou `OFF`) para desabilitar o log ou para 1 (ou `ON`) para habilitá-lo. Defina `general_log_file` para especificar o nome do arquivo de registro. Se um arquivo de registro já estiver aberto, ele será fechado e o novo arquivo será aberto.

Quando o log de consulta geral é habilitado, o servidor escreve a saída para quaisquer destinos especificados pela variável de sistema `log_output`. Se você habilitar o log, o servidor abre o arquivo de log e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino de log `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve consultas, mesmo que o log geral seja habilitado. Definir o nome do arquivo de log não tem efeito no registro se o valor do destino de log não contiver `FILE`.

O reinício do servidor e o esvaziamento do log não geram um novo arquivo de log de consulta geral (embora o esvaziamento o feche e o abra novamente). Para renomear o arquivo e criar um novo, use os seguintes comandos:

```sql
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

Em Windows, use **rename** em vez de **mv**.

Você também pode renomear o arquivo de log de consulta geral durante a execução, desabilitando o log:

```sql
SET GLOBAL general_log = 'OFF';
```

Com o registro desativado, renomeie o arquivo de registro externamente (por exemplo, a partir da string de comando). Em seguida, ative o registro novamente:

```sql
SET GLOBAL general_log = 'ON';
```

Esse método funciona em qualquer plataforma e não requer o reinício do servidor.

Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`. (Isso pressupõe que o próprio registro de consulta geral esteja habilitado.)

As senhas em declarações escritas no log de consulta geral são reescritas pelo servidor para não ocorrerem literalmente em texto simples. A reescrita de senhas pode ser suprimida para o log de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas, por razões de segurança, não é recomendada para uso em produção. Veja também a Seção 6.1.2.3, “Senhas e Registro”.

Uma implicação da reescrita de senhas é que as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consulta geral, porque não é possível saber se elas estão livres de senha. Os casos de uso que exigem o registro de todas as declarações, incluindo aquelas com erros, devem usar a opção `--log-raw`, tendo em mente que isso também contorce a reescrita de senha.

A reescrita da senha ocorre apenas quando se espera senhas em texto simples. Para declarações com sintaxe que esperam um valor de hash de senha, não ocorre reescrita. Se uma senha em texto simples for fornecida erroneamente para tal sintaxe, a senha é registrada como fornecida, sem reescrita. Por exemplo, a seguinte declaração é registrada conforme mostrado porque um valor de hash de senha é esperado:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

A variável de sistema `log_timestamps` controla a zona horária dos timestamps nas mensagens escritas no arquivo de log de consulta geral (assim como no arquivo de log de consultas lentas e no log de erros). Não afeta a zona horária das mensagens de log de consulta geral e log de consultas lentas escritas em tabelas de log, mas as strings recuperadas dessas tabelas podem ser convertidas da zona horária do sistema local para qualquer zona horária desejada com `CONVERT_TZ()` ou definindo a variável de sessão `time_zone`.

### 5.4.4 O Log Binário

O log binário contém “eventos” que descrevem as mudanças no banco de dados, como operações de criação de tabelas ou alterações nos dados da tabela. Também contém eventos para declarações que potencialmente poderiam ter feito alterações (por exemplo, um `DELETE` que não encontrou nenhuma string), a menos que o registro baseado em string seja usado. O log binário também contém informações sobre quanto tempo cada declaração levou para atualizar os dados. O log binário tem dois propósitos importantes:

* Para a replicação, o log binário em um servidor de origem de replicação fornece um registro das alterações de dados que serão enviadas para as réplicas. A fonte envia os eventos contidos em seu log binário para suas réplicas, que executam esses eventos para realizar as mesmas alterações de dados que foram feitas na fonte. Veja a Seção 16.2, “Implementação de Replicação”.

* Algumas operações de recuperação de dados exigem o uso do log binário. Após a restauração de um backup, os eventos no log binário que foram registrados após a criação do backup são reexecutados. Esses eventos atualizam as bases de dados a partir do ponto do backup. Veja a Seção 7.5, “Recuperação Ponto no Tempo (Incremental)” (Recuperação).

O log binário não é usado para declarações como `SELECT` ou `SHOW` que não modificam dados. Para registrar todas as declarações (por exemplo, para identificar uma consulta com problema), use o log de consulta geral. Veja a Seção 5.4.3, “O log de consulta geral”.

Executar um servidor com registro binário ativado faz com que o desempenho seja ligeiramente mais lento. No entanto, os benefícios do registro binário, que permitem configurar a replicação e as operações de restauração, geralmente superam esse pequeno decréscimo de desempenho.

O log binário é geralmente resistente a interrupções inesperadas, pois apenas as transações completas são registradas ou lidas novamente. Consulte a Seção 16.3.2, “Tratamento de uma interrupção inesperada de uma réplica”, para obter mais informações.

As senhas em declarações escritas no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. Veja também a Seção 6.1.2.3, “Senhas e Registro”.

A discussão a seguir descreve algumas das opções e variáveis do servidor que afetam o funcionamento do registro binário. Para uma lista completa, consulte a Seção 16.1.6.4, “Opções e variáveis de registro binário”.

Para habilitar o log binário, inicie o servidor com a opção `--log-bin[=base_name]`. Se não for fornecido um valor de *`base_name`*, o nome padrão é o valor da opção `--pid-file` (que, por padrão, é o nome da máquina hospedeira) seguido de `-bin`. Se o nome base for fornecido, o servidor escreve o arquivo no diretório de dados, a menos que o nome base seja fornecido com um nome de caminho absoluto inicial para especificar um diretório diferente. É recomendável especificar um nome base explicitamente em vez de usar o nome padrão do nome do host; consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”, para o motivo.

Se você fornecer uma extensão no nome do log (por exemplo, `--log-bin=base_name.extension`,) a extensão é silenciosamente removida e ignorada.

`mysqld` adiciona uma extensão numérica ao nome da base de registro binário para gerar nomes de arquivos de registro binário. O número aumenta cada vez que o servidor cria um novo arquivo de registro, criando assim uma série ordenada de arquivos. O servidor cria um novo arquivo na série cada vez que ocorre qualquer um dos seguintes eventos:

* O servidor é iniciado ou reiniciado. * O servidor esvazia os registros. * O tamanho do arquivo de registro atual atinge `max_binlog_size`.

Um arquivo de registro binário pode se tornar maior que `max_binlog_size` se você estiver usando transações grandes, porque uma transação é escrita no arquivo de uma só vez, nunca dividida entre arquivos.

Para acompanhar quais arquivos de registro binários foram utilizados, o `mysqld` também cria um arquivo de índice de registro binário que contém os nomes dos arquivos de registro binário. Por padrão, este tem o mesmo nome de base que o arquivo de registro binário, com a extensão `'.index'`. Você pode alterar o nome do arquivo de índice de registro binário com a opção `--log-bin-index[=file_name]`. Você não deve editar manualmente este arquivo enquanto o `mysqld` estiver em execução; fazer isso confundiriria o `mysqld`.

O termo "arquivo de registro binário" geralmente denota um arquivo numerado individual que contém eventos de banco de dados. O termo "registro binário" denota coletivamente o conjunto de arquivos de registro binário numerados, mais o arquivo de índice.

Um cliente que possui privilégios suficientes para definir variáveis de sistema de sessão restritas (consulte a Seção 5.1.8.1, “Privilégios de variáveis de sistema”) pode desativar o registro binário de suas próprias declarações usando uma declaração `SET sql_log_bin=OFF`.

Por padrão, o servidor registra o comprimento do evento, bem como o próprio evento e usa isso para verificar se o evento foi escrito corretamente. Você também pode fazer com que o servidor escreva verificações de checksums para os eventos, configurando a variável de sistema `binlog_checksum`. Ao ler de volta do log binário, a fonte usa o comprimento do evento por padrão, mas pode ser feito para usar verificações de checksums, se disponíveis, ao habilitar a variável de sistema `master_verify_checksum`. O thread de I/O de replicação também verifica eventos recebidos da fonte. Você pode fazer com que o thread de SQL de replicação use verificações de checksums, se disponíveis, ao ler do log de releio, ao habilitar a variável de sistema `slave_sql_verify_checksum`.

O formato dos eventos registrados no log binário depende do formato de registro binário. Três tipos de formato são suportados: registro baseado em string, registro baseado em declaração e registro de base mista. O formato de registro binário usado depende da versão do MySQL. Para descrições gerais dos formatos de registro, consulte a Seção 5.4.4.1, “Formatos de Registro Binário”. Para informações detalhadas sobre o formato do log binário, consulte MySQL Internals: The Binary Log.

O servidor avalia as opções `--binlog-do-db` e `--binlog-ignore-db` da mesma maneira que as opções `--replicate-do-db` e `--replicate-ignore-db`. Para obter informações sobre como isso é feito, consulte a Seção 16.2.5.1, “Avaliação das opções de replicação e registro binário em nível de banco de dados”.

Por padrão, uma réplica não escreve em seu próprio log binário quaisquer modificações de dados que sejam recebidas da fonte. Para registrar essas modificações, comece a réplica com a opção `--log-slave-updates`, além da opção `--log-bin` (consulte Seção 16.1.6.3, “Opções e Variáveis do Servidor de Replicação”). Isso é feito quando uma réplica também deve atuar como fonte para outras réplicas em replicação em cadeia.

Você pode excluir todos os arquivos de registro binários com a declaração `RESET MASTER`, ou um subconjunto deles com `PURGE BINARY LOGS`. Veja a Seção 13.7.6.6, “Declaração RESET”, e a Seção 13.4.1.1, “Declaração PURGE BINARY LOGS”.

Se você estiver usando replicação, não deve excluir arquivos de log binário antigos na fonte até ter certeza de que nenhuma réplica ainda os precise usar. Por exemplo, se suas réplicas nunca estiverem mais de três dias atrasadas, uma vez por dia, você pode executar **mysqladmin flush-logs binary** na fonte e, em seguida, remover quaisquer logs que tenham mais de três dias de idade. Você pode remover os arquivos manualmente, mas é preferível usar `PURGE BINARY LOGS`, que também atualiza com segurança o arquivo de índice do log binário para você (e que pode aceitar um argumento de data). Veja a Seção 13.4.1.1, “Declaração PURGE BINARY LOGS”.

Você pode exibir o conteúdo dos arquivos de registro binário com o utilitário **mysqlbinlog**. Isso pode ser útil quando você deseja reprocessar declarações no log para uma operação de recuperação. Por exemplo, você pode atualizar um servidor MySQL a partir do registro binário da seguinte forma:

```sql
$> mysqlbinlog log_file | mysql -h server_name
```

O **mysqlbinlog** também pode ser usado para exibir o conteúdo do arquivo de registro de retransmissão, pois ele é escrito usando o mesmo formato dos arquivos de registro binário. Para mais informações sobre o utilitário **mysqlbinlog** e como usá-lo, consulte a Seção 4.6.7, “mysqlbinlog — Utilitário para processamento de arquivos de registro binário”. Para mais informações sobre o registro binário e as operações de recuperação, consulte a Seção 7.5, “Recuperação Ponto no Tempo (Incremental)”).

O registro binário é feito imediatamente após uma declaração ou transação ser concluída, mas antes de quaisquer bloqueios serem liberados ou qualquer compromisso ser feito. Isso garante que o registro seja registrado na ordem do compromisso.

As atualizações de tabelas não transacionais são armazenadas no log binário imediatamente após a execução.

Dentro de uma transação não comprometida, todas as atualizações (`UPDATE`, `DELETE` ou `INSERT`) que alteram tabelas transacionais, como as tabelas `InnoDB`, são armazenadas em cache até que uma declaração `COMMIT` seja recebida pelo servidor. Nesse ponto, `mysqld` escreve toda a transação no log binário antes de a `COMMIT` ser executada.

As modificações em tabelas não transacionais não podem ser revertidas. Se uma transação que é revertida incluir modificações em tabelas não transacionais, toda a transação é registrada com uma declaração `ROLLBACK` no final para garantir que as modificações nessas tabelas sejam replicadas.

Quando um thread que lida com a transação começa, ele aloca um buffer de `binlog_cache_size` para bufferar as declarações. Se uma declaração for maior que este, o thread abre um arquivo temporário para armazenar a transação. O arquivo temporário é excluído quando o thread termina.

A variável de status `Binlog_cache_use` mostra o número de transações que utilizaram este buffer (e possivelmente um arquivo temporário) para armazenar declarações. A variável de status `Binlog_cache_disk_use` mostra quantos desses transações, na verdade, tiveram que usar um arquivo temporário. Essas duas variáveis podem ser usadas para ajustar `binlog_cache_size` a um valor suficientemente grande para evitar o uso de arquivos temporários.

A variável de sistema `max_binlog_cache_size` (padrão 4 GB, que também é o máximo) pode ser usada para restringir o tamanho total usado para cachear uma transação com múltiplos comandos. Se uma transação for maior que esse número de bytes, ela falha e é revertida. O valor mínimo é 4096.

Se você estiver usando o registro binário e o registro baseado em string, as inserções concorrentes são convertidas em inserções normais para as declarações `CREATE ... SELECT` ou `INSERT ... SELECT`. Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas, aplicando o registro durante uma operação de backup. Se você estiver usando o registro baseado em declaração, a declaração original é escrita no registro.

O formato de log binário tem algumas limitações conhecidas que podem afetar a recuperação a partir de backups. Veja a Seção 16.4.1, “Recursos e problemas de replicação”.

O registro binário para programas armazenados é feito conforme descrito na Seção 23.7, “Registro binário de programas armazenados”.

Observe que o formato de log binário difere no MySQL 5.7 das versões anteriores do MySQL, devido aos aprimoramentos na replicação. Consulte a Seção 16.4.2, “Compatibilidade de replicação entre versões do MySQL”.

Se o servidor não conseguir gravar o log binário, esvaziar os arquivos de log binário ou sincronizar o log binário com o disco, o log binário na fonte pode se tornar inconsistente e as réplicas podem perder a sincronização com a fonte. A variável de sistema `binlog_error_action` controla a ação realizada se um erro desse tipo for encontrado com o log binário.

* A configuração padrão, `ABORT_SERVER`, faz com que o servidor pare a registro binário e seja desligado. Neste ponto, você pode identificar e corrigir a causa do erro. Na reinicialização, a recuperação prossegue como no caso de um desligamento inesperado do servidor (consulte Seção 16.3.2, “Tratamento de um Desligamento Inesperado de uma Replicação”).

O cenário `IGNORE_ERROR` oferece compatibilidade reversa com versões mais antigas do MySQL. Com este cenário, o servidor continua a transação em andamento e registra o erro, depois interrompe o registro binário, mas continua a realizar atualizações. Neste ponto, você pode identificar e corrigir a causa do erro. Para retomar o registro binário, o `log_bin` deve ser habilitado novamente, o que requer um reinício do servidor. Use esta opção apenas se você precisar de compatibilidade reversa e o log binário não seja essencial nesta instância do servidor MySQL. Por exemplo, você pode usar o log binário apenas para auditoria ou depuração intermitente do servidor e não usá-lo para replicação do servidor ou confiar nele para operações de restauração em um ponto no tempo.

Por padrão, o log binário é sincronizado com o disco em cada escrita (`sync_binlog=1`). Se `sync_binlog` não foi habilitado e o sistema operacional ou a máquina (não apenas o servidor MySQL) falhou, há uma chance de que as últimas declarações do log binário possam ser perdidas. Para evitar isso, habilite a variável de sistema `sync_binlog` para sincronizar o log binário com o disco após cada *`N`* grupos de compromissos. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”. O valor mais seguro para `sync_binlog` é 1 (o padrão), mas este também é o mais lento.

Por exemplo, se você estiver usando as tabelas `InnoDB` e o servidor MySQL processar uma declaração `COMMIT`, escreve muitas transações preparadas no log binário em sequência, sincroniza o log binário e, em seguida, compromete essa transação em `InnoDB`. Se o servidor sair inesperadamente entre essas duas operações, a transação é revertida por `InnoDB` na reinicialização, mas ainda existe no log binário. Esse problema é resolvido assumindo que `--innodb_support_xa` está definido como 1, o padrão. Embora essa opção esteja relacionada ao suporte de transações XA em `InnoDB`, também garante que o log binário e os arquivos de dados do InnoDB sejam sincronizados. Para que essa opção ofereça um grau maior de segurança, o servidor MySQL também deve ser configurado para sincronizar o log binário e os logs `InnoDB` no disco antes de comprometer a transação. Os logs `InnoDB` são sincronizados por padrão, e `sync_binlog=1` pode ser usado para sincronizar o log binário. O efeito dessa opção é que, na reinicialização após um acidente, após realizar um revertimento de transações, o servidor MySQL examina o arquivo do log binário mais recente para coletar os valores das transações *`xid`* e calcular a última posição válida no arquivo do log binário. O servidor MySQL, em seguida, informa ao `InnoDB` para completar quaisquer transações preparadas que foram escritas com sucesso no log binário, e corta o log binário para a última posição válida. Isso garante que o log binário reflita os dados exatos das tabelas `InnoDB`, e, portanto, a replica permanece em sincronia com a fonte porque não recebe uma declaração que foi revertida.

Nota

`innodb_support_xa` é desatualizado; espere que ele seja removido em uma versão futura. O suporte `InnoDB` para commit de duas fases em transações XA está sempre habilitado a partir do MySQL 5.7.10.

Se o servidor MySQL descobrir durante a recuperação de falha que o log binário é mais curto do que deveria ter sido, ele não possui pelo menos uma transação `InnoDB` com sucesso realizada. Isso não deve acontecer se `sync_binlog=1` e o sistema de disco/arquivo realizam uma sincronização real quando são solicitados (alguns não o fazem), então o servidor exibe uma mensagem de erro `The binary log file_name is shorter than its expected size`. Neste caso, este log binário não é correto e a replicação deve ser reiniciada a partir de um novo instantâneo dos dados da fonte.

Os valores das sessões das seguintes variáveis do sistema são escritos no log binário e respeitados pela replica ao analisar o log binário:

* `sql_mode` (exceto que o modo `NO_DIR_IN_CREATE` não é replicado; veja Seção 16.4.1.37, “Replicação e Variáveis”)

* `foreign_key_checks`
* `unique_checks`
* `character_set_client`
* `collation_connection`
* `collation_database`
* `collation_server`
* `sql_auto_is_null`

#### 5.4.4.1 Formatos binários de registro

O servidor utiliza vários formatos de registro para registrar informações no log binário. O formato exato empregado depende da versão do MySQL que está sendo usada. Existem três formatos de registro:

* As capacidades de replicação no MySQL originalmente eram baseadas na propagação de declarações SQL da fonte para a réplica. Isso é chamado de *registro baseado em declarações*. Você pode fazer com que esse formato seja usado iniciando o servidor com `--binlog-format=STATEMENT`.

* No registro baseado em string, a fonte escreve eventos no log binário que indicam como as strings individuais da tabela são afetadas. Portanto, é importante que as tabelas sempre usem uma chave primária para garantir que as strings possam ser identificadas de forma eficiente. Você pode fazer com que o servidor use registro baseado em string iniciando-o com `--binlog-format=ROW`.

* Uma terceira opção também está disponível: *registros mistos*. Com registros mistos, o registro baseado em declarações é usado por padrão, mas o modo de registro muda automaticamente para baseado em strings em certos casos, conforme descrito abaixo. Você pode fazer o MySQL usar registros mistos explicitamente, iniciando `mysqld` com a opção `--binlog-format=MIXED`.

O formato de registro também pode ser definido ou limitado pelo motor de armazenamento que está sendo usado. Isso ajuda a eliminar problemas ao replicar determinadas declarações entre uma fonte e uma replica que estão usando diferentes motores de armazenamento.

Com a replicação baseada em declarações, pode haver problemas na replicação de declarações não determinísticas. Ao decidir se uma determinada declaração é segura para replicação baseada em declarações, o MySQL determina se pode garantir que a declaração possa ser replicada usando o registro baseada em declarações. Se o MySQL não puder fazer essa garantia, ele marca a declaração como potencialmente não confiável e emite o aviso, A declaração pode não ser segura para registro no formato de declaração.

Você pode evitar esses problemas usando a replicação baseada em string do MySQL, em vez disso.

#### 5.4.4.2 Configuração do formato de log binário

Você pode selecionar o formato de registro binário explicitamente, iniciando o servidor MySQL com `--binlog-format=type`. Os valores suportados para *`type`* são:

* `STATEMENT` faz com que o registro seja baseado em declarações.

* `ROW` faz com que o registro seja baseado em string.
* `MIXED` faz com que o registro use formato misto.

Definir o formato de registro binário não ativa o registro binário para o servidor. A configuração só tem efeito quando o registro binário está habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` é definida como `ON`. No MySQL 5.7, o registro binário não é habilitado por padrão, e você o habilita usando a opção `--log-bin`.

O formato de registro também pode ser alterado em tempo de execução, embora note que há várias situações em que você não pode fazer isso, conforme discutido mais adiante nesta seção. Defina o valor global da variável de sistema `binlog_format` para especificar o formato para clientes que se conectam após a alteração:

```sql
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

Um cliente individual pode controlar o formato de registro para suas próprias declarações, definindo o valor da sessão de `binlog_format`:

```sql
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Para alterar o valor global `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema de sessão restritas. Consulte a Seção 5.1.8.1, “Privilégios de variáveis de sistema”.

Há várias razões pelas quais um cliente pode querer configurar o registro binário em uma base por sessão:

Uma sessão que realiza muitas pequenas alterações no banco de dados pode querer usar o registro baseado em string.

* Uma sessão que realiza atualizações que correspondem a muitas strings na cláusula `WHERE` pode querer usar o registro baseado em declarações porque é mais eficiente registrar algumas declarações do que muitas strings.

* Algumas declarações exigem muito tempo de execução na fonte, mas resultam em apenas algumas strings sendo modificadas. Portanto, pode ser benéfico replicá-las usando registro baseado em string.

Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

* a partir de uma função armazenada ou de um gatilho. * Se o motor de armazenamento `NDB` estiver habilitado.

* Se a sessão estiver atualmente no modo de replicação baseada em string e tiver tabelas temporárias abertas.

Tentar mudar o formato em qualquer um desses casos resulta em um erro.

Não é recomendado mudar o formato de replicação em tempo de execução quando houver tabelas temporárias, porque as tabelas temporárias são registradas apenas quando se usa replicação baseada em instruções, enquanto que com replicação baseada em strings elas não são registradas. Com replicação mista, as tabelas temporárias geralmente são registradas; exceções acontecem com funções carregáveis e com a função `UUID()`.

Mudar o formato de replicação enquanto a replicação está em andamento também pode causar problemas. Cada servidor MySQL pode definir seu próprio e apenas seu próprio formato de registro binário (verdadeiro se `binlog_format` está definido com escopo global ou de sessão). Isso significa que alterar o formato de registro em um servidor de fonte de replicação não faz com que a réplica mude seu formato de registro para corresponder. Ao usar o modo `STATEMENT`, a variável de sistema `binlog_format` não é replicada. Ao usar o modo de registro `MIXED` ou `ROW`, ele é replicado, mas ignorado pela réplica.

Uma réplica não é capaz de converter entradas de registro binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio registro binário. Portanto, a réplica deve usar o formato `ROW` ou `MIXED` se a fonte o fizer. Alterar o formato de registro binário na fonte de `STATEMENT` para `ROW` ou `MIXED` durante a replicação para uma réplica com formato `STATEMENT` pode causar o fracasso da replicação com erros como Erro executando evento de string: 'Não é possível executar a declaração: impossível escrever no registro binário, uma vez que a declaração está em formato de string e BINLOG\_FORMAT = DECLARAÇÃO.' Alterar o formato de registro binário na réplica para o formato `STATEMENT` quando a fonte ainda está usando o formato `MIXED` ou `ROW` também causa o mesmo tipo de falha de replicação. Para alterar o formato de forma segura, você deve parar a replicação e garantir que a mesma alteração seja feita tanto na fonte quanto na réplica.

Se você estiver usando as tabelas `InnoDB` e o nível de isolamento de transação é `READ COMMITTED` ou `READ UNCOMMITTED`, apenas o registro baseado em string pode ser usado. É *possível* mudar o formato de registro para `STATEMENT`, mas fazer isso em tempo real rapidamente leva a erros porque `InnoDB` não pode mais realizar inserções.

Com o formato de registro binário definido como `ROW`, muitas alterações são escritas no registro binário usando o formato baseado em string. No entanto, algumas alterações ainda usam o formato baseado em declaração. Exemplos incluem todas as declarações de DDL (linguagem de definição de dados), como `CREATE TABLE`, `ALTER TABLE` ou `DROP TABLE`.

A opção `--binlog-row-event-max-size` está disponível para servidores que são capazes de replicação baseada em strings. As strings são armazenadas no log binário em partes com um tamanho em bytes que não exceda o valor desta opção. O valor deve ser um múltiplo de 256. O valor padrão é 8192.

Aviso

Ao usar o registro baseado em *declarações* para replicação, é possível que os dados da fonte e da replica se tornem diferentes se uma declaração for projetada de tal forma que a modificação dos dados seja não determinística; ou seja, é deixada à vontade do otimizador de consulta. Em geral, essa não é uma boa prática, mesmo fora da replicação. Para uma explicação detalhada sobre esse problema, consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”.

#### 5.4.4.3 Formato misto de registro binário

Ao executar no formato de registro `MIXED`, o servidor muda automaticamente do registro baseado em declarações para o baseado em strings nas seguintes condições:

* Quando uma declaração DML atualiza uma tabela `NDBCLUSTER`.

* Quando uma função contém `UUID()`.

* Quando uma ou mais tabelas com colunas `AUTO_INCREMENT` são atualizadas e um gatilho ou função armazenada é invocado. Como todos os outros comandos inseguros, isso gera uma advertência se `binlog_format = STATEMENT`.

Para mais informações, consulte a Seção 16.4.1.1, “Replicação e AUTO\_INCREMENT”.

* Quando o corpo de uma visão requer replicação baseada em string, a declaração que cria a visão também a utiliza. Por exemplo, isso ocorre quando a declaração que cria uma visão utiliza a função `UUID()`.

* Quando uma chamada a uma função carregável está envolvida. * Se uma declaração é registrada por string e a sessão que executou a declaração tem quaisquer tabelas temporárias, a registro por string é usado para todas as declarações subsequentes (exceto aquelas que acessam tabelas temporárias) até que todas as tabelas temporárias em uso por essa sessão sejam descartadas.

Isso é verdade, independentemente de as tabelas temporárias serem ou não registradas.

As tabelas temporárias não podem ser registradas usando o formato baseado em string; portanto, uma vez que o registro baseado em string é usado, todas as declarações subsequentes que utilizam essa tabela são inseguras. O servidor aproxima essa condição tratando todas as declarações executadas durante a sessão como inseguras até que a sessão não contenha mais nenhuma tabela temporária.

* Quando `FOUND_ROWS()` ou `ROW_COUNT()` é usado. (Bug #12092, Bug #30244)

* Quando `USER()`, `CURRENT_USER()` ou `CURRENT_USER` é usado. (Bug #28086)

* Quando uma declaração se refere a uma ou mais variáveis do sistema. (Bug #31168)

**Exceção.** As seguintes variáveis do sistema, quando usadas com escopo de sessão (apenas), não fazem com que o formato de registro mude:

+ `auto_increment_increment`
  + `auto_increment_offset`
  + `character_set_client`
  + `character_set_connection`
  + `character_set_database`
  + `character_set_server`
  + `collation_connection`
  + `collation_database`
  + `collation_server`
  + `foreign_key_checks`
  + `identity`
  + `last_insert_id`
  + `lc_time_names`
  + `pseudo_thread_id`
  + `sql_auto_is_null`
  + `time_zone`
  + `timestamp`
  + `unique_checks`

Para obter informações sobre a determinação do escopo da variável do sistema, consulte a Seção 5.1.8, “Usando variáveis do sistema”.

Para informações sobre como a replicação trata `sql_mode`, consulte a Seção 16.4.1.37, “Replicação e Variáveis”.

* Quando uma das tabelas envolvidas é uma tabela de registro no banco de dados `mysql`.

* Quando a função `LOAD_FILE()` é usada. (Bug #39701)

Nota

Um aviso é gerado se você tentar executar uma declaração usando o registro baseado em declaração que deve ser escrito usando o registro baseado em string. O aviso é exibido tanto no cliente (na saída de `SHOW WARNINGS`) quanto através do `mysqld` log de erro. Um aviso é adicionado à tabela `SHOW WARNINGS` toda vez que tal declaração é executada. No entanto, apenas a primeira declaração que gerou o aviso para cada sessão do cliente é escrita no log de erro para evitar a saturação do log.

Além das decisões acima, os motores individuais também podem determinar o formato de registro usado quando as informações em uma tabela são atualizadas. As capacidades de registro de um motor individual podem ser definidas da seguinte forma:

* Se um motor suportar o registro baseado em string, diz-se que o motor é capaz de registro baseado em string.

* Se um motor suportar o registro baseado em declarações, diz-se que o motor é capaz de registro baseado em declarações.

Um motor de armazenamento específico pode suportar um ou ambos os formatos de registro. O quadro a seguir lista os formatos suportados por cada motor.

<table>
<thead>
<tr>
<th>Motor de Armazenamento</th>
<th>Suportado o registro de strings</th>
<th>Suporte para registro de declarações</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>ARCHIVE</code></th>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th><code>BLACKHOLE</code></th>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th><code>CSV</code></th>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th><code>EXAMPLE</code></th>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<th><code>FEDERATED</code></th>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th><code>HEAP</code></th>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th><code>InnoDB</code></th>
<td>Sim</td>
<td>Sim, quando o nível de isolamento de transação é<code>REPEATABLE READ</code>ou<code>SERIALIZABLE</code>; Não de outra forma.</td>
</tr>
<tr>
<th><code>MyISAM</code></th>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th><code>MERGE</code></th>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<th><code>NDB</code></th>
<td>Yes</td>
<td>No</td>
</tr>
</tbody>
</table>

Se uma declaração deve ser registrada e o modo de registro a ser utilizado é determinado de acordo com o tipo de declaração (seguro, inseguro ou binário injetado), o formato de registro binário (`STATEMENT`, `ROW` ou `MIXED`) e as capacidades de registro do motor de armazenamento (capaz de declaração, capaz de string, ambos ou nenhum). (Injeção binária refere-se ao registro de uma mudança que deve ser registrada usando o formato `ROW`.)

As declarações podem ser registradas com ou sem um aviso; as declarações falhadas não são registradas, mas geram erros no log. Isso é mostrado na tabela de decisão a seguir. As colunas **Tipo**, **binlog\_format**, **SLC** e **RLC** definem as condições, e as colunas **Erro / Aviso** e **Registrado como** representam as ações correspondentes. **SLC** significa "capaz de registro de declarações", e **RLC** significa "capaz de registro de strings".

<table>
<thead>
<tr>
<th>Type</th>
<th><code>binlog_format</code></th>
<th>SLC</th>
<th>RLC</th>
<th>Error / Warning</th>
<th>Logged as</th>
</tr>
</thead>
<tbody>
<tr>
<th>*</th>
<td><code>*</code></td>
<td>No</td>
<td>No</td>
<td>Error: Cannot execute statement: Binary logging is impossible since at least one engine is involved that is both row-incapable and statement-incapable.</td>
<td><code>-</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>STATEMENT</code></td>
<td>Yes</td>
<td>No</td>
<td>-</td>
<td><code>STATEMENT</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>MIXED</code></td>
<td>Yes</td>
<td>No</td>
<td>-</td>
<td><code>STATEMENT</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>ROW</code></td>
<td>Yes</td>
<td>No</td>
<td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td>
<td><code>-</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>STATEMENT</code></td>
<td>Yes</td>
<td>No</td>
<td>Warning: Unsafe statement binlogged in statement format, since <code>BINLOG_FORMAT = STATEMENT</code></td>
<td><code>STATEMENT</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>MIXED</code></td>
<td>Yes</td>
<td>No</td>
<td>Error: Cannot execute statement: Binary logging of an unsafe statement is impossible when the storage engine is limited to statement-based logging, even if <code>BINLOG_FORMAT = MIXED</code>.</td>
<td><code>-</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>ROW</code></td>
<td>Yes</td>
<td>No</td>
<td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td>
<td>-</td>
</tr>
<tr>
<th>Injeção de string</th>
<td><code>STATEMENT</code></td>
<td>Sim</td>
<td>Não</td>
<td>Erro: Não é possível executar injeção de string: o registro binário não é possível, uma vez que pelo menos uma tabela utiliza um mecanismo de armazenamento que não é capaz de registro baseado em string.</td>
<td>-</td>
</tr>
<tr>
<th>Injeção de string</th>
<td><code>MIXED</code></td>
<td>Sim</td>
<td>Não</td>
<td>Erro: Não é possível executar injeção de string: o registro binário não é possível, uma vez que pelo menos uma tabela utiliza um mecanismo de armazenamento que não é capaz de registro baseado em string.</td>
<td>-</td>
</tr>
<tr>
<th>Injeção de string</th>
<td><code>ROW</code></td>
<td>Sim</td>
<td>Não</td>
<td>Erro: Não é possível executar injeção de string: o registro binário não é possível, uma vez que pelo menos uma tabela utiliza um mecanismo de armazenamento que não é capaz de registro baseado em string.</td>
<td>-</td>
</tr>
<tr>
<th>Safe</th>
<td><code>STATEMENT</code></td>
<td>No</td>
<td>Yes</td>
<td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td>
<td><code>-</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>MIXED</code></td>
<td>No</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>ROW</code></td>
<td>No</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>STATEMENT</code></td>
<td>No</td>
<td>Yes</td>
<td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td>
<td>-</td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>MIXED</code></td>
<td>No</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>ROW</code></td>
<td>No</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Row Injection</th>
<td><code>STATEMENT</code></td>
<td>No</td>
<td>Yes</td>
<td>Error: Cannot execute row injection: Binary logging is not possible since <code>BINLOG_FORMAT = STATEMENT</code>.</td>
<td><code>-</code></td>
</tr>
<tr>
<th>Row Injection</th>
<td><code>MIXED</code></td>
<td>No</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Row Injection</th>
<td><code>ROW</code></td>
<td>No</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>STATEMENT</code></td>
<td>Yes</td>
<td>Yes</td>
<td>-</td>
<td><code>STATEMENT</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>MIXED</code></td>
<td>Yes</td>
<td>Yes</td>
<td>-</td>
<td><code>STATEMENT</code></td>
</tr>
<tr>
<th>Safe</th>
<td><code>ROW</code></td>
<td>Yes</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>STATEMENT</code></td>
<td>Yes</td>
<td>Yes</td>
<td>Warning: Unsafe statement binlogged in statement format since <code>BINLOG_FORMAT = STATEMENT</code>.</td>
<td><code>STATEMENT</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>MIXED</code></td>
<td>Yes</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Unsafe</th>
<td><code>ROW</code></td>
<td>Yes</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Row Injection</th>
<td><code>STATEMENT</code></td>
<td>Yes</td>
<td>Yes</td>
<td>Error: Cannot execute row injection: Binary logging is not possible because <code>BINLOG_FORMAT = STATEMENT</code>.</td>
<td>-</td>
</tr>
<tr>
<th>Row Injection</th>
<td><code>MIXED</code></td>
<td>Yes</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
<tr>
<th>Row Injection</th>
<td><code>ROW</code></td>
<td>Yes</td>
<td>Yes</td>
<td>-</td>
<td><code>ROW</code></td>
</tr>
</tbody>
</table>

Quando uma advertência é gerada pela determinação, uma advertência padrão do MySQL é gerada (e está disponível usando `SHOW WARNINGS`). As informações também são escritas no `mysqld` log de erro. Apenas um erro por cada instância de erro por conexão de cliente é registrado para evitar a saturação do log. A mensagem do log inclui a declaração SQL que foi tentada.

Se `log_error_verbosity` for 2 ou superior em uma replica, a replica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de releio onde ele começa seu trabalho, quando está alternando para outro log de releio, quando se reconecta após uma desconexão, declarações que são inseguras para o registro baseado em declarações, e assim por diante.

#### 5.4.4.4 Formato de registro para alterações em tabelas de banco de dados mysql

Os conteúdos das tabelas de concessão no banco de dados `mysql` podem ser modificados diretamente (por exemplo, com `INSERT` ou `DELETE`) ou indiretamente (por exemplo, com `GRANT` ou `CREATE USER`). As declarações que afetam as tabelas do banco de dados `mysql` são escritas no log binário usando as seguintes regras:

* As declarações de manipulação de dados que alteram dados nas tabelas do banco de dados `mysql` são registradas de acordo com a configuração da variável de sistema `binlog_format`. Isso se aplica a declarações como `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `DO`, `LOAD DATA`, `SELECT` e `TRUNCATE TABLE`.

* As declarações que alteram indiretamente o banco de dados `mysql` são registradas como declarações, independentemente do valor de `binlog_format`. Isso se aplica a declarações como `GRANT`, `REVOKE`, `SET PASSWORD`, `RENAME USER`, `CREATE` (todas as formas, exceto `CREATE TABLE ... SELECT`), `ALTER` (todas as formas) e `DROP` (todas as formas).

`CREATE TABLE ... SELECT` é uma combinação de definição de dados e manipulação de dados. A parte `CREATE TABLE` é registrada usando o formato de declaração e a parte `SELECT` é registrada de acordo com o valor de `binlog_format`.

### 5.4.5 O Log de Consultas Lentas

O registro de consultas lentas consiste em instruções SQL que levam mais de `long_query_time` segundos para serem executadas e exigem pelo menos `min_examined_row_limit` strings a serem examinadas. O registro de consultas lentas pode ser usado para encontrar consultas que levam um longo tempo para serem executadas e, portanto, são candidatas à otimização. No entanto, examinar um longo registro de consultas lentas pode ser uma tarefa demorada. Para facilitar isso, você pode usar o comando **mysqldumpslow** para processar um arquivo de registro de consultas lentas e resumir seu conteúdo. Veja a Seção 4.6.8, “mysqldumpslow — Resumir arquivos de registro de consultas lentas”.

O tempo para adquirir as chaves iniciais não é contado como tempo de execução. `mysqld` escreve uma declaração no log de consulta lenta após ela ter sido executada e após todas as chaves terem sido liberadas, de modo que a ordem do log pode diferir da ordem de execução.

* Parâmetros do registro de consultas lentas * Conteúdo do registro de consultas lentas

#### Parâmetros do registro de consultas lentas

Os valores mínimo e padrão de `long_query_time` são 0 e 10, respectivamente. O valor pode ser especificado com uma resolução de microssegundos.

Por padrão, as declarações administrativas não são registradas, assim como as consultas que não utilizam índices para pesquisas. Esse comportamento pode ser alterado usando `log_slow_admin_statements` e `log_queries_not_using_indexes`, conforme descrito mais adiante.

Por padrão, o registro de consultas lentas é desativado. Para especificar explicitamente o estado inicial do registro de consultas lentas, use `--slow_query_log[={0|1}]`. Sem argumento ou com um argumento de 1, `--slow_query_log` habilita o registro. Com um argumento de 0, esta opção desativa o registro. Para especificar o nome do arquivo de registro, use `--slow_query_log_file=file_name`. Para especificar o destino do registro, use a variável de sistema `log_output` (como descrito na Seção 5.4.1, “Selecionando destinos de saída do registro de consultas gerais e do registro de consultas lentas”).

Nota

Se você especificar o destino do log `TABLE`, consulte Tabelas de log e Erros de “Existem muitos arquivos abertos”.

Se você não especificar um nome para o arquivo de registro de consultas lentas, o nome padrão é `host_name-slow.log`. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o registro de consultas lentas ou alterar o nome do arquivo de registro no tempo real, use as variáveis de sistema globais `slow_query_log` e `slow_query_log_file`. Defina `slow_query_log` para 0 para desabilitar o registro ou para 1 para habilitá-lo. Defina `slow_query_log_file` para especificar o nome do arquivo de registro. Se um arquivo de registro já estiver aberto, ele será fechado e o novo arquivo será aberto.

O servidor escreve menos informações no registro de consultas lentas se você usar a opção `--log-short-format`.

Para incluir declarações administrativas lentas no registro de consultas lentas, habilite a variável de sistema `log_slow_admin_statements`. As declarações administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

Para incluir consultas que não utilizam índices para pesquisas de string nas declarações escritas no log de consultas lentas, habilite a variável de sistema `log_queries_not_using_indexes`. (Mesmo com essa variável habilitada, o servidor não registra consultas que não se beneficiariam da presença de um índice devido à tabela ter menos de duas strings.)

Quando as consultas que não utilizam um índice são registradas, o registro de consultas lentas pode crescer rapidamente. É possível estabelecer um limite de taxa para essas consultas, definindo a variável de sistema `log_throttle_queries_not_using_indexes`. Por padrão, essa variável é 0, o que significa que não há limite. Valores positivos impõem um limite por minuto para o registro de consultas que não utilizam índices. A primeira consulta desse tipo abre uma janela de 60 segundos dentro da qual o servidor registra consultas até o limite dado, e depois suprime consultas adicionais. Se houver consultas suprimidas quando a janela termina, o servidor registra um resumo que indica quantos havia e o tempo agregado gasto nelas. A próxima janela de 60 segundos começa quando o servidor registra a próxima consulta que não utiliza índices.

O servidor utiliza os parâmetros de controle na seguinte ordem para determinar se deve escrever uma consulta no registro de consultas lentas:

1. A consulta não pode ser uma declaração administrativa, ou `log_slow_admin_statements` deve ser habilitado.

2. A consulta deve ter levado pelo menos `long_query_time` segundos, ou `log_queries_not_using_indexes` deve estar habilitado e a consulta não deve ter usado índices para pesquisas de string.

3. A consulta deve ter examinado pelo menos `min_examined_row_limit` strings.

4. A consulta não deve ser suprimida de acordo com a configuração `log_throttle_queries_not_using_indexes`.

A variável de sistema `log_timestamps` controla a zona horária dos timestamps nas mensagens escritas no arquivo de registro de consultas lentas (assim como no arquivo de registro de consultas gerais e no registro de erros). Não afeta a zona horária das mensagens de registro de consultas gerais e de consultas lentas escritas em tabelas de registro, mas as strings recuperadas dessas tabelas podem ser convertidas da zona horária do sistema local para qualquer zona horária desejada com `CONVERT_TZ()` ou definindo a variável de sessão `time_zone`.

O servidor não registra as consultas manipuladas pelo cache de consultas.

Por padrão, uma replica não escreve consultas replicadas no log de consultas lentas. Para alterar isso, habilite a variável de sistema `log_slow_slave_statements`. Observe que, se a replicação baseada em strings estiver em uso (`binlog_format=ROW`), `log_slow_slave_statements` não tem efeito. As consultas são adicionadas apenas ao log de consultas lentas da replica quando elas são registradas em formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` está definido, ou quando `binlog_format=MIXED` está definido e a declaração é registrada em formato de declaração. As consultas lentas que são registradas em formato de string quando `binlog_format=MIXED` está definido, ou que são registradas quando `binlog_format=ROW` está definido, não são adicionadas ao log de consultas lentas da replica, mesmo que `log_slow_slave_statements` esteja habilitado.

#### Conteúdo do Log de Consultas Lentas

Quando o registro de consultas lentas é habilitado, o servidor escreve a saída para quaisquer destinos especificados pela variável de sistema `log_output`. Se você habilitar o registro, o servidor abre o arquivo de registro e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino de registro `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve nenhuma consulta, mesmo que o registro de consultas lentas seja habilitado. Definir o nome do arquivo de registro não tem efeito no registro se `FILE` não for selecionado como destino de saída.

Se o registro de consultas lentas estiver habilitado e `FILE` estiver selecionado como destino de saída, cada declaração escrita no registro é precedida por uma string que começa com um caractere `#` e possui esses campos (com todos os campos em uma única string):

* `Query_time: duration`

O tempo de execução da declaração em segundos.

* `Lock_time: duration`

O tempo para adquirir fechaduras em segundos.

* `Rows_sent: N`

O número de strings enviadas ao cliente.

* `Rows_examined:`

O número de strings examinadas pela camada de servidor (não contando qualquer processamento interno dos motores de armazenamento).

Cada declaração escrita no arquivo de registro de consulta lenta é precedida por uma declaração `SET` que inclui um timestamp indicando quando a declaração lenta foi registrada (o que ocorre após a execução da declaração).

As senhas em declarações escritas no registro de consultas lentas são reescritas pelo servidor para não ocorrerem literalmente em texto simples. Veja a Seção 6.1.2.3, “Senhas e Registro”.

A partir do MySQL 5.7.38, as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consultas lentas.

### 5.4.6 O Log do DDL

O log DDL, ou log de metadados, registra operações de metadados geradas por declarações de definição de dados que afetam a partição de tabelas, como `ALTER TABLE t3 DROP PARTITION p2`, onde devemos garantir que a partição seja completamente removida e que sua definição seja removida da lista de partições da tabela `t3`. O MySQL usa esse log para se recuperar de um acidente que ocorre durante uma operação de metadados de partição.

Um registro das operações de partição de metadados é escrito no arquivo `ddl_log.log`, no diretório de dados do MySQL. Este é um arquivo binário; ele não é destinado a ser legível para humanos, e você não deve tentar modificar seu conteúdo de qualquer maneira.

`ddl_log.log` não é criado até que ele realmente seja necessário para registrar declarações de metadados, e é removido após o início bem-sucedido de `mysqld`. Assim, é possível que este arquivo não esteja presente em um servidor MySQL que está funcionando de maneira completamente normal.

`ddl_log.log` pode armazenar até 1048573 entradas, o que equivale a 4 GB de tamanho. Quando esse limite é excedido, é necessário renomear ou remover o arquivo antes que seja possível executar quaisquer declarações DDL adicionais. Esse é um problema conhecido (Bug #83708).

Não há opções ou variáveis de servidor configuráveis pelo usuário associadas a este arquivo.

### 5.4.7 Manutenção dos registros do servidor

Como descrito na Seção 5.4, “Logs do MySQL Server”, o MySQL Server pode criar vários arquivos de registro diferentes para ajudá-lo a ver quais atividades estão ocorrendo. No entanto, você deve limpar esses arquivos regularmente para garantir que os registros não ocupem muito espaço em disco.

Ao usar o MySQL com o registro habilitado, você pode querer fazer backup e remover arquivos de registro antigos de tempos em tempos e dizer ao MySQL para começar a registrar em novos arquivos. Veja a Seção 7.2, “Métodos de Backup de Banco de Dados”.

Em uma instalação Linux (Red Hat), você pode usar o script `mysql-log-rotate` para a manutenção do log. Se você instalou o MySQL a partir de uma distribuição RPM, este script deve ter sido instalado automaticamente. Tenha cuidado com este script se você estiver usando o log binário para replicação. Você não deve remover logs binários até ter certeza de que o conteúdo deles foi processado por todas as réplicas.

Em outros sistemas, você deve instalar um pequeno script que você inicia a partir do **cron** (ou seu equivalente) para lidar com arquivos de registro.

Para o log binário, você pode definir a variável de sistema `expire_logs_days` para expirar os arquivos de log binário automaticamente após um número determinado de dias (consulte Seção 5.1.7, “Variáveis do Sistema do Servidor”). Se você estiver usando replicação, você deve definir a variável não inferior ao número máximo de dias em que suas réplicas podem ficar para trás em relação à fonte. Para remover logs binários sob demanda, use a declaração `PURGE BINARY LOGS` (consulte Seção 13.4.1.1, “Declaração PURGE BINARY LOGS”).

Para forçar o MySQL a começar a usar novos arquivos de registro, limpe os registros. O esvaziamento de registros ocorre quando você executa uma declaração `FLUSH LOGS` ou o comando **mysqladmin flush-logs**, **mysqladmin refresh**, **mysqldump --flush-logs** ou **mysqldump --master-data**. Veja a Seção 13.7.6.3, “Declaração FLUSH”, a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”, e a Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”. Além disso, o servidor esvazia o log binário automaticamente quando o tamanho atual do arquivo de log binário atinge o valor da variável de sistema `max_binlog_size`.

`FLUSH LOGS` suporta modificadores opcionais para permitir o esvaziamento seletivo de registros individuais (por exemplo, `FLUSH BINARY LOGS`). Veja a Seção 13.7.6.3, “Instrução FLUSH”.

Uma operação de limpeza de registro tem os seguintes efeitos:

* Se o registro binário estiver habilitado, o servidor fecha o arquivo de registro binário atual e abre um novo arquivo de registro com o próximo número de sequência.

* Se o registro de consultas gerais ou o registro de consultas lentas em um arquivo de registro estiverem habilitados, o servidor fecha e reabre o arquivo de registro.

* Se o servidor foi iniciado com a opção `--log-error` para fazer com que o log de erro seja escrito em um arquivo, o servidor fecha e reabre o arquivo de log.

A execução de declarações ou comandos de limpeza de logs requer a conexão com o servidor usando uma conta que tenha o privilégio `RELOAD`. Em sistemas Unix e Unix-like, outra maneira de limpar os logs é enviar um sinal `SIGHUP` para o servidor, o que pode ser feito por `root` ou pela conta que possui o processo do servidor. Os sinais permitem que a limpeza de logs seja realizada sem a necessidade de conexão com o servidor. No entanto, `SIGHUP` tem efeitos adicionais além da limpeza de logs que podem ser indesejáveis. Para detalhes, consulte a Seção 4.10, “Tratamento de Sinal Unix em MySQL”.

Como mencionado anteriormente, o esvaziamento do log binário cria um novo arquivo de log binário, enquanto o esvaziamento do log de consulta geral, do log de consulta lenta ou do log de erro apenas fecha e reabre o arquivo de log. Para os últimos logs, para criar um novo arquivo de log no Unix, renomeie o arquivo de log atual primeiro antes de esvaziá-lo. No momento do esvaziamento, o servidor abre o novo arquivo de log com o nome original. Por exemplo, se os arquivos de log de consulta geral, consulta lenta e erro forem nomeados como `mysql.log`, `mysql-slow.log` e `err.log`, você pode usar uma série de comandos como este a partir da string de comando:

```sql
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

Em Windows, use **rename** em vez de **mv**.

Neste ponto, você pode fazer um backup de `mysql.log.old`, `mysql-slow.log.old` e `err.log.old`, e depois removê-los do disco.

Para renomear o log de consulta geral ou o log de consulta lenta no tempo real, conecte-se primeiro ao servidor e desabilite o log:

```sql
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

Com os registros desativados, renomeie os arquivos de registro externamente (por exemplo, a partir da string de comando). Em seguida, ative os registros novamente:

```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

Esse método funciona em qualquer plataforma e não requer o reinício do servidor.

Nota

Para que o servidor recree um arquivo de registro dado depois que você renomeou o arquivo externamente, a localização do arquivo deve ser legível pelo servidor. Isso nem sempre é o caso. Por exemplo, no Linux, o servidor pode escrever o log de erro como `/var/log/mysqld.log`, onde `/var/log` é de propriedade de `root` e não é legível por `mysqld`. Nesse caso, as operações de limpeza de log não conseguem criar um novo arquivo de registro.

Para lidar com essa situação, você deve criar manualmente o novo arquivo de registro com a propriedade adequada após renomear o arquivo de registro original. Por exemplo, execute esses comandos como `root`:

```sql
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```

