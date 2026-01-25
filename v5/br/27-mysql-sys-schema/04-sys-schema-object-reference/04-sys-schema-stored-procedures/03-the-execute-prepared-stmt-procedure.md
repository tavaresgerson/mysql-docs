#### 26.4.4.3 O Procedimento execute_prepared_stmt()

Dada uma instrução SQL como uma string, a executa como uma prepared statement. A prepared statement é desalocada após a execução, portanto, não está sujeita à reutilização. Assim, este procedimento é útil principalmente para executar dynamic statements de forma pontual (one-time basis).

Este procedimento usa `sys_execute_prepared_stmt` como o nome da prepared statement. Se esse nome de statement existir quando o procedimento for chamado, seu conteúdo anterior será destruído.

##### Parâmetros

* `in_query LONGTEXT CHARACTER SET utf8`: A statement string a ser executada.

##### Opções de Configuração

A operação do procedimento `execute_prepared_stmt()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 26.4.2.1, “The sys_config Table”):

* `debug`, `@sys.debug`

  Se esta opção estiver `ON`, produzirá saída de debugging. O padrão é `OFF`.

##### Exemplo

```sql
mysql> CALL sys.execute_prepared_stmt('SELECT COUNT(*) FROM mysql.user');
+----------+
| COUNT(*) |
+----------+
|       15 |
+----------+
```