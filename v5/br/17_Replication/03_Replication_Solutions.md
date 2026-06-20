## 16.3 Soluções de Replicação

A replicação pode ser usada em muitos ambientes diferentes para uma variedade de propósitos. Esta seção fornece notas gerais e conselhos sobre o uso da replicação para tipos específicos de soluções.

Para obter informações sobre o uso da replicação em um ambiente de backup, incluindo notas sobre a configuração, o procedimento de backup e os arquivos a serem protegidos, consulte a Seção 16.3.1, “Usando replicação para backups”.

Para obter conselhos e dicas sobre o uso de diferentes motores de armazenamento na fonte e nas réplicas, consulte a Seção 16.3.3, “Usando replicação com diferentes motores de armazenamento de fonte e réplica”.

Usar a replicação como uma solução de expansão requer algumas mudanças na lógica e no funcionamento das aplicações que utilizam a solução. Consulte a Seção 16.3.4, “Usando replicação para expansão”.

Por razões de desempenho ou distribuição de dados, você pode querer replicar diferentes bancos de dados para diferentes réplicas. Consulte a Seção 16.3.5, “Replicando diferentes bancos de dados para diferentes réplicas”

À medida que o número de réplicas aumenta, a carga na fonte pode aumentar e levar a um desempenho reduzido (devido à necessidade de replicar o log binário para cada réplica). Para dicas sobre como melhorar o desempenho da replicação, incluindo o uso de um único servidor secundário como servidor de fonte de replicação, consulte a Seção 16.3.6, “Melhorando o desempenho da replicação”.

Para obter orientações sobre a troca de fontes ou a conversão de réplicas em fontes como parte de uma solução de falha de emergência, consulte a Seção 16.3.7, “Troca de fontes durante a falha de emergência”.

Para garantir a comunicação de replicação, você pode criptografar o canal de comunicação. Para obter instruções passo a passo, consulte a Seção 16.3.8, “Configurando a replicação para usar conexões criptografadas”.

### 16.3.1 Usando replicação para backups

Para usar a replicação como uma solução de backup, replique os dados da fonte para uma replica e, em seguida, faça um backup da replica. A replica pode ser pausada e desligada sem afetar a operação em andamento da fonte, para que você possa produzir um instantâneo eficaz de dados "ativos" que, de outra forma, exigiria que a fonte seja desligada.

Como fazer backup de um banco de dados depende do seu tamanho e se você está fazendo backup apenas dos dados ou dos dados e do estado da replica, para que você possa reconstruir a replica em caso de falha. Portanto, há duas opções:

* Se você está usando a replicação como uma solução para permitir que você faça backup dos dados na fonte, e o tamanho do seu banco de dados não é muito grande, a ferramenta **mysqldump** pode ser adequada. Veja a Seção 16.3.1.1, “Fazendo backup de uma réplica usando mysqldump”.

* Para bancos de dados maiores, onde o **mysqldump** seria impraticável ou ineficiente, você pode fazer backup dos arquivos de dados brutos. Usando a opção de arquivos de dados brutos também significa que você pode fazer backup dos logs binários e de retransmissão que permitem a recriação da replica em caso de falha da replica. Para mais informações, consulte a Seção 16.3.1.2, “Fazer backup de dados brutos de uma replica”.

Outra estratégia de backup, que pode ser usada para servidores de origem ou replicação, é colocar o servidor em estado de leitura somente. O backup é realizado contra o servidor de leitura somente, que é então alterado de volta ao seu estado operacional usual de leitura/escrita. Veja a Seção 16.3.1.3, “Fazendo um backup de uma origem ou replicação tornando-a somente leitura”.

#### 16.3.1.1 Fazer backup de uma réplica usando mysqldump

Usar o **mysqldump** para criar uma cópia de um banco de dados permite que você capture todos os dados do banco de dados em um formato que permita a importação das informações em outra instância do MySQL Server (consulte a Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”). Como o formato das informações são declarações SQL, o arquivo pode ser facilmente distribuído e aplicado a servidores em execução, no caso de você precisar acessar os dados em uma emergência. No entanto, se o tamanho do seu conjunto de dados for muito grande, o **mysqldump** pode ser impraticável.

Ao usar o **mysqldump**, você deve parar a replicação na replica antes de iniciar o processo de dump para garantir que o dump contenha um conjunto consistente de dados:

1. Parar a replica de processar solicitações. Você pode parar a replicação completamente na replica usando **mysqladmin**:

   ```sql
   $> mysqladmin stop-slave
   ```

Como alternativa, você pode parar apenas o thread de replicação SQL para pausar a execução do evento:

   ```sql
   $> mysql -e 'STOP SLAVE SQL_THREAD;'
   ```

Isso permite que a replica continue a receber eventos de mudança de dados do log binário da fonte e os armazene nos logs do relé usando o thread de E/S, mas impede que a replica execute esses eventos e mude seus dados. Em ambientes de replicação ocupados, permitir que o thread de E/S seja executado durante o backup pode acelerar o processo de recuperação quando você reiniciar o thread de SQL de replicação.

2. Execute o **mysqldump** para drenar seus bancos de dados. Você pode drenar todos os bancos de dados ou selecionar os bancos de dados que serão drenados. Por exemplo, para drenar todos os bancos de dados:

   ```sql
   $> mysqldump --all-databases > fulldb.dump
   ```

3. Uma vez que o descarregamento tenha sido concluído, reinicie as operações de replicação:

   ```sql
   $> mysqladmin start-slave
   ```

No exemplo anterior, você pode querer adicionar credenciais de login (nome de usuário, senha) aos comandos e agrupar o processo em um script que você pode executar automaticamente todos os dias.

Se você usar essa abordagem, certifique-se de monitorar o processo de replicação para garantir que o tempo necessário para executar o backup não afete a capacidade da replica de acompanhar os eventos da fonte. Veja a Seção 16.1.7.1, “Verificar o Status da Replicação”. Se a replica não conseguir acompanhar, você pode querer adicionar outra replica e distribuir o processo de backup. Para um exemplo de como configurar esse cenário, veja a Seção 16.3.5, “Replicando Diferentes Bancos de Dados para Diferentes Replicas”.

#### 16.3.1.2 Fazer backup de dados brutos de uma réplica

Para garantir a integridade dos arquivos que são copiados, fazer o backup dos arquivos de dados brutos no seu servidor replica de MySQL deve ocorrer enquanto o servidor replica está desligado. Se o servidor MySQL ainda estiver em execução, as tarefas de segundo plano ainda podem estar atualizando os arquivos do banco de dados, particularmente aqueles que envolvem motores de armazenamento com processos de segundo plano, como `InnoDB`. Com `InnoDB`, esses problemas devem ser resolvidos durante a recuperação em caso de falha, mas, como o servidor replica pode ser desligado durante o processo de backup sem afetar a execução da fonte, faz sentido aproveitar essa capacidade.

Para desligar o servidor e fazer backup dos arquivos:

1. Desative o servidor MySQL replica:

   ```sql
   $> mysqladmin shutdown
   ```

2. Copie os arquivos de dados. Você pode usar qualquer utilitário de cópia ou arquivamento adequado, incluindo **cp**, **tar** ou **WinZip**. Por exemplo, assumindo que o diretório de dados está localizado sob o diretório atual, você pode arquivar todo o diretório da seguinte forma:

   ```sql
   $> tar cf /tmp/dbbackup.tar ./data
   ```

3. Inicie o servidor MySQL novamente. Sob Unix:

   ```sql
   $> mysqld_safe &
   ```

Em Windows:

   ```sql
   C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
   ```

Normalmente, você deve fazer backup de todo o diretório de dados do servidor MySQL replica. Se você deseja ser capaz de restaurar os dados e operar como uma replica (por exemplo, em caso de falha da replica), então, além dos dados da replica, você também deve fazer backup dos arquivos de status da replica, dos repositórios de metadados de replicação e dos arquivos de registro de relevo. Esses arquivos são necessários para retomar a replicação após restaurar os dados da replica.

Se você perder os registros do retransmissor, mas ainda tiver o arquivo `relay-log.info`, pode verificá-lo para determinar até que ponto o thread de replicação SQL foi executado nos logs binários da fonte. Em seguida, pode usar `CHANGE MASTER TO` com as opções `MASTER_LOG_FILE` e `MASTER_LOG_POS` para dizer à replica que re-leia os logs binários a partir desse ponto. Isso exige que os logs binários ainda existam no servidor da fonte.

Se sua replica estiver replicando declarações `LOAD DATA`, você também deve fazer backup de quaisquer arquivos `SQL_LOAD-*` que existam no diretório que a replica usa para esse propósito. A replica precisa desses arquivos para retomar a replicação de quaisquer operações `LOAD DATA` interrompidas. A localização desse diretório é o valor da variável de sistema `slave_load_tmpdir`. Se o servidor não foi iniciado com essa variável definida, a localização do diretório é o valor da variável de sistema `tmpdir`.

#### 16.3.1.3 Fazer uma cópia de segurança de uma fonte ou réplica tornando-a somente de leitura

É possível fazer backup de servidores de origem ou replicação em uma configuração de replicação, adquiriendo um bloqueio de leitura global e manipulando a variável de sistema `read_only` para alterar o estado de leitura somente do servidor que será feito backup:

1. Faça o servidor read-only, para que ele processe apenas recuperações e bloqueie atualizações.

2. Realize o backup.  
3. Volte o servidor ao seu estado normal de leitura/escrita.

Nota

As instruções desta seção colocam o servidor que será protegido em um estado seguro para métodos de backup que obtêm os dados do servidor, como **mysqldump** (consulte Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”). Você não deve tentar usar essas instruções para fazer um backup binário copiando arquivos diretamente, porque o servidor ainda pode ter dados modificados cacheados na memória e não apagados no disco.

As instruções a seguir descrevem como fazer isso para um servidor fonte e para um servidor replica. Para ambos os cenários discutidos aqui, suponha que você tenha a configuração de replicação a seguir:

* Um servidor fonte S1 * Um servidor replicado R1 que tem S1 como sua fonte * Um cliente C1 conectado a S1 * Um cliente C2 conectado a R1

Em qualquer cenário, as declarações para adquirir o bloqueio de leitura global e manipular a variável `read_only` são realizadas no servidor que será protegido e não se propagam para quaisquer réplicas desse servidor.

**Cenário 1: Backup com uma Fonte Apenas de Leitura**

Coloque a fonte S1 em estado de leitura somente executando essas instruções nela:

```sql
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto o S1 estiver em estado de leitura somente, as seguintes propriedades serão verdadeiras:

* Solicitações de atualizações enviadas de C1 para o bloco S1 porque o servidor está em modo de leitura somente.

* As solicitações de resultados de consulta enviadas pelo C1 para o S1 têm sucesso.
* Fazer um backup no S1 é seguro.
* Fazer um backup no R1 não é seguro. Esse servidor ainda está em execução e pode estar processando os registros binários ou solicitações de atualização vindas do cliente C2.

Embora o S1 seja apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no S1 ser concluída, restaure o S1 ao seu estado operacional normal, executando as seguintes instruções:

```sql
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Embora realizar o backup no S1 seja seguro (no que diz respeito ao backup), não é ótimo em termos de desempenho, pois os clientes do S1 são bloqueados para executar atualizações.

Essa estratégia se aplica ao fazer backup de um servidor fonte em uma configuração de replicação, mas também pode ser usada para um único servidor em uma configuração sem replicação.

**Cenário 2: Backup com uma Replicação Apenas de Leitura**

Coloque a réplica R1 em estado de leitura somente executando essas instruções nela:

```sql
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto o R1 estiver em estado de leitura somente, as seguintes propriedades serão verdadeiras:

* A fonte S1 continua em operação, portanto, fazer um backup na fonte não é seguro.

* A réplica R1 está parada, portanto, fazer um backup na réplica R1 é seguro.

Essas propriedades fornecem a base para um cenário de backup popular: ter uma replica ocupada realizando um backup por um tempo não é um problema, pois isso não afeta toda a rede, e o sistema ainda está em execução durante o backup. Em particular, os clientes ainda podem realizar atualizações no servidor de origem, que permanece não afetado pela atividade de backup na replica.

Embora o R1 seja apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no R1 ser concluída, restaure o R1 ao seu estado operacional normal, executando as seguintes instruções:

```sql
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Depois que a réplica é restaurada ao funcionamento normal, ela se sincroniza novamente com a fonte, recuperando quaisquer atualizações pendentes do log binário da fonte.

### 16.3.2 Tratamento de um Parada Inesperada de uma Replicação

Para que a replicação seja resiliente a interrupções inesperadas do servidor (às vezes descrita como segura em caso de falha), é necessário que a replica possa recuperar seu estado antes de ser interrompida. Esta seção descreve o impacto de uma interrupção inesperada de uma replica durante a replicação e como configurar uma replica para ter a melhor chance de recuperação e continuar a replicação.

Após uma parada inesperada de uma réplica, ao reiniciar, o thread de replicação SQL deve recuperar informações sobre quais transações já foram executadas. As informações necessárias para a recuperação são armazenadas no repositório de metadados do aplicador da réplica. Em versões mais antigas do MySQL Server, esse repositório só poderia ser criado como um arquivo no diretório de dados que foi atualizado após a transação ter sido aplicada. No MySQL 5.7, você pode, em vez disso, usar uma tabela `InnoDB` chamada `mysql.slave_relay_log_info` para armazenar o repositório de metadados do aplicador. Como uma tabela, as atualizações no repositório de metadados do aplicador são comprometidas juntamente com as transações, o que significa que as informações de progresso da réplica registradas nesse repositório estão sempre consistentes com o que foi aplicado ao banco de dados, mesmo em caso de uma parada inesperada do servidor. Para configurar o MySQL 5.7 para armazenar o repositório de metadados do aplicador como uma tabela `InnoDB`, defina a variável de sistema `relay_log_info_repository` para `TABLE`. Para obter mais informações sobre o repositório de metadados do aplicador, consulte a Seção 16.2.4, “Repositórios de Log de Relógio e Metadados de Replicação”.

O processo de recuperação pelo qual uma replica se recupera de uma parada inesperada varia de acordo com a configuração da replica. Os detalhes do processo de recuperação são influenciados pelo método de replicação escolhido, se a replica é monofila ou multifila, e pelo ajuste das variáveis relevantes do sistema. O objetivo geral do processo de recuperação é identificar quais transações já haviam sido aplicadas no banco de dados da replica antes da parada inesperada ocorrer e recuperar e aplicar as transações que a replica perdeu após a parada inesperada.

* Para a replicação baseada em GTID, o processo de recuperação precisa dos GTIDs das transações que já foram recebidas ou comprometidas pela replica. As transações ausentes podem ser recuperadas da fonte usando o autoposicionamento de GTID, que compara automaticamente as transações da fonte com as transações da replica e identifica as transações ausentes.

* Para a replicação com base na posição do arquivo, o processo de recuperação precisa de um thread de replicação SQL preciso (aplicador) que mostre a última transação aplicada na réplica. Com base nessa posição, o thread de I/O de replicação (receptor) recupera do log binário da fonte todas as transações que devem ser aplicadas na réplica a partir desse ponto.

Usar a replicação baseada em GTID facilita a configuração da replicação para ser resiliente a interrupções inesperadas. O autoposicionamento do GTID significa que a replica pode identificar e recuperar de forma confiável as transações ausentes, mesmo que haja lacunas na sequência de transações aplicadas.

As informações a seguir fornecem combinações de configurações apropriadas para diferentes tipos de réplica, garantindo a recuperação na medida em que isso esteja sob controle da replicação.

Importante

Alguns fatores que não estão sob controle da replicação podem ter um impacto no processo de recuperação da replicação e no estado geral da replicação após o processo de recuperação. Em particular, as configurações que influenciam o processo de recuperação para motores de armazenamento individuais podem resultar na perda de transações no caso de uma parada inesperada de uma replica, e, portanto, indisponíveis para o processo de recuperação da replicação. A configuração `innodb_flush_log_at_trx_commit=1` mencionada na lista abaixo é uma configuração chave para uma configuração de replicação que usa `InnoDB` com transações. No entanto, outras configurações específicas de `InnoDB` ou para outros motores de armazenamento, especialmente as relacionadas ao esvaziamento ou sincronização, também podem ter um impacto. Sempre verifique e aplique as recomendações feitas pelos motores de armazenamento escolhidos sobre configurações seguras em caso de falha.

A combinação de configurações a seguir em uma réplica é a mais resistente a interrupções inesperadas:

* Quando a replicação baseada em GTID está em uso (`gtid_mode=ON`), defina `MASTER_AUTO_POSITION=1`, que ativa a autoposicionamento do GTID para a conexão com a fonte para identificar e recuperar automaticamente as transações ausentes. Esta opção é definida usando uma declaração `CHANGE MASTER TO`. Se a replica tiver vários canais de replicação, é necessário definir esta opção individualmente para cada canal. Para obter detalhes sobre como o autoposicionamento do GTID funciona, consulte a Seção 16.1.3.3, “Autoposicionamento do GTID”. Quando a replicação baseada em posição de arquivo está em uso, `MASTER_AUTO_POSITION=1` não é usada, e, em vez disso, a posição do log binário ou a posição do log de releio é usada para controlar onde a replicação começa.

* Defina `sync_relay_log=1`, que instrui a thread de I/O de replicação a sincronizar o log de relé com o disco após cada transação recebida ser escrita nele. Isso significa que o registro da replica da posição atual lida do log binário da fonte (no repositório de metadados da fonte) nunca está à frente do registro de transações salvas no log de relé. Note que, embora essa configuração seja a mais segura, também é a mais lenta devido ao número de escritas no disco envolvidas. Com `sync_relay_log > 1`, ou `sync_relay_log=0` (onde a sincronização é feita pelo sistema operacional), no caso de uma parada inesperada de uma replica, pode haver transações comprometidas que não foram sincronizadas com o disco. Tais transações podem fazer com que o processo de recuperação falhe se a replica que está recuperando, com base nas informações que ela tem no log de relé como última sincronizada com o disco, tente recuperar e aplicar as transações novamente em vez de ignorá-las. Definir `sync_relay_log=1` é particularmente importante para uma replica multi-threaded, onde o processo de recuperação falha se as lacunas na sequência de transações não podem ser preenchidas usando as informações no log de relé. Para uma replica de thread único, o processo de recuperação só precisa usar o log de relé se as informações relevantes não estiverem disponíveis no repositório de metadados do aplicável.

* Defina `innodb_flush_log_at_trx_commit=1`, que sincroniza os registros `InnoDB` no disco antes de cada transação ser confirmada. Esta configuração, que é a padrão, garante que as tabelas `InnoDB` e os registros `InnoDB` sejam salvos no disco, para que não haja mais a necessidade de informações no registro de relevo em relação à transação. Combinada com a configuração `sync_relay_log=1`, esta configuração assegura ainda que o conteúdo das tabelas `InnoDB` e os registros `InnoDB` esteja consistente com o conteúdo do registro de relevo em todos os momentos, para que a purga dos arquivos de registro de relevo não cause lacunas não preenchidas no histórico de transações da replica, no caso de uma parada inesperada.

* Defina `relay_log_info_repository = TABLE`, que armazena a posição do thread de replicação do SQL na tabela `InnoDB` `mysql.slave_relay_log_info`, e a atualize juntamente com o commit da transação para garantir um registro sempre preciso. Esta configuração não é a padrão no MySQL 5.7. Se a configuração padrão `FILE` for usada, as informações são armazenadas em um arquivo no diretório de dados que é atualizado após a transação ter sido aplicada. Isso cria um risco de perda de sincronia com a fonte, dependendo da fase em que a replica se detém no processamento de uma transação, ou até mesmo da corrupção do próprio arquivo. Com a configuração `relay_log_info_repository = FILE`, a recuperação não é garantida.

* Defina `relay_log_recovery = ON`, que permite a recuperação automática do log de relé imediatamente após a inicialização do servidor. Esta variável global tem como padrão `OFF` e é somente de leitura durante a execução, mas você pode defini-la como `ON` com a opção `--relay-log-recovery` na inicialização da replica após uma parada inesperada de uma replica. Observe que essa configuração ignora os arquivos de log de relé existentes, caso estejam corrompidos ou inconsistentes. O processo de recuperação do log de relé inicia um novo arquivo de log de relé e recupera as transações da fonte, começando na posição do thread SQL de replicação registrada no repositório de metadados do aplicador. Os arquivos de log de relé anteriores são removidos ao longo do tempo pelo mecanismo de purga normal da replica.

Para uma replica multithread, a partir do MySQL 5.7.13, a definição de `relay_log_recovery = ON` automaticamente lida com quaisquer inconsistências e lacunas na sequência de transações que foram executadas a partir do log de relevo. Essas lacunas podem ocorrer quando a replicação baseada em posição de arquivo está em uso. (Para mais detalhes, consulte a Seção 16.4.1.32, “Replicação e Inconsistências de Transações”.) O processo de recuperação do log de relevo lida com as lacunas usando o mesmo método que a declaração `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` faria. Quando a replica atinge um estado consistente sem lacunas, o processo de recuperação do log de relevo continua a buscar transações adicionais a partir da fonte, começando na posição do thread de SQL de replicação. Em versões do MySQL anteriores ao MySQL 5.7.13, esse processo não era automático e exigia iniciar o servidor com `relay_log_recovery = OFF`, iniciar a replica com `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` para corrigir quaisquer inconsistências de transação, e então reiniciar a replica com `relay_log_recovery = ON`. Quando a replicação baseada em GTID está em uso, a partir do MySQL 5.7.28, uma replica multithread verifica primeiro se `MASTER_AUTO_POSITION` está definido para `ON`, e se estiver, omite o passo de calcular as transações que devem ser ignoradas ou não ignoradas, para que os logs de relevo antigos não sejam necessários para o processo de recuperação.

### 16.3.3 Usando replicação com diferentes motores de armazenamento de origem e réplica

Não importa para o processo de replicação se a tabela de origem na origem e a tabela replicada na replica utilizam tipos diferentes de motor. De fato, a variável de sistema `default_storage_engine` não é replicada.

Isso oferece uma série de benefícios no processo de replicação, pois você pode aproveitar diferentes tipos de motores para diferentes cenários de replicação. Por exemplo, em um cenário típico de expansão em escala (veja a Seção 16.3.4, “Usando replicação para expansão em escala”), você deseja usar as tabelas `InnoDB` na fonte para aproveitar a funcionalidade transacional, mas use `MyISAM` nas réplicas onde o suporte de transação não é necessário, porque os dados são apenas lidos. Ao usar replicação em um ambiente de registro de dados, você pode querer usar o motor de armazenamento `Archive` na réplica.

Configurar diferentes motores na fonte e na replica depende de como você configura o processo de replicação inicial:

* Se você usou o **mysqldump** para criar o snapshot do banco de dados na sua fonte, você pode editar o texto do arquivo de dump para alterar o tipo de motor usado em cada tabela.

Outra alternativa para o **mysqldump** é desabilitar os tipos de motor que você não deseja usar na replica antes de usar o dump para construir os dados na replica. Por exemplo, você pode adicionar a opção `--skip-federated` na sua replica para desabilitar o motor `FEDERATED`. Se um motor específico não existir para uma tabela ser criada, o MySQL usa o tipo de motor padrão, geralmente `MyISAM`. (Isso requer que o modo SQL `NO_ENGINE_SUBSTITUTION` não esteja habilitado.) Se você deseja desabilitar motores adicionais dessa maneira, pode considerar a construção de um binário especial que será usado na replica e que suporte apenas os motores que você deseja.

* Se você estiver usando arquivos de dados brutos (um backup binário) para configurar a replica, não poderá alterar o formato inicial da tabela. Em vez disso, use `ALTER TABLE` para alterar os tipos de tabela após a replica ter sido iniciada.

* Para novos conjuntos de replicação de fonte/replica onde atualmente não existem tabelas na fonte, evite especificar o tipo de motor ao criar novas tabelas.

Se você já está executando uma solução de replicação e deseja converter suas tabelas existentes para outro tipo de motor, siga estes passos:

1. Parar a replicação da replicação de atualizações:

   ```sql
   mysql> STOP SLAVE;
   ```

Isso permite que você mude os tipos de motor sem interrupções.

2. Execute um `ALTER TABLE ... ENGINE='engine_type'` para cada tabela que será alterada.

3. Comece o processo de replicação novamente:

   ```sql
   mysql> START SLAVE;
   ```

Embora a variável `default_storage_engine` não seja replicada, esteja ciente de que as declarações `CREATE TABLE` e `ALTER TABLE` que incluem a especificação do motor são corretamente replicadas para a réplica. Por exemplo, se você tiver uma tabela CSV e executar:

```sql
mysql> ALTER TABLE csvtable Engine='MyISAM';
```

A declaração anterior é replicada para a replica e o tipo de motor na replica é convertido para `MyISAM`, mesmo que você tenha alterado anteriormente o tipo de tabela na replica para um motor diferente do CSV. Se você deseja manter as diferenças de motor na fonte e na replica, você deve ter cuidado ao usar a variável `default_storage_engine` na fonte ao criar uma nova tabela. Por exemplo, em vez de:

```sql
mysql> CREATE TABLE tablea (columna int) Engine=MyISAM;
```

Utilize este formato:

```sql
mysql> SET default_storage_engine=MyISAM;
mysql> CREATE TABLE tablea (columna int);
```

Quando replicado, a variável `default_storage_engine` será ignorada, e a declaração `CREATE TABLE` será executada na réplica usando o motor padrão da réplica.

### 16.3.4 Usando replicação para expansão em escala

Você pode usar a replicação como uma solução de expansão; ou seja, onde você deseja dividir a carga das consultas do banco de dados em vários servidores de banco de dados, dentro de algumas limitações razoáveis.

Como a replicação funciona a partir da distribuição de uma fonte para uma ou mais réplicas, usar replicação para expansão é mais eficaz em um ambiente onde você tem um número elevado de leituras e um número baixo de escritas/atualizações. A maioria dos sites se encaixa nessa categoria, onde os usuários navegam pelo site, leem artigos, postagens ou visualizam produtos. As atualizações ocorrem apenas durante o gerenciamento de sessão ou ao fazer uma compra ou adicionar um comentário/mensagem a um fórum.

A replicação nessa situação permite que você distribua as leituras entre as réplicas, ao mesmo tempo em que permite que seus servidores da web se comuniquem com a fonte quando for necessário um registro. Você pode ver um layout de replicação de amostra para esse cenário na Figura 16.1, “Usando replicação para melhorar o desempenho durante a escala de saída”.

**Figura 16.1 Usando replicação para melhorar o desempenho durante a expansão**

![Incoming requests from clients are directed to a load balancer, which distributes client data among a number of web clients. Writes made by web clients are directed to a single MySQL source server, and reads made by web clients are directed to one of three MySQL replica servers. Replication takes place from the MySQL source server to the three MySQL replica servers.](images/scaleout.png)

Se a parte do seu código que é responsável pelo acesso ao banco de dados tiver sido adequadamente abstraída/modularizada, converter isso para executar com um conjunto replicado deve ser muito suave e fácil. Altere a implementação do seu acesso ao banco de dados para enviar todas as escritas para a fonte e para enviar leituras para a fonte ou uma réplica. Se o seu código não tiver esse nível de abstração, configurar um sistema replicado lhe dá a oportunidade e a motivação para limpá-lo. Comece criando uma biblioteca ou módulo de revestimento que implemente as seguintes funções:

* `safe_writer_connect()`
* `safe_reader_connect()`
* `safe_reader_statement()`
* `safe_writer_statement()`

`safe_` em cada nome de função significa que a função cuida de lidar com todas as condições de erro. Você pode usar diferentes nomes para as funções. O importante é ter uma interface unificada para conectar para leituras, conectar para escritas, fazer uma leitura e fazer uma escrita.

Em seguida, converta seu código de cliente para usar a biblioteca de wrapper. Isso pode ser um processo doloroso e assustador no início, mas compensa a longo prazo. Todas as aplicações que usam a abordagem descrita acima podem aproveitar uma configuração de fonte/replica, mesmo uma que envolva múltiplas réplicas. O código é muito mais fácil de manter, e adicionar opções de solução de problemas é trivial. Você precisa modificar apenas uma ou duas funções (por exemplo, para registrar quanto tempo cada declaração levou ou qual declaração entre as emitidas deu um erro).

Se você escreveu um monte de código, talvez queira automatizar a tarefa de conversão usando o utilitário **replace** que vem com as distribuições padrão do MySQL, ou escreva seu próprio script de conversão. Idealmente, seu código usa convenções consistentes de estilo de programação. Se não, então você provavelmente está melhor escrevendo-o novamente, ou pelo menos revisando e regulando manualmente para usar um estilo consistente.

### 16.3.5 Replicação de diferentes bancos de dados em diferentes réplicas

Pode haver situações em que você tenha uma única fonte e queira replicar diferentes bancos de dados para diferentes réplicas. Por exemplo, você pode querer distribuir diferentes dados de vendas para diferentes departamentos para ajudar a espalhar a carga durante a análise de dados. Uma amostra desse layout é mostrada na Figura 16.2, “Replicando bancos de dados para réplicas separadas”.

**Figura 16.2 Replicação de bancos de dados para separar réplicas**

![The MySQL source has three databases, databaseA, databaseB, and databaseC. databaseA is replicated only to MySQL Replica 1, databaseB is replicated only to MySQL Replica 2, and databaseC is replicated only to MySQL Replica 3.](images/multi-db.png)

Você pode alcançar essa separação configurando a fonte e as réplicas como normais e, em seguida, limitando as declarações do log binário que cada réplica processa, usando a opção de configuração `--replicate-wild-do-table` em cada réplica.

Importante

Você *não* deve usar `--replicate-do-db` para esse propósito ao usar replicação baseada em declarações, pois a replicação baseada em declarações faz com que os efeitos dessa opção variem de acordo com o banco de dados que está atualmente selecionado. Isso também se aplica à replicação de formato misto, pois isso permite que algumas atualizações sejam replicadas usando o formato baseado em declarações.

No entanto, deve ser seguro usar `--replicate-do-db` para esse propósito se você estiver usando apenas replicação baseada em string, uma vez que, neste caso, o banco de dados atualmente selecionado não afeta o funcionamento da opção.

Por exemplo, para suportar a separação conforme mostrado na Figura 16.2, “Replicando bancos de dados para separar réplicas”, você deve configurar cada réplica da seguinte forma, antes de executar `START SLAVE`:

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

### 16.3.6 Melhorando o desempenho da replicação

À medida que o número de réplicas que se conectam a uma fonte aumenta, a carga, embora mínima, também aumenta, pois cada réplica usa uma conexão de cliente com a fonte. Além disso, como cada réplica deve receber uma cópia completa do log binário da fonte, a carga da rede na fonte também pode aumentar e criar um gargalo.

Se você estiver usando um grande número de réplicas conectadas a uma fonte e essa fonte também estiver ocupada processando solicitações (por exemplo, como parte de uma solução de expansão), talvez queira melhorar o desempenho do processo de replicação.

Uma maneira de melhorar o desempenho do processo de replicação é criar uma estrutura de replicação mais profunda que permita que a fonte se replique apenas em uma replica, e que as demais réplicas se conectem a essa replica primária para atender às suas necessidades de replicação individuais. Uma amostra dessa estrutura é mostrada na Figura 16.3, “Usando uma Fonte de Replicação Adicionada para Melhorar o Desempenho”.

**Figura 16.3 Usando uma fonte de replicação adicional para melhorar o desempenho**

![The server MySQL Source 1 replicates to the server MySQL Source 2, which in turn replicates to the servers MySQL Replica 1, MySQL Replica 2, and MySQL Replica 3.](images/subsource-performance.png)

Para que isso funcione, você deve configurar as instâncias do MySQL da seguinte forma:

* A fonte 1 é a principal fonte onde todas as alterações e atualizações são escritas no banco de dados. O registro binário deve ser habilitado nesta máquina.

* A Fonte 2 é a réplica da Fonte 1 que fornece a funcionalidade de replicação para o restante das réplicas na estrutura de replicação. A Fonte 2 é a única máquina permitida para se conectar à Fonte 1. A Fonte 2 também tem o registro binário habilitado e a variável de sistema `log_slave_updates` habilitada para que as instruções de replicação da Fonte 1 também sejam escritas no log binário da Fonte 2, para que possam então ser replicadas para as verdadeiras réplicas.

* A Replicação 1, a Replicação 2 e a Replicação 3 atuam como réplicas da Fonte 2 e replicam as informações da Fonte 2, que na verdade consiste nos upgrades registrados na Fonte 1.

A solução acima reduz a carga do cliente e a carga da interface de rede na fonte primária, o que deve melhorar o desempenho geral da fonte primária quando usada como uma solução de banco de dados direta.

Se suas réplicas estiverem tendo dificuldades para acompanhar o processo de replicação na fonte, há várias opções disponíveis:

* Se possível, coloque os registros do relé e os arquivos de dados em unidades físicas diferentes. Para fazer isso, defina a variável de sistema `relay_log` para especificar a localização do registro do relé.

* Se as réplicas forem significativamente mais lentas que a fonte, você pode querer dividir a responsabilidade pela replicação de diferentes bancos de dados entre diferentes réplicas. Veja a Seção 16.3.5, “Replicando diferentes bancos de dados em diferentes réplicas”.

* Se a sua fonte faz uso de transações e você não se preocupa com o suporte de transações em suas réplicas, use `MyISAM` ou outro motor não transacional nas réplicas. Veja a Seção 16.3.3, “Usando Replicação com Diferentes Motores de Armazenamento de Fonte e Replicação”.

* Se suas réplicas não estiverem atuando como fontes e você tiver uma solução potencial em vigor para garantir que possa recuperar uma fonte em caso de falha, então você pode desabilitar a variável de sistema `log_slave_updates` nas réplicas. Isso impede que réplicas "têmidas" também registrem eventos que executaram em seu próprio log binário.

### 16.3.7 Mudança de fontes durante o failover

Você pode dizer a uma replica para mudar para uma nova fonte usando a declaração `CHANGE MASTER TO`. A replica não verifica se os bancos de dados na fonte são compatíveis com os da replica; ela simplesmente começa a ler e executar eventos a partir das coordenadas especificadas no log binário da nova fonte. Em uma situação de failover, todos os servidores do grupo estão, tipicamente, executando os mesmos eventos a partir do mesmo arquivo de log binário, então mudar a fonte dos eventos não deve afetar a estrutura ou integridade do banco de dados, desde que você exerça cuidado ao fazer a mudança.

As réplicas devem ser executadas com o registro binário habilitado (a opção `--log-bin`), que é a opção padrão. Se você não está usando GTIDs para replicação, então as réplicas também devem ser executadas com `--log-slave-updates=OFF` (o registro de atualizações da réplica é a opção padrão). Dessa forma, a réplica está pronta para se tornar uma fonte sem reiniciar a réplica `mysqld`. Suponha que você tenha a estrutura mostrada na Figura 16.4, “Redundância Usando Replicação, Estrutura Inicial”.

**Figura 16.4 Redundância usando replicação, estrutura inicial**

![Two web clients direct both database reads and database writes to a single MySQL source server. The MySQL source server replicates to Replica 1, Replica 2, and Replica 3.](images/redundancy-before.png)

Neste diagrama, o `Source` contém o banco de dados fonte, os hosts do `Replica*` são réplicas e as máquinas do `Web Client` estão emitindo leituras e escritas no banco de dados. Os clientes da web que emitem apenas leituras (e normalmente estariam conectados às réplicas) não são mostrados, pois não precisam alternar para um novo servidor em caso de falha. Para um exemplo mais detalhado de uma estrutura de replicação de escala de leitura/escrita, consulte a Seção 16.3.4, “Usando Replicação para Escala de Saída”.

Cada réplica do MySQL (`Replica 1`, `Replica 2` e `Replica 3`) é uma réplica que funciona com registro binário habilitado e com `--log-slave-updates=OFF`. Como as atualizações recebidas por uma réplica da fonte não são escritas no registro binário quando `--log-slave-updates=OFF` é especificado, o registro binário em cada réplica é inicialmente vazio. Se, por algum motivo, `Source` se tornar indisponível, você pode escolher uma das réplicas para se tornar a nova fonte. Por exemplo, se você escolher `Replica 1`, todos os `Web Clients` devem ser redirecionados para `Replica 1`, que escreve as atualizações em seu registro binário. `Replica 2` e `Replica 3` devem então replicar a partir de `Replica 1`.

A razão para executar a réplica com `--log-slave-updates=OFF` é evitar que as réplicas recebam atualizações duas vezes, caso você cause uma das réplicas a se tornar a nova fonte. Se `Replica 1` tiver `--log-slave-updates` habilitado, que é o padrão, ele escreve quaisquer atualizações que recebe de `Source` em seu próprio log binário. Isso significa que, quando `Replica 2` muda de `Source` para `Replica 1` como sua fonte, ele pode receber atualizações de `Replica 1` que já recebeu de `Source`.

Certifique-se de que todas as réplicas tenham processado todas as declarações em seu log de relevo. Em cada réplica, emita `STOP SLAVE IO_THREAD`, em seguida, verifique a saída de `SHOW PROCESSLIST` até que veja `Has read all relay log`. Quando isso for verdadeiro para todas as réplicas, elas podem ser reconfiguradas para a nova configuração. Na réplica `Replica 1` que está sendo promovida para se tornar a fonte, emita `STOP SLAVE` e `RESET MASTER`.

Nas outras réplicas `Replica 2` e `Replica 3`, use `STOP SLAVE` e `CHANGE MASTER TO MASTER_HOST='Replica1'` (onde `'Replica1'` representa o nome real do host de `Replica 1`). Para usar `CHANGE MASTER TO`, adicione todas as informações sobre como se conectar a `Replica 1` a partir de `Replica 2` ou `Replica 3` (*`user`*, *`password`*, *`port`*). Ao emitir a declaração neste cenário, não há necessidade de especificar o nome do arquivo de log binário de `Replica 1` ou a posição de log para leitura, uma vez que o primeiro arquivo de log binário e a posição 4 são os padrões. Por fim, execute `START SLAVE` em `Replica 2` e `Replica 3`.

Uma vez que o novo conjunto de configuração de replicação esteja em vigor, você precisa dizer a cada `Web Client` para direcionar suas declarações para `Replica 1`. A partir desse ponto em diante, todas as atualizações enviadas por `Web Client` para `Replica 1` são escritas no log binário de `Replica 1`, que então contém todas as atualizações enviadas para `Replica 1` desde que `Source` deixou de estar disponível.

A estrutura do servidor resultante é mostrada na Figura 16.5, "Redundância usando replicação, após falha na fonte".

**Figura 16.5 Redundância usando replicação após falha na fonte**

![The MySQL source server has failed, and is no longer connected into the replication topology. The two web clients now direct both database reads and database writes to Replica 1, which is the new source. Replica 1 replicates to Replica 2 and Replica 3.](images/redundancy-after.png)

Quando o `Source` estiver disponível novamente, você deve torná-lo uma réplica do `Replica 1`. Para fazer isso, em `Source`, emita a mesma declaração `CHANGE MASTER TO` que foi emitida em `Replica 2` e `Replica 3` anteriormente. O `Source` então se torna uma réplica do `Replica 1` e coleta os `Web Client` que ele perdeu enquanto estava offline.

Para tornar `Source` uma fonte novamente, use o procedimento anterior como se `Replica 1` não estivesse disponível e `Source` fosse a nova fonte. Durante este procedimento, não se esqueça de executar `RESET MASTER` em `Source` antes de fazer as réplicas de `Replica 1`, `Replica 2` e `Replica 3` de `Source`. Se não fizer isso, as réplicas podem pegar escritas obsoletas dos aplicativos do `Web Client` que datam de antes do ponto em que `Source` se tornou indisponível.

Você deve estar ciente de que não há sincronização entre as réplicas, mesmo quando elas compartilham a mesma fonte, e, portanto, algumas réplicas podem estar consideravelmente à frente das outras. Isso significa que, em alguns casos, o procedimento descrito no exemplo anterior pode não funcionar conforme o esperado. Na prática, no entanto, os registros de relevo em todas as réplicas devem estar relativamente próximos uns dos outros.

Uma maneira de manter as aplicações informadas sobre a localização da fonte é ter uma entrada de DNS dinâmica para o host da fonte. Com `BIND`, você pode usar o **nsupdate** para atualizar o DNS dinamicamente.

### 16.3.8 Configurando a Replicação para Usar Conexões Encriptadas

Para usar uma conexão criptografada para a transferência do log binário necessário durante a replicação, tanto o servidor de origem quanto o servidor de replicação devem suportar conexões de rede criptografadas. Se qualquer um dos servidores não suportar conexões criptografadas (porque não foi compilado ou configurado para elas), a replicação através de uma conexão criptografada não é possível.

Configurar conexões criptografadas para replicação é semelhante a fazer isso para conexões cliente/servidor. Você deve obter (ou criar) um certificado de segurança adequado que você pode usar na fonte e um certificado semelhante (da mesma autoridade de certificação) em cada replica. Você também deve obter arquivos de chave adequados.

Para obter mais informações sobre a configuração de um servidor e um cliente para conexões criptografadas, consulte a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Para habilitar conexões criptografadas na fonte, você deve criar ou obter os arquivos de certificado e chave adequados, e, em seguida, adicionar os seguintes parâmetros de configuração à configuração da fonte dentro da seção `[mysqld]` do arquivo `my.cnf` da fonte, alterando os nomes dos arquivos conforme necessário:

```sql
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Os caminhos para os arquivos podem ser relativos ou absolutos; recomendamos que você sempre use caminhos completos para esse propósito.

Os parâmetros de configuração são os seguintes:

* `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificado da CA.)

* `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

* `ssl_key`: O nome do caminho do arquivo da chave privada do servidor.

Para habilitar conexões criptografadas na replica, use a declaração `CHANGE MASTER TO`.

* Para nomear os arquivos de certificado e chave privada SSL da réplica usando `CHANGE MASTER TO`, adicione as opções apropriadas `MASTER_SSL_xxx`, como este:

  ```sql
      -> MASTER_SSL_CA = 'ca_file_name',
      -> MASTER_SSL_CAPATH = 'ca_directory_name',
      -> MASTER_SSL_CERT = 'cert_file_name',
      -> MASTER_SSL_KEY = 'key_file_name',
  ```

Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de comando para conexões criptografadas. Para que essas opções tenham efeito, o `MASTER_SSL=1` também deve ser definido. Para uma conexão de replicação, especificar um valor para qualquer uma das opções `MASTER_SSL_CA` ou `MASTER_SSL_CAPATH` corresponde a definir `--ssl-mode=VERIFY_CA`. A tentativa de conexão só terá sucesso se um certificado válido da Autoridade de Certificação (CA) for encontrado usando as informações especificadas.

* Para ativar a verificação de identidade de nome de host, adicione a opção `MASTER_SSL_VERIFY_SERVER_CERT`:

  ```sql
      -> MASTER_SSL_VERIFY_SERVER_CERT=1,
  ```

Esta opção corresponde à opção `--ssl-verify-server-cert`, que é descontinuada a partir do MySQL 5.7.11 e removida no MySQL 8.0. Para uma conexão de replicação, especificar `MASTER_SSL_VERIFY_SERVER_CERT=1` corresponde a definir `--ssl-mode=VERIFY_IDENTITY`, conforme descrito nas Opções de comando para conexões criptografadas. Para que esta opção tenha efeito, `MASTER_SSL=1` também deve ser definido. A verificação da identidade do nome do host não funciona com certificados autoassinados.

* Para ativar as verificações da lista de revogação de certificados (CRL), adicione a opção `MASTER_SSL_CRL` ou `MASTER_SSL_CRLPATH`, conforme mostrado aqui:

  ```sql
      -> MASTER_SSL_CRL = 'crl_file_name',
      -> MASTER_SSL_CRLPATH = 'crl_directory_name',
  ```

Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de comando para conexões criptografadas. Se não forem especificadas, nenhuma verificação de CRL será realizada.

* Para especificar listas de cifra e protocolos de criptografia permitidos pela réplica para a conexão de replicação, adicione as opções `MASTER_SSL_CIPHER` e `MASTER_TLS_VERSION`, como este:

  ```sql
      -> MASTER_SSL_CIPHER = 'cipher_list',
      -> MASTER_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

A opção `MASTER_SSL_CIPHER` especifica a lista de cifra permitida pela réplica para a conexão de replicação, com um ou mais nomes de cifra separados por colchetes. A opção `MASTER_TLS_VERSION` especifica os protocolos de criptografia permitidos pela réplica para a conexão de replicação. O formato é semelhante ao da variável de sistema `tls_version`, com uma ou mais versões de protocolo separadas por vírgula. Os protocolos e cifras que você pode usar nessas listas dependem da biblioteca SSL usada para compilar o MySQL. Para informações sobre os formatos e os valores permitidos, consulte a Seção 6.3.2, “Protocolos e cifras de conexão TLS criptografada”.

* Após as informações de origem terem sido atualizadas, inicie o processo de replicação na réplica, da seguinte forma:

  ```sql
  mysql> START SLAVE;
  ```

Você pode usar a declaração `SHOW SLAVE STATUS` para confirmar que uma conexão criptografada foi estabelecida com sucesso.

* Exigir conexões criptografadas na replica não garante que a fonte exija conexões criptografadas das réplicas. Se você deseja garantir que a fonte aceite apenas réplicas que se conectem usando conexões criptografadas, crie uma conta de usuário de replicação na fonte usando a opção `REQUIRE SSL`, e, em seguida, conceda ao usuário o privilégio `REPLICATION SLAVE`. Por exemplo:

  ```sql
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

Se você tiver uma conta de usuário de replicação existente na fonte, pode adicionar `REQUIRE SSL` a ela com esta declaração:

  ```sql
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```

### 16.3.9 Replicação semiesincronizada

Além da replicação assíncrona integrada, o MySQL 5.7 suporta uma interface para replicação semi-síncrona que é implementada por plugins. Esta seção discute o que é a replicação semi-síncrona e como ela funciona. As seções seguintes abordam a interface administrativa para replicação semi-síncrona e como instalá-la, configurá-la e monitorá-la.

A replicação do MySQL, por padrão, é assíncrona. A fonte escreve eventos em seu log binário e as réplicas as solicitam quando estão prontas. A fonte não sabe se ou quando uma réplica recuperou e processou as transações, e não há garantia de que algum evento chegue a qualquer réplica. Com a replicação assíncrona, se a fonte falhar, as transações que ela comprometeu podem não ter sido transmitidas para nenhuma réplica. O failover do fonte para a réplica, neste caso, pode resultar em failover para um servidor que está faltando transações em relação à fonte.

Com replicação totalmente sincronizada, quando uma fonte executa uma transação, todas as réplicas também devem ter executado a transação antes de a fonte retornar à sessão que executou a transação. A replicação totalmente sincronizada significa que o failover da fonte para qualquer réplica é possível a qualquer momento. O inconveniente da replicação totalmente sincronizada é que pode haver um grande atraso para completar uma transação.

A replicação semiescronizada fica entre a replicação assíncrona e a replicação totalmente síncrona. A fonte espera até que pelo menos uma réplica tenha recebido e registrado os eventos (o número necessário de réplicas é configurável) e, em seguida, confirma a transação. A fonte não espera que todas as réplicas confirmem a recepção e requer apenas um reconhecimento das réplicas, não que os eventos tenham sido totalmente executados e confirmados no lado da réplica. Portanto, a replicação semiescronizada garante que, se a fonte falhar, todas as transações que ela confirmou foram transmitidas para pelo menos uma réplica.

Comparado à replicação assíncrona, a replicação semiesincrônica oferece uma integridade de dados melhorada, porque, quando um commit retorna com sucesso, sabe-se que os dados existem em pelo menos dois lugares. Até que uma fonte semiesincrônica receba o reconhecimento do número necessário de réplicas, a transação fica em espera e não é comprometida.

Comparado à replicação totalmente sincronizada, a replicação semiesincrônica é mais rápida, porque pode ser configurada para equilibrar suas necessidades de integridade dos dados (o número de réplicas que reconhecem a recepção da transação) com a velocidade dos commits, que são mais lentos devido à necessidade de esperar pelas réplicas.

Importante

Com a replicação semiesincrona, se a fonte falhar e uma falha de replicação for realizada, a fonte falhou não deve ser reutilizada como servidor de fonte de replicação e deve ser descartada. Ela poderia ter transações que não foram reconhecidas por nenhuma réplica, portanto, não foram comprometidas antes da falha de replicação.

Se o seu objetivo é implementar uma topologia de replicação tolerante a falhas, onde todos os servidores recebem as mesmas transações na mesma ordem, e um servidor que cai pode se reconectar ao grupo e ser atualizado automaticamente, você pode usar a Replicação por Grupo para alcançar isso. Para informações, consulte o Capítulo 17, *Replicação por Grupo*.

O impacto no desempenho da replicação semisíncrona em comparação com a replicação assíncrona é o compromisso para aumentar a integridade dos dados. A quantidade de lentidão é pelo menos o tempo de ida e volta do TCP/IP para enviar o compromisso para a réplica e esperar o reconhecimento da recepção pela réplica. Isso significa que a replicação semisíncrona funciona melhor para servidores próximos que se comunicam em redes rápidas, e pior para servidores distantes que se comunicam em redes lentas. A replicação semisíncrona também coloca um limite de taxa em sessões ocupadas, restringindo a velocidade com que eventos de log binário podem ser enviados da fonte para a réplica. Quando um usuário está muito ocupado, isso o desacelera, o que pode ser útil em algumas situações de implantação.

A replicação semiesincronizada entre uma fonte e suas réplicas funciona da seguinte forma:

* Uma réplica indica se é capaz de ser semi-sincronizada quando se conecta à fonte.

* Se a replicação semisíncrona estiver habilitada no lado da fonte e houver pelo menos uma replica semisíncrona, um thread que realize um compromisso de transação nos blocos da fonte e espere até que pelo menos uma replica semisíncrona reconheça que recebeu todos os eventos da transação, ou até que ocorra um tempo de espera.

* A replica reconhece o recebimento dos eventos de uma transação apenas após esses eventos terem sido escritos em seu log de retransmissão e apagados no disco.

* Se ocorrer um tempo de espera sem que nenhuma réplica tenha reconhecido a transação, a fonte retorna à replicação assíncrona. Quando pelo menos uma réplica semisíncrona alcança a atualização, a fonte retorna à replicação semisíncrona.

* A replicação semiesincrônica deve ser habilitada tanto no lado da fonte quanto no lado da replica. Se a replicação semiesincrônica for desabilitada na fonte, ou habilitada na fonte, mas não nas réplicas, a fonte usa replicação assíncrona.

Enquanto a fonte está bloqueando (esperando reconhecimento de uma réplica), ela não retorna à sessão que realizou a transação. Quando o bloco termina, a fonte retorna à sessão, que então pode prosseguir para executar outras declarações. Neste ponto, a transação foi comprometida no lado da fonte e o recebimento de seus eventos foi reconhecido por pelo menos uma réplica. O número de reconhecimentos de réplica que a fonte deve receber por transação antes de retornar à sessão é configurável usando a variável de sistema `rpl_semi_sync_master_wait_for_slave_count`, cujo valor padrão é 1.

O bloqueio também ocorre após recuos que são escritos no log binário, o que acontece quando uma transação que modifica tabelas não transacionais é recuada. A transação recuada é registrada, mesmo que não tenha efeito para tabelas transacionais, porque as modificações nas tabelas não transacionais não podem ser recuadas e devem ser enviadas para réplicas.

Para declarações que não ocorrem em contexto transacional (ou seja, quando nenhuma transação foi iniciada com `START TRANSACTION` ou `SET autocommit = 0`), o autocommit é habilitado e cada declaração compromete implicitamente. Com replicação semi-síncrona, os blocos de origem para cada declaração, assim como para os compromissos explícitos de transação, são ignorados.

A variável de sistema `rpl_semi_sync_master_wait_point` controla o ponto em que uma fonte de replicação semisíncrona espera o reconhecimento da recepção da transação por parte da réplica antes de retornar um status ao cliente que comprometeu a transação. Esses valores são permitidos:

* `AFTER_SYNC` (padrão): A fonte escreve cada transação em seu log binário e na replica, e sincroniza o log binário com o disco. A fonte espera o reconhecimento da replicação da recepção da transação após a sincronização. Ao receber o reconhecimento, a fonte compromete a transação no motor de armazenamento e retorna um resultado ao cliente, que então pode prosseguir.

* `AFTER_COMMIT`: A fonte escreve cada transação em seu log binário e na replica, sincroniza o log binário e confirma a transação no motor de armazenamento. A fonte espera o reconhecimento da replica sobre a recepção da transação após o commit. Ao receber o reconhecimento, a fonte retorna um resultado ao cliente, que pode então prosseguir.

As características de replicação desses ambientes diferem da seguinte forma:

* Com `AFTER_SYNC`, todos os clientes veem a transação comprometida ao mesmo tempo, que é após ter sido reconhecida pela replica e comprometida no motor de armazenamento na fonte. Assim, todos os clientes veem os mesmos dados na fonte.

Em caso de falha na fonte, todas as transações comprometidas na fonte foram replicadas para a replica (salvo no seu log de relevo). Uma saída inesperada da fonte e a transição para a replica são sem perdas, pois a replica está atualizada. Como mencionado acima, a fonte não deve ser reutilizada após a transição.

* Com `AFTER_COMMIT`, o cliente que emite a transação recebe um status de retorno apenas após o servidor se comprometer com o mecanismo de armazenamento e receber o reconhecimento da replica. Após o compromisso e antes do reconhecimento da replica, outros clientes podem ver a transação comprometida antes do cliente que a comprometeu.

Se algo der errado de tal forma que a réplica não processe a transação, então, em caso de saída inesperada da fonte e failover para a réplica, é possível que esses clientes vejam uma perda de dados em relação ao que viram na fonte.

#### 16.3.9.1 Interface Administrativa de Replicação Semisíncrona

A interface administrativa para replicação semiesincronizada tem vários componentes:

* Dois plugins implementam a capacidade semi-sincronizada. Há um plugin para o lado da fonte e outro para o lado da replica.

* As variáveis do sistema controlam o comportamento do plugin. Alguns exemplos:

+ `rpl_semi_sync_master_enabled`

Controla se a replicação semiesincronizada está habilitada na fonte. Para habilitar ou desabilitar o plugin, defina essa variável para 1 ou 0, respectivamente. O padrão é 0 (desativado).

+ `rpl_semi_sync_master_timeout`

Um valor em milissegundos que controla o tempo que a fonte espera um reconhecimento de uma réplica antes de expirar o prazo e retornar à replicação assíncrona. O valor padrão é 10000 (10 segundos).

+ `rpl_semi_sync_slave_enabled`

Semelhante a `rpl_semi_sync_master_enabled`, mas controla o plugin de replicação.

Todas as variáveis do sistema `rpl_semi_sync_xxx` são descritas na Seção 16.1.6.2, “Opções e Variáveis da Fonte de Replicação” e na Seção 16.1.6.3, “Opções e Variáveis do Servidor de Replicação”.

* A partir do MySQL 5.7.33, você pode melhorar o desempenho da replicação semiescronizada ao habilitar as variáveis de sistema `replication_sender_observe_commit_only`, que limita os callbacks, e `replication_optimize_for_static_plugin_config`, que adiciona blocos compartilhados e evita aquisições de bloqueio desnecessárias. Esses ajustes ajudam à medida que o número de réplicas aumenta, porque a concorrência por blocos pode desacelerar o desempenho. Os servidores de origem da replicação semiescronizada também podem obter benefícios de desempenho ao habilitar essas variáveis de sistema, porque eles usam os mesmos mecanismos de bloqueio que as réplicas.

* As variáveis de status permitem o monitoramento da replicação semiesincrônica. Alguns exemplos:

+ `Rpl_semi_sync_master_clients`

O número de réplicas semi-síncronas.

+ `Rpl_semi_sync_master_status`

Se a replicação semi-sincronizada está atualmente operacional na fonte. O valor é 1 se o plugin foi habilitado e um reconhecimento de compromisso não ocorreu. É 0 se o plugin não estiver habilitado ou a fonte voltou para replicação assíncrona devido ao tempo de espera de reconhecimento de compromisso.

+ `Rpl_semi_sync_master_no_tx`

O número de commits que não foram reconhecidos com sucesso por uma réplica.

+ `Rpl_semi_sync_master_yes_tx`

O número de commits que foram reconhecidos com sucesso por uma réplica.

+ `Rpl_semi_sync_slave_status`

Se a replicação semi-sincronizada está atualmente operacional na replica. Isso é 1 se o plugin tiver sido habilitado e o thread de I/O de replicação estiver em execução, caso contrário, 0.

Todas as variáveis de status `Rpl_semi_sync_xxx` são descritas na Seção 5.1.9, “Variáveis de Status do Servidor”.

As variáveis de sistema e status estão disponíveis apenas se o plugin de fonte ou replica apropriado tiver sido instalado com `INSTALL PLUGIN`.

#### 16.3.9.2 Instalação e Configuração da Replicação Semisíncrona

A replicação semiesincronizada é implementada usando plugins, então os plugins devem ser instalados no servidor para torná-los disponíveis. Após um plugin ter sido instalado, você o controla por meio das variáveis do sistema associadas a ele. Essas variáveis do sistema não estão disponíveis até que o plugin associado tenha sido instalado.

Esta seção descreve como instalar os plugins de replicação semisíncrona. Para informações gerais sobre a instalação de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para usar a replicação semiesincronizada, os seguintes requisitos devem ser atendidos:

* A capacidade de instalar plugins requer um servidor MySQL que suporte carregamento dinâmico. Para verificar isso, verifique se o valor da variável de sistema `have_dynamic_loading` é `YES`. Distribuições binárias devem suportar carregamento dinâmico.

* A replicação já deve estar funcionando, veja a Seção 16.1, “Configurando a Replicação”.

* Não deve haver vários canais de replicação configurados. A replicação semiescronizada é compatível apenas com o canal de replicação padrão. Consulte a Seção 16.2.2, “Canais de replicação”.

Para configurar a replicação semiesincronizada, use as instruções a seguir. As declarações `INSTALL PLUGIN`, `SET GLOBAL`, `STOP SLAVE` e `START SLAVE` mencionadas aqui requerem o privilégio `SUPER`.

As distribuições do MySQL incluem arquivos de plugins de replicação semi-sincronizada para o lado da fonte e para o lado da replica.

Para ser utilizado por um servidor de origem ou replicação, o arquivo apropriado da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Os nomes de arquivo da biblioteca de plugins são `semisync_master` e `semisync_slave`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para Unix e sistemas similares ao Unix, `.dll` para Windows).

O arquivo da biblioteca de plugins de origem deve estar presente no diretório de plugins do servidor de origem. O arquivo da biblioteca de plugins de replicação deve estar presente no diretório de plugins de cada servidor de replicação.

Para carregar os plugins, use a declaração `INSTALL PLUGIN` na fonte e em cada réplica que deve ser semi-sincronizada, ajustando o sufixo `.so` para sua plataforma conforme necessário.

Sobre a fonte:

```sql
INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';
```

Em cada réplica:

```sql
INSTALL PLUGIN rpl_semi_sync_slave SONAME 'semisync_slave.so';
```

Se uma tentativa de instalar um plugin resultar em um erro no Linux semelhante ao mostrado aqui, você deve instalar `libimf`:

```sql
mysql> INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';
ERROR 1126 (HY000): Can't open shared library
'/usr/local/mysql/lib/plugin/semisync_master.so'
(errno: 22 libimf.so: cannot open shared object file:
No such file or directory)
```

Você pode obter `libimf` a partir de <https://dev.mysql.com/downloads/os-linux.html>.

Para ver quais plugins estão instalados, use a declaração `SHOW PLUGINS`, ou consulte a tabela do esquema de informações `PLUGINS`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%semi%';
+----------------------+---------------+
| PLUGIN_NAME          | PLUGIN_STATUS |
+----------------------+---------------+
| rpl_semi_sync_master | ACTIVE        |
+----------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Após a instalação de um plugin de replicação semisíncrona, ele é desativado por padrão. Os plugins devem ser ativados tanto no lado de origem quanto no lado da replica para habilitar a replicação semisíncrona. Se apenas um lado for ativado, a replicação é assíncrona.

Para controlar se um plugin instalado está habilitado, defina as variáveis de sistema apropriadas. Você pode definir essas variáveis em tempo de execução usando `SET GLOBAL`, ou na inicialização do servidor na string de comando ou em um arquivo de opção.

Durante a execução, essas variáveis de sistema do lado da fonte estão disponíveis:

```sql
SET GLOBAL rpl_semi_sync_master_enabled = {0|1};
SET GLOBAL rpl_semi_sync_master_timeout = N;
```

No lado da réplica, essa variável do sistema está disponível:

```sql
SET GLOBAL rpl_semi_sync_slave_enabled = {0|1};
```

Para `rpl_semi_sync_master_enabled` ou `rpl_semi_sync_slave_enabled`, o valor deve ser 1 para habilitar a replicação semi-sincronizada ou 0 para desabilitar. Por padrão, essas variáveis são definidas como 0.

Para `rpl_semi_sync_master_timeout`, o valor *`N`* é dado em milissegundos. O valor padrão é 10000 (10 segundos).

Se você habilitar a replicação semi-sincronizada em uma replica durante a execução, também deve iniciar o thread de I/O de replicação (parando-o primeiro, se já estiver em execução) para fazer com que a replica se conecte à fonte e se registre como uma replica semi-sincronizada:

```sql
STOP SLAVE IO_THREAD;
START SLAVE IO_THREAD;
```

Se a thread de I/O de replicação já estiver em execução e você não a reiniciar, a replicação continua a usar a replicação assíncrona.

Ao iniciar o servidor, as variáveis que controlam a replicação semiesincronizada podem ser definidas como opções de string de comando ou em um arquivo de opções. Uma configuração listada em um arquivo de opções entra em vigor cada vez que o servidor é iniciado. Por exemplo, você pode definir as variáveis nos arquivos `my.cnf` dos lados da fonte e da replicação da seguinte forma.

Sobre a fonte:

```sql
[mysqld]
rpl_semi_sync_master_enabled=1
rpl_semi_sync_master_timeout=1000 # 1 second
```

Em cada réplica:

```sql
[mysqld]
rpl_semi_sync_slave_enabled=1
```

#### 16.3.9.3 Monitoramento da Replicação Semisíncrona

Os plugins para a capacidade de replicação semi-sincronizada exibem várias variáveis de sistema e de status que você pode examinar para determinar sua configuração e estado operacional.

A variável do sistema reflete como a replicação semiesincronizada está configurada. Para verificar seus valores, use `SHOW VARIABLES`:

```sql
mysql> SHOW VARIABLES LIKE 'rpl_semi_sync%';
```

As variáveis de status permitem que você monitore o funcionamento da replicação semiesincronizada. Para verificar seus valores, use `SHOW STATUS`:

```sql
mysql> SHOW STATUS LIKE 'Rpl_semi_sync%';
```

Quando a fonte muda entre a replicação assíncrona ou semi-síncrona devido ao tempo de espera de bloqueio de commit ou à replicação que está recuperando, ela define o valor da variável de status `Rpl_semi_sync_master_status` de forma apropriada. A falha automática da replicação semi-síncrona para a replicação assíncrona na fonte significa que é possível que a variável de sistema `rpl_semi_sync_master_enabled` tenha um valor de 1 no lado da fonte, mesmo quando a replicação semi-síncrona não está, de fato, operacional no momento. Você pode monitorar a variável de status `Rpl_semi_sync_master_status` para determinar se a fonte está atualmente usando replicação assíncrona ou semi-síncrona.

Para ver quantos replicas semi-síncronos estão conectados, confira `Rpl_semi_sync_master_clients`.

O número de commits que foram reconhecidos com sucesso ou não pelos replicas é indicado pelas variáveis `Rpl_semi_sync_master_yes_tx` e `Rpl_semi_sync_master_no_tx`.

No lado da replicação, `Rpl_semi_sync_slave_status` indica se a replicação semi-sincronizada está atualmente operacional.

### 16.3.10 Replicação Atendida

O MySQL 5.7 suporta replicação atrasada, de modo que um servidor de replicação fica deliberadamente atrasado em relação à fonte por pelo menos um período de tempo especificado. O atraso padrão é de 0 segundos. Use a opção `MASTER_DELAY` para `CHANGE MASTER TO` para definir o atraso para *`N`* segundos:

```sql
CHANGE MASTER TO MASTER_DELAY = N;
```

Um evento recebido da fonte não é executado até pelo menos *`N`* segundos depois de sua execução na fonte. As exceções são que não há atraso para eventos de descrição de formato ou eventos de rotação de arquivo de registro, que afetam apenas o estado interno do thread SQL.

A replicação retardada pode ser usada para vários propósitos:

* Para proteger contra erros do usuário na fonte. Um DBA pode reverter uma replica atrasada para o momento imediatamente anterior ao desastre.

* Para testar como o sistema se comporta quando há um atraso. Por exemplo, em um aplicativo, um atraso pode ser causado por uma carga pesada na replica. No entanto, pode ser difícil gerar esse nível de carga. A replicação atrasada pode simular o atraso sem precisar simular a carga. Também pode ser usado para depurar condições relacionadas a uma replica que está atrasada.

* Para inspecionar como o banco de dados parecia há muito tempo, sem precisar recarregar um backup. Por exemplo, se o atraso for de uma semana e o DBA precise ver como o banco de dados parecia antes dos últimos dias de desenvolvimento, a replica atrasada pode ser inspecionada.

`START SLAVE` e `STOP SLAVE` entram em vigor imediatamente e ignoram qualquer atraso. `RESET SLAVE` redefiniu o atraso para 0.

`SHOW SLAVE STATUS` tem três campos que fornecem informações sobre o atraso:

* `SQL_Delay`: Um número inteiro não negativo que indica o número de segundos que a réplica deve ficar à frente da fonte.

* `SQL_Remaining_Delay`: Quando `Slave_SQL_Running_State` é `Waiting until MASTER_DELAY seconds after master executed event`, este campo contém um número inteiro que indica o número de segundos restantes do atraso. Em outros momentos, este campo é `NULL`.

* `Slave_SQL_Running_State`: Uma string que indica o estado do thread SQL (análogo a `Slave_IO_State`). O valor é idêntico ao valor do `State` do thread SQL, conforme exibido por `SHOW PROCESSLIST`.

Quando o thread de replicação SQL está aguardando o término do atraso antes de executar um evento, `SHOW PROCESSLIST` exibe seu valor `State` como `Waiting until MASTER_DELAY seconds after master executed event`.