#### 8.4.1.9 Autenticação Conectada a OpenID

Nota

A autenticação conectada a OpenID é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando OpenID Connect, desde que as credenciais e tokens de OpenID Connect apropriados estejam configurados corretamente com base na estrutura OAuth 2.0.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações de instalação, consulte Instalando Autenticação Conectada a OpenID.

**Tabela 8.24 Nomes de Plugin e Biblioteca para Autenticação Conectada a OpenID**

<table summary="Nomes dos plugins e arquivos de biblioteca usados para autenticação conectada a OpenID."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code>authentication_openid_connect</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td><code>authentication_openid_connect_client</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td><code>authentication_openid_connect.so</code>, <code>authentication_openid_connect_client.so</code></td> </tr></tbody></table>

O plugin de autenticação OpenID Connect no lado do servidor está incluído na Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. O plugin no lado do cliente está incluído em todas as distribuições, incluindo as comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin no lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de plugagem OpenID Connect:

* Pré-requisitos para Autenticação de Plugagem OpenID Connect
* Processo e fluxo de trabalho do OpenID Connect
* Instalando a Autenticação de Plugagem OpenID
* Conectando-se com um Cliente

Para informações gerais sobre autenticação plugagem no MySQL, consulte a Seção 8.2.17, “Autenticação Plugagem”.

##### Pré-requisitos para Autenticação de Plugagem OpenID Connect

Para usar a autenticação de plugagem OpenID Connect para o MySQL, esses pré-requisitos devem ser atendidos:

[Token de Identidade](https://docs.oracle.com/en/cloud/paas/identity-cloud/rest-api/IdentityToken.html).

* O *administrador* deve ter uma lista de emissor de tokens a serem suportados, juntamente com suas chaves de assinatura públicas. O administrador também deve ter o identificador do usuário do domínio do provedor de identidade.

##### Processo e Fluxo de Trabalho do OpenID Connect

A autenticação OpenID Connect segue estas etapas, onde as partes no lado do servidor e no lado do cliente são realizadas usando os plugins de autenticação `authentication_openid_connect` e `authentication_openid_connect_client`, respectivamente:

1. O cliente lê o arquivo do token de identidade. Por exemplo, o cliente de linha de comando **mysql** usa a opção `authentication-openid-connect-client-id-token-file` com um caminho completo para o arquivo do token. O cliente não aceita um token com tamanho superior a 10 KB. Cada conector tem um método para passar essas informações.

2. O cliente verifica se a conexão é segura entre o cliente e o servidor. Apenas as conexões TLS, socket e memória compartilhada são consideradas seguras.

3. O cliente envia o token para o servidor após verificar se é um token JSON Web (JWT) válido.

4. O servidor verifica se a conexão é segura entre o cliente e o servidor e recebe o token.

5. O servidor decodifica e valida o token:

   1. Verifica se o token é um JWT válido.
   2. Os cabeçalhos são extraídos usando o algoritmo de criptografia, que utiliza o algoritmo assimétrico RS256.

   3. O payload é decodificado e são realizadas verificações para determinar se os critérios apropriados são atendidos para um login bem-sucedido.

6. Critérios para um login bem-sucedido:

   * O valor da reivindicação `sub` do token de identidade deve ser o mesmo do valor do usuário na string de autenticação.

   * O valor da reivindicação `identity_provider` na string de autenticação deve ser um dos valores `identity_provider` definidos na configuração.

   * O valor da reivindicação `iss` do token de identidade deve ser igual ao valor do nome do `identity_provider` definido na configuração.

   * O tempo de validade do token de identidade deve ser maior que a hora atual.

   * A assinatura do token de identidade deve ser verificada pela chave pública do nome do emissor do token de identidade especificado na opção `authentication_openid_connect_configuration` definida pelo administrador.

7. A autenticação é bem-sucedida se todos os critérios necessários forem atendidos, caso contrário, a autenticação falha e registra as informações apropriadas no log de erro.

##### Instalando o Plugin de Autenticação OpenID Pluggable

Esta seção descreve como instalar o plugin de autenticação OpenID Connect no lado do servidor. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Instale o plugin `authentication_openid_connect` no lado do servidor no MySQL Server. Por exemplo, usando `INSTALL PLUGIN`:

```
INSTALL PLUGIN authentication_openid_connect SONAME 'authentication_openid_connect.so';
```

Em seguida, configure a opção `authentication_openid_connect_configuration` do servidor MySQL. O administrador especifica a lista de emissor e seus respectivos Chaves de Assinatura Pública usadas para validar a assinatura do token de Identidade. Isso é definido como uma string JSON (com o prefixo `JSON://`) ou aponta para um arquivo JSON (com o prefixo `file://`). Apenas os tokens de Identidade emitidos pela lista de emissor especificada pelo administrador são aceitos para autenticação. Por exemplo:

```
SET GLOBAL authentication_openid_connect_configuration = "file://full/path/to/file.json";
```

O arquivo `file.json` neste exemplo parece semelhante a:

```
{
  "issuer1": "{\"name\":\"issuer1_formal_name\",\"e\":\"AQAB\",\"use\":\"sig\",\"n\":\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\",\"kty\":\"RSA\"}",
  "issuer2": "{\"name\":\"issuer2_formal_name\",\"e\":\"AQAB\",\"use\":\"sig\",\"n\":\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\",\"kty\":\"RSA\"}"
}
```

Alternativamente, defina `authentication_openid_connect_configuration` inline como uma string JSON em vez de um arquivo:

```
SET GLOBAL authentication_openid_connect_configuration = "JSON://{\"issuer1\" : \"{\\\"name\\\":\\\"issuer1_formal_name\\\",\\\"e\\\":\\\"AQAB\\\",\\\"use\\\":\\\"sig\\\",\\\"n\\\":\\\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\\\",\\\"kty\\\":\\\"RSA\\\"}\", \"issuer2\": \"{\\\"name\\\":\\\"issuer2_formal_name\\\",\\\"e\\\":\\\"AQAB\\\",\\\"use\\\":\\\"sig\\\",\\\"n\\\":\\\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\\\",\\\"kty\\\":\\\"RSA\\\"}\"}";
```

Um dos nomes do emissor deve corresponder ao valor `identity_provider` da string de autenticação, e o valor da chave `name` correspondente deve corresponder ao valor `iss` do token de Identidade.

Um usuário MySQL é mapeado a um usuário gerenciado em um domínio do provedor de identidade para autenticar via o plugin `authentication_openid_connect_client` no lado do cliente, como no exemplo mostrado aqui:

```
CREATE USER
  'username'@'%'
IDENTIFIED WITH
  'authentication_openid_connect'
AS
  '{"identity_provider" : "idp_name_here", "user" : "user_id_here"}';
```

Substitua *`idp_name_here`* pelo nome do provedor de identidade escolhido pelo administrador para corresponder a uma das chaves permitidas do provedor de identidade especificadas na configuração. Substitua *`user_id_here`* pelo identificador do usuário no domínio do provedor de identidade, que deve corresponder ao campo `sub` no token de identidade.

##### Conectando com um Cliente

Um cliente com o plugin `authentication_openid_connect_client` habilitado passa o token de identidade necessário para autenticar com um usuário mapeado no MySQL, usando o caminho completo para o arquivo do token de identidade usado ao se conectar ao servidor MySQL.

Por exemplo, o cliente de linha de comando **mysql** passa a opção `--authentication-openid-connect-client-id-token-file`. Por exemplo:

```
mysql -h hostname --port port --authentication-openid-connect-client-id-token-file=/path/to/token/file -u username
```