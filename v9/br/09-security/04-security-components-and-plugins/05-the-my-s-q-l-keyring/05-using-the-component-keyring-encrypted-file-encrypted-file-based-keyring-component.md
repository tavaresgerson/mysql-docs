#### 8.4.5.5 Usando o componente `component_keyring_encrypted_file` Component Encriptado de Carteira de Arquivos

Nota

`component_keyring_encrypted_file` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O componente `component_keyring_encrypted_file` armazena os dados da carteira em um arquivo encriptado e protegido por senha, localizado no host do servidor.

Aviso

Para a gestão de chaves de encriptação, os componentes `component_keyring_file` e `component_keyring_encrypted_file` não são destinados como solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gestão de chaves para proteger, gerenciar e proteger as chaves de encriptação em cofres de chaves ou módulos de segurança de hardware (HSMs).

Para usar `component_keyring_encrypted_file` para a gestão de keystore no cenário mais comum, crie dois arquivos: um arquivo de manifesto que instrui o servidor a carregar `component_keyring_encrypted_file`, e um arquivo de configuração que especifica onde armazenar as chaves. Ambos os arquivos devem ser legíveis apenas pelo usuário apropriado que executa o servidor, tipicamente `mysql`.

O arquivo de manifesto deve ser chamado `mysqld.my` e adicionado ao mesmo diretório onde o **mysqld** está instalado. O arquivo tem a seguinte aparência:

```
{
  "components": "file://component_keyring_encrypted_file"
}
```

O arquivo de configuração deve ser chamado `component_keyring_encrypted_file.cnf` e adicionado ao diretório do plugin. Ele contém o caminho para o arquivo onde o servidor armazena as chaves:

```
{
  "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
  "password": "password",
  "read_only": false
}
```

Após adicionar os dois arquivos, reinicie o **mysqld**. Verifique a instalação do componente examinando a tabela do Schema de Desempenho `keyring_component_status`:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
```

Um valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se a inicialização do servidor falhar ou o valor `Component_status` for `Disabled`, verifique o log de erro do servidor.

Para obter mais detalhes e revisar outros cenários, consulte a Seção 8.4.5.2, “Instalação do componente Keychain” e Notas de Configuração.

* Notas de Configuração
* Uso do Componente Keychain Encriptado

##### Notas de Configuração

Ao se inicializar, o `component_keyring_encrypted_file` lê ou um arquivo de configuração global, ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

* O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).

* Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tenta ler seu arquivo de configuração local do diretório de dados.

* Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_encrypted_file.cnf` em ambos os locais.

* Se o `component_keyring_encrypted_file` não conseguir encontrar o arquivo de configuração, um erro ocorre e o componente não pode ser inicializado.

Os arquivos de configuração do `component_keyring_encrypted_file` permitem configurar múltiplas instâncias do servidor para usar `component_keyring_encrypted_file`, de modo que a configuração do componente para cada instância do servidor seja específica de uma instância de diretório de dados dada. Isso permite que o mesmo componente Keychain seja usado com um arquivo de dados distinto para cada instância.

Os arquivos de configuração do `component_keyring_encrypted_file` têm essas propriedades:

* Um arquivo de configuração deve estar no formato JSON válido.
* Um arquivo de configuração permite esses itens de configuração:

+ `"read_local_config"`: Este item é permitido apenas no arquivo de configuração global. Se o item não estiver presente, o componente usa apenas o arquivo de configuração global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o componente deve ler informações de configuração do arquivo de configuração local.

Se o item `"read_local_config"` estiver presente no arquivo de configuração global junto com outros itens, o componente verifica o valor do item `"read_local_config"` primeiro:

- Se o valor for `false`, o componente processa os outros itens no arquivo de configuração global e ignora o arquivo de configuração local.

- Se o valor for `true`, o componente ignora os outros itens no arquivo de configuração global e tenta ler o arquivo de configuração local.

+ `"path"`: O valor do item é uma string que nomeia o arquivo a ser usado para armazenar os dados do chaveiro. O arquivo deve ser nomeado usando um caminho absoluto, não um caminho relativo. Este item é obrigatório na configuração. Se não for especificado, a inicialização de `component_keyring_encrypted_file` falha.

+ `"password"`: O valor do item é uma string que especifica a senha para acessar o arquivo de dados. Este item é obrigatório na configuração. Se não for especificado, a inicialização de `component_keyring_encrypted_file` falha.

+ `"read_only"`: O valor do item indica se o arquivo de dados do chaveiro é apenas para leitura. O valor do item é `true` (somente leitura) ou `false` (leitura/escrita). Este item é obrigatório na configuração. Se não for especificado, a inicialização de `component_keyring_encrypted_file` falha.

* O administrador do banco de dados tem a responsabilidade de criar quaisquer arquivos de configuração a serem usados e de garantir que seus conteúdos estejam corretos. Se ocorrer um erro, a inicialização do servidor falha e o administrador deve corrigir quaisquer problemas indicados pelos diagnósticos no log de erro do servidor.

* Qualquer arquivo de configuração que armazene uma senha deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL.

Dadas as propriedades dos arquivos de configuração anteriores, para configurar `component_keyring_encrypted_file`, crie um arquivo de configuração global chamado `component_keyring_encrypted_file.cnf` no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado, e, opcionalmente, crie um arquivo de configuração local, também chamado `component_keyring_encrypted_file.cnf`, no diretório de dados. As instruções seguintes assumem que um arquivo de dados de chaveiro chamado `/usr/local/mysql/keyring/component_keyring_encrypted_file.keys` deve ser usado em modo de leitura/escrita. Você também deve escolher uma senha.

Nota

Para sistemas Windows, o caminho para o arquivo `/usr/local/mysql/keyring/component_keyring_encrypted_file.keys` pode estar em `C:\ProgramData`. Ele não deve estar em `C:\Program Files`.

* Para usar apenas um arquivo de configuração global, o conteúdo do arquivo é o seguinte:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
    "password": "password",
    "read_only": false
  }
  ```

  Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado.

Este caminho não deve apontar para ou incluir o diretório de dados do MySQL. O caminho deve ser legível e gravável pelo usuário do sistema MySQL (Windows: `NETWORK SERVICES`; Linux: usuário `mysql`; MacOS: usuário `_mysql`). Não deve ser acessível a outros usuários.

* Alternativamente, para usar um par de arquivos de configuração global e local, o arquivo global é o seguinte:

  ```
  {
    "read_local_config": true
  }
  ```

Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado.

O arquivo local parece assim:

```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
    "password": "password",
    "read_only": false
  }
  ```

Este caminho não deve apontar para o diretório de dados do MySQL ou incluí-lo. O caminho deve ser legível e gravável pelo usuário do sistema MySQL (Windows: `NETWORK SERVICES`; Linux: usuário `mysql`; MacOS: usuário `_mysql`). Não deve ser acessível a outros usuários.

##### Uso do Componente de Carteira de Chaves Encriptada

As operações da carteira de chaves são transacionais: o `component_keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa reverter ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome do arquivo de dados com um sufixo de `.backup`.

O `component_keyring_encrypted_file` suporta as funções que compõem a interface padrão do serviço de carteira de chaves do MySQL. As operações de carteira de chaves realizadas por essas funções são acessíveis em instruções SQL conforme descrito na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves de Carteira de Propósito Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chave permitidos pelo `component_keyring_encrypted_file`, consulte a Seção 8.4.5.13, “Tipos e comprimentos de chaves de carteira de chaves suportados”.