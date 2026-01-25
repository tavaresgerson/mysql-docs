### 14.12.2 Gerenciamento do Espaço de Arquivo

Os Data Files que você define no arquivo de configuração usando a opção de configuração `innodb_data_file_path` formam o System Tablespace do `InnoDB`. Os arquivos são logicamente concatenados para formar o System Tablespace. Não há striping em uso. Você não pode definir onde, dentro do System Tablespace, suas tables são alocadas. Em um System Tablespace recém-criado, o `InnoDB` aloca espaço começando do primeiro Data File.

Para evitar os problemas que surgem ao armazenar todas as tables e Indexes dentro do System Tablespace, você pode habilitar a opção de configuração `innodb_file_per_table` (o padrão), que armazena cada table recém-criada em um arquivo Tablespace separado (com extensão `.ibd`). Para tables armazenadas dessa forma, há menos fragmentação dentro do arquivo de disco e, quando a table é truncada, o espaço é devolvido ao sistema operacional em vez de permanecer reservado pelo InnoDB dentro do System Tablespace. Para mais informações, consulte a Seção 14.6.3.2, “File-Per-Table Tablespaces”.

Você também pode armazenar tables em General Tablespaces. General Tablespaces são Tablespaces compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do Data Directory do MySQL, são capazes de armazenar múltiplas tables e suportam tables de todos os formatos de row. Para mais informações, consulte a Seção 14.6.3.3, “General Tablespaces”.

#### Pages, Extents, Segments e Tablespaces

Cada Tablespace consiste em Database Pages. Todo Tablespace em uma instância MySQL tem o mesmo Page Size. Por padrão, todos os Tablespaces têm um Page Size de 16KB; você pode reduzir o Page Size para 8KB ou 4KB especificando a opção `innodb_page_size` ao criar a instância MySQL. Você também pode aumentar o Page Size para 32KB ou 64KB. Para mais informações, consulte a documentação de `innodb_page_size`.

As Pages são agrupadas em Extents de 1MB para Pages de até 16KB (64 Pages consecutivas de 16KB, ou 128 Pages de 8KB, ou 256 Pages de 4KB). Para um Page Size de 32KB, o Extent Size é de 2MB. Para um Page Size de 64KB, o Extent Size é de 4MB. Os “arquivos” dentro de um Tablespace são chamados de Segments no `InnoDB`. (Esses Segments são diferentes do rollback segment, que na verdade contém muitos Tablespace Segments.)

Quando um Segment cresce dentro do Tablespace, o `InnoDB` aloca as primeiras 32 Pages, uma de cada vez. Depois disso, o `InnoDB` começa a alocar Extents inteiros para o Segment. O `InnoDB` pode adicionar até 4 Extents de uma vez a um Segment grande para garantir uma boa sequencialidade dos dados.

Dois Segments são alocados para cada Index no `InnoDB`. Um é para os nonleaf nodes da B-tree, o outro é para os leaf nodes. Manter os leaf nodes contíguos no disco permite melhores operações de I/O sequenciais, pois esses leaf nodes contêm os dados reais da table.

Algumas Pages no Tablespace contêm bitmaps de outras Pages e, portanto, alguns Extents em um Tablespace `InnoDB` não podem ser alocados a Segments como um todo, mas apenas como Pages individuais.

Quando você solicita o espaço livre disponível no Tablespace emitindo uma instrução `SHOW TABLE STATUS`, o `InnoDB` reporta os Extents que estão definitivamente livres no Tablespace. O `InnoDB` sempre reserva alguns Extents para limpeza e outros propósitos internos; esses Extents reservados não estão incluídos no espaço livre.

Quando você deleta dados de uma table, o `InnoDB` contrai os B-tree Indexes correspondentes. Se o espaço liberado fica disponível para outros usuários depende se o padrão de exclusões libera Pages ou Extents individuais para o Tablespace. Fazer o Drop de uma table ou deletar todas as rows dela garante a liberação do espaço para outros usuários, mas lembre-se de que as rows deletadas são fisicamente removidas apenas pela operação de purge, que acontece automaticamente algum tempo depois de não serem mais necessárias para rollbacks de Transaction ou Consistent Reads. (Consulte a Seção 14.3, “InnoDB Multi-Versioning”.)

#### Como Pages se Relacionam com Table Rows

O comprimento máximo de uma row é ligeiramente menor que a metade de uma Database Page para as configurações de `innodb_page_size` de 4KB, 8KB, 16KB e 32KB. Por exemplo, o comprimento máximo da row é ligeiramente menor que 8KB para o Page Size padrão de 16KB do `InnoDB`. Para Pages de 64KB, o comprimento máximo da row é ligeiramente menor que 16KB.

Se uma row não exceder o comprimento máximo da row, ela é totalmente armazenada localmente dentro da Page. Se uma row exceder o comprimento máximo da row, colunas de comprimento variável são escolhidas para armazenamento externo off-page até que a row se ajuste ao limite máximo de comprimento da row. O armazenamento externo off-page para colunas de comprimento variável difere por Row Format:

* *COMPACT e REDUNDANT Row Formats*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo off-page, o `InnoDB` armazena os primeiros 768 bytes localmente na row e o restante externamente em overflow pages. Cada coluna tem sua própria lista de overflow pages. O prefixo de 768 bytes é acompanhado por um valor de 20 bytes que armazena o comprimento real da coluna e aponta para a overflow list onde o restante do valor está armazenado. Consulte a Seção 14.11, “InnoDB Row Formats”.

* *DYNAMIC e COMPRESSED Row Formats*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo off-page, o `InnoDB` armazena um pointer de 20 bytes localmente na row e o restante externamente em overflow pages. Consulte a Seção 14.11, “InnoDB Row Formats”.

As colunas `LONGBLOB` e `LONGTEXT` devem ter menos de 4GB, e o comprimento total da row, incluindo as colunas `BLOB` e `TEXT`, deve ser inferior a 4GB.