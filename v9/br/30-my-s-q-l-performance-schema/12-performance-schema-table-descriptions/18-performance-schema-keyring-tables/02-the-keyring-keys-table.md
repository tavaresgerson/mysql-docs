#### 29.12.18.2 A tabela keyring_keys

O MySQL Server suporta um conjunto de chaves (keyring) que permite que componentes internos do servidor e plugins armazenem informações sensíveis de forma segura para recuperação posterior. Consulte a Seção 8.4.5, “O Keyring MySQL”.

A tabela `keyring_keys` exibe metadados para as chaves no keyring. Os metadados das chaves incluem IDs de chave, proprietários de chave e IDs de chave de backend. A tabela `keyring_keys` *não* exibe dados sensíveis do keyring, como o conteúdo das chaves.

A tabela `keyring_keys` tem as seguintes colunas:

* `KEY_ID`

  O identificador da chave.

* `KEY_OWNER`

  O proprietário da chave.

* `BACKEND_KEY_ID`

  O ID usado para a chave pelo backend do keyring.

A tabela `keyring_keys` não tem índices.

A operação `TRUNCATE TABLE` não é permitida para a tabela `keyring_keys`.