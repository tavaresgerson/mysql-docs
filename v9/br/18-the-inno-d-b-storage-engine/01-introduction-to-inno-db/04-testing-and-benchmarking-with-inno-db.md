### 17.1.4 Testes e Benchmarking com InnoDB

Se o `InnoDB` não for o motor de armazenamento padrão, você pode determinar se o servidor de banco de dados e as aplicações funcionam corretamente com o `InnoDB` reiniciando o servidor com `--default-storage-engine=InnoDB` definido na linha de comando ou com `default-storage-engine=innodb` definido na seção `[mysqld]` do arquivo de opções do servidor MySQL.

Como a mudança do motor de armazenamento padrão afeta apenas tabelas recém-criadas, execute as etapas de instalação e configuração da aplicação para confirmar que tudo é instalado corretamente, e, em seguida, exerça as funcionalidades da aplicação para garantir que os recursos de carregamento, edição e consulta de dados funcionem. Se uma tabela depende de um recurso específico de outro motor de armazenamento, você receberá um erro. Nesse caso, adicione a cláusula `ENGINE=other_engine_name` à declaração `CREATE TABLE` para evitar o erro.

Se você não tomou uma decisão deliberada sobre o motor de armazenamento e deseja visualizar como certas tabelas funcionam quando criadas usando o `InnoDB`, execute o comando `ALTER TABLE table_name ENGINE=InnoDB;` para cada tabela. Alternativamente, para executar consultas de teste e outras declarações sem perturbar a tabela original, faça uma cópia:

```
CREATE TABLE ... ENGINE=InnoDB AS SELECT * FROM other_engine_table;
```

Para avaliar o desempenho com uma aplicação completa sob uma carga de trabalho realista, instale o servidor MySQL mais recente e execute benchmarks.

Teste o ciclo de vida completo da aplicação, desde a instalação, passando pelo uso intenso e o reinício do servidor. Interrompa o processo do servidor enquanto o banco de dados estiver ocupado para simular uma falha de energia e verifique se os dados são recuperados com sucesso ao reiniciar o servidor.

Teste quaisquer configurações de replicação, especialmente se você usar diferentes versões e opções do MySQL no servidor de origem e nas réplicas.