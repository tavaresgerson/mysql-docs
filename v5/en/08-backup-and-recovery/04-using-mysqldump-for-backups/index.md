## 7.4 Usando mysqldump para Backups

7.4.1 Dump de Dados em Formato SQL com mysqldump

7.4.2 Recarregando Backups em Formato SQL

7.4.3 Dump de Dados em Formato de Texto Delimitado com mysqldump

7.4.4 Recarregando Backups em Formato de Texto Delimitado

7.4.5 Dicas sobre mysqldump

Esta seção descreve como usar o **mysqldump** para produzir arquivos dump, e como recarregar esses arquivos dump. Um arquivo dump pode ser usado de várias maneiras:

* Como um backup para permitir a recuperação de dados em caso de perda de dados.
* Como fonte de dados para configurar réplicas.
* Como fonte de dados para experimentação:

  + Para fazer uma cópia de um Database que pode ser usada sem alterar os dados originais.

  + Para testar possíveis incompatibilidades de upgrade.

O **mysqldump** produz dois tipos de saída, dependendo se a opção `--tab` é fornecida:

* Sem o `--tab`, o **mysqldump** grava instruções SQL na saída padrão (standard output). Essa saída consiste em instruções `CREATE` para criar objetos dumpados (Databases, tables, stored routines, e assim por diante), e instruções `INSERT` para carregar dados nas tables. A saída pode ser salva em um arquivo e recarregada posteriormente usando o **mysql** para recriar os objetos dumpados. Opções estão disponíveis para modificar o formato das instruções SQL e para controlar quais objetos são dumpados.

* Com o `--tab`, o **mysqldump** produz dois arquivos de saída para cada table dumpada. O servidor grava um arquivo como texto delimitado por tabulação, uma linha por row da table. Este arquivo é nomeado `tbl_name.txt` no diretório de saída. O servidor também envia uma instrução `CREATE TABLE` para a table ao **mysqldump**, que a grava como um arquivo nomeado `tbl_name.sql` no diretório de saída.