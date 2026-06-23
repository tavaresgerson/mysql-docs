## 19.4 Soluções de Replicação

A replicação pode ser usada em muitos ambientes diferentes para uma variedade de propósitos. Esta seção fornece notas gerais e conselhos sobre o uso da replicação para tipos específicos de soluções.

Para obter informações sobre o uso da replicação em um ambiente de backup, incluindo notas sobre a configuração, o procedimento de backup e os arquivos a serem protegidos, consulte a Seção 19.4.1, “Usando replicação para backups”.

Para obter conselhos e dicas sobre o uso de diferentes motores de armazenamento na fonte e na replica, consulte a Seção 19.4.4, “Usando replicação com diferentes motores de armazenamento de fonte e replica”.

Usar a replicação como uma solução de expansão requer algumas mudanças na lógica e no funcionamento das aplicações que utilizam a solução. Consulte a Seção 19.4.5, “Usando replicação para expansão”.

Por razões de desempenho ou distribuição de dados, você pode querer replicar diferentes bancos de dados para diferentes réplicas. Consulte a Seção 19.4.6, “Replicando diferentes bancos de dados para diferentes réplicas”.

À medida que o número de réplicas aumenta, a carga na fonte pode aumentar e levar a um desempenho reduzido (devido à necessidade de replicar o log binário para cada réplica). Para dicas sobre como melhorar o desempenho da replicação, incluindo o uso de um único servidor secundário como fonte, consulte a Seção 19.4.7, “Melhorando o desempenho da replicação”.

Para obter orientações sobre a troca de fontes ou a conversão de réplicas em fontes como parte de uma solução de falha de emergência, consulte a Seção 19.4.8, “Troca de fontes durante a falha de emergência”.

Para informações sobre as medidas de segurança específicas para servidores em uma topologia de replicação, consulte a Seção 19.3, “Segurança da replicação”.

### 19.4.1 Usando replicação para backups

Para usar a replicação como uma solução de backup, replique os dados da fonte para uma replica e, em seguida, faça um backup da replica. A replica pode ser pausada e desligada sem afetar a operação em andamento da fonte, para que você possa produzir um instantâneo eficaz de dados "ativos" que, de outra forma, exigiria que a fonte seja desligada.

Como fazer backup de um banco de dados depende do seu tamanho e se você está fazendo backup apenas dos dados ou dos dados e do estado da replica, para que você possa reconstruir a replica em caso de falha. Portanto, há duas opções:

* Se você está usando a replicação como uma solução para permitir que você faça backup dos dados na fonte, e o tamanho do seu banco de dados não é muito grande, a ferramenta **mysqldump** pode ser adequada. Veja a Seção 19.4.1.1, “Fazendo backup de uma réplica usando mysqldump”.

* Para bancos de dados maiores, onde o **mysqldump** seria impraticável ou ineficiente, você pode fazer backup dos arquivos de dados brutos. Usando a opção de arquivos de dados brutos também significa que você pode fazer backup dos logs binários e de retransmissão que permitem a recriação da replica em caso de falha da replica. Para mais informações, consulte a Seção 19.4.1.2, “Fazendo backup de dados brutos de uma replica”.

Outra estratégia de backup, que pode ser usada para servidores de origem ou replicação, é colocar o servidor em estado de leitura somente. O backup é realizado contra o servidor de leitura somente, que é então alterado de volta ao seu estado operacional usual de leitura/escrita. Veja a Seção 19.4.1.3, “Fazendo um backup de uma origem ou replicação tornando-a somente leitura”.

#### 19.4.1.1 Fazer backup de uma réplica usando mysqldump

Usar o **mysqldump** para criar uma cópia de um banco de dados permite que você capture todos os dados do banco de dados em um formato que permita a importação das informações em outra instância do MySQL Server (consulte Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”). Como o formato das informações são declarações SQL, o arquivo pode ser facilmente distribuído e aplicado a servidores em execução, no caso de você precisar acessar os dados em uma emergência. No entanto, se o tamanho do seu conjunto de dados for muito grande, o **mysqldump** pode ser impraticável.

Dica

Considere o uso dos utilitários de dump do MySQL Shell, que oferecem descarregamento paralelo com múltiplos fios, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como o armazenamento de streaming de Objeto da Infraestrutura da Oracle Cloud e verificações e modificações de compatibilidade do MySQL HeatWave. Os descarregamentos podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carregamento de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Ao usar o **mysqldump**, você deve parar a replicação na replica antes de iniciar o processo de dump para garantir que o dump contenha um conjunto consistente de dados:

1. Parar a replica de processar solicitações. Você pode parar a replicação completamente na replica usando **mysqladmin**:

   ```
   $> mysqladmin stop-slave
   ```

Como alternativa, você pode parar apenas o thread de replicação SQL para pausar a execução do evento:

   ```
   $> mysql -e 'STOP SLAVE SQL_THREAD;'
   Or from MySQL 8.0.22:
   $> mysql -e 'STOP REPLICA SQL_THREAD;'
   ```

Isso permite que a replica continue a receber eventos de mudança de dados do log binário da fonte e os armazene nos logs do relé usando o fio do receptor de replicação, mas impede que a replica execute esses eventos e mude seus dados. Em ambientes de replicação ocupados, permitir que o fio do receptor de replicação seja executado durante o backup pode acelerar o processo de recuperação quando você reiniciar o fio do aplicador de replicação.

2. Execute o **mysqldump** para drenar seus bancos de dados. Você pode drenar todos os bancos de dados ou selecionar os bancos de dados que serão drenados. Por exemplo, para drenar todos os bancos de dados:

   ```
   $> mysqldump --all-databases > fulldb.dump
   ```

3. Uma vez que o descarregamento tenha sido concluído, comece a replicação novamente:

   ```
   $> mysqladmin start-slave
   ```

No exemplo anterior, você pode querer adicionar credenciais de login (nome de usuário, senha) aos comandos e agrupar o processo em um script que você pode executar automaticamente todos os dias.

Se você usar essa abordagem, certifique-se de monitorar o processo de replicação para garantir que o tempo necessário para executar o backup não afete a capacidade da replica de acompanhar os eventos da fonte. Veja a Seção 19.1.7.1, “Verificar o Status da Replicação”. Se a replica não conseguir acompanhar, você pode querer adicionar outra replica e distribuir o processo de backup. Para um exemplo de como configurar esse cenário, veja a Seção 19.4.6, “Replicando Diferentes Bancos de Dados para Diferentes Replicas”.

#### 19.4.1.2 Fazer backup de dados brutos de uma réplica

Para garantir a integridade dos arquivos que são copiados, fazer o backup dos arquivos de dados brutos no seu servidor replica de MySQL deve ocorrer enquanto o servidor replica está desligado. Se o servidor MySQL ainda estiver em execução, as tarefas de segundo plano ainda podem estar atualizando os arquivos do banco de dados, particularmente aqueles que envolvem motores de armazenamento com processos de segundo plano, como `InnoDB`. Com `InnoDB`, esses problemas devem ser resolvidos durante a recuperação em caso de falha, mas, como o servidor replica pode ser desligado durante o processo de backup sem afetar a execução da fonte, faz sentido aproveitar essa capacidade.

Para desligar o servidor e fazer backup dos arquivos:

1. Desative o servidor MySQL replica:

   ```
   $> mysqladmin shutdown
   ```

2. Copie os arquivos de dados. Você pode usar qualquer utilitário de cópia ou arquivamento adequado, incluindo **cp**, **tar** ou **WinZip**. Por exemplo, assumindo que o diretório de dados está localizado sob o diretório atual, você pode arquivar todo o diretório da seguinte forma:

   ```
   $> tar cf /tmp/dbbackup.tar ./data
   ```

3. Inicie o servidor MySQL novamente. Sob Unix:

   ```
   $> mysqld_safe &
   ```

Em Windows:

   ```
   C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
   ```

Normalmente, você deve fazer backup do diretório de dados completo do servidor MySQL replica. Se você deseja ser capaz de restaurar os dados e operar como uma replica (por exemplo, em caso de falha da replica), além dos dados, você precisa ter o repositório de metadados de conexão da replica e o repositório de metadados do aplicável, e os arquivos de registro de releio. Esses itens são necessários para retomar a replicação após restaurar os dados da replica. Supondo que tabelas tenham sido usadas para o repositório de metadados de conexão da replica e o repositório de metadados do aplicável (veja Seção 19.2.4, “Repositórios de Registro de Releio e Metadados de Replicação”), o que é o padrão no MySQL 8.0, essas tabelas são feitas backup juntamente com o diretório de dados. Se arquivos foram usados para os repositórios, o que é desaconselhado, você deve fazer backup desses arquivos separadamente. Os arquivos de registro de releio devem ser feitos backup separadamente se eles tiverem sido colocados em um local diferente do diretório de dados.

Se você perder os registros do retransmissor, mas ainda tiver o arquivo `relay-log.info`, pode verificá-lo para determinar até que ponto o thread de replicação SQL foi executado nos logs binários da fonte. Em seguida, pode usar a declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou a declaração (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) com as opções `SOURCE_LOG_FILE` | `MASTER_LOG_FILE` e `SOURCE_LOG_POS` | `MASTER_LOG_POS` para dizer à replica que re-leia os logs binários a partir desse ponto. Isso exige que os logs binários ainda existam no servidor da fonte.

Se sua replica estiver replicando as declarações `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement"), você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a replica usa para esse propósito. A replica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável do sistema `replica_load_tmpdir` (do MySQL 8.0.26) ou `slave_load_tmpdir` (antes do MySQL 8.0.26). Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável do sistema `tmpdir`.

#### 19.4.1.3 Fazer uma cópia de segurança de uma fonte ou réplica tornando-a somente de leitura

É possível fazer backup de servidores de origem ou replicação em uma configuração de replicação, adquiriendo um bloqueio de leitura global e manipulando a variável de sistema `read_only` para alterar o estado de leitura somente do servidor que será feito backup:

1. Faça o servidor read-only, para que ele processe apenas recuperações e bloqueie atualizações.

2. Realize o backup.  
3. Volte o servidor ao seu estado normal de leitura/escrita.

Nota

As instruções desta seção colocam o servidor que será protegido em um estado seguro para métodos de backup que obtêm os dados do servidor, como **mysqldump** (consulte Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”). Você não deve tentar usar essas instruções para fazer um backup binário copiando arquivos diretamente, porque o servidor ainda pode ter dados modificados cacheados na memória e não apagados no disco.

As instruções a seguir descrevem como fazer isso para uma fonte e para uma réplica. Para ambos os cenários discutidos aqui, suponha que você tenha a configuração de replicação a seguir:

* Um servidor fonte S1 * Um servidor replicado R1 que tem S1 como sua fonte * Um cliente C1 conectado a S1 * Um cliente C2 conectado a R1

Em qualquer cenário, as declarações para adquirir o bloqueio de leitura global e manipular a variável `read_only` são realizadas no servidor que será protegido e não se propagam para quaisquer réplicas desse servidor.

**Cenário 1: Backup com uma Fonte Apenas de Leitura**

Coloque a fonte S1 em estado de leitura somente executando essas instruções nela:

```
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto o S1 estiver em estado de leitura somente, as seguintes propriedades serão verdadeiras:

* Solicitações de atualizações enviadas de C1 para o bloco S1 porque o servidor está em modo de leitura somente.

* As solicitações de resultados de consulta enviadas pelo C1 para o S1 são bem-sucedidas.
* Fazer um backup no S1 é seguro.
* Fazer um backup no R1 não é seguro. Esse servidor ainda está em execução e pode estar processando os registros binários ou solicitações de atualização vindas do cliente C2.

Embora o S1 seja apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no S1 ser concluída, restaure o S1 ao seu estado operacional normal, executando as seguintes instruções:

```
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Embora realizar o backup no S1 seja seguro (no que diz respeito ao backup), não é ótimo em termos de desempenho, pois os clientes do S1 são bloqueados para executar atualizações.

Essa estratégia se aplica ao fazer backup de uma fonte em uma configuração de replicação, mas também pode ser usada para um único servidor em uma configuração sem replicação.

**Cenário 2: Backup com uma Replicação Apenas de Leitura**

Coloque a réplica R1 em estado de leitura somente executando essas instruções nela:

```
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto o R1 estiver em estado de leitura somente, as seguintes propriedades serão verdadeiras:

* A fonte S1 continua em operação, portanto, fazer um backup na fonte não é seguro.

* A réplica R1 está parada, portanto, fazer um backup na réplica R1 é seguro.

Essas propriedades fornecem a base para um cenário de backup popular: ter uma replica ocupada realizando um backup por um tempo não é um problema, pois isso não afeta toda a rede, e o sistema ainda está em execução durante o backup. Em particular, os clientes ainda podem realizar atualizações no servidor de origem, que permanece não afetado pela atividade de backup na replica.

Embora o R1 seja apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no R1 ser concluída, restaure o R1 ao seu estado operacional normal, executando as seguintes instruções:

```
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Depois que a réplica é restaurada ao funcionamento normal, ela se sincroniza novamente com a fonte, recuperando quaisquer atualizações pendentes do log binário da fonte.

### 19.4.2 Tratamento de um Parada Inesperada de uma Replicação

Para que a replicação seja resiliente a interrupções inesperadas do servidor (às vezes descrita como segura em caso de falha), é necessário que a replica possa recuperar seu estado antes de ser interrompida. Esta seção descreve o impacto de uma interrupção inesperada de uma replica durante a replicação e como configurar uma replica para ter a melhor chance de recuperação e continuar a replicação.

Após uma parada inesperada de uma réplica, ao reiniciar, o thread de replicação SQL deve recuperar informações sobre quais transações já foram executadas. As informações necessárias para a recuperação são armazenadas no repositório de metadados do aplicável da réplica. A partir do MySQL 8.0, esse repositório é criado por padrão como uma tabela `InnoDB` chamada `mysql.slave_relay_log_info`. Ao usar esse mecanismo de armazenamento transacional, as informações são sempre recuperáveis ao reiniciar. As atualizações no repositório de metadados do aplicável são comprometidas juntamente com as transações, o que significa que as informações de progresso da réplica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de parada inesperada do servidor. Para mais informações sobre o repositório de metadados do aplicável, consulte a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

As transações DML e também as atualizações atômicas do DDL atualizam as posições de replicação no repositório de metadados do aplicável da replica na tabela `mysql.slave_relay_log_info` juntamente com a aplicação das alterações ao banco de dados, como uma operação atômica. Em todos os outros casos, incluindo declarações DDL que não são totalmente atômicas e motores de armazenamento excluídos que não suportam DDL atômico, a tabela `mysql.slave_relay_log_info` pode estar faltando atualizações associadas aos dados replicados se o servidor interromper inesperadamente. Restaurar as atualizações neste caso é um processo manual. Para obter detalhes sobre o suporte de DDL atômico no MySQL 8.0 e o comportamento resultante para a replicação de determinadas declarações, consulte a Seção 15.1.1, “Suporte a Declaração de Definição de Dados Atômica”.

O processo de recuperação pelo qual uma replica se recupera de uma parada inesperada varia de acordo com a configuração da replica. Os detalhes do processo de recuperação são influenciados pelo método de replicação escolhido, se a replica é monofila ou multifila, e pelo ajuste das variáveis relevantes do sistema. O objetivo geral do processo de recuperação é identificar quais transações já haviam sido aplicadas no banco de dados da replica antes da parada inesperada ocorrer e recuperar e aplicar as transações que a replica perdeu após a parada inesperada.

* Para a replicação baseada em GTID, o processo de recuperação precisa dos GTIDs das transações que já foram recebidas ou comprometidas pela replica. As transações ausentes podem ser recuperadas da fonte usando o autoposicionamento de GTID, que compara automaticamente as transações da fonte com as transações da replica e identifica as transações ausentes.

* Para a replicação com base na posição do arquivo, o processo de recuperação precisa de um fio de replicação SQL preciso (aplicador) que mostre a última transação aplicada na réplica. Com base nessa posição, o fio de I/O de replicação (receptor) recupera do log binário da fonte todas as transações que devem ser aplicadas na réplica a partir desse ponto.

Usar a replicação baseada em GTID facilita a configuração da replicação para ser resiliente a interrupções inesperadas. O autoposicionamento do GTID significa que a replica pode identificar e recuperar de forma confiável as transações ausentes, mesmo que haja lacunas na sequência de transações aplicadas.

As informações a seguir fornecem combinações de configurações apropriadas para diferentes tipos de réplica, garantindo a recuperação na medida em que isso esteja sob controle da replicação.

Importante

Alguns fatores que não estão sob controle da replicação podem ter um impacto no processo de recuperação da replicação e no estado geral da replicação após o processo de recuperação. Em particular, as configurações que influenciam o processo de recuperação para motores de armazenamento individuais podem resultar na perda de transações no caso de uma parada inesperada de uma replica, e, portanto, indisponíveis para o processo de recuperação da replicação. A configuração `innodb_flush_log_at_trx_commit=1` mencionada na lista abaixo é uma configuração chave para uma configuração de replicação que usa `InnoDB` com transações. No entanto, outras configurações específicas de `InnoDB` ou para outros motores de armazenamento, especialmente as relacionadas ao esvaziamento ou sincronização, também podem ter um impacto. Sempre verifique e aplique as recomendações feitas pelos motores de armazenamento escolhidos sobre configurações seguras em caso de falha.

A combinação de configurações a seguir em uma réplica é a mais resistente a interrupções inesperadas:

* Quando a replicação baseada em GTID está em uso (`gtid_mode=ON`), defina `SOURCE_AUTO_POSITION=1` | `MASTER_AUTO_POSITION=1`, que ativa a autoposição do GTID para a conexão com a fonte para identificar e recuperar automaticamente as transações ausentes. Esta opção é definida usando uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23). Se a replica tiver vários canais de replicação, é necessário definir esta opção individualmente para cada canal. Para obter detalhes sobre como o autoposicionamento do GTID funciona, consulte a Seção 19.1.3.3, “Autoposicionamento do GTID”. Quando a replicação baseada na posição de arquivo está em uso, `SOURCE_AUTO_POSITION=1` | `MASTER_AUTO_POSITION=1` não é usada, e, em vez disso, a posição do log binário ou a posição do log de releio é usada para controlar onde a replicação começa.

* A partir do MySQL 8.0.27, quando a replicação baseada em GTID está em uso (`gtid_mode=ON`), defina `GTID_ONLY=1`, o que faz com que a replica use apenas GTIDs no processo de recuperação, e pare de persistir nomes e posições de arquivos de log binário e log de releio nos repositórios de metadados de replicação. Esta opção é definida usando uma declaração `CHANGE REPLICATION SOURCE TO`. Se a replica tiver vários canais de replicação, você precisa definir esta opção individualmente para cada canal. Com `GTID_ONLY=1`, durante a recuperação, as informações de posição de arquivo são ignoradas e o auto-skip de GTID é usado para pular transações que já foram fornecidas, em vez de identificar a posição correta do arquivo. Esta estratégia é mais eficiente, desde que você elimine os logs de releio usando a configuração padrão para `relay_log_purge`, o que significa que apenas um arquivo de log de releio precisa ser inspecionado.

* Defina `sync_relay_log=1`, que instrui o fio de recebimento de replicação a sincronizar o log de releio com o disco após cada transação recebida ser escrita nele. Isso significa que o registro da replica da posição atual lido do log binário da fonte (no repositório de metadados do aplicável) nunca está à frente do registro de transações salvas no log de releio. Observe que, embora essa configuração seja a mais segura, também é a mais lenta devido ao número de escritas no disco envolvidas. Com `sync_relay_log > 1`, ou `sync_relay_log=0` (onde a sincronização é feita pelo sistema operacional), no caso de uma parada inesperada de uma replica, pode haver transações comprometidas que não foram sincronizadas com o disco. Tais transações podem fazer com que o processo de recuperação falhe se a replica que está recuperando, com base nas informações que ela tem no log de releio como última sincronizada com o disco, tente recuperar e aplicar as transações novamente em vez de ignorá-las. Definir `sync_relay_log=1` é particularmente importante para uma replica multi-threaded, onde o processo de recuperação falha se as lacunas na sequência de transações não podem ser preenchidas usando as informações no log de releio. Para uma replica single-threaded, o processo de recuperação só precisa usar o log de releio se as informações relevantes não estiverem disponíveis no repositório de metadados do aplicável.

* Defina `innodb_flush_log_at_trx_commit=1`, que sincroniza os registros `InnoDB` no disco antes de cada transação ser confirmada. Esta configuração, que é a padrão, garante que as tabelas `InnoDB` e os registros `InnoDB` sejam salvos no disco, para que não haja mais a necessidade de informações no registro de relevo em relação à transação. Combinada com a configuração `sync_relay_log=1`, esta configuração assegura ainda que o conteúdo das tabelas `InnoDB` e dos registros `InnoDB` seja consistente com o conteúdo do registro de relevo em todos os momentos, para que a purga dos arquivos de registro de relevo não cause lacunas não preenchidas no histórico de transações da replica, no caso de uma parada inesperada.

* Defina `relay_log_info_repository = TABLE`(replication-options-replica.html#sysvar_relay_log_info_repository), que armazena a posição do fio de replicação SQL na tabela `InnoDB``mysql.slave_relay_log_info`, e a atualize juntamente com o compromisso da transação para garantir um registro que seja sempre preciso. Esta configuração é a padrão a partir do MySQL 8.0, e a configuração `FILE` é descontinuada. A partir do MySQL 8.0.23, o uso da própria variável do sistema é descontinuado, então omita-a e deixe-a como padrão. Se a configuração `FILE`(replication-options-replica.html#sysvar_relay_log_info_repository) for usada, que era a padrão em versões anteriores, as informações são armazenadas em um arquivo no diretório de dados que é atualizado após a transação ter sido aplicada. Isso cria um risco de perda de sincronia com a fonte, dependendo da fase em que a replica se detém no processamento de uma transação, ou até mesmo a corrupção do próprio arquivo. Com a configuração `relay_log_info_repository = FILE`(replication-options-replica.html#sysvar_relay_log_info_repository), a recuperação não é garantida.

* Defina `relay_log_recovery = ON`, que permite a recuperação automática do log de releio imediatamente após a inicialização do servidor. Esta variável global tem como padrão `OFF` e é somente de leitura durante a execução, mas você pode defini-la como `ON` com a opção `--relay-log-recovery` na inicialização da replica após uma parada inesperada de uma replica. Observe que essa configuração ignora os arquivos de log de releio existentes, caso estejam corrompidos ou inconsistentes. O processo de recuperação do log de releio inicia um novo arquivo de log de releio e recupera as transações da fonte, começando na posição do fio SQL de replicação registrada no repositório de metadados do aplicável. Os arquivos de log de releio anteriores são removidos ao longo do tempo pelo mecanismo de purga normal da replica.

Para uma replica multithread, o ajuste de `relay_log_recovery = ON` automaticamente lida com quaisquer inconsistências e lacunas na sequência de transações que foram executadas a partir do log de relevo. Essas lacunas podem ocorrer quando a replicação baseada em posição de arquivo está em uso. (Para mais detalhes, consulte a Seção 19.5.1.34, “Replicação e Inconsistências de Transações”.) O processo de recuperação do log de relevo lida com lacunas usando o mesmo método que a declaração `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` (start-replica.html "15.4.2.6 START REPLICA Statement") (ou antes do MySQL 8.0.22, `START SLAVE` em vez de `START REPLICA`) faria. Quando a replica atinge um estado consistente sem lacunas, o processo de recuperação do log de relevo continua a buscar transações adicionais da fonte, começando na posição do fio de SQL de replicação. Quando a replicação baseada em GTID está em uso, a partir do MySQL 8.0.18, uma replica multithread verifica primeiro se `MASTER_AUTO_POSITION` está definida para `ON`, e se estiver, omite o passo de cálculo das transações que devem ser ignoradas ou não ignoradas, para que os logs antigos de relevo não sejam necessários para o processo de recuperação.

### 19.4.3 Monitoramento da Replicação Baseada em Linha

O progresso atual do aplicativo de aplicação (SQL) da replicação quando se usa replicação baseada em linhas é monitorado por meio das etapas do instrumento do Schema de desempenho, permitindo que você acompanhe o processamento das operações e verifique a quantidade de trabalho concluído e o trabalho estimado. Quando essas etapas do instrumento do Schema de desempenho são habilitadas, a tabela `events_stages_current` exibe etapas para os aplicativos e seu progresso. Para informações de fundo, consulte a Seção 29.12.5, “Tabelas de eventos de etapa do Schema de desempenho”.

Para acompanhar o progresso de todos os três tipos de evento de replicação baseados em linha (escrita, atualização e exclusão):

* Habilite as três etapas do Schema de Desempenho emitindo:

  ```
  mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
      -> WHERE NAME LIKE 'stage/sql/Applying batch of row changes%';
  ```

* Aguarde alguns eventos serem processados pelo aplicativo de aplicação de replicação e, em seguida, verifique o progresso, verificando a tabela `events_stages_current`. Por exemplo, para obter o progresso dos eventos do `update`:

  ```
  mysql> SELECT WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
      -> WHERE EVENT_NAME LIKE 'stage/sql/Applying batch of row changes (update)'
  ```

* Se `binlog_rows_query_log_events` estiver habilitado, as informações sobre as consultas são armazenadas no log binário e são exibidas no campo `processlist_info`. Para ver a consulta original que desencadeou este evento:

  ```
  mysql> SELECT db, processlist_state, processlist_info FROM performance_schema.threads
      -> WHERE processlist_state LIKE 'stage/sql/Applying batch of row changes%' AND thread_id = N;
  ```

### 19.4.4 Usando replicação com diferentes motores de armazenamento de origem e réplica

Não importa para o processo de replicação se a tabela original na fonte e a tabela replicada na réplica utilizam diferentes tipos de mecanismo de armazenamento. De fato, a variável de sistema `default_storage_engine` não é replicada.

Isso oferece uma série de benefícios no processo de replicação, pois você pode aproveitar diferentes tipos de motores para diferentes cenários de replicação. Por exemplo, em um cenário típico de expansão em escala (veja a Seção 19.4.5, “Usando replicação para expansão em escala”), você deseja usar as tabelas `InnoDB` na fonte para aproveitar a funcionalidade transacional, mas use `MyISAM` nas réplicas onde o suporte de transação não é necessário, porque os dados são apenas lidos. Ao usar replicação em um ambiente de registro de dados, você pode querer usar o motor de armazenamento `Archive` na réplica.

Configurar diferentes motores na fonte e na replica depende de como você configura o processo de replicação inicial:

* Se você usou o **mysqldump** para criar o snapshot do banco de dados na sua fonte, você pode editar o texto do arquivo de dump para alterar o tipo de motor usado em cada tabela.

Outra alternativa para o **mysqldump** é desabilitar os tipos de motor que você não deseja usar na replica antes de usar o dump para construir os dados na replica. Por exemplo, você pode adicionar a opção `--skip-federated` na sua replica para desabilitar o motor `FEDERATED`. Se um motor específico não existir para uma tabela ser criada, o MySQL usa o tipo de motor padrão, geralmente `InnoDB`. (Isso requer que o modo SQL `NO_ENGINE_SUBSTITUTION` não esteja habilitado.) Se você deseja desabilitar motores adicionais dessa maneira, pode considerar a construção de um binário especial que será usado na replica e que suporte apenas os motores que você deseja.

* Se você usar arquivos de dados brutos (um backup binário) para configurar a replica, não é possível alterar o formato da tabela inicial. Em vez disso, use `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") para alterar os tipos de tabela após a replica ter sido iniciada.

* Para novos conjuntos de replicação de fonte/replica onde atualmente não existem tabelas na fonte, evite especificar o tipo de motor ao criar novas tabelas.

Se você já está executando uma solução de replicação e deseja converter suas tabelas existentes para outro tipo de motor, siga estes passos:

1. Parar a replicação da replicação de atualizações:

   ```
   mysql> STOP SLAVE;
   Or from MySQL 8.0.22:
   mysql> STOP REPLICA;
   ```

Isso permite que os tipos de motor sejam alterados sem interrupção.

2. Execute um `ALTER TABLE ... ENGINE='engine_type'` para cada tabela que será alterada.

3. Comece o processo de replicação novamente:

   ```
   mysql> START SLAVE;
   ```

Ou, a partir do MySQL 8.0.22:

   ```
   mysql> START REPLICA;
   ```

Embora a variável `default_storage_engine` não seja replicada, esteja ciente de que as declarações (create-table.html "15.1.20 CREATE TABLE Statement") e `ALTER TABLE` que incluem a especificação do motor são replicadas corretamente para a replica. Se, no caso de uma tabela `CSV`, você executar esta declaração:

```
mysql> ALTER TABLE csvtable ENGINE='MyISAM';
```

Essa declaração é replicada; o tipo de motor da tabela na replica é convertido para `InnoDB`, mesmo que você tenha alterado previamente o tipo de tabela na replica para um motor diferente de `CSV`. Se você deseja manter as diferenças de motor na fonte e na replica, você deve ter cuidado ao usar a variável `default_storage_engine` na fonte ao criar uma nova tabela. Por exemplo, em vez de:

```
mysql> CREATE TABLE tablea (columna int) Engine=MyISAM;
```

Utilize este formato:

```
mysql> SET default_storage_engine=MyISAM;
mysql> CREATE TABLE tablea (columna int);
```

Quando replicado, a variável `default_storage_engine` é ignorada, e a declaração `CREATE TABLE` é executada na réplica usando o motor padrão da réplica.

### 19.4.5 Usando replicação para expansão em escala

Você pode usar a replicação como uma solução de expansão; ou seja, onde você deseja dividir a carga das consultas do banco de dados em vários servidores de banco de dados, dentro de algumas limitações razoáveis.

Como a replicação funciona a partir da distribuição de uma fonte para uma ou mais réplicas, usar replicação para expansão é mais eficaz em um ambiente onde você tem um número elevado de leituras e um número baixo de escritas/atualizações. A maioria dos sites se encaixa nessa categoria, onde os usuários navegam pelo site, leem artigos, postagens ou visualizam produtos. As atualizações ocorrem apenas durante o gerenciamento de sessão ou ao fazer uma compra ou adicionar um comentário/mensagem a um fórum.

A replicação nessa situação permite que você distribua as leituras entre as réplicas, ao mesmo tempo em que permite que seus servidores da web se comuniquem com a fonte quando for necessário um registro. Você pode ver um layout de replicação de amostra para esse cenário na Figura 19.1, “Usando replicação para melhorar o desempenho durante a escala de saída”.

**Figura 19.1 Usando replicação para melhorar o desempenho durante a expansão**

![Incoming requests from clients are directed to a load balancer, which distributes client data among a number of web clients. Writes made by web clients are directed to a single MySQL source server, and reads made by web clients are directed to one of three MySQL replica servers. Replication takes place from the MySQL source server to the three MySQL replica servers.](images/scaleout.png)

Se a parte do seu código que é responsável pelo acesso ao banco de dados tiver sido adequadamente abstraída/modularizada, converter isso para executar com um conjunto replicado deve ser muito suave e fácil. Altere a implementação do seu acesso ao banco de dados para enviar todas as escritas para a fonte e para enviar leituras para a fonte ou uma réplica. Se o seu código não tiver esse nível de abstração, configurar um sistema replicado lhe dá a oportunidade e a motivação para limpá-lo. Comece criando uma biblioteca ou módulo de revestimento que implemente as seguintes funções:

* `safe_writer_connect()`
* `safe_reader_connect()`
* `safe_reader_statement()`
* `safe_writer_statement()`

`safe_` em cada nome de função significa que a função cuida de lidar com todas as condições de erro. Você pode usar diferentes nomes para as funções. O importante é ter uma interface unificada para conectar para leituras, conectar para escritas, fazer uma leitura e fazer uma escrita.

Em seguida, converta seu código de cliente para usar a biblioteca de wrapper. Isso pode ser um processo doloroso e assustador no início, mas compensa a longo prazo. Todas as aplicações que usam a abordagem descrita acima podem aproveitar uma configuração de fonte/replica, mesmo uma que envolva múltiplas réplicas. O código é muito mais fácil de manter, e adicionar opções de solução de problemas é trivial. Você precisa modificar apenas uma ou duas funções (por exemplo, para registrar quanto tempo cada declaração levou ou qual declaração entre as emitidas deu um erro).

Se você escreveu um monte de código, talvez queira automatizar a tarefa de conversão escrevendo um script de conversão. Idealmente, seu código usa convenções consistentes de estilo de programação. Se não, então você provavelmente está melhor reescrevendo-o de qualquer maneira, ou pelo menos revisando e regulando manualmente para usar um estilo consistente.

### 19.4.6 Replicação de diferentes bancos de dados em diferentes réplicas

Pode haver situações em que você tenha um servidor de origem e queira replicar diferentes bancos de dados para diferentes réplicas. Por exemplo, você pode querer distribuir diferentes dados de vendas para diferentes departamentos para ajudar a espalhar a carga durante a análise de dados. Uma amostra desse layout é mostrada na Figura 19.2, “Replicando bancos de dados para réplicas separadas”.

**Figura 19.2 Replicação de bancos de dados para separar réplicas**

![The MySQL source has three databases, databaseA, databaseB, and databaseC. databaseA is replicated only to MySQL Replica 1, databaseB is replicated only to MySQL Replica 2, and databaseC is replicated only to MySQL Replica 3.](images/multi-db.png)

Você pode alcançar essa separação configurando a fonte e as réplicas como normais e, em seguida, limitando as declarações do log binário que cada réplica processa, usando a opção de configuração `--replicate-wild-do-table` em cada réplica.

Importante

Você *não* deve usar `--replicate-do-db` para esse propósito ao usar replicação baseada em declarações, uma vez que a replicação baseada em declarações faz com que os efeitos dessa opção variem de acordo com o banco de dados que está atualmente selecionado. Isso também se aplica à replicação de formato misto, uma vez que isso permite que algumas atualizações sejam replicadas usando o formato baseado em declarações.

No entanto, deve ser seguro usar `--replicate-do-db` para esse propósito se você estiver usando apenas replicação baseada em linha, pois, neste caso, o banco de dados atualmente selecionado não afeta o funcionamento da opção.

Por exemplo, para suportar a separação conforme mostrado na Figura 19.2, “Replicando bancos de dados para separar réplicas”, você deve configurar cada réplica da seguinte forma, antes de executar `START REPLICA`:

* A réplica 1 deve usar `--replicate-wild-do-table=databaseA.%`.

* A réplica 2 deve usar `--replicate-wild-do-table=databaseB.%`.

* A réplica 3 deve usar `--replicate-wild-do-table=databaseC.%`.

Cada réplica nessa configuração recebe todo o log binário da fonte, mas executa apenas os eventos do log binário que se aplicam aos bancos de dados e tabelas incluídos pela opção `--replicate-wild-do-table` em vigor naquela réplica.

Se você tiver dados que devem ser sincronizados com as réplicas antes do início da replicação, você tem várias opções:

* Sincione todos os dados para cada réplica e exclua os bancos de dados, tabelas ou ambos que você não deseja manter.

* Use o **mysqldump** para criar um arquivo de dump separado para cada banco de dados e carregue o arquivo de dump apropriado em cada réplica.

* Use um arquivo de dados bruto e inclua apenas os arquivos e bancos de dados específicos que você precisa para cada réplica.

Nota

Isso não funciona com bancos de dados `InnoDB`, a menos que você use `innodb_file_per_table`.

### 19.4.7 Melhorando o desempenho da replicação

À medida que o número de réplicas que se conectam a uma fonte aumenta, a carga, embora mínima, também aumenta, pois cada réplica usa uma conexão de cliente com a fonte. Além disso, como cada réplica deve receber uma cópia completa do log binário da fonte, a carga da rede na fonte também pode aumentar e criar um gargalo.

Se você estiver usando um grande número de réplicas conectadas a uma fonte e essa fonte também estiver ocupada processando solicitações (por exemplo, como parte de uma solução de expansão), talvez queira melhorar o desempenho do processo de replicação.

Uma maneira de melhorar o desempenho do processo de replicação é criar uma estrutura de replicação mais profunda que permita que a fonte se replique apenas em uma replica, e que as demais réplicas se conectem a essa replica primária para atender às suas necessidades de replicação individuais. Uma amostra dessa estrutura é mostrada na Figura 19.3, “Usando uma fonte de replicação adicional para melhorar o desempenho”.

**Figura 19.3 Usando uma fonte de replicação adicional para melhorar o desempenho**

![The server MySQL Source 1 replicates to the server MySQL Source 2, which in turn replicates to the servers MySQL Replica 1, MySQL Replica 2, and MySQL Replica 3.](images/subsource-performance.png)

Para que isso funcione, você deve configurar as instâncias do MySQL da seguinte forma:

* A fonte 1 é a principal fonte onde todas as alterações e atualizações são escritas no banco de dados. O registro binário está habilitado em ambos os servidores de origem, o que é o padrão.

* A fonte 2 é a réplica do servidor Fonte 1 que fornece a funcionalidade de replicação para o restante das réplicas na estrutura de replicação. A Fonte 2 é a única máquina permitida para se conectar à Fonte 1. A Fonte 2 tem a opção `--log-slave-updates` habilitada (que é a padrão). Com esta opção, as instruções de replicação da Fonte 1 também são escritas no log binário da Fonte 2 para que possam então ser replicadas para as verdadeiras réplicas.

* A Replicação 1, a Replicação 2 e a Replicação 3 atuam como réplicas da Fonte 2 e replicam as informações da Fonte 2, que na verdade consiste nos upgrades registrados na Fonte 1.

A solução acima reduz a carga do cliente e a carga da interface de rede na fonte primária, o que deve melhorar o desempenho geral da fonte primária quando usada como uma solução de banco de dados direta.

Se suas réplicas estiverem tendo dificuldades para acompanhar o processo de replicação na fonte, há várias opções disponíveis:

* Se possível, coloque os registros do relé e os arquivos de dados em unidades físicas diferentes. Para fazer isso, defina a variável de sistema `relay_log` para especificar a localização do registro do relé.

* Se a atividade pesada de E/S de disco para leituras do arquivo de log binário e dos arquivos de log de releio for um problema, considere aumentar o valor da variável de sistema `rpl_read_size`. Esta variável de sistema controla a quantidade mínima de dados lida dos arquivos de log, e aumentar o valor pode reduzir as leituras de arquivos e as paradas de E/S quando os dados do arquivo não estão atualmente cacheados pelo sistema operacional. Note que um buffer do tamanho deste valor é alocado para cada thread que lê dos arquivos de log binário e de log de releio, incluindo threads de depuração em fontes e threads de coordenador em réplicas. Portanto, definir um valor grande pode ter um impacto no consumo de memória dos servidores.

* Se as réplicas forem significativamente mais lentas que a fonte, você pode querer dividir a responsabilidade pela replicação de diferentes bancos de dados entre diferentes réplicas. Veja a Seção 19.4.6, “Replicando diferentes bancos de dados em diferentes réplicas”.

* Se a sua fonte faz uso de transações e você não se preocupa com o suporte de transações em suas réplicas, use `MyISAM` ou outro motor não transacional nas réplicas. Veja a Seção 19.4.4, “Usando Replicação com Diferentes Motores de Armazenamento de Fonte e Replicação”.

* Se suas réplicas não estiverem atuando como fontes e você tiver uma solução potencial em vigor para garantir que possa recuperar uma fonte em caso de falha, então você pode desabilitar a variável de sistema `log_replica_updates` (do MySQL 8.0.26) ou `log_slave_updates` (antes do MySQL 8.0.26) nas réplicas. Isso impede que réplicas "tímidas" também registrem eventos que executaram em seu próprio log binário.

### 19.4.8 Mudança de fontes durante o failover

Você pode dizer a uma replica para mudar para uma nova fonte usando a declaração `CHANGE REPLICATION SOURCE TO` (antes do MySQL 8.0.23: [[`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"). A replica não verifica se os bancos de dados na fonte são compatíveis com os da replica; ela simplesmente começa a ler e executar eventos a partir das coordenadas especificadas no log binário da nova fonte. Em uma situação de falha, todos os servidores do grupo estão, normalmente, executando os mesmos eventos a partir do mesmo arquivo de log binário, então mudar a fonte dos eventos não deve afetar a estrutura ou integridade do banco de dados, desde que você exerça cuidado ao fazer a mudança.

As réplicas devem ser executadas com o registro binário habilitado (a opção `--log-bin`), que é a opção padrão. Se você não está usando GTIDs para replicação, então as réplicas também devem ser executadas com `--log-slave-updates=OFF` (o registro de atualizações da replica é a opção padrão). Dessa forma, a replica está pronta para se tornar uma fonte sem reiniciar o **mysqld**. Assuma que você tem a estrutura mostrada na Figura 19.4, “Redundância Usando Replicação, Estrutura Inicial”.

**Figura 19.4 Redundância usando replicação, estrutura inicial**

![Two web clients direct both database reads and database writes to a single MySQL source server. The MySQL source server replicates to Replica 1, Replica 2, and Replica 3.](images/redundancy-before.png)

Neste diagrama, o `Source` contém o banco de dados fonte, os hosts do `Replica*` são réplicas e as máquinas do `Web Client` estão emitindo leituras e escritas no banco de dados. Os clientes da web que emitem apenas leituras (e normalmente estariam conectados às réplicas) não são mostrados, pois não precisam alternar para um novo servidor em caso de falha. Para um exemplo mais detalhado de uma estrutura de replicação de escala de leitura/escrita, consulte a Seção 19.4.5, “Usando Replicação para Escala de Saída”.

Cada réplica do MySQL (`Replica 1`, `Replica 2` e `Replica 3`) é uma réplica que funciona com registro binário habilitado e com `--log-slave-updates=OFF`. Como as atualizações recebidas por uma réplica da fonte não são escritas no registro binário quando `--log-slave-updates=OFF` é especificado, o registro binário em cada réplica é inicialmente vazio. Se, por algum motivo, `Source` se tornar indisponível, você pode escolher uma das réplicas para se tornar a nova fonte. Por exemplo, se você escolher `Replica 1`, todos os `Web Clients` devem ser redirecionados para `Replica 1`, que escreve as atualizações em seu registro binário. `Replica 2` e `Replica 3` devem então replicar a partir de `Replica 1`.

A razão para executar a réplica com `--log-slave-updates=OFF` é evitar que as réplicas recebam atualizações duas vezes, caso você cause uma das réplicas a se tornar a nova fonte. Se `Replica 1` tiver `--log-slave-updates` habilitado, que é o padrão, ele escreve quaisquer atualizações que recebe de `Source` em seu próprio log binário. Isso significa que, quando `Replica 2` muda de `Source` para `Replica 1` como sua fonte, ele pode receber atualizações de `Replica 1` que já recebeu de `Source`.

Certifique-se de que todas as réplicas tenham processado todas as declarações em seu registro de relevo. Em cada réplica, emita `STOP REPLICA IO_THREAD`, em seguida, verifique a saída de `SHOW PROCESSLIST` até que veja `Has read all relay log`. Quando isso for verdadeiro para todas as réplicas, elas podem ser recarregadas para a nova configuração. Na réplica `Replica 1` que está sendo promovida para se tornar a fonte, emita `STOP REPLICA` e `RESET MASTER`.

Nas outras réplicas `Replica 2` e `Replica 3`, use [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") e `CHANGE REPLICATION SOURCE TO SOURCE_HOST='Replica1'` ou `CHANGE MASTER TO MASTER_HOST='Replica1'` (onde `'Replica1'` representa o nome real do host de `Replica 1`). Para usar [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement"), adicione todas as informações sobre como se conectar a `Replica 1` a partir de `Replica 2` ou `Replica 3` (*`user`*, *`password`*, *`port`*). Ao emitir a declaração neste cenário, não é necessário especificar o nome do arquivo de log binário de `Replica 1` ou a posição de log a ser lida, uma vez que o primeiro arquivo de log binário e a posição 4 são os padrões. Por fim, execute [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") em `Replica 2` e `Replica 3`.

Uma vez que o novo conjunto de configuração de replicação esteja em vigor, você precisa dizer a cada `Web Client` para direcionar suas declarações para `Replica 1`. A partir desse ponto em diante, todas as atualizações enviadas por `Web Client` para `Replica 1` são escritas no log binário de `Replica 1`, que então contém todas as atualizações enviadas para `Replica 1` desde que `Source` deixou de estar disponível.

A estrutura do servidor resultante é mostrada na Figura 19.5, "Redundância usando replicação, após falha na fonte".

**Figura 19.5 Redundância usando replicação após falha na fonte**

![The MySQL source server has failed, and is no longer connected into the replication topology. The two web clients now direct both database reads and database writes to Replica 1, which is the new source. Replica 1 replicates to Replica 2 and Replica 3.](images/redundancy-after.png)

Quando o `Source` estiver disponível novamente, você deve torná-lo uma réplica do `Replica 1`. Para fazer isso, em `Source`, emita a mesma declaração `CHANGE REPLICATION SOURCE TO` (ou `CHANGE MASTER TO`) que foi emitida em `Replica 2` e `Replica 3` anteriormente. O `Source` então se torna uma réplica do `Replica 1` e pega os `Web Client` que ele perdeu enquanto estava offline.

Para tornar `Source` uma fonte novamente, use o procedimento anterior como se `Replica 1` não estivesse disponível e `Source` fosse a nova fonte. Durante este procedimento, não se esqueça de executar `RESET MASTER` em `Source` antes de fazer as réplicas de `Replica 1`, `Replica 2` e `Replica 3` de `Source`. Se não fizer isso, as réplicas podem pegar escritas obsoletas dos aplicativos do `Web Client` que datam de antes do ponto em que `Source` deixou de estar disponível.

Você deve estar ciente de que não há sincronização entre as réplicas, mesmo quando elas compartilham a mesma fonte, e, portanto, algumas réplicas podem estar consideravelmente à frente das outras. Isso significa que, em alguns casos, o procedimento descrito no exemplo anterior pode não funcionar conforme o esperado. Na prática, no entanto, os registros de relevo em todas as réplicas devem estar relativamente próximos uns dos outros.

Uma maneira de manter as aplicações informadas sobre a localização da fonte é ter uma entrada de DNS dinâmica para o host da fonte. Com `BIND`, você pode usar o **nsupdate** para atualizar o DNS dinamicamente.

### 19.4.9 Mudança de fontes e réplicas com falha de transição de conexão assíncrona

A partir do MySQL 8.0.22, você pode usar o mecanismo de falha de conexão assíncrona para estabelecer automaticamente uma conexão de replicação assíncrona (fonte para réplica) para uma nova fonte após a conexão existente de uma réplica para sua fonte falhar. O mecanismo de falha de conexão assíncrona pode ser usado para manter uma réplica sincronizada com vários servidores MySQL ou grupos de servidores que compartilham dados. A lista de servidores de fonte potenciais é armazenada na réplica, e, em caso de falha de conexão, uma nova fonte é selecionada da lista com base em uma prioridade ponderada que você define.

A partir do MySQL 8.0.23, o mecanismo de falha de conexão assíncrona também suporta topologias de replicação de grupo, monitorando automaticamente as alterações na adesão ao grupo e distinguindo entre servidores primários e secundários. Quando você adiciona um membro do grupo à lista de origem e o define como parte de um grupo gerenciado, o mecanismo de falha de conexão assíncrona atualiza a lista de origem para mantê-la alinhada com as alterações de adesão, adicionando e removendo membros do grupo automaticamente à medida que se juntam ou deixam. Apenas os membros do grupo online que estão na maioria são usados para conexões e obtenção de status. O último membro restante de um grupo gerenciado não é removido automaticamente, mesmo que ele deixe o grupo, para que a configuração do grupo gerenciado seja mantida. No entanto, você pode excluir um grupo gerenciado manualmente se ele não for mais necessário.

A partir do MySQL 8.0.27, o mecanismo de falha de conexão assíncrona também permite que uma réplica que faz parte de um grupo de replicação gerenciado se reconecte automaticamente ao remetente se o receptor atual (o primário do grupo) falhar. Esse recurso funciona com a Replicação por Grupo, em um grupo configurado no modo de único primário, onde o primário do grupo é uma réplica que tem um canal de replicação usando o mecanismo. O recurso é projetado para um grupo de remetentes e um grupo de receptores para se manter sincronizados entre si mesmo quando alguns membros estão temporariamente indisponíveis. Ele também sincroniza um grupo de receptores com um ou mais remetentes que não fazem parte de um grupo gerenciado. Uma réplica que não faz parte de um grupo de replicação não pode usar esse recurso.

Os requisitos para o uso do mecanismo de transição de conexão assíncrona são os seguintes:

* Os GTIDs devem estar em uso na fonte e na réplica (`gtid_mode=ON`), e a opção `SOURCE_AUTO_POSITION` | `MASTER_AUTO_POSITION` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` deve estar habilitada na réplica, para que o posicionamento automático do GTID seja usado para a conexão com a fonte.

* A mesma conta de usuário de replicação e senha devem existir em todos os servidores de origem na lista de origem para o canal. Essa conta é usada para a conexão de cada uma das fontes. Você pode configurar diferentes contas para diferentes canais.

* A conta de usuário de replicação deve ter as permissões `SELECT` nas tabelas do Schema de Desempenho, por exemplo, emitindo `GRANT SELECT ON performance_schema.* TO 'repl_user';`

* A conta de usuário e a senha de replicação não podem ser especificadas na declaração usada para iniciar a replicação, porque elas precisam estar disponíveis no reinício automático para a conexão com a fonte alternativa. Elas devem ser definidas para o canal usando a declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` na réplica e registradas nos repositórios de metadados de replicação.

* Se o canal onde o mecanismo de falha de conexão assíncrona está em uso estiver no primário de um grupo de replicação de único primário, a partir do MySQL 8.0.27, a falha de conexão assíncrona entre réplicas também é ativa por padrão. Nessa situação, o canal de replicação e a conta de usuário e senha de replicação para o canal devem ser configurados em todos os servidores secundários do grupo de replicação e em quaisquer novos membros que se juntem. Se os novos servidores forem projetados usando a funcionalidade de clone do MySQL, tudo isso acontece automaticamente.

Importante

Se você não deseja que a falha de conexão assíncrona ocorra entre as réplicas nesta situação, desative-a desabilitando a ação do membro `mysql_start_failover_channels_if_primary` para o grupo, usando a função `group_replication_disable_member_action`. Quando o recurso é desativado, você não precisa configurar o canal de replicação nos membros do grupo secundário, mas se o primário sair offline ou entrar em um estado de erro, a replicação para o canal é interrompida.

A partir do MySQL Shell 8.0.27 e do MySQL 8.0.27, o MySQL InnoDB ClusterSet está disponível para fornecer tolerância a desastres para implantações do InnoDB Cluster, vinculando um InnoDB Cluster primário com uma ou mais réplicas dele em locais alternativos, como diferentes centros de dados. Considere usar essa solução em vez disso para simplificar a configuração de uma nova implantação multi-grupo para replicação, falha e recuperação de desastres. Você pode adotar uma implantação existente de Replicação de Grupo como um InnoDB Cluster.

O InnoDB ClusterSet e o InnoDB Cluster foram projetados para abstrair e simplificar os procedimentos para configurar, gerenciar, monitorar, recuperar e reparar grupos de replicação. O InnoDB ClusterSet gerencia automaticamente a replicação de um cluster primário para clusters replicados usando um canal de replicação ClusterSet dedicado. Você pode usar comandos de administrador para acionar uma transição controlada ou uma falha de emergência entre grupos, se o cluster primário não estiver funcionando normalmente. Servidores e grupos podem ser facilmente adicionados ou removidos da implantação InnoDB ClusterSet após a configuração inicial, quando a demanda muda. Para mais informações, consulte MySQL InnoDB ClusterSet.

#### 19.4.9.1 Reposição de Conexão Assíncrona para Fontes

Para ativar o failover de conexão assíncrona para um canal de replicação definido em `SOURCE_CONNECTION_AUTO_FAILOVER=1` na declaração `CHANGE REPLICATION SOURCE TO` (de MySQL 8.0.23) ou na declaração `CHANGE MASTER TO` (antes de MySQL 8.0.23) para o canal. O posicionamento automático do GTID deve estar em uso para o canal (`SOURCE_AUTO_POSITION = 1` | `MASTER_AUTO_POSITION = 1`).

Importante

Quando a conexão existente com uma fonte falha, a replica primeiro refaz a mesma conexão o número de vezes especificado pela opção `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. O intervalo entre as tentativas é definido pela opção `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY`. Quando essas tentativas são esgotadas, o mecanismo de falha de conexão assíncrona assume o controle. Note que os valores padrão dessas opções, que foram projetados para uma conexão com uma única fonte, fazem com que a replica refaça a mesma conexão por 60 dias. Para garantir que o mecanismo de falha de conexão assíncrona possa ser ativado prontamente, defina `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT` e `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY` para números mínimos que apenas permitam algumas tentativas de refaça com a mesma fonte, no caso de a falha de conexão ser causada por uma interrupção transitória da rede. Valores adequados são `SOURCE_RETRY_COUNT=3` | `MASTER_RETRY_COUNT=3` e `SOURCE_CONNECT_RETRY=10` | `MASTER_CONNECT_RETRY=10`, que fazem com que a replica refaça a conexão 3 vezes com intervalos de 10 segundos entre.

Você também precisa definir a lista de fontes para o canal de replicação, para especificar as fontes disponíveis para falha. Você define e gerencia listas de fontes usando as funções `asynchronous_connection_failover_add_source` e `asynchronous_connection_failover_delete_source` para adicionar e remover servidores de fonte de replicação individual. Para adicionar e remover grupos gerenciados de servidores, use as funções `asynchronous_connection_failover_add_managed` e `asynchronous_connection_failover_delete_managed` em vez disso.

As funções nomeiam o canal de replicação relevante e especificam o nome do host, o número de porta, o espaço de rede e a prioridade ponderada (1-100, com 100 sendo a prioridade mais alta) de uma instância MySQL para adicionar ou excluir da lista de origem do canal. Para um grupo gerenciado, você também especifica o tipo de serviço gerenciado (atualmente, apenas o Grupo de Replicação está disponível) e o identificador do grupo gerenciado (para o Grupo de Replicação, este é o valor da variável de sistema `group_replication_group_name`). Ao adicionar um grupo gerenciado, você só precisa adicionar um membro do grupo, e a replica adiciona automaticamente o restante da participação atual do grupo. Ao excluir um grupo gerenciado, você exclui o grupo inteiro junto.

No MySQL 8.0.22, o mecanismo de falha de conexão assíncrona é ativado após a falha da conexão da réplica com a fonte, e emite uma declaração `START REPLICA` (start-replica.html "15.4.2.6 START REPLICA Statement") para tentar se conectar a uma nova fonte. Neste lançamento, a conexão falha se o thread do receptor de replicação parar devido à fonte parar ou devido a uma falha de rede. A conexão não falha em outras situações, como quando os threads de replicação são parados por uma declaração `STOP REPLICA`.

A partir do MySQL 8.0.23, o mecanismo de falha de conexão assíncrona também realiza a transferência de conexão se outro servidor disponível na lista de origem tiver um conjunto de prioridades (peso) mais alto. Esse recurso garante que a replica permaneça conectada ao servidor de origem mais adequado em todos os momentos, e ele se aplica tanto a grupos gerenciados quanto a servidores únicos (não gerenciados). Para um grupo gerenciado, o peso de uma origem é atribuído dependendo se é um servidor primário ou secundário. Portanto, assumindo que você configurou o grupo gerenciado para dar um peso mais alto a um servidor primário e um peso mais baixo a um secundário, quando o primário muda, o peso mais alto é atribuído ao novo primário, então a replica muda a conexão para ele. O mecanismo de falha de conexão assíncrona também muda a conexão se o servidor de origem gerenciado conectado atualmente deixar o grupo gerenciado ou não estiver mais na maioria do grupo gerenciado.

Quando falha em uma conexão, a fonte com o maior nível de prioridade (peso) entre as fontes alternativas listadas na lista de fontes para o canal é escolhida para a primeira tentativa de conexão. A replica verifica primeiro se pode se conectar ao servidor da fonte, ou, no caso de um grupo gerenciado, se o servidor da fonte tem o status `ONLINE` no grupo (não `RECOVERING` ou indisponível). Se a fonte com o maior peso não estiver disponível, a replica tenta com todas as fontes listadas em ordem decrescente de peso, e então começa novamente a partir da fonte com o maior peso. Se várias fontes tiverem o mesmo peso, a replica as ordena aleatoriamente. Se a replica precisar começar a trabalhar novamente pela lista, ela inclui e tenta novamente a fonte à qual a falha original de conexão ocorreu.

As listas de origem são armazenadas nas tabelas `mysql.replication_asynchronous_connection_failover` e `mysql.replication_asynchronous_connection_failover_managed`, e podem ser visualizadas nas tabelas do Gerenciador de desempenho `replication_asynchronous_connection_failover` e `replication_asynchronous_connection_failover_managed`. A replica utiliza um fio de monitoramento para rastrear a filiação dos grupos gerenciados e atualizar a lista de origem (`thread/sql/replica_monitor`). A configuração da opção `SOURCE_CONNECTION_AUTO_FAILOVER` da declaração [`CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` e a lista de origem são transferidas para uma cópia da replica durante uma operação de clonagem remota.

#### 19.4.9.2 Reposição de Conexão Assíncrona para Replicas

No MySQL 8.0.27 e versões posteriores, o failover de conexão assíncrona para réplicas é ativado automaticamente para um canal de replicação em um primário de Replicação por Grupo quando você define `SOURCE_CONNECTION_AUTO_FAILOVER=1` na declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") para o canal. O recurso é projetado para um grupo de remetentes e um grupo de destinatários para se manterem sincronizados entre si, mesmo quando alguns membros estão temporariamente indisponíveis. Quando o recurso está ativo e configurado corretamente, se o primário que está replicando sair do ar ou entrar em um estado de erro, o novo primário começa a replicação no mesmo canal quando é eleito. O novo primário usa a lista de fontes do canal para selecionar a fonte com o maior nível de prioridade (peso), que pode não ser a mesma que a fonte original.

Para configurar essa funcionalidade, o canal de replicação e a conta de usuário e senha de replicação para o canal devem ser configurados em todos os servidores membros do grupo de replicação e em quaisquer novos membros que se juntem. Certifique-se de que `SOURCE_RETRY_COUNT` e `SOURCE_CONNECT_RETRY` estejam configurados com números mínimos que permitam apenas algumas tentativas de reposição, por exemplo, 3 e 10. Você pode configurar o canal de replicação usando `CHANGE REPLICATION SOURCE TO`, ou se os novos servidores forem provisionados usando a funcionalidade de clone do MySQL, isso acontece automaticamente. O ajuste `SOURCE_CONNECTION_AUTO_FAILOVER` para o canal é transmitido aos membros do grupo a partir do primário quando eles se juntam. Se, posteriormente, desabilitar `SOURCE_CONNECTION_AUTO_FAILOVER` para o canal no primário, isso também é transmitido aos servidores secundários e eles alteram o status do canal para corresponder.

Nota

Um servidor que participa de um grupo no modo de primário único deve ser iniciado com `--skip-replica-start=ON`. Caso contrário, o servidor não pode se juntar ao grupo como secundário.

O failover de conexão assíncrona para réplicas é ativado e desativado usando a ação do membro de Replicação por Grupo `mysql_start_failover_channels_if_primary`, que é habilitada por padrão. Você pode desativá-la para todo o grupo desativando essa ação do membro no primário, usando a função `group_replication_disable_member_action`, como neste exemplo:

```
mysql> SELECT group_replication_disable_member_action("mysql_start_failover_channels_if_primary", "AFTER_PRIMARY_ELECTION");
```

A função só pode ser alterada em um primário e deve ser habilitada ou desabilitada para todo o grupo, portanto, não é possível ter alguns membros fornecendo failover e outros não. Quando a ação de membro `mysql_start_failover_channels_if_primary` é desabilitada, o canal não precisa ser configurado em membros secundários, mas se o primário sair offline ou entrar em um estado de erro, a replicação para o canal é interrompida. Observe que, se houver mais de um canal com `SOURCE_CONNECTION_AUTO_FAILOVER=1`, a ação do membro cobre todos os canais, portanto, não podem ser habilitados e desabilitados individualmente por esse método. Defina `SOURCE_CONNECTION_AUTO_FAILOVER=0` no primário para desabilitar um canal individual.

A lista de fontes para um canal com `SOURCE_CONNECTION_AUTO_FAILOVER=1` é transmitida para todos os membros do grupo quando eles se juntam, e também quando ela muda. Isso ocorre independentemente de as fontes serem um grupo gerenciado para o qual a adesão é atualizada automaticamente, ou se elas são adicionadas ou alteradas manualmente usando `asynchronous_connection_failover_add_source()`, `asynchronous_connection_failover_delete_source()`, `asynchronous_connection_failover_add_managed()` ou `asynchronous_connection_failover_delete_managed()`. Todos os membros do grupo recebem a lista atual de fontes conforme registrada nas tabelas `mysql.replication_asynchronous_connection_failover` e `mysql.replication_asynchronous_connection_failover_managed`. Como as fontes não precisam estar em um grupo gerenciado, você pode configurar a função para sincronizar um grupo de receptores com um ou mais remetentes alternativos independentes, ou até mesmo um único remetente. Uma replica independente que não faz parte de um grupo de replicação não pode usar essa funcionalidade.

### 19.4.10 Replicação semiesincronizada

Além da replicação assíncrona integrada, o MySQL 8.0 suporta uma interface para replicação semiesincrônica que é implementada por plugins. Esta seção discute o que é a replicação semiesincrônica e como ela funciona. As seções seguintes abordam a interface administrativa para replicação semiesincrônica e como instalá-la, configurá-la e monitorá-la.

A replicação do MySQL, por padrão, é assíncrona. A fonte escreve eventos em seu log binário e as réplicas as solicitam quando estão prontas. A fonte não sabe se ou quando uma réplica recuperou e processou as transações, e não há garantia de que algum evento chegue a qualquer réplica. Com a replicação assíncrona, se a fonte falhar, as transações que ela comprometeu podem não ter sido transmitidas para nenhuma réplica. O failover do fonte para a réplica, neste caso, pode resultar em failover para um servidor que está faltando transações em relação à fonte.

Com replicação totalmente sincronizada, quando uma fonte executa uma transação, todas as réplicas também executaram a transação antes de a fonte retornar à sessão que executou a transação. A replicação totalmente sincronizada significa que o failover da fonte para qualquer réplica é possível a qualquer momento. O inconveniente da replicação totalmente sincronizada é que pode haver um grande atraso para completar uma transação.

A replicação semiescronizada fica entre a replicação assíncrona e a replicação totalmente síncrona. A fonte espera até que pelo menos uma réplica tenha recebido e registrado os eventos (o número necessário de réplicas é configurável) e, em seguida, confirma a transação. A fonte não espera que todas as réplicas confirmem a recepção e requer apenas um reconhecimento das réplicas, não que os eventos tenham sido totalmente executados e confirmados no lado da réplica. Portanto, a replicação semiescronizada garante que, se a fonte falhar, todas as transações que ela confirmou foram transmitidas para pelo menos uma réplica.

Comparado à replicação assíncrona, a replicação semiesincrônica oferece uma integridade de dados melhorada, porque, quando um commit retorna com sucesso, sabe-se que os dados existem em pelo menos dois lugares. Até que uma fonte semiesincrônica receba o reconhecimento do número necessário de réplicas, a transação fica em espera e não é comprometida.

Comparado à replicação totalmente sincronizada, a replicação semiesincrônica é mais rápida, porque pode ser configurada para equilibrar suas necessidades de integridade dos dados (o número de réplicas que reconhecem a recepção da transação) com a velocidade dos commits, que são mais lentos devido à necessidade de esperar pelas réplicas.

Importante

Com a replicação semiesincrona, se a fonte falhar e uma falha de replicação for realizada, a fonte falhou não deve ser reutilizada como fonte de replicação e deve ser descartada. Ela pode ter transações que não foram reconhecidas por nenhuma réplica, portanto, não foram comprometidas antes da falha de replicação.

Se o seu objetivo é implementar uma topologia de replicação tolerante a falhas, onde todos os servidores recebem as mesmas transações na mesma ordem, e um servidor que cai pode se reconectar ao grupo e ser atualizado automaticamente, você pode usar a Replicação por Grupo para alcançar isso. Para informações, consulte o Capítulo 20, *Replicação por Grupo*.

O impacto no desempenho da replicação semisíncrona em comparação com a replicação assíncrona é o compromisso para aumentar a integridade dos dados. A quantidade de lentidão é pelo menos o tempo de ida e volta do TCP/IP para enviar o compromisso para a réplica e esperar o reconhecimento da recepção pela réplica. Isso significa que a replicação semisíncrona funciona melhor para servidores próximos que se comunicam em redes rápidas, e pior para servidores distantes que se comunicam em redes lentas. A replicação semisíncrona também coloca um limite de taxa em sessões ocupadas, restringindo a velocidade com que eventos de log binário podem ser enviados da fonte para a réplica. Quando um usuário está muito ocupado, isso o desacelera, o que pode ser útil em algumas situações de implantação.

A replicação semiesincronizada entre uma fonte e suas réplicas funciona da seguinte forma:

* Uma réplica indica se é capaz de ser semi-sincronizada quando se conecta à fonte.

* Se a replicação semisíncrona estiver habilitada no lado da fonte e houver pelo menos uma replica semisíncrona, um thread que realize um compromisso de transação nos blocos da fonte e espere até que pelo menos uma replica semisíncrona reconheça que recebeu todos os eventos da transação, ou até que ocorra um tempo de espera.

* A replica reconhece o recebimento dos eventos de uma transação apenas após esses eventos terem sido escritos em seu log de retransmissão e apagados no disco.

* Se ocorrer um tempo de espera sem que nenhuma réplica tenha reconhecido a transação, a fonte retorna à replicação assíncrona. Quando pelo menos uma réplica semisíncrona alcança a atualização, a fonte retorna à replicação semisíncrona.

* A replicação semiesincrônica deve ser habilitada tanto no lado da fonte quanto no lado da replica. Se a replicação semiesincrônica for desabilitada na fonte, ou habilitada na fonte, mas não nas réplicas, a fonte usa replicação assíncrona.

Enquanto a fonte está bloqueando (esperando reconhecimento de uma réplica), ela não retorna à sessão que realizou a transação. Quando o bloco termina, a fonte retorna à sessão, que então pode prosseguir para executar outras declarações. Neste ponto, a transação foi comprometida no lado da fonte, e o recebimento de seus eventos foi reconhecido por pelo menos uma réplica. O número de reconhecimentos de réplica que a fonte deve receber por transação antes de retornar à sessão é configurável, e o padrão é um reconhecimento (consulte Seção 19.4.10.2, “Configurando Replicação Semisíncrona”).

O bloqueio também ocorre após recuos que são escritos no log binário, o que acontece quando uma transação que modifica tabelas não transacionais é recuada. A transação recuada é registrada, mesmo que não tenha efeito para tabelas transacionais, porque as modificações nas tabelas não transacionais não podem ser recuadas e devem ser enviadas para réplicas.

Para declarações que não ocorrem em contexto transacional (ou seja, quando nenhuma transação foi iniciada com `START TRANSACTION` ou (commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ou `SET autocommit = 0` ou (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")), o autocommit é habilitado e cada declaração compromete implicitamente. Com replicação semi-síncrona, os blocos de origem para cada declaração, assim como para os compromissos explícitos de transação, são ignorados.

Por padrão, a fonte aguarda o reconhecimento da replicação do recibo da transação após a sincronização do log binário no disco, mas antes de comprometer a transação no motor de armazenamento. Como alternativa, você pode configurar a fonte para que ela espere o reconhecimento da replicação após a comprovação da transação no motor de armazenamento, usando a variável de sistema `rpl_semi_sync_source_wait_point` ou `rpl_semi_sync_master_wait_point`. Esta configuração afeta as características de replicação e os dados que os clientes podem ver na fonte. Para mais informações, consulte a Seção 19.4.10.2, “Configurando a Replicação Semisíncrona”.

A partir do MySQL 8.0.23, você pode melhorar o desempenho da replicação semiescronizada ao habilitar as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona blocos compartilhados e evita aquisições de bloqueio desnecessárias. Esses ajustes ajudam à medida que o número de réplicas aumenta, porque a disputa por blocos pode desacelerar o desempenho. Os servidores de origem da replicação semiescronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.

#### 19.4.10.1 Instalar replicação semiescronizada

A replicação semiesincronizada é implementada usando plugins, que devem ser instalados na fonte e nas réplicas para tornar a replicação semiesincronizada disponível nas instâncias. Existem diferentes plugins para uma fonte e para uma réplica. Após um plugin ter sido instalado, você o controla por meio das variáveis do sistema associadas a ele. Essas variáveis do sistema estão disponíveis apenas quando o plugin associado foi instalado.

Esta seção descreve como instalar os plugins de replicação semisíncrona. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para usar a replicação semiesincronizada, os seguintes requisitos devem ser atendidos:

* A capacidade de instalar plugins requer um servidor MySQL que suporte carregamento dinâmico. Para verificar isso, verifique se o valor da variável de sistema `have_dynamic_loading` é `YES`. Distribuições binárias devem suportar carregamento dinâmico.

* A replicação já deve estar funcionando, veja a Seção 19.1, “Configurando a Replicação”.

* Não deve haver vários canais de replicação configurados. A replicação semiescronizada é compatível apenas com o canal de replicação padrão. Consulte a Seção 19.2.2, “Canais de replicação”.

O MySQL 8.0.26 e versões posteriores fornecem novas versões dos plugins que implementam replicação semi-sincronizada, uma para o servidor fonte e outra para a replica. Os novos plugins substituem os termos “master” e “slave” pelos termos “source” e “replica” nas variáveis de sistema e nas variáveis de status, e você pode (e deve) instalar essas versões em vez das versões antigas (que agora são desatualizadas e, portanto, sujeitas à remoção em uma versão futura do MySQL). Você não pode ter ambas as versões do plugin relevante instaladas em uma instância. Se você usar as novas versões dos plugins, as novas variáveis de sistema e variáveis de status estarão disponíveis, mas as antigas não; se você usar as versões antigas dos plugins, as antigas variáveis de sistema e variáveis de status estarão disponíveis, mas as novas

O sufixo do nome do arquivo para os arquivos da biblioteca de plugins difere por plataforma (por exemplo, `.so` para Unix e sistemas semelhantes ao Unix, e `.dll` para Windows). Os nomes dos arquivos de plugin e biblioteca são os seguintes:

* servidor de origem, terminologia antiga: plugin `rpl_semi_sync_master` (biblioteca `semisync_master.so` ou `semisync_master.dll`)

* servidor de origem, nova terminologia (de MySQL 8.0.26): `rpl_semi_sync_source` plugin (`semisync_source.so` ou `semisync_source.dll` biblioteca)

* Replicação, terminologia antiga: `rpl_semi_sync_slave` plugin (`semisync_slave.so` ou `semisync_slave.dll` biblioteca)

* Replicação, nova terminologia (de MySQL 8.0.26): plugin `rpl_semi_sync_replica` (biblioteca `semisync_replica.so` ou `semisync_replica.dll`)

Para ser utilizado por um servidor de origem ou replicação, o arquivo da biblioteca de plugins apropriado deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor. O arquivo da biblioteca de plugins de origem deve estar presente no diretório do plugin do servidor de origem. O arquivo da biblioteca de plugins de replicação deve estar presente no diretório do plugin de cada servidor de replicação.

Para configurar a replicação semiesincronizada, use as instruções a seguir. As declarações `INSTALL PLUGIN`, [`SET GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), `STOP REPLICA` e `START REPLICA` mencionadas aqui requerem o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`).

Para carregar os plugins, use a declaração `INSTALL PLUGIN` (install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") na fonte e em cada réplica que deve ser semi-sincronizada, ajustando o sufixo `.so` para sua plataforma conforme necessário.

Sobre a fonte:

```
INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';

Or from MySQL 8.0.26:
INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
```

Em cada réplica:

```
INSTALL PLUGIN rpl_semi_sync_slave SONAME 'semisync_slave.so';

Or from MySQL 8.0.26:
INSTALL PLUGIN rpl_semi_sync_replica SONAME 'semisync_replica.so';
```

Se uma tentativa de instalar um plugin resultar em um erro no Linux semelhante ao mostrado aqui, você deve instalar `libimf`:

```
mysql> INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
ERROR 1126 (HY000): Can't open shared library
'/usr/local/mysql/lib/plugin/semisync_source.so'
(errno: 22 libimf.so: cannot open shared object file:
No such file or directory)
```

Você pode obter `libimf` a partir de <https://dev.mysql.com/downloads/os-linux.html>.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%semi%';
+----------------------+---------------+
| PLUGIN_NAME          | PLUGIN_STATUS |
+----------------------+---------------+
| rpl_semi_sync_source | ACTIVE        |
+----------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Após a instalação de um plugin de replicação semisíncrona, ele é desativado por padrão. Os plugins devem ser ativados tanto no lado de origem quanto no lado da replica para habilitar a replicação semisíncrona. Se apenas um lado for ativado, a replicação é assíncrona. Para ativar os plugins, defina a variável de sistema apropriada, seja em tempo de execução usando `SET GLOBAL`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), ou na inicialização do servidor na linha de comando ou em um arquivo de opção. Por exemplo:

```
On the source:
SET GLOBAL rpl_semi_sync_master_enabled = 1;

Or from MySQL 8.0.26 with the rpl_semi_sync_source plugin:
SET GLOBAL rpl_semi_sync_source_enabled = 1;
```

```
On each replica:
SET GLOBAL rpl_semi_sync_slave_enabled = 1;

Or from MySQL 8.0.26 with the rpl_semi_sync_replica plugin:
SET GLOBAL rpl_semi_sync_replica_enabled = 1;
```

Se você habilitar a replicação semi-sincronizada em uma replica durante a execução, também deve iniciar o thread de I/O de replicação (receptor) (parando-o primeiro, se já estiver em execução) para fazer com que a replica se conecte à fonte e se registre como uma replica semi-sincronizada:

```
STOP SLAVE IO_THREAD;
START SLAVE IO_THREAD;

Or from MySQL 8.0.22:
STOP REPLICA IO_THREAD;
START REPLICA IO_THREAD;
```

Se a thread de I/O de replicação (receptor) já estiver em execução e você não a reiniciar, a replicação continua a usar a replicação assíncrona.

Uma configuração listada em um arquivo de opções tem efeito cada vez que o servidor é iniciado. Por exemplo, você pode definir as variáveis nos arquivos `my.cnf` nos servidores de origem e replicação da seguinte forma:

```
 On the source:

[mysqld]
rpl_semi_sync_master_enabled=1

Or from MySQL 8.0.26 with the rpl_semi_sync_source plugin:
rpl_semi_sync_source_enabled=1
```

```
 On each replica:

[mysqld]
rpl_semi_sync_slave_enabled=1

Or from MySQL 8.0.26 with the rpl_semi_sync_source plugin:
rpl_semi_sync_replica_enabled=1
```

Você pode configurar o comportamento dos plugins de replicação semiesincronizada usando as variáveis do sistema que se tornam disponíveis quando você instala os plugins. Para informações sobre as variáveis do sistema chave, consulte a Seção 19.4.10.2, “Configurando replicação semiesincronizada”.

#### 19.4.10.2 Configurando a Replicação Semisíncrona

Quando você instala os plugins de fonte e replicação semiesincrona (consulte a Seção 19.4.10.1, “Instalando replicação semiesincrona”), as variáveis do sistema se tornam disponíveis para controlar o comportamento do plugin.

Para verificar os valores atuais das variáveis de status para replicação semiesincronizada, use `SHOW VARIABLES`(show-variables.html "15.7.7.41 SHOW VARIABLES Statement"):

```
mysql> SHOW VARIABLES LIKE 'rpl_semi_sync%';
```

A partir do MySQL 8.0.26, novas versões dos plugins de fonte e replica são fornecidas, que substituem os termos “mestre” e “escravo” por “fonte” e “replica” nas variáveis de sistema e variáveis de status. Se você instalar os novos plugins `rpl_semi_sync_source` e `rpl_semi_sync_replica`, as novas variáveis de sistema e variáveis de status estarão disponíveis, mas as antigas não. Se você instalar os antigos plugins `rpl_semi_sync_master` e `rpl_semi_sync_slave`, as antigas variáveis de sistema e variáveis de status estarão disponíveis, mas as novas não. Você não pode ter ambas as versões nova e antiga do plugin relevante instalada em uma instância.

Todas as variáveis do sistema `rpl_semi_sync_xxx` são descritas na Seção 19.1.6.2, “Opções e Variáveis da Fonte de Replicação” e na Seção 19.1.6.3, “Opções e Variáveis do Servidor de Replicação”. Algumas variáveis-chave do sistema são:

`rpl_semi_sync_source_enabled` ou `rpl_semi_sync_master_enabled` :   Controla se a replicação semisíncrona está habilitada no servidor de origem. Para habilitar ou desabilitar o plugin, defina essa variável para 1 ou 0, respectivamente. O padrão é 0 (desativado).

`rpl_semi_sync_replica_enabled` ou `rpl_semi_sync_slave_enabled` :   Controla se a replicação semisíncrona está habilitada na replica.

`rpl_semi_sync_source_timeout` ou `rpl_semi_sync_master_timeout` :   Um valor em milissegundos que controla o tempo que a fonte espera um compromisso para obter um reconhecimento de uma réplica antes de expirar e retornar à replicação assíncrona. O valor padrão é 10000 (10 segundos).

`rpl_semi_sync_source_wait_for_replica_count` ou `rpl_semi_sync_master_wait_for_slave_count` :   Controla o número de confirmações de replica que a fonte deve receber por transação antes de retornar à sessão. O padrão é 1, o que significa que a fonte só espera uma replica para confirmar o recebimento dos eventos da transação.

A variável de sistema `rpl_semi_sync_source_wait_point` ou `rpl_semi_sync_master_wait_point` controla o ponto em que um servidor de origem semisocial espera o reconhecimento da replicação da recepção da transação antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

* `AFTER_SYNC` (padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte espera o reconhecimento da replicação da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte compromete a transação no motor de armazenamento e retorna um resultado ao cliente, que então pode prosseguir.

* `AFTER_COMMIT`: A fonte escreve cada transação em seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte espera o reconhecimento da replica sobre a recepção da transação após o commit. Ao receber o reconhecimento, a fonte retorna um resultado ao cliente, que pode então prosseguir.

As características de replicação desses ambientes diferem da seguinte forma:

* Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo, que é após ter sido reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

Em caso de falha na fonte, todas as transações comprometidas na fonte foram replicadas para a replica (salvo no seu log de relevo). Uma saída inesperada da fonte e a transição para a replica são sem perdas, pois a replica está atualizada. Como mencionado acima, a fonte não deve ser reutilizada após a transição.

* Com `AFTER_COMMIT`, o cliente que emite a transação recebe um status de retorno apenas após o servidor se comprometer com o mecanismo de armazenamento e receber o reconhecimento da replica. Após o compromisso e antes do reconhecimento da replica, outros clientes podem ver a transação comprometida antes do cliente que a comprometeu.

Se algo der errado de tal forma que a réplica não processe a transação, então, em caso de saída inesperada da fonte e failover para a réplica, é possível que esses clientes vejam uma perda de dados em relação ao que viram na fonte.

A partir do MySQL 8.0.23, você pode melhorar o desempenho da replicação semiescronizada ao habilitar as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona blocos compartilhados e evita aquisições de bloqueio desnecessárias. Esses ajustes ajudam à medida que o número de réplicas aumenta, porque a disputa por blocos pode desacelerar o desempenho. Os servidores de origem da replicação semiescronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.

#### 19.4.10.3 Monitoramento da Replicação Semisíncrona

Os plugins para replicação semiesincronizada exibem uma série de variáveis de status que permitem monitorar sua operação. Para verificar os valores atuais das variáveis de status, use `SHOW STATUS`:

```
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

A partir do MySQL 8.0.26, novas versões dos plugins de fonte e replica são fornecidas, que substituem os termos “master” e “slave” por “fonte” e “replica” nas variáveis de sistema e variáveis de status. Se você instalar os novos plugins `rpl_semi_sync_source` e `rpl_semi_sync_replica`, as novas variáveis de sistema e variáveis de status estarão disponíveis, mas as antigas não. Se você instalar os plugins antigos `rpl_semi_sync_master` e `rpl_semi_sync_slave`, as antigas variáveis de sistema e variáveis de status estarão disponíveis, mas as novas não. Você não pode ter ambas as versões nova e antiga do plugin relevante instalada em uma instância.

Todas as variáveis de status `Rpl_semi_sync_xxx` são descritas na Seção 7.1.10, “Variáveis de Status do Servidor”. Alguns exemplos são:

* `Rpl_semi_sync_source_clients` ou `Rpl_semi_sync_master_clients`

O número de réplicas semisíncronas conectadas ao servidor de origem.

* `Rpl_semi_sync_source_status` ou `Rpl_semi_sync_master_status`

Se a replicação semi-sincronizada está atualmente operacional no servidor de origem. O valor é 1 se o plugin foi habilitado e um reconhecimento de compromisso não ocorreu. É 0 se o plugin não estiver habilitado ou se a origem voltou para a replicação assíncrona devido ao tempo de espera de reconhecimento de compromisso.

* `Rpl_semi_sync_source_no_tx` ou `Rpl_semi_sync_master_no_tx`

O número de commits que não foram reconhecidos com sucesso por uma réplica.

* `Rpl_semi_sync_source_yes_tx` ou `Rpl_semi_sync_master_yes_tx`

O número de commits que foram reconhecidos com sucesso por uma réplica.

* `Rpl_semi_sync_replica_status` ou `Rpl_semi_sync_slave_status`

Se a replicação semi-sincronizada está atualmente operacional na replica. Isso é 1 se o plugin tiver sido habilitado e o fio de I/O de replicação (receptor) estiver em execução, caso contrário, 0.

Quando a fonte muda entre a replicação assíncrona ou semi-síncrona devido ao tempo de espera de bloqueio de commit ou à replicação que está recuperando, ela define o valor da variável de status `Rpl_semi_sync_source_status` ou `Rpl_semi_sync_master_status` de forma apropriada. A falha automática da replicação semi-síncrona para a replicação assíncrona na fonte significa que é possível que a variável de sistema `rpl_semi_sync_source_enabled` ou `rpl_semi_sync_master_enabled` tenha um valor de 1 no lado da fonte, mesmo quando a replicação semi-síncrona não está, de fato, operacional no momento. Você pode monitorar a variável de status `Rpl_semi_sync_source_status` ou `Rpl_semi_sync_master_status` para determinar se a fonte está atualmente usando replicação assíncrona ou semi-síncrona.

### 19.4.11 Replicação Atendida

O MySQL suporta a replicação atrasada, de modo que um servidor de replicação executa deliberadamente as transações mais tarde que a fonte, pelo menos por um período de tempo especificado. Esta seção descreve como configurar um atraso de replicação em uma replica e como monitorar o atraso de replicação.

No MySQL 8.0, o método de adiamento da replicação depende de dois tempos de marcação, `immediate_commit_timestamp` e `original_commit_timestamp` (consulte Temporizadores de atraso de replicação). Se todos os servidores na topologia de replicação estiverem executando o MySQL 8.0 ou superior, a replicação adiada é medida usando esses tempos de marcação. Se a fonte imediata ou a réplica não estiver usando esses tempos de marcação, a implementação da replicação adiada do MySQL 5.7 é usada (consulte Replicação adiada). Esta seção descreve a replicação adiada entre servidores que estão usando todos esses tempos de marcação.

O atraso padrão de replicação é de 0 segundos. Use uma declaração `CHANGE REPLICATION SOURCE TO SOURCE_DELAY=N` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO MASTER_DELAY=N` (antes do MySQL 8.0.23) para definir o atraso para *`N`* segundos. Uma transação recebida da fonte não é executada até pelo menos *`N`* segundos depois de seu compromisso na fonte imediata. O atraso ocorre por transação (e não por evento, como nas versões anteriores do MySQL) e o atraso real é imposto apenas em `gtid_log_event` ou `anonymous_gtid_log_event`. Os outros eventos na transação sempre seguem esses eventos sem qualquer tempo de espera imposto sobre eles.

Nota

`START REPLICA` e `STOP REPLICA` entram em vigor imediatamente e ignoram qualquer atraso. [`RESET REPLICA`(reset-replica.html "15.4.2.4 RESET REPLICA Statement") redefiniu o atraso para 0.

A tabela `replication_applier_configuration` do Schema de desempenho contém a coluna `DESIRED_DELAY`, que mostra o atraso configurado usando a opção `SOURCE_DELAY` | `MASTER_DELAY`. A tabela `replication_applier_status` do Schema de desempenho contém a coluna `REMAINING_DELAY`, que mostra o número de segundos de atraso restantes.

A replicação retardada pode ser usada para vários propósitos:

* Para proteger contra erros do usuário na fonte. Com um atraso, você pode reverter uma réplica atrasada para o momento imediatamente antes do erro.

* Para testar como o sistema se comporta quando há um atraso. Por exemplo, em um aplicativo, um atraso pode ser causado por uma carga pesada na replica. No entanto, pode ser difícil gerar esse nível de carga. A replicação atrasada pode simular o atraso sem precisar simular a carga. Também pode ser usado para depurar condições relacionadas a uma replica que está atrasada.

* Para inspecionar como o banco de dados se apresentava no passado, sem precisar recarregar um backup. Por exemplo, configurando uma replica com um atraso de uma semana, se você precisar então ver como o banco de dados se apresentava antes dos últimos dias de desenvolvimento, a replica com atraso pode ser inspecionada.

#### Temporizadores de atraso de replicação

O MySQL 8.0 oferece um novo método para medir o atraso (também referido como atraso de replicação) em topologias de replicação que depende dos seguintes timestamps associados ao GTID de cada transação (em vez de cada evento) escrita no log binário.

* `original_commit_timestamp`: o número de microsegundos desde a época em que a transação foi escrita (comprometida) no log binário da fonte original.

* `immediate_commit_timestamp`: o número de microsegundos desde a época em que a transação foi escrita (comprometida) no log binário da fonte imediata.

A saída do **mysqlbinlog** exibe esses timestamps em dois formatos: microsegundos a partir da época e também no formato `TIMESTAMP`, que é baseado no fuso horário definido pelo usuário para melhor legibilidade. Por exemplo:

```
#170404 10:48:05 server id 1  end_log_pos 233 CRC32 0x016ce647     GTID    last_committed=0
\ sequence_number=1    original_committed_timestamp=1491299285661130    immediate_commit_timestamp=1491299285843771
# original_commit_timestamp=1491299285661130 (2017-04-04 10:48:05.661130 WEST)
# immediate_commit_timestamp=1491299285843771 (2017-04-04 10:48:05.843771 WEST)
 /*!80001 SET @@SESSION.original_commit_timestamp=1491299285661130*//*!*/;
   SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'/*!*/;
# at 233
```

Como regra geral, o `original_commit_timestamp` é sempre o mesmo em todas as réplicas onde a transação é aplicada. Na replicação de origem-replica, o `original_commit_timestamp` de uma transação no log binário da (fonte) original é sempre o mesmo que seu `immediate_commit_timestamp`. No log de relevo da replica, os `original_commit_timestamp` e `immediate_commit_timestamp` da transação são os mesmos que no log binário da fonte; enquanto que em seu próprio log binário, o `immediate_commit_timestamp` da transação corresponde ao momento em que a replica comprometeu a transação.

Em uma configuração de replicação em grupo, quando a fonte original é um membro de um grupo, o `original_commit_timestamp` é gerado quando a transação está pronta para ser comprometida. Em outras palavras, quando ela foi executada na fonte original e seu conjunto de escrita está pronto para ser enviado para todos os membros do grupo para certificação. Quando a fonte original é um servidor externo ao grupo, o `original_commit_timestamp` é preservado. O mesmo `original_commit_timestamp` para uma transação específica é replicado para todos os servidores do grupo e para qualquer réplica externa ao grupo que esteja replicando a partir de um membro. A partir do MySQL 8.0.26, cada destinatário da transação também armazena o tempo de comprometimento local em seu log binário usando `immediate_commit_timestamp`.

Os eventos de alteração, que são exclusivos da Replicação por Grupo, são um caso especial. As transações que contêm esses eventos são geradas por cada membro do grupo, mas compartilham o mesmo GTID (portanto, não são executadas primeiro em uma fonte e depois replicadas para o grupo, mas todos os membros do grupo executam e aplicam a mesma transação). Antes do MySQL 8.0.26, essas transações têm seu `original_commit_timestamp` definido como zero e aparecem dessa forma na saída visível. A partir do MySQL 8.0.26, para uma observabilidade melhorada, os membros do grupo definem valores de marca-passos locais para as transações associadas a eventos de alteração de visão.

#### Retardo de Replicação de Monitoramento

Uma das formas mais comuns de monitorar o atraso (lag) da replicação em versões anteriores do MySQL era confiar no campo `Seconds_Behind_Master` na saída do `SHOW REPLICA STATUS`. No entanto, essa métrica não é adequada quando se usa topologias de replicação mais complexas do que o tradicional esquema fonte-replica, como a Replicação por Grupo. A adição de `immediate_commit_timestamp` e `original_commit_timestamp` ao MySQL 8 fornece um grau muito mais fino de informações sobre o atraso da replicação. O método recomendado para monitorar o atraso da replicação em uma topologia que suporta esses timestamps é usar as seguintes tabelas do Schema de Desempenho.

* `replication_connection_status`: estado atual da conexão com a fonte, fornece informações sobre a última e a transação atual que o fio de conexão foi enfileirado no log de retransmissão.

* `replication_applier_status_by_coordinator`: estado atual do fio de coordenador que apenas exibe informações quando se usa uma replica multithread, fornece informações sobre a última transação armazenada em cache pelo fio de coordenador para a fila de um trabalhador, bem como a transação que está atualmente armazenando em cache.

* `replication_applier_status_by_worker`: estado atual do(s) tópico(s) aplicando as transações recebidas da fonte, fornece informações sobre as transações aplicadas pelo tópico de replicação SQL ou por cada tópico de trabalho ao usar uma replica multithread.

Usando essas tabelas, você pode monitorar informações sobre a última transação processada pelo fio correspondente e a transação que o fio está processando atualmente. Essas informações incluem:

* GTID de uma transação
* `original_commit_timestamp` e `immediate_commit_timestamp` de uma transação, recuperados do log de retransmissão da réplica

* o momento em que um fio começou a processar uma transação; * para a última transação processada, o momento em que o fio a finalizou o processamento

Além das tabelas do Schema de Desempenho, a saída do `SHOW REPLICA STATUS` tem três campos que mostram:

* `SQL_Delay`: Um número inteiro não negativo que indica o atraso de replicação configurado usando `CHANGE REPLICATION SOURCE TO SOURCE_DELAY=N` (a partir do MySQL 8.0.23) ou (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (antes do MySQL 8.0.23), medido em segundos.

* `SQL_Remaining_Delay`: Quando `Replica_SQL_Running_State` é `Waiting until MASTER_DELAY seconds after master executed event`, este campo contém um número inteiro que indica o número de segundos restantes do atraso. Em outros momentos, este campo é `NULL`.

* `Replica_SQL_Running_State`: Uma cadeia que indica o estado do fio SQL (análogo a `Replica_IO_State`). O valor é idêntico ao valor `State` do fio SQL conforme exibido por `SHOW PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement").

Quando o fio de replicação SQL está aguardando o término do atraso antes de executar um evento, `SHOW PROCESSLIST` (show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") exibe seu valor `State` como `Waiting until MASTER_DELAY seconds after master executed event`.