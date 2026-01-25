## 14.23 Limites do InnoDB

Esta seção descreve os limites para tabelas `InnoDB`, Indexes, tablespaces e outros aspectos do `InnoDB` storage engine.

* Uma tabela pode conter no máximo 1017 colunas (aumentado no MySQL 5.6.9 a partir do limite anterior de 1000). Colunas geradas virtualmente estão incluídas neste limite.

* Uma tabela pode conter no máximo 64 secondary Indexes.

* Se `innodb_large_prefix` estiver habilitado (o padrão), o limite do prefixo da index key é de 3072 bytes para tabelas `InnoDB` que utilizam o `ROW_FORMAT` `DYNAMIC` ou `COMPRESSED`. Se `innodb_large_prefix` estiver desabilitado, o limite do prefixo da index key é de 767 bytes para tabelas de qualquer `ROW_FORMAT`.

  `innodb_large_prefix` está *deprecated*; espera-se que ele seja removido em uma futura release do MySQL. `innodb_large_prefix` foi introduzido no MySQL 5.5 para desabilitar grandes prefixos de index key para compatibilidade com versões anteriores do `InnoDB` que não suportam grandes prefixos de index key.

  O limite de comprimento do prefixo da index key é de 767 bytes para tabelas `InnoDB` que utilizam o `ROW_FORMAT` `REDUNDANT` ou `COMPACT`. Por exemplo, você pode atingir este limite com um column prefix Index de mais de 255 caracteres em uma coluna `TEXT` ou `VARCHAR`, assumindo um character set `utf8mb3` e um máximo de 3 bytes para cada caractere.

  A tentativa de usar um comprimento de prefixo de index key que exceda o limite retorna um erro. Para evitar tais erros em configurações de replication, evite habilitar `innodb_large_prefix` na source se ele não puder ser habilitado também nas replicas.

  Se você reduzir o Page Size do `InnoDB` para 8KB ou 4KB especificando a opção `innodb_page_size` ao criar a instância MySQL, o comprimento máximo da index key é reduzido proporcionalmente, baseado no limite de 3072 bytes para um Page Size de 16KB. Ou seja, o comprimento máximo da index key é de 1536 bytes quando o Page Size é de 8KB, e 768 bytes quando o Page Size é de 4KB.

  Os limites que se aplicam a prefixos de index key também se aplicam a index keys de coluna completa (full-column index keys).

* Um máximo de 16 colunas é permitido para Indexes multicoluna. Exceder o limite retorna um erro.

  ```sql
  ERROR 1070 (42000): Too many key parts specified; max 16 parts allowed
  ```

* O tamanho máximo da row (linha), excluindo quaisquer colunas de comprimento variável que são armazenadas off-page, é ligeiramente inferior à metade de uma page (página) para Page Sizes de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo da row para o `innodb_page_size` padrão de 16KB é de cerca de 8000 bytes. No entanto, para um Page Size do `InnoDB` de 64KB, o tamanho máximo da row é de aproximadamente 16000 bytes. Colunas `LONGBLOB` e `LONGTEXT` devem ter menos de 4GB, e o tamanho total da row, incluindo colunas `BLOB` e `TEXT`, deve ser menor que 4GB.

  Se uma row tiver menos da metade do comprimento de uma page, todo o seu conteúdo é armazenado localmente dentro da page. Se exceder metade de uma page, colunas de comprimento variável são escolhidas para armazenamento externo off-page até que a row caiba na metade de uma page, conforme descrito na Seção 14.12.2, “File Space Management”.

* Embora o `InnoDB` suporte tamanhos de row maiores que 65.535 bytes internamente, o próprio MySQL impõe um limite de tamanho de row de 65.535 para o tamanho combinado de todas as colunas. Consulte a Seção 8.4.7, “Limits on Table Column Count and Row Size”.

* Em alguns sistemas operacionais mais antigos, os arquivos devem ter menos de 2GB. Esta não é uma limitação do `InnoDB`. Se você precisar de um system tablespace grande, configure-o usando vários data files menores em vez de um único data file grande, ou distribua os dados da tabela entre data files file-per-table e general tablespace.

* O tamanho máximo combinado para os log files do `InnoDB` é de 512GB.

* O tamanho mínimo do tablespace é ligeiramente superior a 10MB. O tamanho máximo do tablespace depende do Page Size do `InnoDB`.

  **Tabela 14.25 Tamanho Máximo do Tablespace InnoDB**

  <table summary="O tamanho máximo do tablespace para cada Page Size do InnoDB."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Page Size do InnoDB</th> <th>Tamanho Máximo do Tablespace</th> </tr></thead><tbody><tr> <td>4KB</td> <td>16TB</td> </tr><tr> <td>8KB</td> <td>32TB</td> </tr><tr> <td>16KB</td> <td>64TB</td> </tr><tr> <td>32KB</td> <td>128TB</td> </tr><tr> <td>64KB</td> <td>256TB</td> </tr> </tbody></table>

  O tamanho máximo do tablespace é também o tamanho máximo para uma table.

* Os arquivos de tablespace não podem exceder 4GB em sistemas Windows de 32 bits (Bug #80149).

* Uma instância `InnoDB` suporta até 2^32 (4294967296) tablespaces, com um pequeno número desses tablespaces reservados para undo e temporary tables.
* Shared tablespaces suportam até 2^32 (4294967296) tables.
* O path (caminho) de um arquivo de tablespace, incluindo o nome do arquivo, não pode exceder o limite `MAX_PATH` no Windows. Antes do Windows 10, o limite `MAX_PATH` é de 260 caracteres. A partir do Windows 10, versão 1607, as limitações `MAX_PATH` são removidas das funções comuns de arquivo e diretório Win32, mas você deve habilitar o novo comportamento.

* `ROW_FORMAT=COMPRESSED` no formato de arquivo Barracuda assume que o Page Size é de no máximo 16KB e utiliza pointers (ponteiros) de 14 bits.

* Para limites associados a transactions (transações) concorrentes de leitura e escrita, consulte a Seção 14.6.7, “Undo Logs”.