#### 2.1.4.2 Verificação de assinatura usando o GnuPG

Outro método para verificar a integridade e autenticidade de um pacote é o uso de assinaturas criptográficas. Isso é mais confiável do que usar verificações de checksum MD5, mas exige mais trabalho.

Assinamos os pacotes baixáveis do MySQL com **GnuPG** (GNU Privacy Guard). **GnuPG** é uma alternativa de código aberto ao conhecido Pretty Good Privacy (**PGP**) de Phil Zimmermann. A maioria das distribuições Linux vem com **GnuPG** instalado por padrão. Caso contrário, consulte <http://www.gnupg.org/> para obter mais informações sobre **GnuPG** e como obtê-lo e instalá-lo.

Para verificar a assinatura de um pacote específico, você primeiro precisa obter uma cópia da nossa chave de compilação pública GPG, que você pode baixar em <http://pgp.mit.edu/>. A chave que você deseja obter é chamada `mysql-build@oss.oracle.com`. O keyID para pacotes do MySQL 5.7.37 e superiores é `3A79BD29`. Após obter essa chave, você deve compará-la com a chave mostrada abaixo, antes de usá-la para verificar os pacotes do MySQL. Alternativamente, você pode copiar e colar a chave diretamente do texto abaixo.

Nota

A chave de compilação pública GPG a seguir é para pacotes do MySQL 5.7.37 e versões superiores. Para a chave de compilação pública GPG para pacotes de versões anteriores do MySQL (keyID `5072E1F5`), consulte a Seção 2.1.4.5, “Chave de Compilação Pública GPG para Pacotes Arquivados”.

```sql
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: SKS 1.1.6
Comment: Hostname: pgp.mit.edu

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
sTSKHe+QnnnoFmu4gnmDU31i
=Xqbo
-----END PGP PUBLIC KEY BLOCK-----
```

Para importar a chave de construção no seu conjunto de chaves GPG público pessoal, use **gpg --import**. Por exemplo, se você salvou a chave em um arquivo chamado `mysql_pubkey.asc`, o comando de importação é o seguinte:

```sql
$> gpg --import mysql_pubkey.asc
gpg: key 3A79BD29: public key "MySQL Release Engineering
<mysql-build@oss.oracle.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg: no ultimately trusted keys found
```

Você também pode baixar a chave do servidor de chaves públicas usando o ID da chave pública, `3A79BD29`:

```sql
$> gpg --recv-keys 3A79BD29
gpg: requesting key 3A79BD29 from hkp server keys.gnupg.net
gpg: key 3A79BD29: "MySQL Release Engineering <mysql-build@oss.oracle.com>"
1 new user ID
gpg: key 3A79BD29: "MySQL Release Engineering <mysql-build@oss.oracle.com>"
53 new signatures
gpg: no ultimately trusted keys found
gpg: Total number processed: 1
gpg:           new user IDs: 1
gpg:         new signatures: 53
```

Se você quiser importar a chave na configuração RPM para validar os pacotes de instalação do RPM, você deve ser capaz de importar a chave diretamente:

```sql
$> rpm --import mysql_pubkey.asc
```

Se você tiver problemas ou precisar de informações específicas sobre o RPM, consulte a Seção 2.1.4.4, “Verificação de assinatura usando RPM”.

Depois de baixar e importar a chave de compilação pública, baixe o pacote MySQL desejado e a assinatura correspondente, que também está disponível na página de download. O arquivo de assinatura tem o mesmo nome do arquivo de distribuição com a extensão `.asc`, conforme mostrado nos exemplos da tabela a seguir.

**Tabela 2.1 Arquivos de pacote e assinatura do MySQL para arquivos de origem**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Tipo de arquivo</th> <th>Nome do arquivo</th> </tr></thead><tbody><tr> <td>Arquivo de distribuição</td> <td>[[<code>mysql-standard-5.7.44-linux-i686.tar.gz</code>]]</td> </tr><tr> <td>Arquivo de assinatura</td> <td>[[<code>mysql-standard-5.7.44-linux-i686.tar.gz.asc</code>]]</td> </tr></tbody></table>

Certifique-se de que ambos os arquivos estejam armazenados no mesmo diretório e, em seguida, execute o seguinte comando para verificar a assinatura do arquivo de distribuição:

```sql
$> gpg --verify package_name.asc
```

Se o pacote baixado for válido, você deve ver uma mensagem de `Boa assinatura`, semelhante à seguinte:

```sql
$> gpg --verify mysql-standard-5.7.44-linux-i686.tar.gz.asc
gpg: Signature made Tue 01 Feb 2011 02:38:30 AM CST using DSA key ID 3A79BD29
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
```

A mensagem "Boa assinatura" indica que a assinatura do arquivo é válida, quando comparada à assinatura listada em nosso site. Mas você também pode ver avisos, como este:

```sql
$> gpg --verify mysql-standard-5.7.44-linux-i686.tar.gz.asc
gpg: Signature made Wed 23 Jan 2013 02:25:45 AM PST using DSA key ID 3A79BD29
gpg: checking the trustdb
gpg: no ultimately trusted keys found
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: A4A9 4068 76FC BD3C 4567  70C8 8C71 8D3B 5072 E1F5
```

Isso é normal, pois depende da configuração e da configuração do seu sistema. Aqui estão as explicações para esses avisos:

- *gpg: não foram encontradas chaves de confiança final*: Isso significa que a chave específica não é "finalmente confiável" por você ou sua rede de confiança, o que está tudo bem para fins de verificação de assinaturas de arquivos.

- *AVISO: Esta chave não está certificada com uma assinatura confiável! Não há indicação de que a assinatura pertence ao proprietário.*: Isso se refere ao seu nível de confiança na sua crença de que você possui nossa chave pública real. Esta é uma decisão pessoal. Idealmente, um desenvolvedor do MySQL entregaria a chave pessoalmente, mas mais comumente, você a baixou. A transferência foi adulterada? Provavelmente não, mas esta decisão cabe a você. Configurar uma rede de confiança é um método para confiar neles.

Consulte a documentação do GPG para obter mais informações sobre como trabalhar com chaves públicas.
