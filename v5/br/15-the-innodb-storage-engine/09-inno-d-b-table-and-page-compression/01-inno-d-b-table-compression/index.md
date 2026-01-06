### 14.9.1 Compressão de Tabelas InnoDB

14.9.1.1 Visão geral da compressão de tabelas

14.9.1.2 Criando tabelas compactadas

14.9.1.3 Ajuste da compressão para tabelas InnoDB

14.9.1.4 Monitoramento da Compressão de Tabelas InnoDB em Tempo Real

14.9.1.5 Como a compressão funciona para tabelas InnoDB

14.9.1.6 Compressão para cargas de trabalho OLTP

14.9.1.7 Aviso e Erros de Sintaxe de Compressão SQL

Esta seção descreve a compressão de tabelas `InnoDB`, que é suportada com tabelas `InnoDB` que residem em espaços de tabelas por arquivo ou espaços de tabelas gerais. A compressão de tabelas é habilitada usando o atributo `ROW_FORMAT=COMPRESSED` com `CREATE TABLE` ou `ALTER TABLE`.
