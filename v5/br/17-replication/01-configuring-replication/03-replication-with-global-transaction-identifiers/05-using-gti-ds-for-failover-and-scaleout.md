#### 16.1.3.5 Uso de GTIDs para Failover e Scaleout

Existem várias técnicas para usar a replicação do MySQL com Identificadores de Transação Global (GTIDs) para provisionar uma nova replica, que pode ser usada para escalabilidade, sendo promovida para a fonte conforme necessário para o failover. Esta seção descreve as seguintes técnicas:

- Replicação simples
- Copiar dados e transações para a replica
- Injetar transações vazias
- Excluindo transações com gtid\_purged
- Restauração de réplicas no modo GTID

Identificadores de transações globais foram adicionados ao MySQL Replication com o objetivo de simplificar o gerenciamento geral do fluxo de dados de replicação e, em particular, as atividades de failover. Cada identificador identifica de forma única um conjunto de eventos de log binário que, juntos, compõem uma transação. Os GTIDs desempenham um papel fundamental na aplicação de alterações no banco de dados: o servidor ignora automaticamente qualquer transação que tenha um identificador que o servidor reconheça como uma que ele já processou anteriormente. Esse comportamento é crucial para o posicionamento automático da replicação e para o failover correto.

O mapeamento entre identificadores e conjuntos de eventos que compõem uma transação específica é registrado no log binário. Isso apresenta alguns desafios ao provisionar um novo servidor com dados de outro servidor existente. Para reproduzir o conjunto de identificadores no novo servidor, é necessário copiar os identificadores do servidor antigo para o novo e preservar a relação entre os identificadores e os eventos reais. Isso é necessário para restaurar uma replica que esteja imediatamente disponível como candidata para se tornar uma nova fonte em caso de falha ou mudança de configuração.

**Replicação simples.** A maneira mais fácil de reproduzir todos os identificadores e transações em um novo servidor é fazer com que o novo servidor se torne a replica de uma fonte que tenha todo o histórico de execução e habilitar os identificadores globais de transações em ambos os servidores. Consulte Seção 16.1.3.4, “Configurando a Replicação Usando GTIDs” para obter mais informações.

Uma vez que a replicação é iniciada, o novo servidor copia o log binário inteiro da fonte e, assim, obtém todas as informações sobre todos os GTIDs.

Esse método é simples e eficaz, mas exige que a replica leia o log binário da fonte; às vezes, pode levar um tempo relativamente longo para a nova replica se atualizar com a fonte, portanto, esse método não é adequado para failover rápido ou restauração a partir de backup. Esta seção explica como evitar buscar todo o histórico de execução da fonte copiando arquivos de log binário para o novo servidor.

**Copiar dados e transações para a replica.** Executar todo o histórico de transações pode ser demorado quando o servidor de origem processou um grande número de transações anteriormente, e isso pode representar um grande gargalo ao configurar uma nova replica. Para eliminar essa exigência, um instantâneo do conjunto de dados, os logs binários e as informações globais de transações que o servidor de origem contém podem ser importados para a nova replica. O servidor de origem pode ser o servidor de origem ou a replica, mas você deve garantir que o servidor de origem tenha processado todas as transações necessárias antes de copiar os dados.

Existem várias variantes deste método, a diferença sendo na forma como os dados e as transações dos logs binários são transferidos para a replica, conforme descrito aqui:

Conjunto de dados:   1. Crie um arquivo de dump usando **mysqldump** no servidor de origem. Defina a opção **mysqldump** `--master-data` (com o valor padrão de 1) para incluir uma declaração `CHANGE MASTER TO` com informações de registro binário. Defina a opção `--set-gtid-purged` para `AUTO` (o padrão) ou `ON`, para incluir informações sobre as transações executadas no dump. Em seguida, use o cliente **mysql** para importar o arquivo de dump no servidor de destino.

```
2. Alternatively, create a data snapshot of the source server using raw data files, then copy these files to the target server, following the instructions in Section 16.1.2.4, “Choosing a Method for Data Snapshots”. If you use `InnoDB` tables, you can use the **mysqlbackup** command from the MySQL Enterprise Backup component to produce a consistent snapshot. This command records the log name and offset corresponding to the snapshot to be used on the replica. MySQL Enterprise Backup is a commercial product that is included as part of a MySQL Enterprise subscription. See Section 28.1, “MySQL Enterprise Backup Overview” for detailed information.

3. Alternatively, stop both the source and target servers, copy the contents of the source's data directory to the new replica's data directory, then restart the replica. If you use this method, the replica must be configured for GTID-based replication, in other words with `gtid_mode=ON`. For instructions and important information for this method, see Section 16.1.2.6, “Adding Replicas to a Replication Topology”.
```

Histórico de transações:   Se o servidor de origem tiver um histórico de transações completo em seus logs binários (ou seja, o GTID definido como `@@GLOBAL.gtid_purged` estiver vazio), você pode usar esses métodos.

````
1. Import the binary logs from the source server to the new replica using **mysqlbinlog**, with the `--read-from-remote-server` and `--read-from-remote-master` options.

2. Alternatively, copy the source server's binary log files to the replica. You can make copies from the replica using **mysqlbinlog** with the `--read-from-remote-server` and `--raw` options. These can be read into the replica by using **mysqlbinlog** `>` `file` (without the `--raw` option) to export the binary log files to SQL files, then passing these files to the **mysql** client for processing. Ensure that all of the binary log files are processed using a single **mysql** process, rather than multiple connections. For example:

   ```sql
   $> mysqlbinlog copied-binlog.000001 copied-binlog.000002 | mysql -u root -p
   ```

   For more information, see Section 4.6.7.3, “Using mysqlbinlog to Back Up Binary Log Files”.
````

Esse método tem a vantagem de que um novo servidor está disponível quase imediatamente; apenas as transações que foram comprometidas enquanto o arquivo de instantâneo ou de dump estava sendo reexecutado ainda precisam ser obtidas da fonte existente. Isso significa que a disponibilidade da replica não é imediata, mas apenas um período relativamente curto deve ser necessário para que a replica alcance essas poucas transações restantes.

Copiar logs binários para o servidor de destino com antecedência geralmente é mais rápido do que ler o histórico completo da execução da transação do ponto de origem em tempo real. No entanto, nem sempre é viável mover esses arquivos para o destino quando necessário, devido ao tamanho ou outras considerações. Os dois métodos restantes para provisionar uma nova replica discutidos nesta seção usam outros meios para transferir informações sobre as transações para a nova replica.

**Injetando transações vazias.** A variável global da fonte [`gtid_executed`](https://pt.replication-options-gtids.html#sysvar_gtid_executed) contém o conjunto de todas as transações executadas na fonte. Em vez de copiar os logs binários ao fazer um snapshot para provisionar um novo servidor, você pode, em vez disso, anotar o conteúdo de `gtid_executed` no servidor a partir do qual o snapshot foi feito. Antes de adicionar o novo servidor à cadeia de replicação, basta confirmar uma transação vazia no novo servidor para cada identificador de transação contido no `gtid_executed` da fonte, da seguinte forma:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';

BEGIN;
COMMIT;

SET GTID_NEXT='AUTOMATIC';
```

Depois que todos os identificadores de transação forem restaurados dessa maneira usando transações vazias, você deve limpar e descartar os logs binários da replica, conforme mostrado aqui, onde *`N`* é o sufixo não nulo do nome atual do arquivo de log binário:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'source-bin.00000N';
```

Você deve fazer isso para evitar que esse servidor inunda o fluxo de replicação com transações falsas, caso ele seja promovido para fonte posteriormente. (A instrução `FLUSH LOGS` força a criação de um novo arquivo de log binário; `PURGE BINARY LOGS` exclui as transações vazias, mas mantém seus identificadores.)

Esse método cria um servidor que é essencialmente um instantâneo, mas que, com o tempo, pode se tornar uma fonte, à medida que seu histórico de log binário converge com o da corrente de replicação (ou seja, à medida que ele alcança a fonte ou as fontes). Esse resultado é semelhante em efeito ao obtido usando o método de provisionamento restante, que discutimos nos próximos parágrafos.

**Excluindo transações com gtid\_purged.** A variável global da fonte `gtid_purged` do fonte contém o conjunto de todas as transações que foram apagadas do log binário da fonte. Como no método discutido anteriormente (veja Injetando transações vazias), você pode registrar o valor de `gtid_executed` no servidor a partir do qual o instantâneo foi feito (em vez de copiar os logs binários para o novo servidor). Ao contrário do método anterior, não é necessário compromentar transações vazias (ou emitir `PURGE BINARY LOGS`); em vez disso, você pode definir `gtid_purged` na replica diretamente, com base no valor de `gtid_executed` no servidor a partir do qual o backup ou instantâneo foi feito.

Assim como o método que utiliza transações vazias, este método cria um servidor que, funcionalmente, é um instantâneo, mas que, com o tempo, pode se tornar uma fonte, à medida que o histórico do log binário converge com o do servidor fonte de replicação ou do grupo.

**Restauração de réplicas no modo GTID.** Ao restaurar uma réplica em uma configuração de replicação baseada em GTID que encontrou um erro, a injeção de uma transação vazia pode não resolver o problema, pois um evento não possui um GTID.

Use **mysqlbinlog** para encontrar a próxima transação, que provavelmente será a primeira transação no próximo arquivo de log após o evento. Copie tudo até o `COMMIT` dessa transação, garantindo que inclua o `SET @@SESSION.GTID_NEXT`. Mesmo que você não esteja usando a replicação baseada em linhas, ainda é possível executar eventos de linha do log binário no cliente de linha de comando.

Pare a replicação e execute a transação que você copiou. A saída do **mysqlbinlog** define o delimitador como \`/*!*/; então, configure-o novamente:

```sql
mysql> DELIMITER ;
```

Reinicie a replicação a partir da posição correta automaticamente:

```sql
mysql> SET GTID_NEXT=automatic;
mysql> RESET SLAVE;
mysql> START SLAVE;
```
