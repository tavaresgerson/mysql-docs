#### 6.4.4.9 Funções de Gerenciamento de Chaves do Carteiro Específicas aos Plugins

Para cada função específica do plugin do bloco de chaves, esta seção descreve seu propósito, sequência de chamadas e valor de retorno. Para informações sobre funções gerais do bloco de chaves, consulte Seção 6.4.4.8, “Funções de Gerenciamento de Chave do Bloco de Chaves de Uso Geral”.

- `keyring_aws_rotate_cmk()`

  Plugin de chave associado: `keyring_aws`

  `keyring_aws_rotate_cmk()` rotação da chave mestre do cliente (CMK). A rotação altera apenas a chave que o AWS KMS usa para operações subsequentes de criptografia de chave de dados. O AWS KMS mantém as versões anteriores da CMK, portanto, as chaves geradas usando CMKs anteriores permanecem descriptografáveis após a rotação.

  A rotação altera o valor CMK usado dentro do AWS KMS, mas não altera o ID usado para referenciá-lo, portanto, não é necessário alterar a variável de sistema `keyring_aws_cmk_id` após chamar `keyring_aws_rotate_cmk()`.

  Essa função requer o privilégio `SUPER`.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Retorna 1 para sucesso ou `NULL` e um erro para falha.

- `keyring_aws_rotate_keys()`

  Plugin de chave associado: `keyring_aws`

  `keyring_aws_rotate_keys()` rotação de chaves armazenadas no arquivo de armazenamento `keyring_aws` nomeado pela variável de sistema `keyring_aws_data_file`. A rotação envia cada chave armazenada no arquivo para o AWS KMS para re-encriptação usando o valor da variável de sistema `keyring_aws_cmk_id` como o valor do CMK, e armazena as novas chaves criptografadas no arquivo.

  `keyring_aws_rotate_keys()` é útil para re-encriptação de chaves nessas circunstâncias:

  - Após rotear o CMK; ou seja, após invocar a função `keyring_aws_rotate_cmk()`.

  - Depois de alterar a variável de sistema `keyring_aws_cmk_id` para um valor de chave diferente.

  Essa função requer o privilégio `SUPER`.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Retorna 1 para sucesso ou `NULL` e um erro para falha.
