### 19.4.4 Usando replicação com diferentes motores de armazenamento de origem e réplica

Não importa para o processo de replicação se a tabela original na fonte e a tabela replicada na réplica utilizam diferentes tipos de mecanismo de armazenamento. De fato, a variável de sistema `default_storage_engine` não é replicada.

Isso oferece vários benefícios no processo de replicação, pois você pode aproveitar diferentes tipos de motores para diferentes cenários de replicação. Por exemplo, em um cenário típico de escala para fora (veja a Seção 19.4.5, “Usando replicação para escala para fora”), você deseja usar as tabelas `InnoDB` na fonte para aproveitar a funcionalidade transacional, mas usar `MyISAM` nas réplicas onde o suporte a transações não é necessário, porque os dados são apenas lidos. Ao usar a replicação em um ambiente de registro de dados, você pode querer usar o motor de armazenamento `Archive` na replica.

Configurar diferentes motores na fonte e na replica depende de como você configura o processo de replicação inicial:

- Se você usou o **mysqldump** para criar o instantâneo do banco de dados na sua fonte, você pode editar o texto do arquivo de dump para alterar o tipo de motor usado em cada tabela.

  Outra alternativa para o **mysqldump** é desabilitar os tipos de motor que você não deseja usar na replica antes de usar o dump para construir os dados na replica. Por exemplo, você pode adicionar a opção `--skip-federated` na sua replica para desabilitar o motor `FEDERATED`. Se um motor específico não existir para uma tabela ser criada, o MySQL usa o tipo de motor padrão, geralmente `InnoDB`. (Isso requer que o modo SQL `NO_ENGINE_SUBSTITUTION` não esteja habilitado.) Se você quiser desabilitar motores adicionais dessa maneira, pode considerar a construção de um binário especial para ser usado na replica que suporte apenas os motores que você deseja.

- Se você usar arquivos de dados brutos (um backup binário) para configurar a replica, não é possível alterar o formato da tabela inicial. Em vez disso, use `ALTER TABLE` para alterar os tipos de tabela após a replicação ter sido iniciada.

- Para novas configurações de replicação de fonte/replica onde atualmente não existem tabelas na fonte, evite especificar o tipo de motor ao criar novas tabelas.

Se você já está executando uma solução de replicação e deseja converter suas tabelas existentes para outro tipo de motor, siga estes passos:

1. Parar a replicação de atualizações:

   ```
   mysql> STOP SLAVE;
   Or from MySQL 8.0.22:
   mysql> STOP REPLICA;
   ```

   Isso permite a troca de tipos de motor sem interrupção.

2. Execute um `ALTER TABLE ... ENGINE='engine_type'` para cada tabela que será alterada.

3. Comece o processo de replicação novamente:

   ```
   mysql> START SLAVE;
   ```

   Ou, a partir do MySQL 8.0.22:

   ```
   mysql> START REPLICA;
   ```

Embora a variável `default_storage_engine` não seja replicada, esteja ciente de que as instruções `CREATE TABLE` e `ALTER TABLE` que incluem a especificação do motor são replicadas corretamente para a replica. Se, no caso de uma tabela `CSV`, você executar esta instrução:

```
mysql> ALTER TABLE csvtable ENGINE='MyISAM';
```

Esta declaração é replicada; o tipo de motor da tabela na replica é convertido para `InnoDB`, mesmo que você tenha alterado anteriormente o tipo de tabela na replica para um motor diferente de `CSV`. Se você deseja manter as diferenças de motor na fonte e na replica, você deve ter cuidado ao usar a variável `default_storage_engine` na fonte ao criar uma nova tabela. Por exemplo, em vez de:

```
mysql> CREATE TABLE tablea (columna int) Engine=MyISAM;
```

Utilize este formato:

```
mysql> SET default_storage_engine=MyISAM;
mysql> CREATE TABLE tablea (columna int);
```

Quando replicada, a variável `default_storage_engine` é ignorada e a instrução `CREATE TABLE` é executada na replica usando o motor padrão da replica.
