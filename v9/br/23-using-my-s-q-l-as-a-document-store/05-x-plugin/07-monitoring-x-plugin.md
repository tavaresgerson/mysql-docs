### 22.5.7 Monitoramento do Plugin X

Para monitorar o plugin X de forma geral, use as variáveis de status que ele expõe. Consulte a Seção 22.5.6.3, “Variáveis de Status do Plugin X”. Para informações específicas sobre o monitoramento dos efeitos da compressão de mensagens, consulte Monitoramento da Compressão de Conexão para o Plugin X.

#### Monitoramento do SQL Gerado pelo Plugin X

Esta seção descreve como monitorar as instruções SQL que o plugin X gera quando você executa operações do X DevAPI. Quando você executa uma instrução CRUD, ela é traduzida em SQL e executada no servidor. Para poder monitorar o SQL gerado, as tabelas do Schema de Desempenho devem estar habilitadas. O SQL é registrado nas tabelas `performance_schema.events_statements_current`, `performance_schema.events_statements_history` e `performance_schema.events_statements_history_long`. O exemplo a seguir usa o esquema `world_x`, importado como parte dos tutoriais de quickstart nesta seção. Usamos o MySQL Shell no modo Python, e o comando `\sql`, que permite emitir instruções SQL sem mudar para o modo SQL. Isso é importante, porque, se você tentar mudar para o modo SQL, o procedimento mostrará o resultado dessa operação em vez da operação do X DevAPI. O comando `\sql` é usado da mesma maneira se você estiver usando o MySQL Shell no modo JavaScript.

1. Verifique se o consumidor `events_statements_history` está habilitado. Execute:

   ```
   mysql-py> \sql SELECT enabled FROM performance_schema.setup_consumers WHERE NAME = 'events_statements_history'
   +---------+
   | enabled |
   +---------+
   | YES     |
   +---------+
   ```

2. Verifique se todos os instrumentos estão reportando dados para o consumidor. Execute:

   ```
   mysql-py> \sql SELECT NAME, ENABLED, TIMED FROM performance_schema.setup_instruments WHERE NAME LIKE 'statement/%' AND NOT (ENABLED and TIMED)
   ```

   Se essa instrução reportar pelo menos uma linha, você precisa habilitar os instrumentos. Consulte a Seção 29.4, “Configuração de Tempo de Execução do Schema de Desempenho”.

3. Obtenha o ID de thread da conexão atual. Execute:

   ```
   mysql-py> \sql SELECT thread_id INTO @id FROM performance_schema.threads WHERE processlist_id=connection_id()
   ```

4. Execute a operação CRUD da X DevAPI para a qual deseja ver o SQL gerado. Por exemplo, emita:

   ```
   mysql-py> db.CountryInfo.find("Name = :country").bind("country", "Italy")
   ```

   Não emita mais operações para o próximo passo para mostrar o resultado correto.

5. Mostre a última consulta SQL realizada por este ID de thread. Emita:

   ```
   mysql-py> \sql SELECT THREAD_ID, MYSQL_ERRNO,SQL_TEXT FROM performance_schema.events_statements_history WHERE THREAD_ID=@id ORDER BY TIMER_START DESC LIMIT 1;
   +-----------+-------------+--------------------------------------------------------------------------------------+
   | THREAD_ID | MYSQL_ERRNO | SQL_TEXT                                                                             |
   +-----------+-------------+--------------------------------------------------------------------------------------+
   |        29 |           0 | SELECT doc FROM `world_x`.`CountryInfo` WHERE (JSON_EXTRACT(doc,'$.Name') = 'Italy') |
   +-----------+-------------+--------------------------------------------------------------------------------------+
   ```

   O resultado mostra o SQL gerado pelo X Plugin com base na declaração mais recente, neste caso, a operação CRUD da X DevAPI do passo anterior.