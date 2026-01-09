#### 30.4.4.3 O procedimento execute_prepared_stmt()

Dado uma instrução SQL como uma string, executa-a como uma instrução preparada. A instrução preparada é liberada após a execução, portanto, não pode ser reutilizada. Assim, este procedimento é útil principalmente para executar instruções dinâmicas de forma única.

Este procedimento usa `sys_execute_prepared_stmt` como o nome da instrução preparada. Se esse nome de instrução existir quando o procedimento for chamado, seu conteúdo anterior é destruído.

##### Parâmetros

* `in_query LONGTEXT CHARACTER SET utf8mb3`: A string de instrução a ser executada.

##### Opções de configuração

A operação `execute_prepared_stmt()` pode ser modificada usando as seguintes opções de configuração ou suas variáveis definidas pelo usuário correspondentes (consulte a Seção 30.4.2.1, “A tabela sys_config”):

* `debug`, `@sys.debug`

  Se esta opção for `ON`, produzirá saída de depuração. O padrão é `OFF`.

##### Exemplo

```
mysql> CALL sys.execute_prepared_stmt('SELECT COUNT(*) FROM mysql.user');
+----------+
| COUNT(*) |
+----------+
|       15 |
+----------+
```