### 8.4.5 Auditoria do MySQL Enterprise

8.4.5.1 Elementos da Auditoria do MySQL Enterprise

8.4.5.2 Instalação ou Desinstalação do MySQL Enterprise Audit

8.4.5.3 Considerações de segurança de auditoria do MySQL Enterprise

8.4.5.4 Formatos de arquivos de registro de auditoria

8.4.5.5 Configurando características de registro de auditoria

8.4.5.6 Leitura de arquivos de registro de auditoria

8.4.5.7 Filtragem do Log de Auditoria

8.4.5.8 Escrever definições de filtro do log de auditoria

8.4.5.9 Desativando o Registro de Auditoria

8.4.5.10 Filtro do Log de Auditoria no Modo Legado

8.4.5.11 Referência do Log de Auditoria

8.4.5.12 Restrições do Log de Auditoria

Nota

O MySQL Enterprise Audit é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Audit, implementado usando um plugin do servidor chamado `audit_log`. O MySQL Enterprise Audit utiliza a API de Auditoria do MySQL aberta para permitir o monitoramento padrão, baseado em políticas, registro e bloqueio da atividade de conexão e consulta executada em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas.

Quando instalado, o plugin de auditoria permite que o MySQL Server gere um arquivo de registro contendo um registro de auditoria da atividade do servidor. O conteúdo do log inclui quando os clientes se conectam e desconectam, e quais ações eles realizam enquanto estão conectados, como quais bancos de dados e tabelas eles acessam. A partir do MySQL 8.0.30, você pode adicionar estatísticas para o tempo e o tamanho de cada consulta para detectar valores atípicos.

Por padrão, o MySQL Enterprise Audit usa tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e contas de usuário. Para usar um banco de dados diferente, defina a variável de sistema `audit_log_database` na inicialização do servidor (a partir do MySQL 8.0.33).

Após instalar o plugin de auditoria (consulte a Seção 8.4.5.2, “Instalando ou Desinstalando o Auditoria MySQL Enterprise”), ele escreve um arquivo de log de auditoria. Por padrão, o arquivo é chamado `audit.log` no diretório de dados do servidor. Para alterar o nome do arquivo, defina a variável de sistema `audit_log_file` na inicialização do servidor.

Por padrão, o conteúdo do arquivo de registro de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia. Para selecionar o formato do arquivo, defina a variável de sistema `audit_log_format` na inicialização do servidor. Para obter detalhes sobre o formato e o conteúdo do arquivo, consulte a Seção 8.4.5.4, “Formatos de Arquivos de Registro de Auditoria”.

Para obter mais informações sobre como controlar o registro de eventos, incluindo o nome e o formato do arquivo de registro de auditoria, consulte a Seção 8.4.5.5, “Configurando as Características do Registro de Auditoria”. Para realizar o filtro de eventos auditados, consulte a Seção 8.4.5.7, “Filtragem do Registro de Auditoria”. Para obter descrições dos parâmetros usados para configurar o plugin de registro de auditoria, consulte Opções e Variáveis do Registro de Auditoria.

Se o plugin de log de auditoria estiver habilitado, o Schema de Desempenho (veja o Capítulo 29, *Schema de Desempenho do MySQL*) possui instrumentos para isso. Para identificar os instrumentos relevantes, use esta consulta:

```
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```
