## 16.2 Remoção do Armazenamento de Metadados Baseados em Arquivos

Em versões anteriores do MySQL, os dados do dicionário eram armazenados parcialmente em arquivos de metadados. Os problemas com o armazenamento de metadados baseado em arquivos incluíam varreduras de arquivos caras, suscetibilidade a erros relacionados ao sistema de arquivos, código complexo para o gerenciamento de replicação e estados de falha de recuperação de falhas, e uma falta de extensibilidade que dificultava a adição de metadados para novos recursos e objetos relacionais.

Os arquivos de metadados listados abaixo são removidos do MySQL. A menos que indicado de outra forma, os dados anteriormente armazenados nos arquivos de metadados agora são armazenados em tabelas do dicionário de dados.

- Arquivos `.frm`: Arquivos de metadados da tabela. Com a remoção dos arquivos `.frm`:

  - O limite de tamanho da definição de tabela de 64 KB imposto pela estrutura de arquivo `.frm` é removido.

  - A coluna `VERSION` da tabela do esquema de informações `TABLES` reporta um valor hardcoded de `10`, que é a última versão do arquivo `.frm` usada no MySQL 5.7.

- Arquivos `.par`: Arquivos de definição de partição. `InnoDB` deixou de usar arquivos de definição de partição no MySQL 5.7 com a introdução do suporte nativo para partição de tabelas `InnoDB`.

- Arquivos `.TRN`: Arquivos de namespace de gatilho.

- Arquivos `.TRG`: Arquivos de parâmetros de disparo.

- Arquivos `.isl`: Arquivos de Links Simbólicos `InnoDB` que contêm a localização dos arquivos do espaço de tabela por tabela criados fora do diretório de dados.

- Arquivos `db.opt`: Arquivos de configuração do banco de dados. Esses arquivos, um por diretório de banco de dados, continham atributos do conjunto de caracteres padrão do banco de dados.

- Arquivo `ddl_log.log`: O arquivo continha registros de operações de metadados gerados por declarações de definição de dados, como `DROP TABLE` e `ALTER TABLE`.
