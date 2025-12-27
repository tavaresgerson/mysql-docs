### 17.9.1 Compressão de Tabelas InnoDB

17.9.1.1 Visão Geral da Compressão de Tabelas

17.9.1.2 Criando Tabelas Compridas

17.9.1.3 Ajuste da Compressão para Tabelas InnoDB

17.9.1.4 Monitoramento da Compressão de Tabelas InnoDB em Tempo Real

17.9.1.5 Como a Compressão Funciona para Tabelas InnoDB

17.9.1.6 Compressão para Cargas de Trabalho OLTP

17.9.1.7 Avisos e Erros de Sintaxe de Compressão SQL

Esta seção descreve a compressão de tabelas `InnoDB`, que é suportada com tabelas `InnoDB` que residem em espaços de tabelas por arquivo ou espaços de tabelas gerais. A compressão de tabelas é habilitada usando o atributo `ROW_FORMAT=COMPRESSED` com `CREATE TABLE` ou `ALTER TABLE`.