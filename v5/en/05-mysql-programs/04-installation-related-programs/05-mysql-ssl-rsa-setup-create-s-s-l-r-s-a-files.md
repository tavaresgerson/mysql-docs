### 4.4.5 mysql_ssl_rsa_setup — Criação de Arquivos SSL/RSA

Este programa cria os arquivos de certificado e chave SSL e os arquivos de par de chaves RSA necessários para suportar conexões seguras usando SSL e troca segura de senhas usando RSA sobre conexões não criptografadas, caso esses arquivos estejam ausentes. **mysql_ssl_rsa_setup** também pode ser usado para criar novos arquivos SSL se os existentes tiverem expirado.

Nota

**mysql_ssl_rsa_setup** usa o comando **openssl**, portanto, seu uso depende da instalação do OpenSSL em sua máquina.

Outra maneira de gerar arquivos SSL e RSA, para distribuições MySQL compiladas usando OpenSSL, é fazer com que o server os gere automaticamente. Consulte a Seção 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”.

Importante

**mysql_ssl_rsa_setup** ajuda a reduzir a barreira para o uso de SSL, facilitando a geração dos arquivos necessários. No entanto, os certificados gerados por **mysql_ssl_rsa_setup** são autoassinados (*self-signed*), o que não é muito seguro. Depois de ganhar experiência usando os arquivos criados por **mysql_ssl_rsa_setup**, considere obter um certificado CA de uma autoridade de certificação registrada.

Invoque **mysql_ssl_rsa_setup** desta forma:

```sql
mysql_ssl_rsa_setup [options]
```

Opções típicas são `--datadir` para especificar onde criar os arquivos e `--verbose` para ver os comandos **openssl** que **mysql_ssl_rsa_setup** executa.

**mysql_ssl_rsa_setup** tenta criar arquivos SSL e RSA usando um conjunto padrão de nomes de arquivo. Funciona da seguinte forma:

1. **mysql_ssl_rsa_setup** verifica a existência do binário **openssl** nos locais especificados pela variável de ambiente `PATH`. Se **openssl** não for encontrado, **mysql_ssl_rsa_setup** não faz nada. Se **openssl** estiver presente, **mysql_ssl_rsa_setup** procura por arquivos SSL e RSA padrão no diretório de dados MySQL especificado pela opção `--datadir`, ou no diretório de dados compilado se a opção `--datadir` não for fornecida.

2. **mysql_ssl_rsa_setup** verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```sql
   ca.pem
   server-cert.pem
   server-key.pem
   ```

3. Se algum desses arquivos estiver presente, **mysql_ssl_rsa_setup** não cria arquivos SSL. Caso contrário, ele invoca **openssl** para criá-los, além de alguns arquivos adicionais:

   ```sql
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

   Esses arquivos permitem conexões client seguras usando SSL; consulte a Seção 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

4. **mysql_ssl_rsa_setup** verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```sql
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

5. Se algum desses arquivos estiver presente, **mysql_ssl_rsa_setup** não cria arquivos RSA. Caso contrário, ele invoca **openssl** para criá-los. Esses arquivos permitem a troca segura de senhas usando RSA sobre conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`; consulte a Seção 6.4.1.5, “SHA-256 Pluggable Authentication”.

Para obter informações sobre as características dos arquivos criados por **mysql_ssl_rsa_setup**, consulte a Seção 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”.

Na inicialização, o server MySQL usa automaticamente os arquivos SSL criados por **mysql_ssl_rsa_setup** para habilitar o SSL, se nenhuma opção SSL explícita for fornecida além de `--ssl` (possivelmente junto com `ssl_cipher`). Se você preferir designar os arquivos explicitamente, invoque os clients com as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` na inicialização para nomear os arquivos `ca.pem`, `server-cert.pem` e `server-key.pem`, respectivamente.

O server também usa automaticamente os arquivos RSA criados por **mysql_ssl_rsa_setup** para habilitar o RSA se nenhuma opção RSA explícita for fornecida.

Se o server estiver com SSL habilitado, os clients usam SSL por padrão para a conexão. Para especificar explicitamente os arquivos de certificado e chave, use as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` para nomear os arquivos `ca.pem`, `client-cert.pem` e `client-key.pem`, respectivamente. No entanto, alguma configuração adicional do client pode ser necessária primeiro, pois **mysql_ssl_rsa_setup**, por padrão, cria esses arquivos no diretório de dados. As permissões para o diretório de dados normalmente permitem acesso apenas à conta do sistema que executa o server MySQL, portanto, os programas client não podem usar arquivos localizados lá. Para disponibilizar os arquivos, copie-os para um diretório que seja legível (mas *não* gravável) pelos clients:

* Para clients locais, o diretório de instalação do MySQL pode ser usado. Por exemplo, se o diretório de dados for um subdiretório do diretório de instalação e sua localização atual for o diretório de dados, você pode copiar os arquivos desta forma:

  ```sql
  cp ca.pem client-cert.pem client-key.pem ..
  ```

* Para clients remotos, distribua os arquivos usando um canal seguro para garantir que não sejam adulterados durante o trânsito.

Se os arquivos SSL usados para uma instalação MySQL tiverem expirado, você pode usar **mysql_ssl_rsa_setup** para criar novos:

1. Pare o server.
2. Renomeie ou remova os arquivos SSL existentes. Você pode querer fazer um backup deles primeiro. (Os arquivos RSA não expiram, então você não precisa removê-los. **mysql_ssl_rsa_setup** verifica que eles existem e não os sobrescreve.)

3. Execute **mysql_ssl_rsa_setup** com a opção `--datadir` para especificar onde criar os novos arquivos.

4. Reinicie o server.

**mysql_ssl_rsa_setup** suporta as seguintes opções de linha de comando, que podem ser especificadas na linha de comando ou nos grupos `[mysql_ssl_rsa_setup]`, `[mysql_install_db]` e `[mysqld]` de um arquivo de opção. Para obter informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 4.2.2.2, “Using Option Files”.

**Tabela 4.11 Opções do mysql_ssl_rsa_setup**

| Nome da Opção | Descrição |
| :--- | :--- |
| --datadir | Caminho para o data directory |
| --help | Exibe a mensagem de ajuda e sai |
| --suffix | Sufixo para o atributo Common Name do certificado X.509 |
| --uid | Nome do usuário efetivo a ser usado para permissões de arquivo |
| --verbose | Modo Verbose (detalhado) |
| --version | Exibe informações de versão e sai |

* `--help`, `?`

  | Formato da Linha de Comando | `--help` |
  | :--- | :--- |

  Exibe uma mensagem de ajuda e sai.

* `--datadir=dir_name`

  | Formato da Linha de Comando | `--datadir=dir_name` |
  | :--- | :--- |
  | Tipo | Nome do Diretório |

  O caminho para o diretório que **mysql_ssl_rsa_setup** deve verificar em busca de arquivos SSL e RSA padrão e no qual deve criar arquivos se estiverem ausentes. O padrão é o data directory compilado internamente.

* `--suffix=str`

  | Formato da Linha de Comando | `--suffix=str` |
  | :--- | :--- |
  | Tipo | String |

  O sufixo para o atributo Common Name em certificados X.509. O valor do sufixo é limitado a 17 caracteres. O padrão é baseado no número da versão do MySQL.

* `--uid=name`

  | Formato da Linha de Comando | `--uid=name` |
  | :--- | :--- |

  O nome do usuário que deve ser o proprietário de quaisquer arquivos criados. O valor é um nome de usuário, não um User ID (ID de usuário) numérico. Na ausência desta opção, os arquivos criados por **mysql_ssl_rsa_setup** pertencem ao usuário que o executa. Esta opção é válida apenas se você executar o programa como `root` em um sistema que suporte a chamada de sistema `chown()`.

* `--verbose`, `-v`

  | Formato da Linha de Comando | `--verbose` |
  | :--- | :--- |

  Modo Verbose (detalhado). Produz mais output sobre o que o programa faz. Por exemplo, o programa mostra os comandos **openssl** que executa e produz output para indicar se ignora a criação de arquivos SSL ou RSA porque algum arquivo padrão já existe.

* `--version`, `-V`

  | Formato da Linha de Comando | `--version` |
  | :--- | :--- |

  Exibe informações de versão e sai.