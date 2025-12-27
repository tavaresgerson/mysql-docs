#### 19.1.2.5 Escolhendo um Método para Instantâneos de Dados

Se o banco de dados de origem contiver dados existentes, é necessário copiar esses dados para cada replica. Existem diferentes maneiras de fazer o dump dos dados do banco de dados de origem. As seções a seguir descrevem as opções possíveis.

Para selecionar o método apropriado de fazer o dump do banco de dados, escolha entre as seguintes opções:

* Use a ferramenta **mysqldump** para criar um dump de todos os bancos de dados que você deseja replicar. Esse é o método recomendado, especialmente quando se usa o `InnoDB`.

* Se o seu banco de dados estiver armazenado em arquivos binários portáteis, você pode copiar os arquivos de dados brutos para uma replica. Isso pode ser mais eficiente do que usar **mysqldump** e importar o arquivo em cada replica, pois evita o overhead de atualizar índices à medida que as instruções `INSERT` são regravadas. Com motores de armazenamento como o `InnoDB`, isso não é recomendado.

* Use o plugin de clonagem do MySQL Server para transferir todos os dados de uma replica existente para um clone. Para instruções sobre como usar esse método, consulte a Seção 7.6.6.7, “Clonagem para Replicação”.

Dica

Para implantar múltiplas instâncias do MySQL, você pode usar o InnoDB Cluster, que permite administrar facilmente um grupo de instâncias do servidor MySQL no MySQL Shell. O InnoDB Cluster envolve a Replicação de Grupo do MySQL em um ambiente programático que permite implantar facilmente um clúster de instâncias do MySQL para alcançar alta disponibilidade. Além disso, o InnoDB Cluster interage perfeitamente com o MySQL Router, que permite que suas aplicações se conectem ao clúster sem precisar escrever seu próprio processo de falha. Para casos de uso semelhantes que não requerem alta disponibilidade, no entanto, você pode usar o InnoDB ReplicaSet. As instruções de instalação para o MySQL Shell podem ser encontradas aqui.

##### 19.1.2.5.1 Criando um Instantâneo de Dados Usando mysqldump

Para criar um instantâneo dos dados em um banco de dados de origem existente, use a ferramenta **mysqldump**. Após a conclusão do dump de dados, importe esses dados na replica antes de iniciar o processo de replicação.

O seguinte exemplo grava todos os bancos de dados em um arquivo chamado `dbdump.db` e inclui a opção `--source-data`, que anexa automaticamente a declaração `ALTER REPLICATION SOURCE TO` necessária na replica para iniciar o processo de replicação:

```
$> mysqldump --all-databases --source-data > dbdump.db
```

Observação

Se você não usar `--source-data`, será necessário bloquear todas as tabelas em uma sessão separada manualmente. Consulte a Seção 19.1.2.4, “Obtenção das coordenadas do log binário da fonte de replicação”.

É possível excluir certos bancos de dados do dump usando a ferramenta **mysqldump**. Se você quiser escolher quais bancos de dados incluir no dump, não use `--all-databases`. Escolha uma dessas opções:

* Exclua todas as tabelas do banco de dados usando a opção `--ignore-table`.

* Nomeie apenas os bancos de dados que você deseja dumper usando a opção `--databases`.

Observação

Por padrão, se os GTIDs estiverem em uso na fonte (`gtid_mode=ON`), o **mysqldump** inclui os GTIDs do conjunto `gtid_executed` na fonte no resultado do dump para adicioná-los ao conjunto `gtid_purged` na replica. Se você está fazendo o dump de apenas bancos de dados ou tabelas específicos, é importante notar que o valor incluído pelo **mysqldump** inclui os GTIDs de todas as transações no conjunto `gtid_executed` na fonte, mesmo aquelas que alteraram partes suprimidas do banco de dados ou outros bancos de dados no servidor que não foram incluídos no dump parcial. Consulte a descrição da opção `--set-gtid-purged` do mysqldump para obter o resultado do comportamento padrão para as versões do MySQL Server que você está usando e como alterar o comportamento se esse resultado não for adequado para sua situação.

Para mais informações, consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”.

Para importar os dados, copie o arquivo do dump para a replica ou acesse o arquivo da fonte ao se conectar remotamente à replica.

##### 19.1.2.5.2 Criando um Instantâneo de Dados Usando Arquivos de Dados Brutos

Esta seção descreve como criar um instantâneo de dados usando os arquivos brutos que compõem o banco de dados. Empregar esse método com uma tabela usando um mecanismo de armazenamento que possui algoritmos de cache ou registro complexos requer etapas extras para produzir um instantâneo perfeito “no momento atual”: o comando de cópia inicial pode deixar de fora informações de cache e atualizações de registro, mesmo que você tenha adquirido um bloqueio de leitura global. Como o mecanismo de armazenamento responde a isso depende de suas capacidades de recuperação em caso de falha.

Se você estiver usando tabelas do tipo `InnoDB`, pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para criar um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que está incluído como parte de uma assinatura do MySQL Enterprise. Consulte a Seção 32.1, “Visão geral do MySQL Enterprise Backup”, para obter informações detalhadas.

Esse método também não funciona de forma confiável se a fonte e a replica tiverem valores diferentes para `ft_stopword_file`, `ft_min_word_len` ou `ft_max_word_len` e você estiver copiando tabelas com índices full-text.

Supondo que as exceções acima não se apliquem ao seu banco de dados, use a técnica de backup frio para obter um instantâneo binário confiável das tabelas `InnoDB`: faça um desligamento lento do MySQL Server, depois copie os arquivos de dados manualmente.

Para criar um instantâneo de dados brutos das tabelas `MyISAM` quando seus arquivos de dados MySQL estiverem em um único sistema de arquivos, você pode usar ferramentas padrão de cópia de arquivos, como **cp** ou **copy**, uma ferramenta de cópia remota, como **scp** ou **rsync**, uma ferramenta de arquivamento, como **zip** ou **tar**, ou uma ferramenta de instantâneo de sistema de arquivos, como **dump**. Se você estiver replicando apenas certos bancos de dados, copie apenas os arquivos que se relacionam com essas tabelas. Para `InnoDB`, todas as tabelas em todos os bancos de dados são armazenadas nos arquivos do espaço de tabelas do sistema, a menos que você tenha a opção `innodb_file_per_table` habilitada.

Os seguintes arquivos não são necessários para a replicação:

* Arquivos relacionados ao banco de dados `mysql`.
* O arquivo de repositório de metadados de conexão da replica `master.info`, se usado; o uso desse arquivo agora é desaconselhado (consulte a Seção 19.2.4, “Repositórios de metadados de log e replicação de relé”).

* Os arquivos de log binários da fonte, com exceção do arquivo de índice do log binário da fonte, se você vai usá-lo para localizar as coordenadas do log binário de origem da replica.

* Quaisquer arquivos de log de relevo.

Dependendo de você estar usando tabelas `InnoDB` ou não, escolha uma das seguintes opções:

Se você estiver usando tabelas `InnoDB` e também quiser obter os resultados mais consistentes com um instantâneo de dados brutos, desligue o servidor de origem durante o processo, conforme descrito a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 19.1.2.4, “Obtendo as coordenadas do log binário de origem da replicação”.

2. Em uma sessão separada, desligue o servidor de origem:

   ```
   $> mysqladmin shutdown
   ```

3. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as maneiras comuns de fazer isso. Você precisa escolher apenas um deles:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Reinicie o servidor de origem.

Se você não estiver usando tabelas `InnoDB`, pode obter um instantâneo do sistema de uma fonte sem desligar o servidor, conforme descrito nas etapas a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja a Seção 19.1.2.4, “Obtendo as coordenadas do log binário de origem da replicação”.

2. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as maneiras comuns de fazer isso. Você precisa escolher apenas um deles:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. No cliente onde você adquiriu o bloqueio de leitura, libere o bloqueio:

   ```
   mysql> UNLOCK TABLES;
   ```

Uma vez que você tenha criado o arquivo ou cópia do banco de dados, copie os arquivos para cada replica antes de iniciar o processo de replicação.