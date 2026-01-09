#### 29.12.18.1 Tabela keyring_component_status

A tabela `keyring_component_status` fornece informações de status sobre as propriedades do componente do bloco de chaves em uso, se um estiver instalado. A tabela está vazia se nenhum componente do bloco de chaves estiver instalado (por exemplo, se o bloco de chaves não estiver sendo usado ou estiver configurado para gerenciar o keystore usando um plugin de bloco de chaves em vez de um componente do bloco de chaves).

Não há um conjunto fixo de propriedades. Cada componente do bloco de chaves é livre para definir seu próprio conjunto.

Exemplos de conteúdo da tabela `keyring_component_status`:

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

A tabela `keyring_component_status` tem as seguintes colunas:

* `STATUS_KEY`

  O nome do item de status.

* `STATUS_VALUE`

  O valor do item de status.

A tabela `keyring_component_status` não tem índices.

A operação `TRUNCATE TABLE` não é permitida para a tabela `keyring_component_status`.