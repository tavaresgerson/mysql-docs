## 7.4 Registros do MySQL Server

O MySQL Server tem vários logs que podem ajudá-lo a descobrir quais atividades estão ocorrendo.

<table summary="MySQL Server log types and the information written to each log."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Tipo de registro</th> <th>Informações escritas no log</th> </tr></thead><tbody><tr> <td>Diário de erros</td> <td>Problemas encontrados ao iniciar, executar ou parar o mysqld</td> </tr><tr> <td>Registro de consulta geral</td> <td>Conexões com clientes estabelecidas e declarações recebidas dos clientes</td> </tr><tr> <td>Registro binário</td> <td>Declarações que alteram dados (também utilizadas para replicação)</td> </tr><tr> <td>Registro de relé</td> <td>Alterações de dados recebidas de um servidor de fonte de replicação</td> </tr><tr> <td>Registro de consultas lentas</td> <td>Consultas que levaram mais de<code>long_query_time</code>segundos para executar</td> </tr><tr> <td>Registro do DDL (registro de metadados)</td> <td>Operações de metadados realizadas por declarações DDL</td> </tr></tbody></table>

Por padrão, nenhum registro é habilitado, exceto o registro de erro no Windows. (O registro DDL é sempre criado quando necessário e não possui opções configuráveis pelo usuário; veja O registro DDL.) As seções específicas de log a seguir fornecem informações sobre as opções do servidor que habilitam o registro.

Por padrão, o servidor escreve arquivos para todos os logs habilitados no diretório de dados. Você pode forçar o servidor a fechar e reabrir os arquivos de log (ou, em alguns casos, alternar para um novo arquivo de log) ao limpar os logs. A limpeza de logs ocorre quando você emite uma declaração `FLUSH LOGS`; execute **mysqladmin** com um argumento `flush-logs` ou `refresh`; ou execute **mysqldump** com uma opção `--flush-logs`. Veja a Seção 15.7.8.3, “Declaração FLUSH”, Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”, e Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”. Além disso, o log binário é limpo quando seu tamanho atinge o valor da variável de sistema `max_binlog_size`.

Você pode controlar os registros de consulta geral e de consulta lenta durante a execução. Você pode habilitar ou desabilitar o registro, ou alterar o nome do arquivo de registro. Você pode informar ao servidor que escreva as entradas de consulta geral e de consulta lenta em tabelas de registro, arquivos de registro ou em ambos. Para obter detalhes, consulte a Seção 7.4.1, “Selecionando destinos de saída de registro de consulta geral e de consulta lenta”, a Seção 7.4.3, “O registro de consulta geral”, e a Seção 7.4.5, “O registro de consulta lenta”.

O registro de relevo é usado apenas em réplicas, para manter as alterações de dados do servidor de origem de replicação que também devem ser feitas na réplica. Para discussão sobre o conteúdo e a configuração do registro de relevo, consulte a Seção 19.2.4.1, “O Registro de Relevo”.

Para informações sobre operações de manutenção de logs, como a expiração de arquivos antigos de log, consulte a Seção 7.4.6, “Manutenção de logs do servidor”.

Para informações sobre como manter os registros seguros, consulte a Seção 8.1.2.3, “Senhas e Registro”.

### 7.4.1 Selecionando destinos de saída do Log de consulta geral e do Log de consulta lenta

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

  ```
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```

* O conteúdo do log é acessível por meio de declarações SQL. Isso permite o uso de consultas que selecionam apenas as entradas do log que satisfazem critérios específicos. Por exemplo, para selecionar o conteúdo do log associado a um cliente em particular (o que pode ser útil para identificar consultas problemáticas desse cliente), é mais fácil fazer isso usando uma tabela de log do que um arquivo de log.

* Os logs são acessíveis remotamente por qualquer cliente que possa se conectar ao servidor e emitir consultas (se o cliente tiver os privilégios apropriados para a tabela de logs). Não é necessário fazer login no host do servidor e acessar diretamente o sistema de arquivos.

A implementação da tabela de registro tem as seguintes características:

* Em geral, o propósito principal das tabelas de registro é fornecer uma interface para que os usuários observem a execução em tempo real do servidor, e não interferir na sua execução em tempo real.

* `CREATE TABLE`, `ALTER TABLE` e `DROP TABLE` são operações válidas em uma tabela de registro. Para `ALTER TABLE` e (alter-table.html "15.1.9 ALTER TABLE Statement"), a tabela de registro não pode ser usada e deve ser desativada, conforme descrito mais adiante.

* Por padrão, as tabelas de registro utilizam o mecanismo de armazenamento `CSV`, que escreve os dados no formato de valores separados por vírgula. Para os usuários que têm acesso aos arquivos `.CSV` que contêm dados de tabela de registro, os arquivos são fáceis de importar em outros programas, como planilhas que podem processar entrada CSV.

As tabelas de log podem ser alteradas para usar o mecanismo de armazenamento `MyISAM`. Não é possível usar `ALTER TABLE` para alterar uma tabela de log que esteja em uso. O log deve ser desativado primeiro. Nenhum outro mecanismo, exceto `CSV` ou `MyISAM`, é legal para as tabelas de log.

Tabelas de registro e erros de "Existem muitos arquivos abertos".

Se você selecionar `TABLE` como destino de registro e as tabelas de registro utilizarem o mecanismo de armazenamento `CSV`, você pode encontrar que desabilitar e reativar o registro de consultas gerais ou o registro de consultas lentas repetidamente durante a execução resulta em vários descritores de arquivo abertos para o arquivo `.CSV`, possivelmente resultando em um erro de “Muitos arquivos abertos”. Para resolver esse problema, execute [[`FLUSH TABLES`][(flush.html "15.7.8.3 FLUSH Statement")]] ou garanta que o valor de `open_files_limit` seja maior que o valor de `table_open_cache_instances`.

* Para desativar o registro, de modo que você possa alterar (ou descartar) uma tabela de registro, você pode usar a seguinte estratégia. O exemplo usa o registro de consulta geral; o procedimento para o registro de consulta lenta é semelhante, mas usa a tabela `slow_log` e a variável de sistema `slow_query_log`.

  ```
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```

* `TRUNCATE TABLE` é uma operação válida em uma tabela de log. Pode ser usada para expirar entradas de log.

* `RENAME TABLE` é uma operação válida em uma tabela de registro. Você pode renomear atomicamente uma tabela de registro (para realizar rotação de registro, por exemplo) usando a seguinte estratégia:

  ```
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

* A partição de tabelas de log não é permitida. * O **mysqldump** inclui declarações para recriar essas tabelas, para que não faltem após a recarga do arquivo de dump. O conteúdo das tabelas de log não é descarregado.

### 7.4.2 Diário de Erros

Esta seção discute como configurar o servidor MySQL para registro de mensagens de diagnóstico no log de erro. Para informações sobre a seleção do conjunto de caracteres e idioma da mensagem de erro, consulte a Seção 12.6, “Conjunto de caracteres da mensagem de erro”, e a Seção 12.12, “Definindo o idioma da mensagem de erro”.

O log de erro contém um registro dos tempos de inicialização e desligamento do **mysqld**. Também contém mensagens de diagnóstico, como erros, avisos e notas que ocorrem durante a inicialização e o desligamento do servidor, e enquanto o servidor está em execução. Por exemplo, se o **mysqld** perceber que uma tabela precisa ser verificada ou reparada automaticamente, ele escreve uma mensagem no log de erro.

Dependendo da configuração do log de erro, as mensagens de erro também podem ser preenchidas na tabela do Schema de desempenho `error_log`, para fornecer uma interface SQL para o log e permitir que seu conteúdo seja consultado. Veja a Seção 29.12.21.2, “A tabela error_log”.

Em alguns sistemas operacionais, o log de erro contém uma traçada de pilha se o **mysqld** sair anormalmente. A traçada pode ser usada para determinar onde o **mysqld** saiu. Veja a Seção 7.9, “Depuração do MySQL”.

Se usado para iniciar o **mysqld**, o **mysqld_safe** pode escrever mensagens no log de erro. Por exemplo, quando o **mysqld_safe** detecta uma saída anormal do **mysqld**, ele reinicia o **mysqld** e escreve uma mensagem `mysqld restarted` no log de erro.

As seções a seguir discutem aspectos da configuração do registro de erros.

#### 7.4.2.1 Configuração do Log de Erro

No MySQL 8.0, o registro de erros utiliza a arquitetura de componentes do MySQL descrita na Seção 7.5, “Componentes do MySQL”. O subsistema de registro de erros consiste em componentes que realizam a filtragem e a escrita de eventos de registro, além de uma variável do sistema que configura quais componentes devem ser carregados e habilitados para obter o resultado de registro desejado.

Esta seção discute como carregar e habilitar componentes para registro de erros. Para instruções específicas sobre filtros de registro, consulte a Seção 7.4.2.4, “Tipos de filtragem do registro de erros”. Para instruções específicas sobre os canais de registro JSON e de registro do sistema, consulte a Seção 7.4.2.7, “Registro de erros em formato JSON”, e a Seção 7.4.2.8, “Registro de erros no registro do sistema”. Para detalhes adicionais sobre todos os componentes de registro disponíveis, consulte a Seção 7.5.3, “Componentes do registro de erros”.

O registro de erros baseado em componentes oferece esses recursos:

* Registre eventos que possam ser filtrados por componentes de filtro para afetar as informações disponíveis para escrita.

* Registre eventos que são emitidos por componentes de descarga (escritor). Múltiplos componentes de descarga podem ser habilitados para escrever a saída do log de erro em múltiplos destinos.

* Componentes de filtro e pia embutidos que implementam o formato padrão do log de erro.

* Um repositório carregável que permite o registro em formato JSON. * Um repositório carregável que permite o registro no log do sistema. * Variáveis do sistema que controlam quais componentes de log devem ser carregados e ativados e como cada componente opera.

A configuração do log de erro é descrita nos seguintes tópicos desta seção:

* Configuração do Diário de Erros Padrão
* Métodos de Configuração do Diário de Erros
* Configuração Implícita do Diário de Erros
* Configuração Explícita do Diário de Erros
* Mudando o Método de Configuração do Diário de Erros
* Solução de Problemas com Problemas de Configuração
* Configuração de Múltiplos Vazamentos de Log
* Suporte ao Esquema de Desempenho do Vazamento de Log

##### Configuração do Diário de Erros Padrão

A variável de sistema `log_error_services` controla quais componentes de log carregáveis devem ser carregados (a partir do MySQL 8.0.30) e quais componentes de log devem ser habilitados para registro de erros. Por padrão, `log_error_services` tem esse valor:

```
mysql> SELECT @@GLOBAL.log_error_services;
+----------------------------------------+
| @@GLOBAL.log_error_services            |
+----------------------------------------+
| log_filter_internal; log_sink_internal |
+----------------------------------------+
```

Esse valor indica que os eventos de log passam primeiro pelo componente de filtro `log_filter_internal`, depois pelo componente de absorvedor `log_sink_internal`, ambos componentes embutidos. Um filtro modifica os eventos de log vistos pelos componentes nomeados posteriormente no valor [[`log_error_services`]. Um absorvedor é um destino para eventos de log. Tipicamente, um absorvedor processa eventos de log em mensagens de log que têm um formato particular e escreve essas mensagens em sua saída associada, como um arquivo ou o log do sistema.

A combinação de `log_filter_internal` e `log_sink_internal` implementa o comportamento padrão de filtragem e saída do log de erro. A ação desses componentes é afetada por outras opções do servidor e variáveis do sistema:

* O destino de saída é determinado pela opção `--log-error` (e, no Windows, `--pid-file` e `--console`). Estes determinam se as mensagens de erro devem ser escritas na consola ou num ficheiro e, se para um ficheiro, o nome do ficheiro de registo de erros. Ver Seção 7.4.2.2, “Configuração Predefinida do Destino do Registo de Erros”.

* As variáveis de sistema `log_error_verbosity` e `log_error_suppression_list` afetam quais tipos de eventos de log `log_filter_internal` permitem ou suprimem. Veja a Seção 7.4.2.5, “Filtragem do log de erro baseada na prioridade (log_filter_internal)”.

Ao configurar `log_error_services`, esteja ciente das seguintes características:

* Uma lista de componentes de log pode ser delimitada por ponto e vírgula ou (a partir do MySQL 8.0.12) por vírgula, opcionalmente seguida por espaço. Um conjunto de configuração específico não pode usar tanto o ponto e vírgula quanto a vírgula como delimitador. A ordem dos componentes é significativa porque o servidor executa os componentes na ordem listada.

* O componente final no valor de `log_error_services` não pode ser um filtro. Esse é um erro porque quaisquer alterações que ele tenha nos eventos não teriam efeito na saída:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal';
  ERROR 1231 (42000): Variable 'log_error_services' can't be set to the value
  of 'log_filter_internal'
  ```

Para corrigir o problema, inclua um retalho de pia no final do valor:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
  ```

* A ordem dos componentes mencionados em `log_error_services` é significativa, especialmente em relação à ordem relativa dos filtros e dos absorvedores. Considere este valor de `log_error_services`:

  ```
  log_filter_internal; log_sink_1; log_sink_2
  ```

Neste caso, os eventos de registro passam para o filtro embutido, depois para o primeiro retalho, depois para o segundo retalho. Ambos os retalhos recebem os eventos de registro filtrados.

Compare isso com esse valor `log_error_services`:

  ```
  log_sink_1; log_filter_internal; log_sink_2
  ```

Neste caso, os eventos de registro passam para o primeiro retículo, depois para o filtro embutido e depois para o segundo retículo. O primeiro retículo recebe eventos não filtrados. O segundo retículo recebe eventos filtrados. Você pode configurar o registro de erros dessa maneira se quiser um log que contenha mensagens para todos os eventos de registro e outro log que contenha mensagens apenas para um subconjunto de eventos de registro.

Métodos de configuração do log de erro #####

A configuração do log de erro envolve carregar e habilitar os componentes do log de erro conforme necessário e realizar a configuração específica do componente.

Existem dois métodos de configuração do log de erro, *implicito* e *explícito*. É recomendável que um método de configuração seja selecionado e usado exclusivamente. O uso de ambos os métodos pode resultar em avisos na inicialização. Para mais informações, consulte Problemas de Configuração de Solução de Problemas.

*Configuração de registro de erro implícito* (introduzida no MySQL 8.0.30)

Este método de configuração carrega e habilita os componentes de registro definidos pela variável `log_error_services`. Os componentes carregáveis que ainda não estão carregados são carregados implicitamente na inicialização antes que o mecanismo de armazenamento `InnoDB` esteja totalmente disponível. Este método de configuração tem as seguintes vantagens:

Os componentes do log são carregados no início da sequência de inicialização, antes do mecanismo de armazenamento `InnoDB`, o que torna as informações registradas disponíveis mais cedo.

+ Evita a perda de informações de log armazenadas, caso ocorra uma falha durante a inicialização.

+ Não é necessário instalar componentes de registro de erros usando `INSTALL COMPONENT`, o que simplifica a configuração do registro de erros.

Para usar esse método, consulte Configuração do Registro de Erro Implícito.

*Configuração do Diário de Erros Explicito*

Nota

Este método de configuração é compatível com versões anteriores. O método de configuração implícito, introduzido no MySQL 8.0.30, é recomendado.

Este método de configuração requer o carregamento de componentes do registro de erros usando `INSTALL COMPONENT` e, em seguida, a configuração de `log_error_services` para habilitar os componentes do log. `INSTALL COMPONENT` adiciona o componente à tabela `mysql.component` (uma tabela `InnoDB`) e os componentes a serem carregados no início são lidos a partir desta tabela, que só é acessível após `InnoDB` ser inicializado.

As informações registradas são armazenadas em buffer durante a sequência de inicialização, enquanto o motor de armazenamento `InnoDB` é inicializado, o que, por vezes, é prolongado por operações como recuperação e atualização do dicionário de dados que ocorrem durante a sequência de inicialização `InnoDB`.

Para usar esse método, consulte Configuração explícita do log de erro.

Configuração do Log de Erro Implícito

Este procedimento descreve como carregar e habilitar componentes de registro de erros implicitamente usando `log_error_services`. Para uma discussão sobre os métodos de configuração do log de erro, consulte Métodos de Configuração do Log de Erro.

Para carregar e habilitar componentes de registro de erros implicitamente:

1. Liste os componentes do log de erro no valor `log_error_services`.

Para carregar e habilitar os componentes do log de erro na inicialização do servidor, defina `log_error_services` em um arquivo de opção. O exemplo a seguir configura o uso do canal de saída de log JSON (`log_sink_json`), além do filtro e canal de saída de log embutido (`log_filter_internal`, `log_sink_internal`).

   ```
   [mysqld]
   log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
   ```

Nota

Para usar o canal de registro JSON (`log_sink_syseventlog`) em vez do canal padrão (`log_sink_internal`, você substitui `log_sink_internal` por `log_sink_json`.

Para carregar e habilitar o componente imediatamente e para reinicializações subsequentes, configure `log_error_services` usando [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"):

   ```
   SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

2. Se o componente do log de erro exibe quaisquer variáveis do sistema que devem ser definidas para que a inicialização do componente seja bem-sucedida, atribua esses valores apropriados às variáveis. Você pode definir essas variáveis em um arquivo de opções ou usando `SET PERSIST`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

Importante

Ao implementar uma configuração implícita, defina `log_error_services` primeiro para carregar um componente e expor suas variáveis do sistema, e, em seguida, defina as variáveis do sistema do componente posteriormente. Esse pedido de configuração é necessário, independentemente de a atribuição de variáveis ser realizada na linha de comando, em um arquivo de opção ou usando `SET PERSIST`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

Para desabilitar um componente de registro, remova-o do valor `log_error_services`. Também remova todas as configurações de variáveis de componentes associadas que você definiu.

Nota

Carregar um componente de registro implicitamente usando `log_error_services` não tem efeito sobre a tabela `mysql.component`. Não adiciona o componente à tabela `mysql.component`, nem remove um componente previamente instalado usando `INSTALL COMPONENT` da tabela `mysql.component`.

##### Configuração do Diário de Erros Explicito

Este procedimento descreve como carregar e habilitar componentes de registro de erros explicitamente, carregando componentes usando `INSTALL COMPONENT` e, em seguida, habilitando-os usando `log_error_services`. Para uma discussão sobre os métodos de configuração do log de erro, consulte Métodos de Configuração do Log de Erro.

Para carregar e habilitar componentes de registro de erros explicitamente:

1. Carregue o componente usando `INSTALL COMPONENT` (install-component.html "15.7.4.3 INSTALL COMPONENT Statement") (a menos que ele esteja embutido ou já carregado). Por exemplo, para carregar o canal de registro JSON, execute a seguinte declaração:

   ```
   INSTALL COMPONENT 'file://component_log_sink_json';
   ```

Carregando um componente usando `INSTALL COMPONENT` o registra na tabela de sistema (install-component.html "15.7.4.3 INSTALL COMPONENT Statement") para que o servidor o carregue automaticamente para as subsequentes iniciações, após `InnoDB` ser inicializado.

O URN a ser utilizado ao carregar um componente de registro com `INSTALL COMPONENT` é o nome do componente prefixado com `file://component_`. Por exemplo, para o componente `log_sink_json`, o URN correspondente é `file://component_log_sink_json`. Para os URNs de componentes de registro de erro, consulte a Seção 7.5.3, “Componentes de Registro de Erro”.

2. Se o componente do log de erro exibe quaisquer variáveis do sistema que devem ser definidas para que a inicialização do componente seja bem-sucedida, atribua esses valores apropriados às variáveis. Você pode definir essas variáveis em um arquivo de opções ou usando `SET PERSIST`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

3. Ative o componente, listando-o no valor `log_error_services`.

Importante

A partir do MySQL 8.0.30, ao carregar componentes de log explicitamente usando `INSTALL COMPONENT`(install-component.html "15.7.4.3 INSTALL COMPONENT Statement"), não persista ou não defina `log_error_services` em um arquivo de opção, que carrega componentes de log implicitamente no início. Em vez disso, habilite os componentes de log no runtime usando uma declaração `SET GLOBAL`.

O exemplo a seguir configura o uso do canal de registro JSON (`log_sink_json`) além do filtro e canal de registro integrado (`log_filter_internal`, `log_sink_internal`).

   ```
   SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

Nota

Para usar o canal de registro JSON (`log_sink_syseventlog`) em vez do canal padrão (`log_sink_internal`, você substituiria `log_sink_internal` por `log_sink_json`.

Para desabilitar um componente de registro, remova-o do valor `log_error_services`. Em seguida, se o componente for carregável e você também quiser descarregá-lo, use `UNINSTALL COMPONENT`. Também remova quaisquer configurações de variáveis de componentes associadas que você definiu.

As tentativas de usar `UNINSTALL COMPONENT`(uninstall-component.html "15.7.4.5 UNINSTALL COMPONENT Statement") para descarregar um componente carregável que ainda está nomeado no valor do `log_error_services` produzem um erro.

##### Mudando o método de configuração do log de erro

Se você já carregou componentes do log de erro explicitamente usando `INSTALL COMPONENT` e deseja mudar para uma configuração implícita, conforme descrito na Configuração de Log de Erro Implícita, os seguintes passos são recomendados:

1. Volte o `log_error_services` para sua configuração padrão.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Use `UNINSTALL COMPONENT` para desinstalar quaisquer componentes de registro carregáveis que você instalou anteriormente. Por exemplo, se você instalou o canal de registro JSON anteriormente, desinstale-o conforme mostrado:

   ```
   UNINSTALL COMPONENT 'file://component_log_sink_json';
   ```

3. Remova todas as configurações de variáveis do componente desinstalado. Por exemplo, se as variáveis do componente foram definidas em um arquivo de opções, remova as configurações do arquivo de opções. Se as variáveis do componente foram definidas usando [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), use [`RESET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") para limpar as configurações.

4. Siga os passos na Configuração do Registro de Erro Implícito para reimplementar sua configuração.

Se você precisar reverter uma configuração implícita para uma explícita, realize as etapas a seguir:

1. Volte o `log_error_services` para sua configuração padrão para descarregar componentes de log carregados implicitamente.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Remova todas as configurações de variáveis de componente associadas aos componentes desinstalados. Por exemplo, se as variáveis de componente foram definidas em um arquivo de opções, remova as configurações do arquivo de opções. Se as variáveis de componente foram definidas usando [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), use [`RESET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") para limpar as configurações.

3. Reinicie o servidor para desinstalá-los os componentes de registro que foram carregados implicitamente.

4. Siga os passos na Configuração do Registro de Erro Explicito para reimplementar sua configuração.

##### Solução de problemas de configuração

A partir do MySQL 8.0.30, os componentes de log listados no valor `log_error_services` ao iniciar são carregados implicitamente no início da sequência de inicialização do MySQL Server. Se o componente de log foi carregado anteriormente usando `INSTALL COMPONENT`, o servidor tenta carregar o componente novamente mais tarde na sequência de inicialização, o que produz o seguinte aviso:

```
Cannot load component from specified URN: 'file://component_component_name'
```

Você pode verificar esse aviso no log de erro ou consultando a tabela do Schema de desempenho `error_log` usando a seguinte consulta:

```
SELECT error_code, data
  FROM performance_schema.error_log
 WHERE data LIKE "%'file://component_%"
   AND error_code="MY-013129" AND data LIKE "%MY-003529%";
```

Para evitar esse aviso, siga as instruções na seção Altering the Error Log Configuration Method para ajustar a configuração do log de erro. Deve-se usar uma configuração de log de erro implícita ou explícita, mas não ambas.

Um erro semelhante ocorre ao tentar carregar explicitamente um componente que foi carregado implicitamente na inicialização. Por exemplo, se `log_error_services` lista o componente de canal de registro JSON, esse componente é carregado implicitamente na inicialização. Tentar carregar explicitamente o mesmo componente posteriormente retorna esse erro:

```
mysql> INSTALL COMPONENT 'file://component_log_sink_json';
ERROR 3529 (HY000): Cannot load component from specified URN: 'file://component_log_sink_json'.
```

##### Configurando vários pontos de registro

É possível configurar vários pontos de saída de logs, o que permite enviar a saída para vários destinos. Para habilitar o ponto de saída de logs JSON, além (e não em vez de) o ponto de saída padrão, defina o valor `log_error_services` da seguinte forma:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

Para voltar a usar apenas o repositório padrão e descarregar o repositório de registro do sistema, execute essas instruções:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;
UNINSTALL COMPONENT 'file://component_log_sink_json';
```

##### Suporte ao esquema de desempenho do sink de registro

Se habilitado, os componentes de registro incluem um repositório que oferece suporte ao Gerador de desempenho, os eventos escritos no log de erro também são escritos na tabela do Gerador de desempenho `error_log`. Isso permite examinar o conteúdo do log de erro usando consultas SQL. Atualmente, os repositórios de formato tradicional `log_sink_internal` e JSON-format `log_sink_json` suportam essa capacidade. Veja a Seção 29.12.21.2, “A tabela error_log”.

#### 7.4.2.2 Configuração de destino do log de erro padrão

Esta seção descreve quais opções de servidor configuram o destino padrão do log de erro, que pode ser o console ou um arquivo nomeado. Também indica quais componentes de canal de saída baseiam seu próprio destino de saída no destino padrão.

Nessa discussão, “console” significa `stderr`, a saída padrão de erro. Esse é seu terminal ou janela de console, a menos que a saída padrão de erro tenha sido redirecionada para um destino diferente.

O servidor interpreta as opções que determinam o destino padrão do log de erro de maneira um tanto diferente para sistemas Windows e Unix. Certifique-se de configurar o destino usando as informações apropriadas para sua plataforma. Após o servidor interpretar as opções de destino padrão do log de erro, ele define a variável de sistema `log_error` para indicar o destino padrão, o que afeta onde vários componentes de canal de saída de log escrevem mensagens de erro. As seções a seguir abordam esses tópicos.

* Destino padrão do log de erro no Windows
* Destino padrão do log de erro em sistemas Unix e Unix-like
* Como o destino padrão do log de erro afeta os pontos de descarga do log

##### Destino padrão do log de erro no Windows

Em Windows, o **mysqld** usa as opções `--log-error`, `--pid-file` e `--console` para determinar se o destino padrão do log de erro é a consola ou um ficheiro, e, se for um ficheiro, o nome do ficheiro:

* Se `--console` for fornecido, o destino padrão é o console. (`--console` tem precedência sobre `--log-error` se ambos forem fornecidos, e os seguintes itens em relação a `--log-error` não se aplicam.)

* Se `--log-error` não for fornecido, ou for fornecido sem nomear um arquivo, o destino padrão é um arquivo denominado `host_name.err` no diretório de dados, a menos que a opção `--pid-file` seja especificada. Nesse caso, o nome do arquivo é o nome de base do arquivo PID com um sufixo de `.err` no diretório de dados.

* Se `--log-error` for fornecido para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um local diferente.

Se o destino padrão do log de erro for o console, o servidor define a variável de sistema `log_error` para `stderr`. Caso contrário, o destino padrão é um arquivo e o servidor define `log_error` para o nome do arquivo.

##### Destino padrão do log de erro no Unix e sistemas semelhantes

Em sistemas Unix e Unix-like, o **mysqld** usa a opção `--log-error` para determinar se o destino padrão do log de erro é a consola ou um ficheiro, e, se for um ficheiro, o nome do ficheiro:

* Se `--log-error` não for fornecido, o destino padrão é o console.

* Se `--log-error` for fornecido sem nomear um arquivo, o destino padrão é um arquivo denominado `host_name.err` no diretório de dados.

* Se `--log-error` for fornecido para nomear um arquivo, o destino padrão é esse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). A localização do arquivo está sob o diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um local diferente.

* Se `--log-error` for fornecido em um arquivo de opções em uma seção de `[mysqld]`, `[server]` ou `[mysqld_safe]`, em sistemas que usam **mysqld_safe** para iniciar o servidor, **mysqld_safe** encontra e usa a opção e a passa para **mysqld**.

Nota

É comum que as instalações de pacotes Yum ou APT configurem um local de arquivo de registro de erro em `/var/log` com uma opção como `log-error=/var/log/mysqld.log` em um arquivo de configuração do servidor. A remoção do nome do caminho da opção faz com que o arquivo `host_name.err` no diretório de dados seja usado.

Se o destino padrão do log de erro for o console, o servidor define a variável de sistema `log_error` para `stderr`. Caso contrário, o destino padrão é um arquivo e o servidor define `log_error` para o nome do arquivo.

##### Como o destino padrão do log de erro afeta os pontos de descarga do log

Após o servidor interpretar as opções de configuração do destino do log de erro, ele define a variável de sistema `log_error` para indicar o destino padrão do log de erro. Os componentes de canal de saída de log podem basear seu próprio destino de saída no valor `log_error`, ou determinar seu destino de forma independente de `log_error`

Se `log_error` for `stderr`, o destino padrão do log de erro é a consola, e os pontos de saída de registo que baseiam a sua saída no destino padrão também escrevem para a consola:

* `log_sink_internal`, `log_sink_json`, `log_sink_test`: Esses banhos escrevem no console. Isso é verdade mesmo para banhos como `log_sink_json` que podem ser habilitados várias vezes; todas as instâncias escrevem no console.

* `log_sink_syseventlog`: Este retângulo escreve no log do sistema, independentemente do valor de `log_error`.

Se `log_error` não for `stderr`, o destino padrão do log de erro é um arquivo e `log_error` indica o nome do arquivo. Os pontos de descarga de log que baseiam seu destino de saída no arquivo de nomeação de saída da base de destino padrão usam esse nome. (Um ponto de descarga pode usar exatamente esse nome, ou pode usar uma variação dele.) Suponha que o valor `log_error` *`file_name`*. Então, os pontos de descarga de log usam o nome da seguinte forma:

* `log_sink_internal`, `log_sink_test`: Esses ralos escrevem para *`file_name`*.

* `log_sink_json`: Instâncias sucessivas deste retângulo nomeado no valor do `log_error_services` escrevem em arquivos nomeados *`file_name`* mais um sufixo numerado do `.NN.json`: `file_name.00.json`, `file_name.01.json`, e assim por diante.

* `log_sink_syseventlog`: Este retângulo escreve no log do sistema, independentemente do valor de `log_error`.

#### 7.4.2.3 Campos de Evento de Erro

Os eventos de erro destinados ao log de erro contêm um conjunto de campos, cada um dos quais consiste em um par chave/valor. Um campo de evento pode ser classificado como núcleo, opcional ou definido pelo usuário:

* Um campo principal é configurado automaticamente para eventos de erro. No entanto, sua presença no evento durante o processamento do evento não é garantida, pois um campo principal, como qualquer outro tipo de campo, pode ser desativado por um filtro de registro. Se isso acontecer, o campo não será encontrado pelo processamento subsequente dentro desse filtro e por componentes que executam após o filtro (como os receptores de registro).

* Um campo opcional normalmente não está presente, mas pode estar presente para certos tipos de eventos. Quando presente, um campo opcional fornece informações adicionais sobre o evento, conforme apropriado e disponível.

* Um campo definido pelo usuário é qualquer campo com um nome que não esteja já definido como um campo principal ou opcional. Um campo definido pelo usuário não existe até ser criado por um filtro de registro.

Como indicado pela descrição anterior, qualquer campo dado pode estar ausente durante o processamento do evento, seja porque não estava presente em primeiro lugar, ou foi descartado por um filtro. Para os pontos de descarga de logs, o efeito da ausência do campo é específico do ponto de descarga. Por exemplo, um ponto de descarga pode omitir o campo da mensagem de log, indicar que o campo está ausente ou substituir um padrão. Quando em dúvida, teste: use um filtro que desativa o campo, depois verifique o que o ponto de descarga faz com ele.

As seções a seguir descrevem os campos de eventos de erro principais e opcionais. Para componentes individuais de filtro de registro, pode haver considerações adicionais específicas para esses campos, ou os filtros podem adicionar campos definidos pelo usuário que não estão listados aqui. Para obter detalhes, consulte a documentação dos filtros específicos.

* Campos de evento de erro principal
* Campos de evento de erro opcionais

##### Campos de Evento de Erro Principal

Esses campos de evento de erro são campos essenciais:

* `time`

O timestamp do evento, com precisão de microssegundo.

* `msg`

A string da mensagem do evento.

* `prio`

O evento de prioridade, para indicar um sistema, erro, aviso ou evento de nota/informação. Este campo corresponde à gravidade em `syslog`. O seguinte quadro mostra os níveis de prioridade possíveis.

  <table summary="Error event priority levels."><col style="width: 35%"/><col style="width: 35%"/><thead><tr> <th>Event Type</th> <th>Numeric Priority</th> </tr></thead><tbody><tr> <td>System event</td> <td>0</td> </tr><tr> <td>Error event</td> <td>1</td> </tr><tr> <td>Warning event</td> <td>2</td> </tr><tr> <td>Note/information event</td> <td>3</td> </tr></tbody></table>

O valor `prio` é numérico. Relacionado a isso, um evento de erro também pode incluir um campo opcional `label` que representa a prioridade como uma string. Por exemplo, um evento com um valor `prio` de 2 pode ter um valor `label` de `'Warning'`.

Os componentes de filtro podem incluir ou descartar eventos de erro com base na prioridade, exceto que os eventos do sistema são obrigatórios e não podem ser descartados.

Em geral, as prioridades das mensagens são determinadas da seguinte forma:

A situação ou evento é passível de ação?

+ Sim: A situação ou evento é ignorável?

- Sim: A prioridade é o alerta.
- Não: A prioridade é o erro.
+ Não: A situação ou evento é obrigatório?

- Sim: Prioridade é sistema.
- Não: Prioridade é nota/informação.
* `err_code`

O código de erro do evento, como um número (por exemplo, `1022`).

* `err_symbol`

O símbolo de erro do evento, como uma string (por exemplo, `'ER_DUP_KEY'`).

* `SQL_state`

O valor do SQLSTATE do evento, como uma string (por exemplo, `'23000'`).

* `subsystem`

O subsistema em que o evento ocorreu. Os valores possíveis são `InnoDB` (o motor de armazenamento `InnoDB`), `Repl` (o subsistema de replicação), `Server` (de outra forma).

##### Campos opcionais de evento de erro

Os campos de evento de erro opcionais se enquadram nas seguintes categorias:

* Informações adicionais sobre o erro, como o erro sinalizado pelo sistema operacional ou a etiqueta de erro:

+ `OS_errno`

O número do erro do sistema operacional.

+ `OS_errmsg`

Mensagem de erro do sistema operacional.

+ `label`

O rótulo correspondente ao valor `prio`, como uma string.

* Identificação do cliente para o qual o evento ocorreu:

+ `user`

O usuário cliente.

+ `host`

O cliente host.

+ `thread`

O ID do fio dentro do **mysqld** responsável por produzir o evento de erro. Esse ID indica qual parte do servidor produziu o evento e é consistente com as mensagens do log de consulta geral e do log de consulta lenta, que incluem o ID do fio de conexão.

+ `query_id`

O ID da consulta.

* Informações de depuração:

+ `source_file`

O arquivo de origem no qual o evento ocorreu, sem nenhum caminho inicial.

+ `source_line`

A linha do arquivo de origem na qual o evento ocorreu.

+ `function`

A função na qual o evento ocorreu.

+ `component`

O componente ou plugin no qual o evento ocorreu.

#### 7.4.2.4 Tipos de filtragem do log de erro

A configuração do log de erro normalmente inclui um componente de filtro de log e um ou mais componentes de canal de saída de log. Para a filtragem do log de erro, o MySQL oferece uma escolha de componentes:

* `log_filter_internal`: Este componente de filtro fornece filtragem de log de erro com base na prioridade do evento de log e no código de erro, em combinação com as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`. `log_filter_internal` é integrado e ativado por padrão. Veja a Seção 7.4.2.5, “Filtragem de log de erro com base na prioridade (log_filter_internal)”.

* `log_filter_dragnet`: Este componente de filtro fornece filtragem de log de erro com base em regras fornecidas pelo usuário, em combinação com a variável de sistema `dragnet.log_error_filter_rules`. Veja a Seção 7.4.2.6, “Filtragem de log de erro baseada em regras (log_filter_dragnet)”.

#### 7.4.2.5 Filtragem do log de erro com base na prioridade (log_filter_internal)

O componente de filtro de registro `log_filter_internal` implementa uma forma simples de filtragem de registro com base na prioridade do evento de erro e no código de erro. Para determinar como o `log_filter_internal` permite ou suprime eventos de erro, aviso e informações destinados ao registro de erro, defina as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`.

`log_filter_internal` é construído e ativado por padrão. Se este filtro for desativado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito, portanto, o filtro deve ser realizado usando outro serviço de filtro, se desejado (por exemplo, com regras de filtro individuais ao usar `log_filter_dragnet`). Para informações sobre a configuração do log de erro, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.

* Filtro de Verbosidade
* Filtro de Lista de Supressão
* Interação entre Verbosidade e Lista de Supressão

Filtragem de Verbosidade

Os eventos destinados ao log de erros têm uma prioridade de `ERROR`, `WARNING` ou `INFORMATION`. A variável de sistema `log_error_verbosity` controla a verbosidade com base nas prioridades permitidas para as mensagens escritas no log, conforme mostrado na tabela a seguir.

<table summary="Permitted log_error_verbosity values and corresponding permitted message priorities."><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>log_error_verbosity Value</th> <th>Prioridades de Mensagem Permitida</th> </tr></thead><tbody><tr> <td>1</td> <td><code>ERROR</code></td> </tr><tr> <td>2</td> <td><code>ERROR</code>,<code>WARNING</code></td> </tr><tr> <td>3</td> <td><code>ERROR</code>,<code>WARNING</code>,<code>INFORMATION</code></td> </tr></tbody></table>

Se `log_error_verbosity` for igual a 2 ou superior, o servidor registra mensagens sobre declarações que são inseguras para o registro baseado em declarações. Se o valor for 3, o servidor registra conexões abortadas e erros de negação de acesso para novas tentativas de conexão. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

Se você usar replicação, é recomendado um valor de `log_error_verbosity` de 2 ou superior, para obter mais informações sobre o que está acontecendo, como mensagens sobre falhas na rede e reconexões.

Se `log_error_verbosity` for 2 ou superior em uma réplica, a réplica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de releio onde ela começa seu trabalho, quando está passando para outro log de releio, quando se reconecta após uma desconexão, e assim por diante.

Há também uma prioridade de mensagem `SYSTEM` que não está sujeita ao filtro de verbosidade. Mensagens do sistema sobre situações que não são erros são impressas no log de erro, independentemente do valor `log_error_verbosity`. Essas mensagens incluem mensagens de inicialização e desligamento, e algumas mudanças significativas nas configurações.

No registro de erros do MySQL, as mensagens do sistema são rotuladas como “Sistema”. Outros pontos de registro podem ou não seguir a mesma convenção, e nos registros resultantes, as mensagens do sistema podem receber o rótulo usado para o nível de prioridade da informação, como “Nota” ou “Informação”. Se você aplicar qualquer filtragem ou redirecionamento adicional para o registro baseado na rotulagem das mensagens, as mensagens do sistema não substituem seu filtro, mas são tratadas por ele da mesma maneira que outras mensagens.

Filtragem da lista de supressão

A variável de sistema `log_error_suppression_list` se aplica a eventos destinados ao log de erro e especifica quais eventos devem ser suprimidos quando ocorrem com uma prioridade de `WARNING` ou `INFORMATION`. Por exemplo, se um determinado tipo de alerta é considerado um "ruído" indesejável no log de erro porque ocorre frequentemente, mas não é de interesse, ele pode ser suprimido. `log_error_suppression_list` não suprime mensagens com uma prioridade de `ERROR` ou `SYSTEM`.

O valor `log_error_suppression_list` pode ser uma string vazia para nenhuma supressão, ou uma lista de um ou mais valores separados por vírgula que indicam os códigos de erro a serem suprimidos. Os códigos de erro podem ser especificados em forma simbólica ou numérica. Um código numérico pode ser especificado com ou sem o prefixo `MY-`. As primeiras zeros na parte numérica não são significativos. Exemplos de formatos de código permitidos:

```
ER_SERVER_SHUTDOWN_COMPLETE
MY-000031
000031
MY-31
31
```

Para a legibilidade e portabilidade, os valores simbólicos são preferíveis aos valores numéricos.

Embora os códigos que devem ser suprimidos possam ser expressos em forma simbólica ou numérica, o valor numérico de cada código deve estar dentro de um intervalo permitido:

* 1 a 999: Códigos de erro globais que são usados pelo servidor e pelos clientes.

* 10000 e superior: Códigos de erro do servidor destinados a serem escritos no log de erro (não enviados aos clientes).

Além disso, cada código de erro especificado deve ser realmente utilizado pelo MySQL. Tentativas de especificar um código que não está dentro de um intervalo permitido ou dentro de um intervalo permitido, mas que não é utilizado pelo MySQL, produzem um erro e o valor `log_error_suppression_list` permanece inalterado.

Para informações sobre os intervalos dos códigos de erro e os símbolos e números de erro definidos dentro de cada intervalo, consulte a Seção B.1, “Fontes e elementos dos mensagens de erro”, e a Referência de Mensagens de Erro do MySQL 8.0.

O servidor pode gerar mensagens para um código de erro específico em diferentes prioridades, portanto, a supressão de uma mensagem associada a um código de erro listado em `log_error_suppression_list` depende de sua prioridade. Suponha que a variável tenha um valor de `'ER_PARSER_TRACE,MY-010001,10002'`. Então, `log_error_suppression_list` tem esses efeitos nas mensagens para esses códigos:

* Mensagens geradas com uma prioridade de `WARNING` ou `INFORMATION` são supridas.

* Mensagens geradas com uma prioridade de `ERROR` ou `SYSTEM` não são suprimidas.

Interação entre Verbosidade e Supressão-Lista

O efeito de `log_error_verbosity` se combina com o de `log_error_suppression_list`. Considere um servidor iniciado com essas configurações:

```
[mysqld]
log_error_verbosity=2     # error and warning messages only
log_error_suppression_list='ER_PARSER_TRACE,MY-010001,10002'
```

Neste caso, `log_error_verbosity` permite mensagens com `ERROR` ou `WARNING` prioridade e descarta mensagens com `INFORMATION` prioridade. Das mensagens não descartadas, `log_error_suppression_list` descarta mensagens com `WARNING` prioridade e qualquer um dos códigos de erro mencionados.

Nota

O valor `log_error_verbosity` de 2 mostrado no exemplo também é seu valor padrão, portanto, o efeito desta variável nas mensagens `INFORMATION` é conforme descrito anteriormente, sem configuração explícita. Você deve definir `log_error_verbosity` para 3 se quiser que `log_error_suppression_list` afete mensagens com a prioridade `INFORMATION`.

Considere um servidor iniciado com essa configuração:

```
[mysqld]
log_error_verbosity=1     # error messages only
```

Neste caso, `log_error_verbosity` permite mensagens com prioridade `ERROR` e descarta mensagens com prioridade `WARNING` ou `INFORMATION`. A configuração de `log_error_suppression_list` não tem efeito, pois todos os códigos de erro que ela pode suprimir já são descartados devido à configuração de `log_error_verbosity`.

#### 7.4.2.6 Filtro do Diário de Erros Baseado em Regras (log_filter_dragnet)

O componente de filtro de registro `log_filter_dragnet` permite o filtro de registro com base em regras definidas pelo usuário.

Para habilitar o filtro `log_filter_dragnet`, carregue primeiro o componente do filtro, em seguida, modifique o valor [[`log_error_services`]. O exemplo a seguir habilita `log_filter_dragnet` em combinação com o ressonador de log interno:

```
INSTALL COMPONENT 'file://component_log_filter_dragnet';
SET GLOBAL log_error_services = 'log_filter_dragnet; log_sink_internal';
```

Para configurar o `log_error_services` para entrar em vigor na inicialização do servidor, use as instruções na Seção 7.4.2.1, “Configuração do Diário de Erros”. Essas instruções também se aplicam a outras variáveis de registro de erros do sistema.

Com `log_filter_dragnet` habilitado, defina suas regras de filtro definindo a variável de sistema `dragnet.log_error_filter_rules`. Um conjunto de regras consiste em zero ou mais regras, onde cada regra é uma declaração `IF` terminada por um caractere de ponto (`.`). Se o valor da variável estiver vazio (zero regras), não ocorrerá filtragem.

Exemplo 1. Este conjunto de regras exclui eventos de informação e, para outros eventos, remove o campo `source_line`:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN drop. IF EXISTS source_line THEN unset source_line.';
```

O efeito é semelhante ao filtragem realizada pelo filtro `log_sink_internal`, com um ajuste de `log_error_verbosity=2`.

Para melhorar a legibilidade, você pode preferir listar as regras em linhas separadas. Por exemplo:

```
SET GLOBAL dragnet.log_error_filter_rules = '
  IF prio>=INFORMATION THEN drop.
  IF EXISTS source_line THEN unset source_line.
';
```

Exemplo 2: Esta regra limita os eventos de informação a não mais de um a cada 60 segundos:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN throttle 1/60.';
```

Depois de configurar a configuração de filtragem conforme o seu desejo, considere atribuir `dragnet.log_error_filter_rules` usando [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") em vez de [`SET GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") para que o ajuste persista após a reinicialização do servidor. Alternativamente, adicione o ajuste ao arquivo de opção do servidor.

Ao usar `log_filter_dragnet`, `log_error_suppression_list` é ignorado.

Para parar de usar o idioma de filtragem, primeiro remova-o do conjunto de componentes de registro de erros. Geralmente, isso significa usar um componente de filtro diferente em vez de nenhum componente de filtro. Por exemplo:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
```

Novamente, considere usar `SET PERSIST` em vez de `SET GLOBAL` para que o ajuste persista após a reinicialização do servidor.

Em seguida, desinstale o componente do filtro `log_filter_dragnet`:

```
UNINSTALL COMPONENT 'file://component_log_filter_dragnet';
```

As seções a seguir descrevem aspectos da operação do `log_filter_dragnet` com mais detalhes:

* Gramática para o idioma de regras de log_filter_dragnet * Ações para regras de log_filter_dragnet * Referências de campo nas regras de log_filter_dragnet

##### Gramática para a linguagem de regras log_filter_dragnet

A gramática a seguir define a linguagem para as regras do filtro `log_filter_dragnet`. Cada regra é uma declaração `IF` terminada por um caractere de ponto (`.`). A linguagem não é sensível ao caso.

```
rule:
    IF condition THEN action
    [ELSEIF condition THEN action] ...
    [ELSE action]
    .

condition: {
    field comparator value
  | [NOT] EXISTS field
  | condition {AND | OR}  condition
}

action: {
    drop
  | throttle {count | count / window_size}
  | set field [:= | =] value
  | unset [field]
}

field: {
    core_field
  | optional_field
  | user_defined_field
}

core_field: {
    time
  | msg
  | prio
  | err_code
  | err_symbol
  | SQL_state
  | subsystem
}

optional_field: {
    OS_errno
  | OS_errmsg
  | label
  | user
  | host
  | thread
  | query_id
  | source_file
  | source_line
  | function
  | component
}

user_defined_field:
    sequence of characters in [a-zA-Z0-9_] class

comparator: {== | != | <> | >= | => | <= | =< | < | >}

value: {
    string_literal
  | integer_literal
  | float_literal
  | error_symbol
  | priority
}

count: integer_literal
window_size: integer_literal

string_literal:
    sequence of characters quoted as '...' or "..."

integer_literal:
    sequence of characters in [0-9] class

float_literal:
    integer_literal[.integer_literal]

error_symbol:
    valid MySQL error symbol such as ER_ACCESS_DENIED_ERROR or ER_STARTUP

priority: {
    ERROR
  | WARNING
  | INFORMATION
}
```

Condições simples comparam um campo a um valor ou a existência de um campo de teste. Para construir condições mais complexas, use os operadores `AND` e `OR`. Ambos os operadores têm a mesma precedência e são avaliados da esquerda para a direita.

Para escapar uma caractere dentro de uma cadeia, anteceda-o com uma barra invertida (`\`). Uma barra invertida é necessária para incluir a própria barra invertida ou o caractere de citação de cadeia, opcional para outros caracteres.

Para conveniência, `log_filter_dragnet` suporta nomes simbólicos para comparações a certos campos. Para legibilidade e portabilidade, os valores simbólicos são preferíveis (onde aplicável) aos valores numéricos.

Os valores de prioridade de evento 1, 2 e 3 podem ser especificados como `ERROR`, `WARNING` e `INFORMATION`. Os símbolos de prioridade são reconhecidos apenas em comparações com o campo `prio`. Essas comparações são equivalentes:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

* Os códigos de erro podem ser especificados em forma numérica ou como o símbolo de erro correspondente. Por exemplo, `ER_STARTUP` é o nome simbólico para o erro `1408`, portanto, essas comparações são equivalentes:

  ```
  IF err_code == ER_STARTUP THEN ...
  IF err_code == 1408 THEN ...
  ```

Os símbolos de erro são reconhecidos apenas em comparações com o campo `err_code` e campos definidos pelo usuário.

Para encontrar o símbolo de erro correspondente a um número de código de erro específico, use um desses métodos:

+ Verifique a lista de erros do servidor na Referência de Mensagem de Erro do Servidor.

+ Use o comando **perror**. Dado um argumento de número de erro, o **perror** exibe informações sobre o erro, incluindo seu símbolo.

Suponha que um conjunto de regras com números de erro pareça assim:

  ```
  IF err_code == 10927 OR err_code == 10914 THEN drop.
  IF err_code == 1131 THEN drop.
  ```

Usando **perror**, determine os símbolos de erro:

  ```
  $> perror 10927 10914 1131
  MySQL error code MY-010927 (ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED):
  Access denied for user '%-.48s'@'%-.64s'. Account is locked.
  MySQL error code MY-010914 (ER_ABORTING_USER_CONNECTION):
  Aborted connection %u to db: '%-.192s' user: '%-.48s' host:
  '%-.64s' (%-.64s).
  MySQL error code MY-001131 (ER_PASSWORD_ANONYMOUS_USER):
  You are using MySQL as an anonymous user and anonymous users
  are not allowed to change passwords
  ```

Substituindo símbolos de erro por números, o conjunto de regras se torna:

  ```
  IF err_code == ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED
    OR err_code == ER_ABORTING_USER_CONNECTION THEN drop.
  IF err_code == ER_PASSWORD_ANONYMOUS_USER THEN drop.
  ```

Os nomes simbólicos podem ser especificados como strings citadas para comparação com campos de string, mas, nesses casos, os nomes são strings que não têm significado especial e `log_filter_dragnet` não os resolve para o valor numérico correspondente. Além disso, os erros podem passar despercebidos, enquanto um erro ocorre imediatamente em `SET` para tentativas de usar um símbolo não citado desconhecido pelo servidor.

##### Ações para regras log_filter_dragnet

`log_filter_dragnet` suporta essas ações nas regras de filtro:

* `drop`: Descartar o evento de registro atual (não registrar).

* `throttle`: Aplicar limitação de taxa para reduzir a verbosidade do log para eventos que correspondem a condições específicas. O argumento indica uma taxa, na forma *`count`* ou *`count`*/*`window_size`*. O valor *`count`* indica o número permitido de ocorrências de eventos para ser registrado por janela de tempo. O valor *`window_size`* é a janela de tempo em segundos; se omitido, a janela padrão é de 60 segundos. Ambos os valores devem ser literais inteiros.

Essa regra limita as mensagens de desligamento de plugins a 5 ocorrências a cada 60 segundos:

  ```
  IF err_code == ER_PLUGIN_SHUTTING_DOWN_PLUGIN THEN throttle 5.
  ```

Essa regra limita erros e avisos a 1000 ocorrências por hora e mensagens de informação a 100 ocorrências por hora:

  ```
  IF prio <= INFORMATION THEN throttle 1000/3600 ELSE throttle 100/3600.
  ```

* `set`: Atribua um valor a um campo (e faça com que o campo exista, se ainda não o faz). Nas regras subsequentes, as `EXISTS` que testam o nome do campo são verdadeiras, e o novo valor pode ser testado por condições de comparação.

* `unset`: Descarte um campo. Nas regras subsequentes, as `EXISTS` que testam o nome do campo são falsas, e as comparações do campo contra qualquer valor são falsas.

No caso especial em que a condição se refere exatamente a um nome de campo, o nome do campo que segue `unset` é opcional e `unset` descarta o campo nomeado. Essas regras são equivalentes:

  ```
  IF myfield == 2 THEN unset myfield.
  IF myfield == 2 THEN unset.
  ```

##### Referências de campo nos Regras log_filter_dragnet

As regras do `log_filter_dragnet` suportam referências a campos principais, opcionais e definidos pelo usuário em eventos de erro.

* Referências de campo principal
* Referências de campo opcionais
* Referências de campo definidas pelo usuário

###### Referências de campo principal

A gramática `log_filter_dragnet` na Gramática para o idioma de regras de log_filter_dragnet nomeia os campos principais que as regras de filtragem reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, “Campos de evento de erro”, com os quais você é suposto estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente às referências de campos principais usadas dentro das regras `log_filter_dragnet`.

* `prio`

O evento de prioridade, para indicar um erro, um aviso ou um evento de nota/informação. Em comparações, cada prioridade pode ser especificada como um nome simbólico de prioridade ou um literal numérico. Os símbolos de prioridade são reconhecidos apenas em comparações com o campo `prio`. Essas comparações são equivalentes:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

A tabela a seguir mostra os níveis de prioridade permitidos.

  <table summary="Error event priority levels."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Event Type</th> <th scope="col">Priority Symbol</th> <th scope="col">Numeric Priority</th> </tr></thead><tbody><tr> <th align="left" scope="row">Error event</th> <td><code>ERROR</code></td> <td>1</td> </tr><tr> <th align="left" scope="row">Warning event</th> <td><code>WARNING</code></td> <td>2</td> </tr><tr> <th align="left" scope="row">Note/information event</th> <td><code>INFORMATION</code></td> <td>3</td> </tr></tbody></table>

Há também uma prioridade de mensagem de `SYSTEM`, mas as mensagens do sistema não podem ser filtradas e sempre são escritas no log de erro.

Os valores de prioridade seguem o princípio de que valores de prioridade mais altos têm valores mais baixos e vice-versa. Os valores de prioridade começam em 1 para os eventos mais graves (erros) e aumentam para eventos com prioridade decrescente. Por exemplo, para descartar eventos com prioridade inferior a avisos, teste valores de prioridade mais altos do que `WARNING`:

  ```
  IF prio > WARNING THEN drop.
  ```

Os exemplos a seguir mostram as regras do `log_filter_dragnet` para obter um efeito semelhante a cada valor do `log_error_verbosity` permitido pelo filtro do `log_filter_internal`:

+ Apenas erros (`log_error_verbosity=1`):

    ```
    IF prio > ERROR THEN drop.
    ```

+ Erros e avisos (`log_error_verbosity=2`):

    ```
    IF prio > WARNING THEN drop.
    ```

+ Erros, avisos e notas (`log_error_verbosity=3`):

    ```
    IF prio > INFORMATION THEN drop.
    ```

Essa regra pode, na verdade, ser omitida porque não há valores `prio` maiores que `INFORMATION`, então, efetivamente, ela não descarta nada.

* `err_code`

O código numérico de erro do evento. Nas comparações, o valor a ser testado pode ser especificado como um nome de erro simbólico ou um literal inteiro. Os símbolos de erro são reconhecidos apenas em comparações com o campo `err_code` e campos definidos pelo usuário. Essas comparações são equivalentes:

  ```
  IF err_code == ER_ACCESS_DENIED_ERROR THEN ...
  IF err_code == 1045 THEN ...
  ```

* `err_symbol`

O símbolo de erro do evento, como uma string (por exemplo, `'ER_DUP_KEY'`). Os valores `err_symbol` são destinados mais para identificar linhas específicas na saída de log do que para uso em comparações de regras de filtro, porque `log_filter_dragnet` não resolve valores de comparação especificados como strings para o código de erro numérico equivalente. (Para que isso ocorra, um erro deve ser especificado usando seu símbolo não citado.)

###### Referências de campo opcionais

A gramática `log_filter_dragnet` na Gramática para o idioma de regras de filtro log_filter_dragnet nomeia os campos opcionais que as regras de filtro reconhecem. Para descrições gerais desses campos, consulte a Seção 7.4.2.3, “Campos de evento de erro”, com a qual você é suposto estar familiarizado. As observações a seguir fornecem informações adicionais apenas no que diz respeito especificamente a referências de campos opcionais, conforme usado nas regras `log_filter_dragnet`.

* `label`

O rótulo correspondente ao valor `prio`, como uma string. As regras de filtro podem alterar o rótulo para os pontos de saída de log que suportam rótulos personalizados. Os valores `label` são destinados mais para identificar linhas específicas na saída de log do que para uso em comparações de regras de filtro, porque `log_filter_dragnet` não resolve valores de comparação especificados como strings para a prioridade numérica equivalente.

* `source_file`

O arquivo fonte no qual o evento ocorreu, sem nenhum caminho inicial. Por exemplo, para testar o arquivo `sql/gis/distance.cc`, escreva a comparação da seguinte forma:

  ```
  IF source_file == "distance.cc" THEN ...
  ```

###### Referências de campo definidas pelo usuário

Qualquer nome de campo em uma regra de filtro `log_filter_dragnet` que não seja reconhecido como um nome de campo principal ou opcional é considerado um campo definido pelo usuário.

#### 7.4.2.7 Registro de erros em formato JSON

Esta seção descreve como configurar o registro de erros usando o filtro embutido, `log_filter_internal`, e o canal de saída JSON, `log_sink_json`, para que eles entrem em vigor imediatamente e nas subsequentes inicializações do servidor. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

Para habilitar o repositório JSON, carregue primeiro o componente do repositório e, em seguida, modifique o valor `log_error_services`:

```
INSTALL COMPONENT 'file://component_log_sink_json';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_json';
```

Para configurar `log_error_services` para entrar em vigor na inicialização do servidor, use as instruções na Seção 7.4.2.1, “Configuração do Log de Erro”. Essas instruções também se aplicam a outras variáveis de registro de erros do sistema.

É permitido nomear `log_sink_json` várias vezes no valor `log_error_services`. Por exemplo, para escrever eventos não filtrados com uma instância e eventos filtrados com outra instância, você pode definir `log_error_services` da seguinte forma:

```
SET PERSIST log_error_services = 'log_sink_json; log_filter_internal; log_sink_json';
```

O repositório JSON determina seu destino de saída com base no destino padrão do log de erro, que é dado pela variável de sistema `log_error`. Se `log_error` nomear um arquivo, o repositório JSON baseia o nome do arquivo de saída nesse nome de arquivo, além de um sufixo numerado `.NN.json`, com *`NN`* começando em 00. Por exemplo, se `log_error` é *`file_name`*, as instâncias sucessivas de `log_sink_json` nomeadas no valor `log_error_services` são escritas em `file_name.00.json`, `file_name.01.json`, e assim por diante.

Se `log_error` é `stderr`, o repositório JSON escreve no console. Se `log_sink_json` é nomeado várias vezes no valor de `log_error_services`, todos eles escrevem no console, o que provavelmente não é útil.

#### 7.4.2.8 Registro de erros no log do sistema

É possível fazer com que o **mysqld** escreva o log de erro no log do sistema (o Diálogo de Eventos no Windows e `syslog` em sistemas Unix e sistemas similares).

Esta seção descreve como configurar o registro de erros usando o filtro embutido, `log_filter_internal`, e o canal de registro do sistema, `log_sink_syseventlog`, para que eles entrem em vigor imediatamente e nas subsequentes inicializações do servidor. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.

Para habilitar o repositório de registro do sistema, carregue primeiro o componente do repositório e, em seguida, modifique o valor `log_error_services`:

```
INSTALL COMPONENT 'file://component_log_sink_syseventlog';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_syseventlog';
```

Para configurar `log_error_services` para entrar em vigor na inicialização do servidor, use as instruções na Seção 7.4.2.1, “Configuração do Diário de Erros”. Essas instruções também se aplicam a outras variáveis de registro de erros do sistema.

Nota

Para a configuração do MySQL 8.0, você deve habilitar o registro de erros no log do sistema explicitamente. Isso difere do MySQL 5.7 e versões anteriores, para as quais o registro de erros no log do sistema é habilitado por padrão no Windows, e em todas as plataformas não requer carregamento de componentes.

O registro de erros no log do sistema pode exigir configuração adicional do sistema. Consulte a documentação do log do sistema para sua plataforma.

Em Windows, as mensagens de erro escritas no Diálogo de eventos no Diálogo de Aplicativos têm essas características:

* As entradas marcadas como `Error`, `Warning` e `Note` são escritas no Diário de eventos, mas não as mensagens, como as declarações de informações dos motores de armazenamento individuais.

* As entradas do Diário de eventos têm uma fonte de `MySQL` (ou `MySQL-tag` se `syseventlog.tag` é definido como *`tag`*).

Em sistemas Unix e Unix-like, o registro no log do sistema usa `syslog`. As seguintes variáveis de sistema afetam as mensagens de `syslog`:

* `syseventlog.facility`: A instalação padrão para as mensagens `syslog` é `daemon`. Estabeleça essa variável para especificar uma instalação diferente.

* `syseventlog.include_pid`: Se deve incluir o ID do processo do servidor em cada linha do `syslog` de saída.

* `syseventlog.tag`: Esta variável define uma etiqueta a ser adicionada ao identificador do servidor (`mysqld`) nas mensagens de `syslog`. Se definida, a etiqueta é anexada ao identificador com um hífen inicial.

Nota

Antes do MySQL 8.0.13, use as variáveis de sistema `log_syslog_facility`, `log_syslog_include_pid` e `log_syslog_tag` em vez das variáveis `syseventlog.xxx`.

O MySQL utiliza a etiqueta personalizada “Sistema” para mensagens importantes do sistema sobre situações que não são erros, como inicialização, desligamento e algumas mudanças significativas nas configurações. Em logs que não suportam etiquetas personalizadas, incluindo o Log de Eventos no Windows e `syslog` em sistemas Unix e similares, as mensagens do sistema são atribuídas à etiqueta usada para o nível de prioridade da informação. No entanto, essas mensagens são impressas no log mesmo que a configuração `log_error_verbosity` do MySQL normalmente exclua mensagens no nível de informação.

Quando um registro de registro deve retornar a um rótulo de “Informações” em vez de “Sistema” dessa forma, e o evento do registro é processado posteriormente fora do servidor MySQL (por exemplo, filtrado ou encaminhado por uma configuração `syslog`, esses eventos podem, por padrão, ser processados pelo aplicativo secundário como tendo prioridade de “Informações” em vez de prioridade de “Sistema”.

#### 7.4.2.9 Formato do registro de erros

Cada componente de canal de registro de erro (escritor) tem um formato de saída característico que utiliza para escrever mensagens para seu destino, mas outros fatores podem influenciar o conteúdo das mensagens:

* As informações disponíveis para o repositório de logs. Se um componente de filtro de logs for executado antes da execução do componente do repositório, ele remove um campo de evento de logs, e esse campo não estará disponível para escrita. Para informações sobre filtragem de logs, consulte a Seção 7.4.2.4, “Tipos de filtragem de logs de erro”.

* As informações relevantes para o registro de vazamento. Nem todos os vazamentos escrevem todos os campos disponíveis em eventos de erro.

* As variáveis do sistema podem afetar os pontos de retenção de logs. Consulte Variáveis do sistema que afetam o formato do log de erro.

Para nomes e descrições dos campos nos eventos de erro, consulte a Seção 7.4.2.3, “Campos dos Eventos de Erro”. Para todos os pontos de registro, o ID do thread incluído nas mensagens do log de erro é o do thread dentro do **mysqld** responsável por escrever a mensagem. Esse ID indica qual parte do servidor produziu a mensagem e é consistente com as mensagens gerais do log de consulta e do log de consulta lenta, que incluem o ID do thread de conexão.

* log_sink_internal Formato de saída * log_sink_json Formato de saída * log_sink_syseventlog Formato de saída * Formato de saída de registro de inicialização precoce * Variáveis do sistema que afetam o formato do log de erro

##### log_sink_internal Formato de saída

O repositório de registro interno produz a saída tradicional do registro de erro. Por exemplo:

```
2020-08-06T14:25:02.835618Z 0 [Note] [MY-012487] [InnoDB] DDL log recovery : begin
2020-08-06T14:25:02.936146Z 0 [Warning] [MY-010068] [Server] CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
2020-08-06T14:25:02.963127Z 0 [Note] [MY-010253] [Server] IPv6 is available.
2020-08-06T14:25:03.109022Z 5 [Note] [MY-010051] [Server] Event Scheduler: scheduler thread started with id 5
```

Mensagens com formato tradicional têm esses campos:

```
time thread [label] [err_code] [subsystem] msg
```

Os caracteres de chaves `[` e `]` são caracteres literais no formato da mensagem. Eles não indicam que os campos são opcionais.

O valor `label` corresponde ao campo de prioridade de evento de erro na forma de string do campo `prio`.

Os campos `[err_code]` e `[subsystem]` foram adicionados no MySQL 8.0. Eles estão ausentes nos registros gerados por servidores mais antigos. Os analisadores de logs podem tratar esses campos como partes do texto da mensagem que está presente apenas para logs escritos por servidores recentes o suficiente para incluí-los. Os analisadores devem tratar a parte `err_code` dos indicadores `[err_code]` como um valor de string, não um número, porque valores como `MY-012487` e `MY-010051` contêm caracteres não numéricos.

##### log_sink_json Formato de saída

O repositório de registro no formato JSON produz mensagens como objetos JSON que contêm pares chave-valor. Por exemplo:

```
{
  "prio": 3,
  "err_code": 10051,
  "source_line": 561,
  "source_file": "event_scheduler.cc",
  "function": "run",
  "msg": "Event Scheduler: scheduler thread started with id 5",
  "time": "2020-08-06T14:25:03.109022Z",
  "ts": 1596724012005,
  "thread": 5,
  "err_symbol": "ER_SCHEDULER_STARTED",
  "SQL_state": "HY000",
  "subsystem": "Server",
  "buffered": 1596723903109022,
  "label": "Note"
}
```

A mensagem exibida é reformatada para melhor legibilidade. Os eventos escritos no log de erro aparecem uma mensagem por linha.

A chave `ts` (timestamp) foi adicionada no MySQL 8.0.20 e é exclusiva para o canal de registro no formato JSON. O valor é um inteiro que indica milissegundos desde a época (`'1970-01-01 00:00:00'` UTC).

Os valores `ts` e `buffered` são valores de marcação de tempo Unix e podem ser convertidos usando `FROM_UNIXTIME()` e um divisor apropriado:

```
mysql> SET time_zone = '+00:00';
mysql> SELECT FROM_UNIXTIME(1596724012005/1000.0);
+-------------------------------------+
| FROM_UNIXTIME(1596724012005/1000.0) |
+-------------------------------------+
| 2020-08-06 14:26:52.0050            |
+-------------------------------------+
mysql> SELECT FROM_UNIXTIME(1596723903109022/1000000.0);
+-------------------------------------------+
| FROM_UNIXTIME(1596723903109022/1000000.0) |
+-------------------------------------------+
| 2020-08-06 14:25:03.1090                  |
+-------------------------------------------+
```

##### log_sink_syseventlog Formato de saída do log

O repositório de registro do sistema produz uma saída que se conforma ao formato de registro do sistema usado na plataforma local.

Formato de saída de registro de inicialização precoce

O servidor gera algumas mensagens de registro de erro antes que as opções de inicialização tenham sido processadas, e, portanto, antes de saber os valores das variáveis de sistema `log_error_verbosity` e `log_timestamps`, e antes de saber quais componentes de log devem ser usados. O servidor lida com mensagens de registro de erro que são geradas no início do processo de inicialização da seguinte forma:

* Antes do MySQL 8.0.14, o servidor gera mensagens com o timestamp padrão, formato e nível de verbosidade, e as armazena em buffer. Após as opções de inicialização serem processadas e a configuração do log de erro ser conhecida, o servidor descarrega as mensagens armazenadas em buffer. Como essas mensagens iniciais utilizam a configuração padrão do log, elas podem diferir do que é especificado pelas opções de inicialização. Além disso, as mensagens iniciais não são descarregadas em pontos de saída de log que não sejam o padrão. Por exemplo, o registro no ponto de saída JSON não inclui essas mensagens iniciais porque elas não estão no formato JSON.

* A partir do MySQL 8.0.14, o servidor armazena buffers de eventos de log em vez de mensagens de log formatadas. Isso permite que ele aplique retroativamente configurações a esses eventos após a configuração ser conhecida, com o resultado de que as mensagens esvaziadas utilizam as configurações configuradas, não os padrões. Além disso, as mensagens são esvaziadas para todos os vazamentos configurados, não apenas para o vazamento padrão.

Se um erro fatal ocorrer antes de a configuração do log ser conhecida e o servidor precisar sair, o servidor formata as mensagens armazenadas usando os padrões de registro padrão para que não sejam perdidas. Se não ocorrer nenhum erro fatal, mas a inicialização for excessivamente lenta antes do processamento das opções de inicialização, o servidor formata e esvazia periodicamente as mensagens armazenadas usando os padrões de registro padrão para não parecer inativo. Embora esse comportamento seja semelhante ao comportamento anterior à versão 8.0.14, pois os padrões são usados, é preferível perder mensagens quando condições excepcionais ocorrem.

##### Variáveis do sistema que afetam o formato do log de erro

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps em mensagens escritas no log de erro (assim como nos arquivos de log de consulta geral e log de consulta lenta). O servidor aplica `log_timestamps` aos eventos de erro antes que eles atinjam qualquer canal de armazenamento de logs; assim, afeta a saída de mensagens de erro de todos os canais.

Os valores permitidos `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local). Os timestamps são escritos usando o formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` que indica o horário Zulu (UTC) ou `±hh:mm` (um deslocamento que indica o ajuste do fuso horário do sistema local em relação ao UTC). Por exemplo:

```
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```

#### 7.4.2.10 Limpeza e renomeação do arquivo de registro de erro

Se você limpar o log de erro usando uma declaração `FLUSH ERROR LOGS`(flush.html#flush-error-logs) ou [`FLUSH LOGS`(flush.html#flush-logs)], ou um comando [**mysqladmin flush-logs**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program"), o servidor fecha e reabre qualquer arquivo de log de erro para o qual está escrevendo. Para renomear um arquivo de log de erro, faça isso manualmente antes de limpar. A limpeza dos logs então abre um novo arquivo com o nome do arquivo original. Por exemplo, assumindo um nome de arquivo de log de `host_name.err`, use os seguintes comandos para renomear o arquivo e criar um novo:

```
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

Em Windows, use **rename** em vez de **mv**.

Se o local do arquivo de registro de erro não for legível pelo servidor, a operação de limpeza do log não cria um novo arquivo de registro. Por exemplo, no Linux, o servidor pode escrever o log de erro no arquivo `/var/log/mysqld.log`, onde o diretório `/var/log` é de propriedade de `root` e não é legível pelo **mysqld**. Para obter informações sobre como lidar com esse caso, consulte a Seção 7.4.6, “Manutenção do Log do Servidor”.

Se o servidor não estiver escrevendo em um arquivo de registro de erro nomeado, não ocorrerá renomeamento de arquivo de registro de erro quando o registro de erro for esvaziado.

### 7.4.3 O Log de Consulta Geral

O log de consulta geral é um registro geral do que o **mysqld** está fazendo. O servidor escreve informações neste log quando os clientes se conectam ou desconectam, e ele registra cada declaração SQL recebida dos clientes. O log de consulta geral pode ser muito útil quando você suspeita de um erro em um cliente e quer saber exatamente o que o cliente enviou para o **mysqld**.

Cada linha que mostra quando um cliente se conecta também inclui `using connection_type` para indicar o protocolo usado para estabelecer a conexão. *`connection_type`* é um dos `TCP/IP` (conexão TCP/IP estabelecida sem SSL), `SSL/TLS` (conexão TCP/IP estabelecida com SSL), `Socket` (conexão de arquivo de soquete Unix), `Named Pipe` (conexão de tubo nomeado do Windows), ou `Shared Memory` (conexão de memória compartilhada do Windows).

O **mysqld** escreve declarações no log de consulta na ordem em que as recebe, o que pode diferir da ordem em que elas são executadas. Esse registro em ordem é diferente do registro binário, para o qual as declarações são escritas após serem executadas, mas antes de quaisquer bloqueios serem liberados. Além disso, o log de consulta pode conter declarações que selecionam apenas dados, enquanto essas declarações nunca são escritas no log binário.

Ao usar o registro binário baseado em declarações em um servidor de fonte de replicação, as declarações recebidas por suas réplicas são escritas no log de consulta de cada réplica. As declarações são escritas no log de consulta da fonte se um cliente ler eventos com o utilitário **mysqlbinlog** e os passar para o servidor.

No entanto, ao usar o registro binário baseado em linha, as atualizações são enviadas como mudanças de linha, em vez de declarações SQL, e, portanto, essas declarações nunca são escritas no registro de consulta quando `binlog_format` está em `ROW`. Uma atualização dada também pode não ser escrita no registro de consulta quando essa variável está definida em `MIXED`, dependendo da declaração usada. Consulte [Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declaração e Baseada em Linha”](replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication"), para mais informações.

Por padrão, o log de consulta geral é desativado. Para especificar explicitamente o estado inicial do log de consulta geral, use `--general_log[={0|1}]`. Sem argumento ou com um argumento de 1, `--general_log` habilita o log. Com um argumento de 0, esta opção desativa o log. Para especificar o nome do arquivo de log, use `--general_log_file=file_name`. Para especificar o destino do log, use a variável de sistema `log_output` (como descrito na Seção 7.4.1, “Selecionando destinos de saída de log de consulta geral e log de consulta lenta”).

Nota

Se você especificar o destino do log `TABLE`, consulte Tabelas de log e Erros de “Existem muitos arquivos abertos”.

Se você não especificar um nome para o arquivo de registro de consulta geral, o nome padrão é `host_name.log`. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o log de consulta geral ou alterar o nome do arquivo de registro no tempo real, use as variáveis de sistema globais `general_log` e `general_log_file`. Defina `general_log` para 0 (ou `OFF`) para desabilitar o log ou para 1 (ou `ON`) para habilitá-lo. Defina `general_log_file` para especificar o nome do arquivo de registro. Se um arquivo de registro já estiver aberto, ele será fechado e o novo arquivo será aberto.

Quando o log de consulta geral é habilitado, o servidor escreve a saída para quaisquer destinos especificados pela variável de sistema `log_output`. Se você habilitar o log, o servidor abre o arquivo de log e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino de log `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve consultas, mesmo que o log geral seja habilitado. Definir o nome do arquivo de log não tem efeito no registro se o valor do destino de log não contiver `FILE`.

O reinício do servidor e o esvaziamento do log não geram um novo arquivo de log de consulta geral (embora o esvaziamento o feche e o abra novamente). Para renomear o arquivo e criar um novo, use os seguintes comandos:

```
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

Em Windows, use **rename** em vez de **mv**.

Você também pode renomear o arquivo de log de consulta geral durante a execução, desabilitando o log:

```
SET GLOBAL general_log = 'OFF';
```

Com o registro desativado, renomeie o arquivo de registro externamente (por exemplo, a partir da linha de comando). Em seguida, ative o registro novamente:

```
SET GLOBAL general_log = 'ON';
```

Esse método funciona em qualquer plataforma e não requer o reinício do servidor.

Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`. (Isso pressupõe que o próprio registro de consulta geral esteja habilitado.)

As senhas em declarações escritas no log de consulta geral são reescritas pelo servidor para não ocorrerem literalmente em texto simples. A reescrita de senhas pode ser suprimida para o log de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas, por razões de segurança, não é recomendada para uso em produção. Veja também a Seção 8.1.2.3, “Senhas e Registro”.

Uma implicação da reescrita de senhas é que as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consulta geral, porque não é possível saber se elas estão livres de senha. Os casos de uso que exigem o registro de todas as declarações, incluindo aquelas com erros, devem usar a opção `--log-raw`, tendo em mente que isso também contorce a reescrita de senha.

A reescrita da senha ocorre apenas quando se espera senhas em texto simples. Para declarações com sintaxe que esperam um valor de hash de senha, não ocorre reescrita. Se uma senha em texto simples for fornecida erroneamente para tal sintaxe, a senha é registrada como fornecida, sem reescrita.

A variável de sistema `log_timestamps` controla a zona horária dos timestamps nas mensagens escritas no arquivo de log de consulta geral (assim como no arquivo de log de consultas lentas e no log de erros). Não afeta a zona horária das mensagens de log de consulta geral e log de consultas lentas escritas em tabelas de log, mas as linhas recuperadas dessas tabelas podem ser convertidas da zona horária do sistema local para qualquer zona horária desejada com `CONVERT_TZ()` ou definindo a variável de sessão `time_zone`.

### 7.4.4 O Log Binário

O log binário contém “eventos” que descrevem as mudanças no banco de dados, como operações de criação de tabelas ou alterações nos dados da tabela. Também contém eventos para declarações que potencialmente poderiam ter feito alterações (por exemplo, um `DELETE` que não encontrou nenhuma linha), a menos que o registro baseado em linha seja usado. O log binário também contém informações sobre quanto tempo cada declaração levou para atualizar os dados. O log binário tem dois propósitos importantes:

* Para a replicação, o log binário em um servidor de origem de replicação fornece um registro das alterações de dados que serão enviadas para as réplicas. A fonte envia as informações contidas em seu log binário para suas réplicas, que reproduzem essas transações para fazer as mesmas alterações de dados que foram feitas na fonte. Veja a Seção 19.2, “Implementação de Replicação”.

* Algumas operações de recuperação de dados exigem o uso do log binário. Após a restauração de um backup, os eventos no log binário que foram registrados após a criação do backup são reexecutados. Esses eventos atualizam as bases de dados a partir do ponto do backup. Veja a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)” (Recuperação).

O log binário não é usado para declarações como `SELECT` ou `SHOW` que não modificam dados. Para registrar todas as declarações (por exemplo, para identificar uma consulta com problema), use o log de consulta geral. Veja a Seção 7.4.3, “O log de consulta geral”.

Executar um servidor com registro binário ativado faz com que o desempenho seja ligeiramente mais lento. No entanto, os benefícios do registro binário, que permitem configurar a replicação e as operações de restauração, geralmente superam esse pequeno decréscimo de desempenho.

O log binário é resistente a interrupções inesperadas. Apenas eventos ou transações completas são registrados ou lidos novamente.

As senhas em declarações escritas no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. Veja também a Seção 8.1.2.3, “Senhas e Registro”.

A partir do MySQL 8.0.14, os arquivos de registro binários e os arquivos de registro de relevo podem ser criptografados, ajudando a proteger esses arquivos e os dados potencialmente sensíveis contidos neles de serem mal utilizados por atacantes externos, além de serem visualizados por usuários do sistema operacional onde estão armazenados. Você pode habilitar a criptografia em um servidor MySQL definindo a variável de sistema `binlog_encryption` para `ON`. Para mais informações, consulte a Seção 19.3.2, “Criptografando Arquivos de Registro Binários e Arquivos de Registro de Relevo”.

A discussão a seguir descreve algumas das opções e variáveis do servidor que afetam o funcionamento do registro binário. Para uma lista completa, consulte a Seção 19.1.6.4, “Opções e variáveis de registro binário”.

O registro binário é ativado por padrão (a variável de sistema `log_bin` está definida como ABERTO). A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário é desativado por padrão, mas pode ser ativado especificando a opção `--log-bin`.

Para desabilitar o registro binário, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` no momento do início. Se uma dessas opções for especificada e `--log-bin` também for especificado, a opção especificada posteriormente terá precedência.

As opções `--log-slave-updates` e `--slave-preserve-commit-order` exigem registro binário. Se você desabilitar o registro binário, omita essas opções ou especifique `--log-slave-updates=OFF` e `--skip-slave-preserve-commit-order`. O MySQL desabilita essas opções por padrão quando `--skip-log-bin` ou `--disable-log-bin` é especificado. Se você especificar `--log-slave-updates` ou `--slave-preserve-commit-order` juntamente com `--skip-log-bin` ou `--disable-log-bin`, uma mensagem de aviso ou erro é emitida.

A opção `--log-bin[=base_name]` é usada para especificar o nome base para arquivos de registro binários. Se você não fornecer a opção `--log-bin`, o MySQL usa `binlog` como o nome base padrão para os arquivos de registro binários. Para compatibilidade com versões anteriores, se você fornecer a opção `--log-bin` sem uma string ou com uma string vazia, o nome base é definido como `host_name-bin`, usando o nome da máquina hosteira. É recomendável que você especifique um nome base, para que, se o nome do hoste mudar, você possa facilmente continuar a usar os mesmos nomes de arquivos de registro binários (consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”). Se você fornecer uma extensão no nome do registro (por exemplo, `--log-bin=base_name.extension`), a extensão é silenciosamente removida e ignorada.

O aplicativo **mysqld** adiciona uma extensão numérica ao nome da base do log binário para gerar nomes de arquivos de log binário. O número aumenta cada vez que o servidor cria um novo arquivo de log, criando assim uma série ordenada de arquivos. O servidor cria um novo arquivo na série cada vez que ocorre qualquer um dos seguintes eventos:

* O servidor é iniciado ou reiniciado. * O servidor esvazia os registros. * O tamanho do arquivo de registro atual atinge `max_binlog_size`.

Um arquivo de registro binário pode se tornar maior que `max_binlog_size` se você estiver usando transações grandes, porque uma transação é escrita no arquivo de uma só vez, nunca dividida entre arquivos.

Para acompanhar quais arquivos de registro binários foram usados, o **mysqld** também cria um arquivo de índice de registro binário que contém os nomes dos arquivos de registro binários. Por padrão, esse arquivo tem o mesmo nome de base do arquivo de registro binário, com a extensão `'.index'`. Você pode alterar o nome do arquivo de índice de registro binário com a opção `--log-bin-index[=file_name]`. Você não deve editar manualmente esse arquivo enquanto o **mysqld** estiver em execução; fazer isso confundiriria o **mysqld**.

O termo "arquivo de registro binário" geralmente denota um arquivo numerado individual que contém eventos de banco de dados. O termo "registro binário" denota coletivamente o conjunto de arquivos de registro binário numerados, mais o arquivo de índice.

O local padrão para os arquivos de registro binários e o arquivo de índice de registro binário é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto no início do nome da base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de registro binário, que rastreia os arquivos de registro binários que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de índice de registro binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. O nome da base do arquivo de registro binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

Em MySQL 5.7, um ID do servidor tinha que ser especificado quando o registro binário estava habilitado, ou o servidor não seria iniciado. Em MySQL 8.0, a variável de sistema `server_id` é definida como 1 por padrão. O servidor pode ser iniciado com este ID padrão quando o registro binário está habilitado, mas uma mensagem informativa é emitida se você não especificar um ID de servidor explícito usando a variável de sistema `server_id`. Para servidores que são usados em uma topologia de replicação, você deve especificar um ID de servidor único e não nulo para cada servidor.

Um cliente que possui privilégios suficientes para definir variáveis de sistema de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de variáveis do sistema”) pode desativar o registro binário de suas próprias declarações usando uma declaração `SET sql_log_bin=OFF` (set-sql-log-bin.html "15.4.1.3 SET sql_log_bin Statement").

Por padrão, o servidor registra o comprimento do evento, bem como o próprio evento e usa isso para verificar se o evento foi escrito corretamente. Você também pode fazer com que o servidor escreva verificações de checksums para os eventos, configurando a variável de sistema `binlog_checksum`. Ao ler de volta do log binário, a fonte usa o comprimento do evento por padrão, mas pode ser feito para usar verificações de checksums, se disponíveis, habilitando a variável de sistema `source_verify_checksum` (a partir do MySQL 8.0.26) ou `master_verify_checksum` (antes do MySQL 8.0.26). O thread de I/O de replicação (receptor) na replica também verifica eventos recebidos da fonte. Você pode fazer com que o thread de SQL de replicação (aplicador) use verificações de checksums, se disponíveis, ao ler do log de relevo, habilitando a variável de sistema `replica_sql_verify_checksum` (a partir do MySQL 8.0.26) ou `slave_sql_verify_checksum` (antes do MySQL 8.0.26).

O formato dos eventos registrados no log binário depende do formato de registro binário. Três tipos de formato são suportados: registro baseado em linha, registro baseado em declaração e registro de base mista. O formato de registro binário usado depende da versão do MySQL. Para descrições gerais dos formatos de registro, consulte a Seção 7.4.4.1, “Formatos de Registro Binário”. Para informações detalhadas sobre o formato do log binário, consulte [MySQL Internals: The Binary Log][(/doc/internals/en/binary-log.html)].

O servidor avalia as opções `--binlog-do-db` e `--binlog-ignore-db` da mesma maneira que as opções `--replicate-do-db` e `--replicate-ignore-db`. Para obter informações sobre como isso é feito, consulte a Seção 19.2.5.1, “Avaliação das opções de replicação e registro binário em nível de banco de dados”.

Uma réplica é iniciada com a variável de sistema `log_replica_updates` (do MySQL 8.0.26) ou `log_slave_updates` (antes do MySQL 8.0.26) habilitada por padrão, o que significa que a réplica escreve em seu próprio log binário todas as modificações de dados que são recebidas da fonte. O log binário deve ser habilitado para que essa configuração funcione (consulte Seção 19.1.6.3, “Opções e Variáveis do Servidor de Replicação”). Esta configuração permite que a réplica atue como fonte para outras réplicas.

Você pode excluir todos os arquivos de registro binários com a declaração `RESET MASTER`, ou um subconjunto deles com `PURGE BINARY LOGS`. Veja a Seção 15.7.8.6, “Declaração RESET”, e a Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”.

Se você estiver usando replicação, não deve excluir arquivos de log binário antigos na fonte até ter certeza de que nenhuma réplica ainda precisa usá-los. Por exemplo, se suas réplicas nunca ficam mais de três dias atrasadas, uma vez por dia, você pode executar [**mysqladmin flush-logs binary**][(mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")] na fonte e, em seguida, remover quaisquer logs que tenham mais de três dias de idade. Você pode remover os arquivos manualmente, mas é preferível usar [`PURGE BINARY LOGS`][(purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement")], que também atualiza com segurança o arquivo de índice do log binário para você (e que pode aceitar um argumento de data). Veja a Seção 15.4.1.1, “Declaração PURGE BINARY LOGS”.

Você pode exibir o conteúdo dos arquivos de registro binário com o utilitário **mysqlbinlog**. Isso pode ser útil quando você deseja reprocessar declarações no log para uma operação de recuperação. Por exemplo, você pode atualizar um servidor MySQL a partir do registro binário da seguinte forma:

```
$> mysqlbinlog log_file | mysql -h server_name
```

O **mysqlbinlog** também pode ser usado para exibir o conteúdo do arquivo de registro de relé em uma replica, pois eles são escritos usando o mesmo formato que os arquivos de registro binário. Para mais informações sobre o utilitário **mysqlbinlog** e como usá-lo, consulte a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Registro Binário”. Para mais informações sobre o registro binário e as operações de recuperação, consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”).

O registro binário é feito imediatamente após uma declaração ou transação ser concluída, mas antes de quaisquer bloqueios serem liberados ou qualquer compromisso ser feito. Isso garante que o registro seja registrado na ordem do compromisso.

As atualizações de tabelas não transacionais são armazenadas no log binário imediatamente após a execução.

Em uma transação não comprometida, todas as atualizações (`UPDATE`, `DELETE` ou `INSERT`) que alteram tabelas transacionais, como as tabelas `InnoDB`, são armazenadas em cache até que uma declaração `COMMIT` seja recebida pelo servidor. Nesse ponto, o **mysqld** escreve toda a transação no log binário antes de a `COMMIT` ser executada.

As modificações em tabelas não transacionais não podem ser revertidas. Se uma transação que é revertida incluir modificações em tabelas não transacionais, toda a transação é registrada com uma declaração `ROLLBACK` no final para garantir que as modificações nessas tabelas sejam replicadas.

Quando um fio que lida com a transação começa, ele aloca um buffer de `binlog_cache_size` para bufferizar as declarações. Se uma declaração for maior que este, o fio abre um arquivo temporário para armazenar a transação. O arquivo temporário é excluído quando o fio termina. A partir do MySQL 8.0.17, se a criptografia do log binário estiver ativa no servidor, o arquivo temporário é criptografado.

A variável de status `Binlog_cache_use` mostra o número de transações que utilizaram este buffer (e possivelmente um arquivo temporário) para armazenar declarações. A variável de status `Binlog_cache_disk_use` mostra quantos desses transações realmente tiveram que usar um arquivo temporário. Essas duas variáveis podem ser usadas para ajustar `binlog_cache_size` a um valor suficientemente grande para evitar o uso de arquivos temporários.

A variável de sistema `max_binlog_cache_size` (padrão 4 GB, que também é o máximo) pode ser usada para restringir o tamanho total usado para cachear uma transação com múltiplos comandos. Se uma transação for maior que esse número de bytes, ela falha e é revertida. O valor mínimo é 4096.

Se você estiver usando o registro binário e o registro baseado em linha, as inserções concorrentes são convertidas em inserções normais para as declarações `CREATE ... SELECT` ou `INSERT ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement"). Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas, aplicando o log durante uma operação de backup. Se você estiver usando o registro baseado em declaração, a declaração original é escrita no log.

O formato de log binário tem algumas limitações conhecidas que podem afetar a recuperação a partir de backups. Veja a Seção 19.5.1, “Recursos e problemas de replicação”.

O registro binário para programas armazenados é feito conforme descrito na Seção 27.7, “Registro binário de programas armazenados”.

Observe que o formato de log binário difere no MySQL 8.0 em relação às versões anteriores do MySQL, devido aos aprimoramentos na replicação. Consulte a Seção 19.5.2, “Compatibilidade de replicação entre versões do MySQL”.

Se o servidor não conseguir gravar o log binário, esvaziar os arquivos de log binário ou sincronizar o log binário com o disco, o log binário no servidor de origem de replicação pode se tornar inconsistente e as réplicas podem perder a sincronização com a fonte. A variável de sistema `binlog_error_action` controla a ação realizada se um erro desse tipo for encontrado com o log binário.

* A configuração padrão, `ABORT_SERVER`, faz com que o servidor pare a registro binário e seja desligado. Neste ponto, você pode identificar e corrigir a causa do erro. Na reinicialização, a recuperação prossegue como no caso de um desligamento inesperado do servidor (consulte Seção 19.4.2, “Tratamento de um Desligamento Inesperado de uma Replicação”).

O cenário `IGNORE_ERROR` oferece compatibilidade reversa com versões mais antigas do MySQL. Com este cenário, o servidor continua a transação em andamento e registra o erro, depois interrompe o registro binário, mas continua a realizar atualizações. Neste ponto, você pode identificar e corrigir a causa do erro. Para retomar o registro binário, o `log_bin` deve ser habilitado novamente, o que requer um reinício do servidor. Use esta opção apenas se você precisar de compatibilidade reversa e o log binário não seja essencial nesta instância do servidor MySQL. Por exemplo, você pode usar o log binário apenas para auditoria ou depuração intermitente do servidor e não usá-lo para replicação do servidor ou confiar nele para operações de restauração em um ponto no tempo.

Por padrão, o log binário é sincronizado com o disco em cada escrita (`sync_binlog=1`). Se `sync_binlog` não foi habilitado e o sistema operacional ou a máquina (não apenas o servidor MySQL) falhou, há uma chance de que as últimas declarações do log binário possam ser perdidas. Para evitar isso, habilite a variável de sistema `sync_binlog` para sincronizar o log binário com o disco após cada *`N`* grupos de compromissos. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”. O valor mais seguro para `sync_binlog` é 1 (o padrão), mas este também é o mais lento.

Em versões anteriores do MySQL, havia a possibilidade de inconsistência entre o conteúdo da tabela e o conteúdo do log binário se ocorrer um travamento, mesmo com `sync_binlog` definido como 1. Por exemplo, se você está usando as tabelas `InnoDB` e o servidor MySQL processa uma declaração `COMMIT`, escreve muitas transações preparadas no log binário em sequência, sincroniza o log binário e, em seguida, confirma a transação em `InnoDB`. Se o servidor sair inesperadamente entre essas duas operações, a transação será revertida por `InnoDB` na reinicialização, mas ainda existirá no log binário. Esse problema foi resolvido em versões anteriores ao habilitar o suporte `InnoDB` para o compromisso de duas fases em transações XA. No MySQL 8.0, o suporte `InnoDB` para o compromisso de duas fases em transações XA é sempre habilitado.

O suporte `InnoDB` para commit de duas fases em transações XA garante que os arquivos de dados binários e os logs `InnoDB` sejam sincronizados. No entanto, o servidor MySQL também deve ser configurado para sincronizar o log binário e os logs `InnoDB` ao disco antes de comprometer a transação. Os logs `InnoDB` são sincronizados por padrão, e `sync_binlog=1` garante que o log binário seja sincronizado. O efeito do suporte implícito `InnoDB` para commit de duas fases em transações XA e `sync_binlog=1` é que, ao reiniciar após um crash, após realizar um rollback de transações, o servidor MySQL examina o arquivo de log binário mais recente para coletar os valores das transações *`xid`* e calcular a última posição válida no arquivo de log binário. O servidor MySQL, em seguida, informa ao `InnoDB` para completar quaisquer transações preparadas que foram escritas com sucesso ao log binário, e corta o log binário para a última posição válida. Isso garante que o log binário reflita os dados exatos das tabelas `InnoDB`, e, portanto, a replica permanece em sincronia com a fonte porque não recebe uma declaração que foi revertida.

Se o servidor MySQL descobrir durante a recuperação de falha que o log binário é mais curto do que deveria ter sido, ele não possui pelo menos uma transação `InnoDB` com sucesso realizada. Isso não deve acontecer se `sync_binlog=1` e o sistema de disco/arquivo realizam uma sincronização real quando são solicitados (alguns não o fazem), então o servidor exibe uma mensagem de erro `The binary log file_name is shorter than its expected size`. Neste caso, este log binário não é correto e a replicação deve ser reiniciada a partir de um novo instantâneo dos dados da fonte.

Os valores das sessões das seguintes variáveis do sistema são escritos no log binário e respeitados pela replica ao analisar o log binário:

* `sql_mode` (exceto que o modo `NO_DIR_IN_CREATE` não é replicado; veja Seção 19.5.1.39, “Replicação e Variáveis”)

* `foreign_key_checks`
* `unique_checks`
* `character_set_client`
* `collation_connection`
* `collation_database`
* `collation_server`
* `sql_auto_is_null`

#### 7.4.4.1 Formulários de registro binários

O servidor utiliza vários formatos de registro para registrar informações no log binário:

* As capacidades de replicação no MySQL originalmente eram baseadas na propagação de declarações SQL da fonte para a réplica. Isso é chamado de *registro baseado em declarações*. Você pode fazer com que esse formato seja usado iniciando o servidor com `--binlog-format=STATEMENT`.

* No registro baseado em linha (o padrão), a fonte escreve eventos no log binário que indicam como as linhas individuais da tabela são afetadas. Você pode fazer com que o servidor use registro baseado em linha iniciando-o com `--binlog-format=ROW`.

* Uma terceira opção também está disponível: *registros mistos*. Com registros mistos, o registro baseado em declarações é usado por padrão, mas o modo de registro muda automaticamente para baseado em linhas em certos casos, conforme descrito abaixo. Você pode fazer o MySQL usar registros mistos explicitamente, iniciando o **mysqld** com a opção `--binlog-format=MIXED`.

O formato de registro também pode ser definido ou limitado pelo motor de armazenamento que está sendo usado. Isso ajuda a eliminar problemas ao replicar determinadas declarações entre uma fonte e uma replica que estão usando diferentes motores de armazenamento.

Com a replicação baseada em declarações, pode haver problemas na replicação de declarações não determinísticas. Ao decidir se uma determinada declaração é segura para replicação baseada em declarações, o MySQL determina se pode garantir que a declaração possa ser replicada usando o registro baseada em declarações. Se o MySQL não puder fazer essa garantia, ele marca a declaração como potencialmente não confiável e emite o aviso, A declaração pode não ser segura para registro no formato de declaração.

Você pode evitar esses problemas usando a replicação baseada em linha do MySQL, em vez disso.

#### 7.4.4.2 Configuração do formato do log binário

Você pode selecionar o formato de registro binário explicitamente, iniciando o servidor MySQL com `--binlog-format=type`. Os valores suportados para *`type`* são:

* `STATEMENT` faz com que o registro seja baseado em declarações.

* `ROW` faz com que o registro seja baseado em linha. Esse é o padrão.

* `MIXED` faz com que o registro use formato misto.

Definir o formato de registro binário não ativa o registro binário para o servidor. A configuração só tem efeito quando o registro binário está habilitado no servidor, o que ocorre quando a variável de sistema `log_bin` é definida como `ON`. A partir do MySQL 8.0, o registro binário é habilitado por padrão e só é desativado se você especificar a opção `--skip-log-bin` ou `--disable-log-bin` na inicialização.

O formato de registro também pode ser alterado em tempo real, embora note que há várias situações em que você não pode fazer isso, conforme discutido mais adiante nesta seção. Defina o valor global da variável de sistema `binlog_format` para especificar o formato para clientes que se conectam após a alteração:

```
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

Um cliente individual pode controlar o formato de registro para suas próprias declarações, definindo o valor da sessão de `binlog_format`:

```
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Para alterar o valor global `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema globais. Para alterar o valor da sessão `binlog_format`, são necessários privilégios suficientes para definir variáveis de sistema de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

Há várias razões pelas quais um cliente pode querer configurar o registro binário em uma base por sessão:

Uma sessão que realiza muitas pequenas alterações no banco de dados pode querer usar o registro baseado em linha.

* Uma sessão que realiza atualizações que correspondem a muitas linhas na cláusula `WHERE` pode querer usar o registro baseado em declarações porque é mais eficiente registrar algumas declarações do que muitas linhas.

* Algumas declarações exigem muito tempo de execução na fonte, mas resultam em apenas algumas linhas sendo modificadas. Portanto, pode ser benéfico replicá-las usando registro baseado em linha.

Existem exceções quando você não pode alternar o formato de replicação em tempo de execução:

* O formato de replicação não pode ser alterado dentro de uma função armazenada ou de um gatilho.

* Se o motor de armazenamento `NDB` estiver habilitado.

* Se uma sessão tiver tabelas temporárias abertas, o formato de replicação não pode ser alterado para a sessão (`SET @@SESSION.binlog_format`).

* Se houver tabelas temporárias abertas em qualquer canal de replicação, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

* Se houver algum fio aplicando o canal de replicação em execução, o formato de replicação não pode ser alterado globalmente (`SET @@GLOBAL.binlog_format` ou `SET @@PERSIST.binlog_format`).

Tentar mudar o formato de replicação em qualquer um desses casos (ou tentar definir o formato de replicação atual) resulta em um erro. No entanto, você pode usar `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) para alterar o formato de replicação a qualquer momento, porque essa ação não modifica o valor da variável global do sistema em tempo de execução e só se torna eficaz após o reinício do servidor.

Não é recomendado alterar o formato de replicação em tempo de execução quando houver tabelas temporárias, porque as tabelas temporárias são registradas apenas quando se usa replicação baseada em instruções, enquanto que, com replicação baseada em linhas e replicação mista, elas não são registradas.

Mudar o formato de replicação enquanto a replicação está em andamento também pode causar problemas. Cada servidor MySQL pode definir seu próprio e apenas seu próprio formato de registro binário (verdadeiro se `binlog_format` está definido com escopo global ou de sessão). Isso significa que alterar o formato de registro em um servidor de fonte de replicação não faz com que a réplica mude seu formato de registro para corresponder. Ao usar o modo `STATEMENT`, a variável de sistema `binlog_format` não é replicada. Ao usar o modo de registro `MIXED` ou `ROW`, ele é replicado, mas ignorado pela réplica.

Uma réplica não é capaz de converter entradas de registro binário recebidas no formato de registro `ROW` para o formato `STATEMENT` para uso em seu próprio registro binário. Portanto, a réplica deve usar o formato `ROW` ou `MIXED` se a fonte o fizer. Alterar o formato de registro binário na fonte de `STATEMENT` para `ROW` ou `MIXED` durante a replicação para uma réplica com formato `STATEMENT` pode causar o fracasso da replicação com erros como Erro executando evento de linha: 'Não é possível executar a declaração: impossível escrever no registro binário, uma vez que a declaração está em formato de linha e BINLOG_FORMAT = DECLARAÇÃO.' Alterar o formato de registro binário na réplica para o formato `STATEMENT` quando a fonte ainda está usando o formato `MIXED` ou `ROW` também causa o mesmo tipo de falha de replicação. Para alterar o formato de forma segura, você deve parar a replicação e garantir que a mesma alteração seja feita tanto na fonte quanto na réplica.

Se você estiver usando as tabelas `InnoDB` e o nível de isolamento de transação é `READ COMMITTED` ou (innodb-transaction-isolation-levels.html#isolevel_read-committed), apenas o registro baseado em linha pode ser usado. É *possível* mudar o formato de registro para `STATEMENT`, mas fazer isso em tempo real rapidamente leva a erros porque `InnoDB` não pode mais realizar inserções.

Com o formato de registro binário definido como `ROW`, muitas alterações são escritas no registro binário usando o formato baseado em linha. No entanto, algumas alterações ainda usam o formato baseado em declaração. Exemplos incluem todas as declarações de DDL (linguagem de definição de dados), como `CREATE TABLE`, `ALTER TABLE` ou `DROP TABLE`.

Quando o registro binário baseado em linha é usado, a variável de sistema `binlog_row_event_max_size` e sua opção de inicialização correspondente `--binlog-row-event-max-size` definem um limite suave no tamanho máximo dos eventos de linha. O valor padrão é de 8192 bytes, e o valor só pode ser alterado na inicialização do servidor. Sempre que possível, as linhas armazenadas no registro binário são agrupadas em eventos com um tamanho que não exceda o valor desta configuração. Se um evento não puder ser dividido, o tamanho máximo pode ser excedido.

A opção `--binlog-row-event-max-size` está disponível para servidores que são capazes de replicação baseada em linhas. As linhas são armazenadas no log binário em partes com um tamanho em bytes que não exceda o valor desta opção. O valor deve ser um múltiplo de 256. O valor padrão é 8192.

Aviso

Ao usar o registro baseado em *declarações* para replicação, é possível que os dados da fonte e da replica se tornem diferentes se uma declaração for projetada de tal forma que a modificação dos dados seja não determinística; ou seja, é deixada ao otimizador de consulta. Em geral, essa não é uma boa prática, mesmo fora da replicação. Para uma explicação detalhada sobre esse problema, consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”.

#### 7.4.4.3 Formato misto de registro binário

Ao executar no formato de registro `MIXED`, o servidor muda automaticamente do registro baseado em declarações para o baseado em linhas nas seguintes condições:

* Quando uma função contém `UUID()`.

* Quando uma ou mais tabelas com colunas `AUTO_INCREMENT` são atualizadas e um gatilho ou função armazenada é invocado. Como todos os outros comandos inseguros, isso gera uma advertência se `binlog_format = STATEMENT`.

Para mais informações, consulte a Seção 19.5.1.1, “Replicação e AUTO_INCREMENT”.

* Quando o corpo de uma visão requer replicação baseada em linha, a declaração que cria a visão também a utiliza. Por exemplo, isso ocorre quando a declaração que cria uma visão utiliza a função `UUID()`.

* Quando uma chamada a uma função carregável está envolvida. * Quando `FOUND_ROWS()` ou `ROW_COUNT()` é usado. (Bug #12092, Bug #30244)

* Quando `USER()`, `CURRENT_USER()` ou `CURRENT_USER` é usado. (Bug #28086)

* Quando uma das tabelas envolvidas é uma tabela de registro no banco de dados `mysql`.

* Quando a função `LOAD_FILE()` é usada. (Bug #39701)

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

Para obter informações sobre a determinação do escopo da variável do sistema, consulte a Seção 7.1.9, “Usando variáveis do sistema”.

Para informações sobre como a replicação trata `sql_mode`, consulte a Seção 19.5.1.39, “Replicação e Variáveis”.

Em versões anteriores, quando o formato de registro binário misto estava em uso, se uma declaração fosse registrada por linha e a sessão que executou a declaração tivesse quaisquer tabelas temporárias, todas as declarações subsequentes eram tratadas como insegura e registradas no formato baseado em linha até que todas as tabelas temporárias em uso por aquela sessão fossem eliminadas. A partir do MySQL 8.0, as operações em tabelas temporárias não são registradas no formato de registro binário misto, e a presença de tabelas temporárias na sessão não tem impacto no modo de registro usado para cada declaração.

Nota

Um aviso é gerado se você tentar executar uma declaração usando o registro baseado em declaração que deve ser escrito usando o registro baseado em linha. O aviso é exibido tanto no cliente (na saída de `SHOW WARNINGS`) quanto através do log de erro do **mysqld**. Um aviso é adicionado à tabela `SHOW WARNINGS` cada vez que tal declaração é executada. No entanto, apenas a primeira declaração que gerou o aviso para cada sessão do cliente é escrita no log de erro para evitar a saturação do log.

Além das decisões acima, os motores individuais também podem determinar o formato de registro usado quando as informações em uma tabela são atualizadas. As capacidades de registro de um motor individual podem ser definidas da seguinte forma:

* Se um motor suportar o registro baseado em linha, diz-se que o motor é capaz de registro baseado em linha.

* Se um motor suportar o registro baseado em declarações, diz-se que o motor é capaz de registro baseado em declarações.

Um motor de armazenamento específico pode suportar um ou ambos os formatos de registro. O quadro a seguir lista os formatos suportados por cada motor.

<table summary="Logging formats supported by each storage engine."><col style="width: 50%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Motor de Armazenamento</th> <th scope="col">Suportado o registro de linhas</th> <th scope="col">Suporte para registro de declarações</th> </tr></thead><tbody><tr> <th scope="row"><code>ARCHIVE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>BLACKHOLE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>CSV</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>EXAMPLE</code></th> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>FEDERATED</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>HEAP</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>InnoDB</code></th> <td>Sim</td> <td>Sim, quando o nível de isolamento de transação é<code>REPEATABLE READ</code>ou<code>SERIALIZABLE</code>; Não de outra forma.</td> </tr><tr> <th scope="row"><code>MyISAM</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>MERGE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>NDB</code></th> <td>Yes</td> <td>No</td> </tr></tbody></table>

Se uma declaração deve ser registrada e o modo de registro a ser utilizado é determinado de acordo com o tipo de declaração (seguro, inseguro ou binário injetado), o formato de registro binário (`STATEMENT`, `ROW` ou `MIXED`) e as capacidades de registro do motor de armazenamento (capaz de declaração, capaz de linha, ambos ou nenhum). (Injeção binária refere-se ao registro de uma mudança que deve ser registrada usando o formato `ROW`.)

As declarações podem ser registradas com ou sem um aviso; as declarações falhadas não são registradas, mas geram erros no log. Isso é mostrado na tabela de decisão a seguir. As colunas **Tipo**, **binlog_format**, **SLC** e **RLC** definem as condições, e as colunas **Erro / Aviso** e **Registrado como** representam as ações correspondentes. **SLC** significa "capaz de registro de declarações", e **RLC** significa "capaz de registro de linhas".

<table summary="The information in this table is used to determine if a statement is to be logged and the logging mode to be used. The table outlines conditions (Safe/unsafe, binlog_format, SLC, RLR) and corresponding actions."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th scope="col">Type</th> <th scope="col"><code>binlog_format</code></th> <th scope="col">SLC</th> <th scope="col">RLC</th> <th scope="col">Error / Warning</th> <th scope="col">Logged as</th> </tr></thead><tbody><tr> <th scope="row">*</th> <td><code>*</code></td> <td>No</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging is impossible since at least one engine is involved that is both row-incapable and statement-incapable.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>No</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>No</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>ROW</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>No</td> <td><span class="errortext">Warning: Unsafe statement binlogged in statement format</span>, since <code class="literal">BINLOG_FORMAT = STATEMENT</code></td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging of an unsafe statement is impossible when the storage engine is limited to statement-based logging, even if <code>BINLOG_FORMAT = MIXED</code>.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>ROW</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th scope="row">Injeção de linha</th> <td><code>STATEMENT</code></td> <td>Sim</td> <td>Não</td> <td>Erro: Não é possível executar injeção de linha: o registro binário não é possível, uma vez que pelo menos uma tabela utiliza um mecanismo de armazenamento que não é capaz de registro baseado em linha.</td> <td>-</td> </tr><tr> <th scope="row">Injeção de linha</th> <td><code>MIXED</code></td> <td>Sim</td> <td>Não</td> <td>Erro: Não é possível executar injeção de linha: o registro binário não é possível, uma vez que pelo menos uma tabela utiliza um mecanismo de armazenamento que não é capaz de registro baseado em linha.</td> <td>-</td> </tr><tr> <th scope="row">Injeção de linha</th> <td><code>ROW</code></td> <td>Sim</td> <td>Não</td> <td>Erro: Não é possível executar injeção de linha: o registro binário não é possível, uma vez que pelo menos uma tabela utiliza um mecanismo de armazenamento que não é capaz de registro baseado em linha.</td> <td>-</td> </tr><tr> <th scope="row">Safe</th> <td><code>STATEMENT</code></td> <td>No</td> <td>Yes</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code class="literal">BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>STATEMENT</code></td> <td>No</td> <td>Yes</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code class="literal">BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td> <td>-</td> </tr><tr> <th scope="row">Unsafe</th> <td><code>MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>STATEMENT</code></td> <td>No</td> <td>Yes</td> <td>Error: Cannot execute row injection: Binary logging is not possible since <code class="literal">BINLOG_FORMAT = STATEMENT</code>.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td><span class="errortext">Warning: Unsafe statement binlogged in statement format</span> since <code class="literal">BINLOG_FORMAT = STATEMENT</code>.</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td>Error: Cannot execute row injection: Binary logging is not possible because <code class="literal">BINLOG_FORMAT = STATEMENT</code>.</td> <td>-</td> </tr><tr> <th scope="row">Row Injection</th> <td><code>MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr></tbody></table>

Quando uma advertência é produzida pela determinação, uma advertência padrão do MySQL é produzida (e está disponível usando `SHOW WARNINGS`). As informações também são escritas no log de erro do **mysqld**. Apenas um erro por cada instância de erro por conexão do cliente é registrado para evitar a saturação do log. A mensagem do log inclui a declaração SQL que foi tentada.

Se uma réplica tiver `log_error_verbosity` definida para exibir avisos, a réplica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de releio onde ela começa seu trabalho, quando está passando para outro log de releio, quando se reconecta após uma desconexão, declarações que são inseguras para o registro baseado em declarações, e assim por diante.

#### 7.4.4.4 Formato de registro para alterações em tabelas de banco de dados mysql

Os conteúdos das tabelas de concessão no banco de dados `mysql` podem ser modificados diretamente (por exemplo, com `INSERT` ou `DELETE`) ou indiretamente (por exemplo, com `GRANT` ou `CREATE USER`). As declarações que afetam as tabelas do banco de dados `mysql` são escritas no log binário usando as seguintes regras:

As declarações de manipulação de dados que alteram diretamente os dados nas tabelas do banco de dados `mysql` são registradas de acordo com a configuração da variável de sistema `binlog_format`. Isso se aplica a declarações como `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `DO`, `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement"), `SELECT` e `TRUNCATE TABLE`.

* As declarações que alteram indiretamente o banco de dados `mysql` são registradas como declarações, independentemente do valor de `binlog_format`. Isso se aplica a declarações como `GRANT`, `REVOKE`, `SET PASSWORD`, `RENAME USER`, `CREATE` (todas as formas, exceto `CREATE TABLE ... SELECT`(create-table.html "15.1.20 CREATE TABLE Statement"), `ALTER` (todas as formas) e `DROP` (todas as formas).

`CREATE TABLE ... SELECT` (create-table.html "15.1.20 CREATE TABLE Statement") é uma combinação de definição de dados e manipulação de dados. A parte `CREATE TABLE` é registrada usando o formato de declaração e a parte `SELECT` é registrada de acordo com o valor de `binlog_format`.

#### 7.4.4.5 Compressão de transações de registro binário

A partir do MySQL 8.0.20, você pode habilitar a compressão de transações de log binário em uma instância do servidor MySQL. Quando a compressão de transações de log binário é habilitada, os payloads das transações são comprimidos usando o algoritmo zstd e, em seguida, escritos no arquivo de log binário do servidor como um único evento (um `Transaction_payload_event`).

Os payloads de transações comprimidos permanecem em estado comprimido enquanto são enviados na corrente de replicação para réplicas, outros membros do grupo de replicação do grupo ou clientes como **mysqlbinlog**. Eles não são descomprimidos por threads do receptor e são escritos no log de releio ainda em seu estado comprimido. A compressão de transações de log binário, portanto, economiza espaço de armazenamento tanto no remetente da transação quanto no destinatário (e para seus backups), e economiza largura de banda de rede quando as transações são enviadas entre instâncias do servidor.

Os payloads de transações comprimidos são descomprimidos quando os eventos individuais contidos neles precisam ser inspecionados. Por exemplo, o `Transaction_payload_event` é descomprimido por um fio aplicável para aplicar os eventos que ele contém no destinatário. A descomprimagem também é realizada durante a recuperação, pelo **mysqlbinlog** ao refazer transações, e pelas declarações [[`SHOW BINLOG EVENTS`][(show-binlog-events.html "15.7.7.2 SHOW BINLOG EVENTS Statement")]] e [[`SHOW RELAYLOG EVENTS`][(show-relaylog-events.html "15.7.7.32 SHOW RELAYLOG EVENTS Statement")]].

Você pode habilitar a compressão de transações de log binário em uma instância do servidor MySQL usando a variável de sistema `binlog_transaction_compression`, que tem como padrão `OFF`. Você também pode usar a variável de sistema `binlog_transaction_compression_level_zstd` para definir o nível do algoritmo zstd que é usado para compressão. Esse valor determina o esforço de compressão, de 1 (o menor esforço) a 22 (o maior esforço). À medida que o nível de compressão aumenta, a taxa de compressão aumenta, o que reduz o espaço de armazenamento e a largura de banda de rede necessários para o payload da transação. No entanto, o esforço necessário para a compressão de dados também aumenta, consumindo tempo e recursos de CPU e memória no servidor de origem. Aumentos no esforço de compressão não têm uma relação linear com aumentos na taxa de compressão.

Definir `binlog_transaction_compression` ou `binlog_transaction_compression_level_zstd` (ou ambos) não tem efeito imediato, mas se aplica a todas as declarações subsequentes `START REPLICA` (`START SLAVE`).

No NDB 8.0.31 e versões posteriores, você pode habilitar o registro binário de transações compactadas para tabelas usando o mecanismo de armazenamento `NDB` no momento da execução, usando a variável de sistema `ndb_log_transaction_compression` introduzida nessa versão, e controlar o nível de compactação usando `ndb_log_transaction_compression_level_zstd`. Começar o **mysqld** com `--binlog-transaction-compression` na linha de comando ou em um arquivo `my.cnf` faz com que o `ndb_log_transaction_compression` seja habilitado automaticamente e qualquer configuração da opção `--ndb-log-transaction-compression` seja ignorada; para desabilitar a compactação de transações de registro binário para o mecanismo de armazenamento `NDB` *apenas*, defina `ndb_log_transaction_compression=OFF` em uma sessão do cliente após iniciar o **mysqld**.

(*Antes da NDB 8.0.31*: A compressão de transações de log binário pode ser habilitada no NDB Cluster, mas apenas ao iniciar o servidor usando a opção --binlog-transaction-compression (e possivelmente --binlog-transaction-compression-level-zstd também); alterar o valor de qualquer uma ou ambas as variáveis do sistema `binlog_transaction_compression` e `binlog_transaction_compression_level_zstd` no momento da execução não afeta o registro das tabelas `NDB`.

Os seguintes tipos de evento são excluídos da compressão de transações de registro binário, portanto, são sempre escritos não comprimidos no registro binário:

* Eventos relacionados ao GTID para a transação (incluindo eventos anônimos de GTID).

* Outros tipos de eventos de controle, como eventos de mudança de visualização e eventos de batimento cardíaco.

* Eventos de incidente e todas as transações que os contenham.

* Eventos não transacionais e todas as transações que os contêm. Uma transação que envolve uma mistura de motores de armazenamento não transacional e transacional não tem seu payload comprimido.

* Eventos que são registrados usando registro binário baseado em declarações. A compressão de transações de registro binário é aplicada apenas para o formato de registro binário baseado em linha.

A criptografia de log binário pode ser usada em arquivos de log binários que contêm transações comprimidas.

##### 7.4.4.5.1 Comportamentos quando a Compressão de Transação de Registro Binário é Ativa

As transações com cargas úteis compactadas podem ser desfeitas como qualquer outra transação, e também podem ser filtradas em uma replica pelas opções de filtragem usuais. A compactação de transações de registro binário pode ser aplicada a transações XA.

Quando a compressão de transações de registro binário é habilitada, os limites `max_allowed_packet` e `replica_max_allowed_packet` ou `slave_max_allowed_packet` para o servidor ainda se aplicam e são medidos no tamanho comprimido do `Transaction_payload_event`, mais os bytes usados para o cabeçalho do evento.

Importante

Os payloads de transações compactados são enviados como um único pacote, em vez de cada evento da transação ser enviado em um pacote individual, como é o caso quando a compressão de transações de log binário não está em uso. Se sua topologia de replicação lida com grandes transações, esteja ciente de que uma grande transação que pode ser replicada com sucesso quando a compressão de transações de log binário não está em uso, pode parar a replicação devido ao seu tamanho quando a compressão de transações de log binário está em uso.

Para trabalhadores multithread, cada transação (incluindo seu evento GTID e `Transaction_payload_event`) é atribuída a um fio de trabalho. O fio de trabalho descomprime o payload da transação e aplica os eventos individuais nele, um a um. Se um erro for encontrado ao aplicar qualquer evento dentro do `Transaction_payload_event`, a transação completa é relatada ao coordenador como tendo falhado. Quando `replica_parallel_type` ou `slave_parallel_type` é definido como `DATABASE`, todas as bases de dados afetadas pela transação são mapeadas antes de a transação ser agendada. O uso da compressão de transação de log binário com a política `DATABASE` pode reduzir o paralelismo em comparação com transações não compactadas, que são mapeadas e agendadas para cada evento.

Para a replicação semisíncrona (consulte a Seção 19.4.10, “Replicação Semisíncrona”), a replica reconhece a transação quando o `Transaction_payload_event` completo é recebido.

Quando os checksums de registro binário estão habilitados (o que é o padrão), o servidor de origem de replicação não escreve checksums para eventos individuais em um payload de transação comprimido. Em vez disso, um checksum é escrito para o conjunto completo de `Transaction_payload_event`, e checksums individuais são escritos para quaisquer eventos que não foram comprimidos, como eventos relacionados a GTIDs.

Para as declarações `SHOW BINLOG EVENTS` e `SHOW RELAYLOG EVENTS`, o `Transaction_payload_event` é impresso primeiro como uma única unidade, depois é descompactado e cada evento dentro dele é impresso.

Para operações que fazem referência à posição final de um evento, como `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") (ou antes do MySQL 8.0.22, `START SLAVE`(start-slave.html "15.4.2.7 START SLAVE Statement")) com a cláusula `UNTIL`, `SOURCE_POS_WAIT()` ou `MASTER_POS_WAIT()`, e `sql_replica_skip_counter` ou `sql_slave_skip_counter`, você deve especificar a posição final do payload de transação comprimida (o `Transaction_payload_event`). Ao ignorar eventos usando `sql_replica_skip_counter` ou `sql_slave_skip_counter`, um payload de transação comprimida é contado como um único valor de contador, então todos os eventos dentro dele são ignorados como uma unidade.

##### 7.4.4.5.2 Combinando cargas de transação comprimidas e não comprimidas

Os servidores do MySQL que suportam compressão de transações de log binário podem lidar com uma mistura de cargas de trabalho de transações comprimidas e não comprimidas.

* As variáveis do sistema relacionadas à compressão de transações de log binário não precisam ser definidas da mesma forma em todos os membros do grupo de replicação do grupo e não são replicadas de fontes para réplicas em uma topologia de replicação. Você pode decidir se a compressão de transações de log binário é apropriada ou não para cada instância do servidor MySQL que possui um log binário.

* Se a compressão de transações estiver habilitada e depois desabilitada em um servidor, a compressão não será aplicada a transações futuras originadas nesse servidor, mas os payloads de transação que já foram comprimidos ainda podem ser manipulados e exibidos.

* Se a compressão de transações for especificada para sessões individuais, definindo o valor da sessão de `binlog_transaction_compression`, o log binário pode conter uma mistura de cargas de transação comprimidas e não comprimidas.

Quando uma fonte em uma topologia de replicação e sua réplica possuem a compressão de transações de log binário habilitada, a réplica recebe cargas de trabalho de transações comprimidas e as escreve comprimidas em seu log de relevo. Ela descomprime as cargas de trabalho de transações para aplicar as transações e, em seguida, as comprime novamente após aplicar para escrita em seu log binário. Quaisquer réplicas subsequentes recebem as cargas de trabalho de transações comprimidas.

Quando uma fonte em uma topologia de replicação tem compressão de transações de log binário habilitada, mas sua replica não, a replica recebe cargas de trabalho de transações comprimidas e as escreve comprimidas em seu log de relevo. Ela descomprime as cargas de trabalho de transações para aplicar as transações e, em seguida, as escreve não comprimidas em seu próprio log binário, se tiver um. Quaisquer réplicas subsequentes recebem as cargas de trabalho de transações não comprimidas.

Quando uma fonte em uma topologia de replicação não tem a compressão de transações de log binário habilitada, mas sua replica sim, se a replica tiver um log binário, ela comprime os payloads das transações após aplicá-los e escreve os payloads de transações comprimidos em seu log binário. Quaisquer réplicas subsequentes recebem os payloads de transações comprimidos.

Quando uma instância do servidor MySQL não tem um log binário, se estiver em uma versão do MySQL 8.0.20, ela pode receber, manipular e exibir cargas de transação comprimidas, independentemente de seu valor para `binlog_transaction_compression`. Cargas de transação comprimidas recebidas por tais instâncias de servidor são escritas em seu estado comprimido no log de retransmissão, então elas se beneficiam indiretamente da compressão que foi realizada por outros servidores na topologia de replicação.

Uma réplica em uma versão anterior ao MySQL 8.0.20 não pode replicar a partir de uma fonte com compressão de transações de log binário habilitada. Uma réplica em uma versão ou superior ao MySQL 8.0.20 pode replicar a partir de uma fonte em uma versão anterior que não suporte compressão de transações de log binário, e pode realizar sua própria compressão em transações recebidas dessa fonte ao escrevê-las em seu próprio log binário.

##### 7.4.4.5.3 Monitoramento da Compressão de Transações de Registro Binário

Você pode monitorar os efeitos da compressão de transações de log binário usando a tabela do Schema de desempenho `binary_log_transaction_compression_stats`. As estatísticas incluem a taxa de compressão de dados para o período monitorado, e você também pode visualizar o efeito da compressão na última transação no servidor. Você pode redefinir as estatísticas truncando a tabela. As estatísticas para logs binários e logs de retransmissão são separadas para que você possa ver o impacto da compressão para cada tipo de log. A instância do servidor MySQL deve ter um log binário para produzir essas estatísticas.

A tabela do Schema de Desempenho `events_stages_current` mostra quando uma transação está na fase de descomprimiu ou compressão para seu payload de transação e exibe seu progresso para essa fase. A compressão é realizada pelo thread do trabalhador que está lidando com a transação, logo antes da transação ser comprometida, desde que não haja eventos na cache de captura finalizada que excluam a transação da compressão de transação de log binário (por exemplo, eventos incidentes). Quando a descomprimiu é necessária, ela é realizada para um evento do payload de cada vez.

O **mysqlbinlog** com a opção `--verbose` inclui comentários que indicam o tamanho comprimido e o tamanho descomprimido para os payloads de transação comprimidos, e o algoritmo de compressão que foi utilizado.

Você pode habilitar a compressão de conexão ao nível do protocolo para conexões de replicação, usando as opções `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL` | `MASTER_ZSTD_COMPRESSION_LEVEL` da declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23), ou a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol`. Se você habilitar a compressão de transações de log binário em um sistema onde a compressão de conexão também está habilitada, o impacto da compressão de conexão é reduzido, pois pode haver pouca oportunidade para comprimir ainda mais os payloads de transações comprimidas. No entanto, a compressão de conexão ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagem. A compressão de transações de log binário pode ser habilitada em combinação com a compressão de conexão se você precisar economizar espaço de armazenamento e largura de banda de rede. Para mais informações sobre compressão de conexão para conexões de replicação, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Para a Replicação em Grupo, a compressão é habilitada por padrão para mensagens que excedem o limite definido pela variável de sistema `group_replication_compression_threshold`. Você também pode configurar a compressão para mensagens enviadas para recuperação distribuída pelo método de transferência de estado de um log binário de um doador, usando as variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level`. Se você habilitar a compressão de transações de log binário em um sistema onde essas são configuradas, a compressão de mensagens da Replicação em Grupo ainda pode operar em eventos não comprimidos e em cabeçalhos de mensagem, mas seu impacto é reduzido. Para mais informações sobre compressão de mensagens para a Replicação em Grupo, consulte a Seção 20.7.4, “Compressão de Mensagens”.

### 7.4.5 O Log de Consulta Lenta

O registro de consultas lentas consiste em instruções SQL que levam mais de `long_query_time` segundos para serem executadas e exigem pelo menos `min_examined_row_limit` linhas a serem examinadas. O registro de consultas lentas pode ser usado para encontrar consultas que levam um longo tempo para serem executadas e, portanto, são candidatas à otimização. No entanto, examinar um longo registro de consultas lentas pode ser uma tarefa demorada. Para facilitar isso, você pode usar o comando **mysqldumpslow** para processar um arquivo de registro de consultas lentas e resumir seu conteúdo. Veja a Seção 6.6.10, “mysqldumpslow — Resumir arquivos de registro de consultas lentas”.

O tempo para adquirir as chaves iniciais não é contado como tempo de execução. **mysqld** escreve uma declaração no log de consulta lenta após ela ter sido executada e após todas as chaves terem sido liberadas, então a ordem do log pode diferir da ordem de execução.

* Parâmetros do registro de consultas lentas * Conteúdo do registro de consultas lentas

#### Parâmetros do registro de consultas lentas

Os valores mínimo e padrão de `long_query_time` são 0 e 10, respectivamente. O valor pode ser especificado com uma resolução de microssegundos.

Por padrão, as declarações administrativas não são registradas, assim como as consultas que não utilizam índices para pesquisas. Esse comportamento pode ser alterado usando `log_slow_admin_statements` e `log_queries_not_using_indexes`, conforme descrito mais adiante.

Por padrão, o registro de consultas lentas é desativado. Para especificar explicitamente o estado inicial do registro de consultas lentas, use `--slow_query_log[={0|1}]`. Sem argumento ou com um argumento de 1, `--slow_query_log` habilita o registro. Com um argumento de 0, esta opção desativa o registro. Para especificar o nome do arquivo de registro, use `--slow_query_log_file=file_name`. Para especificar o destino do registro, use a variável de sistema `log_output` (como descrito na Seção 7.4.1, “Selecionando destinos de saída do registro de consultas gerais e do registro de consultas lentas”).

Nota

Se você especificar o destino do registro `TABLE`, consulte Tabelas de registro e Erros de "Existem muitos arquivos abertos".

Se você não especificar um nome para o arquivo de registro de consultas lentas, o nome padrão é `host_name-slow.log`. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o registro de consultas lentas ou alterar o nome do arquivo de registro no tempo real, use as variáveis de sistema globais `slow_query_log` e `slow_query_log_file`. Defina `slow_query_log` para 0 para desabilitar o registro ou para 1 para habilitá-lo. Defina `slow_query_log_file` para especificar o nome do arquivo de registro. Se um arquivo de registro já estiver aberto, ele será fechado e o novo arquivo será aberto.

O servidor escreve menos informações no registro de consultas lentas se você usar a opção `--log-short-format`.

Para incluir declarações administrativas lentas no registro de consultas lentas, habilite a variável de sistema `log_slow_admin_statements`. As declarações administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

Para incluir consultas que não utilizam índices para pesquisas de linha nas declarações escritas no log de consultas lentas, habilite a variável de sistema `log_queries_not_using_indexes`. (Mesmo com essa variável habilitada, o servidor não registra consultas que não se beneficiariam da presença de um índice devido à tabela ter menos de duas linhas.)

Quando as consultas que não utilizam um índice são registradas, o registro de consultas lentas pode crescer rapidamente. É possível estabelecer um limite de taxa para essas consultas, definindo a variável de sistema `log_throttle_queries_not_using_indexes`. Por padrão, essa variável é 0, o que significa que não há limite. Valores positivos impõem um limite por minuto para o registro de consultas que não utilizam índices. A primeira consulta desse tipo abre uma janela de 60 segundos dentro da qual o servidor registra consultas até o limite dado, e depois suprime consultas adicionais. Se houver consultas suprimidas quando a janela termina, o servidor registra um resumo que indica quantos havia e o tempo agregado gasto nelas. A próxima janela de 60 segundos começa quando o servidor registra a próxima consulta que não utiliza índices.

O servidor utiliza os parâmetros de controle na seguinte ordem para determinar se deve escrever uma consulta no registro de consultas lentas:

1. A consulta não pode ser uma declaração administrativa, ou `log_slow_admin_statements` deve ser habilitado.

2. A consulta deve ter levado pelo menos `long_query_time` segundos, ou `log_queries_not_using_indexes` deve estar habilitado e a consulta não deve ter usado índices para pesquisas de linha.

3. A consulta deve ter examinado pelo menos `min_examined_row_limit` linhas.

4. A consulta não deve ser suprimida de acordo com a configuração `log_throttle_queries_not_using_indexes`.

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps em mensagens escritas no arquivo de registro de consultas lentas (assim como no arquivo de registro de consultas gerais e no registro de erros). Não afeta o fuso horário das mensagens de registro de consultas gerais e de registro de consultas lentas escritas em tabelas de registro, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sessão `time_zone`.

Por padrão, uma replica não escreve consultas replicadas no registro de consultas lentas. Para alterar isso, habilite a variável do sistema `log_slow_replica_statements` (a partir do MySQL 8.0.26) ou `log_slow_slave_statements` (antes do MySQL 8.0.26). Observe que, se a replicação baseada em linha estiver em uso (`binlog_format=ROW`), essas variáveis do sistema não terão efeito. As consultas são adicionadas apenas ao registro de consultas lentas da replica quando elas são registradas em formato de declaração no log binário, ou seja, quando `binlog_format=STATEMENT` está definido, ou quando `binlog_format=MIXED` está definido e a declaração é registrada em formato de declaração. As consultas lentas que são registradas em formato de linha quando `binlog_format=MIXED` está definido, ou que são registradas quando `binlog_format=ROW` está definido, não são adicionadas ao registro de consultas lentas da replica, mesmo que `log_slow_replica_statements` ou `log_slow_slave_statements` esteja habilitado.

#### Conteúdo do Log de Consultas Lentas

Quando o registro de consultas lentas é habilitado, o servidor escreve a saída para quaisquer destinos especificados pela variável de sistema `log_output`. Se você habilitar o registro, o servidor abre o arquivo de registro e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino de registro `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve consultas, mesmo que o registro de consultas lentas seja habilitado. Definir o nome do arquivo de registro não tem efeito no registro se `FILE` não for selecionado como destino de saída.

Se o registro de consultas lentas estiver habilitado e `FILE` estiver selecionado como destino de saída, cada declaração escrita no registro é precedida por uma linha que começa com um caractere `#` e possui esses campos (com todos os campos em uma única linha):

* `Query_time: duration`

O tempo de execução da declaração em segundos.

* `Lock_time: duration`

O tempo para adquirir fechaduras em segundos.

* `Rows_sent: N`

O número de linhas enviadas ao cliente.

* `Rows_examined:`

O número de linhas examinadas pela camada de servidor (não contando qualquer processamento interno dos motores de armazenamento).

Ativação da variável de sistema `log_slow_extra` (disponível a partir do MySQL 8.0.14) faz com que o servidor escreva os seguintes campos extras no `FILE` de saída, além dos que foram listados acima (a saída `TABLE` não é afetada). Algumas descrições de campo referem-se a nomes de variáveis de status. Consulte as descrições das variáveis de status para obter mais informações. No entanto, no log de consultas lentas, os contadores são valores por declaração, não valores cumulativos por sessão.

* `Thread_id: ID`

O identificador do fio de declaração.

* `Errno: error_number`

O número do erro de declaração, ou 0 se não houver ocorrido nenhum erro.

* `Killed: N`

Se a declaração foi encerrada, o número de erro que indica o motivo, ou 0 se a declaração foi encerrada normalmente.

* `Bytes_received: N`

O valor `Bytes_received` para a declaração.

* `Bytes_sent: N`

O valor `Bytes_sent` para a declaração.

* `Read_first: N`

O valor `Handler_read_first` para a declaração.

* `Read_last: N`

O valor `Handler_read_last` para a declaração.

* `Read_key: N`

O valor `Handler_read_key` para a declaração.

* `Read_next: N`

O valor `Handler_read_next` para a declaração.

* `Read_prev: N`

O valor `Handler_read_prev` para a declaração.

* `Read_rnd: N`

O valor `Handler_read_rnd` para a declaração.

* `Read_rnd_next: N`

O valor `Handler_read_rnd_next` para a declaração.

* `Sort_merge_passes: N`

O valor `Sort_merge_passes` para a declaração.

* `Sort_range_count: N`

O valor `Sort_range` para a declaração.

* `Sort_rows: N`

O valor `Sort_rows` para a declaração.

* `Sort_scan_count: N`

O valor `Sort_scan` para a declaração.

* `Created_tmp_disk_tables: N`

O valor `Created_tmp_disk_tables` para a declaração.

* `Created_tmp_tables: N`

O valor `Created_tmp_tables` para a declaração.

* `Start: timestamp`

O horário de início da execução da declaração.

* `End: timestamp`

O horário de término da execução da declaração.

Um arquivo de registro de consulta lenta dado pode conter uma mistura de linhas com e sem os campos extras adicionados ao habilitar `log_slow_extra`. Os analisadores de arquivo de registro podem determinar se uma linha contém os campos adicionais pelo número de campos.

Cada declaração escrita no arquivo de registro de consulta lenta é precedida por uma declaração `SET` que inclui um timestamp. A partir do MySQL 8.0.14, o timestamp indica quando a declaração lenta começou a ser executada. Antes do 8.0.14, o timestamp indica quando a declaração lenta foi registrada (o que ocorre após a declaração terminar de ser executada).

As senhas em declarações escritas no registro de consultas lentas são reescritas pelo servidor para não ocorrerem literalmente em texto simples. Veja a Seção 8.1.2.3, “Senhas e Registro”.

A partir do MySQL 8.0.29, as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consultas lentas.

### 7.4.6 Manutenção dos registros do servidor

Como descrito na Seção 7.4, “Logs do MySQL Server”, o MySQL Server pode criar vários arquivos de registro diferentes para ajudá-lo a ver quais atividades estão ocorrendo. No entanto, você deve limpar esses arquivos regularmente para garantir que os registros não ocupem muito espaço em disco.

Ao usar o MySQL com o registro habilitado, você pode querer fazer backup e remover arquivos de registro antigos de tempos em tempos e dizer ao MySQL para começar a registrar em novos arquivos. Veja a Seção 9.2, “Métodos de Backup de Banco de Dados”.

Em uma instalação Linux (Red Hat), você pode usar o script `mysql-log-rotate` para a manutenção do log. Se você instalou o MySQL a partir de uma distribuição RPM, este script deve ter sido instalado automaticamente. Tenha cuidado com este script se você estiver usando o log binário para replicação. Você não deve remover logs binários até ter certeza de que o conteúdo deles foi processado por todas as réplicas.

Em outros sistemas, você deve instalar um pequeno script que você inicia a partir do **cron** (ou seu equivalente) para lidar com arquivos de registro.

Os arquivos de registro binários são removidos automaticamente após o período de expiração do log binário do servidor. A remoção dos arquivos pode ocorrer na inicialização e quando o log binário é esvaziado. O período de expiração padrão do log binário é de 30 dias. Para especificar um período de expiração alternativo, use a variável de sistema `binlog_expire_logs_seconds`. Se você estiver usando replicação, deve especificar um período de expiração que não seja inferior ao máximo tempo em que suas réplicas podem ficar para trás em relação à fonte. Para remover logs binários sob demanda, use a declaração `PURGE BINARY LOGS`(purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement") (consulte Seção 15.4.1.1, “Declarar PURGE BINARY LOGS”).

Para forçar o MySQL a começar a usar novos arquivos de registro, limpe os registros. O esvaziamento de registros ocorre quando você executa uma declaração `FLUSH LOGS`(flush.html#flush-logs) ou o comando [**mysqladmin flush-logs**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program"), **mysqladmin refresh**, **mysqldump --flush-logs**, ou [**mysqldump --master-data**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"). Veja a Seção 15.7.8.3, “Declaração FLUSH”, a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”, e a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”. Além disso, o servidor esvazia o log binário automaticamente quando o tamanho atual do arquivo de log binário atinge o valor da variável de sistema `max_binlog_size`.

`FLUSH LOGS` suporta modificadores opcionais para permitir o esvaziamento seletivo de registros individuais (por exemplo, `FLUSH BINARY LOGS`). Veja a Seção 15.7.8.3, “Instrução FLUSH”.

Uma operação de limpeza de registro tem os seguintes efeitos:

* Se o registro binário estiver habilitado, o servidor fecha o arquivo de registro binário atual e abre um novo arquivo de registro com o próximo número de sequência.

* Se o registro de consultas gerais ou o registro de consultas lentas em um arquivo de registro estiverem habilitados, o servidor fecha e reabre o arquivo de registro.

* Se o servidor foi iniciado com a opção `--log-error` para fazer com que o log de erro seja escrito em um arquivo, o servidor fecha e reabre o arquivo de log.

A execução de declarações ou comandos de limpeza de logs requer a conexão com o servidor usando uma conta que tenha o privilégio `RELOAD`. Em sistemas Unix e Unix-like, outra maneira de limpar os logs é enviar um sinal para o servidor, o que pode ser feito por `root` ou a conta que possui o processo do servidor. (Veja a Seção 6.10, “Tratamento de Sinais Unix no MySQL”.) Os sinais permitem que a limpeza de logs seja realizada sem a necessidade de se conectar ao servidor:

* Um sinal `SIGHUP` apaga todos os registros. No entanto, `SIGHUP` tem efeitos adicionais além do apagamento de registros que podem ser indesejáveis.

* A partir do MySQL 8.0.19, `SIGUSR1` faz com que o servidor limpe o log de erro, o log de consulta geral e o log de consulta lenta. Se você está interessado em limpar apenas esses logs, `SIGUSR1` pode ser usado como um sinal mais "leve" que não tem os efeitos do `SIGHUP` que não estão relacionados aos logs.

Como mencionado anteriormente, o esvaziamento do log binário cria um novo arquivo de log binário, enquanto o esvaziamento do log de consulta geral, do log de consulta lenta ou do log de erro apenas fecha e reabre o arquivo de log. Para os últimos logs, para criar um novo arquivo de log no Unix, renomeie o arquivo de log atual primeiro antes de esvaziá-lo. No momento do esvaziamento, o servidor abre o novo arquivo de log com o nome original. Por exemplo, se os arquivos de log de consulta geral, consulta lenta e erro forem nomeados `mysql.log`, `mysql-slow.log` e `err.log`, você pode usar uma série de comandos como este a partir da linha de comando:

```
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

Em Windows, use **rename** em vez de **mv**.

Neste ponto, você pode fazer um backup de `mysql.log.old`, `mysql-slow.log.old` e `err.log.old`, e depois removê-los do disco.

Para renomear o log de consulta geral ou o log de consulta lenta no tempo real, conecte-se primeiro ao servidor e desabilite o log:

```
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

Com os registros desativados, renomeie os arquivos de registro externamente (por exemplo, a partir da linha de comando). Em seguida, ative os registros novamente:

```
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

Esse método funciona em qualquer plataforma e não requer o reinício do servidor.

Nota

Para que o servidor recree um arquivo de registro dado depois que você renomeou o arquivo externamente, a localização do arquivo deve ser legível pelo servidor. Isso nem sempre é o caso. Por exemplo, no Linux, o servidor pode escrever o log de erro como `/var/log/mysqld.log`, onde `/var/log` é de propriedade de `root` e não é legível por **mysqld**. Nesse caso, as operações de limpeza de log não conseguem criar um novo arquivo de registro.

Para lidar com essa situação, você deve criar manualmente o novo arquivo de registro com a propriedade adequada após renomear o arquivo de registro original. Por exemplo, execute esses comandos como `root`:

```
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```
