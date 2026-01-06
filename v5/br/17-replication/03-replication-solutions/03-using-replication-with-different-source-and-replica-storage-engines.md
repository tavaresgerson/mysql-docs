### 16.3.3 Uso da replicação com diferentes motores de armazenamento de origem e réplica

Não importa para o processo de replicação se a tabela de origem na origem e a tabela replicada na replica utilizam diferentes tipos de motor. De fato, a variável de sistema `default_storage_engine` não é replicada.

Isso oferece vários benefícios no processo de replicação, pois você pode aproveitar diferentes tipos de motores para diferentes cenários de replicação. Por exemplo, em um cenário típico de escala para fora (veja Seção 16.3.4, “Usando replicação para escala para fora”), você deseja usar tabelas `InnoDB` na fonte para aproveitar a funcionalidade transacional, mas usar `MyISAM` nas réplicas onde o suporte a transações não é necessário, porque os dados são apenas lidos. Ao usar a replicação em um ambiente de registro de dados, você pode querer usar o motor de armazenamento `Archive` na replica.

Configurar diferentes motores na fonte e na replica depende de como você configura o processo de replicação inicial:

- Se você usou **mysqldump** para criar o instantâneo do banco de dados na sua fonte, você pode editar o texto do arquivo de dump para alterar o tipo de motor usado em cada tabela.

  Outra alternativa para **mysqldump** é desabilitar os tipos de motor que você não deseja usar na replica antes de usar o dump para construir os dados na replica. Por exemplo, você pode adicionar a opção `--skip-federated` na sua replica para desabilitar o motor `FEDERATED`. Se um motor específico não existir para uma tabela ser criada, o MySQL usa o tipo de motor padrão, geralmente `MyISAM`. (Isso requer que o modo SQL `NO_ENGINE_SUBSTITUTION` não esteja habilitado.) Se você quiser desabilitar motores adicionais dessa maneira, pode considerar a construção de um binário especial para ser usado na replica que suporte apenas os motores que você deseja.

- Se você estiver usando arquivos de dados brutos (um backup binário) para configurar a replica, não poderá alterar o formato da tabela inicial. Em vez disso, use `ALTER TABLE` para alterar os tipos de tabela após a replica ter sido iniciada.

- Para novas configurações de replicação de fonte/replica onde atualmente não existem tabelas na fonte, evite especificar o tipo de motor ao criar novas tabelas.

Se você já está executando uma solução de replicação e deseja converter suas tabelas existentes para outro tipo de motor, siga estes passos:

1. Parar a replicação de atualizações:

   ```sql
   mysql> STOP SLAVE;
   ```

   Isso permite que você mude os tipos de motor sem interrupções.

2. Execute uma `ALTER TABLE ... ENGINE='engine_type'` para cada tabela que será alterada.

3. Comece o processo de replicação novamente:

   ```sql
   mysql> START SLAVE;
   ```

Embora a variável `default_storage_engine` não seja replicada, esteja ciente de que as instruções `CREATE TABLE` e `ALTER TABLE` que incluem a especificação do motor são replicadas corretamente para a réplica. Por exemplo, se você tiver uma tabela CSV e executar:

```sql
mysql> ALTER TABLE csvtable Engine='MyISAM';
```

A declaração anterior é replicada para a réplica e o tipo de motor na réplica é convertido para `MyISAM`, mesmo que você tenha alterado anteriormente o tipo de tabela na réplica para um motor diferente do CSV. Se você deseja manter as diferenças de motor na fonte e na réplica, você deve ter cuidado ao usar a variável `default_storage_engine` na fonte ao criar uma nova tabela. Por exemplo, em vez de:

```sql
mysql> CREATE TABLE tablea (columna int) Engine=MyISAM;
```

Utilize este formato:

```sql
mysql> SET default_storage_engine=MyISAM;
mysql> CREATE TABLE tablea (columna int);
```

Quando replicada, a variável `default_storage_engine` será ignorada, e a instrução `CREATE TABLE` será executada na replica usando o motor padrão da replica.
