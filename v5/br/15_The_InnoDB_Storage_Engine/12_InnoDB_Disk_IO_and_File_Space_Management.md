## 14.12 Gerenciamento de I/O e Espaço de Arquivo do InnoDB Disk

Como um DBA, você deve gerenciar o I/O de disco para evitar que o subsistema de I/O se sature e gerenciar o espaço em disco para evitar o esgotamento dos dispositivos de armazenamento. O modelo de projeto ACID requer uma certa quantidade de I/O que pode parecer redundante, mas ajuda a garantir a confiabilidade dos dados. Dentro dessas restrições, o `InnoDB` tenta otimizar o trabalho do banco de dados e a organização dos arquivos de disco para minimizar a quantidade de I/O de disco. Às vezes, o I/O é adiado até que o banco de dados não esteja ocupado ou até que tudo precise ser trazido a um estado consistente, como durante o reinício do banco de dados após um desligamento rápido.

Esta seção discute as principais considerações para I/O e espaço em disco com o tipo padrão de tabelas MySQL (também conhecidas como tabelas `InnoDB`):

* Controlar a quantidade de I/O de fundo usada para melhorar o desempenho da consulta.

* Habilitar ou desabilitar recursos que oferecem durabilidade extra em detrimento de I/O adicionais.

* Organizar as tabelas em muitos arquivos pequenos, alguns arquivos maiores ou uma combinação de ambos.

* Equilibrar o tamanho dos arquivos de registro de revisão em relação à atividade de E/S que ocorre quando os arquivos de registro se tornam cheios.

* Como reorganizar uma tabela para um desempenho ótimo de consulta.

### 14.12.1 I/O de disco do InnoDB

`InnoDB` utiliza I/O de disco assíncrono quando possível, criando vários threads para lidar com operações de I/O, permitindo que outras operações de banco de dados prossigam enquanto o I/O ainda está em andamento. Nas plataformas Linux e Windows, `InnoDB` utiliza as funções do sistema operacional e das bibliotecas disponíveis para realizar I/O assíncrono "nativo". Em outras plataformas, `InnoDB` ainda utiliza threads de I/O, mas as threads podem, na verdade, esperar por solicitações de I/O serem concluídas; essa técnica é conhecida como I/O assíncrono "simulado".

#### Leitura Antecipada

Se o `InnoDB` puder determinar que há uma alta probabilidade de que os dados possam ser necessários em breve, ele realiza operações de leitura antecipada para trazer esses dados para o pool de buffer, de modo que estejam disponíveis na memória. Fazer algumas solicitações de leitura grandes para dados contíguos pode ser mais eficiente do que fazer várias solicitações pequenas e espalhadas. Existem duas heurísticas de leitura antecipada no `InnoDB`:

* No pré-leitura sequencial, se `InnoDB` perceber que o padrão de acesso a um segmento no espaço de tabelas é sequencial, ele publica antecipadamente um lote de leituras de páginas do banco de dados no sistema de E/S.

* No pré-leitura aleatória, se `InnoDB` perceber que uma área em um espaço de tabela parece estar em processo de ser totalmente lida no pool de buffer, ele publica as leituras restantes no sistema de E/S.

Para obter informações sobre a configuração das heurísticas de leitura antecipada, consulte a Seção 14.8.3.4, “Configurando a pré-visualização do buffer do InnoDB (Leitura antecipada)”).

#### Buffer de escrita dupla

`InnoDB` utiliza uma técnica de esvaziamento de arquivo inovadora que envolve uma estrutura chamada buffer de dupla escrita, que é ativada por padrão na maioria dos casos (`innodb_doublewrite=ON`). Isso adiciona segurança à recuperação após uma saída inesperada ou falta de energia, e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações de `fsync()`.

Antes de escrever páginas em um arquivo de dados, `InnoDB` as escreve primeiro em uma área de espaço de tabela contigua chamada buffer de dupla escrita. Somente após a escrita e o esvaziamento para o buffer de dupla escrita ter sido concluído, `InnoDB` escreve as páginas em suas posições apropriadas no arquivo de dados. Se houver um sistema operacional, subsistema de armazenamento ou saída inesperada de processo `mysqld`, no meio de uma escrita de página (causando uma condição de página rasgada), `InnoDB` pode, posteriormente, encontrar uma boa cópia da página do buffer de dupla escrita durante a recuperação.

Se os arquivos de espaço de sistema (“arquivos ibdata”) estiverem localizados em dispositivos Fusion-io que suportem gravações atômicas, o buffer de dupla gravação será automaticamente desativado e as gravações atômicas da Fusion-io serão usadas para todos os arquivos de dados. Como o ajuste do buffer de dupla gravação é global, o buffer de dupla gravação também será desativado para arquivos de dados que estejam em hardware que não é da Fusion-io. Esse recurso é suportado apenas em hardware da Fusion-io e é habilitado apenas para NVMFS da Fusion-io no Linux. Para aproveitar ao máximo esse recurso, é recomendado um ajuste `innodb_flush_method` do `O_DIRECT`.

### 14.12.1 Gerenciamento de Espaço de Arquivo

Os arquivos de dados que você define no arquivo de configuração usando a opção de configuração `innodb_data_file_path` formam o espaço de tabelas do sistema `InnoDB`. Os arquivos são concatenados logicamente para formar o espaço de tabelas do sistema. Não há striping em uso. Você não pode definir onde dentro do espaço de tabelas do sistema suas tabelas serão alocadas. Em um espaço de tabelas do sistema recém-criado, `InnoDB` aloca espaço a partir do primeiro arquivo de dados.

Para evitar os problemas que vêm com o armazenamento de todas as tabelas e índices dentro do espaço de tabelas do sistema, você pode habilitar a opção de configuração `innodb_file_per_table` (a padrão), que armazena cada tabela recém-criada em um arquivo de espaço de tabelas separado (com extensão `.ibd`). Para tabelas armazenadas dessa maneira, há menos fragmentação dentro do arquivo do disco, e quando a tabela é truncada, o espaço é devolvido ao sistema operacional em vez de ainda ser reservado pelo InnoDB dentro do espaço de tabelas do sistema. Para mais informações, consulte a Seção 14.6.3.2, “Espaços de tabelas por tabela por arquivo”.

Você também pode armazenar tabelas em espaços de tabela gerais. Os espaços de tabela gerais são espaços de tabela compartilhados criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do diretório de dados do MySQL, são capazes de conter múltiplas tabelas e suportam tabelas de todos os formatos de linha. Para mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabela Geral”.

#### Páginas, Extensões, Segmentos e Espaços de Tabela

Cada tablespace é composto por páginas de banco de dados. Todos os tablespaces de uma instância do MySQL têm o mesmo tamanho de página. Por padrão, todos os tablespaces têm um tamanho de página de 16 KB; você pode reduzir o tamanho de página para 8 KB ou 4 KB, especificando a opção `innodb_page_size` ao criar a instância do MySQL. Você também pode aumentar o tamanho de página para 32 KB ou 64 KB. Para mais informações, consulte a documentação do `innodb_page_size`.

As páginas são agrupadas em extensões de tamanho de 1 MB para páginas com até 16 KB de tamanho (64 páginas consecutivas de 16 KB, ou 128 páginas de 8 KB, ou 256 páginas de 4 KB). Para um tamanho de página de 32 KB, o tamanho da extensão é de 2 MB. Para um tamanho de página de 64 KB, o tamanho da extensão é de 4 MB. Os “arquivos” dentro de um tablespace são chamados de segmentos em `InnoDB`. (Esses segmentos são diferentes do segmento de rollback, que na verdade contém muitos segmentos de tablespace.)

Quando um segmento cresce dentro do espaço de tabelas, `InnoDB` aloca as primeiras 32 páginas para ele, uma de cada vez. Depois disso, `InnoDB` começa a alocar extensões inteiras para o segmento. `InnoDB` pode adicionar até 4 extensões de cada vez a um segmento grande para garantir uma boa sequencialidade dos dados.

Dois segmentos são alocados para cada índice em `InnoDB`. Um deles é para nós não-folha do B-tree, o outro é para os nós folha. Manter os nós folha contiguos no disco permite operações de E/S sequenciais melhores, porque esses nós folha contêm os dados reais da tabela.

Algumas páginas no espaço de tabelas contêm mapas de bits de outras páginas, e, portanto, alguns extensões em um espaço de tabelas `InnoDB` não podem ser alocadas em segmentos como um todo, mas apenas como páginas individuais.

Quando você solicita espaço disponível no espaço de tabelas, emitindo uma declaração `SHOW TABLE STATUS`, o `InnoDB` relata os extensões que estão definitivamente livres no espaço de tabelas. O `InnoDB` reserva sempre alguns extensões para limpeza e outros propósitos internos; essas extensões reservadas não estão incluídas no espaço livre.

Quando você exclui dados de uma tabela, o `InnoDB` elimina os índices correspondentes do B-tree. Se o espaço liberado se torna disponível para outros usuários, depende do padrão de exclusões liberar páginas individuais ou se estender para o espaço de tabela. A eliminação de uma tabela ou a exclusão de todas as linhas dela é garantida para liberar o espaço para outros usuários, mas lembre-se de que as linhas excluídas são removidas fisicamente apenas pela operação de purga, que acontece automaticamente algum tempo depois de não serem mais necessárias para recuos de transação ou leituras consistentes. (Veja a Seção 14.3, “Multiversão InnoDB”.)

#### Como as Páginas se Relacionam com as Linhas da Tabela

O comprimento máximo da linha é ligeiramente menos de meio página de banco de dados para configurações de 4KB, 8KB, 16KB e 32KB `innodb_page_size`. Por exemplo, o comprimento máximo da linha é ligeiramente menos de 8KB para o tamanho de página padrão de 16KB `InnoDB`. Para páginas de 64KB, o comprimento máximo da linha é ligeiramente menos de 16KB.

Se uma linha não exceder o comprimento máximo da linha, toda ela é armazenada localmente dentro da página. Se uma linha exceder o comprimento máximo da linha, colunas de comprimento variável são escolhidas para armazenamento externo fora da página até que a linha se encaixe no limite do comprimento máximo da linha. O armazenamento externo fora da página para colunas de comprimento variável difere pelo formato da linha:

*Formatos de linha COMPACT e REDUNDANT*

Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, `InnoDB` armazena os primeiros 768 bytes localmente na linha e o restante externamente em páginas de excesso. Cada coluna tem sua própria lista de páginas de excesso. O prefixo de 768 bytes é acompanhado por um valor de 20 bytes que armazena o verdadeiro comprimento da coluna e aponta para a lista de excesso onde o restante do valor é armazenado. Veja a Seção 14.11, “Formatos de linha InnoDB”.

*Formatos de linha dinâmicos e compactados*

Quando uma coluna de comprimento variável é escolhida para armazenamento externo fora da página, `InnoDB` armazena um ponteiro de 20 bytes localmente na linha e o restante externamente em páginas de excesso. Veja a Seção 14.11, “Formatos de linha InnoDB”.

As colunas `LONGBLOB` e `LONGTEXT` devem ter menos de 4 GB, e o comprimento total da linha, incluindo as colunas `BLOB` e `TEXT`, deve ter menos de 4 GB.

### 14.12.3 Pontos de verificação do InnoDB

Tornar seus arquivos de registro muito grandes pode reduzir o I/O de disco durante o checkpointing. Muitas vezes faz sentido definir o tamanho total dos arquivos de registro tão grande quanto o buffer pool ou até maior. Embora, no passado, arquivos de registro grandes pudessem fazer com que a recuperação de falha levasse um tempo excessivo, começando com o MySQL 5.5, melhorias de desempenho na recuperação de falha tornam possível usar arquivos de registro grandes com inicialização rápida após uma falha. (Estritamente falando, essa melhoria de desempenho está disponível para o MySQL 5.1 com o Plugin InnoDB 1.0.7 e superior. É com o MySQL 5.5 que essa melhoria está disponível no motor de armazenamento padrão InnoDB.)

#### Como o Processamento de Ponto de Controle Funciona

`InnoDB` implementa um mecanismo de verificação conhecido como verificação fuzzy. `InnoDB` elimina páginas de banco de dados modificadas do buffer em pequenos lotes. Não há necessidade de limpar o buffer em um único lote, o que interromperia o processamento das instruções SQL do usuário durante o processo de verificação.

Durante a recuperação de falhas, `InnoDB` procura por uma etiqueta de ponto de verificação escrita nos arquivos de registro. Ele sabe que todas as modificações no banco de dados antes da etiqueta estão presentes na imagem do disco do banco de dados. Em seguida, `InnoDB` digitaliza os arquivos de registro a partir do ponto de verificação, aplicando as modificações registradas no banco de dados.

### 14.12.4 Desfragmentação de uma tabela

Inserções aleatórias em um índice secundário ou suas exclusões podem fazer com que o índice se fragmente. Fragmentação significa que a ordem física das páginas do índice no disco não está próxima à ordem do índice dos registros nas páginas, ou que há muitas páginas não utilizadas nos blocos de 64 páginas que foram alocados para o índice.

Um sintoma da fragmentação é que uma tabela ocupa mais espaço do que "deveria" ocupar. Quanto exatamente isso é, é difícil determinar. Todos os dados e índices `InnoDB` são armazenados em árvores B, e seu fator de preenchimento pode variar de 50% a 100%. Outro sintoma da fragmentação é que uma varredura de tabela, como esta, leva mais tempo do que "deveria" levar:

```sql
SELECT COUNT(*) FROM t WHERE non_indexed_column <> 12345;
```

A consulta anterior exige que o MySQL realize uma varredura completa da tabela, o tipo de consulta mais lento para uma tabela grande.

Para acelerar as pesquisas de índice, você pode realizar periodicamente uma operação de `ALTER TABLE` “nulo”, o que faz com que o MySQL reconstrua a tabela:

```sql
ALTER TABLE tbl_name ENGINE=INNODB
```

Você também pode usar `ALTER TABLE tbl_name FORCE` para realizar uma operação de alteração “nulo” que reconstrui a tabela.

Tanto o `ALTER TABLE tbl_name ENGINE=INNODB` quanto o `ALTER TABLE tbl_name FORCE` utilizam DDL online. Para mais informações, consulte a Seção 14.13, “InnoDB e DDL online”.

Outra maneira de realizar uma operação de desfragmentação é usar o **mysqldump** para drenar a tabela para um arquivo de texto, descartar a tabela e recarregá-la a partir do arquivo de implantação.

Se as inserções em um índice forem sempre ascendentes e os registros forem excluídos apenas da extremidade, o algoritmo de gerenciamento do espaço de `InnoDB` garante que não ocorra fragmentação no índice.

### 14.12.5 Recuperação de espaço em disco com TRUNCATE TABLE

Para recuperar o espaço em disco do sistema operacional ao truncar uma tabela `InnoDB`, a tabela deve ser armazenada em seu próprio arquivo .ibd. Para que uma tabela seja armazenada em seu próprio arquivo .ibd, o `innodb_file_per_table` deve ser habilitado quando a tabela é criada. Além disso, não pode haver uma restrição de chave estrangeira entre a tabela que está sendo truncada e outras tabelas, caso contrário, a operação `TRUNCATE TABLE` falha. Uma restrição de chave estrangeira entre duas colunas na mesma tabela, no entanto, é permitida.

Quando uma tabela é truncada, ela é eliminada e recriada em um novo arquivo `.ibd`, e o espaço liberado é devolvido ao sistema operacional. Isso contrasta com o truncar de tabelas `InnoDB` que são armazenadas dentro do espaço de tabelas do sistema `InnoDB` (tabelas criadas quando `innodb_file_per_table=OFF`) e tabelas armazenadas em espaços de tabelas gerais compartilhados, onde apenas `InnoDB` pode usar o espaço liberado após a tabela ser truncada.

A capacidade de truncar tabelas e devolver espaço em disco ao sistema operacional também significa que os backups físicos podem ser menores. Truncar tabelas que estão armazenadas no espaço de tabelas do sistema (tabelas criadas quando `innodb_file_per_table=OFF`) ou em um espaço de tabelas geral deixa blocos de espaço não utilizado no espaço de tabelas.