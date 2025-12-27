#### 8.4.4.14 Metadados do Keychain

Esta seção descreve as fontes de informações sobre o uso do keychain.

Para verificar se um plugin do keychain está carregado, consulte a tabela do Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obter Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| keyring_okv | ACTIVE        |
+-------------+---------------+
```

Para ver quais chaves existem, consulte a tabela do Schema de Desempenho `keyring_keys`:

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

Para verificar se um componente do keychain está carregado, consulte a tabela do Schema de Desempenho `keyring_component_status`. Por exemplo:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

O valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso. Se o componente foi carregado, mas não conseguiu inicializar, o valor é `Disabled`.