### 7.4.4 O Log Binário

7.4.4.1 Formatos de Registro Binário

7.4.4.2 Configurando o Formato do Log Binário

7.4.4.3 Formato Misto de Registro Binário

7.4.4.4 Formato de Registro Binário para Alterações em Tabelas do Banco de Dados mysql

7.4.4.5 Compressão de Transações do Log Binário

O log binário contém "eventos" que descrevem as alterações no banco de dados, como operações de criação de tabelas ou alterações nos dados da tabela. Ele também contém eventos para instruções que potencialmente poderiam ter feito alterações (por exemplo, uma `DELETE` que não encontrou nenhuma linha), a menos que o registro baseado em linhas seja usado. O log binário também contém informações sobre quanto tempo cada instrução levou para atualizar os dados. O log binário tem dois propósitos importantes:

* Para a replicação, o log binário em um servidor de origem de replicação fornece um registro das alterações de dados a serem enviadas para as réplicas. A fonte envia as informações contidas em seu log binário para suas réplicas, que reproduzem essas transações para fazer as mesmas alterações de dados que foram feitas na fonte. Veja a Seção 19.2, “Implementação de Replicação”.

* Algumas operações de recuperação de dados requerem o uso do log binário. Após a restauração de um backup, os eventos no log binário que foram registrados após a realização do backup são reexecutados. Esses eventos atualizam os bancos de dados a partir do ponto do backup. Veja a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”.

O log binário não é usado para instruções como `SELECT` ou `SHOW` que não modificam dados. Para registrar todas as instruções (por exemplo, para identificar uma consulta com problemas), use o log de consulta geral. Veja a Seção 7.4.3, “O Log de Consulta Geral”.

Executar um servidor com o registro binário habilitado faz com que o desempenho seja ligeiramente mais lento. No entanto, os benefícios do log binário permitem que você configure a replicação e as operações de restauração geralmente superam esse pequeno decréscimo de desempenho.

O log binário é resistente a interrupções inesperadas. Apenas eventos ou transações completas são registrados ou lidos novamente.

As senhas em declarações escritas no log binário são reescritas pelo servidor para não ocorrerem literalmente em texto plano. Veja também a Seção 8.1.2.3, “Senhas e Registro”.

Os arquivos de log binário e os arquivos de log de retransmissão do MySQL podem ser criptografados, ajudando a proteger esses arquivos e os dados sensíveis que podem estar neles de serem mal utilizados por atacantes externos, além de serem visualizados por usuários do sistema operacional onde estão armazenados. Você habilita a criptografia em um servidor MySQL configurando a variável de sistema `binlog_encryption` para `ON`. Para mais informações, consulte a Seção 19.3.2, “Criptografar Arquivos de Log Binário e Arquivos de Log de Retransmissão”.

A discussão a seguir descreve algumas das opções e variáveis do servidor que afetam o funcionamento do registro binário. Para uma lista completa, consulte a Seção 19.1.6.4, “Opções e Variáveis de Registro Binário”.

O registro binário é habilitado por padrão (a variável de sistema `log_bin` é configurada para ON). A exceção é se você usar o **mysqld** para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário é desabilitado por padrão, mas pode ser habilitado especificando a opção `--log-bin`.

Para desabilitar o registro binário, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` no início. Se qualquer uma dessas opções for especificada e `--log-bin` também for especificada, a opção especificada posteriormente tem precedência.

As opções `--log-replica-updates` e `--replica-preserve-commit-order` exigem o registro binário. Se você desabilitar o registro binário, omita essas opções ou especifique `--log-replica-updates=OFF` e `--skip-replica-preserve-commit-order`. O MySQL desabilita essas opções por padrão quando `--skip-log-bin` ou `--disable-log-bin` é especificado. Se você especificar `--log-replica-updates` ou `--replica-preserve-commit-order` junto com `--skip-log-bin` ou `--disable-log-bin`, uma mensagem de aviso ou erro é emitida.

A opção `--log-bin[=base_name]` é usada para especificar o nome base para os arquivos de log binário. Se você não fornecer a opção `--log-bin`, o MySQL usa `binlog` como o nome base padrão para os arquivos de log binário. Para compatibilidade com versões anteriores, se você fornecer a opção `--log-bin` sem uma string ou com uma string vazia, o nome base é definido como `host_name-bin`, usando o nome da máquina do host. Recomenda-se que você especifique um nome base, para que, se o nome do host mudar, você possa continuar facilmente a usar os mesmos nomes de arquivos de log binário (veja a Seção B.3.7, “Problemas Conhecidos no MySQL”). Se você fornecer uma extensão no nome do log (por exemplo, `--log-bin=base_name.extensão`), a extensão é removida silenciosamente e ignorada.

O **mysqld** adiciona uma extensão numérica ao nome base do log binário para gerar nomes de arquivos de log binário. O número aumenta cada vez que o servidor cria um novo arquivo de log, criando assim uma série ordenada de arquivos. O servidor cria um novo arquivo na série cada vez que um dos seguintes eventos ocorre:

* O servidor é iniciado ou reiniciado
* O servidor esvazia os logs.
* O tamanho do arquivo de log atual atinge `max_binlog_size`.

Um arquivo de log binário pode se tornar maior que `max_binlog_size` se você estiver usando transações grandes, pois uma transação é escrita no arquivo de uma só vez, nunca dividida entre arquivos.

Para acompanhar quais arquivos de log binário foram usados, o **mysqld** também cria um arquivo de índice de log binário que contém os nomes dos arquivos de log binário. Por padrão, esse arquivo tem o mesmo nome de base do arquivo de log binário, com a extensão `'.index'`. Você pode alterar o nome do arquivo de índice de log binário com a opção `--log-bin-index[=file_name]`. Você não deve editar manualmente esse arquivo enquanto o **mysqld** estiver em execução; fazer isso confundiria o **mysqld**.

O termo “arquivo de log binário” geralmente denota um arquivo numerado individual que contém eventos de banco de dados. O termo “log binário” denota coletivamente o conjunto de arquivos de log binário numerados mais o arquivo de índice.

A localização padrão para arquivos de log binário e o arquivo de índice de log binário é o diretório de dados. Você pode usar a opção `--log-bin` para especificar uma localização alternativa, adicionando um nome de caminho absoluto antes do nome de base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de índice de log binário, que rastreia os arquivos de log binário que foram usados, ele verifica se a entrada contém um caminho relativo. Se estiver, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de índice de log binário permanece inalterado; nesse caso, o arquivo de índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. O nome de base do arquivo de log binário e qualquer caminho especificado estão disponíveis como a variável de sistema `log_bin_basename`.

O servidor pode ser iniciado com o ID de servidor padrão quando o registro binário estiver habilitado, mas uma mensagem informativa será emitida se você não especificar um ID de servidor explicitamente usando a variável de sistema `server_id`. Para servidores usados em uma topologia de replicação, você deve especificar um ID de servidor único e não nulo para cada servidor.

Um cliente que tenha privilégios suficientes para definir variáveis de sistema de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”) pode desabilitar o registro binário de suas próprias declarações usando uma declaração `SET sql_log_bin=OFF`.

Por padrão, o servidor registra o comprimento do evento, bem como o próprio evento e usa isso para verificar se o evento foi escrito corretamente. Você também pode fazer com que o servidor escreva verificações de checksum para os eventos, configurando a variável de sistema `binlog_checksum`. Ao ler de volta do log binário, a fonte usa o comprimento do evento por padrão, mas pode ser configurado para usar verificações de checksums se estiverem disponíveis, habilitando `source_verify_checksum`. O thread de I/O de replicação (receptor) na replica também verifica eventos recebidos da fonte. Você pode fazer com que o thread de SQL de replicação (aplicador) use verificações de checksums, se estiverem disponíveis, ao ler do log de relevo, habilitando `replica_sql_verify_checksum`.

O formato dos eventos registrados no log binário depende do formato de registro binário. Três tipos de formato são suportados: registro baseado em linhas, registro baseado em declarações e registro de base mista. O formato de registro binário usado depende da versão do MySQL. Para descrições dos formatos de registro, consulte a Seção 7.4.4.1, “Formatos de Registro Binário”.

O servidor avalia as opções `--binlog-do-db` e `--binlog-ignore-db` da mesma maneira que as opções `--replicate-do-db` e `--replicate-ignore-db`. Para obter informações sobre como isso é feito, consulte a Seção 19.2.5.1, “Avaliação das opções de replicação e registro binário em nível de banco de dados”.

Uma replica é iniciada com `log_replica_updates` habilitado por padrão, o que significa que a replica escreve em seu próprio log binário quaisquer modificações de dados recebidas da fonte. O log binário deve estar habilitado para que essa configuração funcione (consulte a Seção 19.1.6.3, “Opções e variáveis do servidor de replicação”). Essa configuração permite que a replica atue como fonte para outras replicas.

Você pode excluir todos os arquivos de log binário com a instrução `RESET BINARY LOGS AND GTIDS`, ou um subconjunto deles com `PURGE BINARY LOGS`. Consulte a Seção 15.7.8.6, “Instrução RESET”, e a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.

Se você estiver usando a Replicação MySQL, não deve excluir arquivos de log binário antigos na fonte até ter certeza de que nenhuma replica ainda os precisa. Por exemplo, se suas replicas nunca estiverem mais de três dias atrasadas, uma vez por dia você pode executar **mysqladmin flush-logs binary** na fonte e depois remover quaisquer logs que tenham mais de três dias de idade. Você pode remover os arquivos manualmente, mas é preferível usar `PURGE BINARY LOGS`, que também atualiza com segurança o arquivo de índice do log binário para você (e que pode aceitar um argumento de data). Consulte a Seção 15.4.1.1, “Instrução PURGE BINARY LOGS”.

Você pode exibir o conteúdo dos arquivos de log binário com o utilitário **mysqlbinlog**. Isso pode ser útil quando você deseja reprocessar instruções no log para uma operação de recuperação. Por exemplo, você pode atualizar um servidor MySQL a partir do log binário da seguinte forma:

```
$> mysqlbinlog log_file | mysql -h server_name
```

O **mysqlbinlog** também pode ser usado para exibir o conteúdo do arquivo de log de retransmissão em uma replica, pois eles são escritos usando o mesmo formato que os arquivos de log binário. Para obter mais informações sobre o utilitário **mysqlbinlog** e como usá-lo, consulte a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”. Para obter mais informações sobre o log binário e as operações de recuperação, consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”).

O registro binário é feito imediatamente após uma instrução ou transação ser concluída, mas antes que quaisquer bloqueios sejam liberados ou qualquer commit seja feito. Isso garante que o log seja registrado na ordem do commit.

As atualizações em tabelas não transacionais são armazenadas no log binário imediatamente após a execução.

Dentro de uma transação não comprometida, todas as atualizações (`UPDATE`, `DELETE` ou `INSERT`) que alteram tabelas transacionais, como as tabelas `InnoDB`, são armazenadas em cache até que uma instrução `COMMIT` seja recebida pelo servidor. Nesse ponto, o **mysqld** escreve toda a transação no log binário antes que o `COMMIT` seja executado.

As modificações em tabelas não transacionais não podem ser desfeitas. Se uma transação que é desfeita incluir modificações em tabelas não transacionais, toda a transação é registrada com uma instrução `ROLLBACK` no final para garantir que as modificações nessas tabelas sejam replicadas.

Quando um thread que lida com a transação começa, ele aloca um buffer de `binlog_cache_size` para bufferizar as instruções. Se uma instrução for maior que esse valor, o thread abre um arquivo temporário para armazenar a transação. O arquivo temporário é excluído quando o thread termina. Se a criptografia do log binário estiver ativa no servidor, o arquivo temporário é criptografado.

A variável de status `Binlog_cache_use` mostra o número de transações que usaram este buffer (e possivelmente um arquivo temporário) para armazenar instruções. A variável de status `Binlog_cache_disk_use` mostra quantos desses transações realmente tiveram que usar um arquivo temporário. Essas duas variáveis podem ser usadas para ajustar `binlog_cache_size` para um valor suficientemente grande para evitar o uso de arquivos temporários.

A variável de sistema `max_binlog_cache_size` (padrão 4GB, que também é o máximo) pode ser usada para restringir o tamanho total usado para armazenar uma transação com várias instruções. Se uma transação for maior que esse número de bytes, ela falha e é revertida. O valor mínimo é 4096.

Se você estiver usando o log binário e o registro baseado em linhas, as inserções concorrentes são convertidas em inserções normais para instruções `CREATE ... SELECT` ou `INSERT ... SELECT`. Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas aplicando o log durante uma operação de backup. Se você estiver usando o registro baseado em instruções, a instrução original é escrita no log.

O formato do log binário tem algumas limitações conhecidas que podem afetar a recuperação de backups. Veja a Seção 19.5.1, “Recursos e Problemas de Replicação”.

O registro binário para programas armazenados é feito conforme descrito na Seção 27.9, “Registro Binário de Programas Armazenados”.

Observe que o formato do log binário difere no MySQL 9.5 das versões anteriores do MySQL, devido a aprimoramentos na replicação. Veja a Seção 19.5.2, “Compatibilidade de Replicação entre Versões do MySQL”.

Se o servidor não conseguir gravar no log binário, esvaziar os arquivos do log binário ou sincronizar o log binário com o disco, o log binário no servidor de origem da replicação pode ficar inconsistente e as réplicas podem perder a sincronização com a origem. A variável de sistema `binlog_error_action` controla a ação tomada se um erro desse tipo for encontrado com o log binário.

* O ajuste padrão, `ABORT_SERVER`, faz o servidor parar de fazer o registro binário e desligar. Neste ponto, você pode identificar e corrigir a causa do erro. Na reinicialização, a recuperação prossegue como no caso de uma parada inesperada do servidor (veja a Seção 19.4.2, “Tratamento de uma Parada Inesperada de uma Réplica”).

* O ajuste `IGNORE_ERROR` oferece compatibilidade reversa com versões mais antigas do MySQL. Com este ajuste, o servidor continua a transação em andamento e registra o erro, depois para o registro binário, mas continua a realizar atualizações. Neste ponto, você pode identificar e corrigir a causa do erro. Para retomar o registro binário, `log_bin` deve ser habilitado novamente, o que requer uma reinicialização do servidor. Use esta opção apenas se você precisar de compatibilidade reversa e o log binário não seja essencial nesta instância do servidor MySQL. Por exemplo, você pode usar o log binário apenas para auditoria ou depuração intermitentes do servidor e não usá-lo para replicação do servidor ou confiar nele para operações de restauração em um ponto no tempo.

Por padrão, o log binário é sincronizado com o disco em cada escrita (`sync_binlog=1`). Se `sync_binlog` não estiver habilitado e o sistema operacional ou a máquina (não apenas o servidor MySQL) falhar, há a chance de que as últimas declarações do log binário possam ser perdidas. Para evitar isso, habilite a variável de sistema `sync_binlog` para sincronizar o log binário com o disco após cada *`N`* grupos de commits. Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”. O valor mais seguro para `sync_binlog` é 1 (o padrão), mas este também é o mais lento.

Em versões anteriores do MySQL, havia a possibilidade de inconsistência entre o conteúdo da tabela e o conteúdo do log binário se ocorrer uma falha, mesmo com `sync_binlog` definido para 1. Por exemplo, se você estiver usando tabelas `InnoDB` e o servidor MySQL processar uma declaração `COMMIT`, ele escreve muitas transações preparadas no log binário em sequência, sincroniza o log binário e, em seguida, confirma a transação no `InnoDB`. Se o servidor sair inesperadamente entre essas duas operações, a transação será revertida pelo `InnoDB` na reinicialização, mas ainda existirá no log binário. Esse problema foi resolvido em versões anteriores ao habilitar o suporte `InnoDB` para o commit de duas fases em transações XA. No MySQL 9.5, o suporte `InnoDB` para o commit de duas fases em transações XA está sempre habilitado.

O suporte `InnoDB` para o commit de duas fases em transações XA garante que o log binário e os arquivos de dados do `InnoDB` sejam sincronizados. No entanto, o servidor MySQL também deve ser configurado para sincronizar o log binário e os logs do `InnoDB` no disco antes de comprometer a transação. Os logs do `InnoDB` são sincronizados por padrão, e `sync_binlog=1` garante que o log binário seja sincronizado. O efeito do suporte implícito do `InnoDB` para o commit de duas fases em transações XA e `sync_binlog=1` é que, ao reiniciar após uma falha, após fazer um rollback de transações, o servidor MySQL examina o arquivo de log binário mais recente para coletar os valores dos *`xid`* das transações e calcular a última posição válida no arquivo de log binário. O servidor MySQL então instrui o `InnoDB` a completar quaisquer transações preparadas que foram escritas com sucesso no log binário e corta o log binário para a última posição válida. Isso garante que o log binário reflita os dados exatos das tabelas do `InnoDB` e, portanto, a replica permaneça sincronizada com a fonte porque não recebe uma declaração que foi revertida.

Se o servidor MySQL descobrir durante a recuperação após uma falha que o log binário é mais curto do que deveria ter sido, ele falta pelo menos uma transação `InnoDB` comprometida com sucesso. Isso não deve acontecer se `sync_binlog=1` e o sistema de arquivos/disco realizar uma sincronização real quando solicitado (alguns não o fazem), então o servidor imprime uma mensagem de erro `O arquivo de log binário_nome é mais curto do que seu tamanho esperado`. Neste caso, este log binário não está correto e a replica deve ser reiniciada a partir de um snapshot fresco dos dados da fonte.

Os valores da sessão das seguintes variáveis de sistema são escritos no log binário e respeitados pela replica ao analisar o log binário:

* `sql_mode` (exceto que o modo `NO_DIR_IN_CREATE` não é replicado; veja a Seção 19.5.1.40, “Replicação e Variáveis”)

* `foreign_key_checks`
* `unique_checks`
* `character_set_client`
* `collation_connection`
* `collation_database`
* `collation_server`
* `sql_auto_is_null`