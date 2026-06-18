### 17.9.1 Compressão de Tabelas InnoDB

17.9.1.1 Visão geral da compressão de tabelas

17.9.1.2 Criando tabelas compactadas

17.9.1.3 Ajuste da compressão para tabelas InnoDB

17.9.1.4 Monitoramento da Compressão de Tabelas InnoDB em Tempo Real

17.9.1.5 Como a compressão funciona para tabelas InnoDB

17.9.1.6 Compressão para cargas de trabalho OLTP

17.9.1.7 Aviso e Erros de Sintaxe de Compressão SQL

Esta seção descreve a compressão da tabela `InnoDB`, que é suportada com tabelas `InnoDB` que residem em file\_per\_table tablespaces ou tablespaces gerais. A compressão da tabela é habilitada usando o atributo `ROW_FORMAT=COMPRESSED` com `CREATE TABLE` ou `ALTER TABLE`.
