## 7.4 Registros do Servidor MySQL

7.4.1 Selecionando destinos de saída do Log de consulta geral e do Log de consulta lenta

7.4.2 Diário de Erros

7.4.3 O Log de Consulta Geral

7.4.4 O Log Binário

7.4.5 O Log de Consultas Lentas

7.4.6 Manutenção do Log do Servidor

O MySQL Server tem vários logs que podem ajudá-lo a descobrir quais atividades estão ocorrendo.

<table summary="Tipos de log do MySQL Server e as informações escritas em cada log."><thead><tr> <th>Tipo de log (registro)</th> <th>Informações escritas no log</th> </tr></thead><tbody><tr> <td>Registro de erros</td> <td>Problemas encontrados ao iniciar, executar ou parar<span><strong>mysqld</strong></span></td> </tr><tr> <td>Registro de consulta geral</td> <td>Conexões com clientes estabelecidas e declarações recebidas dos clientes</td> </tr><tr> <td>Registro binário</td> <td>Declarações que alteram dados (também utilizadas para replicação)</td> </tr><tr> <td>Registro de relé</td> <td>Alterações de dados recebidas de um servidor de origem de replicação</td> </tr><tr> <td>Registro de consultas lentas</td> <td>Consultas que levaram mais de [[<code>long_query_time</code>]] segundos para serem executadas</td> </tr><tr> <td>Registro DDL (registro de metadados)</td> <td>Operações de metadados realizadas por declarações DDL</td> </tr></tbody></table>

Por padrão, nenhum log é ativado, exceto o log de erro no Windows. (O log DDL é sempre criado quando necessário e não tem opções configuráveis pelo usuário; veja o log DDL.) As seções específicas dos logs fornecem informações sobre as opções do servidor que permitem a logon.

Por padrão, o servidor escreve arquivos para todos os logs habilitados no diretório de dados. Você pode forçar o servidor a fechar e reabrir os arquivos de log (ou, em alguns casos, alternar para um novo arquivo de log) ao limpar os logs. A limpeza de logs ocorre quando você emite uma declaração `FLUSH LOGS`. Execute **mysqladmin** com um argumento `flush-logs` ou `refresh`. Ou execute **mysqldump** com a opção `--flush-logs`. Veja a Seção 15.7.8.3, “Declaração FLUSH”, a Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL” e a Seção 6.5.4, “mysqldump — Um Programa de Backup de Bancos de Dados”. Além disso, o log binário é limpo quando seu tamanho atinge o valor da variável de sistema `max_binlog_size`.

Você pode controlar os registros de consultas gerais e consultas lentas durante a execução. Você pode habilitar ou desabilitar o registro ou alterar o nome do arquivo de registro. Você pode informar ao servidor para escrever as entradas de consultas gerais e consultas lentas em tabelas de registro, arquivos de registro ou em ambos. Para obter detalhes, consulte a Seção 7.4.1, “Selecionando destinos de saída de registros de consultas gerais e consultas lentas”, a Seção 7.4.3, “O registro de consultas gerais” e a Seção 7.4.5, “O registro de consultas lentas”.

O log de retransmissão é usado apenas em réplicas, para armazenar as alterações de dados do servidor de origem da replicação que também devem ser feitas na replica. Para discussão sobre o conteúdo e a configuração do log de retransmissão, consulte a Seção 19.2.4.1, “O Log de Retransmissão”.

Para obter informações sobre operações de manutenção de logs, como a expiração de arquivos de log antigos, consulte a Seção 7.4.6, “Manutenção de Logs do Servidor”.

Para obter informações sobre como manter os registros seguros, consulte a Seção 8.1.2.3, “Senhas e registro”.
