#### 10.12.2.2 Usar Links Simbólicos para Tabelas MyISAM no Unix

Nota

O suporte a links simbólicos, conforme descrito aqui, juntamente com a opção `--symbolic-links` que o controla, e que está desatualizada; espere que esses sejam removidos em uma versão futura do MySQL. Além disso, a opção está desativada por padrão.

Os símbolos são totalmente suportados apenas para as tabelas `MyISAM`. Para arquivos usados por tabelas de outros motores de armazenamento, você pode ter problemas estranhos se tentar usar links simbólicos. Para as tabelas `InnoDB`, use a técnica alternativa explicada na Seção 17.6.1.2, “Criando Tabelas Externamente”.

Não crie simbólicos de tabelas em sistemas que não têm uma chamada `realpath()` totalmente operacional. (O Linux e o Solaris suportam `realpath()`). Para determinar se o seu sistema suporta links simbólicos, verifique o valor da variável de sistema `have_symlink` usando esta instrução:

```
SHOW VARIABLES LIKE 'have_symlink';
```

O tratamento de links simbólicos para as tabelas `MyISAM` funciona da seguinte forma:

- No diretório de dados, você sempre tem o arquivo de dados (`.MYD`) e o arquivo de índice (`.MYI`). O arquivo de dados e o arquivo de índice podem ser movidos para outro local e substituídos no diretório de dados por sinônimos.

- Você pode criar um symlink para o arquivo de dados e o arquivo de índice de forma independente para diretórios diferentes.

- Para instruir um servidor MySQL em execução a realizar o enlaçamento simbólico, use as opções `DATA DIRECTORY` e `INDEX DIRECTORY` para `CREATE TABLE`. Veja a Seção 15.1.20, “Instrução CREATE TABLE”. Alternativamente, se o **mysqld** não estiver em execução, o enlaçamento simbólico pode ser realizado manualmente usando **ln -s** a partir da linha de comando.

  Nota

  O caminho usado com uma das opções `DATA DIRECTORY` ou `INDEX DIRECTORY` ou ambas pode não incluir o diretório MySQL `data`. (Bug #32167)

- O **myisamchk** não substitui um symlink pelo arquivo de dados ou pelo arquivo de índice. Ele funciona diretamente no arquivo ao qual o symlink aponta. Qualquer arquivo temporário é criado no diretório onde o arquivo de dados ou o arquivo de índice está localizado. O mesmo vale para as instruções `ALTER TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

- Nota

  Quando você exclui uma tabela que está usando symlinks, *tanto o symlink quanto o arquivo ao qual o symlink aponta são excluídos*. Esse é um motivo extremamente bom para *não* executar o **mysqld** como usuário do sistema operacional `root` ou permitir que usuários do sistema operacional tenham acesso de escrita aos diretórios do banco de dados MySQL.

- Se você renomear uma tabela com `ALTER TABLE ... RENAME` ou `RENAME TABLE` e não mover a tabela para outro banco de dados, os symlinks no diretório do banco de dados são renomeados para os novos nomes e o arquivo de dados e o arquivo de índice são renomeados conforme necessário.

- Se você usar `ALTER TABLE ... RENAME` ou `RENAME TABLE` para mover uma tabela para outro banco de dados, a tabela é movida para o diretório do outro banco de dados. Se o nome da tabela tiver sido alterado, os simblinks no novo diretório do banco de dados serão renomeados para os novos nomes e o arquivo de dados e o arquivo de índice serão renomeados conforme necessário.

- Se você não estiver usando symlinks, inicie o **mysqld** com a opção `--skip-symbolic-links` para garantir que ninguém possa usar o **mysqld** para excluir ou renomear um arquivo fora do diretório de dados.

Essas operações de sinônimos de tabela não são suportadas:

- `ALTER TABLE` ignora as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY`.
