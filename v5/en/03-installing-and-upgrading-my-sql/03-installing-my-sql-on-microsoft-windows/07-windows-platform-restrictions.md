### 2.3.7 Restrições da Plataforma Windows

As seguintes restrições se aplicam ao uso do MySQL na plataforma Windows:

* **Memória do Processo**

  Em plataformas Windows de 32 bits, não é possível por padrão usar mais de 2GB de RAM dentro de um único processo, incluindo o MySQL. Isso ocorre porque o limite de endereço físico no Windows de 32 bits é de 4GB e a configuração padrão no Windows é dividir o espaço de endereço virtual entre o kernel (2GB) e o usuário/aplicações (2GB).

  Algumas versões do Windows possuem uma configuração no tempo de boot para habilitar aplicações maiores, reduzindo a aplicação kernel. Alternativamente, para usar mais de 2GB, use uma versão 64-bit do Windows.

* **Aliases do Sistema de Arquivos**

  Ao usar tabelas `MyISAM`, você não pode usar aliases dentro do Windows para vincular (link) a arquivos de dados em outro volume e, em seguida, vincular de volta (link back) ao local principal do `datadir` do MySQL.

  Esse recurso é frequentemente usado para mover os arquivos de dados e de Index para uma solução RAID ou outra solução rápida, mantendo os principais arquivos `.frm` no diretório de dados padrão configurado com a opção `datadir`.

* **Número Limitado de Ports**

  Sistemas Windows têm cerca de 4.000 ports disponíveis para conexões de cliente e, após o fechamento de uma conexão em um port, leva de dois a quatro minutos antes que o port possa ser reutilizado. Em situações em que os clientes se conectam e se desconectam do server em alta taxa, é possível que todos os ports disponíveis sejam esgotados antes que os ports fechados se tornem disponíveis novamente. Se isso acontecer, o MySQL server parecerá não responsivo, embora esteja em execução. Os ports também podem ser usados por outras aplicações em execução na máquina, caso em que o número de ports disponíveis para o MySQL é menor.

  Para mais informações sobre este problema, consulte <https://support.microsoft.com/kb/196271>.

* **`DATA DIRECTORY` e `INDEX DIRECTORY`**

  A cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` é suportada no Windows apenas para tabelas `InnoDB`, conforme descrito na Seção 14.6.1.2, “Creating Tables Externally”. Para `MyISAM` e outros storage engines, as cláusulas `DATA DIRECTORY` e `INDEX DIRECTORY` para `CREATE TABLE` são ignoradas no Windows e em quaisquer outras plataformas com uma chamada `realpath()` não funcional.

* **`DROP DATABASE`**

  Você não pode executar um `DROP DATABASE` em um Database que esteja sendo usado por outra session.

* **Nomes não sensíveis a maiúsculas/minúsculas (Case-insensitive)**

  Nomes de arquivos não são sensíveis a maiúsculas/minúsculas (case-sensitive) no Windows, portanto, os nomes de Database e de tabela do MySQL também não são case-sensitive no Windows. A única restrição é que os nomes de Database e de tabela devem ser especificados usando a mesma capitalização em toda uma determinada instrução. Consulte a Seção 9.2.3, “Identifier Case Sensitivity”.

* **Nomes de Diretórios e Arquivos**

  No Windows, o MySQL Server suporta apenas nomes de diretório e arquivo que são compatíveis com as code pages ANSI atuais. Por exemplo, o seguinte nome de diretório em japonês não funciona na localidade Ocidental (code page 1252):

  ```sql
  datadir="C:/私たちのプロジェクトのデータ"
  ```

  A mesma limitação se aplica a nomes de diretório e arquivo referenciados em instruções SQL, como o path name do arquivo de dados em `LOAD DATA`.

* **O Caractere Separador de Path Name `\`**

  Os componentes de path name no Windows são separados pelo caractere `\`, que também é o caractere de escape no MySQL. Se você estiver usando `LOAD DATA` ou `SELECT ... INTO OUTFILE`, use nomes de arquivo no estilo Unix com caracteres `/`:

  ```sql
  mysql> LOAD DATA INFILE 'C:/tmp/skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:/tmp/skr.txt' FROM skr;
  ```

  Alternativamente, você deve duplicar o caractere `\`:

  ```sql
  mysql> LOAD DATA INFILE 'C:\\tmp\\skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:\\tmp\\skr.txt' FROM skr;
  ```

* **Problemas com Pipes**

  Pipes não funcionam de forma confiável a partir do prompt de linha de comando do Windows. Se o pipe incluir o caractere `^Z` / `CHAR(24)`, o Windows entenderá que encontrou o fim do arquivo (end-of-file) e abortará o programa.

  Isso é principalmente um problema quando você tenta aplicar um binary log da seguinte forma:

  ```sql
  C:\> mysqlbinlog binary_log_file | mysql --user=root
  ```

  Se você tiver um problema ao aplicar o log e suspeitar que seja devido a um caractere `^Z` / `CHAR(24)`, você pode usar a seguinte solução alternativa (workaround):

  ```sql
  C:\> mysqlbinlog binary_log_file --result-file=/tmp/bin.sql
  C:\> mysql --user=root --execute "source /tmp/bin.sql"
  ```

  O último comando também pode ser usado para ler de forma confiável qualquer arquivo SQL que possa conter dados binários.