#### 2.1.4.4 Verificação de assinatura usando RPM

Para pacotes RPM, não há uma assinatura separada. Os pacotes RPM têm uma assinatura GPG integrada e um checksum MD5. Você pode verificar um pacote executando o seguinte comando:

```sql
$> rpm --checksig package_name.rpm
```

Exemplo:

```sql
$> rpm --checksig mysql-community-server-5.7.44-1.el8.x86_64.rpm
MySQL-server-5.7.44-1.el8.x86_64.rpm: digests signatures OK
```

Nota

Se você estiver usando o RPM 4.1 e ele reclamar sobre `(GPG) NOT OK (MISSING KEYS: GPG#3a79bd29)`, mesmo que você tenha importado a chave de construção pública do MySQL no seu próprio conjunto de chaves GPG, você precisa importar a chave no conjunto de chaves RPM primeiro. O RPM 4.1 não usa mais seu conjunto de chaves GPG pessoal (ou o GPG em si). Em vez disso, o RPM mantém um conjunto de chaves separado porque é um aplicativo de nível de sistema e o conjunto de chaves públicas do GPG de um usuário é um arquivo específico do usuário. Para importar a chave pública do MySQL no conjunto de chaves RPM, obtenha a chave primeiro, em seguida, use **rpm --import** para importar a chave. Por exemplo:

```sql
$> gpg --export -a 3a79bd29 > 3a79bd29.asc
$> rpm --import 3a79bd29.asc
```

Alternativamente, o **rpm** também suporta o carregamento da chave diretamente de um URL:

```sql
$> rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

Você também pode obter a chave pública do MySQL a partir desta página do manual: Seção 2.1.4.2, “Verificação de assinatura usando GnuPG”.
