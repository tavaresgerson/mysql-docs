### 7.5.2 Obtenção de informações sobre os componentes

A tabela de sistema `mysql.component` contém informações sobre os componentes atualmente carregados e mostra quais componentes foram registrados usando `INSTALL COMPONENT`. Selecionando a tabela mostra quais componentes estão instalados. Por exemplo:

```
mysql> SELECT * FROM mysql.component;
+--------------+--------------------+------------------------------------+
| component_id | component_group_id | component_urn                      |
+--------------+--------------------+------------------------------------+
|            1 |                  1 | file://component_validate_password |
|            2 |                  2 | file://component_log_sink_json     |
+--------------+--------------------+------------------------------------+
```

Os valores `component_id` e `component_group_id` são para uso interno. O `component_urn` é o URN usado nas instruções `INSTALL COMPONENT` e `UNINSTALL COMPONENT` para carregar e descarregar o componente.
