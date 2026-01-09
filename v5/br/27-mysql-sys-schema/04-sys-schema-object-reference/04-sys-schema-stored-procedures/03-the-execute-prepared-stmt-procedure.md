#### 26.4.4.3 O procedimento execute_prepared_stmt()

Dado uma instrução SQL como uma string, executa-a como uma instrução preparada. A instrução preparada é liberada após a execução, portanto, não pode ser reutilizada. Assim, este procedimento é útil principalmente para executar instruções dinâmicas de forma única.

Esse procedimento usa `sys_execute_prepared_stmt` como o nome do comando preparado. Se esse nome de comando existir quando o procedimento for chamado, seu conteúdo anterior será destruído.

##### Parâmetros

- `in_query LONGTEXT CHARACTER SET utf8`: A string de declaração a ser executada.

##### Opções de configuração

A operação `execute_prepared_stmt()` ("Execução de declaração preparada") pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, "A Tabela sys_config"):

- `debug`, `@sys.debug`

  Se esta opção estiver ativada, será gerado o output de depuração. O padrão é `OFF`.

##### Exemplo

```sql
mysql> CALL sys.execute_prepared_stmt('SELECT COUNT(*) FROM mysql.user');
+----------+
| COUNT(*) |
+----------+
|       15 |
+----------+
```
