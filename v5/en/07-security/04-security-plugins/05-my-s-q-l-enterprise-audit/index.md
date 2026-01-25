### 6.4.5 MySQL Enterprise Audit

[6.4.5.1 Elementos do MySQL Enterprise Audit](audit-log-elements.html)

[6.4.5.2 Instalando ou Desinstalando o MySQL Enterprise Audit](audit-log-installation.html)

[6.4.5.3 Considerações de Segurança do MySQL Enterprise Audit](audit-log-security.html)

[6.4.5.4 Formatos de Arquivo de Audit Log](audit-log-file-formats.html)

[6.4.5.5 Configurando Características de Audit Logging](audit-log-logging-configuration.html)

[6.4.5.6 Lendo Arquivos de Audit Log](audit-log-file-reading.html)

[6.4.5.7 Audit Log Filtering](audit-log-filtering.html)

[6.4.5.8 Escrevendo Definições de Filter de Audit Log](audit-log-filter-definitions.html)

[6.4.5.9 Desabilitando o Audit Logging](audit-log-disabling.html)

[6.4.5.10 Audit Log Filtering em Modo Legado](audit-log-legacy-filtering.html)

[6.4.5.11 Referência de Audit Log](audit-log-reference.html)

[6.4.5.12 Restrições do Audit Log](audit-log-restrictions.html)

Nota

O MySQL Enterprise Audit é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O MySQL Enterprise Edition inclui o MySQL Enterprise Audit, implementado usando um plugin de servidor chamado `audit_log`. O MySQL Enterprise Audit usa a MySQL Audit API aberta para permitir monitoramento padrão baseado em política, logging e bloqueio de atividades de conexão e Query executadas em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit fornece uma solução de auditoria e conformidade pronta para uso e fácil de usar para aplicações que são regidas por diretrizes regulatórias internas e externas.

Quando instalado, o audit plugin permite que o MySQL Server produza um arquivo de log contendo um registro de auditoria da atividade do servidor. O conteúdo do log inclui quando os clientes se conectam e desconectam, e quais ações eles realizam enquanto conectados, como quais Databases e tables eles acessam.

Depois de instalar o audit plugin (consulte [Seção 6.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Instalando ou Desinstalando o MySQL Enterprise Audit")), ele grava um arquivo de audit log. Por padrão, o arquivo é nomeado `audit.log` no data directory do servidor. Para alterar o nome do arquivo, defina a variável de sistema [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) na inicialização do servidor.

Por padrão, o conteúdo do arquivo de audit log é escrito no formato XML de novo estilo, sem compressão ou criptografia. Para selecionar o formato do arquivo, defina a variável de sistema [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) na inicialização do servidor. Para detalhes sobre o formato e conteúdo do arquivo, consulte [Seção 6.4.5.4, “Formatos de Arquivo de Audit Log”](audit-log-file-formats.html "6.4.5.4 Formatos de Arquivo de Audit Log").

Para mais informações sobre como controlar o logging, incluindo a nomeação do arquivo de audit log e a seleção de formato, consulte [Seção 6.4.5.5, “Configurando Características de Audit Logging”](audit-log-logging-configuration.html "6.4.5.5 Configurando Características de Audit Logging"). Para realizar o Filtering de eventos auditados, consulte [Seção 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering"). Para descrições dos parâmetros usados para configurar o audit log plugin, consulte [Opções e Variáveis do Audit Log](audit-log-reference.html#audit-log-options-variables "Opções e Variáveis do Audit Log").

Se o audit log plugin estiver habilitado, o Performance Schema (consulte [Capítulo 25, *MySQL Performance Schema*](performance-schema.html "Capítulo 25 MySQL Performance Schema")) possui instrumentação para ele. Para identificar os instrumentos relevantes, use esta Query:

```sql
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```