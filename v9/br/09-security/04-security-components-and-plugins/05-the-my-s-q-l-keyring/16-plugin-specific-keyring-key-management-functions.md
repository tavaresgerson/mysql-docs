#### 8.4.5.16 Funções de Gerenciamento de Chaves do Cofre de Chave Específicas de Plugin

Para cada função específica de cofre de chave do plugin, esta seção descreve seu propósito, sequência de chamada e valor de retorno. Para informações sobre funções gerais de cofre de chave, consulte a Seção 8.4.5.15, “Funções de Gerenciamento de Chaves do Cofre de Chave de Uso Geral”.

* `keyring_aws_rotate_cmk()`

  Plugin de cofre associado: `keyring_aws`

  Nota

  `keyring_aws_rotate_cmk()` não é fornecido pelo componente de cofre de chave AWS. Por essa razão, a função deve ser considerada obsoleta e, portanto, sujeita à remoção em uma versão futura do MySQL.

  `keyring_aws_rotate_cmk()` rotação a chave do AWS KMS. As mudanças de rotação alteram apenas a chave que o AWS KMS usa para operações subsequentes de criptografia de chave de dados. O AWS KMS mantém as versões anteriores do CMK, portanto, as chaves geradas usando CMKs anteriores permanecem descriptografáveis após a rotação.

  As mudanças de rotação alteram o valor CMK usado dentro do AWS KMS, mas não alteram o ID usado para referenciá-lo, portanto, não há necessidade de alterar a variável de sistema `keyring_aws_cmk_id` após a chamada de `keyring_aws_rotate_cmk()`.

  Esta função requer o privilégio `SUPER`.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Retorna 1 para sucesso, ou `NULL` e um erro para falha.

* `keyring_aws_rotate_keys()`

  Plugin de cofre associado: `keyring_aws`

  Nota

  `keyring_aws_rotate_keys()` não é fornecido pelo componente de cofre de chave AWS. Por essa razão, a função deve ser considerada obsoleta e, portanto, sujeita à remoção em uma versão futura do MySQL.

`keyring_aws_rotate_keys()` rotação de chaves armazenadas no arquivo de armazenamento `keyring_aws` nomeado pela variável de sistema `keyring_aws_data_file`. A rotação envia cada chave armazenada no arquivo para o AWS KMS para re-encriptação usando o valor da variável de sistema `keyring_aws_cmk_id` como o valor do CMK, e armazena as novas chaves criptografadas no arquivo.

`keyring_aws_rotate_keys()` é útil para re-encriptação de chaves sob essas circunstâncias:

+ Após a rotação do CMK; ou seja, após invocar a função `keyring_aws_rotate_cmk()`.

+ Após alterar a variável de sistema `keyring_aws_cmk_id` para um valor de chave diferente.

Esta função requer o privilégio `SUPER`.

Argumentos:

Nenhum.

Valor de retorno:

Retorna 1 para sucesso, ou `NULL` e um erro para falha.

* `keyring_hashicorp_update_config()`

  Plugin de chave associado: `keyring_hashicorp`

  Nota

  `keyring_hashicorp_update_config()` não é fornecido pelo componente de chave de keyring HashiCorp. Por essa razão, a função deve ser considerada obsoleta e, portanto, sujeita à remoção em uma versão futura do MySQL.

  Quando invocada, a função `keyring_hashicorp_update_config()` faz com que o `keyring_hashicorp` realize uma reconfiguração em tempo de execução, conforme descrito em keyring_hashicorp Configuration.

  Esta função requer o privilégio `SYSTEM_VARIABLES_ADMIN` porque modifica variáveis de sistema globais.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Retorna a string `'Configuration update was successful.'` para sucesso, ou `'Configuration update failed.'` para falha.