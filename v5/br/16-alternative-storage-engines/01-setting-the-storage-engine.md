## 15.1 Configurando a Storage Engine

Ao criar uma nova tabela, você pode especificar qual storage engine usar adicionando uma opção de tabela `ENGINE` à instrução `CREATE TABLE`:

```sql
-- ENGINE=INNODB not needed unless you have set a different
-- default storage engine.
CREATE TABLE t1 (i INT) ENGINE = INNODB;
-- Simple table definitions can be switched from one to another.
CREATE TABLE t2 (i INT) ENGINE = CSV;
CREATE TABLE t3 (i INT) ENGINE = MEMORY;
```

Quando você omite a opção `ENGINE`, a storage engine padrão é usada. A engine padrão é `InnoDB` no MySQL 5.7. Você pode especificar a engine padrão usando a opção de inicialização do servidor `--default-storage-engine`, ou definindo a opção `default-storage-engine` no arquivo de configuração `my.cnf`.

Você pode definir a storage engine padrão para a SESSION atual configurando a variável `default_storage_engine`:

```sql
SET default_storage_engine=NDBCLUSTER;
```

A storage engine para tabelas `TEMPORARY` criadas com `CREATE TEMPORARY TABLE` pode ser definida separadamente da engine para tabelas permanentes, configurando `default_tmp_storage_engine`, seja na inicialização ou em tempo de execução.

Para converter uma tabela de uma storage engine para outra, use uma instrução `ALTER TABLE` que indique a nova engine:

```sql
ALTER TABLE t ENGINE = InnoDB;
```

Consulte a Seção 13.1.18, “CREATE TABLE Statement”, e a Seção 13.1.8, “ALTER TABLE Statement”.

Se você tentar usar uma storage engine que não está compilada ou que está compilada, mas desativada, o MySQL cria uma tabela usando a storage engine padrão. Por exemplo, em uma configuração de replication, talvez seu servidor de origem use tabelas `InnoDB` para segurança máxima, mas os servidores replica usem outras storage engines para velocidade em detrimento de durabilidade ou concurrency.

Por padrão, um aviso é gerado sempre que `CREATE TABLE` ou `ALTER TABLE` não consegue usar a storage engine padrão. Para prevenir um comportamento confuso e não intencional se a engine desejada não estiver disponível, habilite o SQL mode `NO_ENGINE_SUBSTITUTION`. Se a engine desejada não estiver disponível, essa configuração produz um error em vez de um aviso, e a tabela não é criada ou alterada. Consulte a Seção 5.1.10, “Server SQL Modes”.

Para novas tabelas, o MySQL sempre cria um arquivo `.frm` para armazenar as definições de tabela e coluna. O Index e os dados da tabela podem ser armazenados em um ou mais outros arquivos, dependendo da storage engine. O servidor cria o arquivo `.frm` acima do nível da storage engine. Storage Engines individuais criam quaisquer arquivos adicionais necessários para as tabelas que gerenciam. Se um nome de tabela contiver caracteres especiais, os nomes dos arquivos da tabela conterão versões codificadas desses caracteres, conforme descrito na Seção 9.2.4, “Mapping of Identifiers to File Names”.