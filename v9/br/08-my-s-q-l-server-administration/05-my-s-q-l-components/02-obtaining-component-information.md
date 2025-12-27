### 7.5.2 Obter Informações de Componentes

A tabela `mysql.component` do sistema contém informações sobre os componentes carregados atualmente e mostra quais componentes foram registrados usando `INSTALE COMPONENTE`. Selecionar da tabela mostra quais componentes estão instalados. Por exemplo:

```
mysql> SELECT * FROM mysql.component;
+--------------+--------------------+------------------------------------+
| component_id | component_group_id | component_urn                      |
+--------------+--------------------+------------------------------------+
|            1 |                  1 | file://component_validate_password |
|            2 |                  2 | file://component_log_sink_json     |
+--------------+--------------------+------------------------------------+
```

Os valores `component_id` e `component_group_id` são para uso interno. O `component_urn` é o URN usado nas instruções `INSTALE COMPONENTE` e `DESINSTALE COMPONENTE` para carregar e descarregar o componente.