## 14.10 Gerenciamento do formato de arquivo InnoDB

14.10.1 Habilitar formatos de arquivo

14.10.1 Verificar a compatibilidade com o formato de arquivo

14.10.3 Identificação do formato de arquivo em uso

14.10.4 Modificando o formato do arquivo

À medida que o `InnoDB` evolui, formatos de arquivo de dados que não são compatíveis com versões anteriores do `InnoDB` são, às vezes, necessários para suportar novos recursos. Para ajudar a gerenciar a compatibilidade em situações de atualização e downgrade, e em sistemas que executam diferentes versões do MySQL, o `InnoDB` utiliza formatos de arquivo nomeados. O `InnoDB` atualmente suporta dois formatos de arquivo nomeados, Antelope e Barracuda.

- Antelope é o formato de arquivo original do `InnoDB`, que anteriormente não tinha um nome. Ele suporta os formatos de linha COMPACT e REDUNDANT para tabelas `InnoDB`.

- O Barracuda é o formato de arquivo mais recente. Ele suporta todos os formatos de linha `InnoDB`, incluindo os novos formatos COMPRESSED e DYNAMIC. As características associadas aos formatos de linha COMPRESSED e DYNAMIC incluem tabelas compactadas, armazenamento eficiente de colunas fora da página e prefixos de chaves de índice de até 3072 bytes (`innodb_large_prefix`). Veja a Seção 14.11, “Formatos de Linha InnoDB”.

Esta seção discute a habilitação dos formatos de arquivo do InnoDB para novas tabelas do InnoDB, a verificação da compatibilidade dos diferentes formatos de arquivo entre as versões do MySQL e a identificação do formato de arquivo em uso.

As configurações do formato de arquivo InnoDB não se aplicam às tabelas armazenadas em espaços de tabelas gerais. Os espaços de tabelas gerais fornecem suporte para todos os formatos de linha e recursos associados. Para obter mais informações, consulte a Seção 14.6.3.3, “Espaços de Tabelas Gerais”.

Nota

Os seguintes parâmetros de configuração do formato de arquivo têm novos valores padrão:

- O valor padrão de `innodb_file_format` foi alterado para `Barracuda`. O valor padrão anterior era `Antelope`.

- O valor padrão `innodb_large_prefix` foi alterado para `ON`. O valor padrão anterior era `OFF`.

Os seguintes parâmetros de configuração de formato de arquivo são desatualizados e podem ser removidos em uma versão futura:

- `innodb_file_format`
- `innodb_file_format_check`
- `innodb_file_format_max`
- `innodb_large_prefix`

Os parâmetros de configuração do formato de arquivo foram fornecidos para criar tabelas compatíveis com versões anteriores do `InnoDB` no MySQL 5.1. Agora que o MySQL 5.1 atingiu o fim de seu ciclo de vida do produto, os parâmetros não são mais necessários.
