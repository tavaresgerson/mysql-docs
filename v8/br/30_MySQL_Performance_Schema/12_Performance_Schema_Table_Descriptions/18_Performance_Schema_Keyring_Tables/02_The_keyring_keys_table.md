#### 29.12.18.2 A tabela keyring\_keys

O MySQL Server suporta um conjunto de chaves que permite que os componentes internos do servidor e os plugins armazem informações sensíveis de forma segura para recuperação posterior. Consulte a Seção 8.4.4, “O Conjunto de Chaves do MySQL”.

A partir do MySQL 8.0.16, a tabela `keyring_keys` exibe metadados para as chaves no conjunto de chaves. Os metadados das chaves incluem IDs de chave, proprietários de chave e IDs de chave de backend. A tabela `keyring_keys` *não* exibe nenhum dado sensível do conjunto de chaves, como o conteúdo das chaves.

A tabela `keyring_keys` tem essas colunas:

- `KEY_ID`

  O identificador principal.

- `KEY_OWNER`

  O proprietário da chave.

- `BACKEND_KEY_ID`

  O ID usado para a chave pelo backend do keyring.

A tabela `keyring_keys` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `keyring_keys`.
