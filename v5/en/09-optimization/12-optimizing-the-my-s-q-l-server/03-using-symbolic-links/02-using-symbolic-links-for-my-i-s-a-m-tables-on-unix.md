#### 8.12.3.2 Usando Symbolic Links para Tabelas MyISAM no Unix

Symlinks são totalmente suportados apenas para tabelas `MyISAM`. Para arquivos usados por tabelas de outros storage engines, você pode enfrentar problemas estranhos se tentar usar symbolic links. Para tabelas `InnoDB`, use a técnica alternativa explicada na Seção 14.6.1.2, “Criando Tabelas Externamente”.

Não utilize symlinks em tabelas em sistemas que não possuem uma chamada `realpath()` totalmente operacional. (Linux e Solaris suportam `realpath()`). Para determinar se seu sistema suporta symbolic links, verifique o valor da variável de sistema `have_symlink` usando esta instrução:

```sql
SHOW VARIABLES LIKE 'have_symlink';
```

O tratamento de symbolic links para tabelas `MyISAM` funciona da seguinte forma:

* No data directory, você sempre tem o arquivo de formato da tabela (`.frm`), o arquivo de dados (`.MYD`) e o arquivo de Index (`.MYI`). O arquivo de dados e o arquivo de Index podem ser movidos para outro local e substituídos no data directory por symlinks. O arquivo de formato não pode.

* Você pode criar symlinks para o arquivo de dados e o arquivo de Index independentemente para diferentes directories.

* Para instruir um servidor MySQL em execução a realizar a criação do symlink, use as opções `DATA DIRECTORY` e `INDEX DIRECTORY` no `CREATE TABLE`. Consulte a Seção 13.1.18, “Instrução CREATE TABLE”. Alternativamente, se o **mysqld** não estiver em execução, a criação de symlinks pode ser realizada manualmente usando **ln -s** na linha de comando.

  Note

  O path usado com uma ou ambas as opções `DATA DIRECTORY` e `INDEX DIRECTORY` não deve incluir o data directory do MySQL. (Bug #32167)

* O **myisamchk** não substitui um symlink pelo arquivo de dados ou arquivo de Index. Ele trabalha diretamente no arquivo para o qual o symlink aponta. Quaisquer arquivos temporários são criados no directory onde o arquivo de dados ou arquivo de Index está localizado. O mesmo se aplica às instruções `ALTER TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* Note

  Quando você executa um DROP em uma tabela que está usando symlinks, *tanto o symlink quanto o arquivo para o qual o symlink aponta são excluídos*. Esta é uma excelente razão para *não* executar o **mysqld** como usuário `root` do sistema operacional ou permitir que usuários do sistema operacional tenham acesso de gravação aos database directories do MySQL.

* Se você renomear uma tabela com `ALTER TABLE ... RENAME` ou `RENAME TABLE` e não mover a tabela para outro database, os symlinks no database directory são renomeados para os novos nomes e o arquivo de dados e o arquivo de Index são renomeados de acordo.

* Se você usar `ALTER TABLE ... RENAME` ou `RENAME TABLE` para mover uma tabela para outro database, a tabela será movida para o database directory de destino. Se o nome da tabela mudou, os symlinks no novo database directory são renomeados para os novos nomes e o arquivo de dados e o arquivo de Index são renomeados de acordo.

* Se você não estiver usando symlinks, inicie o **mysqld** com a opção `--skip-symbolic-links` para garantir que ninguém possa usar o **mysqld** para excluir ou renomear um arquivo fora do data directory.

Estas operações de symlink de tabela não são suportadas:

* `ALTER TABLE` ignora as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY`.

* Conforme indicado anteriormente, apenas os arquivos de dados e Index podem ser symbolic links. O arquivo `.frm` *nunca* deve ser um symbolic link. Tentar fazer isso (por exemplo, para tornar um nome de tabela sinônimo de outro) produz resultados incorretos. Suponha que você tenha um database `db1` sob o data directory do MySQL, uma tabela `tbl1` neste database, e no directory `db1` você crie um symlink `tbl2` que aponta para `tbl1`:

  ```sql
  $> cd /path/to/datadir/db1
  $> ln -s tbl1.frm tbl2.frm
  $> ln -s tbl1.MYD tbl2.MYD
  $> ln -s tbl1.MYI tbl2.MYI
  ```

  Problemas resultam se um Thread ler `db1.tbl1` e outro Thread atualizar `db1.tbl2`:

  + O Query cache é “enganado” (ele não tem como saber que `tbl1` não foi atualizado, então ele retorna resultados desatualizados).

  + Instruções `ALTER` em `tbl2` falham.