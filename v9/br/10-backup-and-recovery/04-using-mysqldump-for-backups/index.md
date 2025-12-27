## 9.4 Usando mysqldump para backups

9.4.1 Fazendo backups em formato SQL com mysqldump

9.4.2 Recarregando backups em formato SQL com mysqldump

9.4.3 Fazendo backups em formato de texto delimitado com mysqldump

9.4.4 Recarregando backups em formato de texto delimitado com mysqldump

9.4.5 Dicas do mysqldump

Dica

Considere usar os utilitários de dump do MySQL Shell, que oferecem dumping paralelo com múltiplos threads, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como streaming de Armazenamento de Objetos da Oracle Cloud Infrastructure e verificações e modificações de compatibilidade do MySQL HeatWave. Os backups podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de carregamento de dump do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

Esta seção descreve como usar o **mysqldump** para produzir arquivos de dump e como recarregar arquivos de dump. Um arquivo de dump pode ser usado de várias maneiras:

* Como backup para permitir a recuperação de dados em caso de perda de dados.
* Como fonte de dados para configurar réplicas.
* Como fonte de dados para experimentação:

  + Para fazer uma cópia de um banco de dados que você pode usar sem alterar os dados originais.

  + Para testar incompatibilidades potenciais de atualização.

O **mysqldump** produz dois tipos de saída, dependendo se a opção `--tab` é fornecida:

* Sem `--tab`, o **mysqldump** escreve instruções SQL no saída padrão. Essa saída consiste em instruções `CREATE` para criar objetos descarregados (bancos de dados, tabelas, rotinas armazenadas, etc.) e instruções `INSERT` para carregar dados em tabelas. A saída pode ser salva em um arquivo e recarregada mais tarde usando o **mysql** para recriar os objetos descarregados. São disponíveis opções para modificar o formato das instruções SQL e para controlar quais objetos são descarregados.

* Com a opção `--tab`, o **mysqldump** gera dois arquivos de saída para cada tabela descarregada. O servidor escreve um arquivo como texto separado por tabulação, uma linha por linha de tabela. Esse arquivo é nomeado `tbl_name.txt` no diretório de saída. O servidor também envia uma declaração `CREATE TABLE` para o **mysqldump**, que a escreve como um arquivo nomeado `tbl_name.sql` no diretório de saída.