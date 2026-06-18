## 9.4 Usando mysqldump para backups

9.4.1 Exportação de dados no formato SQL com mysqldump

9.4.2 Recarga de backups no formato SQL

9.4.3 Exportação de dados no formato de texto delimitado com mysqldump

9.4.4 Recarga de backups no formato de texto delimitado

9.4.5 Dicas do mysqldump

Dica

Considere usar os utilitários de dump do MySQL Shell, que oferecem dumping paralelo com múltiplos threads, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como o streaming do Oracle Cloud Infrastructure Object Storage e verificações e modificações de compatibilidade do MySQL HeatWave. Os dumps podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carga de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Esta seção descreve como usar o **mysqldump** para criar arquivos de dump e como recarregar arquivos de dump. Um arquivo de dump pode ser usado de várias maneiras:

- Como um backup para permitir a recuperação de dados em caso de perda de dados.
- Como fonte de dados para a configuração de réplicas.
- Como fonte de dados para experimentação:

  - Para fazer uma cópia de um banco de dados que você pode usar sem alterar os dados originais.

  - Para testar possíveis incompatibilidades de atualização.

O **mysqldump** produz dois tipos de saída, dependendo se a opção `--tab` é fornecida:

- Sem `--tab`, o **mysqldump** escreve instruções SQL no saída padrão. Essa saída consiste em instruções `CREATE` para criar objetos descarregados (bancos de dados, tabelas, rotinas armazenadas, etc.) e instruções `INSERT` para carregar dados em tabelas. A saída pode ser salva em um arquivo e recarregada posteriormente usando o **mysql** para recriar os objetos descarregados. Existem opções para modificar o formato das instruções SQL e para controlar quais objetos são descarregados.

- Com `--tab`, o **mysqldump** produz dois arquivos de saída para cada tabela descarregada. O servidor escreve um arquivo como texto separado por tabulação, uma linha por linha de tabela. Esse arquivo é nomeado `tbl_name.txt` no diretório de saída. O servidor também envia uma declaração `CREATE TABLE` para o **mysqldump**, que a escreve como um arquivo nomeado `tbl_name.sql` no diretório de saída.
