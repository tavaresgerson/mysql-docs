### 8.4.6 Auditoria do MySQL Enterprise

8.4.6.1 Elementos da Auditoria do MySQL Enterprise

8.4.6.2 Instalando ou Desinstalando a Auditoria do MySQL Enterprise

8.4.6.3 Considerações de Segurança da Auditoria do MySQL Enterprise

8.4.6.4 Formatos de Arquivos de Registro de Auditoria

8.4.6.5 Configurando as Características de Registro de Auditoria

8.4.6.6 Lendo Arquivos de Registro de Auditoria

8.4.6.7 Filtrando o Registro de Auditoria

8.4.6.8 Escrevendo Definições de Filtro de Registro de Auditoria

8.4.6.9 Desativando o Registro de Auditoria

8.4.6.10 Filtrando o Registro de Auditoria no Modo Legado

8.4.6.11 Referência do Registro de Auditoria

8.4.6.12 Restrições do Registro de Auditoria

Nota

A Auditoria do MySQL Enterprise é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui a Auditoria do MySQL Enterprise, implementada usando um plugin do servidor chamado `audit_log`. A Auditoria do MySQL Enterprise usa a API de Auditoria MySQL aberta para habilitar monitoramento, registro e bloqueio padrão e baseado em políticas de atividade de conexão e consulta executada em servidores MySQL específicos. Projetada para atender à especificação de auditoria da Oracle, a Auditoria do MySQL Enterprise oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas.

Quando instalado, o plugin de auditoria habilita o MySQL Server a produzir um arquivo de log contendo um registro de auditoria da atividade do servidor. O conteúdo do log inclui quando os clientes se conectam e desconectam e quais ações eles realizam enquanto estão conectados, como quais bancos de dados e tabelas eles acessam. Você pode adicionar estatísticas para o tempo e o tamanho de cada consulta para detectar valores atípicos.

Por padrão, o MySQL Enterprise Audit usa tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e contas de usuário. Para usar um banco de dados diferente, defina a variável de sistema `audit_log_database` na inicialização do servidor.

Após instalar o plugin de auditoria (consulte a Seção 8.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”), ele escreve um arquivo de log de auditoria. Por padrão, o arquivo é chamado `audit.log` no diretório de dados do servidor. Para alterar o nome do arquivo, defina a variável de sistema `audit_log_file` na inicialização do servidor.

Por padrão, o conteúdo do arquivo de log de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia. Para selecionar o formato do arquivo, defina a variável de sistema `audit_log_format` na inicialização do servidor. Para obter detalhes sobre o formato e o conteúdo do arquivo, consulte a Seção 8.4.6.4, “Formatos de Arquivos de Log de Auditoria”.

Para obter mais informações sobre como o registro ocorre, incluindo o nome e o formato do arquivo de log de auditoria, consulte a Seção 8.4.6.5, “Configurando as Características de Registro de Auditoria”. Para realizar a filtragem de eventos auditados, consulte a Seção 8.4.6.7, “Filtragem de Log de Auditoria”. Para obter descrições dos parâmetros usados para configurar o plugin de log de auditoria, consulte Opções e Variáveis de Log de Auditoria.

Se o plugin de log de auditoria estiver habilitado, o Schema de Desempenho (consulte o Capítulo 29, *MySQL Schema de Desempenho*) tem instrumentação para isso. Para identificar os instrumentos relevantes, use esta consulta:

```
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```