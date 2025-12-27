#### 10.12.2.2 Usando Links Simbólicos para Tabelas MyISAM no Unix

Observação

O suporte a links simbólicos conforme descrito aqui, juntamente com a opção `--symbolic-links` que o controla, está desatualizado; espera-se que esses sejam removidos em uma versão futura do MySQL. Além disso, a opção está desativada por padrão.

Os links simbólicos são totalmente suportados apenas para tabelas `MyISAM`. Para arquivos usados por tabelas de outros motores de armazenamento, você pode obter problemas estranhos se tentar usar links simbólicos. Para tabelas `InnoDB`, use a técnica alternativa explicada na Seção 17.6.1.2, “Criar Tabelas Externamente”.

Não crie links simbólicos para tabelas em sistemas que não têm uma chamada de `realpath()` totalmente operacional. (Linux e Solaris suportam `realpath()`. Para determinar se o seu sistema suporta links simbólicos, verifique o valor da variável de sistema `have_symlink` usando esta instrução:

```
SHOW VARIABLES LIKE 'have_symlink';
```

O tratamento dos links simbólicos para tabelas `MyISAM` funciona da seguinte forma:

* No diretório de dados, você sempre tem o arquivo de dados (`.MYD`) e o arquivo de índice (`.MYI`). O arquivo de dados e o arquivo de índice podem ser movidos para outro lugar e substituídos no diretório de dados por links simbólicos.

* Você pode criar links simbólicos para o arquivo de dados e o arquivo de índice de forma independente para diretórios diferentes.

* Para instruir um servidor MySQL em execução a realizar o link simbólico, use as opções `DIRETÓRIO DE DADOS` e `DIRETÓRIO DE ÍNDICE` no `CREATE TABLE`. Veja a Seção 15.1.24, “Instrução CREATE TABLE”. Alternativamente, se o **mysqld** não estiver em execução, o link simbólico pode ser realizado manualmente usando **ln -s** a partir da linha de comando.

Observação

O caminho usado com qualquer uma ou ambas as opções `DATA DIRECTORY` e `INDEX DIRECTORY` pode não incluir o diretório `data` do MySQL. (Bug #32167)

* **myisamchk** não substitui um symlink pelo arquivo de dados ou pelo arquivo de índice. Ele funciona diretamente no arquivo para o qual o symlink aponta. Arquivos temporários são criados no diretório onde o arquivo de dados ou o arquivo de índice está localizado. O mesmo vale para as instruções `ALTER TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* Nota

  Quando você exclui uma tabela que está usando symlinks, **ambos o symlink e o arquivo para o qual o symlink aponta são excluídos**. Esse é um motivo extremamente bom para **não** executar **mysqld** como usuário do sistema operacional `root` ou permitir que usuários do sistema operacional tenham acesso de escrita aos diretórios do banco de dados MySQL.

* Se você renomear uma tabela com `ALTER TABLE ... RENAME` ou `RENAME TABLE` e não mover a tabela para outro banco de dados, os symlinks no diretório do banco de dados são renomeados para os novos nomes e o arquivo de dados e o arquivo de índice são renomeados conforme necessário.

* Se você usar `ALTER TABLE ... RENAME` ou `RENAME TABLE` para mover uma tabela para outro banco de dados, a tabela é movida para o diretório do outro banco de dados. Se o nome da tabela mudou, os symlinks no novo diretório do banco de dados são renomeados para os novos nomes e o arquivo de dados e o arquivo de índice são renomeados conforme necessário.

* Se você não estiver usando symlinks, inicie **mysqld** com a opção `--skip-symbolic-links` para garantir que ninguém possa usar **mysqld** para excluir ou renomear um arquivo fora do diretório de dados.

Essas operações de symlink de tabela não são suportadas:

* `ALTER TABLE` ignora as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY`.