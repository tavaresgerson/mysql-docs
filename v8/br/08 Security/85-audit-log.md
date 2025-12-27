### 8.4.5 Auditoria do MySQL Enterprise

::: info Nota

A Auditoria do MySQL Enterprise é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

A Edição Empresarial do MySQL inclui a Auditoria do MySQL Enterprise, implementada usando um plugin do servidor chamado `audit_log`. A Auditoria do MySQL Enterprise utiliza a API de Auditoria MySQL aberta para habilitar monitoramento padrão, baseado em políticas, registro e bloqueio da atividade de conexão e consulta executada em servidores MySQL específicos. Projetada para atender à especificação de auditoria da Oracle, a Auditoria do MySQL Enterprise oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas.

Quando instalado, o plugin de auditoria habilita o MySQL Server a produzir um arquivo de log contendo um registro de auditoria da atividade do servidor. O conteúdo do log inclui quando os clientes se conectam e desconectam e quais ações eles realizam enquanto estão conectados, como quais bancos de dados e tabelas eles acessam. Você pode adicionar estatísticas para o tempo e o tamanho de cada consulta para detectar valores atípicos.

Por padrão, a Auditoria do MySQL Enterprise usa tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e conta de usuário. Para usar um banco de dados diferente, defina a variável de sistema `audit_log_database` na inicialização do servidor.

Após instalar o plugin de auditoria (consulte a Seção 8.4.5.2, “Instalando ou Desinstalando a Auditoria do MySQL Enterprise”), ele escreve um arquivo de log de auditoria. Por padrão, o arquivo é chamado `audit.log` no diretório de dados do servidor. Para alterar o nome do arquivo, defina a variável de sistema `audit_log_file` na inicialização do servidor.

Por padrão, o conteúdo do arquivo de log de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia. Para selecionar o formato de arquivo, defina a variável de sistema `audit_log_format` na inicialização do servidor. Para detalhes sobre o formato e o conteúdo do arquivo, consulte a Seção 8.4.5.4, “Formatos de Arquivos de Log de Auditoria”.

Para obter mais informações sobre como controlar o registro de eventos, incluindo o nome e o formato dos arquivos de registro de auditoria, consulte a Seção 8.4.5.5, “Configurando as Características de Registro de Auditoria”. Para realizar o filtro de eventos auditados, consulte a Seção 8.4.5.7, “Filtragem do Registro de Auditoria”. Para obter descrições dos parâmetros usados para configurar o plugin de registro de auditoria, consulte Opções e Variáveis do Registro de Auditoria.

Se o plugin de registro de auditoria estiver habilitado, o Schema de Desempenho (consulte o Capítulo 29, *Schema de Desempenho do MySQL*) possui instrumentação para isso. Para identificar os instrumentos relevantes, use esta consulta:

```
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```