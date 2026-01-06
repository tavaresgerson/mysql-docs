## 14.23 Limites do InnoDB

Esta seção descreve os limites para as tabelas `InnoDB`, índices, espaços de tabelas e outros aspectos do motor de armazenamento `InnoDB`.

- Uma tabela pode conter no máximo 1017 colunas (aumentado no MySQL 5.6.9 a partir do limite anterior de 1000). As colunas geradas virtualmente estão incluídas neste limite.

- Uma tabela pode conter um máximo de 64 índices secundários.

- Se `innodb_large_prefix` estiver habilitado (o padrão), o limite do prefixo da chave do índice é de 3072 bytes para tabelas `InnoDB` que usam o formato de linha `DINÂMICO` ou `COMPRESSADO`. Se `innodb_large_prefix` estiver desabilitado, o limite do prefixo da chave do índice é de 767 bytes para tabelas de qualquer formato de linha.

  `innodb_large_prefix` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. `innodb_large_prefix` foi introduzido no MySQL 5.5 para desabilitar prefixos de chaves de índice grandes para compatibilidade com versões anteriores do `InnoDB` que não suportam prefixos de chaves de índice grandes.

  O limite de comprimento do prefixo da chave do índice é de 767 bytes para tabelas `InnoDB` que utilizam o formato de linha `REDUNDANT` ou `COMPACT`. Por exemplo, você pode atingir esse limite com um índice de prefixo de coluna com mais de 255 caracteres em uma coluna `TEXT` ou `VARCHAR`, assumindo um conjunto de caracteres `utf8mb3` e o máximo de 3 bytes para cada caractere.

  Tentar usar um prefixo de comprimento de chave de índice que exceda o limite retorna um erro. Para evitar tais erros nas configurações de replicação, evite habilitar `innodb_large_prefix` na fonte se ele não puder ser habilitado também nas réplicas.

  Se você reduzir o tamanho da página do `InnoDB` para 8KB ou 4KB, especificando a opção `innodb_page_size` ao criar a instância do MySQL, o comprimento máximo da chave do índice é reduzido proporcionalmente, com base no limite de 3072 bytes para um tamanho de página de 16KB. Isso significa que o comprimento máximo da chave do índice é de 1536 bytes quando o tamanho da página é de 8KB e 768 bytes quando o tamanho da página é de 4KB.

  Os limites que se aplicam aos prefixos de chaves de índice também se aplicam às chaves de índice de coluna inteira.

- Um máximo de 16 colunas é permitido para índices de múltiplas colunas. Exceder o limite retorna um erro.

  ```sql
  ERROR 1070 (42000): Too many key parts specified; max 16 parts allowed
  ```

- O tamanho máximo de linha, excluindo quaisquer colunas de comprimento variável armazenadas fora da página, é ligeiramente inferior a metade de uma página para os tamanhos de página de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo de linha para o valor padrão `innodb_page_size` de 16KB é de aproximadamente 8000 bytes. No entanto, para um tamanho de página `InnoDB` de 64KB, o tamanho máximo de linha é de aproximadamente 16000 bytes. As colunas `LONGBLOB` e `LONGTEXT` devem ser menores que 4GB, e o tamanho total da linha, incluindo as colunas `BLOB` e `TEXT`, deve ser menor que 4GB.

  Se uma linha tiver menos de meia página, toda ela será armazenada localmente dentro da página. Se ultrapassar meia página, colunas de comprimento variável serão escolhidas para armazenamento externo fora da página até que a linha se encaixe em meia página, conforme descrito na Seção 14.12.2, “Gestão do Espaço de Arquivo”.

- Embora o `InnoDB` suporte tamanhos de linha maiores que 65.535 bytes internamente, o próprio MySQL impõe um limite de tamanho de linha de 65.535 para o tamanho combinado de todas as colunas. Veja a Seção 8.4.7, “Limites de Contagem de Colunas de Tabela e Tamanho de Linha”.

- Em alguns sistemas operacionais mais antigos, os arquivos devem ter menos de 2 GB. Isso não é uma limitação do `InnoDB`. Se você precisar de um grande espaço de tabela do sistema, configure-o usando vários arquivos de dados menores, em vez de um único arquivo de dados grande, ou distribua os dados da tabela entre arquivos de dados por tabela e arquivos de dados do espaço de tabela geral.

- O tamanho máximo combinado para os arquivos de log do `InnoDB` é de 512 GB.

- O tamanho mínimo do espaço de tabela é ligeiramente maior que 10 MB. O tamanho máximo do espaço de tabela depende do tamanho da página do `InnoDB`.

  **Tabela 14.25 Tamanho máximo do espaço de tabelas InnoDB**

  <table summary="O tamanho máximo do espaço de tabela para cada tamanho de página do InnoDB."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tamanho da página do InnoDB</th> <th>Tamanho máximo do espaço de tabela</th> </tr></thead><tbody><tr> <td>4 KB</td> <td>16TB</td> </tr><tr> <td>8 KB</td> <td>32 TB</td> </tr><tr> <td>16 KB</td> <td>64 TB</td> </tr><tr> <td>32 KB</td> <td>128 TB</td> </tr><tr> <td>64 KB</td> <td>256 TB</td> </tr></tbody></table>

  O tamanho máximo do espaço de tabela também é o tamanho máximo para uma tabela.

- Os arquivos de tablespace não podem exceder 4 GB em sistemas de 32 bits do Windows (bug #80149).

- Uma instância do `InnoDB` suporta até 2^32 (4294967296) espaços de tabelas, com um pequeno número desses espaços de tabelas reservados para desfazer e tabelas temporárias.

- Os espaços de tabela compartilhados suportam até 2^32 (4294967296) tabelas.

- O caminho de um arquivo de espaço de tabela, incluindo o nome do arquivo, não pode exceder o limite `MAX_PATH` no Windows. Antes do Windows 10, o limite `MAX_PATH` é de 260 caracteres. A partir do Windows 10, versão 1607, as limitações de `MAX_PATH` são removidas das funções comuns de arquivos e diretórios Win32, mas você deve habilitar o novo comportamento.

- `ROW_FORMAT=COMPRESSED` no formato de arquivo Barracuda assume que o tamanho da página é de no máximo 16 KB e usa ponteiros de 14 bits.

- Para limites associados a transações de leitura e escrita concorrentes, consulte a Seção 14.6.7, "Registros de Anulação".
