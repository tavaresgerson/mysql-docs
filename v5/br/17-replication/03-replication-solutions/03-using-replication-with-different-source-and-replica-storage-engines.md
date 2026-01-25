### 16.3.3 Usando Replication com Diferentes Storage Engines no Source e na Replica

Para o processo de Replication, não importa se a tabela Source no Source e a tabela replicada na Replica usam diferentes tipos de engine. De fato, a variável de sistema [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) não é replicada.

Isso oferece uma série de benefícios no processo de Replication, permitindo que você aproveite diferentes tipos de engine para diferentes cenários de Replication. Por exemplo, em um cenário típico de Scale-Out (consulte [Section 16.3.4, “Using Replication for Scale-Out”](replication-solutions-scaleout.html "16.3.4 Usando Replication para Scale-Out")), você pode querer usar tabelas `InnoDB` no Source para tirar proveito da funcionalidade transacional, mas usar `MyISAM` nas Replicas onde o suporte a transaction não é necessário porque os dados são apenas lidos. Ao usar Replication em um ambiente de registro de dados (data-logging), você pode querer usar o Storage Engine `Archive` na Replica.

A configuração de diferentes engines no Source e na Replica depende de como você configurou o processo inicial de Replication:

*   Se você usou [**mysqldump**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database") para criar o snapshot da Database no seu Source, você pode editar o texto do arquivo dump para alterar o tipo de engine usado em cada tabela.

    Outra alternativa para o [**mysqldump**](mysqldump.html "4.5.4 mysqldump — Um Programa de Backup de Database") é desabilitar os tipos de engine que você não deseja usar na Replica antes de usar o dump para construir os dados na Replica. Por exemplo, você pode adicionar a opção [`--skip-federated`](innodb-parameters.html#option_mysqld_innodb) na sua Replica para desabilitar o engine `FEDERATED`. Se um engine específico não existir para uma tabela a ser criada, o MySQL usará o tipo de engine padrão, geralmente `MyISAM`. (Isso exige que o SQL mode [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution) não esteja habilitado.) Se você quiser desabilitar engines adicionais dessa forma, você pode considerar a construção de um binário especial a ser usado na Replica que suporte apenas os engines que você deseja.

*   Se você estiver usando arquivos de dados brutos (um backup binário) para configurar a Replica, você não pode alterar o formato inicial da tabela. Em vez disso, use [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") para alterar os tipos de tabela depois que a Replica for iniciada.

*   Para novas configurações de Replication Source/Replica onde atualmente não há tabelas no Source, evite especificar o tipo de engine ao criar novas tabelas.

Se você já está executando uma solução de Replication e deseja converter suas tabelas existentes para outro tipo de engine, siga estas etapas:

1.  Pare a Replica de executar as atualizações de Replication:

    ```sql
   mysql> STOP SLAVE;
   ```

    Isso permite que você altere os tipos de engine sem interrupções.

2.  Execute um `ALTER TABLE ... ENGINE='engine_type'` para cada tabela a ser alterada.

3.  Inicie o processo de Replication novamente:

    ```sql
   mysql> START SLAVE;
   ```

Embora a variável [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) não seja replicada, esteja ciente de que as instruções [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE") e [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") que incluem a especificação do engine são replicadas corretamente para a Replica. Por exemplo, se você tiver uma tabela CSV e executar:

```sql
mysql> ALTER TABLE csvtable Engine='MyISAM';
```

A instrução anterior é replicada para a Replica e o tipo de engine na Replica é convertido para `MyISAM`, mesmo que você tenha alterado anteriormente o tipo de tabela na Replica para um engine diferente de CSV. Se você deseja manter diferenças de engine entre Source e Replica, você deve ter cuidado ao usar a variável [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) no Source ao criar uma nova tabela. Por exemplo, em vez de:

```sql
mysql> CREATE TABLE tablea (columna int) Engine=MyISAM;
```

Use este formato:

```sql
mysql> SET default_storage_engine=MyISAM;
mysql> CREATE TABLE tablea (columna int);
```

Quando replicada, a variável [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) será ignorada, e a instrução [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE") será executada na Replica usando o engine padrão da Replica.
