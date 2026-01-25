#### 6.4.4.9 Funções de Gerenciamento de Chaves do Keyring Específicas de Plugin

Para cada função de keyring específica de plugin, esta seção descreve seu propósito, sequência de chamada e valor de retorno. Para informações sobre funções de keyring de propósito geral, consulte [Seção 6.4.4.8, “Funções de Gerenciamento de Chaves do Keyring de Propósito Geral”](keyring-functions-general-purpose.html "6.4.4.8 Funções de Gerenciamento de Chaves do Keyring de Propósito Geral”).

* [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk)

  Plugin de keyring Associado: `keyring_aws`

  [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk) rotaciona a customer master key (CMK). A rotação altera apenas a chave que o AWS KMS usa para operações subsequentes de criptografia de data key. O AWS KMS mantém versões CMK anteriores, de modo que as chaves geradas usando CMKs anteriores permaneçam descriptografáveis após a rotação.

  A rotação altera o valor CMK usado dentro do AWS KMS, mas não altera o ID usado para se referir a ele, portanto, não há necessidade de alterar a System Variable [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) após chamar [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk).

  Esta função requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

  Argumentos:

  Nenhum.

  Valor de retorno:

  Retorna 1 em caso de sucesso, ou `NULL` e um erro em caso de falha.

* [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys)

  Plugin de keyring Associado: `keyring_aws`

  [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys) rotaciona as chaves armazenadas no arquivo de armazenamento `keyring_aws` nomeado pela System Variable [`keyring_aws_data_file`](keyring-system-variables.html#sysvar_keyring_aws_data_file). A rotação envia cada chave armazenada no arquivo para o AWS KMS para recriptografia, usando o valor da System Variable [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) como o valor CMK, e armazena as novas chaves criptografadas no arquivo.

  [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys) é útil para a recriptografia de chaves nas seguintes circunstâncias:

  + Após rotacionar a CMK; ou seja, após invocar a função [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk).

  + Após alterar a System Variable [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) para um valor de chave diferente.

  Esta função requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

  Argumentos:

  Nenhum.

  Valor de retorno:

  Retorna 1 em caso de sucesso, ou `NULL` e um erro em caso de falha.
