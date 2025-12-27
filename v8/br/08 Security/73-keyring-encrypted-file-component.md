#### 8.4.4.5 Usando o componente `component_keyring_encrypted_file` Componento de cartela criptografado com base em arquivo

::: info Nota

`component_keyring_encrypted_file` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

O componente `component_keyring_encrypted_file` armazena os dados da cartela em um arquivo criptografado e protegido por senha, localizado no host do servidor.

Aviso

Para a gestão de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` não são destinados como solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gestão de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Para usar `component_keyring_encrypted_file` para a gestão de cartelas, você deve:

1. Escrever um manifesto que indique ao servidor para carregar `component_keyring_encrypted_file`, conforme descrito na Seção 8.4.4.2, “Instalação do componente de cartela”.
2. Escrever um arquivo de configuração para `component_keyring_encrypted_file`, conforme descrito aqui.

Quando se inicializa, `component_keyring_encrypted_file` lê um arquivo de configuração global ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

* O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).
* Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tenta ler seu arquivo de configuração local do diretório de dados.
* Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_encrypted_file.cnf` em ambos os locais.
* Se `component_keyring_encrypted_file` não encontrar o arquivo de configuração, um erro ocorre e o componente não pode ser inicializado.

Os arquivos de configuração locais permitem configurar múltiplas instâncias do servidor para usar `component_keyring_encrypted_file`, de modo que a configuração do componente para cada instância do servidor seja específica de uma instância de diretório de dados dado. Isso permite que o mesmo componente de chaveiro seja usado com um arquivo de dados distinto para cada instância.

Os arquivos de configuração `component_keyring_encrypted_file` têm essas propriedades:

* Um arquivo de configuração deve estar no formato JSON válido.
* Um arquivo de configuração permite esses itens de configuração:

  + `"read_local_config"`: Este item é permitido apenas no arquivo de configuração global. Se o item não estiver presente, o componente usa apenas o arquivo de configuração global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o componente deve ler informações de configuração do arquivo de configuração local.

    Se o item `"read_local_config"` estiver presente no arquivo de configuração global juntamente com outros itens, o componente verifica o valor do item `"read_local_config"` primeiro:

- Se o valor for `false`, o componente processa os outros itens no arquivo de configuração global e ignora o arquivo de configuração local.
- Se o valor for `true`, o componente ignora os outros itens no arquivo de configuração global e tenta ler o arquivo de configuração local.
+ `"path"`: O valor do item é uma string que nomeia o arquivo a ser usado para armazenar os dados do bloco de chaves. O arquivo deve ser nomeado usando um caminho absoluto, não um caminho relativo. Este item é obrigatório na configuração. Se não for especificado, a inicialização de `component_keyring_encrypted_file` falha.
+ `"password"`: O valor do item é uma string que especifica a senha para acessar o arquivo de dados. Este item é obrigatório na configuração. Se não for especificado, a inicialização de `component_keyring_encrypted_file` falha.
+ `"read_only"`: O valor do item indica se o arquivo de dados do bloco de chaves é apenas para leitura. O valor do item é `true` (somente leitura) ou `false` (leitura/escrita). Este item é obrigatório na configuração. Se não for especificado, a inicialização de `component_keyring_encrypted_file` falha.
* O administrador do banco de dados é responsável por criar quaisquer arquivos de configuração a serem usados e por garantir que seus conteúdos sejam corretos. Se ocorrer um erro, o inicialização do servidor falha e o administrador deve corrigir quaisquer problemas indicados pelos diagnósticos no log de erro do servidor.
* Qualquer arquivo de configuração que armazene uma senha deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL.

Dadas as propriedades do arquivo de configuração anterior, para configurar `component_keyring_encrypted_file`, crie um arquivo de configuração global chamado `component_keyring_encrypted_file.cnf` no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado, e, opcionalmente, crie um arquivo de configuração local, também chamado `component_keyring_encrypted_file.cnf`, no diretório de dados. As instruções seguintes assumem que um arquivo de dados de chaveiro chamado `/usr/local/mysql/keyring/component_keyring_encrypted_file` será usado em modo de leitura/escrita. Você também deve escolher uma senha.

* Para usar apenas um arquivo de configuração global, o conteúdo do arquivo é o seguinte:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file",
    "password": "password",
    "read_only": false
  }
  ```

  Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado.

  Este caminho não deve apontar para ou incluir o diretório de dados MySQL. O caminho deve ser legível e gravável pelo usuário MySQL do sistema (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). Não deve ser acessível a outros usuários.
* Alternativamente, para usar um par de arquivos de configuração global e local, o arquivo global tem o seguinte formato:

  ```
  {
    "read_local_config": true
  }
  ```

  Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado.

  O arquivo local tem o seguinte formato:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file",
    "password": "password",
    "read_only": false
  }
  ```

  Este caminho não deve apontar para ou incluir o diretório de dados MySQL. O caminho deve ser legível e gravável pelo usuário MySQL do sistema (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). Não deve ser acessível a outros usuários.

As operações do chaveiro são transacionais: o `component_keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa reverter ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome do arquivo de dados com o sufixo `.backup`.

`component_keyring_encrypted_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em instruções SQL, conforme descrito na Seção 8.4.4.12, “Funções de Gerenciamento de Chaves de Keyring de Uso Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chave permitidos por `component_keyring_encrypted_file`, consulte a Seção 8.4.4.10, “Tipos e comprimentos de chaves de Keyring suportados”.