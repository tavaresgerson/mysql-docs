## 7.4 Usando mysqldump para backups

7.4.1 Exportação de dados no formato SQL com mysqldump

7.4.2 Recarga de backups no formato SQL

7.4.3 Exportação de dados no formato de texto delimitado com mysqldump

7.4.4 Recarga de backups no formato de texto delimitado

7.4.5 Dicas do mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de dump e como recarregar arquivos de dump. Um arquivo de dump pode ser usado de várias maneiras:

- Como um backup para permitir a recuperação de dados em caso de perda de dados.
- Como fonte de dados para a configuração de réplicas.
- Como fonte de dados para experimentação:

  - Para fazer uma cópia de um banco de dados que você pode usar sem alterar os dados originais.

  - Para testar possíveis incompatibilidades de atualização.

O **mysqldump** produz dois tipos de saída, dependendo se a opção `--tab` é fornecida:

- Sem a opção `--tab`, o **mysqldump** escreve instruções SQL no fluxo de saída padrão. Essa saída consiste em instruções `CREATE` para criar objetos descarregados (bancos de dados, tabelas, rotinas armazenadas, etc.) e instruções `INSERT` para carregar dados em tabelas. A saída pode ser salva em um arquivo e recarregada posteriormente usando o **mysql** para recriar os objetos descarregados. Existem opções disponíveis para modificar o formato das instruções SQL e para controlar quais objetos são descarregados.

- Com a opção `--tab`, o **mysqldump** gera dois arquivos de saída para cada tabela descarregada. O servidor escreve um arquivo como texto separado por tabulação, uma linha por linha de tabela. Esse arquivo é chamado `tbl_name.txt` no diretório de saída. O servidor também envia uma declaração `CREATE TABLE` para o **mysqldump**, que a escreve como um arquivo chamado `tbl_name.sql` no diretório de saída.
