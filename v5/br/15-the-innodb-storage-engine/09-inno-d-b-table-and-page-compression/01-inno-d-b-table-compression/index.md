### 14.9.1 Compressão de Tabela InnoDB

14.9.1.1 Visão Geral da Compressão de Tabela

14.9.1.2 Criando Tabelas Comprimidas

14.9.1.3 Ajustando a Compressão para Tabelas InnoDB

14.9.1.4 Monitoramento da Compressão de Tabela InnoDB em Tempo de Execução

14.9.1.5 Como a Compressão Funciona para Tabelas InnoDB

14.9.1.6 Compressão para Cargas de Trabalho OLTP

14.9.1.7 Avisos e Erros de Sintaxe de Compressão SQL

Esta seção descreve a compressão de tabela `InnoDB`, que é suportada para tabelas `InnoDB` que residem em *tablespaces* `file_per_table` ou *general tablespaces*. A compressão de tabela é ativada usando o atributo `ROW_FORMAT=COMPRESSED` com `CREATE TABLE` ou `ALTER TABLE`.