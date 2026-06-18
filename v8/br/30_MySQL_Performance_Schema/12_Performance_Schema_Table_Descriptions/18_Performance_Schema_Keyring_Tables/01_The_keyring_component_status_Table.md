#### 29.12.18.1 Tabela keyring\_component\_status

A tabela `keyring_component_status` (disponível a partir do MySQL 8.0.24) fornece informações de status sobre as propriedades do componente de chaveiro em uso, se um estiver instalado. A tabela está vazia se nenhum componente de chaveiro estiver instalado (por exemplo, se o chaveiro não estiver sendo usado ou estiver configurado para gerenciar o keystore usando um plugin de chaveiro em vez de um componente de chaveiro).

Não há um conjunto fixo de propriedades. Cada componente do chaveiro é livre para definir seu próprio conjunto.

Exemplo: o conteúdo do `keyring_component_status` é:

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

A tabela `keyring_component_status` tem essas colunas:

- `STATUS_KEY`

  O nome do item de status.

- `STATUS_VALUE`

  O valor do item de status.

A tabela `keyring_component_status` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `keyring_component_status`.
