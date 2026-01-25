### 14.1.4 Testes e Benchmarking com InnoDB

Se o `InnoDB` não for o default storage engine, você pode determinar se o seu servidor de Database e as aplicações funcionam corretamente com o `InnoDB` reiniciando o servidor com `--default-storage-engine=InnoDB` na linha de comando ou com `default-storage-engine=innodb` definido na seção `[mysqld]` do arquivo de opções do servidor MySQL.

Uma vez que a alteração do default storage engine afeta apenas as tabelas recém-criadas, execute as etapas de instalação e setup da sua aplicação para confirmar que tudo é instalado corretamente. Em seguida, utilize os recursos da aplicação para garantir que os recursos de data loading, edição e Query funcionem. Se uma tabela depender de um recurso específico de outro storage engine, você receberá um erro. Neste caso, adicione a cláusula `ENGINE=other_engine_name` à instrução `CREATE TABLE` para evitar o erro.

Se você não tomou uma decisão deliberada sobre o storage engine, e deseja visualizar como certas tabelas funcionam quando criadas usando `InnoDB`, execute o comando `ALTER TABLE table_name ENGINE=InnoDB;` para cada tabela. Alternativamente, para executar Queries de teste e outras instruções sem perturbar a tabela original, faça uma cópia:

```sql
CREATE TABLE ... ENGINE=InnoDB AS SELECT * FROM other_engine_table;
```

Para avaliar o performance com uma aplicação completa sob uma workload realista, instale o servidor MySQL mais recente e execute benchmarks.

Teste todo o ciclo de vida da aplicação, desde a instalação, passando pelo uso intenso e restart do servidor. Encerre (Kill) o processo do servidor enquanto o Database está ocupado para simular uma falha de energia e verifique se os dados são recuperados com sucesso ao reiniciar o servidor.

Teste quaisquer configurações de replication, especialmente se você usar diferentes versões e opções do MySQL no source server e nas replicas.