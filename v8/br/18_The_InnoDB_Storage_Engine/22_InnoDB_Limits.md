## 17.22 Limitações do InnoDB

Esta seção descreve os limites para as tabelas `InnoDB`, índices, espaços de tabela e outros aspectos do motor de armazenamento `InnoDB`.

* Uma tabela pode conter um máximo de 1.017 colunas. As colunas virtualmente geradas estão incluídas nesse limite.

* Uma tabela pode conter um máximo de 64 índices secundários.

* O limite de comprimento do prefixo da chave do índice é de 3072 bytes para as tabelas `InnoDB` que utilizam o formato de linha `DYNAMIC` ou `COMPRESSED`.

O limite de comprimento do prefixo da chave do índice é de 767 bytes para as tabelas `InnoDB` que utilizam o formato de linha `REDUNDANT` ou `COMPACT`. Por exemplo, você pode atingir esse limite com um índice de prefixo de coluna com mais de 191 caracteres em uma coluna `TEXT` ou `VARCHAR`, assumindo um conjunto de caracteres `utf8mb4` e o máximo de 4 bytes para cada caractere.

Tentar usar um prefixo de comprimento de chave de índice que exceda o limite retorna um erro.

Se você reduzir o tamanho da página `InnoDB` para 8KB ou 4KB, especificando a opção `innodb_page_size` ao criar a instância do MySQL, o comprimento máximo da chave do índice é reduzido proporcionalmente, com base no limite de 3072 bytes para um tamanho de página de 16KB. Isso significa que o comprimento máximo da chave do índice é de 1536 bytes quando o tamanho da página é de 8KB e 768 bytes quando o tamanho da página é de 4KB.

Os limites que se aplicam aos prefixos de chave de índice também se aplicam às chaves de índice de coluna inteira.

* É permitido um máximo de 16 colunas para índices de múltiplas colunas. Exceder o limite retorna um erro.

  ```
  ERROR 1070 (42000): Too many key parts specified; max 16 parts allowed
  ```

* O tamanho máximo da linha, excluindo quaisquer colunas de comprimento variável que sejam armazenadas fora da página, é um pouco menos de metade de uma página para tamanhos de página de 4KB, 8KB, 16KB e 32KB. Por exemplo, o tamanho máximo da linha para o `innodb_page_size` padrão de 16KB é de aproximadamente 8000 bytes. No entanto, para um tamanho de página `InnoDB` de 64KB, o tamanho máximo da linha é de aproximadamente 16000 bytes. As colunas `LONGBLOB` e `LONGTEXT` devem ser menores que 4GB, e o tamanho total da linha, incluindo as colunas `BLOB` e `TEXT`, deve ser menor que 4GB.

Se uma linha tiver menos de meia página, toda ela será armazenada localmente dentro da página. Se ultrapassar meia página, colunas de comprimento variável serão escolhidas para armazenamento externo fora da página até que a linha se encaixe em meia página, conforme descrito na Seção 17.11.2, “Gestão do Espaço de Arquivo”.

* Embora o `InnoDB` suporte tamanhos de linha maiores que 65.535 bytes internamente, o próprio MySQL impõe um limite de tamanho de linha de 65.535 para o tamanho combinado de todas as colunas. Veja a Seção 10.4.7, “Limites no número de colunas da tabela e tamanho de linha”.

* O tamanho máximo da tabela ou espaço de tabela é afetado pelo sistema de arquivos do servidor, que pode impor um tamanho máximo de arquivo menor que o limite interno de 64 TiB definido por `InnoDB`. Por exemplo, o sistema de arquivos *ext4* no Linux tem um tamanho máximo de arquivo de 16 TiB, então o tamanho máximo da tabela ou espaço de tabela se torna 16 TiB em vez de 64 TiB. Outro exemplo é o sistema de arquivos *FAT32*, que tem um tamanho máximo de arquivo de 4 GB.

Se você precisar de um espaço de tabela de sistema maior, configure-o usando vários arquivos de dados menores, em vez de um único arquivo de dados grande, ou distribua os dados da tabela em arquivos de dados por tabela e arquivos de dados de espaço de tabela geral.

* O tamanho máximo combinado para os arquivos de registro `InnoDB` é de 512 GB.

* O tamanho mínimo do espaço de tabela é ligeiramente maior que 10 MB. O tamanho máximo do espaço de tabela depende do tamanho da página `InnoDB`.

**Tabela 17.31 Tamanho máximo do espaço de tabelas InnoDB**

  <table summary="The maximum tablespace size for each InnoDB page size."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>InnoDB Page Size</th> <th>Maximum Tablespace Size</th> </tr></thead><tbody><tr> <td>4KB</td> <td>16TB</td> </tr><tr> <td>8KB</td> <td>32TB</td> </tr><tr> <td>16KB</td> <td>64TB</td> </tr><tr> <td>32KB</td> <td>128TB</td> </tr><tr> <td>64KB</td> <td>256TB</td> </tr></tbody></table>

O tamanho máximo do espaço de tabela também é o tamanho máximo para uma tabela.

* Uma instância `InnoDB` suporta até 2^32 (4294967296) espaços de tabela, com um pequeno número desses espaços de tabela reservados para desfazer e tabelas temporárias.

* Os espaços de tabelas compartilhados suportam até 2^32 (4294967296) tabelas.
* O caminho de um arquivo de espaço de tabelas, incluindo o nome do arquivo, não pode exceder o limite `MAX_PATH` no Windows. Antes do Windows 10, o limite `MAX_PATH` é de 260 caracteres. A partir do Windows 10, versão 1607, as limitações `MAX_PATH` são removidas das funções comuns de arquivos e diretórios Win32, mas você deve habilitar o novo comportamento.

* Para limites associados a transações de leitura e escrita concorrentes, consulte a Seção 17.6.6, "Registros de Anulação".