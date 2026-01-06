### 16.3.5 Replicação de diferentes bancos de dados em diferentes réplicas

Pode haver situações em que você tenha uma única fonte e queira replicar diferentes bancos de dados para diferentes réplicas. Por exemplo, você pode querer distribuir diferentes dados de vendas para diferentes departamentos para ajudar a distribuir a carga durante a análise de dados. Uma amostra desse layout é mostrada em Figura 16.2, “Replicação de Bancos de Dados para Replicas Separadas”.

**Figura 16.2: Replicação de bancos de dados para separar réplicas**

![A fonte do MySQL tem três bancos de dados, bancoA, bancoB e bancoC. O bancoA é replicado apenas para a Replica 1 do MySQL, o bancoB é replicado apenas para a Replica 2 do MySQL e o bancoC é replicado apenas para a Replica 3 do MySQL.](images/multi-db.png)

Você pode alcançar essa separação configurando a fonte e as réplicas como normais e, em seguida, limitando as declarações do log binário que cada réplica processa usando a opção de configuração `--replicate-wild-do-table` em cada réplica.

Importante

Você *não* deve usar `--replicate-do-db` para esse propósito ao usar a replicação baseada em instruções, pois a replicação baseada em instruções faz com que os efeitos dessa opção variem de acordo com o banco de dados selecionado atualmente. Isso também se aplica à replicação de formato misto, pois isso permite que algumas atualizações sejam replicadas usando o formato baseada em instruções.

No entanto, deve ser seguro usar `--replicate-do-db` para este propósito se você estiver usando apenas replicação baseada em linhas, pois, neste caso, o banco de dados atualmente selecionado não afeta o funcionamento da opção.

Por exemplo, para suportar a separação conforme mostrado na Figura 16.2, “Replicação de bancos de dados para separar réplicas”, você deve configurar cada replica da seguinte forma, antes de executar `START SLAVE`:

- A réplica 1 deve usar `--replicate-wild-do-table=databaseA.%`.

- A réplica 2 deve usar `--replicate-wild-do-table=databaseB.%`.

- A réplica 3 deve usar `--replicate-wild-do-table=databaseC.%`.

Cada réplica nessa configuração recebe todo o log binário da fonte, mas executa apenas os eventos do log binário que se aplicam às bases de dados e tabelas incluídas pela opção `--replicate-wild-do-table` em vigor naquela réplica.

Se você tiver dados que precisam ser sincronizados com as réplicas antes que a replicação comece, você tem várias opções:

- Sincronize todos os dados para cada replica e exclua os bancos de dados, tabelas ou ambos que você não deseja manter.

- Use **mysqldump** para criar um arquivo de dump separado para cada banco de dados e carregar o arquivo de dump apropriado em cada replica.

- Use um dump de arquivo de dados brutos e inclua apenas os arquivos e bancos de dados específicos que você precisa para cada replica.

  Nota

  Isso não funciona com bancos de dados ``InnoDB` a menos que você use ``innodb_file_per_table`.
