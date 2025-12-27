#### 19.1.3.5 Uso de GTIDs para Failover e Scaleout

Existem várias técnicas para usar a Replicação MySQL com Identificadores Globais de Transações (GTIDs) para provisionar uma nova replica que pode ser usada para scaleout, sendo promovida ao estado de origem conforme necessário para o failover. Esta seção descreve as seguintes técnicas:

* Replicação simples
* Copiar dados e transações para a replica
* Injetar transações vazias
* Excluir transações com gtid_purged
* Restaurar replicas no modo GTID

Os identificadores globais de transações foram adicionados à Replicação MySQL com o objetivo de simplificar o gerenciamento geral do fluxo de dados de replicação e das atividades de failover, em particular. Cada identificador identifica de forma única um conjunto de eventos do log binário que, juntos, compõem uma transação. Os GTIDs desempenham um papel fundamental na aplicação de alterações no banco de dados: o servidor ignora automaticamente qualquer transação que tenha um identificador que o servidor reconheça como uma que ele já processou anteriormente. Esse comportamento é crucial para o posicionamento automático da replicação e para o failover correto.

O mapeamento entre identificadores e conjuntos de eventos que compõem uma transação dada é capturado no log binário. Isso apresenta alguns desafios ao provisionar um novo servidor com dados de outro servidor existente. Para reproduzir o conjunto de identificadores no novo servidor, é necessário copiar os identificadores do servidor antigo para o novo e preservar a relação entre os identificadores e os eventos reais. Isso é necessário para restaurar uma replica que esteja imediatamente disponível como candidata a se tornar uma nova origem no failover ou na transição.

**Replicação simples.** A maneira mais fácil de reproduzir todos os identificadores e transações em um novo servidor é fazer com que o novo servidor se torne a replica de um servidor de origem que possui todo o histórico de execução e habilitar os identificadores globais de transações em ambos os servidores. Consulte a Seção 19.1.3.4, “Configurando a Replicação Usando GTIDs”, para obter mais informações.

Uma vez que a replicação seja iniciada, o novo servidor copia o log binário completo da origem e, assim, obtém todas as informações sobre todos os GTIDs.

Esse método é simples e eficaz, mas exige que a replica leia o log binário da origem; às vezes, pode levar um tempo comparativamente longo para a nova replica se atualizar com a origem, portanto, esse método não é adequado para failover rápido ou restauração a partir de backup. Esta seção explica como evitar buscar todo o histórico de execução da origem ao copiar arquivos de log binário para o novo servidor.

**Copiando dados e transações para a replica.** Executar todo o histórico de transações pode ser demorado quando o servidor de origem processou um grande número de transações anteriormente, e isso pode representar um grande gargalo ao configurar uma nova replica. Para eliminar essa exigência, uma captura de dados, os logs binários e as informações de transações globais que o servidor de origem contém podem ser importados para a nova replica. O servidor onde a captura de dados é feita pode ser o servidor de origem ou uma de suas replicas, mas você deve garantir que o servidor tenha processado todas as transações necessárias antes de copiar os dados.

Existem várias variantes desse método, a diferença sendo na maneira como os dumps de dados e as transações dos logs binários são transferidos para a replica, conforme descrito aqui:

Conjunto de dados:   1. Crie um arquivo de dump usando o **mysqldump** no servidor de origem. Defina a opção **mysqldump** `--source-data` para 1, para incluir uma declaração `ALTERAR A FONTE DE REPLICAÇÃO PARA` com informações de registro binário. Defina a opção `--set-gtid-purged` para `AUTO` (o padrão) ou `ON`, para incluir informações sobre as transações executadas no dump. Em seguida, use o cliente **mysql** para importar o arquivo de dump no servidor de destino.

    2. Alternativamente, crie um instantâneo de dados do servidor de origem usando arquivos de dados brutos, depois copie esses arquivos para o servidor de destino, seguindo as instruções na Seção 19.1.2.5, “Escolhendo um Método para Instantâneos de Dados”. Se você usar tabelas `InnoDB`, pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que está incluído como parte de uma assinatura do MySQL Enterprise. Veja a Seção 32.1, “MySQL Enterprise Backup Overview” para informações detalhadas.

    3. Alternativamente, pare tanto o servidor de origem quanto o de destino, copie o conteúdo do diretório de dados do servidor de origem para o diretório de dados da nova replica, depois reinicie a replica. Se você usar esse método, a replica deve ser configurada para replicação baseada em GTID, ou seja, com `gtid_mode=ON`. Para instruções e informações importantes para esse método, veja a Seção 19.1.2.8, “Adicionando Replicas a um Ambiente de Replicação”.

Histórico de transações:   Se o servidor de origem tiver um histórico de transações completo em seus logs binários (ou seja, o GTID definido `@@GLOBAL.gtid_purged` estiver vazio), você pode usar esses métodos.

1. Importe os logs binários do servidor de origem para a nova replica usando **mysqlbinlog**, com as opções `--read-from-remote-server` e `--read-from-remote-source`.

    2. Alternativamente, copie os arquivos de log binário do servidor de origem para a replica. Você pode fazer cópias do servidor de origem usando **mysqlbinlog** com as opções `--read-from-remote-server` e `--raw`. Esses arquivos podem ser lidos na replica usando **mysqlbinlog** `>` `file` (sem a opção `--raw`) para exportar os arquivos de log binário para arquivos SQL, e depois passar esses arquivos para o cliente **mysql** para processamento. Certifique-se de que todos os arquivos de log binário sejam processados usando um único processo **mysql**, em vez de várias conexões. Por exemplo:

       ```
       $> mysqlbinlog copied-binlog.000001 copied-binlog.000002 | mysql -u root -p
       ```

       Para mais informações, consulte a Seção 6.6.9.3, “Usando mysqlbinlog para fazer backup de arquivos de log binário”.

Este método tem a vantagem de que um novo servidor está disponível quase imediatamente; apenas as transações que foram comprometidas enquanto o arquivo de instantâneo ou dump estava sendo reinterpretado ainda precisam ser obtidas do servidor de origem existente. Isso significa que a disponibilidade da replica não é instantânea, mas apenas um tempo relativamente curto deve ser necessário para que a replica alcance essas poucas transações restantes.

Copiar logs binários para o servidor de destino com antecedência geralmente é mais rápido do que ler todo o histórico de execução de transações do fonte em tempo real. No entanto, nem sempre pode ser viável mover esses arquivos para o destino quando necessário, devido ao tamanho ou outras considerações. Os dois métodos restantes para provisionar uma nova replica discutidos nesta seção usam outros meios para transferir informações sobre transações para a nova replica.

**Injetando transações vazias.** A variável global `gtid_executed` da fonte contém o conjunto de todas as transações executadas na fonte. Em vez de copiar os logs binários ao fazer um snapshot para provisionar um novo servidor, você pode, em vez disso, anotar o conteúdo de `gtid_executed` no servidor a partir do qual o snapshot foi feito. Antes de adicionar o novo servidor à cadeia de replicação, basta confirmar uma transação vazia no novo servidor para cada identificador de transação contido na `gtid_executed` da fonte, da seguinte forma:

```
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';

BEGIN;
COMMIT;

SET GTID_NEXT='AUTOMATIC';
```

Uma vez que todos os identificadores de transações tenham sido reintegrados dessa maneira usando transações vazias, você deve limpar e purgar os logs binários da replica, conforme mostrado aqui, onde *`N`* é o sufixo não nulo do nome atual do arquivo de log binário:

```
FLUSH LOGS;
PURGE BINARY LOGS TO 'source-bin.00000N';
```

Você deve fazer isso para evitar que esse servidor inunde o fluxo de replicação com transações falsas no caso de ser promovido para a fonte mais tarde. (A instrução `FLUSH LOGS` força a criação de um novo arquivo de log binário; `PURGE BINARY LOGS` purga as transações vazias, mas retém seus identificadores.)

Esse método cria um servidor que é essencialmente um snapshot, mas que, com o tempo, pode se tornar uma fonte à medida que seu histórico de log binário converge com o do fluxo de replicação (ou seja, à medida que ele alcança o(s) fonte(s)). Esse resultado é semelhante em efeito ao obtido usando o método de provisionamento restante, que discutimos nos próximos parágrafos.

**Excluindo transações com gtid_purged.** A variável global `gtid_purged` da fonte contém o conjunto de todas as transações que foram purgadas do log binário da fonte. Como no método discutido anteriormente (veja Injetando transações vazias), você pode registrar o valor de `gtid_executed` no servidor a partir do qual o instantâneo foi feito (em vez de copiar os logs binários para o novo servidor). Ao contrário do método anterior, não é necessário comprometer transações vazias (ou emitir `PURGE BINARY LOGS`); em vez disso, você pode definir `gtid_purged` na replica diretamente, com base no valor de `gtid_executed` no servidor a partir do qual o backup ou instantâneo foi feito.

Como no método que usa transações vazias, este método cria um servidor que é funcionalmente um instantâneo, mas que, com o tempo, pode se tornar uma fonte à medida que seu histórico de log binário converge com o da fonte e de outras réplicas.

**Restaurando réplicas no modo GTID.** Ao restaurar uma replica em uma configuração de replicação baseada em GTID que encontrou um erro, injetar uma transação vazia pode não resolver o problema, pois um evento não tem um GTID.

Use **mysqlbinlog** para encontrar a próxima transação, que provavelmente é a primeira transação no próximo arquivo de log após o evento. Copie tudo até o `COMMIT` para essa transação, garantindo que inclua o `SET @@SESSION.gtid_next`. Mesmo que você não esteja usando replicação baseada em linhas, ainda pode executar eventos de linha de log binário no cliente de linha de comando.

Pare a replica e execute a transação que você copiou. A saída do **mysqlbinlog** define o delimitador como `/*!*/;`, então defina-o de volta para o padrão, assim:

```
mysql> DELIMITER ;
```

Reinicie a replicação a partir da posição correta automaticamente:

```
mysql> SET gtid_next=AUTOMATIC;
mysql> RESET REPLICA;
mysql> START REPLICA;
```