### 14.10.1 Habilitar formatos de arquivo

A opção de configuração `innodb_file_format` permite um formato de arquivo `InnoDB` para espaços de tabelas por arquivo.

`Barracuda` é o padrão para `innodb_file_format`. Em versões anteriores, o formato de arquivo padrão era `Antelope`.

Nota

A opção de configuração `innodb_file_format` está desatualizada e pode ser removida em uma futura versão. Para mais informações, consulte a Seção 14.10, “Gerenciamento do Formato de Arquivo InnoDB”.

Você pode definir o valor de `innodb_file_format` na linha de comando quando você inicia o **mysqld**, ou no arquivo de opções (`my.cnf` no Unix, `my.ini` no Windows). Você também pode alterá-lo dinamicamente com uma declaração `SET GLOBAL`.

```sql
SET GLOBAL innodb_file_format=Barracuda;
```

#### Observações de uso

- As configurações do formato de arquivo `InnoDB` não se aplicam às tabelas armazenadas em espaços de tabelas gerais. Os espaços de tabelas gerais fornecem suporte para todos os formatos de linha e recursos associados. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

- A configuração `innodb_file_format` não é aplicável ao usar a opção `TABLESPACE [=] innodb_system` com `CREATE TABLE` ou `ALTER TABLE` para armazenar uma tabela `DYNAMIC` no espaço de tabelas do sistema.

- A configuração `innodb_file_format` é ignorada ao criar tabelas que utilizam o formato de linha `DYNAMIC`. Para obter mais informações, consulte o formato de linha DYNAMIC.
