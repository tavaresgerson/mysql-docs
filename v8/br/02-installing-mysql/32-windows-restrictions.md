### 2.3.6 Restrições da plataforma Windows

As seguintes restrições aplicam-se à utilização do MySQL na plataforma Windows:

- \*\* Memória de processo \*\*

  Nas plataformas Windows de 32 bits, não é possível usar mais de 2 GB de RAM em um único processo, incluindo MySQL. Isso ocorre porque o limite de endereço físico no Windows de 32 bits é de 4 GB e a configuração padrão no Windows é dividir o espaço de endereço virtual entre o kernel (2 GB) e o usuário / aplicativos (2 GB).

  Algumas versões do Windows têm uma configuração de tempo de inicialização para permitir aplicações maiores, reduzindo o aplicativo do kernel.
- \*\* Aliases do sistema de ficheiros \*\*

  Ao usar `MyISAM` tabelas, você não pode usar aliases dentro do Windows link para os arquivos de dados em outro volume e, em seguida, link de volta para o principal MySQL `datadir` localização.

  Esta facilidade é frequentemente usada para mover os dados e arquivos de índice para um RAID ou outra solução rápida.
- \*\* Número limitado de portos \*\*

  Os sistemas Windows têm cerca de 4.000 portas disponíveis para conexões de clientes, e depois que uma conexão em uma porta é fechada, leva de dois a quatro minutos antes que a porta possa ser reutilizada. Em situações em que os clientes se conectam e se desconectam do servidor a uma taxa alta, é possível que todas as portas disponíveis sejam usadas antes que as portas fechadas se tornem disponíveis novamente. Se isso acontecer, o servidor MySQL parece não responder, mesmo que esteja em execução. As portas podem ser usadas por outros aplicativos executados na máquina também, caso em que o número de portas disponíveis para o MySQL é menor.

  Para mais informações sobre este problema, consulte \[<https://support.microsoft.com/kb/196271>]
- **`DATA DIRECTORY` e `INDEX DIRECTORY`**

  A cláusula `DATA DIRECTORY` da instrução `CREATE TABLE` é suportada no Windows apenas para tabelas `InnoDB`, conforme descrito na Seção 17.6.1.2, Criando tabelas externamente. Para `MyISAM` e outros mecanismos de armazenamento, as cláusulas `DATA DIRECTORY` e `INDEX DIRECTORY` para `CREATE TABLE` são ignoradas no Windows e em qualquer outra plataforma com uma chamada `realpath()` não funcional.
- `DROP DATABASE`

  Você não pode deixar um banco de dados que está em uso por outra sessão.
- **Nomes insensíveis a casos**

  Os nomes de arquivo não são case-sensitivos no Windows, então os nomes de banco de dados e de tabelas do MySQL também não são case-sensitivos no Windows. A única restrição é que os nomes de banco de dados e de tabelas devem ser especificados usando o mesmo caso em toda uma instrução dada.
- **Nomes de diretórios e arquivos**

  No Windows, o MySQL Server suporta apenas diretórios e nomes de arquivos que são compatíveis com as páginas de código ANSI atuais. Por exemplo, o seguinte nome de diretório japonês não funciona no local ocidental (página de código 1252):

  ```
  datadir="C:/私たちのプロジェクトのデータ"
  ```

  A mesma limitação se aplica a diretórios e nomes de arquivos referidos em instruções SQL, como o nome do caminho de arquivo de dados em `LOAD DATA`.
- \*\* O caráter separador do nome do caminho `\`\*\*

  Os componentes de nome de caminho no Windows são separados pelo caractere `\`, que também é o caractere de escape no MySQL. Se você estiver usando `LOAD DATA` ou `SELECT ... INTO OUTFILE`, use nomes de arquivo de estilo Unix com `/` caracteres:

  ```
  mysql> LOAD DATA INFILE 'C:/tmp/skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:/tmp/skr.txt' FROM skr;
  ```

  Alternativamente, você deve duplicar o caractere `\`:

  ```
  mysql> LOAD DATA INFILE 'C:\\tmp\\skr.txt' INTO TABLE skr;
  mysql> SELECT * INTO OUTFILE 'C:\\tmp\\skr.txt' FROM skr;
  ```
- **Problemas com tubos**

  Os pipes não funcionam de forma confiável a partir do prompt de linha de comando do Windows. Se o pipe incluir o caractere `^Z` / `CHAR(24)`, o Windows pensa que encontrou o fim do arquivo e aborda o programa.

  Este é principalmente um problema quando você tenta aplicar um log binário da seguinte forma:

  ```
  C:\> mysqlbinlog binary_log_file | mysql --user=root
  ```

  Se você tiver um problema aplicando o log e suspeitar que é por causa de um `^Z` / `CHAR(24)` caractere, você pode usar a seguinte solução:

  ```
  C:\> mysqlbinlog binary_log_file --result-file=/tmp/bin.sql
  C:\> mysql --user=root --execute "source /tmp/bin.sql"
  ```

  O último comando também pode ser usado para ler de forma confiável qualquer arquivo SQL que possa conter dados binários.
