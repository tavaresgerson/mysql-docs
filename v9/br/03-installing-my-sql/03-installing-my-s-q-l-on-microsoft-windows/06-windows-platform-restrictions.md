### 2.3.6 Restrições da Plataforma Windows

As seguintes restrições se aplicam ao uso do MySQL na plataforma Windows:

* **Memória do processo**

  Nas plataformas de 32 bits do Windows, não é possível, por padrão, usar mais de 2 GB de RAM em um único processo, incluindo o MySQL. Isso ocorre porque o limite de endereço físico no Windows 32 bits é de 4 GB e a configuração padrão no Windows é dividir o espaço de endereçamento virtual entre o kernel (2 GB) e o usuário/aplicativos (2 GB).

  Algumas versões do Windows têm uma configuração de tempo de inicialização para permitir aplicativos maiores reduzindo o aplicativo do kernel. Alternativamente, para usar mais de 2 GB, use uma versão de 64 bits do Windows.

* **Aliases do sistema de arquivos**

  Ao usar tabelas `MyISAM`, não é possível usar aliases dentro do link do Windows para os arquivos de dados em outro volume e, em seguida, vincular de volta à localização principal do `datadir` do MySQL.

  Essa facilidade é frequentemente usada para mover os arquivos de dados e índices para um RAID ou outra solução rápida.

* **Número limitado de portas**

  Os sistemas Windows têm cerca de 4.000 portas disponíveis para conexões de clientes, e após uma conexão em uma porta ser fechada, leva de dois a quatro minutos antes que a porta possa ser reutilizada. Em situações em que clientes se conectam e desconectam do servidor em alta taxa, é possível que todas as portas disponíveis sejam usadas antes que as portas fechadas novamente estejam disponíveis. Se isso acontecer, o servidor MySQL parece não estar respondendo, mesmo que esteja em execução. As portas podem ser usadas por outros aplicativos que estão em execução na máquina, no caso, o número de portas disponíveis para o MySQL é menor.

  Para mais informações sobre esse problema, consulte <https://support.microsoft.com/kb/196271>.

* **`DIRECTÓRIO DE DADOS` e `DIRECTÓRIO DE ÍNDICES`**

A cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` é suportada no Windows apenas para tabelas `InnoDB`, conforme descrito na Seção 17.6.1.2, “Criando Tabelas Externamente”. Para `MyISAM` e outros motores de armazenamento, as cláusulas `DATA DIRECTORY` e `INDEX DIRECTORY` para `CREATE TABLE` são ignoradas no Windows e em outras plataformas com uma chamada `realpath()` não funcional.

* **`DROP DATABASE`**

  Você não pode excluir um banco de dados que esteja sendo usado por outra sessão.

* **Nomes não sensíveis a maiúsculas e minúsculas**

  Os nomes de arquivos não são sensíveis a maiúsculas e minúsculas no Windows, portanto, os nomes de banco de dados e tabelas do MySQL também não são sensíveis a maiúsculas e minúsculas no Windows. A única restrição é que os nomes de banco de dados e tabelas devem ser especificados usando a mesma grafia em toda a declaração. Veja a Seção 11.2.3, “Sensibilidade ao Caso do Identificador”.

* **Diretórios e nomes de arquivos**

  No Windows, o MySQL Server suporta apenas nomes de diretórios e arquivos compatíveis com as páginas de código ANSI atuais. Por exemplo, o seguinte nome de diretório japonês não funciona no local ocidental (página de código 1252):

  ```
  datadir="C:/私たちのプロジェクトのデータ"
  ```

  A mesma limitação se aplica aos nomes de diretórios e arquivos referenciados em declarações SQL, como o nome do caminho do arquivo de dados em `LOAD DATA`.

* **O caractere de separador de nome de caminho `\`**

  Os componentes dos nomes de caminho no Windows são separados pelo caractere `\` (barra), que também é o caractere de escape no MySQL. Se você estiver usando `LOAD DATA` ou `SELECT ... INTO OUTFILE`, use nomes de arquivos estilo Unix com caracteres `/`:

  ```
  mysql> LOAD DATA INFILE 'C:/tmp/skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:/tmp/skr.txt' FROM skr;
  ```

  Alternativamente, você deve duplicar o caractere `\`:

  ```
  mysql> LOAD DATA INFILE 'C:\\tmp\\skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:\\tmp\\skr.txt' FROM skr;
  ```

* **Problemas com pipes**

  Os pipes não funcionam de forma confiável a partir do prompt de comando do Windows. Se o pipe incluir o caractere `^Z`/`CHAR(24)`, o Windows acha que encontrou o fim de arquivo e interrompe o programa.

Esse é principalmente um problema quando você tenta aplicar um log binário da seguinte forma:

```
  C:\> mysqlbinlog binary_log_file | mysql --user=root
  ```

Se você tiver um problema ao aplicar o log e suspeitar que seja devido a um caractere `^Z`/`CHAR(24)`, você pode usar a seguinte solução:

```
  C:\> mysqlbinlog binary_log_file --result-file=/tmp/bin.sql
  C:\> mysql --user=root --execute "source /tmp/bin.sql"
  ```

Este último comando também pode ser usado para ler de forma confiável qualquer arquivo SQL que possa conter dados binários.