### 19.4.6 Replicação de Diferentes Bancos de Dados para Diferentes Replicas

Pode haver situações em que você tenha um único servidor fonte e queira replicar diferentes bancos de dados para diferentes replicas. Por exemplo, você pode querer distribuir diferentes dados de vendas para diferentes departamentos para ajudar a distribuir a carga durante a análise de dados. Uma amostra desse layout é mostrada na Figura 19.2, “Replicação de Bancos de Dados para Replicas Separadas”.

**Figura 19.2 Replicação de Bancos de Dados para Replicas Separadas**

![O servidor fonte MySQL tem três bancos de dados, bancoA, bancoB e bancoC. bancoA é replicado apenas para a Replica MySQL 1, bancoB é replicado apenas para a Replica MySQL 2 e bancoC é replicado apenas para a Replica MySQL 3.](images/multi-db.png)

Você pode alcançar essa separação configurando o servidor fonte e as replicas como normais e, em seguida, limitando as declarações do log binário que cada replica processa usando a opção de configuração `--replicate-wild-do-table` em cada replica.

Importante

Você *não* deve usar `--replicate-do-db` para esse propósito ao usar a replicação baseada em declarações, pois a replicação baseada em declarações faz com que os efeitos dessa opção variem de acordo com o banco de dados atualmente selecionado. Isso se aplica também à replicação de formato misto, pois isso permite que algumas atualizações sejam replicadas usando o formato baseada em declarações.

No entanto, deve ser seguro usar `--replicate-do-db` para esse propósito se você estiver usando apenas a replicação baseada em linhas, pois, neste caso, o banco de dados atualmente selecionado não tem efeito na operação da opção.

Por exemplo, para suportar a separação mostrada na Figura 19.2, “Replicação de Bancos de Dados para Replicas Separadas”, você deve configurar cada replica da seguinte forma, antes de executar `START REPLICA`:

* A Replica 1 deve usar `--replicate-wild-do-table=bancoA.%`.

* A réplica 2 deve usar `--replicate-wild-do-table=databaseB.%`.

* A réplica 3 deve usar `--replicate-wild-do-table=databaseC.%`.

Cada réplica nesta configuração recebe o log binário completo da fonte, mas executa apenas os eventos do log binário que se aplicam às bases de dados e tabelas incluídas pela opção `--replicate-wild-do-table` em vigor naquela réplica.

Se você tiver dados que precisam ser sincronizados com as réplicas antes que a replicação comece, você tem várias opções:

* Sincronize todos os dados com cada réplica e exclua as bases de dados, tabelas ou ambas que você não deseja manter.

* Use o **mysqldump** para criar um arquivo de dump separado para cada base de dados e carregar o arquivo de dump apropriado em cada réplica.

* Use um dump de arquivo de dados bruto e inclua apenas os arquivos e bases de dados específicos que você precisa para cada réplica.

Observação

Isso não funciona com bases de dados `InnoDB`, a menos que você use `innodb_file_per_table`.