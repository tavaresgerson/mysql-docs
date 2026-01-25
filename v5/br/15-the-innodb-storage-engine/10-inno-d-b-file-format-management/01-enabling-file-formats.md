### 14.10.1 Habilitando Formatos de Arquivo

A opção de configuração `innodb_file_format` habilita um *File Format* `InnoDB` para *tablespaces* *file-per-table*.

`Barracuda` é a configuração padrão de `innodb_file_format`. Em versões anteriores, o *File Format* padrão era `Antelope`.

Nota

A opção de configuração `innodb_file_format` está obsoleta (*deprecated*) e pode ser removida em uma versão futura. Para mais informações, consulte a Seção 14.10, “Gerenciamento de *File-Format* `InnoDB`”.

Você pode definir o valor de `innodb_file_format` na linha de comando ao iniciar o **mysqld**, ou no arquivo de opção (`my.cnf` no Unix, `my.ini` no Windows). Você também pode alterá-lo dinamicamente com uma instrução `SET GLOBAL`.

```sql
SET GLOBAL innodb_file_format=Barracuda;
```

#### Notas de Uso

* As configurações de *File Format* `InnoDB` não se aplicam a *tables* armazenadas em *general tablespaces*. Os *general tablespaces* fornecem suporte para todos os *Row Formats* e recursos associados. Para mais informações, consulte a Seção 14.6.3.3, “General Tablespaces”.

* A configuração `innodb_file_format` não é aplicável ao usar a opção de *table* `TABLESPACE [=] innodb_system` com `CREATE TABLE` ou `ALTER TABLE` para armazenar uma *table* `DYNAMIC` no *system tablespace*.

* A configuração `innodb_file_format` é ignorada ao criar *tables* que usam o *Row Format* `DYNAMIC`. Para mais informações, consulte DYNAMIC Row Format.