### 7.4.4 O Log Binário

7.4.4.1 Formatos de registro binários

7.4.4.2 Configuração do formato do log binário

7.4.4.3 Formato de registro binário misto

7.4.4.4 Formato de registro para alterações nas tabelas do banco de dados mysql

7.4.4.5 Compressão de Transações de Registro Binário

O log binário contém “eventos” que descrevem as alterações no banco de dados, como operações de criação de tabelas ou alterações nos dados da tabela. Ele também contém eventos para instruções que poderiam ter feito alterações (por exemplo, um `DELETE` que não encontrou nenhuma linha), a menos que o registro baseado em linhas seja usado. O log binário também contém informações sobre quanto tempo cada instrução levou para atualizar os dados. O log binário tem dois propósitos importantes:

- Para a replicação, o log binário em um servidor de origem de replicação fornece um registro das alterações de dados a serem enviadas para as réplicas. A fonte envia as informações contidas em seu log binário para suas réplicas, que reproduzem essas transações para realizar as mesmas alterações de dados que foram feitas na fonte. Veja a Seção 19.2, “Implementação de Replicação”.

- Algumas operações de recuperação de dados exigem o uso do log binário. Após a restauração de um backup, os eventos no log binário que foram registrados após a criação do backup são reexecutados. Esses eventos atualizam as bases de dados a partir do ponto do backup. Consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”).

O log binário não é usado para declarações como `SELECT` ou `SHOW` que não modificam dados. Para registrar todas as declarações (por exemplo, para identificar uma consulta com problemas), use o log de consulta geral. Consulte a Seção 7.4.3, “O Log de Consulta Geral”.

Executar um servidor com o registro binário habilitado faz com que o desempenho seja ligeiramente mais lento. No entanto, os benefícios do log binário, que permitem configurar a replicação e as operações de restauração, geralmente superam esse pequeno decréscimo de desempenho.

O log binário é resistente a interrupções inesperadas. Apenas eventos ou transações completas são registrados ou lidos novamente.

As senhas nas declarações escritas no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto simples. Veja também a Seção 8.1.2.3, “Senhas e Registro”.

A partir do MySQL 8.0.14, os arquivos de log binários e os arquivos de log de retransmissão podem ser criptografados, ajudando a proteger esses arquivos e os dados sensíveis que podem estar contidos neles de serem mal utilizados por atacantes externos, além de serem visualizados por usuários do sistema operacional onde estão armazenados. Você pode ativar a criptografia em um servidor MySQL configurando a variável de sistema `binlog_encryption` para `ON`. Para mais informações, consulte a Seção 19.3.2, “Criptografar Arquivos de Log Binários e Arquivos de Log de Retransmissão”.

A discussão a seguir descreve algumas das opções e variáveis do servidor que afetam o funcionamento do registro binário. Para uma lista completa, consulte a Seção 19.1.6.4, “Opções e variáveis de registro binário”.

O registro binário está habilitado por padrão (a variável de sistema `log_bin` está definida como ABERTO). A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário está desabilitado por padrão, mas pode ser habilitado especificando a opção `--log-bin`.

Para desabilitar o registro binário, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` durante a inicialização. Se uma dessas opções for especificada e `--log-bin` também for especificado, a opção especificada posteriormente terá precedência.

As opções `--log-slave-updates` e `--slave-preserve-commit-order` exigem registro binário. Se você desabilitar o registro binário, omita essas opções ou especifique `--log-slave-updates=OFF` e `--skip-slave-preserve-commit-order`. O MySQL desabilita essas opções por padrão quando `--skip-log-bin` ou `--disable-log-bin` é especificado. Se você especificar `--log-slave-updates` ou `--slave-preserve-commit-order` junto com `--skip-log-bin` ou `--disable-log-bin`, uma mensagem de aviso ou erro é emitida.

A opção `--log-bin[=base_name]` é usada para especificar o nome base dos arquivos de log binários. Se você não fornecer a opção `--log-bin`, o MySQL usa `binlog` como o nome base padrão para os arquivos de log binários. Para compatibilidade com versões anteriores, se você fornecer a opção `--log-bin` sem uma string ou com uma string vazia, o nome base é definido como `host_name-bin`, usando o nome da máquina hospedeira. É recomendável que você especifique um nome base, para que, se o nome do hospedeiro mudar, você possa continuar a usar facilmente os mesmos nomes de arquivos de log binários (consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”). Se você fornecer uma extensão no nome do log (por exemplo, `--log-bin=base_name.extension`), a extensão é removida silenciosamente e ignorada.

O aplicativo **mysqld** adiciona uma extensão numérica ao nome da base do log binário para gerar nomes de arquivos de log binário. O número aumenta cada vez que o servidor cria um novo arquivo de log, criando assim uma série ordenada de arquivos. O servidor cria um novo arquivo na série cada vez que um dos seguintes eventos ocorre:

- O servidor é iniciado ou reiniciado
- O servidor descarta os logs.
- O tamanho do arquivo de registro atual atinge `max_binlog_size`.

Um arquivo de log binário pode se tornar maior do que `max_binlog_size` se você estiver usando transações grandes, pois uma transação é escrita no arquivo de uma só vez, nunca dividida entre arquivos.

Para acompanhar quais arquivos de log binários foram usados, o **mysqld** também cria um arquivo de índice de log binário que contém os nomes dos arquivos de log binário. Por padrão, esse arquivo tem o mesmo nome de base do arquivo de log binário, com a extensão `'.index'`. Você pode alterar o nome do arquivo de índice de log binário com a opção `--log-bin-index[=file_name]`. Você não deve editar manualmente esse arquivo enquanto o **mysqld** estiver em execução; fazer isso confundiria o **mysqld**.

O termo "arquivo de registro binário" geralmente indica um arquivo numerado individual que contém eventos do banco de dados. O termo "registro binário" denota coletivamente o conjunto de arquivos de registro binário numerados, mais o arquivo de índice.

O local padrão para os arquivos de log binário e o arquivo de índice de log binário é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto antes do nome da base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de log binário, que rastreia os arquivos de log binário que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver presente, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de índice de log binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. O nome da base do arquivo de log binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

No MySQL 5.7, um ID de servidor precisava ser especificado quando o registro binário estava habilitado, caso contrário, o servidor não iniciaria. No MySQL 8.0, a variável de sistema `server_id` é definida como 1 por padrão. O servidor pode ser iniciado com esse ID padrão quando o registro binário está habilitado, mas uma mensagem informativa será emitida se você não especificar um ID de servidor explicitamente usando a variável de sistema `server_id`. Para servidores que são usados em uma topologia de replicação, você deve especificar um ID de servidor único e não nulo para cada servidor.

Um cliente que tenha privilégios suficientes para definir variáveis de sistema de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de variáveis de sistema”) pode desativar o registro binário de suas próprias declarações usando uma instrução `SET sql_log_bin=OFF`.

Por padrão, o servidor registra o comprimento do evento, bem como o próprio evento e usa isso para verificar se o evento foi escrito corretamente. Você também pode fazer com que o servidor escreva verificações de integridade para os eventos, configurando a variável de sistema `binlog_checksum`. Ao ler de volta do log binário, a fonte usa o comprimento do evento por padrão, mas pode ser configurado para usar verificações de integridade se estiverem disponíveis, habilitando a variável de sistema `source_verify_checksum` (a partir do MySQL 8.0.26) ou `master_verify_checksum` (antes do MySQL 8.0.26). O fio de I/O de replicação (receptor) na replica também verifica os eventos recebidos da fonte. Você pode fazer com que o fio de SQL de replicação (aplicador) use verificações de integridade, se estiverem disponíveis, ao ler o log de retransmissão, habilitando a variável de sistema `replica_sql_verify_checksum` (a partir do MySQL 8.0.26) ou `slave_sql_verify_checksum` (antes do MySQL 8.0.26).

O formato dos eventos registrados no log binário depende do formato de registro binário. Três tipos de formato são suportados: registro baseado em linhas, registro baseado em declarações e registro de base mista. O formato de registro binário usado depende da versão do MySQL. Para descrições gerais dos formatos de registro, consulte a Seção 7.4.4.1, “Formatos de Registro Binário”. Para informações detalhadas sobre o formato do log binário, consulte MySQL Internals: The Binary Log.

O servidor avalia as opções `--binlog-do-db` e `--binlog-ignore-db` da mesma maneira que avalia as opções `--replicate-do-db` e `--replicate-ignore-db`. Para obter informações sobre como isso é feito, consulte a Seção 19.2.5.1, “Avaliação das opções de replicação e registro binário de nível de banco de dados”.

Uma replica é iniciada com a variável de sistema `log_replica_updates` (a partir do MySQL 8.0.26) ou `log_slave_updates` (antes do MySQL 8.0.26) habilitada por padrão, o que significa que a replica escreve em seu próprio log binário todas as modificações de dados recebidas da fonte. O log binário deve ser habilitado para que essa configuração funcione (consulte a Seção 19.1.6.3, “Opções e variáveis do servidor de replica”). Essa configuração permite que a replica atue como fonte para outras réplicas.

Você pode excluir todos os arquivos de log binários com a instrução `RESET MASTER`, ou um subconjunto deles com `PURGE BINARY LOGS`. Veja a Seção 15.7.8.6, “Instrução RESET”, e a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.

Se você estiver usando replicação, não deve excluir arquivos de log binário antigos na fonte até ter certeza de que nenhuma réplica ainda os precise usar. Por exemplo, se suas réplicas nunca estiverem mais de três dias atrasadas, uma vez por dia, você pode executar **mysqladmin flush-logs binary** na fonte e, em seguida, remover quaisquer logs que tenham mais de três dias de idade. Você pode remover os arquivos manualmente, mas é preferível usar `PURGE BINARY LOGS`, que também atualiza com segurança o arquivo de índice do log binário para você (e que pode aceitar um argumento de data). Veja a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.

Você pode exibir o conteúdo dos arquivos de log binário com o utilitário **mysqlbinlog**. Isso pode ser útil quando você deseja reprocessar instruções no log para uma operação de recuperação. Por exemplo, você pode atualizar um servidor MySQL a partir do log binário da seguinte forma:

```
$> mysqlbinlog log_file | mysql -h server_name
```

O **mysqlbinlog** também pode ser usado para exibir o conteúdo do arquivo de log de retransmissão em uma replica, pois eles são escritos no mesmo formato que os arquivos de log binário. Para obter mais informações sobre o utilitário **mysqlbinlog** e como usá-lo, consulte a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”. Para obter mais informações sobre o log binário e as operações de recuperação, consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”).

O registro binário é feito imediatamente após uma declaração ou transação ser concluída, mas antes que quaisquer bloqueios sejam liberados ou qualquer commit seja feito. Isso garante que o log seja registrado na ordem do commit.

As atualizações de tabelas não transacionais são armazenadas no log binário imediatamente após a execução.

Em uma transação não comprometida, todas as atualizações (`UPDATE`, `DELETE` ou `INSERT`) que alteram tabelas transacionais, como as tabelas `InnoDB`, são armazenadas em cache até que uma instrução `COMMIT` seja recebida pelo servidor. Nesse ponto, o **mysqld** escreve toda a transação no log binário antes que a instrução `COMMIT` seja executada.

As modificações em tabelas não transacionais não podem ser desfeitas. Se uma transação que é desfeita incluir modificações em tabelas não transacionais, toda a transação é registrada com uma declaração `ROLLBACK` no final para garantir que as modificações nessas tabelas sejam replicadas.

Quando um fio que lida com a transação é iniciado, ele aloca um buffer de `binlog_cache_size` para bufferizar as instruções. Se uma instrução for maior que esse valor, o fio abre um arquivo temporário para armazenar a transação. O arquivo temporário é excluído quando o fio termina. A partir do MySQL 8.0.17, se a criptografia do log binário estiver ativa no servidor, o arquivo temporário é criptografado.

A variável de status `Binlog_cache_use` mostra o número de transações que usaram este buffer (e possivelmente um arquivo temporário) para armazenar declarações. A variável de status `Binlog_cache_disk_use` mostra quantos desses transações realmente tiveram que usar um arquivo temporário. Essas duas variáveis podem ser usadas para ajustar `binlog_cache_size` para um valor suficientemente grande para evitar o uso de arquivos temporários.

A variável de sistema `max_binlog_cache_size` (padrão 4GB, que também é o máximo) pode ser usada para restringir o tamanho total usado para armazenar uma transação com múltiplos comandos. Se uma transação for maior que esse número de bytes, ela falhará e será revertida. O valor mínimo é 4096.

Se você estiver usando o registro binário e o registro baseado em linhas, as inserções concorrentes são convertidas em inserções normais para as instruções `CREATE ... SELECT` ou `INSERT ... SELECT`. Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas aplicando o log durante uma operação de backup. Se você estiver usando o registro baseado em instruções, a instrução original é escrita no log.

O formato de log binário tem algumas limitações conhecidas que podem afetar a recuperação de backups. Consulte a Seção 19.5.1, “Recursos e problemas de replicação”.

O registro binário para programas armazenados é feito conforme descrito na Seção 27.7, “Registro Binário de Programas Armazenados”.

Observe que o formato do log binário difere no MySQL 8.0 das versões anteriores do MySQL, devido às melhorias na replicação. Consulte a Seção 19.5.2, “Compatibilidade de replicação entre versões do MySQL”.

Se o servidor não conseguir gravar o log binário, esvaziar os arquivos de log binário ou sincronizar o log binário com o disco, o log binário no servidor de origem da replicação pode ficar inconsistente e as réplicas podem perder a sincronização com a origem. A variável de sistema `binlog_error_action` controla a ação a ser tomada se um erro desse tipo for encontrado com o log binário.

- A configuração padrão, `ABORT_SERVER`, faz com que o servidor pare o registro binário e seja desligado. Neste ponto, você pode identificar e corrigir a causa do erro. Na reinicialização, a recuperação prossegue como no caso de um desligamento inesperado do servidor (consulte a Seção 19.4.2, “Tratamento de um Desligamento Inesperado de uma Replicação”).

- O cenário `IGNORE_ERROR` oferece compatibilidade reversa com versões mais antigas do MySQL. Com este cenário, o servidor continua a transação em andamento e registra o erro, depois interrompe o registro binário, mas continua a realizar atualizações. Neste ponto, você pode identificar e corrigir a causa do erro. Para retomar o registro binário, `log_bin` deve ser habilitado novamente, o que requer o reinício do servidor. Use esta opção apenas se você precisar de compatibilidade reversa e o log binário não for essencial nesta instância do servidor MySQL. Por exemplo, você pode usar o log binário apenas para auditoria ou depuração intermitentes do servidor e não usá-lo para replicação do servidor ou confiar nele para operações de restauração em um ponto no tempo.

Por padrão, o log binário é sincronizado com o disco em cada escrita (`sync_binlog=1`). Se `sync_binlog` não estiver habilitado e o sistema operacional ou a máquina (não apenas o servidor MySQL) falhar, há a possibilidade de que as últimas instruções do log binário possam ser perdidas. Para evitar isso, habilite a variável de sistema `sync_binlog` para sincronizar o log binário com o disco após cada grupos de commits `N`. Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”. O valor mais seguro para `sync_binlog` é 1 (o padrão), mas este também é o mais lento.

Em versões anteriores do MySQL, havia a possibilidade de inconsistência entre o conteúdo da tabela e o conteúdo do log binário se ocorrer um travamento, mesmo com `sync_binlog` definido como 1. Por exemplo, se você estiver usando tabelas `InnoDB` e o servidor MySQL processar uma instrução `COMMIT`, ele escreve muitas transações preparadas no log binário em sequência, sincroniza o log binário e, em seguida, confirma a transação em `InnoDB`. Se o servidor sair inesperadamente entre essas duas operações, a transação será revertida por `InnoDB` na reinicialização, mas ainda existirá no log binário. Esse problema foi resolvido em versões anteriores ao habilitar o suporte `InnoDB` para o compromisso de duas fases em transações XA. No MySQL 8.0, o suporte `InnoDB` para o compromisso de duas fases em transações XA está sempre habilitado.

O suporte `InnoDB` para o commit de duas fases em transações XA garante que o log binário e os arquivos de dados `InnoDB` sejam sincronizados. No entanto, o servidor MySQL também deve ser configurado para sincronizar o log binário e os logs `InnoDB` no disco antes de confirmar a transação. Os logs `InnoDB` são sincronizados por padrão, e `sync_binlog=1` garante que o log binário seja sincronizado. O efeito do suporte implícito `InnoDB` para o commit de duas fases em transações XA e `sync_binlog=1` é que, ao reiniciar após um travamento, após realizar um rollback de transações, o servidor MySQL examina o arquivo de log binário mais recente para coletar os valores das transações `xid` e calcular a última posição válida no arquivo de log binário. O servidor MySQL então informa ao `InnoDB` para concluir quaisquer transações preparadas que foram escritas com sucesso no log binário e trunca o log binário para a última posição válida. Isso garante que o log binário reflita os dados exatos das tabelas `InnoDB` e, portanto, a replica permanece em sincronia com a fonte porque não recebe uma declaração que foi revertida.

Se o servidor MySQL descobrir durante a recuperação de falhas que o log binário é mais curto do que deveria ser, ele está faltando pelo menos uma transação `InnoDB` com commit bem-sucedido. Isso não deveria acontecer se `sync_binlog=1` e o sistema de disco/arquivo fizerem uma sincronização real quando forem solicitados (alguns não fazem), então o servidor imprime uma mensagem de erro `The binary log file_name is shorter than its expected size`. Nesse caso, esse log binário não está correto e a replicação deve ser reiniciada a partir de um novo instantâneo dos dados da fonte.

Os valores das sessões das seguintes variáveis do sistema são escritos no log binário e respeitados pela replica ao analisar o log binário:

- `sql_mode` (exceto que o modo `NO_DIR_IN_CREATE` não é replicado; veja a Seção 19.5.1.39, “Replicação e Variáveis”)

- `foreign_key_checks`

- `unique_checks`

- `character_set_client`

- `collation_connection`

- `collation_database`

- `collation_server`

- `sql_auto_is_null`
