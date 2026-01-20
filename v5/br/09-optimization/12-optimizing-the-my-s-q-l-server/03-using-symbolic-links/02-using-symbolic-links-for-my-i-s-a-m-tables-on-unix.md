#### 8.12.3.2 Usar Links Simbólicos para Tabelas MyISAM no Unix

Os links simbólicos são totalmente suportados apenas para tabelas `MyISAM`. Para arquivos usados por tabelas de outros motores de armazenamento, você pode obter problemas estranhos se tentar usar links simbólicos. Para tabelas `InnoDB`, use a técnica alternativa explicada na Seção 14.6.1.2, “Criando Tabelas Externamente” em vez disso.

Não crie simbólicos de tabelas em sistemas que não possuem uma chamada de `realpath()` totalmente operacional. (Linux e Solaris suportam `realpath()`. Para determinar se o seu sistema suporta links simbólicos, verifique o valor da variável de sistema `have_symlink` usando esta instrução:

```sql
SHOW VARIABLES LIKE 'have_symlink';
```

O tratamento de links simbólicos para tabelas `MyISAM` funciona da seguinte forma:

- No diretório de dados, você sempre tem o arquivo no formato de tabela (`.frm`), o arquivo de dados (`.MYD`) e o arquivo de índice (`.MYI`). O arquivo de dados e o arquivo de índice podem ser movidos para outro local e substituídos no diretório de dados por sinônimos. O arquivo de formato não pode.

- Você pode criar um symlink para o arquivo de dados e o arquivo de índice de forma independente para diretórios diferentes.

- Para instruir um servidor MySQL em execução a realizar o enlaçamento simbólico, use as opções `DATA DIRECTORY` e `INDEX DIRECTORY` no comando `CREATE TABLE`. Veja a Seção 13.1.18, “Instrução CREATE TABLE”. Alternativamente, se o **mysqld** não estiver em execução, o enlaçamento simbólico pode ser realizado manualmente usando **ln -s** a partir da linha de comando.

  Nota

  O caminho usado com uma das opções `DATA DIRECTORY` ou `INDEX DIRECTORY` ou ambas pode não incluir o diretório `data` do MySQL. (Bug #32167)

- O **myisamchk** não substitui um symlink pelo arquivo de dados ou pelo arquivo de índice. Ele funciona diretamente no arquivo ao qual o symlink aponta. Todos os arquivos temporários são criados no diretório onde o arquivo de dados ou o arquivo de índice estão localizados. O mesmo vale para as instruções **ALTER TABLE**, **OPTIMIZE TABLE** e **REPAIR TABLE**.

- Nota

  Quando você exclui uma tabela que está usando symlinks, *tanto o symlink quanto o arquivo ao qual o symlink aponta são excluídos*. Esse é um motivo extremamente bom para *não* executar o **mysqld** como usuário do sistema operacional `root` ou permitir que usuários do sistema operacional tenham acesso de escrita aos diretórios do banco de dados MySQL.

- Se você renomear uma tabela com `ALTER TABLE ... RENAME` ou `RENAME TABLE` e não mover a tabela para outro banco de dados, os links simbólicos no diretório do banco de dados são renomeados para os novos nomes e o arquivo de dados e o arquivo de índice são renomeados conforme necessário.

- Se você usar `ALTER TABLE ... RENAME` ou `RENAME TABLE` para mover uma tabela para outro banco de dados, a tabela é movida para o diretório do outro banco de dados. Se o nome da tabela foi alterado, os links simbólicos no novo diretório do banco de dados são renomeados para os novos nomes e o arquivo de dados e o arquivo de índice são renomeados conforme necessário.

- Se você não estiver usando symlinks, inicie o **mysqld** com a opção `--skip-symbolic-links` para garantir que ninguém possa usar o **mysqld** para excluir ou renomear um arquivo fora do diretório de dados.

Essas operações de sinônimos de tabela não são suportadas:

- A opção `ALTER TABLE` ignora as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY`.

- Como indicado anteriormente, apenas os arquivos de dados e de índice podem ser links simbólicos. O arquivo `.frm` *nunca* deve ser um link simbólico. Tentar fazer isso (por exemplo, para tornar um nome de tabela sinônimo de outro) produz resultados incorretos. Suponha que você tenha um banco de dados `db1` sob o diretório de dados do MySQL, uma tabela `tbl1` neste banco de dados, e no diretório `db1` você faça um symlink `tbl2` que aponta para `tbl1`:

  ```sql
  $> cd /path/to/datadir/db1
  $> ln -s tbl1.frm tbl2.frm
  $> ln -s tbl1.MYD tbl2.MYD
  $> ln -s tbl1.MYI tbl2.MYI
  ```

  Há problemas se um thread lê `db1.tbl1` e outro thread atualiza `db1.tbl2`:

  - O cache de consultas é "enganado" (ele não tem como saber que `tbl1` não foi atualizado, então ele retorna resultados desatualizados).

  - As instruções `ALTER` em `tbl2` falham.
