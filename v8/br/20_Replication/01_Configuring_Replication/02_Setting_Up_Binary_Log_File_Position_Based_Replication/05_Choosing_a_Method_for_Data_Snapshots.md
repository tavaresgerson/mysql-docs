#### 19.1.2.5 Escolher um Método para Instantâneos de Dados

Se o banco de dados de origem contiver dados existentes, é necessário copiar esses dados para cada replica. Existem diferentes maneiras de fazer o dump dos dados do banco de origem. As seções a seguir descrevem as opções possíveis.

Para selecionar o método apropriado de descarte do banco de dados, escolha entre essas opções:

- Use a ferramenta **mysqldump** para criar um dump de todos os bancos de dados que você deseja replicar. Esse é o método recomendado, especialmente quando estiver usando `InnoDB`.

- Se o seu banco de dados estiver armazenado em arquivos portáteis binários, você pode copiar os arquivos de dados brutos para uma replica. Isso pode ser mais eficiente do que usar o **mysqldump** e importar o arquivo em cada replica, pois evita o overhead de atualizar índices à medida que as instruções `INSERT` são reexecutadas. Com motores de armazenamento como o `InnoDB`, isso não é recomendado.

- Use o plugin de clone do MySQL Server para transferir todos os dados de uma replica existente para um clone. Para obter instruções sobre como usar esse método, consulte a Seção 7.6.7.7, “Clonagem para Replicação”.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster se integra perfeitamente ao MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. Para casos de uso semelhantes que não exigem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

##### 19.1.2.5.1 Criando um instantâneo de dados usando mysqldump

Para criar um instantâneo dos dados em um banco de dados de origem existente, use a ferramenta **mysqldump**. Após a conclusão do dump de dados, importe esses dados na replica antes de iniciar o processo de replicação.

O exemplo a seguir descarrega todos os bancos de dados em um arquivo chamado `dbdump.db` e inclui a opção `--master-data`, que anexa automaticamente a instrução `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` necessária na replica para iniciar o processo de replicação:

```
$> mysqldump --all-databases --master-data > dbdump.db
```

Nota

Se você não usar `--master-data`, então é necessário bloquear todas as tabelas em uma sessão separada manualmente. Veja a Seção 19.1.2.4, “Obtenção das coordenadas do log binário de origem da replicação”.

É possível excluir determinadas bases de dados do dump usando a ferramenta **mysqldump**. Se você quiser escolher quais bases de dados incluir no dump, não use `--all-databases`. Escolha uma dessas opções:

- Exclua todas as tabelas no banco de dados usando a opção `--ignore-table`.

- Nomeie apenas os bancos de dados que você deseja descartar usando a opção `--databases`.

Nota

Por padrão, se os GTIDs estiverem em uso na fonte (`gtid_mode=ON`), o **mysqldump** inclui os GTIDs do conjunto `gtid_executed` da fonte na saída do dump para adicioná-los ao conjunto `gtid_purged` da replica. Se você está fazendo o dump apenas de bancos de dados ou tabelas específicos, é importante notar que o valor incluído pelo **mysqldump** inclui os GTIDs de todas as transações no conjunto `gtid_executed` da fonte, mesmo aquelas que alteraram partes suprimidas do banco de dados ou outros bancos de dados no servidor que não foram incluídos no dump parcial. Verifique a descrição da opção `--set-gtid-purged` do **mysqldump** para encontrar o resultado do comportamento padrão para as versões do MySQL Server que você está usando e como alterar o comportamento se esse resultado não for adequado para sua situação.

Para obter mais informações, consulte a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”.

Para importar os dados, copie o arquivo de dump para a replica ou acesse o arquivo na fonte ao se conectar remotamente à replica.

##### 19.1.2.5.2 Criando um instantâneo de dados usando arquivos de dados brutos

Esta seção descreve como criar um instantâneo de dados usando os arquivos brutos que compõem o banco de dados. Empregar esse método com uma tabela usando um mecanismo de armazenamento que possui algoritmos complexos de cache ou registro requer etapas extras para produzir um instantâneo perfeito “no momento atual”: o comando de cópia inicial pode deixar de fora informações de cache e atualizações de registro, mesmo que você tenha adquirido um bloqueio de leitura global. Como o mecanismo de armazenamento responde a isso depende de suas capacidades de recuperação em caso de falha.

Se você usar as tabelas `InnoDB`, pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para produzir um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que está incluído como parte de uma assinatura do MySQL Enterprise. Consulte a Seção 32.1, “MySQL Enterprise Backup Overview” para obter informações detalhadas.

Esse método também não funciona de forma confiável se a fonte e a réplica tiverem valores diferentes para `ft_stopword_file`, `ft_min_word_len` ou `ft_max_word_len` e você estiver copiando tabelas com índices de texto completo.

Se as exceções acima não se aplicarem ao seu banco de dados, use a técnica de backup frio para obter um instantâneo binário confiável das tabelas do `InnoDB`: faça um desligamento lento do servidor MySQL e, em seguida, copie os arquivos de dados manualmente.

Para criar um instantâneo de dados brutos das tabelas `MyISAM` quando seus arquivos de dados MySQL estiverem em um único sistema de arquivos, você pode usar ferramentas padrão de cópia de arquivos, como **cp** ou **copy**, uma ferramenta de cópia remota, como **scp** ou **rsync**, uma ferramenta de arquivamento, como **zip** ou **tar**, ou uma ferramenta de instantâneo de sistema de arquivos, como **dump**. Se você está replicando apenas certos bancos de dados, copie apenas os arquivos que se relacionam com essas tabelas. Para `InnoDB`, todas as tabelas em todos os bancos de dados estão armazenadas nos arquivos do espaço de tabelas do sistema, a menos que a opção `innodb_file_per_table` esteja habilitada.

Os seguintes arquivos não são necessários para a replicação:

- Arquivos relacionados ao banco de dados `mysql`.

- O arquivo de repositório de metadados de conexão da réplica `master.info`, se usado; o uso deste arquivo é agora desaconselhado (consulte a Seção 19.2.4, "Repositórios de Log de Relógio e Metadados de Replicação").

- Os arquivos de log binários da fonte, com exceção do arquivo de índice do log binário, se você vai usá-lo para localizar as coordenadas do log binário da fonte para a replica.

- Quaisquer arquivos de registro de relé.

Dependendo de você estar usando tabelas `InnoDB` ou não, escolha uma das seguintes opções:

Se você estiver usando tabelas `InnoDB` e também quiser obter os resultados mais consistentes com um instantâneo de dados brutos, desligue o servidor de origem durante o processo, da seguinte forma:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 19.1.2.4, “Obtenção das coordenadas do log binário da fonte de replicação”.

2. Em uma sessão separada, desligue o servidor de origem:

   ```
   $> mysqladmin shutdown
   ```

3. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas mais comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Reinicie o servidor de origem.

Se você não estiver usando as tabelas `InnoDB`, você pode obter uma captura de tela do sistema de uma fonte sem desligar o servidor, conforme descrito nas etapas a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 19.1.2.4, “Obtenção das coordenadas do log binário da fonte de replicação”.

2. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas mais comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. No cliente onde você adquiriu o bloqueio de leitura, libere o bloqueio:

   ```
   mysql> UNLOCK TABLES;
   ```

Depois de criar o arquivo ou cópia do banco de dados, copie os arquivos para cada replica antes de iniciar o processo de replicação.
