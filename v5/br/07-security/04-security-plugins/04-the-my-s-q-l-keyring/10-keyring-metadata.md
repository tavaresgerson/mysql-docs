#### 6.4.4.10 Metadados do cartela de identificação

Para verificar se um plugin de chave de fenda está carregado, verifique a tabela do Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```
