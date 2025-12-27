### 8.6.1 Instalação e Atualização da Criptografia Empresarial do MySQL

As funções são fornecidas por um componente do MySQL `component_enterprise_encryption`, e a instalação do componente instala todas as funções.

As funções de Criptografia Empresarial do MySQL são fornecidas pelo componente `component_enterprise_encryption` do MySQL. Para obter informações sobre a atualização, consulte Atualizando a Criptografia Empresarial do MySQL.

Se você estiver atualizando de uma versão anterior ao MySQL 8.0.30: Antes de instalar o componente, descarregue quaisquer funções legadas usando a instrução `DROP FUNCTION`:

```
DROP FUNCTION asymmetric_decrypt;
DROP FUNCTION asymmetric_derive;
DROP FUNCTION asymmetric_encrypt;
DROP FUNCTION asymmetric_sign;
DROP FUNCTION asymmetric_verify;
DROP FUNCTION create_asymmetric_priv_key;
DROP FUNCTION create_asymmetric_pub_key;
DROP FUNCTION create_dh_parameters;
DROP FUNCTION create_digest;
```

Os nomes das funções devem ser especificados em minúsculas. As instruções exigem o privilégio `DROP` para o banco de dados `mysql`.

Para instalar o componente, execute a instrução `INSTALL COMPONENT`:

```
INSTALL COMPONENT "file://component_enterprise_encryption";
```

`INSTALL COMPONENT` requer o privilégio `INSERT` para a tabela `mysql.component` do sistema, pois adiciona uma linha a essa tabela para registrar o componente. Para verificar se o componente foi instalado, execute a instrução mostrada aqui:

```
SELECT * FROM mysql.component;
```

Os componentes listados em `mysql.component` são carregados pelo serviço de carregamento durante a sequência de inicialização.

Se você precisar desinstalar o componente, execute uma instrução `UNINSTALL COMPONENT`:

```
UNINSTALL COMPONENT "file://component_enterprise_encryption";
```

A desinstalação do componente desinstala todas as funções. Para obter mais detalhes, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

::: info Nota

A instalação do componente instala todas as suas funções, então você não precisa criá-las usando instruções `CREATE FUNCTION` como em versões mais antigas do MySQL.

Quando você tiver instalado o componente, se quiser que as funções do componente suportem descriptografia e verificação para conteúdo produzido por funções legadas, defina a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` para `ON`. Além disso, se quiser alterar o comprimento máximo permitido para as chaves RSA geradas pelas funções do componente, use a variável de sistema `enterprise_encryption.maximum_rsa_key_size` para definir um tamanho máximo apropriado. Para informações de configuração, consulte a Seção 8.6.2, “Configurando a Criptografia da Empresa MySQL”.