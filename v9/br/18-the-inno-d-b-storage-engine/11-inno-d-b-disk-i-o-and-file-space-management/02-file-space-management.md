### 17.11.1 Gerenciamento de Espaço de Arquivo

Os arquivos de dados que você define no arquivo de configuração usando a opção de configuração `innodb_data_file_path` formam o espaço de tabela do sistema `InnoDB`. Os arquivos são concatenados logicamente para formar o espaço de tabela do sistema. Não há striping em uso. Você não pode definir onde dentro do espaço de tabela do sistema suas tabelas serão alocadas. Em um espaço de tabela do sistema recém-criado, o `InnoDB` aloca espaço a partir do primeiro arquivo de dados.

Para evitar os problemas que vêm com o armazenamento de todas as tabelas e índices dentro do espaço de tabela do sistema, você pode habilitar a opção de configuração `innodb_file_per_table` (a padrão), que armazena cada tabela recém-criada em um arquivo de espaço de tabela separado (com a extensão `.ibd`). Para tabelas armazenadas dessa maneira, há menos fragmentação dentro do arquivo do disco, e quando a tabela é truncada, o espaço é devolvido ao sistema operacional em vez de ainda ser reservado pelo `InnoDB` dentro do espaço de tabela do sistema. Para mais informações, consulte a Seção 17.6.3.2, “Espaços de Tabela por Tabela”.

Você também pode armazenar tabelas em espaços de tabelas gerais. Espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados do MySQL, são capazes de conter múltiplas tabelas e suportam tabelas de todos os formatos de linha. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

#### Páginas, Extensões, Segmentos e Espaços de Tabela
## 17.11.2 Gerenciamento de Espaço de Arquivo

Os arquivos de dados que você define no arquivo de configuração usando a opção de configuração `innodb_data_file_path` formam o espaço de tabela do sistema `InnoDB`. Os arquivos são concatenados logicamente para formar o espaço de tabela do sistema. Não há striping em uso. Você não pode definir onde dentro do espaço de tabela do sistema suas tabelas serão alocadas. Em um espaço de tabela do sistema recém-criado, o `InnoDB` aloca espaço a partir do primeiro arquivo de dados.

Para evitar os problemas que vêm com o armazenamento de todas as tabelas e índices dentro do espaço de tabela do sistema, você pode habilitar a opção de configuração `innodb_file_per_table` (a padrão), que armazena cada tabela recém-criada em um arquivo de espaço de tabela separado (com a extensão `.ibd`). Para tabelas armazenadas dessa maneira, há menos fragmentação dentro do arquivo do disco, e quando a tabela é truncada, o espaço é devolvido ao sistema operacional em vez de ainda ser reservado pelo `InnoDB` dentro do espaço de tabela do sistema. Para mais informações, consulte a Seção 17.6.3.2, “Espaços de Tabela por Tabela”.

Você também pode armazenar tabelas em espaços de tabelas gerais. Espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados do MySQL, são capazes de conter múltiplas tabelas e suportam tabelas de todos os formatos de linha. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

Cada espaço de tabelas é composto por páginas de banco de dados. Todos os espaços de tabelas de uma instância do MySQL têm o mesmo tamanho de página. Por padrão, todos os espaços de tabelas têm um tamanho de página de 16 KB; você pode reduzir o tamanho de página para 8 KB ou 4 KB, especificando a opção `innodb_page_size` ao criar a instância do MySQL. Você também pode aumentar o tamanho de página para 32 KB ou 64 KB. Para mais informações, consulte a documentação do `innodb_page_size`.

As páginas são agrupadas em extensões de tamanho de 1 MB para páginas de até 16 KB (64 páginas consecutivas de 16 KB, ou 128 páginas de 8 KB, ou 256 páginas de 4 KB). Para um tamanho de página de 32 KB, o tamanho da extensão é de 2 MB. Para um tamanho de página de 64 KB, o tamanho da extensão é de 4 MB. Os “arquivos” dentro de um espaço de tabelas são chamados de segmentos no `InnoDB`. (Esses segmentos são diferentes do segmento de rollback, que na verdade contém muitos segmentos de espaço de tabelas.)

Quando um segmento cresce dentro do espaço de tabelas, o `InnoDB` aloca as primeiras 32 páginas para ele uma de cada vez. Depois disso, o `InnoDB` começa a alocar extensões inteiras para o segmento. O `InnoDB` pode adicionar até 4 extensões de cada vez a um grande segmento para garantir uma boa sequencialidade dos dados.

Dois segmentos são alocados para cada índice no `InnoDB`. Um é para os nós não-folhas da árvore B, e o outro é para os nós folhas. Manter os nós folhas contiguos no disco permite operações de I/O sequenciais melhores, porque esses nós folhas contêm os dados reais da tabela.

Algumas páginas no espaço de tabelas contêm mapas de bits de outras páginas, e, portanto, alguns extensões em um espaço de tabelas `InnoDB` não podem ser alocadas para segmentos como um todo, mas apenas como páginas individuais.

Quando você solicita espaço livre disponível no tablespace executando uma declaração `SHOW TABLE STATUS`, o `InnoDB` relata os extensões que estão definitivamente livres no tablespace. O `InnoDB` reserva sempre alguns extensões para limpeza e outros propósitos internos; essas extensões reservadas não estão incluídas no espaço livre.

Quando você exclui dados de uma tabela, o `InnoDB` contrai os índices B-tree correspondentes. Se o espaço liberado ficar disponível para outros usuários, isso depende se o padrão de exclusões libera páginas individuais ou extensões para o tablespace. A exclusão de uma tabela ou a exclusão de todas as linhas dela garante a liberação do espaço para outros usuários, mas lembre-se de que as linhas excluídas são removidas fisicamente apenas pela operação de purga, que acontece automaticamente algum tempo depois de não serem mais necessárias para rolamentos de transações ou leituras consistentes. (Veja a Seção 17.3, “InnoDB Multi-Versioning”.)

#### Configurando a Porcentagem de Páginas de Segmento de Arquivo Reservadas

A variável `innodb_segment_reserve_factor` permite definir a porcentagem de páginas do segmento de arquivo do tablespace reservadas como páginas vazias. Uma porcentagem de páginas é reservada para o crescimento futuro para que as páginas na árvore B-tree possam ser alocadas de forma contigua. A capacidade de modificar a porcentagem de páginas reservadas permite ajustar o `InnoDB` para resolver problemas de fragmentação de dados ou uso ineficiente do espaço de armazenamento.

A configuração é aplicável a tablespaces de arquivo por tabela e gerais. O valor padrão da variável `innodb_segment_reserve_factor` é 12,5 por cento.

A variável `innodb_segment_reserve_factor` é dinâmica e pode ser configurada usando uma declaração `SET`. Por exemplo:

```
mysql> SET GLOBAL innodb_segment_reserve_factor=10;
```

#### Como Páginas Relam-se com Linhas de Tabela
English (source):
When you ask for available free space in the tablespace by issuing a `SHOW TABLE STATUS` statement, `InnoDB` reports the extents that are definitely free in the tablespace. `InnoDB` always reserves some extents for cleanup and other internal purposes; these reserved extents are not included in the free space.

Para as configurações `innodb_page_size` de 4KB, 8KB, 16KB e 32KB, o comprimento máximo da linha é ligeiramente inferior a metade do tamanho de uma página do banco de dados. Por exemplo, o comprimento máximo da linha é ligeiramente inferior a 8KB para o tamanho de página padrão de 16KB do `InnoDB`. Para uma configuração `innodb_page_size` de 64KB, o comprimento máximo da linha é ligeiramente inferior a 16KB.

Se uma linha não exceder o comprimento máximo da linha, toda ela é armazenada localmente dentro da página. Se uma linha exceder o comprimento máximo da linha, colunas de comprimento variável são escolhidas para armazenamento externo fora da página até que a linha se encaixe dentro do limite de comprimento máximo da linha. O armazenamento externo fora da página para colunas de comprimento variável difere por formato de linha:

* *Formatos de Linha COMPACT e REDUNDANTE*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, o `InnoDB` armazena os primeiros 768 bytes localmente na linha e o restante externamente em páginas de excedente. Cada coluna tem sua própria lista de páginas de excedente. O prefixo de 768 bytes é acompanhado por um valor de 20 bytes que armazena o verdadeiro comprimento da coluna e aponta para a lista de excedente onde o restante do valor é armazenado. Veja a Seção 17.10, “Formatos de Linha InnoDB”.

* *Formatos de Linha DINÂMICA e COMPRIMIDO*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, o `InnoDB` armazena um ponteiro de 20 bytes localmente na linha e o restante externamente em páginas de excedente. Veja a Seção 17.10, “Formatos de Linha InnoDB”.

As colunas `LONGBLOB` e `LONGTEXT` devem ser menores que 4GB, e o comprimento total da linha, incluindo as colunas `BLOB` e `TEXT`, deve ser menor que 4GB.