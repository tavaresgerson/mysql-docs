### 6.4.5 Auditoria do MySQL Enterprise

Nota

O MySQL Enterprise Audit é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Audit, implementado usando um plugin do servidor chamado `audit_log`. O MySQL Enterprise Audit utiliza a API de Auditoria MySQL aberta para habilitar monitoramento padrão, baseado em políticas, registro e bloqueio de atividades de conexão e consulta executadas em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas.

Quando instalado, o plugin de auditoria permite que o MySQL Server produza um arquivo de registro contendo um registro de auditoria da atividade do servidor. O conteúdo do log inclui quando os clientes se conectam e desconectam, e quais ações eles realizam enquanto estão conectados, como quais bancos de dados e tabelas eles acessam.

Depois de instalar o plugin de auditoria (consulte Seção 6.4.5.2, “Instalando ou Desinstalando Auditoria do MySQL Enterprise”), ele escreve um arquivo de log de auditoria. Por padrão, o arquivo é chamado `audit.log` no diretório de dados do servidor. Para alterar o nome do arquivo, defina a variável de sistema `audit_log_file` na inicialização do servidor.

Por padrão, o conteúdo do arquivo de registro de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia. Para selecionar o formato do arquivo, defina a variável de sistema `audit_log_format` na inicialização do servidor. Para obter detalhes sobre o formato e o conteúdo do arquivo, consulte Seção 6.4.5.4, “Formatos de Arquivos de Registro de Auditoria”.

Para obter mais informações sobre como controlar o registro de eventos, incluindo o nome e o formato do arquivo de registro de auditoria, consulte Seção 6.4.5.5, “Configurando as Características do Registro de Auditoria”. Para realizar o filtro de eventos auditados, consulte Seção 6.4.5.7, “Filtragem do Registro de Auditoria”. Para obter descrições dos parâmetros usados para configurar o plugin de registro de auditoria, consulte Opções e variáveis do registro de auditoria.

Se o plugin de registro de auditoria estiver habilitado, o Schema de Desempenho (consulte Capítulo 25, *MySQL Performance Schema*) possui instrumentos para isso. Para identificar os instrumentos relevantes, use esta consulta:

```sql
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```
