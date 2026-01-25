## 14.10 Gerenciamento do Formato de Arquivo InnoDB

14.10.1 Habilitando Formatos de Arquivo

14.10.2 Verificando a Compatibilidade do Formato de Arquivo

14.10.3 Identificando o Formato de Arquivo em Uso

14.10.4 Modificando o Formato de Arquivo

À medida que o `InnoDB` evolui, formatos de arquivo de dados que não são compatíveis com versões anteriores do `InnoDB` são, por vezes, necessários para suportar novos recursos. Para ajudar a gerenciar a compatibilidade em situações de upgrade e downgrade, e em sistemas que executam diferentes versões do MySQL, o `InnoDB` utiliza formatos de arquivo nomeados. Atualmente, o `InnoDB` suporta dois formatos de arquivo nomeados: Antelope e Barracuda.

* Antelope é o formato de arquivo original do `InnoDB`, que anteriormente não tinha um nome. Ele suporta os formatos de linha (row formats) COMPACT e REDUNDANT para tabelas `InnoDB`.

* Barracuda é o formato de arquivo mais recente. Ele suporta todos os formatos de linha (row formats) do `InnoDB`, incluindo os formatos mais novos COMPRESSED e DYNAMIC. Os recursos associados aos formatos de linha COMPRESSED e DYNAMIC incluem tabelas compactadas, armazenamento eficiente de colunas fora da página (off-page columns) e prefixos de chave de Index de até 3072 bytes (`innodb_large_prefix`). Consulte a Seção 14.11, “Formatos de Linha InnoDB”.

Esta seção discute a habilitação de formatos de arquivo `InnoDB` para novas tabelas `InnoDB`, a verificação da compatibilidade de diferentes formatos de arquivo entre lançamentos do MySQL e a identificação do formato de arquivo em uso.

As configurações de formato de arquivo do InnoDB não se aplicam a tabelas armazenadas em tablespaces gerais (general tablespaces). Os tablespaces gerais fornecem suporte para todos os formatos de linha (row formats) e recursos associados. Para obter mais informações, consulte a Seção 14.6.3.3, “Tablespaces Gerais”.

Note

Os seguintes parâmetros de configuração de formato de arquivo têm novos valores padrão:

* O valor padrão de `innodb_file_format` foi alterado para `Barracuda`. O valor padrão anterior era `Antelope`.

* O valor padrão de `innodb_large_prefix` foi alterado para `ON`. O padrão anterior era `OFF`.

Os seguintes parâmetros de configuração de formato de arquivo estão descontinuados e podem ser removidos em um lançamento futuro:

* `innodb_file_format`
* `innodb_file_format_check`
* `innodb_file_format_max`
* `innodb_large_prefix`

Os parâmetros de configuração de formato de arquivo foram fornecidos para criar tabelas compatíveis com versões anteriores do `InnoDB` no MySQL 5.1. Agora que o MySQL 5.1 atingiu o fim de seu ciclo de vida de produto (product lifecycle), os parâmetros não são mais necessários.