## 16.6 Informações do Dicionário Serializado (SDI)

Além de armazenar metadados sobre objetos de banco de dados no dicionário de dados, o MySQL armazena-os em formato serializado. Esses dados são referidos como informações do dicionário serializado (SDI). O `InnoDB` armazena os dados SDI dentro dos arquivos do espaço de tabelas. O `NDBCLUSTER` armazena os dados SDI no dicionário NDB. Outros motores de armazenamento armazenam os dados SDI em arquivos `.sdi` que são criados para uma tabela específica no diretório do banco de dados da tabela. Os dados SDI são gerados em um formato `JSON` compacto.

As informações do dicionário serializado (SDI) estão presentes em todos os arquivos de espaço de tabela `InnoDB`, exceto para arquivos de espaço de tabela temporário e espaço de tabela de rollback. Os registros de SDI em um arquivo de espaço de tabela `InnoDB` descrevem apenas objetos de tabela e espaço de tabela contidos dentro do espaço de tabela.

Os dados SDI são atualizados por operações DDL em uma tabela ou `CHECK TABLE FOR UPGRADE`. Os dados SDI não são atualizados quando o servidor MySQL é atualizado para uma nova versão ou lançamento.

A presença dos dados SDI fornece redundância de metadados. Por exemplo, se o dicionário de dados ficar indisponível, os metadados dos objetos podem ser extraídos diretamente dos arquivos de espaço de tabela `InnoDB` usando a ferramenta **ibd2sdi**.

Para o `InnoDB`, um registro SDI requer uma única página de índice, que tem 16 KB de tamanho por padrão. No entanto, os dados SDI são compactados para reduzir a pegada de armazenamento.

Para tabelas `InnoDB` particionadas compostas por vários espaços de tabela, os dados SDI são armazenados no arquivo de espaço de tabela da primeira partição.

O servidor MySQL usa uma API interna que é acessada durante operações DDL para criar e manter os registros SDI.

A instrução `IMPORT TABLE` importa tabelas `MyISAM` com base nas informações contidas nos arquivos `.sdi`. Para mais informações, consulte a Seção 15.2.6, “Instrução IMPORT TABLE”.