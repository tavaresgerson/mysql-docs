#### 16.1.2.4 Escolhendo um Método para Instantâneos de Dados

Se o banco de dados da fonte contiver dados existentes, é necessário copiar esses dados para cada replica. Existem diferentes maneiras de fazer o dump dos dados da fonte. As seções a seguir descrevem as opções possíveis.

Para selecionar o método apropriado de descarte do banco de dados, escolha entre essas opções:

- Use a ferramenta **mysqldump** para criar um dump de todos os bancos de dados que você deseja replicar. Esse é o método recomendado, especialmente ao usar o `InnoDB`.

- Se o seu banco de dados estiver armazenado em arquivos portáteis binários, você pode copiar os arquivos de dados brutos para uma replica. Isso pode ser mais eficiente do que usar **mysqldump** e importar o arquivo em cada replica, pois evita o overhead de atualizar índices à medida que as instruções `INSERT` são reexecutadas. Com motores de armazenamento como `InnoDB`, isso não é recomendado.

##### 16.1.2.4.1 Criando um instantâneo de dados usando mysqldump

Para criar um instantâneo dos dados em uma fonte existente, use a ferramenta **mysqldump**. Após a conclusão do dump de dados, importe esses dados na replica antes de iniciar o processo de replicação.

O exemplo a seguir descarrega todas as bases de dados em um arquivo chamado `dbdump.db` e inclui a opção `--master-data`, que anexa automaticamente a instrução `CHANGE MASTER TO` necessária na replica para iniciar o processo de replicação:

```sql
$> mysqldump --all-databases --master-data > dbdump.db
```

Nota

Se você não usar `--master-data`, então é necessário bloquear todas as tabelas em uma sessão separada manualmente. Veja Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

É possível excluir determinadas bases de dados do dump usando a ferramenta **mysqldump**. Se você quiser escolher quais bases de dados incluir no dump, não use `--all-databases`. Escolha uma dessas opções:

- Exclua todas as tabelas no banco de dados usando a opção `--ignore-table`.

- Nomeie apenas os bancos de dados que você deseja exportar usando a opção `--databases`.

Para obter mais informações, consulte Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”.

Para importar os dados, copie o arquivo de dump para a replica ou acesse o arquivo na fonte ao se conectar remotamente à replica.

##### 16.1.2.4.2 Criando um Instantâneo de Dados Usando Arquivos de Dados Brutos

Esta seção descreve como criar um instantâneo de dados usando os arquivos brutos que compõem o banco de dados. Empregar esse método com uma tabela usando um mecanismo de armazenamento que possui algoritmos complexos de cache ou registro requer etapas extras para produzir um instantâneo perfeito “no momento atual”: o comando de cópia inicial pode deixar de fora informações de cache e atualizações de registro, mesmo que você tenha adquirido um bloqueio de leitura global. Como o mecanismo de armazenamento responde a isso depende de suas capacidades de recuperação em caso de falha.

Se você estiver usando tabelas do tipo `InnoDB`, você pode usar o comando **mysqlbackup** do componente MySQL Enterprise Backup para criar um instantâneo consistente. Esse comando registra o nome do log e o deslocamento correspondentes ao instantâneo a ser usado na replica. O MySQL Enterprise Backup é um produto comercial que está incluído como parte de uma assinatura do MySQL Enterprise. Consulte Seção 28.1, “MySQL Enterprise Backup Overview” para obter informações detalhadas.

Esse método também não funciona de forma confiável se a fonte e a replica tiverem valores diferentes para `ft_stopword_file`, `ft_min_word_len` ou `ft_max_word_len` e você estiver copiando tabelas com índices de texto completo.

Se as exceções acima não se aplicarem ao seu banco de dados, use a técnica de backup frio para obter um instantâneo binário confiável das tabelas do `InnoDB`: faça um desligamento lento do servidor MySQL e, em seguida, copie os arquivos de dados manualmente.

Para criar um instantâneo de dados brutos das tabelas de `MyISAM` quando seus arquivos de dados MySQL estiverem em um único sistema de arquivos, você pode usar ferramentas padrão de cópia de arquivos, como **cp** ou **copy**, uma ferramenta de cópia remota, como **scp** ou **rsync**, uma ferramenta de arquivamento, como **zip** ou **tar**, ou uma ferramenta de instantâneo de sistema de arquivos, como **dump**. Se você está replicando apenas certos bancos de dados, copie apenas os arquivos que se relacionam com essas tabelas. Para `InnoDB`, todas as tabelas em todos os bancos de dados são armazenadas nos arquivos do espaço de tabelas do sistema, a menos que você tenha a opção `innodb_file_per_table` habilitada.

Os seguintes arquivos não são necessários para a replicação:

- Arquivos relacionados ao banco de dados `mysql`.

- O arquivo de repositório de metadados de conexão da réplica, se utilizado (consulte Seção 16.2.4, "Repositórios de Log de Relógio e Metadados de Replicação").

- Os arquivos de log binários da fonte, com exceção do arquivo de índice do log binário, se você vai usá-lo para localizar as coordenadas do log binário da fonte para a replica.

- Quaisquer arquivos de registro de relay.

Dependendo de você estar usando tabelas `InnoDB` ou não, escolha uma das seguintes opções:

Se você estiver usando tabelas do `InnoDB` e também quiser obter os resultados mais consistentes com um instantâneo de dados brutos, desligue o servidor de origem durante o processo, conforme descrito a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

2. Em uma sessão separada, desligue o servidor de origem:

   ```sql
   $> mysqladmin shutdown
   ```

3. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas mais comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Reinicie o servidor de origem.

Se você não estiver usando tabelas do `InnoDB`, você pode obter um instantâneo do sistema a partir de uma fonte sem desligar o servidor, conforme descrito nas etapas a seguir:

1. Adquira um bloqueio de leitura e obtenha o status da fonte. Veja Seção 16.1.2.3, “Obtenção das coordenadas do log binário da fonte de replicação”.

2. Faça uma cópia dos arquivos de dados do MySQL. Os exemplos a seguir mostram as formas mais comuns de fazer isso. Você precisa escolher apenas uma delas:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. No cliente onde você adquiriu o bloqueio de leitura, libere o bloqueio:

   ```sql
   mysql> UNLOCK TABLES;
   ```

Depois de criar o arquivo ou cópia do banco de dados, copie os arquivos para cada replica antes de iniciar o processo de replicação.
