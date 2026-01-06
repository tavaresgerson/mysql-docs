### 14.12.1 Gerenciamento de Espaço de Arquivo

Os arquivos de dados que você define no arquivo de configuração usando a opção de configuração `innodb_data_file_path` formam o espaço de tabela do sistema `InnoDB`. Os arquivos são concatenados logicamente para formar o espaço de tabela do sistema. Não há striping em uso. Você não pode definir onde dentro do espaço de tabela do sistema suas tabelas serão alocadas. Em um espaço de tabela do sistema recém-criado, o `InnoDB` aloca espaço a partir do primeiro arquivo de dados.

Para evitar os problemas que surgem ao armazenar todas as tabelas e índices dentro do espaço de tabelas do sistema, você pode habilitar a opção de configuração `innodb_file_per_table` (a opção padrão), que armazena cada tabela recém-criada em um arquivo de espaço de tabela separado (com a extensão `.ibd`). Para tabelas armazenadas dessa maneira, há menos fragmentação no arquivo do disco e, quando a tabela é truncada, o espaço é devolvido ao sistema operacional em vez de ainda ser reservado pelo InnoDB dentro do espaço de tabelas do sistema. Para mais informações, consulte a Seção 14.6.3.2, “Espaços de Tabelas por Arquivo”.

Você também pode armazenar tabelas em espaços de tabelas gerais. Os espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados do MySQL, podem armazenar múltiplas tabelas e suportar tabelas de todos os formatos de linha. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

#### Páginas, Extensões, Segmentos e Espaços de Tabelas

Cada espaço de tabela é composto por páginas de banco de dados. Todos os espaços de tabela de uma instância do MySQL têm o mesmo tamanho de página. Por padrão, todos os espaços de tabela têm um tamanho de página de 16 KB; você pode reduzir o tamanho de página para 8 KB ou 4 KB, especificando a opção `innodb_page_size` ao criar a instância do MySQL. Você também pode aumentar o tamanho de página para 32 KB ou 64 KB. Para mais informações, consulte a documentação do `innodb_page_size`.

As páginas são agrupadas em extensões de tamanho 1 MB para páginas de até 16 KB (64 páginas consecutivas de 16 KB, ou 128 páginas de 8 KB, ou 256 páginas de 4 KB). Para um tamanho de página de 32 KB, o tamanho da extensão é de 2 MB. Para um tamanho de página de 64 KB, o tamanho da extensão é de 4 MB. Os "arquivos" dentro de um tablespace são chamados de segmentos em `InnoDB`. (Esses segmentos são diferentes do segmento de rollback, que na verdade contém muitos segmentos de tablespace.)

Quando um segmento cresce dentro do espaço de tabelas, o `InnoDB` aloca as primeiras 32 páginas para ele, uma de cada vez. Depois disso, o `InnoDB` começa a alocar extensões inteiras para o segmento. O `InnoDB` pode adicionar até 4 extensões de cada vez a um segmento grande para garantir uma boa sequencialidade dos dados.

Em `InnoDB`, dois segmentos são alocados para cada índice. Um deles é para os nós não-folhas da árvore B, e o outro é para os nós folhas. Manter os nós folhas contiguos no disco permite operações de E/S sequenciais melhores, pois esses nós folhas contêm os dados reais da tabela.

Algumas páginas no espaço de tabelas contêm mapas de bits de outras páginas, e, portanto, alguns extensões em um espaço de tabelas `InnoDB` não podem ser alocadas para segmentos como um todo, mas apenas como páginas individuais.

Quando você solicita espaço livre disponível no espaço de tabelas emitindo uma declaração `SHOW TABLE STATUS`, o `InnoDB` relata os extensões que estão definitivamente livres no espaço de tabelas. O `InnoDB` reserva sempre alguns extensões para limpeza e outros fins internos; essas extensões reservadas não estão incluídas no espaço livre.

Quando você exclui dados de uma tabela, o `InnoDB` contrai os índices B-tree correspondentes. Se o espaço liberado ficar disponível para outros usuários, isso depende se o padrão de exclusões libera páginas individuais ou se estende ao espaço de tabelas. A remoção de uma tabela ou a exclusão de todas as linhas dela garante a liberação do espaço para outros usuários, mas lembre-se de que as linhas excluídas são removidas fisicamente apenas pela operação de purga, que acontece automaticamente algum tempo depois de não serem mais necessárias para recuos de transações ou leituras consistentes. (Veja a Seção 14.3, “InnoDB Multiversão”.)

#### Como as Páginas se Relacionam com as Linhas da Tabela

O comprimento máximo da linha é ligeiramente inferior a metade de uma página de banco de dados para as configurações `innodb_page_size` de 4KB, 8KB, 16KB e 32KB. Por exemplo, o comprimento máximo da linha é ligeiramente inferior a 8KB para o tamanho de página padrão de 16KB do `InnoDB`. Para páginas de 64KB, o comprimento máximo da linha é ligeiramente inferior a 16KB.

Se uma linha não ultrapassar o comprimento máximo da linha, toda ela é armazenada localmente dentro da página. Se uma linha ultrapassar o comprimento máximo da linha, colunas de comprimento variável são escolhidas para armazenamento externo fora da página até que a linha se encaixe no limite máximo de comprimento da linha. O armazenamento externo fora da página para colunas de comprimento variável difere pelo formato da linha:

- *Formulários de linhas COMPACT e REDUNDANTES*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, o `InnoDB` armazena os primeiros 768 bytes localmente na linha e o restante externamente em páginas de excedente. Cada coluna tem sua própria lista de páginas de excedente. O prefixo de 768 bytes é acompanhado por um valor de 20 bytes que armazena o comprimento real da coluna e aponta para a lista de excedente onde o restante do valor é armazenado. Veja a Seção 14.11, “Formatos de Linhas do InnoDB”.

- *Formulários de linhas dinâmicos e compactados*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, o `InnoDB` armazena um ponteiro de 20 bytes localmente na linha e o restante externamente em páginas de excedente. Veja a Seção 14.11, “Formatos de Linhas do InnoDB”.

As colunas `LONGBLOB` e `LONGTEXT` devem ter menos de 4 GB, e o comprimento total da linha, incluindo as colunas `BLOB` e `TEXT`, deve ser menor que 4 GB.
