### 17.11.1 Gerenciamento de Espaço de Arquivo

Os arquivos de dados que você define no arquivo de configuração usando a opção de configuração `innodb_data_file_path` formam o espaço de tabelas do sistema `InnoDB`. Os arquivos são concatenados logicamente para formar o espaço de tabelas do sistema. Não há striping em uso. Você não pode definir onde dentro do espaço de tabelas do sistema suas tabelas serão alocadas. Em um espaço de tabelas do sistema recém-criado, `InnoDB` aloca espaço a partir do primeiro arquivo de dados.

Para evitar os problemas que surgem ao armazenar todas as tabelas e índices dentro do espaço de tabelas do sistema, você pode habilitar a opção de configuração `innodb_file_per_table` (a padrão), que armazena cada tabela recém-criada em um arquivo de espaço de tabela separado (com a extensão `.ibd`). Para tabelas armazenadas dessa maneira, há menos fragmentação no arquivo do disco e, quando a tabela é truncada, o espaço é devolvido ao sistema operacional em vez de ainda ser reservado pelo InnoDB dentro do espaço de tabelas do sistema. Para mais informações, consulte a Seção 17.6.3.2, “Espaços de Tabelas por Arquivo”.

Você também pode armazenar tabelas em espaços de tabelas gerais. Os espaços de tabelas gerais são espaços de tabelas compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados do MySQL, podem armazenar múltiplas tabelas e suportar tabelas de todos os formatos de linha. Para mais informações, consulte a Seção 17.6.3.3, “Espaços de Tabelas Gerais”.

#### Páginas, Extensões, Segmentos e Espaços de Tabelas

Cada espaço de tabela é composto por páginas de banco de dados. Todos os espaços de tabela de uma instância do MySQL têm o mesmo tamanho de página. Por padrão, todos os espaços de tabela têm um tamanho de página de 16 KB; você pode reduzir o tamanho de página para 8 KB ou 4 KB, especificando a opção `innodb_page_size` ao criar a instância do MySQL. Você também pode aumentar o tamanho de página para 32 KB ou 64 KB. Para mais informações, consulte a documentação `innodb_page_size`.

As páginas são agrupadas em extensões de tamanho 1 MB para páginas de até 16 KB (64 páginas consecutivas de 16 KB, ou 128 páginas de 8 KB, ou 256 páginas de 4 KB). Para um tamanho de página de 32 KB, o tamanho da extensão é de 2 MB. Para um tamanho de página de 64 KB, o tamanho da extensão é de 4 MB. Os "arquivos" dentro de um tablespace são chamados de segmentos em `InnoDB`. (Esses segmentos são diferentes do segmento de rollback, que na verdade contém muitos segmentos do tablespace.)

Quando um segmento cresce dentro do espaço de tabelas, o `InnoDB` aloca as primeiras 32 páginas para ele, uma de cada vez. Depois disso, o `InnoDB` começa a alocar extensões inteiras para o segmento. O `InnoDB` pode adicionar até 4 extensões de cada vez a um segmento grande para garantir uma boa sequencialidade dos dados.

Dois segmentos são alocados para cada índice em `InnoDB`. Um deles é para nós não-folhas da árvore B, e o outro é para os nós folhas. Manter os nós folhas contiguos no disco permite operações de E/S sequenciais melhores, porque esses nós folhas contêm os dados reais da tabela.

Algumas páginas no espaço de tabelas contêm mapas de bits de outras páginas, e, portanto, alguns extensões em um espaço de tabelas `InnoDB` não podem ser alocadas para segmentos como um todo, mas apenas como páginas individuais.

Quando você solicita espaço livre disponível no tablespace emitindo uma declaração `SHOW TABLE STATUS`, o `InnoDB` relata os extensões que estão definitivamente livres no tablespace. O `InnoDB` reserva sempre alguns extensões para limpeza e outros fins internos; essas extensões reservadas não estão incluídas no espaço livre.

Quando você exclui dados de uma tabela, o `InnoDB` contrai os índices B-tree correspondentes. Se o espaço liberado ficar disponível para outros usuários, isso depende se o padrão de exclusões libera páginas individuais ou se estende ao espaço de tabelas. A remoção de uma tabela ou a exclusão de todas as linhas dela garante a liberação do espaço para outros usuários, mas lembre-se de que as linhas excluídas são removidas fisicamente apenas pela operação de purga, que acontece automaticamente algum tempo depois de não serem mais necessárias para recuos de transações ou leituras consistentes. (Veja a Seção 17.3, “Multiversão InnoDB”.)

#### Configurar a porcentagem de páginas de segmentos de arquivo reservados

A variável `innodb_segment_reserve_factor`, introduzida no MySQL 8.0.26, é uma funcionalidade avançada que permite definir a porcentagem de páginas do segmento de arquivo do espaço de tabela reservadas como páginas vazias. Uma porcentagem de páginas é reservada para o crescimento futuro, para que as páginas na árvore B possam ser alocadas de forma contigua. A capacidade de modificar a porcentagem de páginas reservadas permite ajustar `InnoDB` para resolver problemas de fragmentação de dados ou uso ineficiente do espaço de armazenamento.

O ajuste é aplicável a arquivos por tabela e espaços de tabela gerais. O ajuste padrão `innodb_segment_reserve_factor` é de 12,5 por cento, que é a mesma porcentagem de páginas reservadas em versões anteriores do MySQL.

A variável `innodb_segment_reserve_factor` é dinâmica e pode ser configurada usando uma instrução `SET`. Por exemplo:

```
mysql> SET GLOBAL innodb_segment_reserve_factor=10;
```

#### Como as Páginas se Relacionam com as Linhas da Tabela

Para configurações de 4KB, 8KB, 16KB e 32KB `innodb_page_size`, o comprimento máximo da linha é ligeiramente inferior a metade do tamanho de uma página de banco de dados. Por exemplo, o comprimento máximo da linha é ligeiramente inferior a 8KB para o tamanho de página padrão de 16KB `InnoDB`. Para uma configuração de 64KB `innodb_page_size`, o comprimento máximo da linha é ligeiramente inferior a 16KB.

Se uma linha não ultrapassar o comprimento máximo da linha, toda ela é armazenada localmente dentro da página. Se uma linha ultrapassar o comprimento máximo da linha, colunas de comprimento variável são escolhidas para armazenamento externo fora da página até que a linha se encaixe no limite máximo de comprimento da linha. O armazenamento externo fora da página para colunas de comprimento variável difere pelo formato da linha:

- *Formulários de linhas COMPACT e REDUNDANTES*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, `InnoDB` armazena os primeiros 768 bytes localmente na linha e o restante externamente em páginas de excedente. Cada coluna tem sua própria lista de páginas de excedente. O prefixo de 768 bytes é acompanhado por um valor de 20 bytes que armazena o comprimento real da coluna e aponta para a lista de excedente onde o restante do valor é armazenado. Veja a Seção 17.10, “Formulários de Linhas InnoDB”.

- *Formulários de linhas dinâmicos e compactados*

  Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, `InnoDB` armazena um ponteiro de 20 bytes localmente na linha e o restante externamente em páginas de excedente. Veja a Seção 17.10, “Formatos de Linhas do InnoDB”.

As colunas `LONGBLOB` e `LONGTEXT` devem ter menos de 4 GB, e o comprimento total da linha, incluindo as colunas `BLOB` e `TEXT`, deve ter menos de 4 GB.
