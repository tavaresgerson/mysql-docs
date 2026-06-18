## 16.6 Informações do Dicionário Serializado (SDI)

Além de armazenar metadados sobre objetos de banco de dados no dicionário de dados, o MySQL armazena-os em formato serializado. Esses dados são referenciados como informações do dicionário serializado (SDI). `InnoDB` armazena dados SDI em seus arquivos de espaço de tabela. `NDBCLUSTER` armazena dados SDI no dicionário NDB. Outros motores de armazenamento armazenam dados SDI em arquivos `.sdi` que são criados para uma determinada tabela no diretório do banco de dados da tabela. Os dados SDI são gerados em um formato compacto `JSON`.

As informações do dicionário serializadas (SDI) estão presentes em todos os arquivos de espaço de tabela `InnoDB`, exceto nos arquivos de espaço de tabela temporário e de espaço de tabela de desfazer. Os registros de SDI em um arquivo de espaço de tabela `InnoDB` descrevem apenas os objetos de tabela e espaço de tabela contidos no espaço de tabela.

Os dados do SDI são atualizados por operações DDL em uma tabela ou `CHECK TABLE FOR UPGRADE`. Os dados do SDI não são atualizados quando o servidor MySQL é atualizado para uma nova versão ou lançamento.

A presença de dados SDI oferece redundância de metadados. Por exemplo, se o dicionário de dados ficar indisponível, os metadados dos objetos podem ser extraídos diretamente dos arquivos do espaço de tabelas `InnoDB` usando a ferramenta **ibd2sdi**.

Para `InnoDB`, um registro SDI requer uma única página de índice, que tem 16 KB de tamanho por padrão. No entanto, os dados SDI são compactados para reduzir a pegada de armazenamento.

Para tabelas `InnoDB` particionadas compostas por vários tablespaces, os dados do SDI são armazenados no arquivo do tablespace da primeira partição.

O servidor MySQL utiliza uma API interna que é acessada durante as operações DDL para criar e manter os registros SDI.

A declaração `IMPORT TABLE` importa tabelas `MyISAM` com base nas informações contidas em arquivos `.sdi`. Para mais informações, consulte a Seção 15.2.6, “Declaração de Importação de Tabela”.
