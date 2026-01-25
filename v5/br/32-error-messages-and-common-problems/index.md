# Apêndice B Mensagens de Erro e Problemas Comuns

**Sumário**

[B.1 Fontes e Elementos da Mensagem de Erro](error-message-elements.html)

[B.2 Interfaces de Informação de Erro](error-interfaces.html)

[B.3 Problemas e Erros Comuns](problems.html) :   [B.3.1 Como Determinar a Causa de um Problema](what-is-crashing.html)

    [B.3.2 Erros Comuns ao Usar Programas MySQL](common-errors.html)

    [B.3.3 Questões Relacionadas à Administração](administration-issues.html)

    [B.3.4 Questões Relacionadas a Querys](query-issues.html)

    [B.3.5 Questões Relacionadas ao Optimizer](optimizer-issues.html)

    [B.3.6 Questões Relacionadas à Definição de Tabela](table-definition-issues.html)

    [B.3.7 Questões Conhecidas no MySQL](known-issues.html)

Este apêndice descreve os tipos de informação de erro que o MySQL fornece e como obter informações sobre eles. A seção final é dedicada à solução de problemas (troubleshooting). Ela descreve problemas e erros comuns que podem ocorrer e possíveis resoluções.

## Recursos Adicionais

Outra documentação relacionada a erros inclui:

* Informações sobre como configurar onde e como o Server escreve o error log: [Seção 5.4.2, “O Error Log”](error-log.html "5.4.2 The Error Log")

* Informações sobre o conjunto de caracteres usado para mensagens de erro: [Seção 10.6, “Conjunto de Caracteres de Mensagens de Erro”](charset-errors.html "10.6 Error Message Character Set")

* Informações sobre a linguagem usada para mensagens de erro: [Seção 10.12, “Configurando a Linguagem da Mensagem de Erro”](error-message-language.html "10.12 Setting the Error Message Language")

* Informações sobre erros relacionados a [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"): [Seção 14.22.4, “Tratamento de Erros InnoDB”](innodb-error-handling.html "14.22.4 InnoDB Error Handling")

* Informações sobre erros específicos do NDB Cluster: [NDB Cluster API Errors](/doc/ndb-internals/en/ndb-errors.html); veja também [NDB API Errors and Error Handling](/doc/ndbapi/en/ndb-api-errors.html), e [MGM API Errors](/doc/ndbapi/en/mgm-errors.html)

* Descrições das mensagens de erro que o MySQL Server e os programas Client geram: [MySQL 5.7 Error Message Reference](/doc/mysql-errors/5.7/en/)