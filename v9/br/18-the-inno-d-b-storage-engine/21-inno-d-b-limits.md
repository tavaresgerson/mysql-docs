## Limites do InnoDB

Esta seção descreve os limites para as tabelas `InnoDB`, índices, espaços de tabelas e outros aspectos do motor de armazenamento `InnoDB`.

* Uma tabela pode conter no máximo 1017 colunas. As colunas geradas virtualmente estão incluídas neste limite.

* Uma tabela pode conter no máximo 64 índices secundários.

* O limite de comprimento do prefixo da chave do índice é de 3072 bytes para tabelas `InnoDB` que usam o formato de linha `DYNAMIC` ou `COMPRESSED`.

  O limite de comprimento do prefixo da chave do índice é de 767 bytes para tabelas `InnoDB` que usam o formato de linha `REDUNDANT` ou `COMPACT`. Por exemplo, você pode atingir este limite com um índice de prefixo de coluna de mais de 191 caracteres em uma coluna `TEXT` ou `VARCHAR`, assumindo um conjunto de caracteres `utf8mb4` e o máximo de 4 bytes para cada caractere.

  Tentar usar um comprimento de prefixo da chave do índice que exceda o limite retorna um erro.

  Se você reduzir o tamanho da página do `InnoDB` para 8KB ou 4KB especificando a opção `innodb_page_size` ao criar a instância do MySQL, o comprimento máximo da chave do índice é reduzido proporcionalmente, com base no limite de 3072 bytes para um tamanho de página de 16KB. Ou seja, o comprimento máximo da chave do índice é de 1536 bytes quando o tamanho da página é de 8KB e 768 bytes quando o tamanho da página é de 4KB.

  Os limites que se aplicam aos prefixos de chaves de índice também se aplicam às chaves de índice de coluna completa.

* É permitido um máximo de 16 colunas para índices de coluna múltipla. Exceder o limite retorna um erro.

  ```
  ERROR 1070 (42000): Too many key parts specified; max 16 parts allowed
  ```

* O tamanho máximo de linha, excluindo quaisquer colunas de comprimento variável que sejam armazenadas fora da página, é ligeiramente inferior a metade de uma página para tamanhos de página de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo de linha para o valor padrão `innodb_page_size` de 16KB é de aproximadamente 8000 bytes. No entanto, para um tamanho de página `InnoDB` de 64KB, o tamanho máximo de linha é de aproximadamente 16000 bytes. As colunas `LONGBLOB` e `LONGTEXT` devem ser menores que 4GB, e o tamanho total da linha, incluindo as colunas `BLOB` e `TEXT`, deve ser menor que 4GB.

  Se uma linha tiver menos de metade de uma página, toda ela é armazenada localmente dentro da página. Se exceder metade de uma página, colunas de comprimento variável são escolhidas para armazenamento externo fora da página até que a linha se encaixe dentro de metade de uma página, conforme descrito na Seção 17.11.2, “Gestão de Espaço em Arquivo”.

* Embora o `InnoDB` suporte tamanhos de linha maiores que 65.535 bytes internamente, o próprio MySQL impõe um limite de tamanho de linha de 65.535 para o tamanho combinado de todas as colunas. Veja a Seção 10.4.7, “Limites de Contagem de Colunas de Tabela e Tamanho de Linha”.

* O tamanho máximo da tabela ou espaço de tabelas é impactado pelo sistema de arquivos do servidor, que pode impor um tamanho máximo de arquivo menor que o limite de tamanho de arquivo interno de 64 TiB definido pelo `InnoDB`. Por exemplo, o sistema de arquivos *ext4* no Linux tem um tamanho máximo de arquivo de 16 TiB, então o tamanho máximo da tabela ou espaço de tabelas se torna 16 TiB em vez de 64 TiB. Outro exemplo é o sistema de arquivos *FAT32*, que tem um tamanho máximo de arquivo de 4 GB.

  Se você precisar de um espaço de tabelas do sistema maior, configure-o usando vários arquivos de dados menores em vez de um único arquivo de dados grande, ou distribua os dados da tabela entre arquivos de dados por tabela e arquivos de dados do espaço de tabela geral.

* O tamanho máximo combinado para arquivos de log `InnoDB` é de 512GB.

* O tamanho mínimo do espaço de tabelas é ligeiramente maior que 10 MB. O tamanho máximo do espaço de tabelas depende do tamanho da página do `InnoDB`.

  **Tabela 17.24 Tamanho Máximo do Espaço de Tabelas do InnoDB**

  <table summary="O tamanho máximo do espaço de tabelas para cada tamanho de página do InnoDB."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Tamanho da Página do InnoDB</th> <th>Tamanho Máximo do Espaço de Tabelas</th> </tr></thead><tbody><tr> <td>4KB</td> <td>16TB</td> </tr><tr> <td>8KB</td> <td>32TB</td> </tr><tr> <td>16KB</td> <td>64TB</td> </tr><tr> <td>32KB</td> <td>128TB</td> </tr><tr> <td>64KB</td> <td>256TB</td> </tr></tbody></table>

  O tamanho máximo do espaço de tabelas também é o tamanho máximo para uma tabela.

* Uma instância do `InnoDB` suporta até 2^32 (4294967296) espaços de tabelas, com um pequeno número desses espaços de tabelas reservados para logs de desfazer e tabelas temporárias.

* Espaços de tabelas compartilhados suportam até 2^32 (4294967296) tabelas.
* O caminho de um arquivo de espaço de tabelas, incluindo o nome do arquivo, não pode exceder o limite `MAX_PATH` no Windows. Antes do Windows 10, o limite `MAX_PATH` é de 260 caracteres. A partir do Windows 10, versão 1607, as limitações de `MAX_PATH` são removidas das funções comuns de arquivos e diretórios Win32, mas você deve habilitar o novo comportamento.

* Para limites associados a transações de leitura e escrita concorrentes, consulte a Seção 17.6.6, “Logs de Desfazer”.