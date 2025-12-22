### 7.4.4 O Registro Binário

O log binário contém "eventos" que descrevem alterações no banco de dados, como operações de criação de tabelas ou alterações nos dados das tabelas. Ele também contém eventos para instruções que poderiam ter feito alterações (por exemplo, um `DELETE` que não correspondia a nenhuma linha), a menos que seja usado o registro baseado em linhas. O log binário também contém informações sobre quanto tempo cada instrução levou para atualizar os dados. O log binário tem dois propósitos importantes:

- Para a replicação, o log binário em um servidor de origem de replicação fornece um registro das alterações de dados a serem enviadas para as réplicas. A fonte envia as informações contidas em seu log binário para suas réplicas, que reproduzem essas transações para fazer as mesmas alterações de dados que foram feitas na fonte.
- Certas operações de recuperação de dados requerem o uso do log binário. Depois que um backup foi restaurado, os eventos no log binário que foram registrados após o backup foi feito são re-executados. Esses eventos trazem bancos de dados atualizados a partir do ponto do backup. Veja Seção 9.5, "Recuperação (Incremental) de Ponto em Tempo  Recuperação").

O log binário não é usado para instruções como `SELECT` ou `SHOW` que não modificam os dados. Para registrar todas as instruções (por exemplo, para identificar uma consulta problemática), use o log de consulta geral.

A execução de um servidor com logging binário habilitado torna o desempenho ligeiramente mais lento. No entanto, os benefícios do log binário permitindo que você configure a replicação e para operações de restauração geralmente superam essa menor diminuição de desempenho.

O log binário é resistente a paradas inesperadas. Apenas eventos ou transações completas são registrados ou lidos de volta.

As senhas nas instruções escritas no log binário são reescritas pelo servidor para não ocorrer literalmente em texto simples.

Os arquivos de log binários do MySQL e os arquivos de log de retransmissão podem ser criptografados, ajudando a proteger esses arquivos e os dados potencialmente confidenciais contidos neles de serem usados indevidamente por invasores externos, e também de visualização não autorizada por usuários do sistema operacional onde eles são armazenados.

A discussão a seguir descreve algumas das opções e variáveis do servidor que afetam a operação do registro binário.

O registro binário é habilitado por padrão (a variável do sistema `log_bin` está definida como ON). A exceção é se você usar `mysqld` para inicializar o diretório de dados manualmente, invocando-o com a opção `--initialize` ou `--initialize-insecure`, quando o registro binário é desativado por padrão, mas pode ser habilitado especificando a opção `--log-bin`.

Para desativar o registro binário, você pode especificar a opção `--skip-log-bin` ou `--disable-log-bin` na inicialização. Se qualquer uma dessas opções for especificada e `--log-bin` também for especificada, a opção especificada mais tarde terá precedência.

As opções `--log-replica-updates` e `--replica-preserve-commit-order` requerem registro binário. Se você desativar o registro binário, omita essas opções, ou especifique `--log-replica-updates=OFF` e `--skip-replica-preserve-commit-order`. O MySQL desativa essas opções por padrão quando `--skip-log-bin` ou `--disable-log-bin` é especificado. Se você especificar `--log-replica-updates` ou `--replica-preserve-commit-order` junto com `--skip-log-bin` ou `--disable-log-bin`, uma mensagem de erro ou aviso é emitido.

A opção `--log-bin[=base_name]` é usada para especificar o nome de base para arquivos de log binários. Se você não fornecer a opção `--log-bin`, o MySQL usa `binlog` como o nome de base padrão para os arquivos de log binários. Para compatibilidade com versões anteriores, se você fornecer a opção `--log-bin` sem string ou com uma string vazia, o nome de base é padrão para `host_name-bin`, usando o nome da máquina host. É recomendado que você especifique um nome de base, para que, se o nome do host mudar, você possa facilmente continuar a usar os mesmos nomes de arquivos de log binários (ver Seção B.3.7,  Problemas conhecidos no MySQL). Se você fornecer uma extensão no nome do log (por exemplo, \[\[PH\_CODE\_CODE5]]), a extensão é silenciosamente removida e ignorada.

`mysqld` adiciona uma extensão numérica ao nome da base de log binário para gerar nomes de arquivos de log binário. O número aumenta cada vez que o servidor cria um novo arquivo de log, criando assim uma série ordenada de arquivos. O servidor cria um novo arquivo na série cada vez que qualquer um dos seguintes eventos ocorre:

- O servidor é iniciado ou reiniciado
- O servidor limpa os registos.
- O tamanho do arquivo de log atual atinge `max_binlog_size`.

Um arquivo de log binário pode se tornar maior do que `max_binlog_size` se você estiver usando grandes transações porque uma transação é escrita no arquivo em uma peça, nunca dividida entre arquivos.

Para manter o controle de quais arquivos de log binário foram usados, `mysqld` também cria um arquivo de índice de log binário que contém os nomes dos arquivos de log binário. Por padrão, ele tem o mesmo nome de base que o arquivo de log binário, com a extensão `'.index'`. Você pode alterar o nome do arquivo de índice de log binário com a opção `--log-bin-index[=file_name]`. Você não deve editar manualmente este arquivo enquanto `mysqld` estiver em execução; isso confundiria `mysqld`.

O termo "arquivo de log binário" geralmente denota um arquivo numerado individual contendo eventos de banco de dados.

O local padrão para os arquivos de log binário e o arquivo de índice de log binário é o diretório de dados. Você pode usar a opção `--log-bin` para especificar um local alternativo, adicionando um nome de caminho absoluto principal ao nome de base para especificar um diretório diferente. Quando o servidor lê uma entrada do arquivo de log binário, que rastreia os arquivos de log binários que foram usados, ele verifica se a entrada contém um caminho relativo. Se assim for, a parte relativa do caminho é substituída pelo caminho absoluto definido usando a opção `--log-bin`. Um caminho absoluto registrado no arquivo de log binário permanece inalterado; em tal caso, o índice deve ser editado manualmente para permitir que um novo caminho ou caminhos sejam usados. O nome de arquivo de log binário e qualquer caminho especificado estão disponíveis como a variável do sistema \[\[COPH\_CODE2]].

O servidor pode ser iniciado com o ID do servidor padrão quando o registro binário está habilitado, mas uma mensagem informativa é emitida se você não especificar um ID do servidor explicitamente usando a variável de sistema `server_id`.

Um cliente que tenha privilégios suficientes para definir variáveis de sistema de sessão restritas (ver Seção 7.1.9.1, "Privilégios de variáveis de sistema") pode desativar o registro binário de suas próprias instruções usando uma instrução `SET sql_log_bin=OFF`.

Por padrão, o servidor registra o comprimento do evento, bem como o próprio evento e usa isso para verificar se o evento foi escrito corretamente. Você também pode fazer com que o servidor escreva checksums para os eventos definindo a variável de sistema `binlog_checksum`. Ao ler de volta do log binário, a fonte usa o comprimento do evento por padrão, mas pode ser feita para usar checksums se disponível ativando `source_verify_checksum`.

O formato dos eventos registrados no log binário é dependente do formato de registro binário. São suportados três tipos de formato: registro baseado em linhas, registro baseado em instruções e registro de base mista. O formato de registro binário usado depende da versão do MySQL. Para descrições dos formatos de registro, consulte a Seção 7.4.4.1, "Formats de registro binário".

O servidor avalia as opções `--binlog-do-db` e `--binlog-ignore-db` da mesma forma que as opções `--replicate-do-db` e `--replicate-ignore-db`.

Uma réplica é iniciada com `log_replica_updates` habilitado por padrão, o que significa que a réplica escreve em seu próprio log binário quaisquer modificações de dados que são recebidas da fonte. O log binário deve ser habilitado para que esta configuração funcione (ver Seção 19.1.6.3, "Opções e variáveis do servidor de réplica"). Esta configuração permite que a réplica atue como uma fonte para outras réplicas.

Você pode excluir todos os arquivos de log binário com a instrução `RESET BINARY LOGS AND GTIDS`, ou um subconjunto deles com `PURGE BINARY LOGS`. Veja Seção 15.7.8.6, RESET Statement, e Seção 15.4.1.1, PURGE BINARY LOGS Statement.

Se você estiver usando o MySQL Replication, você não deve excluir arquivos de log binários antigos no código fonte até ter certeza de que nenhuma réplica ainda precisa usá-los. Por exemplo, se suas réplicas nunca executarem mais de três dias de atraso, uma vez por dia você pode executar **mysqladmin flush-logs binary** no código fonte e depois remover todos os logs com mais de três dias de idade. Você pode remover os arquivos manualmente, mas é preferível usar `PURGE BINARY LOGS`, que também atualiza com segurança o índice do arquivo de log binário para você (e que pode ter um argumento de data). Veja Seção 15.4.1.1, PURGE BINARY LOGS Statement.

Você pode exibir o conteúdo de arquivos de log binário com o utilitário **mysqlbinlog**. Isso pode ser útil quando você deseja reprocessar instruções no log para uma operação de recuperação. Por exemplo, você pode atualizar um servidor MySQL a partir do log binário da seguinte forma:

```
$> mysqlbinlog log_file | mysql -h server_name
```

**mysqlbinlog** também pode ser usado para exibir o conteúdo do arquivo de registro de retransmissão em uma réplica, porque eles são escritos usando o mesmo formato que os arquivos de log binário. Para mais informações sobre o utilitário **mysqlbinlog** e como usá-lo, veja Seção 6.6.9, "mysqlbinlog  Utilitário para processamento de arquivos de log binário. Para mais informações sobre as operações de log binário e recuperação, veja Seção 9.5, "Recuperação de ponto em tempo (incremental)  Recuperação").

O registro binário é feito imediatamente após a conclusão de uma instrução ou transação, mas antes de qualquer bloqueio ser liberado ou qualquer commit ser feito.

As atualizações de tabelas não transacionais são armazenadas no log binário imediatamente após a execução.

Dentro de uma transação não comprometida, todas as atualizações (`UPDATE`, `DELETE` ou `INSERT`) que alteram tabelas transacionais, como as tabelas `InnoDB`, são armazenadas em cache até que uma instrução `COMMIT` seja recebida pelo servidor. Nesse ponto, `mysqld` escreve toda a transação no log binário antes que o `COMMIT` seja executado.

Modificações em tabelas não transacionais não podem ser revertidas. Se uma transação que é revertida inclui modificações em tabelas não transacionais, toda a transação é registrada com uma instrução `ROLLBACK` no final para garantir que as modificações nessas tabelas sejam replicadas.

Quando um thread que lida com a transação começa, ele aloca um buffer de `binlog_cache_size` para instruções de buffer. Se uma instrução for maior do que isso, o thread abre um arquivo temporário para armazenar a transação. O arquivo temporário é excluído quando o thread termina. Se a criptografia de log binário estiver ativa no servidor, o arquivo temporário será criptografado.

A variável de status \[`Binlog_cache_use`] mostra o número de transações que usaram esse buffer (e possivelmente um arquivo temporário) para armazenar instruções. A variável de status \[`Binlog_cache_disk_use`] mostra quantas dessas transações realmente tiveram que usar um arquivo temporário. Essas duas variáveis podem ser usadas para ajustar \[`binlog_cache_size`] a um valor grande o suficiente para evitar o uso de arquivos temporários.

A variável de sistema `max_binlog_cache_size` (padrão 4GB, que também é o máximo) pode ser usada para restringir o tamanho total usado para armazenar em cache uma transação de declaração múltipla. Se uma transação for maior do que este número de bytes, ela falhará e será revertida. O valor mínimo é 4096.

Se você estiver usando o log binário e o log baseado em linhas, as inserções simultâneas são convertidas em inserções normais para as instruções `CREATE ... SELECT` ou `INSERT ... SELECT`. Isso é feito para garantir que você possa recriar uma cópia exata de suas tabelas aplicando o log durante uma operação de backup. Se você estiver usando o log baseado em instruções, a instrução original será escrita no log.

O formato de log binário tem algumas limitações conhecidas que podem afetar a recuperação de backups.

O registo binário de programas armazenados é feito conforme descrito na Seção 27.7, "Registo binário de programas armazenados".

Observe que o formato de log binário difere no MySQL 8.4 de versões anteriores do MySQL, devido a aprimoramentos na replicação.

Se o servidor não puder escrever no log binário, limpar os arquivos de log binário ou sincronizar o log binário com o disco, o log binário no servidor de origem de replicação pode se tornar inconsistente e as réplicas podem perder a sincronização com a fonte. A variável do sistema `binlog_error_action` controla a ação tomada se um erro desse tipo for encontrado com o log binário.

- A configuração padrão, `ABORT_SERVER`, faz com que o servidor pare o registro binário e feche. Neste ponto, você pode identificar e corrigir a causa do erro. Ao reiniciar, a recuperação prossegue como no caso de uma parada inesperada do servidor (ver Seção 19.4.2, "Manuseio de uma parada inesperada de uma réplica").
- A configuração `IGNORE_ERROR` fornece compatibilidade com versões anteriores do MySQL. Com essa configuração, o servidor continua a transação em andamento e registra o erro, em seguida, interrompe o registro binário, mas continua a realizar atualizações. Neste ponto, você pode identificar e corrigir a causa do erro. Para retomar o registro binário, o `log_bin` deve ser ativado novamente, o que requer uma reinicialização do servidor. Use esta opção apenas se você precisar de compatibilidade com versões anteriores, e o registro binário não for essencial neste servidor MySQL. Por exemplo, você pode usar o registro binário apenas para auditoria intermitente ou depuração do servidor, e não usá-lo para replicação do servidor ou confiar nele para operações de restauração em tempo de ponto.

Por padrão, o log binário é sincronizado com o disco em cada gravação (`sync_binlog=1`). Se o `sync_binlog` não estiver habilitado, e o sistema operacional ou a máquina (não apenas o servidor MySQL) falhar, há uma chance de que as últimas instruções do log binário possam ser perdidas. Para evitar isso, habilite a variável do sistema `sync_binlog` para sincronizar o log binário com o disco após cada grupo de commit `N`. Veja Seção 7.1.8, Variáveis do Sistema do Servidor. O valor mais seguro para `sync_binlog` é 1 (o padrão), mas este também é o mais lento.

Em versões anteriores do MySQL, havia uma chance de inconsistência entre o conteúdo da tabela e o conteúdo do log binário se ocorresse uma falha, mesmo com o \[`sync_binlog`] definido para 1. Por exemplo, se você estiver usando tabelas \[`InnoDB`] e o servidor do MySQL processar uma instrução \[`COMMIT`], ele escreve muitas transações preparadas para o log binário em seqüência, sincroniza o log binário e, em seguida, compromete a transação em \[`InnoDB`]. Se o servidor sair inesperadamente entre essas duas operações, a transação seria revertida por \[`InnoDB`] na reinicialização, mas ainda existiria no log binário. Esse problema foi resolvido em versões anteriores, habilitando o suporte do \[`InnoDB`]] para transações de duas fases em XA. Em MySQL 8.4, o \[`InnoDB`] sempre habilita o suporte para transações de duas fases em XA.

O suporte do `InnoDB` para commit de duas fases em transações XA garante que os arquivos de dados do log binário e `InnoDB` sejam sincronizados. No entanto, o servidor MySQL também deve ser configurado para sincronizar o log binário e os logs de `InnoDB` no disco antes de cometer a transação. Os logs do `InnoDB` são sincronizados por padrão e o `sync_binlog=1` garante que o log binário seja sincronizado. O efeito do suporte implícito do `InnoDB` para commit de duas fases em transações XA e do `sync_binlog=1` é que, no reinicio após uma falha, após fazer um rollback de transações, o servidor MySQL verifica o último arquivo de log binário para coletar os valores de transação \* `xid` \* e calcular a posição válida no arquivo de log do log binário. O MySQL garante que não tenha sido escrito uma declaração válida para receber uma cópia completa do log de transações

Se o servidor MySQL descobre na recuperação de falha que o log binário é mais curto do que deveria ter sido, ele não tem pelo menos uma transação de `InnoDB` comprometida com sucesso. Isso não deve acontecer se o `sync_binlog=1` e o sistema de disco/arquivo fizerem uma sincronização real quando solicitados (alguns não), então o servidor imprime uma mensagem de erro `The binary log file_name is shorter than its expected size`. Neste caso, este log binário não é correto e a replicação deve ser reiniciada a partir de um novo instantâneo dos dados da fonte.

Os valores de sessão das seguintes variáveis do sistema são escritos no log binário e honrados pela réplica ao analisar o log binário:

- \[`sql_mode`]] (exceto que o modo \[`NO_DIR_IN_CREATE`]] não é replicado; ver secção 19.5.1.39, "Replicação e variáveis")
- `foreign_key_checks`
- `unique_checks`
- `character_set_client`
- `collation_connection`
- `collation_database`
- `collation_server`
- `sql_auto_is_null`
